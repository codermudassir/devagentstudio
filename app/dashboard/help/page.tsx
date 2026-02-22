import { Book, MessageCircle, Mail, Sparkles } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-muted-foreground text-lg">Get help with using My Dev Agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Documentation</h3>
            <p className="text-muted-foreground text-sm">
              Learn how to use all the features and agents available on the platform.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">FAQs</h3>
            <p className="text-muted-foreground text-sm">
              Find answers to commonly asked questions about our AI agents.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Contact Support</h3>
            <p className="text-muted-foreground text-sm">
              Need help? Reach out to our support team for assistance.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Feature Requests</h3>
            <p className="text-muted-foreground text-sm">
              Have ideas for new features? We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
