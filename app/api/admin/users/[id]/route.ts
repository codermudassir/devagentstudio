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

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin();
    if (!admin)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("profiles")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 404 });

    return NextResponse.json({ user: data });
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin();
    if (!admin)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const allowed = ["full_name", "role", "plan", "credits"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
        if (body[key] !== undefined) updates[key] = body[key];
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("profiles")
        .update(updates)
        .eq("id", params.id)
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    // Log admin action
    await adminClient.from("activity_logs").insert({
        user_id: params.id,
        user_email: data.email,
        action: "admin_profile_update",
        metadata: { updated_by: admin.id, changes: updates },
    });

    return NextResponse.json({ user: data });
}

export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const admin = await verifyAdmin();
    if (!admin)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();

    // Delete auth user (cascades to profile)
    const { error } = await adminClient.auth.admin.deleteUser(params.id);
    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
