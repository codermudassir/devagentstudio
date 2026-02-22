"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LogOut, User, Settings, HelpCircle, DollarSign, Shield, Zap, Layout } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export type NavPage = "agents" | "settings" | "help" | "pricing";

interface SidebarProps {
  userEmail: string | null;
  userFullName?: string | null;
  userAvatarUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  credits?: number;
  plan?: "free" | "pro" | "enterprise";
  isAdmin?: boolean;
}

const planColors: Record<string, string> = {
  free: "hsl(0 0% 55%)",
  pro: "hsl(217 91% 60%)",
  enterprise: "hsl(280 80% 60%)",
};

export default function Sidebar({
  userEmail,
  userFullName,
  userAvatarUrl,
  isOpen,
  onClose,
  credits = 50,
  plan = "free",
  isAdmin = false,
}: SidebarProps) {
  const pathname = usePathname();
  const activePage: NavPage = pathname.startsWith("/dashboard/chat")
    ? "agents"
    : pathname.includes("settings")
      ? "settings"
      : pathname.includes("help")
        ? "help"
        : pathname.includes("pricing")
          ? "pricing"
          : "agents";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const creditPercent = Math.min(100, (credits / 50) * 100);
  const creditsColor =
    credits === 0
      ? "hsl(0 75% 55%)"
      : credits <= 10
        ? "hsl(38 92% 50%)"
        : "hsl(142 71% 45%)";

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">My Dev Agents</h2>
              <p className="text-xs text-muted-foreground">AI-Powered Tools</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            href="/dashboard"
            icon={<Bot className="w-5 h-5" />}
            label="Agents"
            active={activePage === "agents"}
            onClick={onClose}
          />
          <NavLink
            href="/pricing"
            icon={<DollarSign className="w-5 h-5" />}
            label="Pricing"
            active={activePage === "pricing"}
            onClick={onClose}
          />
          <NavLink
            href="/dashboard/settings"
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            active={activePage === "settings"}
            onClick={onClose}
          />
          <NavLink
            href="/dashboard/help"
            icon={<HelpCircle className="w-5 h-5" />}
            label="Help & Support"
            active={activePage === "help"}
            onClick={onClose}
          />
          <NavLink
            href="/admin/landing-pages"
            icon={<Layout className="w-5 h-5" />}
            label="Landing Pages"
            active={pathname.startsWith("/admin/landing-pages")}
            onClick={onClose}
          />

          {/* Admin link */}
          {isAdmin && (
            <>
              <div className="pt-3 pb-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-4">
                  Administration
                </p>
              </div>
              <NavLink
                href="/admin"
                icon={<Shield className="w-5 h-5" style={{ color: "hsl(38 92% 50%)" }} />}
                label="Admin Panel"
                active={pathname.startsWith("/admin")}
                onClick={onClose}
                highlight
              />
            </>
          )}
        </nav>

        {/* Credits card */}
        <div className="px-4 pb-2">
          <div
            className="rounded-xl p-3"
            style={{ background: "hsl(0 0% 12%)", border: "1px solid hsl(0 0% 18%)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" style={{ color: creditsColor }} />
                <span className="text-xs font-semibold text-foreground">{credits} credits</span>
              </div>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full capitalize"
                style={{ color: planColors[plan], background: `${planColors[plan]}18` }}
              >
                {plan}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "hsl(0 0% 22%)" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${creditPercent}%`, background: creditsColor }}
              />
            </div>
            {credits <= 10 && (
              <Link
                href="/pricing"
                className="mt-2 block text-center text-[10px] font-medium py-1 rounded-md transition-colors"
                style={{ color: "hsl(38 92% 50%)", background: "hsl(38 92% 50% / 0.1)" }}
                onClick={onClose}
              >
                {credits === 0 ? "⚠ Out of credits — Upgrade" : "Low credits — Upgrade"}
              </Link>
            )}
          </div>
        </div>

        {/* User footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-4">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userFullName || userEmail || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">{plan} Plan</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
  onClick,
  highlight = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      style={
        highlight && !active
          ? { border: "1px solid hsl(38 92% 50% / 0.25)" }
          : { border: "1px solid transparent" }
      }
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
