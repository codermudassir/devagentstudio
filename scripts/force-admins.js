const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) env[key.trim()] = value.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env");
    process.exit(1);
}

// Since we don't have supabase-js easily in a node script without setup, 
// we'll use the Auth REST API directly with the service role key.
async function run() {
    console.log("🚀 Checking Supabase Auth Users...");

    const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const users = data.users || [];

        console.log(`✅ Found ${users.length} users in Auth.`);

        for (const user of users) {
            console.log(`  - ${user.email} (${user.id})`);

            // Try to upsert into profiles as admin
            console.log(`    Attempting to set as ADMIN in profiles...`);
            const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                },
                body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    role: 'admin',
                    plan: 'enterprise',
                    credits: 9999
                })
            });

            if (profileRes.ok) {
                console.log(`    ✅ Successfully set ${user.email} as ADMIN.`);
            } else {
                console.error(`    ❌ Failed to set profile:`, await profileRes.text());
            }
        }
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

run();
