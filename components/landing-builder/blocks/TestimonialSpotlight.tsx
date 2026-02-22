"use client";

import React from "react";

interface TestimonialSpotlightProps {
    content: {
        quote: string;
        author: string;
        role: string;
        avatar?: string;
    };
}

export const TestimonialSpotlight: React.FC<TestimonialSpotlightProps> = ({ content }) => {
    return (
        <section className="py-24 bg-primary/5 border-y border-primary/10">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <div className="text-6xl text-primary/20 mb-8 font-serif">"</div>
                <blockquote className="text-2xl lg:text-4xl font-medium text-foreground mb-12 leading-relaxed italic">
                    {content.quote}
                </blockquote>
                <div className="flex flex-col items-center gap-4">
                    {content.avatar ? (
                        <img src={content.avatar} alt={content.author} className="w-20 h-20 rounded-full object-cover shadow-xl border-4 border-background" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary shadow-xl border-4 border-background">
                            {content.author[0]}
                        </div>
                    )}
                    <div>
                        <div className="text-xl font-bold text-foreground">{content.author}</div>
                        <div className="text-muted-foreground">{content.role}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};
