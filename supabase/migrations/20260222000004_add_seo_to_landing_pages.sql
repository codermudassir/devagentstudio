-- Add SEO columns to landing_pages data
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS og_image TEXT;

NOTIFY pgrst, 'reload schema';
