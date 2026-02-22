"use client";

import React from "react";

interface StatsBentoProps {
    content: {
        stats: Array<{ label: string; value: string; desc: string }>;
    };
}

export const StatsBento: React.FC<StatsBentoProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {content.stats.map((stat, idx) => (
                        <div key={idx} className="p-10 rounded-3xl bg-card border border-border flex flex-col justify-center text-center hover:scale-[1.02] transition-transform">
                            <div className="text-4xl lg:text-5xl font-black text-primary mb-2">{stat.value}</div>
                            <div className="text-lg font-bold text-foreground mb-1">{stat.label}</div>
                            <div className="text-sm text-muted-foreground">{stat.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
