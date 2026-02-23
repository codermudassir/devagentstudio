"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Activity,
    DollarSign,
    FileText,
    Bot,
    LogOut,
    Shield,
    ChevronRight,
    Settings,
    Cpu,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/crm", label: "CRM / Activity", icon: Activity },
    { href: "/admin/ai-monitoring", label: "AI Monitoring", icon: Cpu },
    { href: "/admin/api-management", label: "API Management", icon: Settings },
    { href: "/admin/pricing", label: "Pricing Plans", icon: DollarSign },
    { href: "/admin/landing-pages", label: "Landing Pages", icon: FileText },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    adminEmail?: string | null;
}

export default function AdminSidebar({ isOpen, onClose, adminEmail }: AdminSidebarProps) {
    const pathname = usePathname();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            style={{ background: "hsl(0 0% 6%)", borderRight: "1px solid hsl(0 0% 14%)" }}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="p-6" style={{ borderBottom: "1px solid hsl(0 0% 14%)" }}>
                    <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))" }}
                        >
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-foreground">Admin Panel</h2>
                            <p className="text-xs text-muted-foreground">My Dev Agents</p>
                        </div>
                    </Link>
                </div>

                {/* Back to app */}
                <div className="px-4 pt-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-md transition-colors"
                        style={{ background: "hsl(0 0% 10%)" }}
                    >
                        <Bot className="w-3.5 h-3.5" />
                        Back to App
                        <ChevronRight className="w-3 h-3 ml-auto" />
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-3">
                        Administration
                    </p>
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "text-white"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                                style={
                                    isActive
                                        ? {
                                            background:
                                                "linear-gradient(135deg, hsl(38 92% 50% / 0.2), hsl(25 85% 45% / 0.1))",
                                            border: "1px solid hsl(38 92% 50% / 0.3)",
                                        }
                                        : { border: "1px solid transparent" }
                                }
                            >
                                <item.icon
                                    className="w-4 h-4 flex-shrink-0"
                                    style={isActive ? { color: "hsl(38 92% 50%)" } : {}}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div className="p-4" style={{ borderTop: "1px solid hsl(0 0% 14%)" }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{
                                background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))",
                                color: "white",
                            }}
                        >
                            {adminEmail?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">Admin</p>
                            <p className="text-xs text-muted-foreground truncate">{adminEmail}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-md transition-colors"
                        style={{ background: "hsl(0 0% 10%)" }}
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
