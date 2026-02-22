"use client";

import React from "react";

interface PricingComparisonProps {
    content: {
        title: string;
        features: string[];
        plans: Array<{ name: string; price: string; values: boolean[] }>;
    };
}

export const PricingComparison: React.FC<PricingComparisonProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background overflow-x-auto">
            <div className="container mx-auto px-6 min-w-[800px]">
                <h2 className="text-3xl lg:text-5xl font-bold text-center text-foreground mb-16">{content.title}</h2>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-6 font-medium text-muted-foreground w-1/3">Features</th>
                            {content.plans.map((p, i) => (
                                <th key={i} className="py-6 px-6 text-center">
                                    <div className="text-xl font-bold text-foreground">{p.name}</div>
                                    <div className="text-primary font-black">{p.price}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {content.features.map((feature, fIdx) => (
                            <tr key={fIdx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-5 font-medium text-foreground">{feature}</td>
                                {content.plans.map((plan, pIdx) => (
                                    <td key={pIdx} className="py-5 px-6 text-center">
                                        {plan.values[fIdx] ? (
                                            <span className="text-primary text-xl font-bold">✓</span>
                                        ) : (
                                            <span className="text-muted-foreground/30 text-xl font-bold">—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
