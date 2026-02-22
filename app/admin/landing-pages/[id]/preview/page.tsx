import { createAdminClient } from "@/lib/supabase/admin";
import { COMPONENTS_REGISTRY } from "@/components/landing-builder/registry";
import { CommonHeader } from "@/components/landing-builder/blocks/CommonHeader";
import { CommonFooter } from "@/components/landing-builder/blocks/CommonFooter";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props {
    params: { id: string };
}

export default async function AdminPreviewRenderer({ params }: Props) {
    const supabaseServer = await createClient();
    const { data: { user } } = await supabaseServer.auth.getUser();

    // Only allow admins to preview
    if (!user) {
        redirect("/login");
    }

    const supabaseAdmin = createAdminClient();
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect("/dashboard");
    }

    const { data: pageData } = await supabaseAdmin
        .from("landing_pages")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!pageData) {
        notFound();
    }

    const sections = pageData.sections || [];
    const headerConfig = pageData.header_config || { enabled: true, layout: "classic" };

    return (
        <div className="min-h-screen relative bg-background">
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-3 animate-bounce">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                PREVIEW MODE
            </div>

            <CommonHeader config={headerConfig} />

            <main>
                {sections.map((block: any) => {
                    const Component = COMPONENTS_REGISTRY[block.type as keyof typeof COMPONENTS_REGISTRY];
                    if (!Component) return null;
                    return <Component key={block.id} content={block.content} />;
                })}
            </main>

            <CommonFooter config={{ enabled: true }} />
        </div>
    );
}
