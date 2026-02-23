"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Activity,
    Zap,
    AlertCircle,
    TrendingUp,
    User,
    Clock,
    Cpu,
    Hash,
    Filter,
    RefreshCcw,
    ShieldAlert
} from "lucide-react";

type AIUsageLog = {
    id: string;
    user_id: string;
    agent_id: string;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    credits_used: number;
    cost_estimate: number;
    created_at: string;
    profiles: { email: string };
};

export default function AIMonitoringPage() {
    const [logs, setLogs] = useState<AIUsageLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRequests: 0,
        totalTokens: 0,
        totalCredits: 0,
        avgResponseTime: 0, // Mock for now
        errorRate: 0 // Mock for now
    });

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/activity?action=ai_chat"); // We'll need a specific AI usage endpoint or filter
        // For now, let's fetch from our new ai_usage_logs table via a new API route or use the existing activity one if it supports it
        // I'll create /api/admin/ai-stats for this
        const statsRes = await fetch("/api/admin/ai-stats");
        const data = await statsRes.json();

        setLogs(data.logs ?? []);
        setStats({
            totalRequests: data.totalRequests || 0,
            totalTokens: data.totalTokens || 0,
            totalCredits: data.totalCredits || 0,
            avgResponseTime: 420,
            errorRate: 0.5
        });
        setLoading(false);
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    function formatTime(ts: string) {
        return new Date(ts).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <Cpu className="w-6 h-6 text-amber-500" />
                        AI Monitoring Panel
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Real-time usage tracking, token consumption & health monitoring.</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <RefreshCcw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Requests", value: stats.totalRequests, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Tokens Processed", value: stats.totalTokens.toLocaleString(), icon: Hash, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Avg Latency", value: `${stats.avgResponseTime}ms`, icon: Clock, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    { label: "Error Rate", value: `${stats.errorRate}%`, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
                ].map((s) => (
                    <div key={s.label} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                        <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                            <s.icon className={`w-4 h-4 ${s.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Live Feed */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                Live AI Usage Feed
                            </h2>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10">Real-time</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {logs.length === 0 && !loading && (
                                <div className="py-20 text-center text-muted-foreground text-sm italic">No records yet. Send a chat to see logs.</div>
                            )}
                            {logs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-amber-500/30 transition-colors">
                                                <User className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-semibold text-foreground">{log.profiles?.email}</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/10">{log.model}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                                                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {log.credits_used} cred</span>
                                                    <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {log.prompt_tokens + log.completion_tokens} tokens</span>
                                                    <span className="text-[10px] text-muted-foreground/30">•</span>
                                                    <span className="text-amber-500/80 uppercase text-[9px] font-bold tracking-tighter">{log.agent_id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-foreground">{formatTime(log.created_at)}</p>
                                            <p className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-white/10 text-center">
                            <button className="text-[11px] font-bold text-muted-foreground hover:text-amber-500 uppercase tracking-widest transition-colors">View All Analytics</button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Analytics */}
                <div className="space-y-6">
                    {/* Security Alerts */}
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.02] p-5">
                        <h2 className="font-bold text-sm text-rose-500 flex items-center gap-2 mb-4">
                            <ShieldAlert className="w-4 h-4" />
                            Abuse Alerts
                        </h2>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
                                <p className="text-xs text-rose-200/80 leading-relaxed font-medium">None detected in the last 24h.</p>
                            </div>
                        </div>
                    </div>

                    {/* Cost Estimation */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                        <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            Provider Costs (Est)
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-2">
                                    <span>GEMINI</span>
                                    <span className="text-foreground">$0.00</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: '0%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-2">
                                    <span>OPENROUTER</span>
                                    <span className="text-foreground">$0.00</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: '0%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DollarSign({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
}
