-- ============================================================
-- COPY AND RUN ALL OF THIS IN SUPABASE SQL EDITOR
-- Link: https://supabase.com/dashboard/project/fvgbgyzyrwrsnoyuxkdv/sql/new
-- ============================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  credits INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Pricing Plans Table
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  credits INTEGER NOT NULL DEFAULT 50,
  features JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Landing Pages Table
CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  hero_heading TEXT,
  hero_subheading TEXT,
  body_content TEXT,
  cta_text TEXT DEFAULT 'Get Started',
  cta_link TEXT DEFAULT '/signup',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 6. Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Service role full access profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Anyone can view active pricing plans" ON public.pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access pricing" ON public.pricing_plans FOR ALL USING (true);
CREATE POLICY "Anyone can view published landing pages" ON public.landing_pages FOR SELECT USING (is_published = true);
CREATE POLICY "Service role full access landing" ON public.landing_pages FOR ALL USING (true);
CREATE POLICY "Service role full access logs" ON public.activity_logs FOR ALL USING (true);

-- 7. Seed Default Plans
INSERT INTO public.pricing_plans (name, description, price_monthly, credits, features, is_active, sort_order) VALUES
  ('Free', 'Get started with AI-powered tools', 0, 50, '["50 AI credits/month", "4 AI Agents", "Basic support"]', true, 0),
  ('Pro', 'For freelancers and growing teams', 29, 500, '["500 AI credits/month", "All AI Agents", "Priority support", "Advanced analytics"]', true, 1),
  ('Enterprise', 'Unlimited power for large teams', 99, 2000, '["2000 AI credits/month", "All AI Agents", "Dedicated support", "Custom integrations", "Team management"]', true, 2)
ON CONFLICT DO NOTHING;

-- 8. SET ADMINS (IMPORTANT)
UPDATE public.profiles SET role = 'admin', plan = 'enterprise', credits = 9999 WHERE email = 'Mudassir@admin.com';
UPDATE public.profiles SET role = 'admin', plan = 'enterprise', credits = 9999 WHERE email = 'devmudassir@gmail.com';
UPDATE public.profiles SET role = 'admin', plan = 'enterprise', credits = 9999 WHERE email = 'devmudassir5@gmail.com';
