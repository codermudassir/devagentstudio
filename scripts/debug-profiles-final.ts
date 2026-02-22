import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("URL:", supabaseUrl);
console.log("Service Key Prefix:", supabaseServiceKey.substring(0, 10));

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debug() {
    console.log("\n--- TEST: select count ---");
    const r1 = await supabase.from("profiles").select("*", { count: "exact", head: true });
    console.log("Error:", JSON.stringify(r1.error, null, 2));
    console.log("Status:", r1.status);
    console.log("Count:", r1.count);

    console.log("\n--- TEST: select id ---");
    const r2 = await supabase.from("profiles").select("id").limit(1);
    console.log("Error:", JSON.stringify(r2.error, null, 2));
    console.log("Status:", r2.status);
    console.log("Data:", r2.data);
}

debug();
