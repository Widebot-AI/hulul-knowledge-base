import { X, Download, ExternalLink, FileText, Globe, RotateCcw, AlertTriangle, AlertCircle, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceAvatar } from "@/components/wireframes/SourcePanel";
import { useKB } from "./KBContext";

export function SourcePreviewPanel() {
  const { modal, closeModal, sources } = useKB();
  if (modal?.kind !== "source-preview") return null;

  const source = sources.find(s => s.id === modal.sourceId);
  if (!source) return null;

  const isUrl = source.type === "URL";
  const isBinary = ["DOCX", "XLSX", "PPTX"].includes(source.type);

  return (
    <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <SourceAvatar avatar={source.avatar} type={source.type} size="md" />
            <h3 className="text-sm font-semibold text-foreground">{source.name}</h3>
            <Badge variant="secondary" className="text-[10px] h-4">{source.type}</Badge>
            <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">Ready</span>
          </div>
          <div className="flex items-center gap-1">
            {isUrl && (
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={closeModal}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="px-5 py-2.5 border-b border-border flex gap-6 text-xs shrink-0">
          <div>
            <span className="text-muted-foreground">Added: </span>
            <span className="text-foreground">Mar 10, 2026</span>
          </div>
          {isUrl && (
            <div>
              <span className="text-muted-foreground">Source: </span>
              <a className="text-primary hover:underline" href={source.name} target="_blank" rel="noopener">{source.name}</a>
            </div>
          )}
          {source.tags.length > 0 && (
            <div className="flex gap-1">
              {source.tags.map((t, i) => (
                <span key={i} className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">{t.key}: {t.value}</span>
              ))}
            </div>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isBinary ? (
            <div className="p-8 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                <FileWarning className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Preview Not Available</h4>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                  This file type cannot be previewed in the browser. Download the file to view its contents.
                </p>
              </div>
              <Button size="sm" variant="outline" className="gap-1">
                <Download className="w-3.5 h-3.5" /> Download File
              </Button>
            </div>
          ) : isUrl ? (
            <div className="prose prose-sm max-w-none text-foreground">
              <h1 className="text-lg font-semibold">Getting Started Guide</h1>
              <p className="text-muted-foreground text-xs mb-4">Content fetched on Mar 10, 2026</p>
              <h2>Introduction</h2>
              <p>Welcome to the platform. This guide walks you through the initial setup process.</p>
              <h2>Step 1: Create Your Workspace</h2>
              <p>Navigate to the dashboard and click "New Workspace". Enter your workspace name and select your plan tier.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center h-64 bg-secondary rounded-lg">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">PDF preview rendering area</p>
                  <p className="text-xs text-muted-foreground mt-1">Inline PDF viewer for browser-renderable files</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download File
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
