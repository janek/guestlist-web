# ADR-001: Single RPC Call for Dashboard Data

**Date:** 2024-12-19  
**Status:** Accepted  
**Deciders:** Development team  

## Context

The main dashboard page (`/`) was making 5+ sequential database queries:
1. User authentication check
2. Events list (for switcher)
3. Single event details
4. All guests for event
5. All links for event
6. All staff

This created a "waterfall" pattern where each query waited for the previous one, resulting in high TTFB and poor perceived performance, especially with network latency or cold Lambda starts.

Similarly, the link pages (`/[slug]`) were making multiple queries to fetch link details, associated guests, and calculate usage counts.

## Decision

We consolidated the event-specific queries (3-6) into a single Postgres RPC function `get_dashboard(p_event_id)` that returns all dashboard data in one network round-trip as structured JSON.

We applied the same pattern to link pages using the existing `get_link_with_guests(link_slug)` function.

## Implementation

- **SQL:** `sql/get_dashboard.sql` - Postgres function using JSON aggregation
- **SQL:** `sql/get_link_with_guests.sql` - Existing function for link page data
- **Client:** Modified `src/app/page.tsx` to call single RPC instead of 4 separate queries
- **Client:** `src/app/[slug]/page.tsx` already uses single RPC pattern
- **Types:** Dashboard response typed as structured object with event, guests, links, staff

## Consequences

### Positive
- **Performance:** Reduced 4 sequential DB calls to 1, eliminating round-trip latency
- **Consistency:** Single transaction ensures data snapshot consistency
- **Caching:** Entire dashboard payload can be cached/revalidated as one unit
- **Security:** RLS and permissions centralized in one function

### Negative
- **Maintenance:** Schema changes require updating the RPC function
- **Over-fetching:** All dashboard data fetched even if only partial updates needed
- **Coupling:** Less flexibility for independent component data fetching
- **Debugging:** Harder to trace issues within PL/pgSQL function

### Neutral
- **Bundle size:** No significant change to client-side code
- **Real-time:** Existing Supabase realtime subscriptions still work independently

## Future Considerations

**When to reconsider:**
- Dashboard data grows significantly (>1MB JSON responses)
- Need for partial updates becomes frequent
- Team becomes uncomfortable with PL/pgSQL maintenance
- Granular caching requirements emerge

**Migration path:** Can incrementally split the RPC back into individual queries by component, starting with the heaviest/most frequently changing data.

**Alternatives considered:** GraphQL resolver, individual parallel queries, cached views. 