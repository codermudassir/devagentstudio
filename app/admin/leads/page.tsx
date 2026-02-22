import { createAdminClient } from "@/lib/supabase/admin";
import { Mail, Calendar, FileText, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getLeads() {
    const supabase = createAdminClient();
    const { data } = await supabase
        .from("landing_page_leads")
        .select(`
            *,
            landing_pages (
                title
            )
        `)
        .order("created_at", { ascending: false });

    return data || [];
}

export default async function AdminLeadsPage() {
    const leads = await getLeads();

    return (
        <div className="p-6 lg:p-12 max-w-7xl mx-auto bg-background min-h-screen">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-5xl font-black text-foreground mb-4 uppercase tracking-tighter">
                        CRM <span className="text-primary italic">Leads</span>
                    </h1>
                    <p className="text-muted-foreground font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {leads.length} active leads captured via landing pages
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {leads.length === 0 && (
                    <div className="p-32 border-4 border-dashed border-border rounded-[3rem] text-center bg-card/30">
                        <p className="text-xl font-bold text-muted-foreground uppercase tracking-widest">No submissions detected yet</p>
                    </div>
                )}

                {leads.map((lead: any) => (
                    <div key={lead.id} className="group p-8 rounded-[2.5rem] bg-card border border-border hover:border-primary/50 transition-all shadow-xl hover:shadow-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-lg">
                                        {(lead.user_email?.[0] || 'L').toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground">{lead.user_email || "Anonymous Lead"}</h3>
                                        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(lead.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted w-fit text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    <FileText className="w-3 h-3" />
                                    Source: {lead.landing_pages?.title}
                                </div>
                            </div>

                            {/* Form Data */}
                            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(lead.form_data).map(([key, value]: [string, any]) => (
                                    <div key={key} className="p-4 rounded-2xl bg-muted/50 border border-border/50 group-hover:bg-background transition-colors">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{key}</p>
                                        <p className="text-sm font-bold text-foreground line-clamp-2">{value}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all group-hover:scale-110">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
