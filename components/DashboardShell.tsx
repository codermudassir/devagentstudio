"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import LowCreditsWarning from "./LowCreditsWarning";

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail: string | null;
  userFullName?: string | null;
  userAvatarUrl?: string | null;
  credits?: number;
  plan?: "free" | "pro" | "enterprise";
  isAdmin?: boolean;
}

export default function DashboardShell({
  children,
  userEmail,
  userFullName,
  userAvatarUrl,
  credits = 50,
  plan = "free",
  isAdmin = false,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar
        userEmail={userEmail}
        userFullName={userFullName}
        userAvatarUrl={userAvatarUrl}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        credits={credits}
        plan={plan}
        isAdmin={isAdmin}
      />

      <main className="flex-1 lg:ml-64">{children}</main>

      {/* Low credits warning */}
      <LowCreditsWarning credits={credits} />
    </div>
  );
}
