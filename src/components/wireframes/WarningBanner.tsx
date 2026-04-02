import { AlertTriangle, X, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { t } from "./translations";

export function WarningBanner() {
  const {
    sources,
    workspaceQuotaPercent,
    storageWarningDismissed,
    filecountWarningDismissed,
    tokenWarningDismissed,
    dismissStorageWarning,
    dismissFilecountWarning,
    dismissTokenWarning,
    lang,
  } = useKB();

  // Compute percentages
  const storagePercent = Math.min(100, Math.round((sources.length / 50) * 100 * 4.6));
  const filecountPercent = Math.round((sources.length / 50) * 100);
  const tokenPercent = workspaceQuotaPercent;

  type LimitKey = "token" | "storage" | "filecount";

  // Determine which limits are depleted (>= 100%)
  const depleted: LimitKey[] = [];
  if (tokenPercent >= 100) depleted.push("token");
  if (storagePercent >= 100) depleted.push("storage");
  if (filecountPercent >= 100) depleted.push("filecount");

  // Determine which limits are at warning level (>= 80% and < 100%, and not dismissed)
  const warning: LimitKey[] = [];
  if (tokenPercent >= 80 && tokenPercent < 100 && !tokenWarningDismissed) warning.push("token");
  if (storagePercent >= 80 && storagePercent < 100 && !storageWarningDismissed) warning.push("storage");
  if (filecountPercent >= 80 && filecountPercent < 100 && !filecountWarningDismissed) warning.push("filecount");

  // 100% takes priority — render non-dismissable red banner
  if (depleted.length > 0) {
    // Priority order: token > storage > filecount
    const primary = depleted.includes("token")
      ? "token"
      : depleted.includes("storage")
      ? "storage"
      : "filecount";

    const messageKey =
      primary === "token"
        ? "kb.warn.tokenDepleted"
        : primary === "storage"
        ? "kb.warn.storageDepleted"
        : "kb.warn.filecountDepleted";

    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-destructive/10 border-b border-destructive/20 text-sm">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
        <span className="flex-1 text-destructive font-medium">
          {t(messageKey as Parameters<typeof t>[0], lang)}
        </span>
        <Button size="sm" variant="outline" className="shrink-0 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10">
          <ArrowUpCircle className="h-3.5 w-3.5" />
          {t("kb.warn.upgrade", lang)}
        </Button>
      </div>
    );
  }

  // 80% warning — render dismissable yellow banner
  if (warning.length > 0) {
    const messageText =
      warning.length === 1
        ? t(
            warning[0] === "token"
              ? "kb.warn.tokenApproaching"
              : warning[0] === "storage"
              ? "kb.warn.storageApproaching"
              : "kb.warn.filecountApproaching",
            lang
          )
        : `${t("kb.warn.multiApproaching", lang)} ${t("kb.warn.manageOrUpgrade", lang)}`;

    const dismissAll = () => {
      if (warning.includes("storage")) dismissStorageWarning();
      if (warning.includes("filecount")) dismissFilecountWarning();
      if (warning.includes("token")) dismissTokenWarning();
    };

    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-warning/10 border-b border-warning/20 text-sm">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <span className="flex-1 text-warning-foreground">
          {messageText}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" className="gap-1.5 border-warning/30 text-warning hover:bg-warning/10">
            <ArrowUpCircle className="h-3.5 w-3.5" />
            {t("kb.warn.upgrade", lang)}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground px-2"
            onClick={dismissAll}
            aria-label={t("kb.warn.dismiss", lang)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
