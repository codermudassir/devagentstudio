import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Pricing – My Dev Agents",
    description: "Choose the plan that suits your freelancing needs.",
};

async function getPlans() {
    const adminClient = createAdminClient();
    const { data } = await adminClient
        .from("pricing_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
    return data ?? [];
}

const planColors = ["hsl(0 0% 50%)", "hsl(38 92% 50%)", "hsl(280 80% 60%)"];
const planGlows = ["", "box-shadow: 0 0 40px hsl(38 92% 50% / 0.2)", "box-shadow: 0 0 40px hsl(280 80% 60% / 0.2)"];

export default async function PricingPage() {
    const plans = await getPlans();

    return (
        <div
            className="min-h-screen"
            style={{ background: "hsl(0 0% 7%)", fontFamily: "'Inter', sans-serif" }}
        >
            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))" }}
                    >
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    My Dev Agents
                </Link>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="px-6 pt-16 pb-8 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Simple, transparent{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        pricing
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground">
                    Get started for free. Upgrade as you grow. No hidden fees.
                </p>
            </section>

            {/* Plans */}
            <section className="px-6 pb-24 max-w-5xl mx-auto">
                <div className={`grid grid-cols-1 ${plans.length > 1 ? "md:grid-cols-2" : ""} ${plans.length > 2 ? "lg:grid-cols-3" : ""} gap-6 mt-8`}>
                    {plans.map((plan: any, i: number) => {
                        const color = planColors[i] ?? planColors[0];
                        const isPopular = i === 1 && plans.length >= 2;
                        return (
                            <div
                                key={plan.id}
                                className="relative rounded-2xl p-7 flex flex-col"
                                style={{
                                    background: isPopular ? "hsl(0 0% 12%)" : "hsl(0 0% 10%)",
                                    border: isPopular ? `1px solid hsl(38 92% 50% / 0.6)` : "1px solid hsl(0 0% 18%)",
                                    boxShadow: isPopular ? "0 0 40px hsl(38 92% 50% / 0.15)" : undefined,
                                }}
                            >
                                {isPopular && (
                                    <div
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-black"
                                        style={{ background: "hsl(38 92% 50%)" }}
                                    >
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground mb-5">{plan.description}</p>

                                <div className="mb-1">
                                    <span className="text-4xl font-bold text-foreground">${plan.price_monthly}</span>
                                    <span className="text-muted-foreground text-sm ml-1">/month</span>
                                </div>
                                <p className="text-xs mb-6" style={{ color }}>
                                    {plan.credits} AI credits included
                                </p>

                                <ul className="space-y-3 flex-1 mb-8">
                                    {(Array.isArray(plan.features) ? plan.features : []).map((feat: string, fi: number) => (
                                        <li key={fi} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color }} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={plan.price_monthly === 0 ? "/signup" : "/dashboard"}
                                    className="block text-center py-3 rounded-xl text-sm font-semibold transition-all"
                                    style={isPopular
                                        ? { background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 85% 45%))", color: "black" }
                                        : { background: "hsl(0 0% 16%)", color: "hsl(0 0% 85%)", border: "1px solid hsl(0 0% 22%)" }}
                                >
                                    {plan.price_monthly === 0 ? "Get Started Free" : "Contact Admin to Upgrade"}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ teaser */}
                <p className="text-center text-sm text-muted-foreground mt-12">
                    Need a custom plan?{" "}
                    <a href="mailto:admin@mydevagents.com" className="underline hover:text-foreground transition-colors">
                        Contact us
                    </a>
                </p>
            </section>
        </div>
    );
}
