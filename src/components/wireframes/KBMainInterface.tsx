import { X, AlertTriangle } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";

type AlertType = "warning-80" | "warning-80-multi" | "depleted-100" | "depleted-storage" | "depleted-filecount";

type Props = {
  variant: "empty" | "active";
  alertType?: AlertType;
  sessionAlert?: "warning" | "ceiling";
  showCitation?: boolean;
  showDeletedCitation?: boolean;
  streamingError?: boolean;
  sessionCreateError?: boolean;
  showResetConfirm?: boolean;
  resetError?: boolean;
  sourceVariant?: "normal" | "pending_cleanup" | "loading";
};

export function KBMainInterface({
  variant,
  alertType,
  sessionAlert,
  showCitation,
  showDeletedCitation,
  streamingError,
  sessionCreateError,
  showResetConfirm,
  resetError,
  sourceVariant,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Global Alert Banners */}
      {alertType === "warning-80" && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-warning">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Approaching plan limits:</strong> Storage usage is at 82%.{" "}
              <button className="underline">Manage sources</button> or{" "}
              <button className="underline">upgrade your plan</button>.
            </span>
          </div>
          <button className="text-warning/60 hover:text-warning">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* US-004 S3b: Multi-limit warning */}
      {alertType === "warning-80-multi" && (
        <div className="bg-warning/10 border-b border-warning/20 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-warning">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Approaching plan limits:</strong> Storage usage is at 82%. File count at 84%. Token quota at 81%.{" "}
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

      {/* US-004 Req 4.3: Storage/file count depletion — uploads blocked, querying continues */}
      {alertType === "depleted-storage" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Storage capacity reached.</strong> New uploads are blocked. Existing sources remain queryable.{" "}
            <button className="underline font-medium">Delete sources</button> or{" "}
            <button className="underline font-medium">upgrade your plan</button>.
          </span>
        </div>
      )}

      {alertType === "depleted-filecount" && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>File limit reached (50/50).</strong> New uploads are blocked. Existing sources remain queryable.{" "}
            <button className="underline font-medium">Delete sources</button> or{" "}
            <button className="underline font-medium">upgrade your plan</button>.
          </span>
        </div>
      )}

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Source Panel — 30% */}
        <div className="w-[30%] shrink-0">
          <SourcePanel
            variant={sourceVariant || (variant === "empty" ? "empty" : "normal")}
            storagePercent={alertType === "warning-80" || alertType === "warning-80-multi" ? 82 : alertType === "depleted-storage" ? 100 : 65}
            fileCount={alertType === "warning-80-multi" ? 42 : alertType === "depleted-filecount" ? 50 : 12}
            fileLimit={50}
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
            showDeletedCitation={showDeletedCitation}
            streamingError={streamingError}
            sessionCreateError={sessionCreateError}
            showResetConfirm={showResetConfirm}
            resetError={resetError}
          />
        </div>
      </div>
    </div>
  );
}
