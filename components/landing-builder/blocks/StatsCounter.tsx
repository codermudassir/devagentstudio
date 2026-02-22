"use client";

import React from "react";

interface StatsCounterProps {
    content: {
        stats: Array<{ label: string; value: string; color?: string }>;
    };
}

export const StatsCounter: React.FC<StatsCounterProps> = ({ content }) => {
    return (
        <section className="py-20 bg-card border-y border-border">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-12 lg:gap-32">
                    {content.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                            <div
                                className="text-5xl lg:text-7xl font-black mb-2"
                                style={{ color: stat.color || "hsl(var(--primary))" }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
