import { X, AlertTriangle, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";

type AlertType = "warning-80" | "depleted-100";

type Props = {
  variant: "empty" | "active";
  alertType?: AlertType;
  sessionAlert?: "warning" | "ceiling";
  showCitation?: boolean;
};

export function KBMainInterface({ variant, alertType, sessionAlert, showCitation }: Props) {
  return (
    <div className="flex flex-col h-screen">
      {/* Global Alert Banner */}
      {alertType === "warning-80" && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-warning">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Approaching plan limits:</strong> Storage usage is at 82%. File count at 84%.{" "}
              <button className="underline">Manage sources</button> or{" "}
              <button className="underline">upgrade your plan</button>.
            </span>
          </div>
          <button className="text-warning/60 hover:text-warning">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {alertType === "depleted-100" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Token quota depleted.</strong> KB querying is disabled. Source management remains available.{" "}
            <button className="underline font-medium">Upgrade your plan</button> to restore querying.
          </span>
        </div>
      )}

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Source Panel — 30% */}
        <div className="w-[30%] shrink-0">
          <SourcePanel
            variant={variant === "empty" ? "empty" : "normal"}
            storagePercent={alertType === "warning-80" ? 82 : 65}
            fileCount={alertType === "warning-80" ? 42 : 12}
          />
        </div>

        {/* Chat Panel — 70% */}
        <div className="flex-1 relative">
          <ChatPanel
            empty={variant === "empty"}
            disabled={variant === "empty" || alertType === "depleted-100"}
            disabledReason={
              alertType === "depleted-100"
                ? "Token quota depleted. Upgrade to continue querying."
                : undefined
            }
            sessionAlert={sessionAlert}
            showCitation={showCitation}
          />
        </div>
      </div>
    </div>
  );
}
