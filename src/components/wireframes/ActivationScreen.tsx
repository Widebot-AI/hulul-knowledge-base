import { BookOpen, Sparkles, AlertCircle, Upload, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { useState } from "react";
import { KBMainInterface } from "./KBMainInterface";

export function ActivationScreen() {
  const { setPhase, activationError, setActivationError } = useKB();
  const [loading, setLoading] = useState(false);

  const handleActivate = () => {
    setLoading(true);
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
    <div className="relative h-full">
      {/* Background: the actual KB layout, blurred/dimmed */}
      <div className="absolute inset-0 opacity-40 pointer-events-none blur-[1px]">
        <KBMainInterface />
      </div>

      {/* Overlay card */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border w-full max-w-lg mx-4 p-8 space-y-5">
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-accent-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Knowledge Base</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload documents and web pages to create a searchable knowledge base.
              Get AI answers grounded in your content with citations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
            <div className="flex gap-2.5 items-center bg-panel rounded-lg px-3 py-2.5">
              <Upload className="w-4 h-4 text-primary shrink-0" />
              <span>Upload PDF, DOCX, PPTX, code files and more</span>
            </div>
            <div className="flex gap-2.5 items-center bg-panel rounded-lg px-3 py-2.5">
              <Link2 className="w-4 h-4 text-primary shrink-0" />
              <span>Add web pages by URL</span>
            </div>
            <div className="flex gap-2.5 items-center bg-panel rounded-lg px-3 py-2.5">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Get AI answers with inline citations</span>
            </div>
          </div>

          {activationError && (
            <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Activation failed. Please try again.</span>
            </div>
          )}

          <Button size="lg" className="w-full" onClick={handleActivate} disabled={loading}>
            {loading ? "Activating..." : activationError ? "Retry Activation" : "Activate Knowledge Base"}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            One-time activation for your workspace. All team members will gain access.
          </p>
        </div>
      </div>
    </div>
  );
}
