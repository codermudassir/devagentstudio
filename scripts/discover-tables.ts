import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function discoverTables() {
    console.log("Discovering tables...");

    // Try to query a hypothetical RPC that might list tables
    // Or just try common ones.
    const tests = ["profiles", "pricing_plans", "landing_pages", "activity_logs", "users", "test"];

    for (const t of tests) {
        const { data, error, status } = await supabase.from(t).select("*", { count: 'exact', head: true });
        if (error) {
            console.log(`Table '${t}': FAIL - ${error.message} (Code: ${error.code})`);
        } else {
            console.log(`Table '${t}': SUCCESS - status ${status}`);
        }
    }
}

discoverTables();
