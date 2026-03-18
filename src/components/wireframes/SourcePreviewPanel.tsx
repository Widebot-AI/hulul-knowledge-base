import { X, Download, ExternalLink, FileText, Globe, RotateCcw, AlertTriangle, AlertCircle, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SourceAvatar } from "@/components/wireframes/SourcePanel";

type Props = {
  type: "file" | "url" | "failed" | "fallback" | "unavailable";
};

export function SourcePreviewPanel({ type }: Props) {
  // US-009 S3: Failed source — show failure reason + retry
  if (type === "failed") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
        <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <SourceAvatar type="PDF" size="md" />
              <h3 className="text-sm font-semibold text-foreground">Old Policy.pdf</h3>
              <Badge variant="secondary" className="text-[10px] h-4">PDF</Badge>
              <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-medium">Failed</span>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Processing Failed</h4>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                This source could not be indexed. The file may be corrupted or contain unsupported content structures.
              </p>
            </div>
            <Button size="sm" className="gap-1">
              <RotateCcw className="w-3.5 h-3.5" /> Retry Processing
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // US-009 S4: Non-renderable file — fallback with download
  if (type === "fallback") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
        <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <SourceAvatar avatar="https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg" type="DOCX" size="md" />
              <h3 className="text-sm font-semibold text-foreground">Employee Handbook.docx</h3>
              <Badge variant="secondary" className="text-[10px] h-4">DOCX</Badge>
              <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">Ready</span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="px-5 py-2.5 border-b border-border flex gap-6 text-xs">
            <div>
              <span className="text-muted-foreground">Uploaded: </span>
              <span className="text-foreground">Mar 8, 2026</span>
            </div>
          </div>
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
        </div>
      </div>
    );
  }

  // US-009 S5: Preview unavailable (load error)
  if (type === "unavailable") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
        <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <SourceAvatar avatar="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" type="PDF" size="md" />
              <h3 className="text-sm font-semibold text-foreground">Q3 Strategy Deck.pdf</h3>
              <Badge variant="secondary" className="text-[10px] h-4">PDF</Badge>
              <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">Ready</span>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-warning" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Preview Unavailable</h4>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
                The preview content could not be loaded. This source is still indexed and queryable.
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="w-3.5 h-3.5" /> Download Instead
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // US-009 S1, S6: Normal file/URL preview
  const previewAvatar = type === "url"
    ? undefined
    : "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg";

  return (
    <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <SourceAvatar avatar={previewAvatar} type={type === "url" ? "URL" : "PDF"} size="md" />
            <h3 className="text-sm font-semibold text-foreground">
              {type === "url" ? "Getting Started Guide" : "Q3 Strategy Deck.pdf"}
            </h3>
            <Badge variant="secondary" className="text-[10px] h-4">{type === "url" ? "URL" : "PDF"}</Badge>
            <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">Ready</span>
          </div>
          <div className="flex items-center gap-1">
            {type === "url" && (
              <Button size="icon" variant="ghost" className="h-7 w-7">
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="px-5 py-2.5 border-b border-border flex gap-6 text-xs shrink-0">
          <div>
            <span className="text-muted-foreground">Uploaded: </span>
            <span className="text-foreground">Mar 10, 2026</span>
          </div>
          {type === "url" && (
            <div>
              <span className="text-muted-foreground">Source: </span>
              <a className="text-primary hover:underline">https://docs.example.com/guide</a>
            </div>
          )}
          <div className="flex gap-1">
            <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">department: strategy</span>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {type === "url" ? (
            <div className="prose prose-sm max-w-none text-foreground">
              <h1 className="text-lg font-semibold">Getting Started Guide</h1>
              <p className="text-muted-foreground text-xs mb-4">Content fetched on Mar 10, 2026</p>
              <h2>Introduction</h2>
              <p>Welcome to the platform. This guide walks you through the initial setup process, from creating your workspace to inviting team members.</p>
              <h2>Step 1: Create Your Workspace</h2>
              <p>Navigate to the dashboard and click "New Workspace". Enter your workspace name and select your plan tier.</p>
              <h2>Step 2: Invite Team Members</h2>
              <p>From Settings → Team, enter email addresses to invite collaborators. Each member can be assigned a role: Owner, Admin, Editor, or Viewer.</p>
              <h2>Step 3: Configure Integrations</h2>
              <p>Connect your existing tools from the Integrations panel. Supported integrations include Slack, Jira, and GitHub.</p>
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