import { Check, Loader2, AlertTriangle, FileText, Plus, MoreVertical, Eye, Pencil, RotateCcw, Lock, Send } from "lucide-react";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Variant = "blocked-processing" | "failed" | "pending-cleanup" | "cleanup-locked";

type Props = {
  variant: Variant;
};

type MockStatus = "ready" | "indexing" | "failed" | "pending_cleanup";

type MockSource = {
  id: string;
  name: string;
  type: string;
  status: MockStatus;
  selected: boolean;
  retryCount?: number;
  retryLocked?: boolean;
};

function getSourcesForVariant(variant: Variant): MockSource[] {
  switch (variant) {
    case "blocked-processing":
      return [
        { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
        { id: "2", name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing", selected: false },
        { id: "3", name: "API Documentation.md", type: "MD", status: "ready", selected: true },
      ];
    case "failed":
      return [
        { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
        { id: "2", name: "Old Policy.pdf", type: "PDF", status: "ready", selected: false },
        { id: "3", name: "Employee Handbook.docx", type: "DOCX", status: "failed", selected: false },
      ];
    case "pending-cleanup":
      return [
        { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
        { id: "2", name: "Old Policy.pdf", type: "PDF", status: "pending_cleanup", selected: false, retryCount: 1, retryLocked: false },
      ];
    case "cleanup-locked":
      return [
        { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
        { id: "2", name: "Old Policy.pdf", type: "PDF", status: "pending_cleanup", selected: false, retryCount: 3, retryLocked: true },
      ];
  }
}

export function DeletionStatesScreen({ variant }: Props) {
  const { lang } = useKB();
  const sources = getSourcesForVariant(variant);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Source panel — 30% */}
      <div className="w-[30%] shrink-0 flex flex-col bg-panel border-e border-border">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h2>
        </div>

        {/* Delete failed toast */}
        {variant === "failed" && (
          <div className="mx-2 mt-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{t("delete.failed", lang)}</span>
          </div>
        )}

        {/* Blocked processing note */}
        {variant === "blocked-processing" && (
          <div className="mx-2 mt-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{t("delete.blockedProcessing", lang)}</span>
          </div>
        )}

        {/* Source list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sources.map((source) => (
            <SourceCard key={source.id} source={source} lang={lang} variant={variant} />
          ))}
        </div>

        {/* Add sources button */}
        <div className="px-4 py-3 border-t border-border">
          <Button size="sm" className="w-full h-8 text-xs gap-1.5 font-medium">
            <Plus className="w-3.5 h-3.5" />
            {t("sources.add", lang)}
          </Button>
        </div>
      </div>

      {/* Chat panel — 70% */}
      <div className="flex-1 relative">
        <ChatPanel />
      </div>
    </div>
  );
}

function SourceCard({
  source,
  lang,
  variant,
}: {
  source: MockSource;
  lang: "en" | "ar";
  variant: Variant;
}) {
  const isPendingCleanup = source.status === "pending_cleanup";
  const isIndexing = source.status === "indexing";
  const isReady = source.status === "ready";
  const isFailed = source.status === "failed";
  const isTerminal = isReady || isFailed;
  const isBlockedProcessing = variant === "blocked-processing" && isIndexing;

  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2.5 border transition-colors group",
        source.selected && isReady
          ? "border-primary/30 bg-accent"
          : "border-transparent hover:bg-secondary",
        isPendingCleanup && "opacity-70"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        {isReady && (
          <button
            className={cn(
              "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
              source.selected ? "border-primary bg-primary" : "border-border"
            )}
          >
            {source.selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </button>
        )}
        {!isReady && !isPendingCleanup && (
          <div className="mt-0.5 w-4 h-4 rounded border-2 border-border opacity-40 shrink-0" />
        )}

        {/* Source info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg border border-border bg-accent flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium text-foreground truncate">{source.name}</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal">
              {source.type}
            </Badge>

            {isReady && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-success/10 text-success">
                <Check className="w-3 h-3" />
                {t("status.ready", lang)}
              </span>
            )}
            {isIndexing && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t("status.indexing", lang)}
              </span>
            )}
            {isFailed && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">
                <AlertTriangle className="w-3 h-3" />
                {t("status.failed", lang)}
              </span>
            )}
            {isPendingCleanup && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-warning/10 text-warning">
                <AlertTriangle className="w-3 h-3" />
                {t("status.cleanupPending", lang)}
              </span>
            )}
          </div>

          {/* Blocked processing note */}
          {isBlockedProcessing && (
            <p className="text-[10px] text-warning mt-1">{t("delete.blockedProcessing", lang)}</p>
          )}

          {/* Pending cleanup details */}
          {isPendingCleanup && (
            <div className="mt-1.5 space-y-1">
              <p className="text-xs text-warning">{t("delete.pendingCleanup", lang)}</p>
              {source.retryLocked ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-2.5 h-2.5" />
                  <span>{t("delete.cleanupLocked", lang)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <RotateCcw className="w-2.5 h-2.5" />
                    {t("delete.retryCleanup", lang)}
                  </button>
                  <span className="text-xs text-muted-foreground">
                    ({source.retryCount}/3 {t("delete.attempts", lang)})
                  </span>
                </div>
              )}
              {source.retryLocked && (
                <button
                  disabled
                  className="text-xs text-muted-foreground flex items-center gap-1 opacity-50 cursor-not-allowed"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  {t("delete.retryCleanup", lang)}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Context menu — ready sources always get it; indexing only gets Preview+Rename (no Delete) */}
        {(isTerminal || isIndexing) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-0.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent text-muted-foreground">
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem className="text-xs gap-2">
                <Eye className="w-3.5 h-3.5" />
                {t("sources.preview", lang)}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs gap-2">
                <Pencil className="w-3.5 h-3.5" />
                {t("sources.rename", lang)}
              </DropdownMenuItem>
              {/* Delete option — only shown for terminal sources that are NOT blocked-processing indexing */}
              {!isIndexing && (
                <DropdownMenuItem className="text-xs gap-2 text-destructive focus:text-destructive">
                  <Send className="w-3.5 h-3.5 rotate-45" />
                  {t("sources.delete", lang)}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
