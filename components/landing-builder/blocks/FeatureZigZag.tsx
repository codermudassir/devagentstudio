"use client";

import React from "react";

interface FeatureZigZagProps {
    content: {
        title: string;
        items: Array<{ title: string; description: string; imageUrl: string; reverse?: boolean }>;
    };
}

export const FeatureZigZag: React.FC<FeatureZigZagProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 space-y-32">
                <h2 className="text-3xl lg:text-5xl font-bold text-center text-foreground mb-12">{content.title}</h2>
                {content.items.map((item, idx) => (
                    <div key={idx} className={`flex flex-col lg:flex-row items-center gap-16 ${item.reverse ? "lg:flex-row-reverse" : ""}`}>
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold text-foreground mb-4">{item.title}</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex-1 relative">
                            <div className="rounded-3xl overflow-hidden shadow-2xl border border-border">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-auto" />
                            </div>
                            <div className="absolute -inset-10 bg-primary/5 blur-3xl -z-10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
