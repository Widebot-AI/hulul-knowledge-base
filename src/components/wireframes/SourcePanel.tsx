import { Plus, FileText, Globe, Check, Loader2, AlertTriangle, Upload, Search, RotateCcw, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type SourceStatus = "uploading" | "pending" | "indexing" | "ready" | "failed" | "archived";

type Source = {
  name: string;
  type: string;
  status: SourceStatus;
  selected?: boolean;
  tags?: { key: string; value: string }[];
};

const mockSources: Source[] = [
  { name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true, tags: [{ key: "department", value: "strategy" }] },
  { name: "API Documentation.md", type: "MD", status: "ready", selected: true },
  { name: "Employee Handbook.docx", type: "DOCX", status: "ready", selected: false },
  { name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing" },
  { name: "Release Notes v2.1.txt", type: "TXT", status: "pending" },
  { name: "https://docs.example.com/guide", type: "URL", status: "uploading" },
  { name: "Old Policy.pdf", type: "PDF", status: "failed" },
];

const archivedSources: Source[] = [
  { name: "Q3 Strategy Deck.pdf", type: "PDF", status: "archived", tags: [{ key: "department", value: "strategy" }] },
  { name: "API Documentation.md", type: "MD", status: "archived" },
  { name: "Employee Handbook.docx", type: "DOCX", status: "archived" },
];

const statusConfig: Record<SourceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  uploading: { label: "Uploading", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  pending: { label: "Pending", color: "bg-warning/10 text-warning", icon: <Loader2 className="w-3 h-3 animate-pulse-subtle" /> },
  indexing: { label: "Indexing", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-pulse-subtle" /> },
  ready: { label: "Ready", color: "bg-success/10 text-success", icon: <Check className="w-3 h-3" /> },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive", icon: <AlertTriangle className="w-3 h-3" /> },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", icon: <Archive className="w-3 h-3" /> },
};

type Props = {
  variant?: "normal" | "empty" | "archived";
  storagePercent?: number;
  fileCount?: number;
  fileLimit?: number;
};

export function SourcePanel({ variant = "normal", storagePercent = 65, fileCount = 12, fileLimit = 50 }: Props) {
  const sources = variant === "archived" ? archivedSources : variant === "empty" ? [] : mockSources;

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

      {/* Storage Metrics */}
      <div className="px-4 py-3 border-b border-border space-y-2.5">
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
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto">
        {sources.length === 0 ? (
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
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-3 py-2.5 border transition-colors cursor-pointer",
                    source.selected
                      ? "border-primary/30 bg-accent"
                      : "border-transparent hover:bg-secondary",
                    source.status === "archived" && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {source.status !== "archived" && (
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
