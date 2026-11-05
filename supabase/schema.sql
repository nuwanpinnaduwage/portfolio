-- =========================================================================
-- SECURE SUPABASE DATABASE SETUP SCRIPT FOR CS PORTFOLIO
-- Nuwan Pinnaduwage Portfolio (Nuwan.dev)
-- Run this in your Supabase Project's SQL Editor (Dashboard -> SQL Editor)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 0. AUTHORIZED ADMIN USERS TABLE & AUTH HELPERS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to verify if the executing user is an authorized administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()) THEN
    RETURN TRUE;
  END IF;

  -- Fallback: If admin_users is currently empty, any authenticated user is treated as admin
  IF (SELECT count(*) FROM public.admin_users) = 0 AND auth.role() = 'authenticated' THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatically promote the first created auth user into admin_users
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM public.admin_users) = 0 THEN
    INSERT INTO public.admin_users (id, email, role)
    VALUES (NEW.id, NEW.email, 'superadmin')
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_admin_user();

-- Auto-link any existing auth user if admin_users is empty
DO $$
BEGIN
  IF (SELECT count(*) FROM public.admin_users) = 0 THEN
    INSERT INTO public.admin_users (id, email, role)
    SELECT id, email, 'superadmin' FROM auth.users
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Nuwan Pinnaduwage',
  preferred_name TEXT NOT NULL DEFAULT 'Nuwan',
  role TEXT NOT NULL DEFAULT 'Cybersecurity, Networking & AI Specialist | Computer Science Undergraduate',
  degree TEXT NOT NULL DEFAULT 'Bachelor of Science in Computer Science',
  specialization TEXT NOT NULL DEFAULT 'Cybersecurity, Computer Networking & Artificial Intelligence',
  university TEXT NOT NULL DEFAULT 'State University of Technology',
  expected_graduation TEXT NOT NULL DEFAULT 'May 2026',
  status_available BOOLEAN NOT NULL DEFAULT true,
  status_text TEXT NOT NULL DEFAULT 'AVAILABLE FOR OPPORTUNITIES.',
  location TEXT NOT NULL DEFAULT 'San Francisco, CA (Open to Remote & Relocation)',
  email TEXT NOT NULL DEFAULT 'nuwan.pinnaduwage@example.com',
  phone TEXT DEFAULT '+1 (555) 019-2834',
  bio_short TEXT NOT NULL DEFAULT 'Computer Science undergraduate specializing in offensive & defensive cybersecurity, network infrastructure engineering, and artificial intelligence.',
  bio_paragraphs JSONB NOT NULL DEFAULT '["I am a Computer Science undergraduate focused on the intersection of Cybersecurity, Computer Networking, and Artificial Intelligence. My journey began with low-level systems programming and network protocol analysis, evolving into penetration testing, network automation, and deep learning for threat detection.", "I have hands-on experience designing secure multi-segment network topologies, configuring firewalls and routing protocols, performing vulnerability assessments, and engineering AI pipelines for behavioral anomaly detection. I approach technology with a security-first mindset: understanding how systems break to engineer robust defenses.", "Beyond lab simulations and coursework, I actively engage in CTF competitions, explore packet-level protocol internals, and automate security telemetry. I aim to bridge network infrastructure reliability with modern machine learning intelligence."]'::jsonb,
  who_i_am_heading TEXT DEFAULT 'Who I Am',
  professional_summary TEXT DEFAULT '',
  about_tech_stack JSONB DEFAULT '[]'::jsonb,
  about_certificates JSONB DEFAULT '[]'::jsonb,
  avatar_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  cv_url TEXT DEFAULT '',
  cv_filename TEXT NOT NULL DEFAULT 'Nuwan_Pinnaduwage_Technical_Resume.pdf',
  quick_stats JSONB NOT NULL DEFAULT '[{"label": "Technical Focus", "value": "Cyber, Net & AI"}, {"label": "Degree Focus", "value": "B.S. in CS"}, {"label": "Technical Projects", "value": "14+"}, {"label": "Security Labs", "value": "25+"}]'::jsonb,
  social_links JSONB NOT NULL DEFAULT '[{"platform": "GitHub", "url": "https://github.com/nuwan-pinnaduwage", "username": "@nuwanp-sec", "icon": "Github"}, {"platform": "LinkedIn", "url": "https://linkedin.com/in/nuwan-pinnaduwage", "username": "in/nuwan-pinnaduwage", "icon": "Linkedin"}, {"platform": "Email", "url": "mailto:nuwan.pinnaduwage@example.com", "username": "nuwan.pinnaduwage@example.com", "icon": "Mail"}]'::jsonb,
  hero_backgrounds JSONB DEFAULT '{"light": "/hero-light.png", "dark": "/hero-dark.png"}'::jsonb,
  terminal_facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  about_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns in profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS degree TEXT DEFAULT 'Bachelor of Science in Computer Science',
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '+1 (555) 019-2834',
  ADD COLUMN IF NOT EXISTS who_i_am_heading TEXT DEFAULT 'Who I Am',
  ADD COLUMN IF NOT EXISTS professional_summary TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_tech_stack JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS about_certificates JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_backgrounds JSONB DEFAULT '{"light": "/hero-light.png", "dark": "/hero-dark.png"}'::jsonb;

