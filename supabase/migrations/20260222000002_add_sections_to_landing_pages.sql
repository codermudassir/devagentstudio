-- Add sections column to landing_pages table
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]';

-- Update RLS policies to allow full access for service role (admin)
-- This is already covered by "Service role full access landing" policy, but ensuring it.
-- We also need to ensure that the public can view the sections.

-- No changes needed to policies if existing ones cover the whole row.
-- Let's force a schema reload just in case.
NOTIFY pgrst, 'reload schema';
