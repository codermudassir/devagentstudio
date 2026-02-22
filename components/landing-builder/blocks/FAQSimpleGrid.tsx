"use client";

import React from "react";

interface FAQSimpleGridProps {
    content: {
        title: string;
        subtitle: string;
        faqs: Array<{ question: string; answer: string }>;
    };
}

export const FAQSimpleGrid: React.FC<FAQSimpleGridProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">{content.title}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{content.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {content.faqs.map((faq, idx) => (
                        <div key={idx} className="space-y-3">
                            <h3 className="text-xl font-bold text-foreground">{faq.question}</h3>
                            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
