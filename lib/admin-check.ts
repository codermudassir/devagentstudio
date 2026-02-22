import { createClient } from "@/lib/supabase/server";

export async function isAdmin(): Promise<boolean> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return false;

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        return profile?.role === "admin";
    } catch {
        return false;
    }
}

export async function requireAdmin(): Promise<void> {
    const admin = await isAdmin();
    if (!admin) {
        const { redirect } = await import("next/navigation");
        redirect("/dashboard");
    }
}

export type Profile = {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: "user" | "admin";
    plan: "free" | "pro" | "enterprise";
    credits: number;
    created_at: string;
    last_active: string;
};
