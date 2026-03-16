import { AlertTriangle, Archive, Clock, RotateCcw, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";

type Props = {
  variant: "warning" | "archived";
};

export function RetentionWarningScreen({ variant }: Props) {
  return (
    <div className="flex flex-col h-screen">
      {/* Retention Banner */}
      {variant === "warning" && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2.5 flex items-center gap-2 text-xs text-warning">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            <strong>Inactivity notice:</strong> Your Knowledge Base sources will be archived on <strong>April 15, 2026</strong> due to inactivity. Query the KB or renew your subscription to prevent archival.
          </span>
        </div>
      )}
      {variant === "archived" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
          <Archive className="w-4 h-4 shrink-0" />
          <span>
            <strong>Sources archived.</strong> Your sources were archived due to subscription expiry. Renew your subscription and reactivate sources to resume querying.{" "}
            <button className="underline font-medium">Upgrade plan</button>
          </span>
        </div>
      )}

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[30%] shrink-0">
          <SourcePanel
            variant={variant === "archived" ? "archived" : "normal"}
            storagePercent={variant === "archived" ? 0 : 65}
            fileCount={variant === "archived" ? 3 : 12}
          />
        </div>
        <div className="flex-1 relative">
          <ChatPanel
            disabled={variant === "archived"}
            disabledReason={variant === "archived" ? "Reactivate sources or upload new ones to start chatting." : undefined}
            empty={variant === "archived"}
          />
        </div>
      </div>
    </div>
  );
}
