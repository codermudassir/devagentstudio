import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
    console.log("Checking project:", supabaseUrl);

    // Directly try a query without single()
    const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role")
        .limit(10);

    if (error) {
        console.log("--- ERROR ---");
        console.log(error);
    } else {
        console.log("--- SUCCESS ---");
        console.log(`Found ${data.length} rows in profiles.`);
        console.log(data);
    }
}

checkSchema();
