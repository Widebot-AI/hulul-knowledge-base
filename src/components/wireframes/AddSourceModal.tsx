import { useState } from "react";
import { Upload, Link2, X, AlertCircle, Trash2, ChevronDown, ChevronUp, Plus, Info } from "lucide-react";
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

function TagSection({ tags, setTags, lang }: {
  tags: { key: string; value: string }[];
  setTags: React.Dispatch<React.SetStateAction<{ key: string; value: string }[]>>;
  lang: "en" | "ar";
}) {
  const [expanded, setExpanded] = useState(false);
  const [tagKey, setTagKey] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [tagError, setTagError] = useState("");

  const atLimit = tags.length >= 10;
  const keyExists = tags.some(t => t.key === tagKey.trim());
  const canAdd = tagKey.trim() !== "" && tagValue.trim() !== "" && !atLimit;

  const handleAddTag = () => {
    if (!canAdd) return;
    if (keyExists) {
      setTagError(t("tag.duplicateKey", lang));
      return;
    }
    setTags(prev => [...prev, { key: tagKey.trim(), value: tagValue.trim() }]);
    setTagKey("");
    setTagValue("");
    setTagError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTag();
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {t("tag.addTag", lang)} (optional)
      </button>

      {expanded && (
        <div className="border border-border rounded-lg p-3 space-y-3">
          {/* Existing tag chips */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-accent text-accent-foreground"
                >
                  <span className="font-medium">{tag.key}</span>
                  <span className="text-accent-foreground/60">:</span>
                  <span>{tag.value}</span>
                  <button
                    type="button"
                    onClick={() => setTags(prev => prev.filter((_, j) => j !== i))}
                    className="ms-0.5 text-accent-foreground/60 hover:text-accent-foreground transition-colors"
                    aria-label={t("tag.removeTag", lang)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Limit message */}
          {atLimit && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              {t("tag.limitReached", lang)}
            </p>
          )}

          {/* Input row */}
          {!atLimit && (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder={t("tag.key", lang)}
                value={tagKey}
                onChange={e => { setTagKey(e.target.value); setTagError(""); }}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 border border-border rounded px-2 py-1 text-xs bg-background outline-none focus:ring-1 focus:ring-ring/40 placeholder:text-muted-foreground"
              />
              <input
                type="text"
                placeholder={t("tag.value", lang)}
                value={tagValue}
                onChange={e => { setTagValue(e.target.value); setTagError(""); }}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0 border border-border rounded px-2 py-1 text-xs bg-background outline-none focus:ring-1 focus:ring-ring/40 placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!canAdd}
                className={cn(
                  "flex items-center gap-0.5 px-2 py-1 rounded text-xs font-medium transition-colors shrink-0",
                  canAdd
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Plus className="w-3 h-3" />
                {t("tag.addTag", lang)}
              </button>
            </div>
          )}

          {/* Duplicate key error */}
          {tagError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {tagError}
            </p>
          )}

          {/* Immutability notice */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0" />
            {t("tag.immutableNotice", lang)}
          </p>
        </div>
      )}
    </div>
  );
}

function FileUploadTab({ onClose, onAddSource, lang }: { onClose: () => void; onAddSource: (name: string, type: string, tags: { key: string; value: string }[]) => void; lang: "en" | "ar" }) {
  const [files, setFiles] = useState<{ name: string; type: string; size: string; error?: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);

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
    validFiles.forEach(f => onAddSource(f.name, f.type, tags));
    if (validFiles.length === 0) {
      addFile("Demo Report.pdf");
      setTimeout(() => onAddSource("Demo Report.pdf", "PDF", tags), 100);
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

      <TagSection tags={tags} setTags={setTags} lang={lang} />

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
  const [tags, setTags] = useState<{ key: string; value: string }[]>([]);

  const handleSubmit = () => {
    if (!url.trim()) {
      setError(t("addSource.urlRequired", lang));
      return;
    }
    if (!url.startsWith("http")) {
      setError(t("addSource.urlInvalid", lang));
      return;
    }
    onAddSource(url, "URL", tags);
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

      <TagSection tags={tags} setTags={setTags} lang={lang} />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>{t("chat.cancel", lang)}</Button>
        <Button size="sm" onClick={handleSubmit}>{t("addSource.addUrl", lang)}</Button>
      </div>
    </div>
  );
}
