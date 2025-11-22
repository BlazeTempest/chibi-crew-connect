-- Function to handle new project creation
CREATE OR REPLACE FUNCTION public.handle_new_project()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_team_id uuid;
BEGIN
  -- Create a team for the project
  INSERT INTO public.teams (name, owner_id, description)
  VALUES (NEW.name || ' Team', NEW.owner_id, 'Team for project: ' || NEW.name)
  RETURNING id INTO new_team_id;
  
  -- Update the project with the team_id
  UPDATE public.projects
  SET team_id = new_team_id
  WHERE id = NEW.id;
  
  -- Add the project creator as a team member
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (new_team_id, NEW.owner_id, 'owner');
  
  RETURN NEW;
END;
$$;

-- Trigger to automatically set up team when project is created
CREATE TRIGGER on_project_created
  AFTER INSERT ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_project();