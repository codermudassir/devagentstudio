"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactLayoutProps {
    content: {
        title: string;
        subtitle: string;
        email: string;
        phone: string;
        address: string;
    };
}

export const ContactLayout: React.FC<ContactLayoutProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16">
                <div className="flex-1">
                    <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">{content.title}</h2>
                    <p className="text-xl text-muted-foreground mb-12">{content.subtitle}</p>
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Email</div>
                                <div className="text-lg font-medium text-foreground">{content.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Phone</div>
                                <div className="text-lg font-medium text-foreground">{content.phone}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Office</div>
                                <div className="text-lg font-medium text-foreground">{content.address}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="p-10 rounded-[2.5rem] bg-card border border-border shadow-xl">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Your Name</label>
                                <input className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary text-foreground" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Work Email</label>
                                <input className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary text-foreground" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">Message</label>
                                <textarea className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary text-foreground h-40" placeholder="How can we help?" />
                            </div>
                            <button className="w-full py-5 rounded-xl font-bold bg-primary text-primary-foreground hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
