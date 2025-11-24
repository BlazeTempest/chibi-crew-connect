-- Update RLS policy to allow users to view all active projects for browsing
DROP POLICY IF EXISTS "Projects are viewable by team members and owners" ON projects;

CREATE POLICY "Users can view all projects"
ON projects
FOR SELECT
USING (true);

-- Keep the existing policies for other operations
-- (insert, update, delete policies remain unchanged)