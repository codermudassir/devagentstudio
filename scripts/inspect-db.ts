import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log("Inspecting project:", supabaseUrl);

    // Try to query information_schema if allowed, or just try to list tables using a raw query
    // Since we use service_role, we might have more luck with raw sql if we had an invoke function, 
    // but let's try to query a known system table to see if it's even connected.

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error("Auth error:", authError.message);
    } else {
        console.log(`Found ${authUsers.users.length} auth users.`);
        authUsers.users.forEach(u => console.log(`- ${u.email} (${u.id})`));
    }

    const { data: profiles, error: pError } = await supabase.from("profiles").select("*");
    if (pError) {
        console.error("Profiles Table Error:", pError.message);
    } else {
        console.log(`Profiles table has ${profiles?.length} rows.`);
    }
}

inspectSchema();
