-- =========================================================================
-- MIGRATION: 20261105_full_schema_alignment.sql
-- Synchronize site_settings columns, add contact_messages table, and setup RLS
-- =========================================================================

-- 1. Ensure all columns in site_settings
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

-- 2. Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

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

-- 4. Grant table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON public.contact_messages TO anon;
GRANT ALL ON public.contact_messages TO authenticated, service_role;

-- 5. Add to realtime publication
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN undefined_object THEN NULL;
  END;
END $$;
