-- Update RLS policy to allow all users to view ratings
DROP POLICY IF EXISTS "Ratings are viewable by involved users" ON ratings;

CREATE POLICY "Ratings are viewable by everyone"
ON ratings
FOR SELECT
USING (true);

-- Keep existing policies for creating, updating, and deleting ratings
-- (Users can only create ratings for others, and manage their own ratings)