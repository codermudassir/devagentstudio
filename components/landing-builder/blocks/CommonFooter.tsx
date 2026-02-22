"use client";

import React from "react";
import Link from "next/link";

interface CommonFooterProps {
    config?: {
        enabled?: boolean;
        logoText?: string;
        copyright?: string;
    };
}

export const CommonFooter: React.FC<CommonFooterProps> = ({ config = {} }) => {
    const {
        enabled = true,
        logoText = "My Dev Agents",
        copyright = `© ${new Date().getFullYear()} All rights reserved.`
    } = config;

    if (!enabled) return null;

    return (
        <footer className="py-20 px-6 bg-card border-t border-border">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="text-center md:text-left">
                        <Link href="/" className="text-2xl font-black tracking-tighter uppercase italic block mb-4">
                            {logoText.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? "text-primary not-italic" : ""}>{word} </span>
                            ))}
                        </Link>
                        <p className="text-muted-foreground text-sm font-medium opacity-60">
                            The world's most advanced AI agent platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-primary">Features</a></li>
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-primary">Integrations</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-primary">About</a></li>
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-primary">Careers</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-primary">Docs</a></li>
                                <li><a href="#" className="text-xs text-muted-foreground hover:text-primary">Help</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                        {copyright}
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Privacy</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
