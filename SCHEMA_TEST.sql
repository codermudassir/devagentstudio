-- ============================================================
-- SCHEMA TEST SCRIPT
-- ============================================================

-- Create a table without foreign keys
CREATE TABLE IF NOT EXISTS public.schema_test (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Grant permissions
GRANT ALL ON TABLE public.schema_test TO service_role;
GRANT SELECT ON TABLE public.schema_test TO authenticated;

-- Reload cache
NOTIFY pgrst, 'reload schema';
