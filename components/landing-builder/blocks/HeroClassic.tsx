"use client";

import React from "react";

interface HeroClassicProps {
    content: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
        imageUrl: string;
    };
}

export const HeroClassic: React.FC<HeroClassicProps> = ({ content }) => {
    return (
        <section className="py-20 lg:py-32 overflow-hidden bg-background">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                            {content.title}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0">
                            {content.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a
                                href={content.ctaLink}
                                className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all text-lg"
                            >
                                {content.ctaText}
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <img src={content.imageUrl} alt="Hero" className="w-full h-auto" />
                        </div>
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};
