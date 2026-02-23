-- ============================================================
-- CRM UPGRADES MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. AI Usage Logs Table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  credits_used INTEGER DEFAULT 1,
  cost_estimate NUMERIC(10,5) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to ai_usage_logs" ON public.ai_usage_logs FOR ALL USING (true);
CREATE POLICY "Users can view own AI usage" ON public.ai_usage_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. Credit Logs Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.credit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  reason TEXT NOT NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.credit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to credit_logs" ON public.credit_logs FOR ALL USING (true);
CREATE POLICY "Users can view own credit logs" ON public.credit_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 3. API Management Table
CREATE TABLE IF NOT EXISTS public.api_keys_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'openai', 'openrouter')),
  api_key TEXT NOT NULL,
  model_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_fallback BOOLEAN NOT NULL DEFAULT false,
  rate_limit INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.api_keys_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access to api_keys_config" ON public.api_keys_config FOR ALL USING (true);

-- 4. Update Profiles Role Constraint
DO $$
BEGIN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin', 'super_admin', 'manager', 'support'));
END $$;

-- 5. Add Account Status to Profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned'));

-- 6. Helper Function for Credit Logging (Trigger or Manual)
-- We'll handle this in the Next.js API for better control, but adding the table is the first step.
