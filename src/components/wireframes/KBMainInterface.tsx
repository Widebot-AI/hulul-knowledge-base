import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export function KBMainInterface() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[30%] shrink-0">
          <SourcePanel />
        </div>
        <div className="flex-1 relative">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