-- -------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Cybersecurity',
  subcategory TEXT DEFAULT '',
  type TEXT DEFAULT 'Security Tool',
  status TEXT DEFAULT 'Completed',
  completion_year TEXT DEFAULT '2024',
  completion_date TEXT DEFAULT '2024-01',
  start_date TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  full_overview TEXT DEFAULT '',
  problem_statement TEXT DEFAULT '',
  objectives TEXT DEFAULT '',
  proposed_solution TEXT DEFAULT '',
  methodology TEXT DEFAULT '',
  technical_implementation TEXT DEFAULT '',
  results TEXT DEFAULT '',
  challenges TEXT DEFAULT '',
  future_improvements TEXT DEFAULT '',
  architecture_diagram TEXT DEFAULT '',
  topology_diagram TEXT DEFAULT '',
  documentation_url TEXT DEFAULT '',
  paper_url TEXT DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  metrics TEXT[] NOT NULL DEFAULT '{}',
  github TEXT DEFAULT '',
  demo TEXT DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  default_view TEXT DEFAULT 'overview',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Security Tool',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Completed',
  ADD COLUMN IF NOT EXISTS completion_year TEXT DEFAULT '2024',
  ADD COLUMN IF NOT EXISTS completion_date TEXT DEFAULT '2024-01',
  ADD COLUMN IF NOT EXISTS start_date TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS problem_statement TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS objectives TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS proposed_solution TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS methodology TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS technical_implementation TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS results TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS challenges TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS future_improvements TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS architecture_diagram TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS topology_diagram TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS documentation_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS paper_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS default_view TEXT DEFAULT 'overview';

-- -------------------------------------------------------------------------
-- 3. SKILLS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id TEXT NOT NULL DEFAULT 'network',
  category_name TEXT NOT NULL DEFAULT 'Network',
  catalog_id TEXT DEFAULT 'network',
  catalog_name TEXT DEFAULT 'Network',
  level INTEGER NOT NULL DEFAULT 80,
  icon TEXT DEFAULT 'FileCode',
  tag TEXT DEFAULT '80%',
  description TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS catalog_id TEXT DEFAULT 'network',
  ADD COLUMN IF NOT EXISTS catalog_name TEXT DEFAULT 'Network',
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';

-- -------------------------------------------------------------------------
-- 4. RESEARCH TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Conference Paper',
  category TEXT NOT NULL DEFAULT 'Network Security',
  status TEXT NOT NULL DEFAULT 'Published',
  publication_date TEXT DEFAULT '2025-01',
  publication_year TEXT DEFAULT '2025',
  venue TEXT DEFAULT '',
  authors TEXT[] DEFAULT '{}',
  doi TEXT DEFAULT '',
  abstract TEXT DEFAULT '',
  full_overview TEXT DEFAULT '',
  methodology TEXT DEFAULT '',
  paper_url TEXT DEFAULT '',
  external_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  image TEXT DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  highlights TEXT[] DEFAULT '{}',
  metrics TEXT[] DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. CERTIFICATES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  credential_url TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. EDUCATION, EXPERIENCE, ACHIEVEMENTS TABLES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  gpa TEXT,
  honors TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  coursework TEXT[] NOT NULL DEFAULT '{}',
  extracurriculars TEXT[] NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT NOT NULL,
  period TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Internship',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  badge TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. SITE SETTINGS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_theme TEXT NOT NULL DEFAULT 'dark',
  accent_color TEXT NOT NULL DEFAULT 'emerald',
  show_stats BOOLEAN NOT NULL DEFAULT true,
  show_terminal BOOLEAN NOT NULL DEFAULT true,
  show_leetcode BOOLEAN NOT NULL DEFAULT false,
  section_visibility JSONB NOT NULL DEFAULT '{"about": true, "skills": true, "education": true, "projects": true, "experience": true, "contact": true}'::jsonb,
  section_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  footer_tagline TEXT NOT NULL DEFAULT 'Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.',
  footer_copyright TEXT NOT NULL DEFAULT '© 2026 Nuwan Pinnaduwage. All rights reserved.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS section_visibility JSONB NOT NULL DEFAULT '{"about": true, "skills": true, "education": true, "projects": true, "experience": true, "contact": true}'::jsonb,
  ADD COLUMN IF NOT EXISTS section_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_accent_color TEXT DEFAULT '#22c55e',
  ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'inter',
  ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'md',
  ADD COLUMN IF NOT EXISTS line_height TEXT DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS hero_bg_light TEXT DEFAULT '/hero-light.png',
  ADD COLUMN IF NOT EXISTS hero_bg_dark TEXT DEFAULT '/hero-dark.png',
  ADD COLUMN IF NOT EXISTS footer_tagline TEXT DEFAULT 'Designed & engineered with a security-first mindset, modern React, and Tailwind CSS.',
  ADD COLUMN IF NOT EXISTS footer_copyright TEXT DEFAULT '© 2026 Nuwan Pinnaduwage. All rights reserved.';

