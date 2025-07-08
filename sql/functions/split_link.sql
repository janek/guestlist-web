-- Atomic RPC: split_link()
-- Creates a child invitation link from an existing parent link while
-- atomically reserving the requested quota by decrementing the parent's
-- limits. Prevents race-conditions via row-level locking.
--
-- Usage example:
--   select * from split_link('parent-uuid', 'DJ Booth', 3, 0, 0);
--
-- Prerequisites:
--   • Table `links` has columns: id (uuid), slug (text), organisation (text),
--     event_id (uuid), parent_link_id (uuid), depth (int),
--     limit_free / limit_half / limit_skip (int)
--   • Helper function `generate_unique_slug()` returns a text slug that is
--     unique in the links table.
--   • Depth column has CHECK (depth BETWEEN 0 AND 5).

create or replace function split_link(
  p_parent_id uuid,
  p_org       text,
  p_free      int,
  p_half      int,
  p_skip      int
) returns links
language plpgsql
as $$
declare
  parent_rec links;     -- locked parent row
  child_rec  links;     -- row to return
begin
  --------------------------------------------------------------------
  -- 1. Lock & fetch the parent
  --------------------------------------------------------------------
  select * into parent_rec
    from links
   where id = p_parent_id
   for update;      -- serialise concurrent splits

  if not found then
    raise exception 'split_link: parent link % not found', p_parent_id;
  end if;

  --------------------------------------------------------------------
  -- 2. Business invariants
  --------------------------------------------------------------------
  if parent_rec.depth >= 5 then
    raise exception 'split_link: maximum depth (5) reached';
  end if;

  if p_free < 0 or p_half < 0 or p_skip < 0 then
    raise exception 'split_link: negative quotas are not allowed';
  end if;

  if (p_free + p_half + p_skip) < 2 then
    raise exception 'split_link: at least 2 total slots required';
  end if;

  if p_free  > parent_rec.limit_free or
     p_half  > parent_rec.limit_half or
     p_skip  > parent_rec.limit_skip then
    raise exception 'split_link: requested quota exceeds parent''s remaining capacity';
  end if;

  --------------------------------------------------------------------
  -- 3. Insert child row
  --------------------------------------------------------------------
  insert into links (
    slug, organisation, event_id,
    parent_link_id, depth,
    limit_free, limit_half, limit_skip
  ) values (
    generate_unique_slug(),
    p_org,
    parent_rec.event_id,
    parent_rec.id,
    parent_rec.depth + 1,
    p_free, p_half, p_skip
  ) returning * into child_rec;

  --------------------------------------------------------------------
  -- 4. Reserve quota on the parent by subtracting limits
  --------------------------------------------------------------------
  update links
     set limit_free = limit_free - p_free,
         limit_half = limit_half - p_half,
         limit_skip = limit_skip - p_skip
   where id = parent_rec.id;

  --------------------------------------------------------------------
  -- 5. Return the full child row to caller
  --------------------------------------------------------------------
  return child_rec;
end;
$$; 