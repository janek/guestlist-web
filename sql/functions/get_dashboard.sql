DROP FUNCTION get_dashboard(UUID);
CREATE OR REPLACE FUNCTION get_dashboard(p_event_id UUID)
RETURNS TABLE (
  event JSON,
  guests JSON,
  links JSON,
  staff JSON
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Single row with the chosen event
    (SELECT row_to_json(e) FROM events e WHERE e.id = p_event_id) AS event,

    -- Guests for the event
    COALESCE(
      (
        SELECT json_agg(g ORDER BY g.created_at ASC)
        FROM guests g
        WHERE g.event_id = p_event_id
      ),
      '[]'::json
    ) AS guests,

    -- Links for the event
    COALESCE(
      (
        SELECT json_agg(l ORDER BY l.created_at ASC)
        FROM links l
        WHERE l.event_id = p_event_id
      ),
      '[]'::json
    ) AS links,

    -- All staff (❗ adjust filter if you later scope staff by account)
    COALESCE(
      (
        SELECT json_agg(s ORDER BY s.created_at ASC)
        FROM staff s
      ),
      '[]'::json
    ) AS staff;
END;
$$; 