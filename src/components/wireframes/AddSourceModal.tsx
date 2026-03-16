import { useState } from "react";
import { Upload, Link2, X, Plus, Trash2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  tab: "file" | "url";
};

export function AddSourceModal({ tab }: Props) {
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
          {activeTab === "file" ? <FileUploadTab /> : <UrlTab />}
        </div>
      </div>
    </div>
  );
}

function FileUploadTab() {
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

      {/* Queued Files Example */}
      <div className="space-y-2">
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
        {/* Rejected file */}
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
      </div>

      {/* Tags Section */}
      <TagsInput />

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Upload 2 Files</Button>
      </div>
    </div>
  );
}

function UrlTab() {
  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div>
        <label className="text-xs font-medium text-foreground block mb-1.5">Web Page URL</label>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center border border-border rounded-lg px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30">
            <Link2 className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <input
              type="url"
              placeholder="https://example.com/docs/guide"
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              readOnly
            />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">Only publicly accessible pages are supported.</p>
      </div>

      {/* Tags Section */}
      <TagsInput />

      {/* Submit */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Add URL</Button>
      </div>
    </div>
  );
}

function TagsInput() {
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
          <input placeholder="Key" className="flex-1 text-xs border border-border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30" defaultValue="quarter" readOnly />
          <input placeholder="Value" className="flex-1 text-xs border border-border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30" defaultValue="Q4" readOnly />
          <button className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
        <Plus className="w-3 h-3" /> Add Tag
      </button>
    </div>
  );
}
