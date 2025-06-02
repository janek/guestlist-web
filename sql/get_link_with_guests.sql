-- Single-query function to get link details with guests and counts
-- This replaces 3 separate queries with 1 optimized database call

CREATE OR REPLACE FUNCTION get_link_with_guests(link_slug TEXT)
RETURNS TABLE (
  -- Link details
  id UUID,
  slug TEXT,
  organisation TEXT,
  limit_free INTEGER,
  limit_half INTEGER,
  limit_skip INTEGER,
  event_name TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  event_id UUID,
  
  -- Guest data
  guests JSON,
  
  -- Guest counts
  used_free INTEGER,
  used_half INTEGER,
  used_skip INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.slug,
    l.organisation,
    l.limit_free,
    l.limit_half,
    l.limit_skip,
    l.event_name,
    l.event_date,
    l.event_id,
    
    -- Aggregate guests as JSON array
    COALESCE(
      (SELECT json_agg(
        json_build_object(
          'id', g.id,
          'name', g.name,
          'type', g.type,
          'used', g.used,
          'created_at', g.created_at,
          'organisation', g.organisation
        ) ORDER BY g.created_at ASC
      )
      FROM guests g 
      WHERE g.link_id = l.id), 
      '[]'::json
    ) as guests,
    
    -- Count guests by type
    COALESCE((SELECT COUNT(*) FROM guests g WHERE g.link_id = l.id AND g.type = 'free'), 0)::INTEGER as used_free,
    COALESCE((SELECT COUNT(*) FROM guests g WHERE g.link_id = l.id AND g.type = 'half'), 0)::INTEGER as used_half,
    COALESCE((SELECT COUNT(*) FROM guests g WHERE g.link_id = l.id AND g.type = 'skip'), 0)::INTEGER as used_skip
    
  FROM links_with_event_details l
  WHERE l.slug = link_slug;
END;
$$; 