import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
    console.log("Checking project:", supabaseUrl);

    // List tables from public schema
    const { data, error } = await supabase
        .from("profiles")
        .select("count", { count: "exact", head: true });

    if (error) {
        console.error("Error accessing profiles:", error);
    } else {
        console.log("Successfully accessed profiles table.");
    }

    // Try to list all users to see if auth is working
    const { data: users, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error("Auth Error:", authError);
    } else {
        console.log(`Auth is working. Found ${users.users.length} users.`);
    }
}

checkDatabase();
