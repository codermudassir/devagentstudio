import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function dumpProfiles() {
    const { data: profiles, error } = await supabase.from("profiles").select("id, email, role");
    if (error) {
        console.error("Error:", error);
    } else {
        console.log(`Found ${profiles.length} profiles:`);
        console.log(profiles);
    }
}

dumpProfiles();
