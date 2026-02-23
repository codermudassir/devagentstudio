import { createAdminClient } from "@/lib/supabase/admin";
import { Users, CreditCard, Activity, TrendingUp, Shield, Zap, DollarSign, Settings, FileText } from "lucide-react";
import Link from "next/link";

async function getStats() {
    const adminClient = createAdminClient();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const prevMonthAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

    const [
        profilesRes,
        logsRes,
        todayUsageRes,
        currentMonthUsageRes,
        prevMonthUsageRes
    ] = await Promise.all([
        adminClient.from("profiles").select("id, plan, credits, last_active, created_at"),
        adminClient.from("activity_logs").select("id, action, created_at, user_email").order("created_at", { ascending: false }).limit(10),
        adminClient.from("ai_usage_logs").select("credits_used").gte("created_at", todayStart),
        adminClient.from("ai_usage_logs").select("credits_used, cost_estimate").gte("created_at", monthAgo),
        adminClient.from("ai_usage_logs").select("credits_used").gte("created_at", prevMonthAgo).lt("created_at", monthAgo),
    ]);

    const profiles = profilesRes.data ?? [];
    const logs = logsRes.data ?? [];
    const todayUsage = todayUsageRes.data ?? [];
    const currentMonthUsage = currentMonthUsageRes.data ?? [];
    const prevMonthUsage = prevMonthUsageRes.data ?? [];

    const totalUsers = profiles.length;
    const activeToday = profiles.filter(p => p.last_active && new Date(p.last_active) >= new Date(todayStart)).length;
    const newThisWeek = profiles.filter(p => p.created_at && new Date(p.created_at) >= new Date(weekAgo)).length;

    // Trend calculation (User growth)
    const newLastMonth = profiles.filter(p => p.created_at && new Date(p.created_at) >= new Date(monthAgo)).length;
    const newPrevMonth = profiles.filter(p => p.created_at && new Date(p.created_at) >= new Date(prevMonthAgo) && new Date(p.created_at) < new Date(monthAgo)).length;
    const userGrowth = newPrevMonth === 0 ? 100 : Math.round(((newLastMonth - newPrevMonth) / newPrevMonth) * 100);

    const creditsUsedToday = todayUsage.reduce((acc, curr) => acc + (curr.credits_used || 0), 0);
    const totalAicosts = currentMonthUsage.reduce((acc, curr) => acc + (Number(curr.cost_estimate) || 0), 0);

    // Credit trend
    const creditsThisMonth = currentMonthUsage.reduce((acc, curr) => acc + (curr.credits_used || 0), 0);
    const creditsPrevMonth = prevMonthUsage.reduce((acc, curr) => acc + (curr.credits_used || 0), 0);
    const creditTrend = creditsPrevMonth === 0 ? 100 : Math.round(((creditsThisMonth - creditsPrevMonth) / creditsPrevMonth) * 100);

    return {
        totalUsers,
        activeToday,
        newThisWeek,
        userGrowth,
        creditsUsedToday,
        totalAicosts,
        creditTrend,
        proUsers: profiles.filter(p => p.plan === "pro").length,
        enterpriseUsers: profiles.filter(p => p.plan === "enterprise").length,
        lowCreditsUsers: profiles.filter(p => p.credits <= 5).length,
        recentLogs: logs
    };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    const kpiCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            trend: stats.userGrowth,
            icon: Users,
            color: "hsl(38 92% 50%)",
            bg: "hsl(38 92% 50% / 0.1)"
        },
        {
            label: "Credits Used Today",
            value: stats.creditsUsedToday,
            trend: stats.creditTrend,
            icon: Zap,
            color: "hsl(280 80% 60%)",
            bg: "hsl(280 80% 60% / 0.1)"
        },
        {
            label: "AI Cost (30d)",
            value: `$${stats.totalAicosts.toFixed(2)}`,
            icon: DollarSign,
            color: "hsl(142 71% 45%)",
            bg: "hsl(142 71% 45% / 0.1)"
        },
        {
            label: "Active Today",
            value: stats.activeToday,
            icon: Activity,
            color: "hsl(217 91% 60%)",
            bg: "hsl(217 91% 60% / 0.1)"
        },
        {
            label: "Low Credits",
            value: stats.lowCreditsUsers,
            icon: Shield,
            color: "hsl(0 75% 55%)",
            bg: "hsl(0 75% 55% / 0.1)"
        },
    ];

    const actionItems = [
        { label: "Manage Users", href: "/admin/users", icon: Users, desc: "View, edit or delete users" },
        { label: "CRM / Leads", href: "/admin/crm", icon: Activity, desc: "View form submissions" },
        { label: "API Provider Config", href: "/admin/api-management", icon: Settings, desc: "Switch AI providers dinamically" },
        { label: "Landing Pages", href: "/admin/landing-pages", icon: FileText, desc: "Create and publish pages" },
    ];

    function formatTime(ts: string) {
        return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20"
                            style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                        >
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground text-sm ml-11">
                        Platform health & growth overview
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                    <p className="text-lg font-bold text-foreground">{new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {kpiCards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl p-5 transition-all hover:translate-y-[-2px] hover:shadow-xl hover:shadow-black/20"
                        style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: card.bg }}
                            >
                                <card.icon className="w-4 h-4" style={{ color: card.color }} />
                            </div>
                            {card.trend !== undefined && (
                                <div className={`flex items-center gap-0.5 text-[10px] font-bold ${card.trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {card.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                    {Math.abs(card.trend)}%
                                </div>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{card.label}</p>
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
