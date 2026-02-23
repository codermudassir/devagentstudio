"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, Key, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type AIConfig = {
    id: string;
    provider: 'gemini' | 'openai' | 'openrouter';
    api_key: string;
    model_name: string;
    is_active: boolean;
    is_fallback: boolean;
    rate_limit: number;
    created_at: string;
};

export default function AdminAPIConfigPage() {
    const [configs, setConfigs] = useState<AIConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState<Partial<AIConfig> | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchConfigs = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/config");
        const data = await res.json();
        setConfigs(data.configs ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchConfigs(); }, [fetchConfigs]);

    function openNew() {
        setEditMode({ provider: 'gemini', api_key: "", model_name: "gemini-1.5-flash", is_active: false, is_fallback: false, rate_limit: 60 });
        setIsNew(true);
    }

    function openEdit(conf: AIConfig) {
        setEditMode({ ...conf });
        setIsNew(false);
    }

    async function handleSave() {
        if (!editMode?.api_key || !editMode?.model_name) {
            toast.error("API Key and Model Name are required");
            return;
        }
        setSaving(true);
        const method = isNew ? "POST" : "PATCH";
        const res = await fetch("/api/admin/config", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editMode),
        });
        if (res.ok) {
            toast.success(isNew ? "Config created" : "Config updated");
            setEditMode(null);
            fetchConfigs();
        } else {
            const err = await res.json();
            toast.error(err.error || "Failed to save configuration");
        }
        setSaving(false);
    }

    async function handleToggleActive(conf: AIConfig) {
        if (conf.is_active) return; // cannot deactivate the only active one easily here

        const res = await fetch("/api/admin/config", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: conf.id, is_active: true }),
        });
        if (res.ok) {
            toast.success(`${conf.provider} is now the active provider`);
            fetchConfigs();
        } else {
            toast.error("Failed to switch provider");
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure? This will delete this API configuration.")) return;
        const res = await fetch(`/api/admin/config?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Configuration deleted");
            fetchConfigs();
        } else {
            toast.error("Failed to delete configuration");
        }
    }

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Key className="w-6 h-6 text-amber-500" />
                        API Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage AI Providers and API Keys for the entire platform.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg font-medium text-white"
                    style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                >
                    <Plus className="w-4 h-4" />
                    Add Provider
                </button>
            </div>

            <div className="grid gap-4">
                {loading && <p className="text-sm text-muted-foreground">Loading configurations…</p>}
                {!loading && configs.length === 0 && (
                    <div className="py-12 text-center rounded-xl border border-dashed border-muted-foreground/20">
                        <p className="text-muted-foreground">No API configurations found. Add one to start using AI features.</p>
                    </div>
                )}
                {configs.map((conf) => (
                    <div
                        key={conf.id}
                        className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all"
                        style={{
                            background: "hsl(0 0% 10%)",
                            border: `1px solid ${conf.is_active ? "hsl(38 92% 50% / 0.3)" : "hsl(0 0% 16%)"}`,
                            boxShadow: conf.is_active ? "0 0 20px -10px hsl(38 92% 50% / 0.5)" : "none"
                        }}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-foreground capitalize">{conf.provider}</h3>
                                {conf.is_active && (
                                    <span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ color: "hsl(142 71% 45%)", background: "hsl(142 71% 45% / 0.1)" }}>
                                        <ShieldCheck className="w-3 h-3" />
                                        Active
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono truncate mb-2">
                                Model: <span className="text-foreground">{conf.model_name}</span>
                                <span className="mx-2 text-muted-foreground/30">|</span>
                                Key: <span className="text-foreground">••••••••{conf.api_key.slice(-4)}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => handleToggleActive(conf)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${conf.is_active ? 'cursor-default' : 'hover:bg-amber-500/10 hover:text-amber-500'}`}
                                style={conf.is_active ? { color: "hsl(142 71% 45%)", background: "hsl(142 71% 45% / 0.1)" } : { background: "hsl(0 0% 14%)", color: "hsl(0 0% 60%)" }}
                            >
                                {conf.is_active ? <Check className="w-3.5 h-3.5" /> : null}
                                {conf.is_active ? "Using this Provider" : "Switch to this"}
                            </button>
                            <button
                                onClick={() => openEdit(conf)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                style={{ background: "hsl(0 0% 14%)" }}
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            {!conf.is_active && (
                                <button
                                    onClick={() => handleDelete(conf.id)}
                                    className="p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/50"
                                    style={{ background: "hsl(0 75% 55% / 0.1)", color: "hsl(0 75% 55%)" }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit / Create Modal */}
            {editMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 16%)" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg text-foreground">{isNew ? "Register New AI Provider" : "Edit AI Configuration"}</h2>
                            <button onClick={() => setEditMode(null)}><X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /></button>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-amber-500/80">AI Provider</label>
                                <select
                                    value={editMode.provider}
                                    onChange={(e) => setEditMode({ ...editMode, provider: e.target.value as any })}
                                    className="w-full px-4 py-3 text-sm rounded-xl text-foreground outline-none border focus:border-amber-500/50 transition-colors"
                                    style={{ background: "hsl(0 0% 4%)", border: "1px solid hsl(0 0% 12%)" }}
                                >
                                    <option value="gemini">Google Gemini</option>
                                    <option value="openai">OpenAI (Direct)</option>
                                    <option value="openrouter">OpenRouter (Aggregator)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-amber-500/80">API Key</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="password"
                                        placeholder="Paste your API key here…"
                                        value={editMode.api_key ?? ""}
                                        onChange={(e) => setEditMode({ ...editMode, api_key: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 text-sm rounded-xl text-foreground outline-none border focus:border-amber-500/50 transition-colors"
                                        style={{ background: "hsl(0 0% 4%)", border: "1px solid hsl(0 0% 12%)" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 text-amber-500/80">Model Name</label>
                                <input
                                    placeholder="e.g. gemini-1.5-flash or gpt-4o"
                                    value={editMode.model_name ?? ""}
                                    onChange={(e) => setEditMode({ ...editMode, model_name: e.target.value })}
                                    className="w-full px-4 py-3 text-sm rounded-xl text-foreground outline-none border focus:border-amber-500/50 transition-colors"
                                    style={{ background: "hsl(0 0% 4%)", border: "1px solid hsl(0 0% 12%)" }}
                                />
                                <p className="text-[10px] text-muted-foreground mt-1.5 px-1">Ensure the model name is exactly what the provider expects.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "hsl(0 0% 6%)", border: "1px solid hsl(0 0% 12%)" }}>
                                    <button
                                        onClick={() => setEditMode({ ...editMode, is_fallback: !editMode.is_fallback })}
                                        className="flex-shrink-0"
                                    >
                                        {editMode.is_fallback ? <ToggleRight className="w-8 h-8 text-amber-500" /> : <ToggleLeft className="w-8 h-8 text-muted-foreground" />}
                                    </button>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-foreground">Fallback</p>
                                        <p className="text-[10px] text-muted-foreground leading-tight">Use if main fails</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl" style={{ background: "hsl(0 0% 6%)", border: "1px solid hsl(0 0% 12%)" }}>
                                    <label className="block text-[10px] font-bold text-foreground uppercase tracking-wider mb-1">Rate Limit (RPM)</label>
                                    <input
                                        type="number"
                                        value={editMode.rate_limit ?? 60}
                                        onChange={(e) => setEditMode({ ...editMode, rate_limit: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-transparent text-sm text-foreground outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setEditMode(null)}
                                className="flex-1 py-3 text-sm font-semibold rounded-xl text-white transition-colors"
                                style={{ background: "hsl(0 0% 14%)" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-3 text-sm font-bold rounded-xl text-white flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                                style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                            >
                                {saving ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                                {isNew ? "Register Provider" : "Update Config"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
