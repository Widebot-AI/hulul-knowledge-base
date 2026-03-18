import { useState } from "react";
import { Upload, Link2, X, Plus, Trash2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";

export function AddSourceModal() {
  const { modal, closeModal, addMockSource } = useKB();
  if (modal?.kind !== "add-source") return null;

  return (
    <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <AddSourceContent initialTab={modal.tab} onClose={closeModal} onAddSource={addMockSource} />
      </div>
    </div>
  );
}

function AddSourceContent({ initialTab, onClose, onAddSource }: {
  initialTab: "file" | "url";
  onClose: () => void;
  onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Add Source</h2>
        <button className="text-muted-foreground hover:text-foreground" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("file")}
          className={cn(
            "flex-1 text-sm py-2.5 font-medium text-center border-b-2 transition-colors",
            activeTab === "file" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Upload className="w-4 h-4 inline mr-1.5" /> File Upload
        </button>
        <button
          onClick={() => setActiveTab("url")}
          className={cn(
            "flex-1 text-sm py-2.5 font-medium text-center border-b-2 transition-colors",
            activeTab === "url" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Link2 className="w-4 h-4 inline mr-1.5" /> URL
        </button>
      </div>
      <div className="p-5">
        {activeTab === "file" ? (
          <FileUploadTab onClose={onClose} onAddSource={onAddSource} />
        ) : (
          <UrlTab onClose={onClose} onAddSource={onAddSource} />
        )}
      </div>
    </>
  );
}

function FileUploadTab({ onClose, onAddSource }: { onClose: () => void; onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void }) {
  const [files, setFiles] = useState<{ name: string; type: string; size: string; error?: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const addFile = (name: string) => {
    const ext = name.split('.').pop()?.toUpperCase() || "TXT";
    const supported = ["PDF", "DOCX", "PPTX", "XLSX", "TXT", "MD", "HTML", "XML", "JSON", "YAML", "CSV", "PY", "JS", "TS"];
    const error = supported.includes(ext) ? undefined : "Unsupported file type";
    setFiles(prev => [...prev, { name, type: ext, size: `${(Math.random() * 8 + 0.5).toFixed(1)} MB`, error }]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Simulate with demo files
    addFile("Dropped Document.pdf");
  };

  const handleUpload = () => {
    const validFiles = files.filter(f => !f.error);
    validFiles.forEach(f => onAddSource(f.name, f.type, []));
    if (validFiles.length === 0) {
      addFile("Demo Report.pdf");
      setTimeout(() => onAddSource("Demo Report.pdf", "PDF", []), 100);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
          isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => addFile(`Document_${Date.now() % 1000}.pdf`)}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, DOCX, PPTX, XLSX, TXT, MD, HTML, code files — up to 10 files, 10 MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className={cn(
              "flex items-center justify-between px-3 py-2 rounded-lg",
              f.error ? "bg-destructive/5 border border-destructive/20" : "bg-secondary"
            )}>
              <div className="flex items-center gap-2 text-xs">
                {f.error && <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                <Badge variant="secondary" className="text-[10px] h-4">{f.type}</Badge>
                <span className="text-foreground font-medium">{f.name}</span>
                {f.error ? (
                  <span className="text-destructive">{f.error}</span>
                ) : (
                  <span className="text-muted-foreground">{f.size}</span>
                )}
              </div>
              <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                {f.error ? <X className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleUpload}>
          {files.filter(f => !f.error).length > 0 ? `Upload ${files.filter(f => !f.error).length} Files` : "Upload Demo File"}
        </Button>
      </div>
    </div>
  );
}

function UrlTab({ onClose, onAddSource }: { onClose: () => void; onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    if (!url.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    onAddSource(url, "URL", []);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-foreground block mb-1.5">Web Page URL</label>
        <div className={cn(
          "flex items-center border rounded-lg px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30",
          error ? "border-destructive" : "border-border"
        )}>
          <Link2 className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="url"
            placeholder="https://example.com/docs/guide"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
          />
        </div>
        {error ? (
          <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1.5">Only publicly accessible pages are supported.</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={handleSubmit}>Add URL</Button>
      </div>
    </div>
  );
}
