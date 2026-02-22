import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllTables() {
    console.log("Checking project:", supabaseUrl);

    const tables = ["profiles", "pricing_plans", "landing_pages", "activity_logs"];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select("count", { count: "exact", head: true });
        if (error) {
            console.log(`Table '${table}': ERROR - ${error.message}`);
        } else {
            console.log(`Table '${table}': EXISTS`);
        }
    }
}

checkAllTables();
