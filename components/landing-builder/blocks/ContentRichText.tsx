"use client";

import React from "react";

interface ContentRichTextProps {
    content: {
        html: string;
    };
}

export const ContentRichText: React.FC<ContentRichTextProps> = ({ content }) => {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-6 max-w-3xl prose prose-invert prose-lg">
                <div dangerouslySetInnerHTML={{ __html: content.html }} />
            </div>
        </section>
    );
};
