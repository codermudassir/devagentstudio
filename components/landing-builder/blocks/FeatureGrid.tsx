"use client";

import React from "react";

interface FeatureGridProps {
    content: {
        title: string;
        subtitle: string;
        features: Array<{
            title: string;
            description: string;
            icon?: string;
        }>;
    };
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background/50 border-y border-border">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">
                    {content.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
                    {content.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.features.map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors text-left group">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform text-2xl">
                                {feature.icon || "✨"}
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
