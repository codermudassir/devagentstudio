-- ============================================================
-- FIX PERMISSIONS AND RELOAD SCHEMA
-- ============================================================

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant all permissions on our tables to service_role (which we use for admin ops)
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.pricing_plans TO service_role;
GRANT ALL ON TABLE public.landing_pages TO service_role;
GRANT ALL ON TABLE public.activity_logs TO service_role;

-- Grant select to authenticated users (so they can see their own data)
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.pricing_plans TO authenticated;
GRANT SELECT ON TABLE public.landing_pages TO authenticated;
GRANT SELECT ON TABLE public.activity_logs TO authenticated;

-- Ensure sequences if any (optional here but good practice)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- Force a PostgREST schema reload
NOTIFY pgrst, 'reload schema';
