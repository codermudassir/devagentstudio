import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deepAudit() {
    const emails = ["Mudassir@admin.com", "devmudassir@gmail.com"];

    for (const email of emails) {
        console.log(`\n=== AUDITING: ${email} ===`);

        // 1. Auth check
        const { data: authData } = await supabase.auth.admin.listUsers();
        const authUser = authData.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (!authUser) {
            console.log("NOT FOUND IN AUTH TABLE");
            continue;
        }

        console.log("AUTH TABLE:", {
            id: authUser.id,
            email: authUser.email,
            confirmed: !!authUser.email_confirmed_at,
            metadata: authUser.user_metadata
        });

        // 2. Profile check
        const { data: profile, error: pError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();

        if (pError) {
            console.log("PROFILE TABLE ERROR:", pError.message);

            // Try search by email
            const { data: pByEmail } = await supabase.from("profiles").select("*").eq("email", email).single();
            if (pByEmail) {
                console.log("PROFILE FOUND BY EMAIL BUT NOT BY ID:", pByEmail);
            }
        } else {
            console.log("PROFILE TABLE:", {
                id: profile.id,
                role: profile.role,
                plan: profile.plan,
                credits: profile.credits
            });
        }
    }
}

deepAudit();
