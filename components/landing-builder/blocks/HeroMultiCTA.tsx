"use client";

import React from "react";

interface HeroMultiCTAProps {
    content: {
        title: string;
        subtitle: string;
        primaryText: string;
        primaryLink: string;
        secondaryText: string;
        secondaryLink: string;
    };
}

export const HeroMultiCTA: React.FC<HeroMultiCTAProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background border-b border-border">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground mb-6">
                    {content.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-10">
                    {content.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href={content.primaryLink} className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                        {content.primaryText}
                    </a>
                    <a href={content.secondaryLink} className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-secondary text-foreground hover:bg-muted transition-all">
                        {content.secondaryText}
                    </a>
                </div>
            </div>
        </section>
    );
};
