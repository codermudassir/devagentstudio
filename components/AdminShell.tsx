"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

interface AdminShellProps {
    children: React.ReactNode;
    adminEmail?: string | null;
}

export default function AdminShell({ children, adminEmail }: AdminShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
                style={{ background: "hsl(0 0% 10%)", border: "1px solid hsl(0 0% 18%)" }}
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-30"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden
                />
            )}

            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                adminEmail={adminEmail}
            />

            <main className="flex-1 lg:ml-64 min-h-screen overflow-auto">
                {children}
            </main>
        </div>
    );
}
