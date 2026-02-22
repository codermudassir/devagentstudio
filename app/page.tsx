import { createAdminClient } from "@/lib/supabase/admin";
import { COMPONENTS_REGISTRY } from "@/components/landing-builder/registry";
import { CommonHeader } from "@/components/landing-builder/blocks/CommonHeader";
import { CommonFooter } from "@/components/landing-builder/blocks/CommonFooter";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data: homePage } = await supabase
    .from("landing_pages")
    .select("meta_title, title, meta_description, og_image")
    .eq("is_home", true)
    .maybeSingle();

  if (!homePage) return { title: "My Dev Agents" };

  return {
    title: homePage.meta_title || homePage.title,
    description: homePage.meta_description,
    openGraph: {
      images: homePage.og_image ? [homePage.og_image] : [],
    },
  };
}

export default async function HomePage() {
  const supabase = createAdminClient();

  // Check for home landing page
  const { data: homePage } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("is_home", true)
    .maybeSingle();

  if (homePage) {
    const sections = homePage.sections || [];
    const headerConfig = homePage.header_config || { enabled: true, layout: "classic" };

    return (
      <div className="min-h-screen bg-background text-foreground">
        <CommonHeader config={headerConfig} />

        <main>
          {sections.map((block: any) => {
            const Component = (COMPONENTS_REGISTRY as any)[block.type];
            if (!Component) return null;
            const props = { ...block.content, pageId: homePage.id };
            return <Component key={block.id} content={props} />;
          })}
        </main>

        <CommonFooter config={{ enabled: true }} />
      </div>
    );
  }

  // Fallback to dashboard if no home page is set
  redirect("/dashboard");
}
