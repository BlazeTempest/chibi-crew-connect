-- Create project_join_requests table
CREATE TABLE public.project_join_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_join_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own join requests"
ON public.project_join_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Project owners can view requests for their projects
CREATE POLICY "Project owners can view join requests"
ON public.project_join_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_join_requests.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Users can create join requests
CREATE POLICY "Users can create join requests"
ON public.project_join_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Project owners can update requests (approve/reject)
CREATE POLICY "Project owners can update join requests"
ON public.project_join_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = project_join_requests.project_id
    AND projects.owner_id = auth.uid()
  )
);

-- Users can delete their own pending requests
CREATE POLICY "Users can delete their own pending requests"
ON public.project_join_requests
FOR DELETE
USING (auth.uid() = user_id AND status = 'pending');

-- Add trigger for updated_at
CREATE TRIGGER update_project_join_requests_updated_at
BEFORE UPDATE ON public.project_join_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();