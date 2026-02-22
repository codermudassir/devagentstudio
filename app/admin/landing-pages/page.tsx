"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Plus, Edit3, ExternalLink, Trash2, Layout, Home, CheckCircle, X, Globe, Settings } from "lucide-react";
import { toast } from "sonner";

export default function LandingPagesManagement() {
    const supabase = createClient();
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
    });

    useEffect(() => {
        fetchPages();
    }, []);

    async function fetchPages() {
        const { data } = await supabase.from("landing_pages").select("*").order("created_at", { ascending: false });
        setPages(data || []);
        setLoading(false);
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]/g, "");
        setFormData({ title, slug });
    };

    async function createPage(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.title || !formData.slug) return;

        setCreating(true);
        const { data, error } = await supabase
            .from("landing_pages")
            .insert({ title: formData.title, slug: formData.slug, sections: [] })
            .select()
            .single();

        if (error) {
            toast.error("Error: " + error.message);
        } else {
            toast.success("Page created!");
            setShowModal(false);
            setFormData({ title: "", slug: "" });
            fetchPages();
        }
        setCreating(false);
    }

    async function deletePage(id: string) {
        if (!window.confirm("Delete this page?")) return;
        const { error } = await supabase.from("landing_pages").delete().eq("id", id);
        if (error) toast.error("Error: " + error.message);
        else fetchPages();
    }

    async function setAsHome(id: string) {
        await supabase.from("landing_pages").update({ is_home: false }).neq("id", id);
        const { error } = await supabase.from("landing_pages").update({ is_home: true }).eq("id", id);

        if (error) toast.error("Error: " + error.message);
        else {
            toast.success("Homepage updated!");
            fetchPages();
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Landing Pages</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Build and manage your high-converting site pages</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus className="w-5 h-5" /> New Page
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse">Loading amazing pages...</div>
                ) : pages.length === 0 ? (
                    <div className="col-span-full py-32 border-2 border-dashed border-border rounded-[3rem] text-center bg-card/30">
                        <Layout className="w-16 h-16 mx-auto mb-6 opacity-20" />
                        <h2 className="text-2xl font-bold text-foreground">No pages created yet</h2>
                        <p className="text-muted-foreground mt-2 mb-8">Launch your first marketing page in seconds</p>
                        <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold">Create First Page</button>
                    </div>
                ) : (
                    pages.map((page) => (
                        <div key={page.id} className="group p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all flex flex-col gap-6 relative overflow-hidden h-[320px]">
                            {page.is_home && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-5 py-2 rounded-bl-2xl text-[10px] font-black tracking-widest flex items-center gap-2">
                                    <CheckCircle className="w-3.5 h-3.5" /> HOME
                                </div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                    <Layout className="w-8 h-8" />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setAsHome(page.id)}
                                        title="Set as Homepage"
                                        className={`p-3 rounded-xl transition-all ${page.is_home ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"}`}
                                    >
                                        <Home className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => deletePage(page.id)} className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive hover:text-white transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-black text-2xl text-foreground truncate mb-1">{page.title}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>/{page.slug}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href={`/admin/landing-pages/${page.id}/edit`}
                                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-foreground text-background rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg"
                                >
                                    <Edit3 className="w-5 h-5" /> Edit Page
                                </Link>
                                <a
                                    href={page.is_home ? "/" : `/p/${page.slug}`}
                                    target="_blank"
                                    className="px-5 flex items-center justify-center bg-card border border-border rounded-2xl text-muted-foreground hover:text-foreground hover:border-foreground transition-all shadow-sm"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-xl rounded-[3rem] bg-card border border-border shadow-2xl p-10 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 hover:bg-muted rounded-full text-muted-foreground">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-10 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                                <Plus className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground">Create New Page</h2>
                            <p className="text-muted-foreground mt-2">Set up the foundation for your next masterpiece</p>
                        </div>

                        <form onSubmit={createPage} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Page Title</label>
                                <input
                                    autoFocus
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    placeholder="Home Page, Pricing, About Us..."
                                    className="w-full px-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">URL Slug</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">/p/</span>
                                    <input
                                        required
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-5 rounded-[1.5rem] font-bold text-muted-foreground hover:bg-muted transition-all">Cancel</button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-3 py-5 px-10 rounded-[1.5rem] font-black bg-primary text-primary-foreground hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Build Page"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
