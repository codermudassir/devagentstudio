import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    if (profile?.role !== "admin") return null;
    return user;
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin();
    if (!admin)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { amount, operation } = body; // operation: 'add' | 'set'

    if (typeof amount !== "number") {
        return NextResponse.json({ error: "amount must be a number" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    let newCredits: number;

    if (operation === "set") {
        newCredits = Math.max(0, amount);
    } else {
        // Default: add (can be negative to deduct)
        const { data: current } = await adminClient
            .from("profiles")
            .select("credits")
            .eq("id", params.id)
            .single();
        newCredits = Math.max(0, (current?.credits ?? 0) + amount);
    }

    const { data, error } = await adminClient
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", params.id)
        .select("id, email, credits")
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    await adminClient.from("activity_logs").insert({
        user_id: params.id,
        user_email: data.email,
        action: "admin_credits_adjustment",
        metadata: { updated_by: admin.id, operation, amount, new_credits: newCredits },
    });

    return NextResponse.json({ credits: newCredits });
}
