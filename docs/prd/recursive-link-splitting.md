# Recursive Link-Splitting (depth ≤ 5) – Product Requirements Document

## 1. Overview
Venue owners can already create a single invitation link (**Link-0**) with a quota for *free / half / skip* tickets.  
This feature lets any holder of such a link carve out part of their **remaining** quota into one or more "child" links, and so on, up to 5 levels deep:

```text
Link-0 (30/30/30)    ← owner
┣━━ Link-0-a (5/5/5) ← promoter
┃   ┗━━ Link-0-a-1 (2/0/2) ← DJ
┗━━ Link-0-b ( … )
```

Capacity accounting is enforced at every level, so the sum of child limits is never allowed to exceed the parent's unconsumed quota. Guests added to any descendant count against the entire ancestor chain.

## 2. Goals
1. **Delegation** – let intermediate stakeholders redistribute quotas without owner involvement.
2. **Safety** – prevent overallocation and race-condition double-splits.
3. **Transparency** – every ancestor link shows live usage and remaining quota.
4. **Simplicity** – no extra authentication hurdles beyond holding the slug.

## 3. Non-Goals
• Unlimited recursion (> 5).  
• Per-link CSV exports (global export stays on admin dashboard).  
• Complex permission management.

## 4. User Stories
| ID | As a …   | I want …                                                         | So that …                                      |
|----|----------|------------------------------------------------------------------|------------------------------------------------|
| U1 | promoter | to split part of my link into a new one                          | I can give DJs their own quota                 |
| U2 | promoter | to name the new link (organisation field)                        | the recipient recognises it                    |
| U3 | promoter | to see how many slots I still have left after splitting          | I don't overshoot                              |
| U4 | owner    | to monitor total usage across the whole tree                     | capacity is never exceeded                     |
| U5 | promoter | to delete one of my child links and choose whether to keep guests| I can correct mistakes                         |
| U6 | user     | to be blocked from splitting if < 2 combined slots remain        | single-slot edge case                          |

## 5. Functional Requirements
1. **Split dialog** appears on every link page if `remaining_total ≥ 2` and `depth < 5`.  
   • Inputs: limits to allocate (free, half, skip) and organisation string.  
2. **Backend** validates in a single atomic operation:  
   a. locks parent row `FOR UPDATE`,  
   b. checks remaining quota,  
   c. inserts child row with `parent_link_id`,  
   d. returns new slug.  
3. **Deleting a link** cascades:  
   • *Delete guests* – hard-delete guests of that link & descendants, limits flow back up.  
   • *Pull up guests* – re-assign guests to `parent_link_id`, limits flow back up.  
4. **Remaining quota** for any link = `limit_* − used_* − Σ(children.limit_*)`.  
5. All dashboards (owner & link page) show live counts using a recursive SQL view.

## 6. Data Model Changes
```sql
ALTER TABLE links
  ADD COLUMN parent_link_id UUID REFERENCES links(id),
  ADD COLUMN depth           INT  NOT NULL DEFAULT 0,
  ADD CONSTRAINT chk_link_depth CHECK (depth BETWEEN 0 AND 5);

CREATE INDEX idx_links_parent ON links(parent_link_id);
```
**RLS (future-proof):** no change yet – public read/write remains until RLS milestone; the parent pointer is safe under current permissive policy.

## 7. Supabase SQL / RPC
| Function | Purpose |
|----------|---------|
| `split_link(parent_id UUID, org TEXT, free INT, half INT, skip INT)` → `links` | Atomic split with row lock and validation |
| `delete_link(link_id UUID, mode TEXT)` | `mode ∈ ('delete_guests', 'pull_up')` |
| `get_link_with_guests` | Extend to return `remaining_*` and `depth` |
| `get_dashboard` | Wrap existing query in a recursive CTE to aggregate descendants |

All mutating RPCs run in PL/pgSQL with explicit exception handling.

## 8. Frontend Changes
### Link Page (`src/app/[slug]/page.tsx`)
* Add **Split link** button beside current stats.  
* Show modal with three number inputs (min 0) & organisation text field.  
* On submit: POST to `/api/split-link` → RPC → redirect to new slug & toast success.  
* Disable button when `remainingTotal < 2` or `depth === 5`.

### Admin Dashboard (`src/app/page.tsx`)
No visible change; underlying data already includes all guests & links. Counts come from updated `get_dashboard`.

### Delete Link Flow
Extend `LinksTable` row menu with "Delete" → modal asking for *delete guests* vs *pull up*. Use optimistic updates like current guest addition.

## 9. Performance & Concurrency
| Risk                                | Mitigation                                                                                |
|-------------------------------------|-------------------------------------------------------------------------------------------|
| Over-splitting race                 | `split_link` locks parent row `FOR UPDATE` so callers serialize                           |
| Recursive aggregation heavy         | Depth capped (≤ 5); recursive view is O(n) where n = links (usually < few hundred)        |
| Dashboard slow with many guests     | Keep guest JSON aggregation as today; consider pagination if guest rows > 5 k             |
| Link counts recomputed on each view | Optionally cache in a materialized view refreshed every 5 s; skip until profiler flags it |

## 10. Roll-out Plan
1. Write migration SQL & regenerate `database.types.ts`.  
2. Implement RPCs + unit tests with **bun** (in-memory pg).  
3. Update shared types (`Link` gains `parent_link_id`, `depth`, `remaining_*`).  
4. Build frontend components (SplitDialog, DeleteLinkModal) with optimistic updates.  
5. Cypress E2E: split chain depth=5; delete middle node in both modes.  
6. Prod deploy behind feature flag `NEXT_PUBLIC_ENABLE_SPLIT`.  
7. Monitor Supabase timings; enable materialized view if avg > 100 ms.

## 11. Open Questions / Future Work
• UI representation of the tree (breadcrumbs? collapsible list?).  
• Owner-only "lock link" toggle to prevent further splits.  
• Per-organisation analytics once RLS is in place.

---
Generated with AI on 07.07.25. Not guaranteed to be reviewed 