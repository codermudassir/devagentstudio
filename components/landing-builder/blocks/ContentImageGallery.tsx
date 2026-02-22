"use client";

import React from "react";

interface ContentImageGalleryProps {
    content: {
        title: string;
        images: string[];
    };
}

export const ContentImageGallery: React.FC<ContentImageGalleryProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-foreground text-center mb-16">{content.title}</h2>
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {content.images.map((img, idx) => (
                        <div key={idx} className="rounded-2xl overflow-hidden border border-border break-inside-avoid shadow-sm hover:scale-[1.02] transition-transform">
                            <img src={img} alt="" className="w-full h-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
