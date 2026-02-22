import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmins() {
    const emails = ["Mudassir@admin.com", "devmudassir@gmail.com", "devmudassir5@gmail.com"];

    console.log("Warming up schema cache...");
    await supabase.from("profiles").select("id").limit(1);
    await new Promise(r => setTimeout(r, 2000));

    for (const email of emails) {
        console.log(`Processing ${email}...`);

        // Check Auth
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const user = authUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (user) {
            console.log(`Found user ${email} with ID ${user.id}. Setting admin role...`);
            const { error } = await supabase.from("profiles").upsert({
                id: user.id,
                email: user.email,
                role: "admin",
                plan: "enterprise",
                credits: 9999
            });

            if (error) console.error(`Error setting admin for ${email}:`, error.message);
            else console.log(`SUCCESS: ${email} is now an admin.`);
        } else {
            console.log(`User ${email} not found in Auth table.`);

            if (email === "Mudassir@admin.com") {
                console.log(`Creating ${email} account...`);
                const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                    email,
                    password: "Mudassir@2007",
                    email_confirm: true
                });

                if (createError) {
                    console.error(`Error creating ${email}:`, createError.message);
                } else if (newUser.user) {
                    await supabase.from("profiles").upsert({
                        id: newUser.user.id,
                        email: email,
                        role: "admin",
                        plan: "enterprise",
                        credits: 9999
                    });
                    console.log(`SUCCESS: Created and set ${email} as admin.`);
                }
            }
        }
    }
}

setupAdmins();
