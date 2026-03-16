import { BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ActivationScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md text-center space-y-6 px-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upload documents and web pages to create a searchable knowledge base.
          Your team can chat with your sources and get grounded, cited answers.
        </p>
        <div className="space-y-3 text-left bg-panel rounded-lg p-4 text-xs text-muted-foreground">
          <div className="flex gap-2 items-start">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Upload PDF, DOCX, code files and more</span>
          </div>
          <div className="flex gap-2 items-start">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Add web pages by URL</span>
          </div>
          <div className="flex gap-2 items-start">
            <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <span>Get AI answers grounded in your content with citations</span>
          </div>
        </div>
        <Button size="lg" className="w-full">
          Activate Knowledge Base
        </Button>
        <p className="text-[11px] text-muted-foreground">
          One-time activation for your workspace. All team members will gain access.
        </p>
      </div>
    </div>
  );
}
