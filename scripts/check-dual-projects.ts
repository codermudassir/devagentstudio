import { createClient } from "@supabase/supabase-js";

const altKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYW51Y3NqcG56aGluZGhmZnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMTY0NzQsImV4cCI6MjA4Njg5MjQ3NH0.3aKy3G7AlfXBhpacQZsT0lFl2kKlvqrpHgjHdQSRwl8";

async function checkBoth() {
    const urls = [
        { name: "Active (uyuxkdv)", url: "https://fvgbgyzyrwrsnoyuxkdv.supabase.co", key: process.env.SUPABASE_SERVICE_ROLE_KEY! },
        { name: "Alt (ffyz)", url: "https://jaanucsjpnzhindhffyz.supabase.co", key: altKey }
    ];

    for (const p of urls) {
        console.log(`\n========================================`);
        console.log(`Checking ${p.name}: ${p.url}`);
        console.log(`========================================`);
        const supabase = createClient(p.url, p.key);

        console.log("TEST 1: select * (head: true)");
        const r1 = await supabase.from("profiles").select("*", { count: "exact", head: true });
        console.log("Status:", r1.status);
        console.log("Error:", r1.error ? JSON.stringify(r1.error) : "null");
        console.log("Count:", r1.count);

        console.log("\nTEST 2: select id (limit 1)");
        const r2 = await supabase.from("profiles").select("id").limit(1);
        console.log("Status:", r2.status);
        console.log("Error:", r2.error ? JSON.stringify(r2.error) : "null");
        console.log("Data:", JSON.stringify(r2.data));
    }
}

checkBoth();
