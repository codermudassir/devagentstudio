ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS is_home BOOLEAN DEFAULT false;

-- Ensure only one page can be the home page
CREATE UNIQUE INDEX IF NOT EXISTS one_home_page_idx ON public.landing_pages (is_home) WHERE is_home = true;

NOTIFY pgrst, 'reload schema';
