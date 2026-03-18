import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export function KBMainInterface() {
  const isMobile = useIsMobile();
  const { sources, lang } = useKB();
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const readySelected = sources.filter(s => s.status === "ready" && s.selected).length;

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        {/* Compact source bar */}
        <button
          onClick={() => setSourcesOpen(true)}
          className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border bg-panel hover:bg-accent/50 transition-colors"
        >
          <span className="text-xs font-medium text-foreground">
            {readySelected} {t("sources.selected", lang)}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary font-medium">
            <span>{t("sources.viewAll", lang)}</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Bottom sheet for sources */}
        <Sheet open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <SheetContent side="bottom" className="h-[75vh] p-0 rounded-t-2xl">
            <SheetTitle className="sr-only">{t("sources.title", lang)}</SheetTitle>
            <div className="h-full">
              <SourcePanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* Chat Panel — full width */}
        <div className="flex-1 overflow-hidden relative">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Source Panel — 30% */}
        <div className="w-[30%] shrink-0">
          <SourcePanel />
        </div>

        {/* Chat Panel — 70% */}
        <div className="flex-1 relative">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
