import { Check, AlertTriangle, Loader2, FileText, Plus } from "lucide-react";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "./ChatPanel";
import { SourcePanel } from "./SourcePanel";
import { useIsMobile } from "@/hooks/use-mobile";

type Variant = "skeleton" | "stripe-failure";

type Props = {
  variant: Variant;
};

type MockSource = {
  id: string;
  name: string;
  type: string;
  status: "ready" | "indexing" | "failed";
  selected: boolean;
};

const mockSources: MockSource[] = [
  { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
  { id: "2", name: "API Documentation.md", type: "MD", status: "ready", selected: true },
  { id: "3", name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing", selected: false },
];

export function PlanDataLoadingScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full overflow-hidden">
      {/* Source panel — 30% */}
      {!isMobile && (
        <div className="w-[30%] shrink-0 flex flex-col bg-panel border-e border-border">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-border space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h2>
            </div>

            {/* Storage metrics — skeleton or hidden */}
            {variant === "skeleton" ? (
              <div className="space-y-1.5">
                {/* Skeleton progress bar */}
                <div className="h-1.5 bg-muted animate-pulse rounded-full w-full" />
                {/* Skeleton text */}
                <div className="flex items-center gap-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-16" />
                  <div className="h-3 bg-muted animate-pulse rounded w-10" />
                </div>
              </div>
            ) : (
              /* stripe-failure: storage metrics hidden, just show note */
              <div className="flex items-center gap-1.5 text-xs text-warning">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{t("plan.stripeFailed", lang)}</span>
              </div>
            )}
          </div>

          {/* Source list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {mockSources.map((source) => (
              <SourceCard key={source.id} source={source} lang={lang} />
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
      )}

      {/* Chat panel — 70% */}
      <div className="flex-1 relative">
        <ChatPanel />
      </div>
    </div>
  );
}

function SourceCard({ source, lang }: { source: MockSource; lang: "en" | "ar" }) {
  return (
    <div
      className={cn(
        "rounded-lg px-3 py-2.5 border transition-colors",
        source.selected ? "border-primary/30 bg-accent" : "border-transparent hover:bg-secondary"
      )}
    >
      <div className="flex items-start gap-2">
        {source.status === "ready" ? (
          <button
            className={cn(
              "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
              source.selected ? "border-primary bg-primary" : "border-border"
            )}
          >
            {source.selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
          </button>
        ) : (
          <div className="mt-0.5 w-4 h-4 rounded border-2 border-border opacity-40 shrink-0" />
        )}
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
            {source.status === "ready" && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-success/10 text-success">
                <Check className="w-3 h-3" />
                {lang === "ar" ? "جاهز" : "Ready"}
              </span>
            )}
            {source.status === "indexing" && (
              <span className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary">
                <Loader2 className="w-3 h-3 animate-spin" />
                {lang === "ar" ? "فهرسة" : "Indexing"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
