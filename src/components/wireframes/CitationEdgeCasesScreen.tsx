import { AlertTriangle, X } from "lucide-react";
import { SourcePanel } from "./SourcePanel";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Props = {
  variant: "deleted-source" | "no-grounding";
};

export function CitationEdgeCasesScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();

  const renderDeletedSource = () => (
    <div className="flex-1 relative flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* User question */}
          <div className="flex flex-col items-end">
            <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-primary/15 text-foreground">
              What were the key revenue drivers mentioned in the sales pipeline?
            </div>
          </div>

          {/* Assistant response with citations */}
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-secondary text-secondary-foreground">
              <div className="whitespace-pre-line">
                Based on the available sources, the key revenue drivers included enterprise account expansion and improved sales cycle efficiency. The Q3 Strategy Deck highlights a 12% revenue target exceeded, while the sales pipeline data shows 14 new enterprise accounts closed.
              </div>
              {/* Citation markers */}
              <div className="mt-2 flex flex-wrap gap-1">
                <button
                  className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-accent text-accent-foreground hover:bg-primary/10 transition-colors"
                >
                  [1] Q3 Strategy Deck.pdf
                </button>
                <button
                  className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground line-through"
                >
                  [2] Sales Pipeline.xlsx ({t("chat.deleted", lang)})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30">
            <input
              type="text"
              dir="auto"
              placeholder={t("chat.askQuestion", lang)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Citation Drawer — open, showing deleted source */}
      <div className="absolute end-0 top-0 h-full w-72 sm:w-80 bg-background border-s border-border shadow-lg z-10 overflow-y-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {t("chat.citation", lang)} [2]
          </h3>
          <button className="text-xs text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {/* Source name with strikethrough */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-muted-foreground">{t("chat.source", lang)}</div>
            <div className="text-sm font-medium text-foreground line-through text-muted-foreground">
              Sales Pipeline.xlsx
            </div>
          </div>

          {/* Warning alert */}
          <div
            role="alert"
            className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {t("citationEdge.deletedSource", lang)}
          </div>

          {/* Snapshot metadata */}
          <div className="flex gap-4">
            <div>
              <div className="text-[11px] text-muted-foreground">{t("chat.type", lang)}</div>
              <div className="text-xs text-foreground">XLSX</div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">{t("chat.status", lang)}</div>
              <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                {t("chat.deleted", lang)}
              </span>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground">{t("chat.uploaded", lang)}</div>
              <div className="text-xs text-foreground">Feb 28, 2026</div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">{t("chat.excerpt", lang)}</div>
            <div className="text-xs text-foreground bg-accent rounded-lg p-3 leading-relaxed border border-accent-foreground/10">
              "Pipeline Q3 total: $4.2M. Enterprise closed-won: 14 accounts. Average deal size: $28K. Sales cycle reduced from 47 to 31 days..."
            </div>
          </div>

          {/* Snapshot note */}
          <div className="text-[11px] text-muted-foreground italic">
            {t("citationEdge.snapshotData", lang)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoGrounding = () => (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* User question */}
          <div className="flex flex-col items-end">
            <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-primary/15 text-foreground">
              What are best practices for quarterly business reviews?
            </div>
          </div>

          {/* Assistant response with NO citations */}
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed bg-secondary text-secondary-foreground">
              <div className="whitespace-pre-line">
                Quarterly business reviews (QBRs) are typically most effective when they cover four key areas: financial performance vs. targets, operational highlights and blockers, strategic initiative progress, and forward-looking priorities for the next quarter. Keeping the agenda focused and data-driven ensures productive discussions across stakeholders.
              </div>
              {/* No citations — no citation markers rendered */}

              {/* Info note below the response */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                <span>{t("citationEdge.noGrounding", lang)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30">
            <input
              type="text"
              dir="auto"
              placeholder={t("chat.askQuestion", lang)}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="w-[30%] shrink-0">
            <SourcePanel />
          </div>
        )}
        <div className={cn("flex-1 relative flex flex-col overflow-hidden")}>
          {variant === "deleted-source" ? renderDeletedSource() : renderNoGrounding()}
        </div>
      </div>
    </div>
  );
}
