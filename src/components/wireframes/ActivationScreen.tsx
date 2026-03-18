import { BookOpen, Sparkles, Upload, FileText, Globe, ClipboardPaste } from "lucide-react";
import { useKB } from "./KBContext";
import { useState, useCallback } from "react";
import { KBMainInterface } from "./KBMainInterface";
import { t } from "./translations";

export function ActivationScreen() {
  const { setPhase, addMockSource, lang } = useKB();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      addMockSource(file.name, "file", []);
    });
    if (files.length > 0) setPhase("active");
  }, [addMockSource, setPhase]);

  const handleFileSelect = () => {
    addMockSource("uploaded-document.pdf", "file", []);
    setPhase("active");
  };

  const sourceTypes = [
    { icon: FileText, labelKey: "activation.pdf" as const },
    { icon: Globe, labelKey: "activation.website" as const },
    { icon: ClipboardPaste, labelKey: "activation.pasteText" as const },
  ];

  return (
    <div className="relative h-full">
      {/* Background: the actual KB layout, blurred/dimmed */}
      <div className="absolute inset-0 opacity-30 pointer-events-none blur-[2px]">
        <KBMainInterface />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/40 z-10" />

      {/* Centered card */}
      <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border w-full max-w-[520px] p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">{t("activation.title", lang)}</h1>
            <p className="text-sm text-muted-foreground">
              {t("activation.desc", lang)}
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer py-8 sm:py-10 px-6 text-center ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent/30"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? "bg-primary/15" : "bg-muted"
              }`}>
                <Upload className={`w-5 h-5 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? t("activation.dropHere", lang) : t("activation.dropOrClick", lang)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("activation.supported", lang)}
                </p>
              </div>
            </div>
          </div>

          {/* Source type shortcuts */}
          <div className="grid grid-cols-3 gap-2">
            {sourceTypes.map(({ icon: Icon, labelKey }) => (
              <button
                key={labelKey}
                onClick={handleFileSelect}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 hover:border-primary/30 transition-colors text-center group"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-foreground">{t(labelKey, lang)}</span>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>{t("activation.indexed", lang)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
