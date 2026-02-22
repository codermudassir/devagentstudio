"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";

interface LowCreditsWarningProps {
    credits: number;
}

export default function LowCreditsWarning({ credits }: LowCreditsWarningProps) {
    if (credits > 0) return null;

    return (
        <div
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl p-5 animate-slide-up"
            style={{
                background: "hsl(0 0% 12%)",
                border: "1px solid hsl(0 75% 55% / 0.5)",
                boxShadow: "0 0 40px hsl(0 75% 55% / 0.2)",
            }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(0 75% 55% / 0.15)" }}
                >
                    <AlertTriangle className="w-4 h-4" style={{ color: "hsl(0 75% 55%)" }} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">You&apos;ve run out of credits</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">
                        Upgrade your plan to continue using AI agents and unlock more features.
                    </p>
                    <div className="flex gap-2">
                        <Link
                            href="/pricing"
                            className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg text-black"
                            style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                        >
                            View Pricing
                        </Link>
                        <Link
                            href="/dashboard"
                            className="py-2 px-3 text-xs rounded-lg text-muted-foreground hover:text-foreground"
                            style={{ background: "hsl(0 0% 16%)", border: "1px solid hsl(0 0% 22%)" }}
                        >
                            Later
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
