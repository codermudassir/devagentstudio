import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return null;
    return user;
}

export async function GET(req: NextRequest) {
    const admin = await verifyAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const userId = req.nextUrl.searchParams.get("user_id");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");

    const adminClient = createAdminClient();
    let query = adminClient
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (userId) query = query.eq("user_id", userId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ logs: data });
}
