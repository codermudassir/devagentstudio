"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Edit2, Trash2, CreditCard, User, X, Check } from "lucide-react";
import { toast } from "sonner";

type UserProfile = {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: "user" | "admin";
    plan: "free" | "pro" | "enterprise";
    credits: number;
    created_at: string;
    last_active: string;
};

const planColors: Record<string, string> = {
    free: "hsl(0 0% 50%)",
    pro: "hsl(217 91% 60%)",
    enterprise: "hsl(280 80% 60%)",
};

const planBgs: Record<string, string> = {
    free: "hsl(0 0% 50% / 0.1)",
    pro: "hsl(217 91% 60% / 0.1)",
    enterprise: "hsl(280 80% 60% / 0.1)",
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [editUser, setEditUser] = useState<UserProfile | null>(null);
    const [creditModal, setCreditModal] = useState<UserProfile | null>(null);
    const [creditAmount, setCreditAmount] = useState("");
    const [creditOp, setCreditOp] = useState<"add" | "set">("add");
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const filtered = users.filter((u) => {
        const matchSearch =
            !search ||
            u.email?.toLowerCase().includes(search.toLowerCase()) ||
            u.full_name?.toLowerCase().includes(search.toLowerCase());
        const matchPlan = planFilter === "all" || u.plan === planFilter;
        return matchSearch && matchPlan;
    });

    async function handleSaveEdit() {
        if (!editUser) return;
        setSaving(true);
        const res = await fetch(`/api/admin/users/${editUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: editUser.full_name, role: editUser.role, plan: editUser.plan }),
        });
        if (res.ok) {
            toast.success("User updated");
            setEditUser(null);
            fetchUsers();
        } else {
            toast.error("Failed to update user");
        }
        setSaving(false);
    }

    async function handleAdjustCredits() {
        if (!creditModal) return;
        const amount = parseFloat(creditAmount);
        if (isNaN(amount)) { toast.error("Enter a valid number"); return; }
        setSaving(true);
        const res = await fetch(`/api/admin/users/${creditModal.id}/credits`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, operation: creditOp }),
        });
        if (res.ok) {
            const data = await res.json();
            toast.success(`Credits updated to ${data.credits}`);
            setCreditModal(null);
            setCreditAmount("");
            fetchUsers();
        } else {
            toast.error("Failed to adjust credits");
        }
        setSaving(false);
    }

    async function handleDelete(userId: string) {
        const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("User deleted");
            setDeleteConfirm(null);
            fetchUsers();
        } else {
            toast.error("Failed to delete user");
        }
    }

    function formatDate(ts: string) {
        return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-sm text-muted-foreground mt-1">{users.length} total users</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div
                    className="relative flex-1"
                    style={{ maxWidth: 360 }}
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by email or name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:ring-1"
                        style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
                    />
                </div>
                <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="px-4 py-2.5 text-sm rounded-lg text-foreground outline-none"
                    style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
                >
                    <option value="all">All Plans</option>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                </select>
            </div>

            {/* Table */}
            <div
                className="rounded-xl overflow-hidden"
                style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 16%)" }}
            >
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: "1px solid hsl(0 0% 16%)", background: "hsl(0 0% 8%)" }}>
                            {["User", "Plan", "Credits", "Role", "Joined", "Last Active", "Actions"].map((h) => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-muted-foreground">Loading users…</td>
                            </tr>
                        )}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-muted-foreground">No users found</td>
                            </tr>
                        )}
                        {filtered.map((u) => (
                            <tr
                                key={u.id}
                                className="transition-colors"
                                style={{ borderBottom: "1px solid hsl(0 0% 13%)" }}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {u.avatar_url ? (
                                            <img src={u.avatar_url} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt="" />
                                        ) : (
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                style={{ background: "hsl(0 0% 18%)" }}
                                            >
                                                {u.email?.[0]?.toUpperCase() ?? <User className="w-3.5 h-3.5" />}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium text-foreground truncate">{u.full_name || "—"}</p>
                                            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                                        style={{ color: planColors[u.plan], background: planBgs[u.plan] }}
                                    >
                                        {u.plan}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="font-mono text-sm font-semibold"
                                        style={{ color: u.credits <= 5 ? "hsl(0 75% 55%)" : u.credits <= 20 ? "hsl(38 92% 50%)" : "hsl(142 71% 45%)" }}
                                    >
                                        {u.credits}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className="px-2 py-0.5 rounded text-xs"
                                        style={u.role === "admin" ? { color: "hsl(38 92% 50%)", background: "hsl(38 92% 50% / 0.1)" } : { color: "hsl(0 0% 60%)", background: "hsl(0 0% 14%)" }}
                                    >
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.created_at)}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(u.last_active)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditUser({ ...u })}
                                            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                            title="Edit user"
                                            style={{ background: "hsl(0 0% 13%)" }}
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => { setCreditModal(u); setCreditAmount(""); }}
                                            className="p-1.5 rounded-md transition-colors"
                                            title="Adjust credits"
                                            style={{ background: "hsl(38 92% 50% / 0.1)", color: "hsl(38 92% 50%)" }}
                                        >
                                            <CreditCard className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(u.id)}
                                            className="p-1.5 rounded-md transition-colors"
                                            title="Delete user"
                                            style={{ background: "hsl(0 75% 55% / 0.1)", color: "hsl(0 75% 55%)" }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-foreground">Edit User</h2>
                            <button onClick={() => setEditUser(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Full Name</label>
                                <input
                                    value={editUser.full_name ?? ""}
                                    onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                    style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Plan</label>
                                <select
                                    value={editUser.plan}
                                    onChange={(e) => setEditUser({ ...editUser, plan: e.target.value as "free" | "pro" | "enterprise" })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                    style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                >
                                    <option value="free">Free</option>
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Role</label>
                                <select
                                    value={editUser.role}
                                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value as "user" | "admin" })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                    style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 text-sm rounded-lg text-muted-foreground" style={{ background: "hsl(0 0% 14%)" }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="flex-1 py-2.5 text-sm rounded-lg font-medium text-white flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                            >
                                {saving ? "Saving…" : <><Check className="w-4 h-4" /> Save</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credits Modal */}
            {creditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-foreground">Adjust Credits</h2>
                            <button onClick={() => setCreditModal(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Current credits: <span className="font-bold text-foreground">{creditModal.credits}</span>
                        </p>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                {(["add", "set"] as const).map((op) => (
                                    <button
                                        key={op}
                                        onClick={() => setCreditOp(op)}
                                        className="flex-1 py-2 text-sm rounded-lg capitalize"
                                        style={creditOp === op ? { background: "hsl(38 92% 50% / 0.2)", border: "1px solid hsl(38 92% 50% / 0.5)", color: "hsl(38 92% 50%)" } : { background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)", color: "hsl(0 0% 60%)" }}
                                    >
                                        {op === "add" ? "Add / Deduct" : "Set Exact"}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                placeholder={creditOp === "add" ? "e.g. 100 or -50" : "e.g. 500"}
                                value={creditAmount}
                                onChange={(e) => setCreditAmount(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setCreditModal(null)} className="flex-1 py-2.5 text-sm rounded-lg text-muted-foreground" style={{ background: "hsl(0 0% 14%)" }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleAdjustCredits}
                                disabled={saving}
                                className="flex-1 py-2.5 text-sm rounded-lg font-medium text-white"
                                style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                            >
                                {saving ? "Saving…" : "Apply"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
                    <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}>
                        <h2 className="font-semibold text-foreground mb-2">Delete User?</h2>
                        <p className="text-sm text-muted-foreground mb-6">This action cannot be undone. The user account and all their data will be permanently removed.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 text-sm rounded-lg text-muted-foreground" style={{ background: "hsl(0 0% 14%)" }}>
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2.5 text-sm rounded-lg font-medium text-white"
                                style={{ background: "hsl(0 75% 55%)" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
