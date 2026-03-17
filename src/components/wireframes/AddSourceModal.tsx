import { useState } from "react";
import { Upload, Link2, X, Plus, Trash2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  tab: "file" | "url";
  showAllErrors?: boolean;
  urlError?: string;
};

export function AddSourceModal({ tab, showAllErrors, urlError }: Props) {
  const [activeTab, setActiveTab] = useState<"file" | "url">(tab);

  return (
    <div className="flex items-center justify-center min-h-screen bg-foreground/30 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Add Source</h2>
          <button className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("file")}
            className={cn(
              "flex-1 text-sm py-2.5 font-medium text-center border-b-2 transition-colors",
              activeTab === "file"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="w-4 h-4 inline mr-1.5" />
            File Upload
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={cn(
              "flex-1 text-sm py-2.5 font-medium text-center border-b-2 transition-colors",
              activeTab === "url"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Link2 className="w-4 h-4 inline mr-1.5" />
            URL
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {activeTab === "file" ? (
            <FileUploadTab showAllErrors={showAllErrors} />
          ) : (
            <UrlTab error={urlError} />
          )}
        </div>
      </div>
    </div>
  );
}

function FileUploadTab({ showAllErrors }: { showAllErrors?: boolean }) {
  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, DOCX, PPTX, XLSX, TXT, MD, HTML, code files — up to 10 files, 10 MB each
        </p>
      </div>

      {/* Queued Files with various validation states */}
      <div className="space-y-2">
        {/* Valid file */}
        <div className="flex items-center justify-between px-3 py-2 bg-secondary rounded-lg">
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-[10px] h-4">PDF</Badge>
            <span className="text-foreground font-medium">Product Roadmap Q4.pdf</span>
            <span className="text-muted-foreground">2.4 MB</span>
          </div>
          <button className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Valid file */}
        <div className="flex items-center justify-between px-3 py-2 bg-secondary rounded-lg">
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-[10px] h-4">DOCX</Badge>
            <span className="text-foreground font-medium">Meeting Notes.docx</span>
            <span className="text-muted-foreground">890 KB</span>
          </div>
          <button className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* US-002 S6: Unsupported file type */}
        <div className="flex items-center justify-between px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
            <span className="text-foreground font-medium">video.mp4</span>
            <span className="text-destructive">Unsupported file type</span>
          </div>
          <button className="text-muted-foreground hover:text-destructive">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {showAllErrors && (
          <>
            {/* US-002 S6: File exceeds 10 MB */}
            <div className="flex items-center justify-between px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                <span className="text-foreground font-medium">LargeDataset.csv</span>
                <span className="text-destructive">Exceeds 10 MB file size limit</span>
              </div>
              <button className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* US-002 S6: Duplicate file name */}
            <div className="flex items-center justify-between px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                <span className="text-foreground font-medium">Q3 Strategy Deck.pdf</span>
                <span className="text-destructive">File already exists — delete or rename</span>
              </div>
              <button className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* US-002 S6: Storage cap exceeded */}
            <div className="flex items-center justify-between px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                <span className="text-foreground font-medium">Annual Report.pdf</span>
                <span className="text-destructive">Storage limit reached — delete sources or upgrade</span>
              </div>
              <button className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* US-002 S6: File count limit */}
            <div className="flex items-center justify-between px-3 py-2 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                <span className="text-foreground font-medium">NewFile.txt</span>
                <span className="text-destructive">File limit reached (50/50) — delete sources or upgrade</span>
              </div>
              <button className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* US-002 S6: Batch limit exceeded */}
            <div className="px-3 py-2 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-warning">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>3 files were excluded — maximum 10 files per batch</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tags Section */}
      <TagsInput showDuplicateError={showAllErrors} />

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Upload 2 Files</Button>
      </div>
    </div>
  );
}

function UrlTab({ error }: { error?: string }) {
  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="text-xs font-medium text-foreground block mb-1.5">Web Page URL</label>
        <div className="flex gap-2">
          <div className={cn(
            "flex-1 flex items-center border rounded-lg px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30",
            error ? "border-destructive" : "border-border"
          )}>
            <Link2 className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <input
              type="url"
              placeholder="https://example.com/docs/guide"
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              defaultValue={error ? "https://docs.example.com/guide" : ""}
              readOnly
            />
          </div>
        </div>
        {!error && (
          <p className="text-[11px] text-muted-foreground mt-1.5">Only publicly accessible pages are supported.</p>
        )}
        {/* US-008 S2-S4: URL-specific error messages */}
        {error === "duplicate" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            This URL already exists as a source in your workspace.
          </p>
        )}
        {error === "not_found" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Page not found (404). Check the URL and try again.
          </p>
        )}
        {error === "blocked" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            This page could not be accessed. It may be blocked or behind a firewall.
          </p>
        )}
        {error === "no_content" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            No readable content could be extracted. JavaScript-heavy or dynamic pages may not be supported.
          </p>
        )}
        {error === "auth_required" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            This page requires login or a subscription. Only publicly accessible pages are supported.
          </p>
        )}
        {error === "timeout" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            The page took too long to load. Try again or use a different URL.
          </p>
        )}
        {error === "too_large" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            The extracted content from this URL exceeds the 10 MB file size limit.
          </p>
        )}
        {error === "service_unavailable" && (
          <p className="text-[11px] text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Our URL processing service is temporarily unavailable. Please try again shortly.
          </p>
        )}
      </div>

      {/* Tags Section */}
      <TagsInput />

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" disabled={!!error}>Add URL</Button>
      </div>
    </div>
  );
}

function TagsInput({ showDuplicateError }: { showDuplicateError?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-foreground">Tags (optional)</label>
        <span className="text-[10px] text-muted-foreground">2 / 10</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
        <Info className="w-3 h-3" />
        Tags cannot be edited after upload.
      </div>
      <div className="space-y-1.5">
        <div className="flex gap-2 items-center">
          <input placeholder="Key" className="flex-1 text-xs border border-border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30" defaultValue="department" readOnly />
          <input placeholder="Value" className="flex-1 text-xs border border-border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30" defaultValue="engineering" readOnly />
          <button className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <input placeholder="Key" className={cn(
            "flex-1 text-xs border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30",
            showDuplicateError ? "border-destructive" : "border-border"
          )} defaultValue={showDuplicateError ? "department" : "quarter"} readOnly />
          <input placeholder="Value" className="flex-1 text-xs border border-border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30" defaultValue={showDuplicateError ? "sales" : "Q4"} readOnly />
          <button className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* US-007 S3: Duplicate key error */}
        {showDuplicateError && (
          <p className="text-[10px] text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Duplicate key "department" — each tag key must be unique.
          </p>
        )}
      </div>
      <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
        <Plus className="w-3 h-3" /> Add Tag
      </button>
    </div>
  );
}
