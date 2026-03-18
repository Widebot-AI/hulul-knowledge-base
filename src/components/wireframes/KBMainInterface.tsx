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
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const readySelected = sources.filter(s => s.status === "ready" && s.selected).length;

  // Prevent sheet close when preview is open
  const handleSheetChange = (open: boolean) => {
    if (!open && modal?.kind === "source-preview") return;
    setSourcesOpen(open);
    if (!open) setSheetExpanded(false);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full relative">
        {/* Chat Panel — full height */}
        <div className="flex-1 overflow-hidden relative">
          <ChatPanel />
        </div>

        {/* Floating pill bar */}
        <div className="absolute bottom-[84px] inset-x-0 flex justify-center z-10 pointer-events-none">
          <button
            onClick={() => setSourcesOpen(true)}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
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
        <Sheet open={sourcesOpen} onOpenChange={handleSheetChange}>
          <SheetContent
            side="bottom"
            className={`p-0 rounded-t-2xl transition-[height] duration-300 ease-in-out ${
              sheetExpanded ? "h-[100dvh] rounded-t-none" : "h-[75vh]"
            }`}
          >
            <SheetTitle className="sr-only">{t("sources.title", lang)}</SheetTitle>
            <div className="h-full">
              <SourcePanel isMobileSheet onExpand={() => setSheetExpanded(true)} />
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
