import { useState } from "react";
import { Upload, Link2, X, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";
import { t } from "./translations";

export function AddSourceModal() {
  const { modal, closeModal, addMockSource, lang } = useKB();
  if (modal?.kind !== "add-source") return null;

  return (
    <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <AddSourceContent initialTab={modal.tab} onClose={closeModal} onAddSource={addMockSource} lang={lang} />
      </div>
    </div>
  );
}

function AddSourceContent({ initialTab, onClose, onAddSource, lang }: {
  initialTab: "file" | "url";
  onClose: () => void;
  onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void;
  lang: "en" | "ar";
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">{t("addSource.title", lang)}</h2>
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
          <Upload className="w-4 h-4 inline me-1.5" /> {t("addSource.fileUpload", lang)}
        </button>
        <button
          onClick={() => setActiveTab("url")}
          className={cn(
            "flex-1 text-sm py-2.5 font-medium text-center border-b-2 transition-colors",
            activeTab === "url" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Link2 className="w-4 h-4 inline me-1.5" /> {t("addSource.url", lang)}
        </button>
      </div>
      <div className="p-5">
        {activeTab === "file" ? (
          <FileUploadTab onClose={onClose} onAddSource={onAddSource} lang={lang} />
        ) : (
          <UrlTab onClose={onClose} onAddSource={onAddSource} lang={lang} />
        )}
      </div>
    </>
  );
}

function FileUploadTab({ onClose, onAddSource, lang }: { onClose: () => void; onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void; lang: "en" | "ar" }) {
  const [files, setFiles] = useState<{ name: string; type: string; size: string; error?: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const addFile = (name: string) => {
    const ext = name.split('.').pop()?.toUpperCase() || "TXT";
    const supported = ["PDF", "DOCX", "PPTX", "XLSX", "TXT", "MD", "HTML", "XML", "JSON", "YAML", "CSV", "PY", "JS", "TS"];
    const error = supported.includes(ext) ? undefined : t("addSource.unsupported", lang);
    setFiles(prev => [...prev, { name, type: ext, size: `${(Math.random() * 8 + 0.5).toFixed(1)} MB`, error }]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
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

  const validCount = files.filter(f => !f.error).length;

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
        <p className="text-sm font-medium text-foreground">{t("addSource.dropOrBrowse", lang)}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("addSource.fileFormats", lang)}</p>
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
        <Button variant="outline" size="sm" onClick={onClose}>{t("chat.cancel", lang)}</Button>
        <Button size="sm" onClick={handleUpload}>
          {validCount > 0 ? `${t("addSource.upload", lang)} ${validCount}` : t("addSource.uploadDemo", lang)}
        </Button>
      </div>
    </div>
  );
}

function UrlTab({ onClose, onAddSource, lang }: { onClose: () => void; onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void; lang: "en" | "ar" }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!url.trim()) {
      setError(t("addSource.urlRequired", lang));
      return;
    }
    if (!url.startsWith("http")) {
      setError(t("addSource.urlInvalid", lang));
      return;
    }
    onAddSource(url, "URL", []);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-foreground block mb-1.5">{t("addSource.urlLabel", lang)}</label>
        <div className={cn(
          "flex items-center border rounded-lg px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30",
          error ? "border-destructive" : "border-border"
        )}>
          <Link2 className="w-4 h-4 text-muted-foreground me-2 shrink-0" />
          <input
            type="url"
            dir="ltr"
            placeholder={t("addSource.urlPlaceholder", lang)}
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
          <p className="text-xs text-muted-foreground mt-1.5">{t("addSource.urlNote", lang)}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>{t("chat.cancel", lang)}</Button>
        <Button size="sm" onClick={handleSubmit}>{t("addSource.addUrl", lang)}</Button>
      </div>
    </div>
  );
}
