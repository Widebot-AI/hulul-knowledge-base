import { AlertTriangle, Archive, Clock } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";

type Props = {
  variant: "warning" | "final-reminder" | "dual-trigger" | "archived";
};

export function RetentionWarningScreen({ variant }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Retention Banners */}
      {variant === "warning" && (
        <div role="alert" className="bg-warning/10 border-b border-warning/20 px-4 py-2.5 flex items-center gap-2 text-xs text-warning">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            <strong>Inactivity notice:</strong> Your Knowledge Base sources will be archived on <strong>April 15, 2026</strong> due to inactivity.
          </span>
        </div>
      )}
      {variant === "final-reminder" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>Final reminder:</strong> Your sources will be archived in <strong>3 days</strong> due to inactivity.
          </span>
        </div>
      )}
      {variant === "dual-trigger" && (
        <div className="space-y-0">
          <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span><strong>Subscription expired:</strong> Sources will be archived on <strong>March 25, 2026</strong>.</span>
          </div>
          <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 flex items-center gap-2 text-xs text-warning">
            <Clock className="w-4 h-4 shrink-0" />
            <span><strong>Also active:</strong> Inactivity countdown — archival on April 15, 2026.</span>
          </div>
        </div>
      )}
      {variant === "archived" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
          <Archive className="w-4 h-4 shrink-0" />
          <span>
            <strong>Sources archived.</strong> Renew your subscription and reactivate sources to resume querying.{" "}
            <button className="underline font-medium">Upgrade plan</button>
          </span>
        </div>
      )}

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
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
