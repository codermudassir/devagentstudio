import { HeroClassic } from "./blocks/HeroClassic";
import { HeroCentered } from "./blocks/HeroCentered";
import { HeroMultiCTA } from "./blocks/HeroMultiCTA";
import { FeatureGrid } from "./blocks/FeatureGrid";
import { FeatureZigZag } from "./blocks/FeatureZigZag";
import { FeatureSideList } from "./blocks/FeatureSideList";
import { TestimonialGrid } from "./blocks/TestimonialGrid";
import { TestimonialSpotlight } from "./blocks/TestimonialSpotlight";
import { PricingTable } from "./blocks/PricingTable";
import { PricingComparison } from "./blocks/PricingComparison";
import { FAQAccordion } from "./blocks/FAQAccordion";
import { FAQSimpleGrid } from "./blocks/FAQSimpleGrid";
import { LogoCloud } from "./blocks/LogoCloud";
import { StatsBento } from "./blocks/StatsBento";
import { StatsCounter } from "./blocks/StatsCounter";
import { CTALeadCapture } from "./blocks/CTALeadCapture";
import { CTALargeBanner } from "./blocks/CTALargeBanner";
import { ContentRichText } from "./blocks/ContentRichText";
import { ContentImageGallery } from "./blocks/ContentImageGallery";
import { ContentVideoEmbed } from "./blocks/ContentVideoEmbed";
import { ContactLayout } from "./blocks/ContactLayout";
import { ContactForm } from "./blocks/ContactForm";
import { FooterUnified } from "./blocks/FooterUnified";

export type BlockType =
    | "hero-classic"
    | "hero-centered"
    | "hero-multi-cta"
    | "feature-grid"
    | "feature-zigzag"
    | "feature-sidelist"
    | "testimonial-grid"
    | "testimonial-spotlight"
    | "pricing-table"
    | "pricing-comparison"
    | "faq-accordion"
    | "faq-simple-grid"
    | "logo-cloud"
    | "stats-bento"
    | "stats-counter"
    | "cta-lead-capture"
    | "cta-large-banner"
    | "content-rich-text"
    | "content-gallery"
    | "content-video"
    | "contact-layout"
    | "contact-form"
    | "footer-unified";

export interface BlockData {
    id: string;
    type: BlockType;
    content: any;
    styles?: any;
}

export const COMPONENTS_REGISTRY: Record<BlockType, any> = {
    "hero-classic": HeroClassic,
    "hero-centered": HeroCentered,
    "hero-multi-cta": HeroMultiCTA,
    "feature-grid": FeatureGrid,
    "feature-zigzag": FeatureZigZag,
    "feature-sidelist": FeatureSideList,
    "testimonial-grid": TestimonialGrid,
    "testimonial-spotlight": TestimonialSpotlight,
    "pricing-table": PricingTable,
    "pricing-comparison": PricingComparison,
    "faq-accordion": FAQAccordion,
    "faq-simple-grid": FAQSimpleGrid,
    "logo-cloud": LogoCloud,
    "stats-bento": StatsBento,
    "stats-counter": StatsCounter,
    "cta-lead-capture": CTALeadCapture,
    "cta-large-banner": CTALargeBanner,
    "content-rich-text": ContentRichText,
    "content-gallery": ContentImageGallery,
    "content-video": ContentVideoEmbed,
    "contact-layout": ContactLayout,
    "contact-form": ContactForm,
    "footer-unified": FooterUnified,
};

