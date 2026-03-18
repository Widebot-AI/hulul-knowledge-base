import { BookOpen, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { useState } from "react";

export function ActivationScreen() {
  const { setPhase, activationError, setActivationError } = useKB();
  const [loading, setLoading] = useState(false);

  const handleActivate = () => {
    setLoading(true);
    // Simulate activation — 20% chance of error for testing
    setTimeout(() => {
      if (Math.random() < 0.2) {
        setActivationError(true);
        setLoading(false);
      } else {
        setActivationError(false);
        setPhase("empty");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center h-full bg-background">
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

        {activationError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Activation failed. Please try again. If the problem persists, contact support.</span>
          </div>
        )}

        <Button size="lg" className="w-full" onClick={handleActivate} disabled={loading}>
          {loading ? "Activating..." : activationError ? "Retry Activation" : "Activate Knowledge Base"}
        </Button>
        <p className="text-[11px] text-muted-foreground">
          One-time activation for your workspace. All team members will gain access.
        </p>
      </div>
    </div>
  );
}
