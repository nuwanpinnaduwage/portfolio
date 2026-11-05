-- =========================================================================
-- MIGRATION: COMPLETE ABOUT ME SECTION MANAGEMENT
-- Run this in your Supabase Project's SQL Editor (Dashboard -> SQL Editor)
-- =========================================================================

-- 1. Extend profiles table with dedicated About Me fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS who_i_am_heading TEXT DEFAULT 'Who I Am',
  ADD COLUMN IF NOT EXISTS professional_summary TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_tech_stack JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS about_certificates JSONB DEFAULT '[]'::jsonb;

-- 2. Extend skills table with experience duration
ALTER TABLE public.skills 
  ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '';

-- 3. Dedicated Certificates Table for About Me Carousel
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

-- Enable Row Level Security (RLS) on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing certificate policies if re-running
DROP POLICY IF EXISTS "Public certificates are viewable by everyone" ON public.certificates;
DROP POLICY IF EXISTS "Only authorized administrators can edit certificates" ON public.certificates;

-- Public can view published certificates (or admin sees all)
CREATE POLICY "Public certificates are viewable by everyone" 
  ON public.certificates FOR SELECT 
  USING (is_published = true OR public.is_admin());

-- Only authorized administrators can mutate certificates
CREATE POLICY "Only authorized administrators can edit certificates" 
  ON public.certificates FOR ALL TO authenticated 
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Seed initial certificates from achievements if certificates table is empty
DO $$
BEGIN
  IF (SELECT count(*) FROM public.certificates) = 0 THEN
    INSERT INTO public.certificates (title, issuer, year, tags, image, credential_url, order_index, is_published)
    VALUES 
      ('1st Place Winner - HackTech Collegiate Hackathon', 'Annual University Hackathon (400+ participants)', '2024', ARRAY['Hackathon', 'Full-Stack', 'Real-Time'], '', '', 0, true),
      ('Dean''s Honor List for Academic Excellence', 'School of Engineering', '2022-2025', ARRAY['Academic Honors', 'Dean''s List'], '', '', 1, true),
      ('Top 15% ICPC Regional Qualifier', 'International Collegiate Programming Contest (ICPC)', '2023', ARRAY['Algorithms', 'Competitive Programming'], '', '', 2, true),
      ('AWS Certified Cloud Practitioner (Foundational)', 'Amazon Web Services', '2024', ARRAY['Cloud', 'AWS', 'Infrastructure'], '', '', 3, true);
  END IF;
END $$;

-- 5. Storage Bucket Setup for 'portfolio-assets' (avatars, certificates, CVs)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can upload portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can update portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can delete portfolio assets" ON storage.objects;

CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated admins can upload portfolio assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Authenticated admins can update portfolio assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Authenticated admins can delete portfolio assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());
