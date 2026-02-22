import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Initialize profile / credit if first login
  try {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("id, credits, plan, role")
      .eq("id", user.id)
      .single();

    console.log("DEBUG [DashboardLayout]: User ID:", user.id);
    console.log("DEBUG [DashboardLayout]: Profile found:", profile);

    if (!profile) {
      // First login - create profile with 50 credits
      await adminClient.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatar_url: user.user_metadata?.avatar_url ?? null,
        role: "user",
        plan: "free",
        credits: 50,
      });
      await adminClient.from("activity_logs").insert({
        user_id: user.id,
        user_email: user.email,
        action: "first_login",
        metadata: { credits_awarded: 50 },
      });
    } else {
      await adminClient
        .from("profiles")
        .update({ last_active: new Date().toISOString() })
        .eq("id", user.id);
      await adminClient.from("activity_logs").insert({
        user_id: user.id,
        user_email: user.email,
        action: "login",
        metadata: {},
      });
    }

    const finalProfile = profile ?? { credits: 50, plan: "free", role: "user" };
    const fullName = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null;
    const avatarUrl = user.user_metadata?.avatar_url ?? null;

    return (
      <DashboardShell
        userEmail={user.email ?? null}
        userFullName={fullName}
        userAvatarUrl={avatarUrl}
        credits={finalProfile.credits}
        plan={finalProfile.plan as "free" | "pro" | "enterprise"}
        isAdmin={finalProfile.role === "admin"}
      >
        {children}
      </DashboardShell>
    );
  } catch (err: any) {
    console.error("DEBUG [DashboardLayout]: Error in profile fetch:", err);

    // Check if table missing
    const isTableMissing = err?.code === 'PGRST205' || err?.message?.includes('profiles');

    return (
      <DashboardShell
        userEmail={user.email ?? null}
        userFullName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? null}
        userAvatarUrl={user.user_metadata?.avatar_url ?? null}
        credits={50}
        plan="free"
        isAdmin={false}
      >
        {isTableMissing && (
          <div className="bg-amber-50 border-2 border-amber-500 rounded-xl p-6 mb-8 text-amber-900 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚨</span>
              <h2 className="text-lg font-bold">Database Setup Required</h2>
            </div>
            <p className="mb-4 text-sm font-medium leading-relaxed">
              The <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-700 font-bold">profiles</code> table was not found in your Supabase project.
              This is mandatory for the 50 free credits and admin features.
            </p>
            <div className="bg-white/50 rounded-lg p-4 mb-4 border border-amber-200">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">Instructions to fix:</p>
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li>Go to your <a href="https://supabase.com/dashboard/project/fvgbgyzyrwrsnoyuxkdv/sql/new" target="_blank" className="underline font-bold text-amber-700">Supabase SQL Editor</a></li>
                <li>Open the file <code className="bg-amber-100 px-1 py-0.5 rounded">RUN_THIS_IN_SUPABASE.sql</code> in your code editor</li>
                <li>Copy ALL script content</li>
                <li>Paste into the Supabase editor and click <b>Run</b></li>
              </ol>
            </div>
            <p className="text-xs italic text-amber-700">Project URL detected: https://fvgbgyzyrwrsnoyuxkdv.supabase.co</p>
          </div>
        )}
        {children}
      </DashboardShell>
    );
  }
}
