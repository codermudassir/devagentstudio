import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugDatabase() {
    console.log("Supabase URL:", supabaseUrl);

    const tables = ["profiles", "pricing_plans", "landing_pages", "activity_logs"];

    for (const table of tables) {
        console.log(`\n--- Checking Table: ${table} ---`);
        const { data, error, status } = await supabase
            .from(table)
            .select("*");

        if (error) {
            console.log("Status:", status);
            console.log("Error Message:", error.message);
            console.log("Error Code:", error.code);
        } else {
            console.log("SUCCESS!");
            console.log("Status:", status);
            console.log("Data Length:", data?.length);
            if (data && data.length > 0) {
                console.log("Sample Data:", JSON.stringify(data[0], null, 2));
            }
        }
    }
}

debugDatabase();
