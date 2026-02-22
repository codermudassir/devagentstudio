import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSelect() {
    console.log("Debugging SELECT on profiles...");

    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
        console.log("FULL ERROR OBJECT:");
        console.log(JSON.stringify(error, null, 2));
    } else {
        console.log("SUCCESS. Row count:", data?.length);
    }
}

debugSelect();
