import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Force schema refresh by not using any advanced options
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkNow() {
    console.log("Direct check for profiles...");
    const { data, error, status } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
        console.log("Error:", error.message);
        console.log("Status:", status);
    } else {
        console.log("Success! Data found:", data);
    }
}

checkNow();
