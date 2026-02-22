import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugProfiles() {
    console.log("Supabase URL:", supabaseUrl);
    console.log("Service Key (last 5):", supabaseServiceKey.slice(-5));

    const { data, error, status, statusText } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

    if (error) {
        console.log("--- FAILED ---");
        console.log("Message:", error.message);
        console.log("Code:", error.code);
        console.log("Status:", status);
        console.log("StatusText:", statusText);
        console.log("Hint:", error.hint);
        console.log("Details:", error.details);
    } else {
        console.log("--- SUCCESS ---");
        console.log("Data:", data);
    }
}

debugProfiles();
