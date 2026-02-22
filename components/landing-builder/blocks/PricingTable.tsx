"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface PricingTableProps {
    content: {
        title: string;
        subtitle: string;
        plans: Array<{
            id?: string;
            name: string;
            price: string;
            features: string[];
            ctaText: string;
            isPopular?: boolean;
        }>;
        dynamic?: boolean;
    };
}

export const PricingTable: React.FC<PricingTableProps> = ({ content }) => {
    const [plans, setPlans] = useState(content.plans);
    const supabase = createClient();

    useEffect(() => {
        if (content.dynamic) {
            const fetchPlans = async () => {
                const { data } = await supabase
                    .from("pricing_plans")
                    .select("*")
                    .eq("is_active", true)
                    .order("sort_order", { ascending: true });

                if (data) {
                    setPlans(data.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: `$${p.price_monthly}`,
                        features: p.features,
                        ctaText: "Get Started",
                        isPopular: p.name === "Pro"
                    })));
                }
            };
            fetchPlans();
        }
    }, [content.dynamic]);

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                    {content.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
                    {content.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`p-8 rounded-3xl border flex flex-col ${plan.isPopular
                                ? "bg-card border-primary ring-4 ring-primary/10 relative"
                                : "bg-card border-border"
                                }`}
                        >
                            {plan.isPopular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                    Most Popular
                                </span>
                            )}
                            <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                            <div className="text-4xl font-black text-foreground mb-6">
                                {plan.price}<span className="text-lg font-medium text-muted-foreground">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1 text-left">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm">
                                        <span className="text-primary font-bold text-lg">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            {plan.id ? (
                                <Link
                                    href={`/checkout/${plan.id}`}
                                    className={`w-full py-4 rounded-xl font-bold transition-all text-center ${plan.isPopular ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105" : "bg-muted text-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    {plan.ctaText}
                                </Link>
                            ) : (
                                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.isPopular ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-foreground"
                                    }`}>
                                    {plan.ctaText}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