export const DEFAULT_BLOCKS: Record<BlockType, BlockData> = {
    "hero-classic": {
        id: "", type: "hero-classic",
        content: {
            title: "Design Your Future",
            subtitle: "Build stunning landing pages in minutes with our drag-and-drop tool.",
            ctaText: "Start Building", ctaLink: "#",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
        }
    },
    "hero-centered": {
        id: "", type: "hero-centered",
        content: {
            title: "The Ultimate Page Builder",
            subtitle: "No code. No stress. Just beautiful results.",
            ctaText: "Get Started Free", ctaLink: "#",
        }
    },
    "hero-multi-cta": {
        id: "", type: "hero-multi-cta",
        content: {
            title: "Grow Faster Than Ever",
            subtitle: "Powerful tools for powerful creators. Join 10k+ businesses today.",
            primaryText: "Get Started", primaryLink: "#",
            secondaryText: "Learn More", secondaryLink: "#",
        }
    },
    "feature-grid": {
        id: "", type: "feature-grid",
        content: {
            title: "Powerful Features",
            subtitle: "Everything you need to launch your next big thing.",
            features: [
                { title: "Drag & Drop", description: "Intuitive editor with zero learning curve.", icon: "🎨" },
                { title: "Responsive", description: "Looks great on mobile, tablet, and desktop.", icon: "📱" },
                { title: "SEO Ready", description: "Built-in optimization for search engines.", icon: "🚀" },
            ]
        }
    },
    "feature-zigzag": {
        id: "", type: "feature-zigzag",
        content: {
            title: "The Best Way to Build",
            items: [
                { title: "Visual Editing", description: "What you see is what you get. Edit directly on the canvas.", imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80" },
                { title: "Rapid Deployment", description: "Ship in seconds. No complex setup or servers required.", imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80", reverse: true }
            ]
        }
    },
    "feature-sidelist": {
        id: "", type: "feature-sidelist",
        content: {
            title: "Everything Included",
            subtitle: "Stop worrying about infrastructure and start building.",
            imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80",
            items: ["Free Hosting", "Custom Domains", "Auto-scaling", "DDoS Protection"]
        }
    },
    "testimonial-grid": {
        id: "", type: "testimonial-grid",
        content: {
            title: "Voices that trust us",
            testimonials: [
                { quote: "An absolute game-changer for our marketing team.", author: "Jane Cooper", role: "Marketing Director" },
                { quote: "The fastest way to spin up high-converting pages.", author: "Cody Fisher", role: "Growth Lead" },
                { quote: "Support is top-notch and the platform is rock solid.", author: "Esther Howard", role: "CEO @ TechFlow" },
            ]
        }
    },
    "testimonial-spotlight": {
        id: "", type: "testimonial-spotlight",
        content: {
            quote: "This is the single best investment we've made this year. Period.",
            author: "Robert Fox",
            role: "Founder, Greenlight Inc",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
        }
    },
    "pricing-table": {
        id: "", type: "pricing-table",
        content: {
            title: "Simple Pricing",
            subtitle: "Choose the plan that's right for you.",
            plans: [
                { name: "Starter", price: "$0", features: ["1 Page", "Standard Blocks", "Community Support"], ctaText: "Join Free" },
                { name: "Pro", price: "$29", features: ["Unlimited Pages", "Premium Blocks", "Priority Support"], ctaText: "Go Pro", isPopular: true },
                { name: "Business", price: "$99", features: ["API Access", "Team Collaboration", "White Label"], ctaText: "Contact Us" },
            ],
            dynamic: false
        }
    },
    "pricing-comparison": {
        id: "", type: "pricing-comparison",
        content: {
            title: "Compare Plans",
            features: ["Unlimited Pages", "Custom Domains", "Priority Support", "Advanced Analytics", "A/B Testing"],
            plans: [
                { name: "Starter", price: "$0", values: [false, false, false, false, false] },
                { name: "Pro", price: "$29", values: [true, true, true, false, false] },
                { name: "Business", price: "$99", values: [true, true, true, true, true] },
            ]
        }
    },
    "faq-accordion": {
        id: "", type: "faq-accordion",
        content: {
            title: "Got Questions?",
            faqs: [
                { question: "Is it easy to use?", answer: "Yes! Our editor is designed for everyone, from beginners to pros." },
                { question: "Can I use my own domain?", answer: "Absolutely. Pro and Business plans include custom domain support." },
                { question: "How do I get help?", answer: "We offer 24/7 support via email and chat for all our customers." },
            ]
        }
    },
    "faq-simple-grid": {
        id: "", type: "faq-simple-grid",
        content: {
            title: "Frequently Asked Questions",
            subtitle: "Common answers to help you get started.",
            faqs: [
                { question: "Can I cancel my subscription?", answer: "Yes, you can cancel at any time from your account settings." },
                { question: "Do you offer refunds?", answer: "We offer a 14-day money-back guarantee for all paid plans." },
            ]
        }
    },
    "logo-cloud": {
        id: "", type: "logo-cloud",
        content: {
            title: "Trusted by the world's best teams",
            logos: [
                "https://www.vectorlogo.zone/logos/google/google-ar21.svg",
                "https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg",
                "https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg",
                "https://www.vectorlogo.zone/logos/spotify/spotify-ar21.svg",
            ]
        }
    },
    "stats-bento": {
        id: "", type: "stats-bento",
        content: {
            stats: [
                { label: "Happy Users", value: "10k+", desc: "Growing every single day" },
                { label: "Uptime", value: "99.9%", desc: "Reliability you can trust" },
                { label: "Projects", value: "50k", desc: "Built with our toolkit" },
            ]
        }
    },
    "stats-counter": {
        id: "", type: "stats-counter",
        content: {
            stats: [
                { label: "Countries", value: "150+", color: "hsl(var(--primary))" },
                { label: "Employees", value: "1,200", color: "hsl(var(--foreground))" },
                { label: "Revenue", value: "$40M", color: "hsl(var(--primary))" }
            ]
        }
    },
    "cta-lead-capture": {
        id: "", type: "cta-lead-capture",
        content: {
            title: "Join our newsletter",
            subtitle: "Get the latest updates and special offers directly in your inbox.",
            placeholder: "Enter your email",
            btnText: "Subscribe Now"
        }
    },
    "cta-large-banner": {
        id: "", type: "cta-large-banner",
        content: {
            title: "Ready to launch?",
            subtitle: "Start your free 14-day trial today. No credit card required.",
            btnText: "Get Started Free",
            btnLink: "/signup"
        }
    },
    "content-rich-text": {
        id: "", type: "content-rich-text",
        content: {
            html: "<h1>Our Mission</h1><p>We are dedicated to democratizing the web by providing tools that empower everyone to share their vision with the world.</p>"
        }
    },
    "content-gallery": {
        id: "", type: "content-gallery",
        content: {
            title: "Inside the Platform",
            images: [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80"
            ]
        }
    },
    "content-video": {
        id: "", type: "content-video",
        content: {
            title: "Watch how it works",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
    },
    "contact-layout": {
        id: "", type: "contact-layout",
        content: {
            title: "Get in touch",
            subtitle: "We'd love to hear from you. Reach out any time.",
            email: "support@mydevagents.com",
            phone: "+1 (555) 000-0000",
            address: "123 Tech Lane, San Francisco, CA"
        }
    },
    "footer-unified": {
        id: "", type: "footer-unified",
        content: {
            companyName: "My Dev Agents",
            tagline: "The best way to build your online presence.",
            links: [
                { name: "Home", url: "/" },
                { name: "Pricing", url: "/pricing" },
                { name: "Dashboard", url: "/dashboard" },
            ]
        }
    },
    "contact-form": {
        id: "", type: "contact-form",
        content: {
            title: "Join the waitlist",
            subtitle: "We're launching soon. Get notified first.",
            buttonText: "Join Now",
            fields: [
                { label: "Full Name", placeholder: "Jane Doe", type: "text", name: "name", required: true },
                { label: "Email Address", placeholder: "jane@example.com", type: "email", name: "email", required: true },
                { label: "Message", placeholder: "Tell us about your project", type: "textarea", name: "message", required: false }
            ]
        }
    }
};
