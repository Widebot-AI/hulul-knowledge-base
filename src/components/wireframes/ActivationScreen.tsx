import { BookOpen, Sparkles, Upload, Link2, FileText, Globe, ClipboardPaste } from "lucide-react";
import { useKB } from "./KBContext";
import { useState, useCallback } from "react";
import { KBMainInterface } from "./KBMainInterface";

export function ActivationScreen() {
  const { setPhase, addMockSource } = useKB();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate adding dropped files as sources
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      addSource({ name: file.name, type: "file" });
    });
    if (files.length > 0) setPhase("active");
  }, [addSource, setPhase]);

  const handleFileSelect = () => {
    // Simulate file picker
    addSource({ name: "uploaded-document.pdf", type: "file" });
    setPhase("active");
  };

  const sourceTypes = [
    { icon: FileText, label: "PDF", desc: "Upload PDF files" },
    { icon: Globe, label: "Website", desc: "Import from URL" },
    { icon: ClipboardPaste, label: "Paste text", desc: "Paste content" },
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
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border w-full max-w-[520px] mx-4 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">Knowledge Base</h1>
            <p className="text-sm text-muted-foreground">
              Add sources to create a knowledge base AI can reference.
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer py-10 px-6 text-center ${
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
                  {isDragging ? "Drop files here" : "Drop files here or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported: PDF, DOCX, PPTX, TXT, MD, and more
                </p>
              </div>
            </div>
          </div>

          {/* Source type shortcuts */}
          <div className="grid grid-cols-3 gap-2">
            {sourceTypes.map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                onClick={handleFileSelect}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 hover:border-primary/30 transition-colors text-center group"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-foreground">{label}</span>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Sources are indexed for AI-powered search and citation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
