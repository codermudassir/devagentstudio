"use client";

import React, { useState } from "react";

interface FAQAccordionProps {
    content: {
        title: string;
        faqs: Array<{ question: string; answer: string }>;
    };
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ content }) => {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <section className="py-24 bg-background/50">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-12 text-center">
                    {content.title}
                </h2>
                <div className="space-y-4">
                    {content.faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-border bg-card overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-semibold text-foreground">{faq.question}</span>
                                <span className={`text-2xl transition-transform ${openIdx === idx ? "rotate-45" : ""}`}>+</span>
                            </button>
                            {openIdx === idx && (
                                <div className="p-6 pt-0 text-muted-foreground leading-relaxed animate-fade-in">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
