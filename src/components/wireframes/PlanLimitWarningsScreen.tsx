import { useState, useEffect } from "react";
import { AlertTriangle, X, CheckCircle2, TrendingUp } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant =
  | "storage-80"
  | "filecount-80"
  | "token-80"
  | "multi-limit"
  | "storage-100"
  | "filecount-100"
  | "token-depleted"
  | "quota-restored";

type Props = {
  variant: Variant;
};

export function PlanLimitWarningsScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();
  const [dismissed, setDismissed] = useState(false);
  const [quotaVisible, setQuotaVisible] = useState(true);

  // Auto-fade quota-restored banner
  useEffect(() => {
    if (variant === "quota-restored") {
      const timer = setTimeout(() => setQuotaVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [variant]);

  // Reset dismiss when variant changes
  useEffect(() => {
    setDismissed(false);
    setQuotaVisible(true);
  }, [variant]);

  const is80 = variant === "storage-80" || variant === "filecount-80" || variant === "token-80" || variant === "multi-limit";
  const is100 = variant === "storage-100" || variant === "filecount-100" || variant === "token-depleted";

  const getBannerText = () => {
    switch (variant) {
      case "storage-80": return t("warn.storageApproaching", lang);
      case "filecount-80": return t("warn.filecountApproaching", lang);
      case "token-80": return t("warn.tokenApproaching", lang);
      case "multi-limit": return t("warn.multiLimit", lang);
      case "storage-100": return t("warn.storageDepleted", lang);
      case "filecount-100": return t("warn.filecountDepleted", lang);
      case "token-depleted": return t("warn.tokenDepleted", lang);
      case "quota-restored": return t("warn.quotaRestored", lang);
    }
  };

  const showBanner = !dismissed && (variant !== "quota-restored" || quotaVisible);

  return (
    <div className="flex flex-col h-full">
      {/* Banner */}
      {showBanner && (
        <div
          role="alert"
          className={cn(
            "mx-4 mt-3 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs transition-opacity duration-500",
            is80 && "bg-warning/10 border border-warning/20 text-warning",
            is100 && "bg-destructive/10 border border-destructive/20 text-destructive",
            variant === "quota-restored" && "bg-success/10 border border-success/20 text-success",
            !quotaVisible && "opacity-0"
          )}
        >
          {/* Icon */}
          {variant === "quota-restored" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : is100 ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <TrendingUp className="w-4 h-4 shrink-0" />
          )}

          <span className="flex-1">{getBannerText()}</span>

          {/* Upgrade button for 80% and multi-limit variants */}
          {(is80) && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2 border-warning/40 text-warning hover:bg-warning/10"
            >
              {t("warn.upgrade", lang)}
            </Button>
          )}

          {/* Upgrade button for 100% variants */}
          {is100 && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2 border-destructive/40 text-destructive hover:bg-destructive/10"
            >
              {t("warn.upgrade", lang)}
            </Button>
          )}

          {/* Dismiss button only for 80% variants */}
          {is80 && (
            <button
              onClick={() => setDismissed(true)}
              className="p-0.5 rounded hover:bg-warning/20 transition-colors"
              aria-label={t("warn.dismiss", lang)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="w-[30%] shrink-0">
            <SourcePanel />
          </div>
        )}
        <div className="flex-1 relative">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
