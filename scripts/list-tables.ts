import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAll() {
    console.log("--- PROFILES ---");
    const { data: profiles, error: profileError } = await supabase.from("profiles").select("*");
    if (profileError) {
        console.error("Profile Error:", JSON.stringify(profileError, null, 2));
    } else {
        console.log(`Found ${profiles?.length || 0} profiles:`);
        console.log(JSON.stringify(profiles, null, 2));
    }

    console.log("\n--- AUTH USERS ---");
    const { data: usersData, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
        console.error("Auth Error:", JSON.stringify(authError, null, 2));
    } else {
        console.log(`Found ${usersData.users.length} auth users:`);
        console.log(usersData.users.map(u => ({ id: u.id, email: u.email, role: u.role })));
    }
}

listAll();
