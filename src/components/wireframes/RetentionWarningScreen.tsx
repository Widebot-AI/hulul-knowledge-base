import { AlertTriangle, Archive, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";

type Props = {
  variant: "warning" | "final-reminder" | "dual-trigger" | "archived";
};

export function RetentionWarningScreen({ variant }: Props) {
  return (
    <div className="flex flex-col h-screen">
      {/* Retention Banners */}
      {variant === "warning" && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2.5 flex items-center gap-2 text-xs text-warning">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            <strong>Inactivity notice:</strong> Your Knowledge Base sources will be archived on <strong>April 15, 2026</strong> due to inactivity. Query the KB or renew your subscription to prevent archival.
          </span>
        </div>
      )}

      {/* US-012: Final reminder (second warning stage) */}
      {variant === "final-reminder" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>Final reminder:</strong> Your Knowledge Base sources will be archived in <strong>3 days</strong> (March 20, 2026) due to inactivity. Submit a query now to prevent archival.
          </span>
        </div>
      )}

      {/* US-012 S4: Both triggers active — shows earliest date */}
      {variant === "dual-trigger" && (
        <div className="space-y-0">
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Subscription expired:</strong> Your sources will be archived on <strong>March 25, 2026</strong> unless your subscription is renewed. This is the earlier of two active countdowns.
            </span>
          </div>
          <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 flex items-center gap-2 text-xs text-warning">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Also active:</strong> Inactivity countdown — archival on April 15, 2026 unless KB activity resumes.
            </span>
          </div>
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
