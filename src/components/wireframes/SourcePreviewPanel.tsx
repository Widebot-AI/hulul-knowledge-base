import { X, Download, ExternalLink, FileText, Globe, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  type: "file" | "url";
};

export function SourcePreviewPanel({ type }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            {type === "url" ? <Globe className="w-4 h-4 text-muted-foreground" /> : <FileText className="w-4 h-4 text-muted-foreground" />}
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
            <div className="flex items-center justify-center h-64 bg-secondary rounded-lg">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">PDF preview rendering area</p>
                <p className="text-xs text-muted-foreground mt-1">Inline PDF viewer for browser-renderable files</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
