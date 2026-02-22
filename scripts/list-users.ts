import { createClient } from "@supabase/supabase-js";
// import * as dotenv from "dotenv";

// dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listUsers() {
    console.log("Fetching users from profiles...");
    const { data, error } = await supabase
        .from("profiles")
        .select("email, role, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error:", error.message);
        return;
    }

    console.log("Users found:");
    data.forEach(u => console.log(`- ${u.email} [${u.role}]`));
}

listUsers();
