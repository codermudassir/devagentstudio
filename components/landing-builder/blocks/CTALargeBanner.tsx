"use client";

import React from "react";

interface CTALargeBannerProps {
    content: {
        title: string;
        subtitle: string;
        btnText: string;
        btnLink: string;
    };
}

export const CTALargeBanner: React.FC<CTALargeBannerProps> = ({ content }) => {
    return (
        <section className="py-24 container mx-auto px-6">
            <div className="bg-primary rounded-[3rem] p-12 lg:p-24 text-center text-primary-foreground relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">{content.title}</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">{content.subtitle}</p>
                    <a href={content.btnLink} className="inline-block px-10 py-5 rounded-2xl font-bold bg-foreground text-background hover:scale-105 transition-transform text-lg">
                        {content.btnText}
                    </a>
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            </div>
        </section>
    );
};
