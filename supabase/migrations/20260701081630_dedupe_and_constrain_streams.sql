
-- Remove duplicate (match_id, server_name) rows, keeping the newest one
DELETE FROM streams
WHERE id NOT IN (
  SELECT DISTINCT ON (match_id, server_name) id
  FROM streams
  ORDER BY match_id, server_name, created_at DESC
);

-- Now add the unique constraint
ALTER TABLE streams ADD CONSTRAINT streams_match_server_unique UNIQUE (match_id, server_name);
