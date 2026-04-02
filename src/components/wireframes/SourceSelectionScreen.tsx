import { Check, Loader2, AlertTriangle, FileText, Send } from "lucide-react";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Variant = "deselect-blocked" | "auto-select" | "no-ready";

type Props = {
  variant: Variant;
};

type MockStatus = "ready" | "indexing" | "failed" | "deleted";

type MockSource = {
  id: string;
  name: string;
  type: string;
  status: MockStatus;
  selected: boolean;
  deleted?: boolean;
  autoSelected?: boolean;
};

function getSourcesForVariant(variant: Variant): MockSource[] {
  switch (variant) {
    case "deselect-blocked":
      return [
        { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
        { id: "2", name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing", selected: false },
        { id: "3", name: "Old Policy.pdf", type: "PDF", status: "failed", selected: false },
      ];
    case "auto-select":
      return [
        { id: "1", name: "Annual Report 2024.pdf", type: "PDF", status: "deleted", selected: false, deleted: true },
        { id: "2", name: "API Documentation.md", type: "MD", status: "ready", selected: true, autoSelected: true },
        { id: "3", name: "Employee Handbook.docx", type: "DOCX", status: "indexing", selected: false },
      ];
    case "no-ready":
      return [
        { id: "1", name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing", selected: false },
        { id: "2", name: "Release Notes v2.1.txt", type: "TXT", status: "indexing", selected: false },
        { id: "3", name: "Old Policy.pdf", type: "PDF", status: "failed", selected: false },
      ];
  }
}

export function SourceSelectionScreen({ variant }: Props) {
  const { lang } = useKB();
  const sources = getSourcesForVariant(variant);
  const noReady = variant === "no-ready";

  return (
    <div className="flex h-full overflow-hidden">
      {/* Source panel — 30% */}
      <div className="w-[30%] shrink-0 flex flex-col bg-panel border-e border-border">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h2>
        </div>

        {/* Auto-select toast */}
        {variant === "auto-select" && (
          <div className="mx-2 mt-2 px-3 py-2 bg-success/10 border border-success/20 rounded-lg text-xs text-success flex items-center gap-2">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>{t("select.autoSelected", lang)}</span>
          </div>
        )}

        {/* Source list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sources.map((source) => {
            const isOnlySelected = variant === "deselect-blocked" && source.selected;
            const isDeleted = source.deleted;
            const isAutoSelected = source.autoSelected;

            return (
              <div
                key={source.id}
                className={cn(
                  "rounded-lg px-3 py-2.5 border transition-colors",
                  source.selected && !isDeleted
                    ? "border-primary/30 bg-accent"
                    : "border-transparent",
                  isDeleted && "opacity-40"
                )}
              >
                <div className="flex items-start gap-2">
                  {/* Checkbox area */}
                  <div className="mt-0.5 shrink-0 relative">
                    {source.status === "ready" && !isDeleted ? (
                      <div className="relative group/cb">
                        <button
                          className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                            source.selected ? "border-primary bg-primary" : "border-border"
                          )}
                          disabled={isOnlySelected}
                        >
                          {source.selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </button>
                        {/* Tooltip for deselect-blocked */}
                        {isOnlySelected && (
                          <div className="absolute start-5 top-0 z-10 bg-popover text-popover-foreground border border-border rounded-md px-2 py-1 text-xs shadow-md whitespace-nowrap opacity-0 group-hover/cb:opacity-100 transition-opacity pointer-events-none">
                            {t("select.deselectBlocked", lang)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded border-2 border-border opacity-40" />
                    )}
                  </div>

                  {/* Source info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg border border-border bg-accent flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium text-foreground truncate",
                          isDeleted && "line-through text-muted-foreground"
                        )}
                      >
                        {source.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal">
                        {source.type}
                      </Badge>
                      {/* Status badge */}
                      {source.status === "ready" && !isDeleted && (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-success/10 text-success">
                          <Check className="w-3 h-3" />
                          {t("status.ready", lang)}
                        </span>
                      )}
                      {source.status === "indexing" && (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {t("status.indexing", lang)}
                        </span>
                      )}
                      {source.status === "failed" && (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">
                          <AlertTriangle className="w-3 h-3" />
                          {t("status.failed", lang)}
                        </span>
                      )}
                      {isDeleted && (
                        <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                          {t("chat.deleted", lang)}
                        </span>
                      )}
                    </div>
                    {/* Auto-selected highlight */}
                    {isAutoSelected && (
                      <div className="mt-1 text-[10px] text-success font-medium">
                        ✓ {t("select.autoSelected", lang)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat panel — 70% */}
      <div className="flex-1 flex flex-col">
        {/* Chat body */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-2 text-muted-foreground">
          {noReady ? (
            <>
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center mb-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <p className="text-sm font-medium text-foreground">{t("select.noReady", lang)}</p>
              <p className="text-xs text-muted-foreground">{t("chat.addSourcesToStart", lang)}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">{t("chat.askAboutSources", lang)}</p>
              <p className="text-xs">{t("chat.sourcesGroundAI", lang)}</p>
            </>
          )}
        </div>

        {/* Chat input area */}
        <div className="px-4 py-3 border-t border-border">
          <div
            className={cn(
              "flex items-center gap-2 border rounded-xl px-4 py-2.5 bg-background",
              noReady ? "border-border opacity-50" : "border-border"
            )}
          >
            <input
              type="text"
              placeholder={noReady ? t("select.noReady", lang) : t("chat.askQuestion", lang)}
              disabled={noReady}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <button
              disabled={noReady}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                !noReady
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
