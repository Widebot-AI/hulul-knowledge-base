import { useState } from "react";
import { ChevronUp, BookOpen } from "lucide-react";
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
  const totalSources = sources.length;

  if (isMobile) {
    return (
      <div className="flex flex-col h-full relative">
        {/* Chat Panel — full height */}
        <div className="flex-1 overflow-hidden relative">
          <ChatPanel />
        </div>

        {/* Floating pill bar — inspired by Lovable queue */}
        <div className="absolute bottom-[72px] inset-x-0 flex justify-center z-10 pointer-events-none">
          <button
            onClick={() => setSourcesOpen(true)}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">
                {t("sources.title", lang)}
              </span>
              <span className="bg-primary text-primary-foreground text-[11px] font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5">
                {readySelected}
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Bottom sheet for sources */}
        <Sheet open={sourcesOpen} onOpenChange={setSourcesOpen}>
          <SheetContent side="bottom" className="h-[75vh] p-0 rounded-t-2xl">
            <SheetTitle className="sr-only">{t("sources.title", lang)}</SheetTitle>
            <div className="h-full">
              <SourcePanel />
            </div>
          </SheetContent>
        </Sheet>
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
