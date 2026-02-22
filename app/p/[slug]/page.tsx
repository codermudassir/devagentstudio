import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { COMPONENTS_REGISTRY } from "@/components/landing-builder/registry";
import { CommonHeader } from "@/components/landing-builder/blocks/CommonHeader";
import { CommonFooter } from "@/components/landing-builder/blocks/CommonFooter";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: { slug: string };
}

async function getPageData(slug: string, isAdmin: boolean = false) {
    const supabase = createAdminClient();
    let query = supabase
        .from("landing_pages")
        .select("*, meta_title, meta_description, og_image")
        .eq("slug", slug);

    if (!isAdmin) {
        query = query.eq("is_published", true);
    }

    const { data } = await query.maybeSingle();
    return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const page = await getPageData(params.slug); // Public meta
    if (!page) return {};

    return {
        title: page.meta_title || page.title,
        description: page.meta_description,
        openGraph: {
            images: page.og_image ? [page.og_image] : [],
        },
    };
}

export default async function LandingPageRenderer({ params }: Props) {
    const pageData = await getPageData(params.slug); // Try public first

    if (!pageData) {
        // Special case: check if it's a draft and user is admin
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const adminData = await getPageData(params.slug, true);
            if (adminData) {
                // It's a draft but user is logged in
                return (
                    <div className="min-h-screen bg-background relative">
                        <div className="fixed top-20 right-8 z-50 bg-emerald-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-pulse">
                            Logged in as Admin (Viewing Draft)
                        </div>
                        <CommonHeader config={adminData.header_config} />
                        <main>
                            {adminData.sections?.map((block: any) => {
                                const Component = COMPONENTS_REGISTRY[block.type as keyof typeof COMPONENTS_REGISTRY];
                                if (!Component) return null;
                                return <Component key={block.id} content={{ ...block.content, pageId: adminData.id }} />;
                            })}
                        </main>
                        <CommonFooter config={{ enabled: true }} />
                    </div>
                );
            }
        }
        notFound();
    }

    const sections = pageData.sections || [];
    const headerConfig = pageData.header_config || { enabled: true, layout: "classic" };

    return (
        <div className="min-h-screen bg-background">
            <CommonHeader config={headerConfig} />

            <main>
                {sections.map((block: any) => {
                    const Component = COMPONENTS_REGISTRY[block.type as keyof typeof COMPONENTS_REGISTRY];
                    if (!Component) return null;
                    // Inject pageId for ContactForm and other dynamic components
                    const props = { ...block.content, pageId: pageData.id };
                    return <Component key={block.id} content={props} />;
                })}
            </main>

            <CommonFooter config={{ enabled: true }} />
        </div>
    );
}
