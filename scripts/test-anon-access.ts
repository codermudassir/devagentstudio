import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInitApi() {
    console.log("Attempting to test credits initialization...");

    // We need a session, which we can't easily get here without a real user login.
    // But we can try to see if the profiles table is visible via the ANON key.

    console.log("Checking profiles via ANON key...");
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
        console.log("ANON profiles check FAILED:", error.message);
    } else {
        console.log("ANON profiles check SUCCESS!");
    }
}

testInitApi();
