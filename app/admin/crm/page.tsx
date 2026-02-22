"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Activity, User } from "lucide-react";

type ActivityLog = {
    id: string;
    user_id: string;
    user_email: string | null;
    action: string;
    metadata: Record<string, unknown>;
    created_at: string;
};

const ACTION_LABELS: Record<string, string> = {
    first_login: "First Login",
    login: "Login",
    admin_profile_update: "Profile Updated by Admin",
    admin_credits_adjustment: "Credits Adjusted by Admin",
    chat_message: "Chat Message",
};

const ACTION_COLORS: Record<string, string> = {
    first_login: "hsl(142 71% 45%)",
    login: "hsl(217 91% 60%)",
    admin_profile_update: "hsl(38 92% 50%)",
    admin_credits_adjustment: "hsl(280 80% 60%)",
    chat_message: "hsl(0 0% 60%)",
};

export default function AdminCRMPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("all");

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/activity?limit=200");
        const data = await res.json();
        setLogs(data.logs ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const filtered = logs.filter((l) => {
        const matchSearch =
            !search || l.user_email?.toLowerCase().includes(search.toLowerCase());
        const matchAction = actionFilter === "all" || l.action === actionFilter;
        return matchSearch && matchAction;
    });

    const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

    function formatTime(ts: string) {
        return new Date(ts).toLocaleString("en-US", {
            month: "short", day: "numeric", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    }

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">CRM – User Activity</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {logs.length} events tracked
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1" style={{ maxWidth: 360 }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter by user email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg text-foreground placeholder:text-muted-foreground outline-none"
                        style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
                    />
                </div>
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="px-4 py-2.5 text-sm rounded-lg text-foreground outline-none"
                    style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
                >
                    <option value="all">All Actions</option>
                    {uniqueActions.map((a) => (
                        <option key={a} value={a}>{ACTION_LABELS[a] ?? a}</option>
                    ))}
                </select>
                <button
                    onClick={fetchLogs}
                    className="px-4 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
                >
                    Refresh
                </button>
            </div>

            {/* Log Table */}
            <div
                className="rounded-xl overflow-hidden"
                style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
            >
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ background: "hsl(0 0% 8%)", borderBottom: "1px solid hsl(0 0% 16%)" }}>
                            {["User", "Action", "Details", "Time"].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-muted-foreground">Loading activity…</td>
                            </tr>
                        )}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-muted-foreground">No activity found</td>
                            </tr>
                        )}
                        {filtered.map((log) => {
                            const color = ACTION_COLORS[log.action] ?? "hsl(0 0% 55%)";
                            return (
                                <tr
                                    key={log.id}
                                    style={{ borderBottom: "1px solid hsl(0 0% 13%)" }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                style={{ background: "hsl(0 0% 18%)" }}
                                            >
                                                {log.user_email?.[0]?.toUpperCase() ?? <User className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className="text-xs text-muted-foreground truncate max-w-[160px]">{log.user_email ?? "Unknown"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                                            style={{ color, background: `${color}/0.1`, border: `1px solid ${color}/0.2` }}
                                        >
                                            {ACTION_LABELS[log.action] ?? log.action.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {Object.keys(log.metadata ?? {}).length > 0
                                            ? Object.entries(log.metadata)
                                                .filter(([k]) => !["updated_by"].includes(k))
                                                .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
                                                .join(", ")
                                            : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatTime(log.created_at)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
