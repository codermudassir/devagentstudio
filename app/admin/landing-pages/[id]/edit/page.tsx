"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COMPONENTS_REGISTRY, DEFAULT_BLOCKS, BlockData, BlockType } from "../../../../../components/landing-builder/registry";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Save, Eye, Plus, ChevronLeft, Trash2, Settings2, Globe, Image as ImageIcon, Zap } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LandingPageEditor({ params }: { params: { id: string } }) {
    const router = useRouter();
    const supabase = createClient();
    const [page, setPage] = useState<any>(null);
    const [sections, setSections] = useState<BlockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedBlockIdx, setSelectedBlockIdx] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"content" | "seo" | "settings">("content");

    useEffect(() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from("landing_pages")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) {
                toast.error("Failed to load page");
                router.push("/admin/landing-pages");
                return;
            }

            setPage(data);
            setSections(data.sections || []);
            setLoading(false);
        }
        fetchData();
    }, [params.id]);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSections(items);
    };

    const addBlock = (type: BlockType) => {
        const newBlock = { ...DEFAULT_BLOCKS[type], id: Math.random().toString(36).substr(2, 9) };
        setSections([...sections, newBlock]);
        setSelectedBlockIdx(sections.length);
    };

    const removeBlock = (idx: number) => {
        const items = [...sections];
        items.splice(idx, 1);
        setSections(items);
        if (selectedBlockIdx === idx) setSelectedBlockIdx(null);
    };

    const updateBlockContent = (field: string, value: any) => {
        if (selectedBlockIdx === null) return;
        const items = [...sections];
        items[selectedBlockIdx].content[field] = value;
        setSections(items);
    };

    const updateSEO = (field: string, value: string) => {
        setPage({ ...page, [field]: value });
    };

    const savePage = async () => {
        setSaving(true);
        const { error } = await supabase
            .from("landing_pages")
            .update({
                sections,
                updated_at: new Date().toISOString(),
                meta_title: page.meta_title,
                meta_description: page.meta_description,
                og_image: page.og_image,
                is_published: page.is_published,
                header_config: page.header_config,
                slug: page.slug
            })
            .eq("id", params.id);

        if (error) toast.error("Failed to save: " + error.message);
        else toast.success("Page saved successfully");
        setSaving(false);
    };

    if (loading) return <div className="p-20 text-center text-muted-foreground animate-pulse">Loading Editor...</div>;

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Tool Sidebar */}
            <aside className="w-80 border-r border-border flex flex-col bg-card">
                <div className="p-4 border-b border-border flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold truncate text-foreground">{page?.title}</h1>
                        <p className="text-[10px] text-muted-foreground truncate">/p/{page?.slug}</p>
                    </div>
                </div>

                <div className="flex border-b border-border">
                    <button onClick={() => setActiveTab("content")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>Blocks</button>
                    <button onClick={() => setActiveTab("seo")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'seo' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>SEO</button>
                    <button onClick={() => setActiveTab("settings")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>Settings</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {activeTab === "content" ? (
                        <>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Add Content</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.keys(DEFAULT_BLOCKS) as BlockType[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => addBlock(type)}
                                            className="p-3 text-xs font-medium rounded-xl border border-border bg-background hover:border-primary hover:text-primary transition-all text-center flex flex-col items-center gap-2 group"
                                        >
                                            <Plus className="w-4 h-4 opacity-30 group-hover:opacity-100" />
                                            {type.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {selectedBlockIdx !== null && (
                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                        <Settings2 className="w-3.5 h-3.5" /> Edit Section
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.keys(sections[selectedBlockIdx].content).map((field) => (
                                            <div key={field}>
                                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">{field}</label>
                                                {typeof sections[selectedBlockIdx].content[field] === 'boolean' ? (
                                                    <button
                                                        onClick={() => updateBlockContent(field, !sections[selectedBlockIdx].content[field])}
                                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sections[selectedBlockIdx].content[field] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                                                    >
                                                        {sections[selectedBlockIdx].content[field] ? "ON" : "OFF"}
                                                    </button>
                                                ) : Array.isArray(sections[selectedBlockIdx].content[field]) ? (
                                                    <p className="text-[10px] text-muted-foreground italic">List editing coming soon</p>
                                                ) : (
                                                    <textarea
                                                        value={sections[selectedBlockIdx].content[field]}
                                                        onChange={(e) => updateBlockContent(field, e.target.value)}
                                                        className="w-full bg-background border border-border rounded-lg p-3 text-sm outline-none focus:border-primary h-24 font-medium"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : activeTab === "seo" ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Meta Title
                                </label>
                                <input
                                    value={page.meta_title || ""}
                                    onChange={(e) => updateSEO("meta_title", e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl p-3 text-sm outline-none focus:border-primary"
                                    placeholder="Page title for Google"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Settings2 className="w-3 h-3" /> Meta Description
                                </label>
                                <textarea
                                    value={page.meta_description || ""}
                                    onChange={(e) => updateSEO("meta_description", e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl p-3 text-sm outline-none focus:border-primary h-32"
                                    placeholder="Page description for search engines"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" /> Social Share Image (URL)
                                </label>
                                <input
                                    value={page.og_image || ""}
                                    onChange={(e) => updateSEO("og_image", e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl p-3 text-sm outline-none focus:border-primary"
                                    placeholder="https://example.com/og.jpg"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Page Visibility</h3>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                    <span className="text-sm font-bold text-foreground">Status</span>
                                    <button
                                        onClick={() => setPage({ ...page, is_published: !page.is_published })}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${page.is_published ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}
                                    >
                                        {page.is_published ? "PUBLISHED" : "DRAFT"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Header Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                        <span className="text-sm font-bold text-foreground">Show Header</span>
                                        <button
                                            onClick={() => setPage({ ...page, header_config: { ...page.header_config, enabled: !page.header_config?.enabled } })}
                                            className={`w-10 h-5 rounded-full transition-all relative ${page.header_config?.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${page.header_config?.enabled ? 'left-5.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Logo Text</label>
                                        <input
                                            value={page.header_config?.logoText || "My Dev Agents"}
                                            onChange={(e) => setPage({ ...page, header_config: { ...page.header_config, logoText: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-xl p-3 text-sm outline-none focus:border-primary font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CTA Text</label>
                                        <input
                                            value={page.header_config?.ctaText || "Get Started"}
                                            onChange={(e) => setPage({ ...page, header_config: { ...page.header_config, ctaText: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-xl p-3 text-sm outline-none focus:border-primary font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Layout</label>
                                        <select
                                            value={page.header_config?.layout || "classic"}
                                            onChange={(e) => setPage({ ...page, header_config: { ...page.header_config, layout: e.target.value } })}
                                            className="w-full bg-background border border-border rounded-xl p-3 text-sm outline-none focus:border-primary font-bold appearance-none bg-no-repeat bg-[right_1rem_center]"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                                        >
                                            <option value="classic">Classic Minimal</option>
                                            <option value="centered">Centered</option>
                                            <option value="glass">Glassmorphic</option>
                                            <option value="minimal">Minimal Transparent</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Danger Zone</h3>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">URL Slug</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-mono">/p/</span>
                                        <input
                                            value={page.slug}
                                            onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-border space-y-2">
                    <button
                        onClick={savePage}
                        disabled={saving}
                        className="w-full py-4 rounded-xl font-bold bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/10"
                    >
                        <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                        <a
                            href={`/p/${page?.slug}`}
                            target="_blank"
                            className="py-3 rounded-xl font-bold bg-secondary text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-all text-xs"
                        >
                            <Eye className="w-4 h-4" /> Live
                        </a>
                        <Link
                            href={`/admin/landing-pages/${params.id}/preview`}
                            target="_blank"
                            className="py-3 rounded-xl font-bold bg-zinc-800 text-white flex items-center justify-center gap-2 hover:bg-black transition-all text-xs"
                        >
                            <Zap className="w-4 h-4" /> Preview
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Canvas */}
            <main className="flex-1 overflow-y-auto bg-muted/20 relative">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided: any) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="max-w-5xl mx-auto py-20 px-6">
                                {sections.length === 0 && (
                                    <div className="border-4 border-dashed border-border rounded-[3rem] p-32 text-center text-muted-foreground bg-card/50">
                                        <Plus className="w-16 h-16 mx-auto mb-6 opacity-10" />
                                        <p className="text-xl font-medium">Start by adding a block from the sidebar</p>
                                    </div>
                                )}
                                {sections.map((block, idx) => {
                                    const Component = COMPONENTS_REGISTRY[block.type];
                                    return (
                                        <Draggable key={block.id} draggableId={block.id} index={idx}>
                                            {(provided: any, snapshot: any) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => setSelectedBlockIdx(idx)}
                                                    className={`relative group mb-6 rounded-[2.5rem] overflow-hidden transition-all duration-300 ${selectedBlockIdx === idx ? "ring-4 ring-primary scale-[1.02] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] z-10" : "hover:ring-2 hover:ring-border"
                                                        } ${snapshot.isDragging ? "shadow-2xl opacity-90 scale-95" : ""}`}
                                                >
                                                    <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); removeBlock(idx); }}
                                                            className="p-3 bg-destructive text-destructive-foreground rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="pointer-events-none transition-all">
                                                        <Component content={block.content} />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </main>
        </div>
    );
}
