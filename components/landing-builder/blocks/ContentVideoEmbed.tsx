"use client";

import React from "react";

interface ContentVideoEmbedProps {
    content: {
        title: string;
        videoUrl: string;
    };
}

export const ContentVideoEmbed: React.FC<ContentVideoEmbedProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 max-w-5xl text-center">
                <h2 className="text-3xl font-bold text-foreground mb-12">{content.title}</h2>
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-border shadow-2xl">
                    <iframe
                        src={content.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
};
