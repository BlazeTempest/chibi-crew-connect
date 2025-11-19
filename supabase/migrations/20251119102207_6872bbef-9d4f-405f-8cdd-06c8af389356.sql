-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rated_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(rated_user_id, rater_id, project_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for teams
CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Team owners can update their teams"
  ON public.teams FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Team owners can delete their teams"
  ON public.teams FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for team_members
CREATE POLICY "Team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Team owners can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Team owners and members can leave"
  ON public.team_members FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND owner_id = auth.uid()
    )
  );

-- RLS Policies for projects
CREATE POLICY "Projects are viewable by team members and owners"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = owner_id OR
    team_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = projects.team_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete their projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for tasks
CREATE POLICY "Tasks are viewable by project members"
  ON public.tasks FOR SELECT
  USING (
    auth.uid() = created_by OR
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM public.projects p
      LEFT JOIN public.team_members tm ON p.team_id = tm.team_id
      WHERE p.id = tasks.project_id
      AND (p.owner_id = auth.uid() OR tm.user_id = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can create tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Task creators and project owners can update tasks"
  ON public.tasks FOR UPDATE
  USING (
    auth.uid() = created_by OR
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = tasks.project_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Task creators and project owners can delete tasks"
  ON public.tasks FOR DELETE
  USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = tasks.project_id AND owner_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Messages are viewable by team members"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = messages.team_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = messages.team_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Team members can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    (EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = messages.team_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = messages.team_id AND owner_id = auth.uid()
    ))
  );

-- RLS Policies for ratings
CREATE POLICY "Ratings are viewable by involved users"
  ON public.ratings FOR SELECT
  USING (
    auth.uid() = rated_user_id OR
    auth.uid() = rater_id OR
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can create ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = rater_id AND auth.uid() != rated_user_id);

CREATE POLICY "Users can update their own ratings"
  ON public.ratings FOR UPDATE
  USING (auth.uid() = rater_id);

CREATE POLICY "Users can delete their own ratings"
  ON public.ratings FOR DELETE
  USING (auth.uid() = rater_id);