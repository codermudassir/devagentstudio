"use client";

import React from "react";

interface HeroCenteredProps {
    content: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
    };
}

export const HeroCentered: React.FC<HeroCenteredProps> = ({ content }) => {
    return (
        <section className="py-24 lg:py-40 bg-background text-center">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-5xl lg:text-7xl font-black text-foreground mb-8 leading-[1.1]">
                    {content.title}
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                    {content.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href={content.ctaLink}
                        className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold bg-foreground text-background hover:scale-105 transition-transform text-lg"
                    >
                        {content.ctaText}
                    </a>
                </div>
            </div>
        </section>
    );
};
