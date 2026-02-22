import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAllTables() {
    let log = `Checking project: ${supabaseUrl}\n`;

    const tables = ["profiles", "pricing_plans", "landing_pages", "activity_logs"];

    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true });

        if (error) {
            log += `Table '${table}': ERROR - ${error.message} (Code: ${error.code})\n`;
        } else {
            log += `Table '${table}': EXISTS (Rows: ${count})\n`;
        }
    }

    fs.writeFileSync("table_check_results.txt", log);
    console.log("Results written to table_check_results.txt");
}

checkAllTables();
