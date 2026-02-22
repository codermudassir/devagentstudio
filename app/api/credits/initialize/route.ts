import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminClient = createAdminClient();

        // Check if profile already exists
        const { data: existing } = await adminClient
            .from("profiles")
            .select("id, credits")
            .eq("id", user.id)
            .single();

        if (!existing) {
            // First login - create profile with 50 credits
            const { error } = await adminClient.from("profiles").insert({
                id: user.id,
                email: user.email,
                full_name:
                    user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
                avatar_url: user.user_metadata?.avatar_url ?? null,
                role: "user",
                plan: "free",
                credits: 50,
            });

            if (error) throw error;

            // Log the event
            await adminClient.from("activity_logs").insert({
                user_id: user.id,
                user_email: user.email,
                action: "first_login",
                metadata: { credits_awarded: 50 },
            });

            return NextResponse.json({ credits: 50, isNew: true });
        }

        // Update last_active
        await adminClient
            .from("profiles")
            .update({ last_active: new Date().toISOString() })
            .eq("id", user.id);

        // Log login
        await adminClient.from("activity_logs").insert({
            user_id: user.id,
            user_email: user.email,
            action: "login",
            metadata: {},
        });

        return NextResponse.json({ credits: existing.credits, isNew: false });
    } catch (error) {
        console.error("Credit init error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
