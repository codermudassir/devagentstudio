"use client";

import React from "react";

interface TestimonialGridProps {
    content: {
        title: string;
        testimonials: Array<{ quote: string; author: string; role: string; avatar?: string }>;
    };
}

export const TestimonialGrid: React.FC<TestimonialGridProps> = ({ content }) => {
    return (
        <section className="py-24 bg-muted/10">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl lg:text-5xl font-bold text-center text-foreground mb-16">{content.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.testimonials.map((t, idx) => (
                        <div key={idx} className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col">
                            <p className="text-lg text-foreground mb-8 italic flex-1">"{t.quote}"</p>
                            <div className="flex items-center gap-4">
                                {t.avatar ? (
                                    <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                        {t.author[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-foreground">{t.author}</div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
