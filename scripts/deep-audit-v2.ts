import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deepAudit() {
    console.log("Supabase URL:", supabaseUrl);

    const tables = ["profiles", "pricing_plans", "landing_pages", "activity_logs"];

    for (const table of tables) {
        console.log(`\n--- Checking Table: ${table} ---`);

        // Test 1: Count only (head: true)
        const t1 = await supabase.from(table).select("*", { count: "exact", head: true });
        console.log("Test 1 (Count Only):", t1.error ? `FAIL: ${t1.error.message}` : `SUCCESS (Rows: ${t1.count})`);

        // Test 2: Select id only
        const t2 = await supabase.from(table).select("id").limit(1);
        console.log("Test 2 (Select ID):", t2.error ? `FAIL: ${t2.error.message}` : "SUCCESS");

        // Test 3: Select *
        const t3 = await supabase.from(table).select("*").limit(1);
        console.log("Test 3 (Select *):", t3.error ? `FAIL: ${t3.error.message}` : "SUCCESS");

        if (t3.data && t3.data.length > 0) {
            console.log("Sample row keys:", Object.keys(t3.data[0]));
        }
    }
}

deepAudit();
