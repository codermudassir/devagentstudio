"use client";

import React from "react";

interface FooterUnifiedProps {
    content: {
        companyName: string;
        links: Array<{ name: string; url: string }>;
        tagline: string;
    };
}

export const FooterUnified: React.FC<FooterUnifiedProps> = ({ content }) => {
    return (
        <footer className="py-20 bg-card border-t border-border">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-foreground mb-2">{content.companyName}</h2>
                        <p className="text-muted-foreground max-w-xs">{content.tagline}</p>
                    </div>
                    <nav className="flex flex-wrap items-center justify-center gap-8">
                        {content.links.map((link, idx) => (
                            <a key={idx} href={link.url} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                {link.name}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="pt-8 border-t border-border text-xs text-muted-foreground text-center md:text-left">
                    © {new Date().getFullYear()} {content.companyName}. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
