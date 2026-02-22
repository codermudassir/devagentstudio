import { createClient } from "@supabase/supabase-js";
// import * as dotenv from "dotenv";
// dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUser() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", "Mudassir@admin.com")
        .single();

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log("User Profile:", JSON.stringify(data, null, 2));
    }
}

checkUser();
