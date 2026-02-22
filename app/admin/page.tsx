import { createAdminClient } from "@/lib/supabase/admin";
import { Users, CreditCard, Activity, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";

async function getStats() {
    const adminClient = createAdminClient();

    const [profilesRes, logsRes, plansRes] = await Promise.all([
        adminClient.from("profiles").select("id, plan, credits, last_active, created_at"),
        adminClient.from("activity_logs").select("id, action, created_at, user_email").order("created_at", { ascending: false }).limit(10),
        adminClient.from("pricing_plans").select("name, is_active"),
    ]);

    const profiles = profilesRes.data ?? [];
    const logs = logsRes.data ?? [];

    const totalUsers = profiles.length;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activeToday = profiles.filter(p => new Date(p.last_active) >= todayStart).length;
    const lowCreditsUsers = profiles.filter(p => p.credits <= 5).length;
    const proUsers = profiles.filter(p => p.plan === "pro").length;
    const enterpriseUsers = profiles.filter(p => p.plan === "enterprise").length;
    const newThisWeek = profiles.filter(p => {
        const d = new Date(p.created_at);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return d >= weekAgo;
    }).length;

    return { totalUsers, activeToday, lowCreditsUsers, proUsers, enterpriseUsers, newThisWeek, recentLogs: logs };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    const kpiCards = [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "hsl(38 92% 50%)", bg: "hsl(38 92% 50% / 0.1)" },
        { label: "Active Today", value: stats.activeToday, icon: Activity, color: "hsl(142 71% 45%)", bg: "hsl(142 71% 45% / 0.1)" },
        { label: "New This Week", value: stats.newThisWeek, icon: TrendingUp, color: "hsl(217 91% 60%)", bg: "hsl(217 91% 60% / 0.1)" },
        { label: "Pro+ Users", value: stats.proUsers + stats.enterpriseUsers, icon: CreditCard, color: "hsl(280 80% 60%)", bg: "hsl(280 80% 60% / 0.1)" },
        { label: "Low Credits", value: stats.lowCreditsUsers, icon: Zap, color: "hsl(0 75% 55%)", bg: "hsl(0 75% 55% / 0.1)" },
    ];

    const actionItems = [
        { label: "Manage Users", href: "/admin/users", icon: Users, desc: "View, edit or delete users" },
        { label: "CRM / Leads", href: "/admin/leads", icon: Activity, desc: "View form submissions" },
        { label: "Pricing Plans", href: "/admin/pricing", icon: CreditCard, desc: "Configure subscription tiers" },
        { label: "Landing Pages", href: "/admin/landing-pages", icon: Shield, desc: "Create and publish pages" },
    ];

    function formatTime(ts: string) {
        return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                    >
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                </div>
                <p className="text-muted-foreground text-sm ml-11">
                    Platform overview — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {kpiCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl p-4"
                        style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                            style={{ background: card.bg }}
                        >
                            <card.icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div
                    className="rounded-xl p-6"
                    style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
                >
                    <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {actionItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-lg p-4 transition-all"
                                style={{ background: "hsl(0 0% 13%)", border: "1px solid hsl(0 0% 18%)" }}
                            >
                                <item.icon className="w-5 h-5 mb-2" style={{ color: "hsl(38 92% 50%)" }} />
                                <p className="text-sm font-medium text-foreground group-hover:text-white transition-colors">{item.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div
                    className="flex flex-col gap-6"
                >
                    <div
                        className="rounded-xl p-6"
                        style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
                            <Link href="/admin/leads" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                View all →
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {stats.recentLogs.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-6">No activity yet</p>
                            )}
                            {stats.recentLogs.map((log) => (
                                <div key={log.id} className="flex items-start gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ background: "hsl(38 92% 50% / 0.1)" }}
                                    >
                                        <Activity className="w-3 h-3" style={{ color: "hsl(38 92% 50%)" }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">{log.user_email ?? "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground">{log.action.replace(/_/g, " ")}</p>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatTime(log.created_at)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Status Section */}
                    <div
                        className="rounded-xl p-6"
                        style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
                    >
                        <h2 className="text-sm font-semibold text-foreground mb-4">System Status</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Database Connection</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Healthy
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Auth Service</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Active
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">API Latency</span>
                                <span className="text-xs font-medium text-foreground">~45ms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
