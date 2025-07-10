-- Debug version of delete_link() with logging
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
  raise notice 'DEBUG: Starting delete_link for link_id=%, mode=%', p_link_id, p_mode;
  
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

  raise notice 'DEBUG: Root link found - limit_free=%, limit_half=%, limit_skip=%, parent_link_id=%', 
    root_rec.limit_free, root_rec.limit_half, root_rec.limit_skip, root_rec.parent_link_id;

  -- Capture parent if any (for quota restoration / guest pull-up)
  if root_rec.parent_link_id is not null then
    select * into parent_rec
      from links
     where id = root_rec.parent_link_id
     for update;
     
    raise notice 'DEBUG: Parent link found - id=%, limit_free=%, limit_half=%, limit_skip=%', 
      parent_rec.id, parent_rec.limit_free, parent_rec.limit_half, parent_rec.limit_skip;
  else
    raise notice 'DEBUG: No parent link found';
  end if;

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

  raise notice 'DEBUG: Subtree totals - total_free=%, total_half=%, total_skip=%', 
    total_free, total_half, total_skip;

  --------------------------------------------------------------------
  -- 4. Guest handling
  --------------------------------------------------------------------
  if p_mode = 'pull_up' and parent_rec is not null then
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

  raise notice 'DEBUG: Links deleted';

  --------------------------------------------------------------------
  -- 6. Restore quota to the direct parent
  --------------------------------------------------------------------
  if parent_rec is not null then
    raise notice 'DEBUG: Restoring quota to parent - adding total_free=%, total_half=%, total_skip=%', 
      total_free, total_half, total_skip;
    
    update links
       set limit_free = limit_free + total_free,
           limit_half = limit_half + total_half,
           limit_skip = limit_skip + total_skip
     where id = parent_rec.id;
     
    raise notice 'DEBUG: Quota restoration update executed';
  else
    raise notice 'DEBUG: No parent to restore quota to';
  end if;

  raise notice 'DEBUG: delete_link completed';
  return;
end;
$$;