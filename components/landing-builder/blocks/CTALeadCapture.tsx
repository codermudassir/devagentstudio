"use client";

import React from "react";

interface CTALeadCaptureProps {
    content: {
        title: string;
        subtitle: string;
        placeholder: string;
        btnText: string;
    };
}

export const CTALeadCapture: React.FC<CTALeadCaptureProps> = ({ content }) => {
    return (
        <section className="py-24 bg-primary/10 rounded-3xl mx-6 mb-24 text-center p-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4">{content.title}</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{content.subtitle}</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder={content.placeholder}
                    className="flex-1 px-6 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary transition-colors text-foreground"
                />
                <button className="px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all">
                    {content.btnText}
                </button>
            </form>
        </section>
    );
};
