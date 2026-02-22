import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllTables() {
    console.log("Checking information_schema.tables for profiles...");

    // Use raw SQL via RPC if enabled, otherwise try a direct query
    // Since we don't know the RPCs, try a direct query to information_schema
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(0);

    if (error) {
        console.log("Direct profiles query failed:", error.message);
    } else {
        console.log("Direct profiles query SUCCESS");
    }

    // Try to list all tables in public schema via a common hack (selecting from pg_tables if possible)
    // Usually service role has permissions
    const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables'); // This likely won't exist unless defined

    if (tablesError) {
        console.log("RPC check failed (expected):", tablesError.message);
    }

    // Final check: Try to insert one row and see the error
    const { error: insertError } = await supabase
        .from("profiles")
        .insert({ id: '00000000-0000-0000-0000-000000000000', email: 'test@check.com' });

    if (insertError) {
        console.log("Insert check failed:", insertError.message);
        console.log("Error Code:", insertError.code);
    }
}

listAllTables();
