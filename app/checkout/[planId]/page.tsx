"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Check, Shield, Zap, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push("/login?redirect=/checkout/" + params.planId);
                return;
            }

            // Fetch profile for credits
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", authUser.id)
                .single();

            setUser({ ...authUser, ...profile });

            // VALIDATE PLAN ID - SINGLE SOURCE OF TRUTH
            const { data: planData, error: planError } = await supabase
                .from("pricing_plans")
                .select("*")
                .eq("id", params.planId)
                .eq("is_active", true)
                .single();

            if (planError || !planData) {
                setError("Invalid or inactive plan selected.");
                setLoading(false);
                return;
            }

            setPlan(planData);
            setLoading(false);
        }
        loadData();
    }, [params.planId]);

    const handleCheckout = async () => {
        setProcessing(true);
        // Simulate Payment Gateway Integration
        await new Promise(r => setTimeout(r, 2000));

        // On Success: Update User Profile
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                plan: plan.name.toLowerCase(),
                credits: (user?.credits || 0) + (plan.credits || 0)
            })
            .eq("id", user.id);

        if (profileError) {
            toast.error("Error updating plan: " + profileError.message);
            setProcessing(false);
            return;
        }

        // Log Activity
        await supabase.from("activity_logs").insert({
            user_id: user.id,
            user_email: user.email,
            action: "purchase_plan",
            metadata: { plan_id: plan.id, plan_name: plan.name, amount: plan.price_monthly }
        });

        toast.success("Welcome to " + plan.name + "! Your credits have been updated.");
        router.push("/dashboard");
        setProcessing(false);
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Securing Checkout...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mb-6" />
            <h1 className="text-3xl font-black text-foreground mb-4 uppercase">Something went wrong</h1>
            <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
            <button onClick={() => router.push("/pricing")} className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold">Return to Pricing</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background p-6 lg:p-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Plan Summary */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black text-foreground mb-4">Complete your order</h1>
                        <p className="text-muted-foreground text-lg italic">Unlock the full power of AI-driven agents</p>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-card border border-border shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-2">Selected Plan</h2>
                            <h3 className="text-3xl font-black text-foreground mb-4">{plan.name}</h3>
                            <div className="text-5xl font-black text-foreground mb-8">
                                ${plan.price_monthly}<span className="text-lg font-medium text-muted-foreground">/mo</span>
                            </div>
                            <ul className="space-y-4">
                                {(Array.isArray(plan.features) ? plan.features : []).map((f: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                                        <Check className="w-5 h-5 text-emerald-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                        <Shield className="w-6 h-6 text-primary" />
                        <span className="text-sm text-muted-foreground font-medium">Secure SSL Checkout & AES-256 Encryption</span>
                    </div>
                </div>

                {/* Checkout Details */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-2xl">
                        <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-primary" /> Payment Method
                        </h3>

                        <div className="space-y-6 mb-10">
                            <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                                <span className="font-bold text-foreground">Credit Card</span>
                                <div className="flex gap-2">
                                    <div className="w-8 h-5 bg-white/20 rounded-md" />
                                    <div className="w-8 h-5 bg-white/20 rounded-md" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cardholder Name</label>
                                    <input className="w-full px-5 py-3.5 rounded-xl bg-background border border-border outline-none transition-all placeholder:opacity-30" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Card Number</label>
                                    <input className="w-full px-5 py-3.5 rounded-xl bg-background border border-border outline-none transition-all placeholder:opacity-30" placeholder="0000 0000 0000 0000" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expiry</label>
                                        <input className="w-full px-5 py-3.5 rounded-xl bg-background border border-border outline-none transition-all placeholder:opacity-30" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CVC</label>
                                        <input className="w-full px-5 py-3.5 rounded-xl bg-background border border-border outline-none transition-all placeholder:opacity-30" placeholder="***" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={processing}
                            className="w-full py-5 rounded-2xl font-black bg-primary text-primary-foreground hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {processing ? (
                                <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
                            ) : (
                                <><Zap className="w-6 h-6" /> Pay ${plan.price_monthly} & Upgrade</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
