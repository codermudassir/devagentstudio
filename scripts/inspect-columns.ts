import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectColumns() {
    console.log("Inspecting columns for profiles...");

    // Try to select everything with limit 0 to get headers
    const { data, error, status, statusText } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

    if (error) {
        console.log("Error selecting *:", error.message);
        console.log("Details:", error.details);
        console.log("Hint:", error.hint);
        console.log("Code:", error.code);
    } else {
        console.log("Success! Columns found in row:", data?.[0] ? Object.keys(data[0]) : "No rows");
        console.log("Data:", data);
    }
}

inspectColumns();
