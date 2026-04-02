import { Check, Loader2, AlertTriangle, RotateCcw, FileText, Send, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Variant =
  | "single-uploading"
  | "batch-mixed"
  | "processing-failure"
  | "first-source-ready";

type Props = {
  variant: Variant;
};

type PipelineStatus = "uploading" | "indexing" | "pending" | "ready" | "failed";

type MockSource = {
  id: string;
  name: string;
  type: string;
  status: PipelineStatus;
};

export function UploadPipelineScreen({ variant }: Props) {
  const { lang } = useKB();
  const sources = getMockSources(variant);
  const firstReady = variant === "first-source-ready";

  return (
    <div className="flex h-full overflow-hidden">
      {/* Source panel — 30% */}
      <div className="w-[30%] shrink-0 flex flex-col bg-panel border-e border-border">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h2>
        </div>

        {/* Source list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sources.map((source) => (
            <PipelineSourceCard key={source.id} source={source} lang={lang} />
          ))}
        </div>

        {/* Add sources button */}
        <div className="px-4 py-3 border-t border-border">
          <Button size="sm" className="w-full h-8 text-xs gap-1.5 font-medium" disabled>
            <Plus className="w-3.5 h-3.5" />
            {t("sources.add", lang)}
          </Button>
        </div>
      </div>

      {/* Chat panel — 70% */}
      <div className="flex-1 flex flex-col">
        {/* Chat body */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-2 text-muted-foreground">
          {firstReady ? (
            <>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mb-2">
                <Check className="w-5 h-5 text-success" />
              </div>
              <p className="text-sm font-medium text-foreground">{t("upload.firstSourceReady", lang)}</p>
              <p className="text-xs text-muted-foreground">{t("chat.askAboutSources", lang)}</p>
            </>
          ) : (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">{t("chat.addSourcesGroundAI" as never, lang) ?? t("chat.sourcesGroundAI", lang)}</p>
              <p className="text-xs">{t("chat.addAndSelect", lang)}</p>
            </>
          )}
        </div>

        {/* Chat input area */}
        <div className="px-4 py-3 border-t border-border">
          <div className={cn(
            "flex items-center gap-2 border rounded-xl px-4 py-2.5 bg-background",
            firstReady ? "border-border" : "border-border opacity-50"
          )}>
            <input
              type="text"
              placeholder={firstReady ? t("chat.askQuestion", lang) : t("chat.addSourcesToStart", lang)}
              disabled={!firstReady}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
            />
            <button
              disabled={!firstReady}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                firstReady
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

function PipelineSourceCard({ source, lang }: { source: MockSource; lang: "en" | "ar" }) {
  const statusConfig: Record<PipelineStatus, { label: string; color: string; icon: React.ReactNode }> = {
    uploading: {
      label: t("status.uploading", lang),
      color: "bg-primary/10 text-primary",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    indexing: {
      label: t("status.indexing", lang),
      color: "bg-primary/10 text-primary",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    pending: {
      label: t("status.pending", lang),
      color: "bg-warning/10 text-warning",
      icon: <Loader2 className="w-3 h-3 animate-spin" />,
    },
    ready: {
      label: t("status.ready", lang),
      color: "bg-success/10 text-success",
      icon: <Check className="w-3 h-3" />,
    },
    failed: {
      label: t("status.failed", lang),
      color: "bg-destructive/10 text-destructive",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
  };

  const sc = statusConfig[source.status];

  return (
    <div className="rounded-lg px-3 py-2.5 border border-transparent hover:bg-secondary transition-colors">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 w-4 h-4 rounded border-2 border-border opacity-40 shrink-0" />
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
            <span className={cn("inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium", sc.color)}>
              {sc.icon}
              {sc.label}
            </span>
          </div>
          {/* Retry button for failed sources */}
          {source.status === "failed" && (
            <div className="mt-1.5">
              <button className="text-xs text-primary hover:underline flex items-center gap-1">
                <RotateCcw className="w-2.5 h-2.5" />
                {t("sources.retry", lang)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMockSources(variant: Variant): MockSource[] {
  switch (variant) {
    case "single-uploading":
      return [
        { id: "1", name: "Annual Report 2025.pdf", type: "PDF", status: "uploading" },
      ];
    case "batch-mixed":
      return [
        { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready" },
        { id: "2", name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing" },
        { id: "3", name: "Release Notes v2.1.txt", type: "TXT", status: "pending" },
      ];
    case "processing-failure":
      return [
        { id: "1", name: "Old Policy.pdf", type: "PDF", status: "failed" },
        { id: "2", name: "API Documentation.md", type: "MD", status: "ready" },
      ];
    case "first-source-ready":
      return [
        { id: "1", name: "Onboarding Guide.pdf", type: "PDF", status: "ready" },
      ];
  }
}
