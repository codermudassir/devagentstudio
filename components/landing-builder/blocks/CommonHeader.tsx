"use client";

import React from "react";
import Link from "next/link";

interface CommonHeaderProps {
    config?: {
        enabled?: boolean;
        layout?: "classic" | "centered" | "glass" | "minimal";
        logoText?: string;
        links?: Array<{ label: string; href: string }>;
        ctaText?: string;
    };
}

export const CommonHeader: React.FC<CommonHeaderProps> = ({ config = {} }) => {
    const {
        enabled = true,
        layout = "classic",
        logoText = "My Dev Agents",
        links = [
            { label: "Product", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "About", href: "#" }
        ],
        ctaText = "Get Started"
    } = config;

    if (!enabled) return null;

    const baseStyles = "py-6 px-6 sticky top-0 z-50 transition-all duration-300";
    const layoutStyles = {
        classic: "bg-background/80 backdrop-blur-xl border-b border-border",
        centered: "bg-background/80 backdrop-blur-xl border-b border-border text-center",
        glass: "bg-background/40 backdrop-blur-3xl m-4 rounded-[2rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] top-4 mx-6",
        minimal: "bg-transparent border-none absolute w-full"
    };

    return (
        <header className={`${baseStyles} ${layoutStyles[layout as keyof typeof layoutStyles]}`}>
            <div className={`container mx-auto flex items-center justify-between ${layout === 'centered' ? 'flex-col gap-6' : ''}`}>
                <Link href="/" className="text-xl font-black tracking-tighter uppercase italic group">
                    {logoText.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? "text-primary not-italic" : ""}>{word} </span>
                    ))}
                </Link>

                <nav className={`hidden md:flex items-center gap-8 ${layout === 'centered' ? 'order-last mt-2' : ''}`}>
                    {links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.href}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        {ctaText}
                    </button>
                </div>
            </div>
        </header>
    );
};
