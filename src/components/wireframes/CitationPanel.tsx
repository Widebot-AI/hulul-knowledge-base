import { AlertTriangle } from "lucide-react";
import { useKB } from "./KBContext";
import { t } from "./translations";

export function CitationPanel() {
  const { citationDrawer, closeCitation, lang } = useKB();

  if (!citationDrawer) return null;

  return (
    <div className="h-full w-full bg-background border-s border-border overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {t("chat.citation", lang)} [{citationDrawer.citationId}]
        </h3>
        <button onClick={closeCitation} className="text-xs text-muted-foreground hover:text-foreground">
          ✕
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="text-[11px] text-muted-foreground">{t("chat.source", lang)}</div>
          <div className="text-sm font-medium text-foreground">
            {citationDrawer.deleted ? "Sales Pipeline.xlsx" : "Q3 Strategy Deck.pdf"}
          </div>
        </div>
        {citationDrawer.deleted && (
          <div role="alert" className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {t("chat.sourceDeleted", lang)}
          </div>
        )}
        <div className="flex gap-4">
          <div>
            <div className="text-[11px] text-muted-foreground">{t("chat.type", lang)}</div>
            <div className="text-xs text-foreground">{citationDrawer.deleted ? "XLSX" : "PDF"}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">{t("chat.status", lang)}</div>
            {citationDrawer.deleted ? (
              <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                {t("chat.deleted", lang)}
              </span>
            ) : (
              <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full">
                {t("status.ready", lang)}
              </span>
            )}
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground">{t("chat.uploaded", lang)}</div>
            <div className="text-xs text-foreground">Mar 10, 2026</div>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground mb-1">{t("chat.excerpt", lang)}</div>
          <div className="text-xs text-foreground bg-accent rounded-lg p-3 leading-relaxed border border-accent-foreground/10">
            "Revenue target exceeded by 12%, driven primarily by enterprise segment growth. The sales team closed 14 new enterprise accounts..."
          </div>
        </div>
      </div>
    </div>
  );
}
