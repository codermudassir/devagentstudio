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

// This script is limited in what it can do via REST. 
// Adding a column via REST API is NOT possible.
// The user MUST run the SQL in the dashboard.
console.log("⚠️  REST API cannot add columns to tables.");
console.log("👉 ACTION REQUIRED: Run the following SQL in your Supabase SQL Editor:");
console.log(`
ALTER TABLE public.landing_pages ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]';
NOTIFY pgrst, 'reload schema';
`);
