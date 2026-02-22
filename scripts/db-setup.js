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

async function run() {
    console.log("🚀 Starting Database Setup...");

    const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
    };

    // 1. Check if profiles table exists and list users
    console.log("--- Checking Profiles ---");
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/profiles?select=email,role`, { headers });
        if (!res.ok) throw new Error(await res.text());
        const profiles = await res.json();
        console.log(`✅ Found ${profiles.length} users in profiles table.`);
        profiles.forEach(p => console.log(`  - ${p.email} [${p.role}]`));
    } catch (e) {
        console.error("❌ Error checking profiles (Maybe table doesn't exist?):", e.message);
        console.log("👉 ACTION REQUIRED: You MUST run the SQL in 'RUN_THIS_IN_SUPABASE.sql' in your Supabase SQL Editor first!");
    }

    // 2. Seed Pricing Plans
    console.log("\n--- Seeding Pricing Plans ---");
    const plans = [
        { name: 'Free', description: 'Get started with AI-powered tools', price_monthly: 0, credits: 50, features: ["50 AI credits/month", "4 AI Agents", "Basic support"], is_active: true, sort_order: 0 },
        { name: 'Pro', description: 'For freelancers and growing teams', price_monthly: 29, credits: 500, features: ["500 AI credits/month", "All AI Agents", "Priority support", "Advanced analytics"], is_active: true, sort_order: 1 },
        { name: 'Enterprise', description: 'Unlimited power for large teams', price_monthly: 99, credits: 2000, features: ["2000 AI credits/month", "All AI Agents", "Dedicated support", "Custom integrations", "Team management"], is_active: true, sort_order: 2 }
    ];

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/pricing_plans`, {
            method: 'POST',
            headers: { ...headers, 'Prefer': 'resolution=merge-duplicates' },
            body: JSON.stringify(plans)
        });
        if (res.ok) console.log("✅ Pricing plans seeded/updated.");
        else console.error("❌ Failed to seed pricing plans:", await res.text());
    } catch (e) {
        console.error("❌ Error seeding pricing plans:", e.message);
    }

    // 3. Elevate Admins
    console.log("\n--- Elevating Admins ---");
    const adminEmails = ['Mudassir@admin.com', 'devmudassir@gmail.com', 'devmudassir5@gmail.com'];

    for (const email of adminEmails) {
        try {
            const res = await fetch(`${supabaseUrl}/rest/v1/profiles?email=eq.${email}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({ role: 'admin', plan: 'enterprise', credits: 9999 })
            });
            if (res.ok) {
                const updated = await res.json();
                if (updated.length > 0) console.log(`✅ ${email} elevated to ADMIN.`);
                else console.log(`⚠️ ${email} not found in profiles table (User must sign up first).`);
            }
        } catch (e) {
            console.error(`❌ Error elevating ${email}:`, e.message);
        }
    }

    console.log("\n🏁 Setup complete. If tables were missing, please run the SQL Editor script and then run this again.");
}

run();
