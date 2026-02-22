"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

interface ContactFormProps {
    content: {
        title: string;
        subtitle: string;
        fields: Array<{ label: string; placeholder: string; type: string; name: string; required?: boolean }>;
        buttonText: string;
        pageId?: string; // Passed automatically by renderer
    };
}

export const ContactForm: React.FC<ContactFormProps> = ({ content }) => {
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    page_id: content.pageId,
                    form_data: formData
                })
            });

            if (!response.ok) throw new Error("Submission failed");

            toast.success("Thank you! Your message has been sent.");
            setFormData({});
        } catch (error) {
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-card border-y border-border">
            <div className="container mx-auto px-6 max-w-2xl text-center">
                <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 uppercase tracking-tighter">
                    {content.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-12 italic">
                    {content.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 text-left p-8 lg:p-12 rounded-[3rem] bg-background border border-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                    {content.fields?.map((field, idx) => (
                        <div key={idx} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                {field.label} {field.required && <span className="text-primary">*</span>}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all h-32"
                                />
                            ) : (
                                <input
                                    required={field.required}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.name] || ""}
                                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    className="w-full px-6 py-4 rounded-2xl bg-muted/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                />
                            )}
                        </div>
                    ))}

                    <button
                        disabled={loading}
                        className="w-full py-5 rounded-[2rem] font-black bg-primary text-primary-foreground hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-8"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                {content.buttonText}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </section>
    );
};
