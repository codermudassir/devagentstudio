"use client";

import React from "react";

interface LogoCloudProps {
    content: {
        title: string;
        logos: string[];
    };
}

export const LogoCloud: React.FC<LogoCloudProps> = ({ content }) => {
    return (
        <section className="py-16 bg-muted/20">
            <div className="container mx-auto px-6">
                <p className="text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-10">
                    {content.title}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                    {content.logos.map((logo, idx) => (
                        <img key={idx} src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                    ))}
                </div>
            </div>
        </section>
    );
};
