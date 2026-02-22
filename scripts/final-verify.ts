import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalVerification() {
    console.log("Starting final verification for:", supabaseUrl);

    // Try a direct query that usually forces a cache refresh or a more direct error
    const { data, error, status } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);

    if (error) {
        console.log("Profiles check FAILED:");
        console.log("  Message:", error.message);
        console.log("  Code:", error.code);
        console.log("  Status:", status);
    } else {
        console.log("Profiles check SUCCESS!");
        console.log("  Data:", data);
    }

    // Check pricing_plans too
    const { error: pError } = await supabase.from("pricing_plans").select("id").limit(1);
    if (pError) console.log("Pricing Plans check FAILED:", pError.message);
    else console.log("Pricing Plans check SUCCESS!");
}

finalVerification();