-- -------------------------------------------------------------------------
-- 7b. CONTACT MESSAGES TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can check their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Only authorized administrators can edit profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Only authorized administrators can edit projects" ON public.projects;
DROP POLICY IF EXISTS "Public skills are viewable by everyone" ON public.skills;
DROP POLICY IF EXISTS "Only authorized administrators can edit skills" ON public.skills;
DROP POLICY IF EXISTS "Public research is viewable by everyone" ON public.research;
DROP POLICY IF EXISTS "Only authorized administrators can edit research" ON public.research;
DROP POLICY IF EXISTS "Public certificates are viewable by everyone" ON public.certificates;
DROP POLICY IF EXISTS "Only authorized administrators can edit certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public education is viewable by everyone" ON public.education;
DROP POLICY IF EXISTS "Only authorized administrators can edit education" ON public.education;
DROP POLICY IF EXISTS "Public experience is viewable by everyone" ON public.experience;
DROP POLICY IF EXISTS "Only authorized administrators can edit experience" ON public.experience;
DROP POLICY IF EXISTS "Public achievements are viewable by everyone" ON public.achievements;
DROP POLICY IF EXISTS "Only authorized administrators can edit achievements" ON public.achievements;
DROP POLICY IF EXISTS "Public site settings are viewable by everyone" ON public.site_settings;
DROP POLICY IF EXISTS "Only authorized administrators can edit site settings" ON public.site_settings;

-- Public READ policies
CREATE POLICY "Users can check their own admin status"
  ON public.admin_users FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Public projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public skills are viewable by everyone"
  ON public.skills FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public research is viewable by everyone"
  ON public.research FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public certificates are viewable by everyone"
  ON public.certificates FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public education is viewable by everyone"
  ON public.education FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public experience is viewable by everyone"
  ON public.experience FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Public site settings are viewable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

-- Authenticated Admin WRITE policies
CREATE POLICY "Only authorized administrators can edit profiles"
  ON public.profiles FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit projects"
  ON public.projects FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit skills"
  ON public.skills FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit research"
  ON public.research FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit certificates"
  ON public.certificates FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit education"
  ON public.education FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit experience"
  ON public.experience FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit achievements"
  ON public.achievements FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

CREATE POLICY "Only authorized administrators can edit site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (auth.role() = 'authenticated' OR public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' OR public.is_admin());

-- Contact Messages Policies
DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert to contact_messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read contact_messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated read contact_messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated update contact_messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated update contact_messages"
  ON public.contact_messages FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete contact_messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated delete contact_messages"
  ON public.contact_messages FOR DELETE TO authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.contact_messages TO anon;
GRANT ALL ON public.contact_messages TO authenticated, service_role;

-- -------------------------------------------------------------------------
-- 9. STORAGE BUCKET CONFIGURATION & RLS
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can delete portfolio assets" ON storage.objects;

CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated admins can upload portfolio assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated admins can update portfolio assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated admins can delete portfolio assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets');

-- -------------------------------------------------------------------------
-- 10. REALTIME REPLICATION CONFIGURATION
-- -------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.projects; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.skills; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.research; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings; EXCEPTION WHEN duplicate_object THEN END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages; EXCEPTION WHEN duplicate_object THEN END;
END $$;
