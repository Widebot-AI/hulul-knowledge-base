import { Plus, FileText, Globe, Check, Loader2, AlertTriangle, Upload, RotateCcw, Archive, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type SourceStatus = "fetching" | "uploading" | "pending" | "indexing" | "ready" | "failed" | "archived" | "pending_cleanup";

type Source = {
  name: string;
  type: string;
  status: SourceStatus;
  selected?: boolean;
  tags?: { key: string; value: string }[];
  retryCount?: number;
  retryLocked?: boolean;
};

const mockSources: Source[] = [
  { name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true, tags: [{ key: "department", value: "strategy" }] },
  { name: "API Documentation.md", type: "MD", status: "ready", selected: true },
  { name: "Employee Handbook.docx", type: "DOCX", status: "ready", selected: false },
  { name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing" },
  { name: "Release Notes v2.1.txt", type: "TXT", status: "pending" },
  { name: "https://docs.example.com/guide", type: "URL", status: "fetching" },
  { name: "Old Policy.pdf", type: "PDF", status: "failed" },
];

const pendingCleanupSources: Source[] = [
  { name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true },
  { name: "API Documentation.md", type: "MD", status: "ready", selected: true },
  { name: "Outdated Report.pdf", type: "PDF", status: "pending_cleanup", retryCount: 2 },
  { name: "Broken Data.csv", type: "CSV", status: "pending_cleanup", retryCount: 3, retryLocked: true },
];

const archivedSources: Source[] = [
  { name: "Q3 Strategy Deck.pdf", type: "PDF", status: "archived", tags: [{ key: "department", value: "strategy" }] },
  { name: "API Documentation.md", type: "MD", status: "archived" },
  { name: "Employee Handbook.docx", type: "DOCX", status: "archived" },
];

const statusConfig: Record<SourceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  fetching: { label: "Fetching", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  uploading: { label: "Uploading", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  pending: { label: "Pending", color: "bg-warning/10 text-warning", icon: <Clock className="w-3 h-3" /> },
  indexing: { label: "Indexing", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  ready: { label: "Ready", color: "bg-success/10 text-success", icon: <Check className="w-3 h-3" /> },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive", icon: <AlertTriangle className="w-3 h-3" /> },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", icon: <Archive className="w-3 h-3" /> },
  pending_cleanup: { label: "Cleanup Pending", color: "bg-warning/10 text-warning", icon: <AlertTriangle className="w-3 h-3" /> },
};

type Props = {
  variant?: "normal" | "empty" | "archived" | "pending_cleanup" | "loading";
  storagePercent?: number;
  fileCount?: number;
  fileLimit?: number;
};

export function SourcePanel({ variant = "normal", storagePercent = 65, fileCount = 12, fileLimit = 50 }: Props) {
  const sources =
    variant === "archived" ? archivedSources
    : variant === "pending_cleanup" ? pendingCleanupSources
    : variant === "empty" ? []
    : mockSources;

  return (
    <div className="w-full h-full flex flex-col bg-panel border-r border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Sources</h2>
        {variant !== "archived" && (
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
            <Plus className="w-3 h-3" /> Add Source
          </Button>
        )}
      </div>

      {/* Storage Metrics — US-004 Req: Loading skeleton */}
      <div className="px-4 py-3 border-b border-border space-y-2.5">
        {variant === "loading" ? (
          <>
            <div>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="font-medium text-foreground">{storagePercent}%</span>
              </div>
              <Progress value={storagePercent} className="h-1.5" />
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Files Added</span>
              <span className="font-medium text-foreground">{variant === "empty" ? 0 : fileCount} / {fileLimit}</span>
            </div>
          </>
        )}
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto">
        {variant === "loading" ? (
          <div className="p-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg px-3 py-2.5 border border-transparent">
                <div className="flex items-start gap-2">
                  <Skeleton className="w-4 h-4 rounded mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-10 rounded" />
                      <Skeleton className="h-4 w-14 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-accent-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No sources yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add your first source to start asking questions.
            </p>
            <Button size="sm" className="gap-1 text-xs">
              <Plus className="w-3 h-3" /> Add Source
            </Button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sources.map((source, i) => {
              const sc = statusConfig[source.status];
              const isNonSelectable = ["archived", "pending_cleanup", "fetching", "uploading", "pending", "indexing", "failed"].includes(source.status);
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-3 py-2.5 border transition-colors cursor-pointer",
                    source.selected
                      ? "border-primary/30 bg-accent"
                      : "border-transparent hover:bg-secondary",
                    (source.status === "archived" || source.status === "pending_cleanup") && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!["archived", "pending_cleanup"].includes(source.status) && (
                      <div className={cn(
                        "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                        source.selected
                          ? "border-primary bg-primary"
                          : source.status === "ready"
                          ? "border-border"
                          : "border-border opacity-40"
                      )}>
                        {source.selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {source.type === "URL" ? (
                          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-xs font-medium text-foreground truncate">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal">{source.type}</Badge>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium", sc.color)}>
                          {sc.icon}
                          {sc.label}
                        </span>
                      </div>
                      {source.tags && source.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {source.tags.map((tag, ti) => (
                            <span key={ti} className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                              {tag.key}: {tag.value}
                            </span>
                          ))}
                        </div>
                      )}
                      {source.status === "failed" && (
                        <button className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1">
                          <RotateCcw className="w-2.5 h-2.5" /> Retry
                        </button>
                      )}
                      {source.status === "archived" && (
                        <button className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1">
                          <RotateCcw className="w-2.5 h-2.5" /> Reactivate
                        </button>
                      )}
                      {/* US-005 S4: pending_cleanup state */}
                      {source.status === "pending_cleanup" && (
                        <div className="mt-1.5 space-y-1">
                          <p className="text-[10px] text-warning">No longer queryable — partial deletion</p>
                          {source.retryLocked ? (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Max retries reached — contact support</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                <RotateCcw className="w-2.5 h-2.5" /> Retry cleanup
                              </button>
                              <span className="text-[10px] text-muted-foreground">({source.retryCount}/3 attempts)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
