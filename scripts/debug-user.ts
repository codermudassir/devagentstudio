import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
    const email = "mudassir@admin.com";
    console.log(`Checking ALL profiles for email: ${email}`);

    const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("email", email);

    if (error) {
        console.error("Error:", error.message);
        return;
    }

    console.log(`Found ${profiles.length} profiles:`);
    profiles.forEach((p, i) => {
        console.log(`Profile ${i + 1}: ID=${p.id}, Email=${p.email}, Role=${p.role}`);
    });

    // Check auth table too
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const matchedUsers = authUsers.users.filter(u => u.email?.toLowerCase() === email.toLowerCase());

    console.log(`\nFound ${matchedUsers.length} users in auth table:`);
    matchedUsers.forEach((u, i) => {
        console.log(`Auth ${i + 1}: ID=${u.id}, Email=${u.email}`);
    });
}

checkUser();
