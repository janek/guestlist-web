-- NOTE: this is not a migration file, the change was applied manually in an SQL query
-- Change: Add recursive link splitting support
-- Add parent_link_id and depth columns to links table

ALTER TABLE links
  ADD COLUMN parent_link_id UUID REFERENCES links(id),
  ADD COLUMN depth           INT  NOT NULL DEFAULT 0,
  ADD CONSTRAINT chk_link_depth CHECK (depth BETWEEN 0 AND 5);

-- Create index for efficient parent lookups
CREATE INDEX idx_links_parent ON links(parent_link_id);

-- Create index for efficient depth queries
CREATE INDEX idx_links_depth ON links(depth);

-- Add comment for documentation
COMMENT ON COLUMN links.parent_link_id IS 'Reference to parent link for recursive splitting, NULL for root links';
COMMENT ON COLUMN links.depth IS 'Depth level in link hierarchy, 0 for root links, max 5';