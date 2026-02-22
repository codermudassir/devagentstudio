import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function globalSearch() {
    console.log("Checking all schemas for 'profiles' table...");

    // PostgREST doesn't let us query information_schema easily via the client, 
    // but we can try common schema names.
    const schemas = ["public", "auth", "storage", "extensions"];

    for (const schema of schemas) {
        // Note: The client is usually locked to the 'public' schema unless configured otherwise.
        // We can't easily change the schema per-query with the standard client without re-creating it.
        console.log(`Checking schema: ${schema}`);
        const client = createClient(supabaseUrl, supabaseServiceKey, {
            db: { schema: schema }
        });

        const { data, error } = await client.from("profiles").select("id").limit(1);
        if (error) {
            console.log(`- ${schema}.profiles: NOT FOUND (${error.message})`);
        } else {
            console.log(`- ${schema}.profiles: FOUND!`);
        }
    }
}

globalSearch();
