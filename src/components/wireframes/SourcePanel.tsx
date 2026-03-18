import { Plus, FileText, Globe, Check, Loader2, AlertTriangle, Upload, RotateCcw, Archive, Clock, Lock, Trash2, MoreVertical, Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useKB, type SourceStatus } from "./KBContext";

/** Reusable source avatar */
export function SourceAvatar({ avatar, type, size = "sm" }: { avatar?: string; type: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const iconDim = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const FallbackIcon = type === "URL" ? Globe : FileText;

  return (
    <Avatar className={cn(dim, "rounded-lg shrink-0 border border-border")}>
      {avatar && <AvatarImage src={avatar} alt={type} className="object-contain rounded-lg p-1" />}
      <AvatarFallback className="rounded-lg bg-accent text-muted-foreground">
        <FallbackIcon className={iconDim} />
      </AvatarFallback>
    </Avatar>
  );
}

const statusConfig: Record<SourceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  fetching: { label: "Fetching", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  uploading: { label: "Uploading", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  pending: { label: "Pending", color: "bg-warning/10 text-warning", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  indexing: { label: "Indexing", color: "bg-primary/10 text-primary", icon: <Loader2 className="w-3 h-3 animate-spin" /> },
  ready: { label: "Ready", color: "bg-success/10 text-success", icon: <Check className="w-3 h-3" /> },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive", icon: <AlertTriangle className="w-3 h-3" /> },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", icon: <Archive className="w-3 h-3" /> },
  pending_cleanup: { label: "Cleanup Pending", color: "bg-warning/10 text-warning", icon: <AlertTriangle className="w-3 h-3" /> },
};

export function SourcePanel() {
  const { sources, toggleSourceSelection, openModal, retrySource } = useKB();

  const readySources = sources.filter(s => s.status === "ready");
  const totalFiles = sources.length;
  const storagePercent = Math.min(100, Math.round((totalFiles / 50) * 100) * 4.6);

  return (
    <div className="w-full h-full flex flex-col bg-panel border-r border-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border space-y-2">
        <h2 className="text-sm font-semibold text-foreground">Sources</h2>
        <Button
          size="sm"
          className="w-full h-8 text-xs gap-1.5 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => openModal({ kind: "add-source", tab: "file" })}
        >
          <Plus className="w-3.5 h-3.5" /> Add sources
        </Button>
      </div>

      {/* Storage Metrics */}
      <div className="px-4 py-3 border-b border-border space-y-2.5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Storage Used</span>
            <span className="font-medium text-foreground">{Math.round(storagePercent)}%</span>
          </div>
          <Progress value={storagePercent} className="h-1.5" />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Files Added</span>
          <span className="font-medium text-foreground">{totalFiles} / 50</span>
        </div>
      </div>

      {/* Source List */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-3">
              <Upload className="w-5 h-5 text-accent-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No sources yet</p>
            <p className="text-xs text-muted-foreground mb-4">
              Add your first source to start asking questions.
            </p>
            <Button size="sm" className="gap-1 text-xs" onClick={() => openModal({ kind: "add-source", tab: "file" })}>
              <Plus className="w-3 h-3" /> Add Source
            </Button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sources.map((source) => {
              const sc = statusConfig[source.status];
              const isTerminal = source.status === "ready" || source.status === "failed";
              return (
                <div
                  key={source.id}
                  className={cn(
                    "rounded-lg px-3 py-2.5 border transition-colors group cursor-pointer",
                    source.selected
                      ? "border-primary/30 bg-accent"
                      : "border-transparent hover:bg-secondary",
                    (source.status === "archived" || source.status === "pending_cleanup") && "opacity-60"
                  )}
                  onClick={() => {
                    if (source.status === "ready") {
                      openModal({ kind: "source-preview", sourceId: source.id });
                    }
                  }}
                >
                  <div className="flex items-start gap-2">
                    {/* Selection checkbox — only for ready sources */}
                    {source.status === "ready" && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSourceSelection(source.id); }}
                        className={cn(
                          "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          source.selected ? "border-primary bg-primary" : "border-border hover:border-primary/50"
                        )}
                      >
                        {source.selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                      </button>
                    )}
                    {!["ready", "archived", "pending_cleanup"].includes(source.status) && (
                      <div className="mt-0.5 w-4 h-4 rounded border-2 border-border opacity-40 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <SourceAvatar avatar={source.avatar} type={source.type} size="sm" />
                        <span className="text-xs font-medium text-foreground truncate">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-normal">{source.type}</Badge>
                        <span className={cn("inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium", sc.color)}>
                          {sc.icon}
                          {sc.label}
                        </span>
                      </div>
                      {source.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {source.tags.map((tag, ti) => (
                            <span key={ti} className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                              {tag.key}: {tag.value}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Failed retry action */}
                      {source.status === "failed" && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); retrySource(source.id); }}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-2.5 h-2.5" /> Retry
                          </button>
                        </div>
                      )}
                      {/* Pending cleanup */}
                      {source.status === "pending_cleanup" && (
                        <div className="mt-1.5 space-y-1">
                          <p className="text-xs text-warning">No longer queryable — partial deletion</p>
                          {source.retryLocked ? (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Max retries reached — contact support</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => e.stopPropagation()} className="text-xs text-primary hover:underline flex items-center gap-1">
                                <RotateCcw className="w-2.5 h-2.5" /> Retry cleanup
                              </button>
                              <span className="text-[10px] text-muted-foreground">({source.retryCount}/3 attempts)</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* More options dropdown */}
                    {isTerminal && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="mt-0.5 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent text-muted-foreground">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); openModal({ kind: "source-preview", sourceId: source.id }); }}
                            className="text-xs gap-2"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs gap-2"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); openModal({ kind: "delete-confirm", sourceId: source.id, sourceName: source.name }); }}
                            className="text-xs gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
