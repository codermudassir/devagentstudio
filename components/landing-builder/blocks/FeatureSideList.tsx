"use client";

import React from "react";

interface FeatureSideListProps {
    content: {
        title: string;
        subtitle: string;
        imageUrl: string;
        items: string[];
        reverse?: boolean;
    };
}

export const FeatureSideList: React.FC<FeatureSideListProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                <div className={`flex-1 ${content.reverse ? "lg:order-2" : ""}`}>
                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-border">
                        <img src={content.imageUrl} alt={content.title} className="w-full h-auto" />
                    </div>
                </div>
                <div className="flex-1">
                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">{content.title}</h2>
                    <p className="text-lg text-muted-foreground mb-8">{content.subtitle}</p>
                    <ul className="space-y-4">
                        {content.items.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-4 text-foreground font-medium">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
