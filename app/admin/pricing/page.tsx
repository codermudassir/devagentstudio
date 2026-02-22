"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

type PricingPlan = {
    id: string;
    name: string;
    description: string | null;
    price_monthly: number;
    credits: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
};

export default function AdminPricingPage() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editPlan, setEditPlan] = useState<Partial<PricingPlan> | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [featureInput, setFeatureInput] = useState("");

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/pricing");
        const data = await res.json();
        setPlans(data.plans ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { fetchPlans(); }, [fetchPlans]);

    function openNew() {
        setEditPlan({ name: "", description: "", price_monthly: 0, credits: 50, features: [], is_active: true, sort_order: plans.length });
        setIsNew(true);
        setFeatureInput("");
    }

    function openEdit(plan: PricingPlan) {
        setEditPlan({ ...plan });
        setIsNew(false);
        setFeatureInput("");
    }

    function addFeature() {
        if (!featureInput.trim() || !editPlan) return;
        setEditPlan({ ...editPlan, features: [...(editPlan.features ?? []), featureInput.trim()] });
        setFeatureInput("");
    }

    function removeFeature(idx: number) {
        if (!editPlan) return;
        setEditPlan({ ...editPlan, features: editPlan.features?.filter((_, i) => i !== idx) });
    }

    async function handleSave() {
        if (!editPlan?.name) { toast.error("Plan name is required"); return; }
        setSaving(true);
        const method = isNew ? "POST" : "PATCH";
        const url = isNew ? "/api/admin/pricing" : `/api/admin/pricing/${editPlan.id}`;
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editPlan),
        });
        if (res.ok) {
            toast.success(isNew ? "Plan created" : "Plan updated");
            setEditPlan(null);
            fetchPlans();
        } else {
            toast.error("Failed to save plan");
        }
        setSaving(false);
    }

    async function handleToggle(plan: PricingPlan) {
        const res = await fetch(`/api/admin/pricing/${plan.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: !plan.is_active }),
        });
        if (res.ok) { toast.success(`Plan ${plan.is_active ? "deactivated" : "activated"}`); fetchPlans(); }
        else toast.error("Failed to toggle plan");
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Plan deleted"); fetchPlans(); }
        else toast.error("Failed to delete plan");
    }

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Pricing Plans</h1>
                    <p className="text-sm text-muted-foreground mt-1">{plans.length} plans configured</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg font-medium text-white"
                    style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                >
                    <Plus className="w-4 h-4" />
                    New Plan
                </button>
            </div>

            <div className="space-y-4">
                {loading && <p className="text-sm text-muted-foreground">Loading plans…</p>}
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        style={{
                            background: "hsl(0 0% 10%)",
                            border: `1px solid ${plan.is_active ? "hsl(0 0% 18%)" : "hsl(0 0% 14%)"}`,
                            opacity: plan.is_active ? 1 : 0.6,
                        }}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={plan.is_active ? { color: "hsl(142 71% 45%)", background: "hsl(142 71% 45% / 0.1)" } : { color: "hsl(0 0% 50%)", background: "hsl(0 0% 18%)" }}
                                >
                                    {plan.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span style={{ color: "hsl(38 92% 50%)" }}>${plan.price_monthly}/mo</span>
                                <span>· {plan.credits} credits</span>
                                <span>· {plan.features?.length ?? 0} features</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => handleToggle(plan)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ background: "hsl(0 0% 14%)" }}
                                title={plan.is_active ? "Deactivate" : "Activate"}
                            >
                                {plan.is_active
                                    ? <ToggleRight className="w-4 h-4" style={{ color: "hsl(142 71% 45%)" }} />
                                    : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                            </button>
                            <button
                                onClick={() => openEdit(plan)}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                                style={{ background: "hsl(0 0% 14%)" }}
                                title="Edit"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="p-2 rounded-lg transition-colors"
                                style={{ background: "hsl(0 75% 55% / 0.1)", color: "hsl(0 75% 55%)" }}
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit / Create Modal */}
            {editPlan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
                    <div className="w-full max-w-lg rounded-2xl p-6 my-8" style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-foreground">{isNew ? "Create Plan" : "Edit Plan"}</h2>
                            <button onClick={() => setEditPlan(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5">Name *</label>
                                    <input
                                        value={editPlan.name ?? ""}
                                        onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                                        className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                        style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5">Price / Month ($)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={editPlan.price_monthly ?? 0}
                                        onChange={(e) => setEditPlan({ ...editPlan, price_monthly: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                        style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Description</label>
                                <input
                                    value={editPlan.description ?? ""}
                                    onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                    style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Credits Included</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={editPlan.credits ?? 0}
                                    onChange={(e) => setEditPlan({ ...editPlan, credits: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg text-foreground outline-none"
                                    style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-muted-foreground mb-1.5">Features</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                        placeholder="Add a feature…"
                                        className="flex-1 px-3 py-2 text-sm rounded-lg text-foreground outline-none"
                                        style={{ background: "hsl(0 0% 14%)", border: "1px solid hsl(0 0% 22%)" }}
                                    />
                                    <button
                                        onClick={addFeature}
                                        className="px-3 py-2 text-sm rounded-lg"
                                        style={{ background: "hsl(38 92% 50% / 0.15)", color: "hsl(38 92% 50%)" }}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {editPlan.features?.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-md text-sm" style={{ background: "hsl(0 0% 13%)" }}>
                                            <span className="text-foreground">{f}</span>
                                            <button onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-destructive ml-2">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setEditPlan(null)} className="flex-1 py-2.5 text-sm rounded-lg text-muted-foreground" style={{ background: "hsl(0 0% 14%)" }}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-2.5 text-sm rounded-lg font-medium text-white flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                            >
                                {saving ? "Saving…" : <><Check className="w-4 h-4" /> {isNew ? "Create" : "Save"}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
