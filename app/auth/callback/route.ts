import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // No code = email confirmation flow (hash in URL, client-side only)
  // Return HTML that loads Supabase SSR client (cookie-based), sets session, then redirects
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const html = `<!DOCTYPE html>
<html><head><title>Confirming...</title></head><body>
<p>Confirming...</p>
<script type="module">
  const hash = window.location.hash?.substring(1);
  if (hash) {
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const type = params.get('type');
    if (access_token && refresh_token) {
      const { createBrowserClient } = await import('https://esm.sh/@supabase/ssr');
      const supabase = createBrowserClient('${supabaseUrl}', '${supabaseAnonKey}');
      await supabase.auth.setSession({ access_token, refresh_token });
      const redirect = type === 'recovery' ? '${origin}/reset-password' : '${origin}${next}';
      window.location.replace(redirect);
    } else {
      window.location.replace('${origin}/login?error=auth');
    }
  } else {
    window.location.replace('${origin}/login?error=auth');
  }
</script>
</body></html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
