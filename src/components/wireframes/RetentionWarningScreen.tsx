import { AlertTriangle, Archive, Clock } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { useIsMobile } from "@/hooks/use-mobile";

type Props = {
  variant: "warning" | "final-reminder" | "dual-trigger" | "archived";
};

export function RetentionWarningScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      {/* Retention Banners */}
      {variant === "warning" && (
        <div role="alert" className="mx-4 mt-3 bg-warning/10 border border-warning/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-warning">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            <strong>{t("retention.inactivity", lang)}</strong> {t("retention.archiveDate", lang)} <strong>April 15, 2026</strong> {t("retention.dueToInactivity", lang)}
          </span>
        </div>
      )}
      {variant === "final-reminder" && (
        <div role="alert" className="mx-4 mt-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
          <span>
            <strong>{t("retention.finalReminder", lang)}</strong> {t("retention.archiveIn", lang)} <strong>{t("retention.3days", lang)}</strong> {t("retention.dueToInactivity", lang)}
          </span>
        </div>
      )}
      {variant === "dual-trigger" && (
        <div className="mx-4 mt-3 space-y-2">
          <div role="alert" className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span><strong>{t("retention.subExpired", lang)}</strong> {t("retention.archiveOnDate", lang)} <strong>March 25, 2026</strong>.</span>
          </div>
          <div role="alert" className="bg-warning/10 border border-warning/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-warning">
            <Clock className="w-4 h-4 shrink-0" />
            <span><strong>{t("retention.alsoActive", lang)}</strong> {t("retention.inactivityCountdown", lang)}</span>
          </div>
        </div>
      )}
      {variant === "archived" && (
        <div role="alert" className="mx-4 mt-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-destructive">
          <Archive className="w-4 h-4 shrink-0" />
          <span>
            <strong>{t("retention.sourcesArchived", lang)}</strong> {t("retention.renewDesc", lang)}{" "}
            <button className="underline font-medium">{t("retention.upgradePlan", lang)}</button>
          </span>
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
