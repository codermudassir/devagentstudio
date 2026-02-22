import { createAdminClient } from "../lib/supabase/admin";

async function verifyWithProjectClient() {
    const adminClient = createAdminClient();
    const email = "Mudassir@admin.com";

    console.log(`Verifying ${email} using project's admin client...`);

    const { data: profile, error } = await adminClient
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

    if (error) {
        console.error("Error from project client:", error.message);
    } else {
        console.log("Profile retrieved successfully:", profile);
    }
}

verifyWithProjectClient();
