import { X, AlertTriangle } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";

export function KBMainInterface() {
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
