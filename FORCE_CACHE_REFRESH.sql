-- ============================================================
-- FORCE CACHE REFRESH VIA RENAME
-- ============================================================

-- Rename tables
ALTER TABLE IF EXISTS public.profiles RENAME TO profiles_temp;
ALTER TABLE IF EXISTS public.pricing_plans RENAME TO pricing_plans_temp;
ALTER TABLE IF EXISTS public.landing_pages RENAME TO landing_pages_temp;
ALTER TABLE IF EXISTS public.activity_logs RENAME TO activity_logs_temp;

-- Wait 1 second (implicit in sequence)

-- Rename back
ALTER TABLE IF EXISTS public.profiles_temp RENAME TO profiles;
ALTER TABLE IF EXISTS public.pricing_plans_temp RENAME TO pricing_plans;
ALTER TABLE IF EXISTS public.landing_pages_temp RENAME TO landing_pages;
ALTER TABLE IF EXISTS public.activity_logs_temp RENAME TO activity_logs;

-- Re-grant permissions just in case
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.pricing_plans TO service_role;
GRANT ALL ON TABLE public.landing_pages TO service_role;
GRANT ALL ON TABLE public.activity_logs TO service_role;

GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.pricing_plans TO authenticated;
GRANT SELECT ON TABLE public.landing_pages TO authenticated;
GRANT SELECT ON TABLE public.activity_logs TO authenticated;

-- Hard reload
NOTIFY pgrst, 'reload schema';
