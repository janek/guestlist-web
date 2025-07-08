-- Atomic RPC: delete_link()
-- Deletes a link (and its descendants) and either removes or re-parents
-- their guests. Restores the reserved quotas to the direct parent so
-- capacity accounting stays correct with the subtract-on-split model.
--
--   mode = 'delete_guests' → hard-deletes guests belonging to the subtree
--   mode = 'pull_up'       → reassigns all guests to the direct parent link
--
-- Preconditions:
--   • p_mode ∈ ('delete_guests', 'pull_up')
--   • Root links (parent_link_id IS NULL) cannot be deleted via this RPC.
--
-- Returns: void

create or replace function delete_link(
  p_link_id uuid,
  p_mode    text
) returns void
language plpgsql
as $$
declare
  root_rec links;                -- the link to be removed
  parent_rec links;              -- its parent (to receive quota / guests)
  total_free  int := 0;
  total_half  int := 0;
  total_skip  int := 0;
begin
  --------------------------------------------------------------------
  -- 1. Validate mode
  --------------------------------------------------------------------
  if p_mode not in ('delete_guests', 'pull_up') then
    raise exception 'delete_link: p_mode must be delete_guests or pull_up';
  end if;

  --------------------------------------------------------------------
  -- 2. Lock & fetch the link + parent
  --------------------------------------------------------------------
  select * into root_rec
    from links
   where id = p_link_id
   for update;   -- lock the subtree root

  if not found then
    raise exception 'delete_link: link % not found', p_link_id;
  end if;

  if root_rec.parent_link_id is null then
    raise exception 'delete_link: cannot delete top-level link %', p_link_id;
  end if;

  -- Lock the parent row because we will update its quota (and maybe guests)
  select * into parent_rec
    from links
   where id = root_rec.parent_link_id
   for update;

  --------------------------------------------------------------------
  -- 3. Collect the entire subtree and sum limits
  --------------------------------------------------------------------
  with recursive subtree as (
    select id, limit_free, limit_half, limit_skip
      from links
     where id = p_link_id
    union all
    select l.id, l.limit_free, l.limit_half, l.limit_skip
      from links l
      join subtree s on l.parent_link_id = s.id
  )
  select coalesce(sum(limit_free), 0),
         coalesce(sum(limit_half), 0),
         coalesce(sum(limit_skip), 0)
    into total_free, total_half, total_skip
    from subtree;

  --------------------------------------------------------------------
  -- 4. Guest handling
  --------------------------------------------------------------------
  if p_mode = 'pull_up' then
    -- Move guests to the parent link (keeps used quota consumed)
    update guests
       set link_id = parent_rec.id
     where link_id in (
       select id from (
         with recursive subtree as (
           select id from links where id = p_link_id
           union all
           select l.id from links l join subtree s on l.parent_link_id = s.id
         ) select id from subtree
       ) t
     );
  else
    -- Hard-delete guest records in the subtree
    delete from guests
     where link_id in (
       select id from (
         with recursive subtree as (
           select id from links where id = p_link_id
           union all
           select l.id from links l join subtree s on l.parent_link_id = s.id
         ) select id from subtree
       ) t
     );
  end if;

  --------------------------------------------------------------------
  -- 5. Delete the links in the subtree
  --------------------------------------------------------------------
  delete from links
   where id in (
     select id from (
       with recursive subtree as (
         select id from links where id = p_link_id
         union all
         select l.id from links l join subtree s on l.parent_link_id = s.id
       ) select id from subtree
     ) t
   );

  --------------------------------------------------------------------
  -- 6. Restore quota to the direct parent
  --------------------------------------------------------------------
  update links
     set limit_free = limit_free + total_free,
         limit_half = limit_half + total_half,
         limit_skip = limit_skip + total_skip
   where id = parent_rec.id;

  return;
end;
$$; 