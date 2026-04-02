import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";
import { CitationPanel } from "./CitationPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKB } from "./KBContext";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { t } from "./translations";

export function KBMainInterface() {
  const isMobile = useIsMobile();
  const { citationDrawer, closeCitation, lang } = useKB();

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <ChatPanel />
        </div>
        {/* Citation bottom sheet — mobile */}
        <Sheet open={!!citationDrawer} onOpenChange={(open) => { if (!open) closeCitation(); }}>
          <SheetContent side="bottom" className="p-0 rounded-t-2xl h-[75vh]">
            <SheetTitle className="sr-only">{t("chat.citation", lang)}</SheetTitle>
            <div className="h-full">
              <CitationPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        {/* Sources column */}
        <div className={`${citationDrawer ? "w-[22%]" : "w-[30%]"} shrink-0 transition-all duration-300`}>
          <SourcePanel />
        </div>
        {/* Chat column */}
        <div className="flex-1 transition-all duration-300">
          <ChatPanel />
        </div>
        {/* Citation panel column — desktop */}
        {citationDrawer && (
          <div className="w-[28%] shrink-0 border-s border-border transition-all duration-300">
            <CitationPanel />
          </div>
        )}
      </div>
    </div>
  );
}
