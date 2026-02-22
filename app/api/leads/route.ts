import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { page_id, form_data } = await request.json();

        if (!page_id || !form_data) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Extract email if present
        const user_email = form_data.email || form_data.Email || null;

        const { error } = await supabase
            .from("landing_page_leads")
            .insert({
                page_id,
                form_data,
                user_email
            });

        if (error) throw error;

        // Log to activity logs too
        await supabase.from("activity_logs").insert({
            action: "form_submission",
            metadata: { page_id, user_email }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Lead submission error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
