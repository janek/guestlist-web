# Recursive Link-Splitting – Product Requirements Document

## 1. Overview

**Feature Name:** Recursive Links (Link Splitting)

**Objective:** Enable link recipients to subdivide their allocated guest slots into new links for redistribution

**Example Use Case:** _Venue owner → Promoter → DJs_ guestlist spots delegation chain (e.g., 30/30/30 → 3×5/5/5) 

**More info:**
Venue owners can already create invitations link with a quota for *free / half / skip* tickets.

This feature would let any holder of any such link carve out part of their **remaining** quota into one or more "child" links, and so on, up to 5 levels deep:

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

### 2b. Non-Goals
• Unlimited recursion (> 5).  
• Per-link CSV exports (global export stays on admin dashboard).  
• Complex permission management.

## 3. User Stories
| ID | As a …   | I want …                                                         | So that …                                      |
|----|----------|------------------------------------------------------------------|------------------------------------------------|
| U1 | promoter | to split part of my link into a new one                          | I can give DJs their own quota                 |
| U2 | promoter | to name the new link (organisation field)                        | the recipient recognises it                    |
| U3 | promoter | to see how many slots I still have left after splitting          | I don't overshoot                              |
| U4 | owner    | to monitor total usage across the whole tree                     | capacity is never exceeded                     |
| U5 | promoter | to delete one of my child links and choose whether to keep guests| I can correct mistakes                         |
| U6 | user     | to be blocked from splitting if < 2 combined slots remain        | single-slot edge case                          |

## 4. Functional Requirements
1. **Split link button** appears on every link page if `remaining_total ≥ 2` and `depth < 5` and opens a dialog similar to the one used to create main links in the first place.   
   • Inputs: limits to allocate (free, half, skip) and "for whom" string.  
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

## 5. Current Architecture


- **Links Table:** Stores invitation links with `limit_free`, `limit_half`, `limit_skip` quotas
- **Guests Table:** Tracks individual registrations linked to specific links via `link_id`
- **Access Control:** Owner-based event filtering with RLS policies (/ RLS soon to be implemented)
- **Real-time Updates:** Supabase subscriptions for live guest count tracking


## 6. Database changes

### Option 1 (by o3)
**Schema changes**
```sql
ALTER TABLE links
  ADD COLUMN parent_link_id UUID REFERENCES links(id),
  ADD COLUMN depth           INT  NOT NULL DEFAULT 0,
  ADD CONSTRAINT chk_link_depth CHECK (depth BETWEEN 0 AND 5);

CREATE INDEX idx_links_parent ON links(parent_link_id);
```
**RLS (future-proof):** no change yet – public read/write remains until RLS milestone; the parent pointer is safe under current permissive policy.


**Database functions**
| Function | Purpose |
|----------|---------|
| `split_link(parent_id UUID, org TEXT, free INT, half INT, skip INT)` → `links` | Atomic split with row lock and validation |
| `delete_link(link_id UUID, mode TEXT)` | `mode ∈ ('delete_guests', 'pull_up')` |
| `get_link_with_guests` | Extend to return `remaining_*` and `depth` |
| `get_dashboard` | Wrap existing query in a recursive CTE to aggregate descendants |

All mutating RPCs run in PL/pgSQL with explicit exception handling.

### Option 2 (by Sonnet 4)
**Schema changes**

```sql
-- Add parent_id to links table for hierarchy
ALTER TABLE links ADD COLUMN parent_id UUID REFERENCES links(id);

-- Add reserved quota fields to track allocated-but-unused slots
ALTER TABLE links ADD COLUMN reserved_free INTEGER DEFAULT 0;
ALTER TABLE links ADD COLUMN reserved_half INTEGER DEFAULT 0;
ALTER TABLE links ADD COLUMN reserved_skip INTEGER DEFAULT 0;

-- Add splitting permissions (for future use)
ALTER TABLE links ADD COLUMN can_split BOOLEAN DEFAULT true;

-- Add hierarchy depth tracking
ALTER TABLE links ADD COLUMN depth INTEGER DEFAULT 0;

```

**Database functions**

- `get_link_hierarchy(link_id)` - Return full parent/child tree
- `get_available_slots(link_id)` - Calculate available slots (limit - used - reserved)
- `split_link(parent_id, child_limits, organization)` - Atomic link splitting
- `delete_link_cascade(link_id)` - Handle quota return on deletion

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

## 12. Additional semi-random notes

### 1.1 Link Splitting Interface

**User Story:** As a link recipient, I want to split my allocated slots into new links so I can distribute them to others.

**Requirements:**

- **Split Button:** Accessible from the guest registration page (`/[slug]`) in the action area consistent with existing UI patterns
- **Quota Selection:** Choose how many slots to transfer (free/half/skip)
- **Validation:** Cannot exceed available unused slots
- **Organization Field:** Set name for the new sub-link recipient

### 1.3 Quota Management

**User Story:** As a system, I need to maintain quota integrity across link hierarchies.

**Requirements:**

- **Reserved Slots:** When child links are created, reduce parent's available slots
- **Cascade Updates:** If child link is deleted, return slots to parent
- **Atomic Operations:** Prevent race conditions in quota allocation

### 3.1 Splitting Permissions

- **Default:** All links are splittable by default (`can_split = true`)
- **Future Enhancement:** Admin control to disable splitting for specific links
- **Inheritance:** Child links inherit parent's splitting permission

### 3.3 Ownership and Access

- **Event Ownership:** Sub-links always belong to the same event as their parent
- **Public Access:** All links (including sub-links) are publicly accessible via their unique slug
- **Private Distribution:** Sub-links are intended for private sharing, not public discovery

### 3.4 Deletion Behavior

The user can choose when they delete their sublink:
- **Cascade:** Deleting parent deletes all children (current default)
- **Guest Preservation:** Guest records bubble up and are linked to original link

---
Generated 2 versions with o3 and Sonnet on 07.07.25. Janek merged and reviewed around half of it.