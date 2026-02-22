import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log("Inspecting information_schema...");

    // Try to list tables via a select on a system view if PostgREST allows (unlikely)
    // But we can try to use a RPC if it was created.

    // Let's try to create a temporary table and see if it's visible
    // We can't create tables via standard Supabase JS.

    // Let's try to see if 'activity_logs' is still visible while 'profiles' is not.
    const { count: c1, error: e1 } = await supabase.from('activity_logs').select('*', { count: 'exact', head: true });
    console.log("activity_logs visible:", !e1, e1?.message);

    const { count: c2, error: e2 } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    console.log("profiles visible:", !e2, e2?.message);

    if (e2) {
        console.log("profiles error code:", e2.code);
    }
}

inspectSchema();
