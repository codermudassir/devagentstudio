import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceCheck() {
    console.log("Checking project:", supabaseUrl);

    // Try to insert a row with a random UUID
    const id = "00000000-0000-0000-0000-000000000001";
    console.log("Attempting insert into profiles...");

    const { data, error } = await supabase
        .from("profiles")
        .insert({
            id: id,
            email: "test-force@check.com",
            role: "user"
        })
        .select();

    if (error) {
        console.log("INSERT FAILED:");
        console.log("  Message:", error.message);
        console.log("  Code:", error.code);
        console.log("  Details:", error.details);
    } else {
        console.log("INSERT SUCCESS!");
        console.log("  Data:", data);

        // Clean up
        await supabase.from("profiles").delete().eq("id", id);
        console.log("Cleaned up dummy row.");
    }
}

forceCheck();
