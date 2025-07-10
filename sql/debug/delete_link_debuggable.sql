-- Debug script for analysing why delete_link() quota restoration may fail
-- Run each SECTION manually inside the Supabase SQL editor or psql.
-- Adjust :link_id to test other rows.
-- Root candidates (commented):
--   897e82b8-931f-4965-b160-410ec64bac50
--   1fb0e696-0815-4fe5-8a44-be473ffbe2c6
\set link_id 'b9a5d741-e022-49c0-bd21-1e13fb505948'

-- SECTION 1 ────────────────────────────────────────────────────────────────
-- Inspect the row we plan to delete and lock it.
select *
  from links
 where id = :'b9a5d741-e022-49c0-bd21-1e13fb505948'
 for update;

-- SECTION 2 ────────────────────────────────────────────────────────────────
-- Inspect the parent row (if any) and lock it so we mimic the behaviour
-- inside delete_link().
select *
  from links
 where id = (select parent_link_id from links where id = 'b9a5d741-e022-49c0-bd21-1e13fb505948')
   for update;

-- SECTION 3 ────────────────────────────────────────────────────────────────
-- Traverse the subtree and inspect totals that the function would restore.
with recursive subtree as (
  select id, limit_free, limit_half, limit_skip
    from links where id = 'b9a5d741-e022-49c0-bd21-1e13fb505948'
  union all
  select l.id, l.limit_free, l.limit_half, l.limit_skip
    from links l
    join subtree s on l.parent_link_id = s.id
)
select * from subtree;       -- <- view individual members

-- Totals only
with recursive subtree as (
  select id, limit_free, limit_half, limit_skip
    from links where id = 'b9a5d741-e022-49c0-bd21-1e13fb505948'
  union all
  select l.id, l.limit_free, l.limit_half, l.limit_skip
    from links l join subtree s on l.parent_link_id = s.id
)
select sum(limit_free)  as tot_free,
       sum(limit_half)  as tot_half,
       sum(limit_skip)  as tot_skip
  from subtree;

-- SECTION 4 ────────────────────────────────────────────────────────────────
-- Examine guest rows that belong to the subtree (pre-delete state).
with recursive subtree as (
  select id from links where id = 'b9a5d741-e022-49c0-bd21-1e13fb505948'
  union all
  select l.id from links l join subtree s on l.parent_link_id = s.id
)
select g.*
  from guests g
  join subtree s on g.link_id = s.id;

-- SECTION 5 ────────────────────────────────────────────────────────────────
-- Perform quota-restore UPDATE *exactly* as in delete_link().
-- Replace the literal totals with the output from SECTION 3.
-- 👇 Insert numbers seen above before running.
\set tot_free  3
\set tot_half  2
\set tot_skip  1

update links
   set limit_free = limit_free + 3,
       limit_half = limit_half + 2,
       limit_skip = limit_skip + 1
 where id = (select parent_link_id from links where id = 'b9a5d741-e022-49c0-bd21-1e13fb505948');

-- Report how many rows the UPDATE touched.
-- In psql, the row-count banner tells you (e.g. "UPDATE 1"). If it says
-- "UPDATE 0" then the WHERE predicate or RLS blocked the change.

-- SECTION 6 ────────────────────────────────────────────────────────────────
-- Verify the parent row after the attempted restore.
select *
  from links
 where id = (select parent_link_id from links where id = 'b9a5d741-e022-49c0-bd21-1e13fb505948'); 