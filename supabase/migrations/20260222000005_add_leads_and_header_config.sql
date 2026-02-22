-- Add Header Config to landing_pages
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS header_config JSONB DEFAULT '{"enabled": true, "layout": "classic"}';

-- Create Landing Page Leads table for Contact Form submissions
CREATE TABLE IF NOT EXISTS public.landing_page_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL,
    user_email TEXT, -- Capture email separately for easier filtering
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.landing_page_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a lead (public form)
CREATE POLICY "Anyone can submit a lead"
    ON public.landing_page_leads FOR INSERT
    WITH CHECK (true);

-- Only admins can view leads
CREATE POLICY "Admins can view all leads"
    ON public.landing_page_leads FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ));

NOTIFY pgrst, 'reload schema';
