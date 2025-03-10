-- Drop existing tables
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.founder_profiles CASCADE;
DROP TABLE IF EXISTS public.job_profiles CASCADE;
DROP TABLE IF EXISTS public.matching_preferences CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;

-- Create profiles table with the correct schema
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  bio TEXT,
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  major TEXT,
  year TEXT,
  skills TEXT[],
  linkedin_url TEXT,
  twitter_url TEXT
);

-- Create events table with the correct schema
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  category TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  images TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  university TEXT NOT NULL
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_looking_cofounder BOOLEAN DEFAULT FALSE,
  founder_looking_talent BOOLEAN DEFAULT FALSE,
  looking_job BOOLEAN DEFAULT FALSE,
  looking_resources BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create founder_profiles table
CREATE TABLE public.founder_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  founder_type TEXT, -- 'co-founder', 'hiring', 'both'
  startup_name TEXT,
  startup_idea TEXT,
  roles_looking_for TEXT,
  founder_skills TEXT,
  startup_stage TEXT, -- 'idea', 'mvp', 'launched', 'scaling'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_profiles table
CREATE TABLE public.job_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interested_roles TEXT,
  experience TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matching_preferences table
CREATE TABLE public.matching_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  industries TEXT,
  commitment_type TEXT, -- 'short-term', 'long-term', 'both'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create connections table
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  stage TEXT, -- 'idea', 'mvp', 'launched', 'scaling'
  looking_for TEXT[],
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create RLS policies for security
-- Profiles: users can read all profiles but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Apply similar RLS policies to other tables
-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Users can insert their own events" 
ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" 
ON public.events FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" 
ON public.events FOR DELETE USING (auth.uid() = created_by);

-- User Roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User roles are viewable by everyone" 
ON public.user_roles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own roles" 
ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roles" 
ON public.user_roles FOR UPDATE USING (auth.uid() = user_id);

-- Founder Profiles
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founder profiles are viewable by everyone" 
ON public.founder_profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own founder profile" 
ON public.founder_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own founder profile" 
ON public.founder_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Job Profiles
ALTER TABLE public.job_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Job profiles are viewable by everyone" 
ON public.job_profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own job profile" 
ON public.job_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job profile" 
ON public.job_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Matching Preferences
ALTER TABLE public.matching_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matching preferences are viewable by everyone" 
ON public.matching_preferences FOR SELECT USING (true);

CREATE POLICY "Users can insert their own matching preferences" 
ON public.matching_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own matching preferences" 
ON public.matching_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Connections
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connections are viewable by involved users" 
ON public.connections FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert connections they request" 
ON public.connections FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're involved in" 
ON public.connections FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are viewable by involved users" 
ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert messages they send" 
ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they're involved in" 
ON public.messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" 
ON public.projects FOR SELECT USING (true);

CREATE POLICY "Users can insert their own projects" 
ON public.projects FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects FOR DELETE USING (auth.uid() = creator_id);

-- Project Members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project members are viewable by everyone" 
ON public.project_members FOR SELECT USING (true);

CREATE POLICY "Project creators can insert members" 
ON public.project_members FOR INSERT WITH CHECK (
  auth.uid() IN (
    SELECT creator_id FROM public.projects WHERE id = project_id
  )
);

CREATE POLICY "Project creators can update members" 
ON public.project_members FOR UPDATE USING (
  auth.uid() IN (
    SELECT creator_id FROM public.projects WHERE id = project_id
  )
);

CREATE POLICY "Project creators can delete members" 
ON public.project_members FOR DELETE USING (
  auth.uid() IN (
    SELECT creator_id FROM public.projects WHERE id = project_id
  )
); 