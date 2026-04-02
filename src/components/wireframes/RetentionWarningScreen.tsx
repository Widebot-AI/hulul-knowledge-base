import { AlertTriangle, Archive, CheckCircle, Clock, Loader2 } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { ChatPanel } from "./ChatPanel";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  variant:
    | "warning"
    | "final-reminder"
    | "dual-trigger"
    | "archived"
    | "subscription-renewed"
    | "activity-resumed"
    | "reactivation"
    | "reactivation-failed";
};

// Mock source cards for reactivation variants
interface MockSource {
  id: string;
  name: string;
  type: string;
  state: "archived" | "reactivating" | "failed";
}

const mockSources: MockSource[] = [
  { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", state: "archived" },
  { id: "2", name: "Product Roadmap 2026.docx", type: "DOCX", state: "archived" },
  { id: "3", name: "Customer Insights.xlsx", type: "XLSX", state: "archived" },
  { id: "4", name: "Support Guidelines.pdf", type: "PDF", state: "archived" },
];

function ReactivationSourceCard({
  source,
  lang,
}: {
  source: MockSource;
  lang: "en" | "ar";
}) {
  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2.5 border transition-colors",
        source.state === "reactivating"
          ? "border-primary/30 bg-primary/5"
          : source.state === "failed"
          ? "border-destructive/30 bg-destructive/5"
          : "border-transparent bg-secondary opacity-60"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-foreground truncate">{source.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center text-[10px] h-4 px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-normal">
              {source.type}
            </span>
            {source.state === "archived" && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                <Archive className="w-3 h-3" />
                {t("status.archived", lang)}
              </span>
            )}
            {source.state === "reactivating" && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t("retention.reactivating", lang)}
              </span>
            )}
            {source.state === "failed" && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">
                <AlertTriangle className="w-3 h-3" />
                {t("retention.reactivationFailed", lang)}
              </span>
            )}
          </div>
          {source.state === "failed" && (
            <div className="mt-1.5">
              <Button size="sm" variant="outline" className="h-6 text-xs gap-1 border-destructive/30 text-destructive hover:text-destructive hover:bg-destructive/5">
                <Loader2 className="w-2.5 h-2.5" />
                {t("retention.reactivate", lang)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReactivationSourcePanel({
  variant,
  lang,
}: {
  variant: "reactivation" | "reactivation-failed";
  lang: "en" | "ar";
}) {
  const sources: MockSource[] = mockSources.map((s, i) => {
    if (i === 0) {
      return {
        ...s,
        state: variant === "reactivation" ? "reactivating" : "failed",
      };
    }
    return s;
  });

  return (
    <div className="w-full h-full flex flex-col bg-panel border-e border-border">
      <div className="px-4 py-3 border-b border-border space-y-2">
        <h2 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h2>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[46%] rounded-full bg-primary/40" />
          </div>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">
            46% · 4/50
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sources.map((source) => (
          <ReactivationSourceCard key={source.id} source={source} lang={lang} />
        ))}
      </div>
    </div>
  );
}

export function RetentionWarningScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();

  const isNewVariant = ["subscription-renewed", "activity-resumed", "reactivation", "reactivation-failed"].includes(variant);
  const isSuccessToast = variant === "subscription-renewed" || variant === "activity-resumed";
  const isReactivation = variant === "reactivation" || variant === "reactivation-failed";

  return (
    <div className="flex flex-col h-full">
      {/* ── Existing variants ── */}
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

      {/* ── New variants: success toast ── */}
      {isSuccessToast && (
        <div role="status" className="mx-4 mt-3 bg-success/10 border border-success/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-success">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>
            {variant === "subscription-renewed"
              ? t("retention.renewed", lang)
              : t("retention.activityResumed", lang)}
          </span>
        </div>
      )}

      {/* ── Split Layout ── */}
      {/* Existing variants + new success toasts: use real SourcePanel + ChatPanel */}
      {!isReactivation && (
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
      )}

      {/* Reactivation variants: custom source panel + chat panel */}
      {isReactivation && (
        <div className="flex flex-1 overflow-hidden">
          {!isMobile && (
            <div className="w-[30%] shrink-0">
              <ReactivationSourcePanel
                variant={variant as "reactivation" | "reactivation-failed"}
                lang={lang}
              />
            </div>
          )}
          <div className="flex-1 relative">
            <ChatPanel />
          </div>
        </div>
      )}
    </div>
  );
}
