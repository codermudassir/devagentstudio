import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    const adminClient = createAdminClient();

    // 1. Fetch live activity logs for AI usage
    const { data: logs, error: logsError } = await adminClient
        .from("ai_usage_logs")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false })
        .limit(50);

    if (logsError) return NextResponse.json({ error: logsError.message }, { status: 500 });

    // 2. Aggregate stats
    const { data: statsData, error: statsError } = await adminClient
        .from("ai_usage_logs")
        .select("prompt_tokens, completion_tokens, credits_used, cost_estimate");

    if (statsError) return NextResponse.json({ error: statsError.message }, { status: 500 });

    const totalRequests = logs.length; // Actually should be count of all logs
    const totalTokens = (statsData || []).reduce((acc, curr) => acc + (curr.prompt_tokens || 0) + (curr.completion_tokens || 0), 0);
    const totalCredits = (statsData || []).reduce((acc, curr) => acc + (curr.credits_used || 0), 0);

    return NextResponse.json({
        logs,
        totalRequests: statsData.length,
        totalTokens,
        totalCredits
    });
}
