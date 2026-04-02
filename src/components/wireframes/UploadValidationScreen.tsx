import { Upload, AlertCircle, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Variant =
  | "unsupported-type"
  | "file-too-large"
  | "duplicate-name"
  | "storage-cap"
  | "file-limit"
  | "batch-mixed";

type Props = {
  variant: Variant;
};

type MockFile = {
  name: string;
  type: string;
  size: string;
  error?: string;
};

export function UploadValidationScreen({ variant }: Props) {
  const { lang } = useKB();

  const files = getFiles(variant, lang);
  const topBanner = getTopBanner(variant, lang);

  return (
    <div className="flex items-center justify-center h-full bg-background/60 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{t("addSource.title", lang)}</h2>
          <button className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab strip (static — file tab active) */}
        <div className="flex border-b border-border">
          <div className="flex-1 text-sm py-2.5 font-medium text-center border-b-2 border-primary text-primary">
            <Upload className="w-4 h-4 inline me-1.5" />
            {t("addSource.fileUpload", lang)}
          </div>
          <div className="flex-1 text-sm py-2.5 font-medium text-center border-b-2 border-transparent text-muted-foreground">
            {t("addSource.url", lang)}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Top-level error banner (storage-cap / file-limit) */}
          {topBanner && (
            <div role="alert" className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs text-destructive">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{topBanner}</span>
            </div>
          )}

          {/* Drop zone (static, no interaction) */}
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">{t("addSource.dropOrBrowse", lang)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("addSource.fileFormats", lang)}</p>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg",
                    f.error
                      ? "bg-destructive/5 border border-destructive/20"
                      : "bg-secondary"
                  )}
                >
                  <div className="flex items-center gap-2 text-xs min-w-0">
                    {f.error && (
                      <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                    )}
                    <Badge variant="secondary" className="text-[10px] h-4 shrink-0">
                      {f.type}
                    </Badge>
                    <span className="text-foreground font-medium truncate">{f.name}</span>
                    {f.error ? (
                      <span className="text-destructive shrink-0">{f.error}</span>
                    ) : (
                      <span className="text-muted-foreground shrink-0">{f.size}</span>
                    )}
                  </div>
                  <button className="ms-2 text-muted-foreground hover:text-destructive shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">{t("chat.cancel", lang)}</Button>
            <Button size="sm" disabled={files.some(f => f.error) && !topBanner}>
              {t("addSource.upload", lang)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getFiles(variant: Variant, lang: "en" | "ar"): MockFile[] {
  switch (variant) {
    case "unsupported-type":
      return [
        { name: "setup.exe", type: "EXE", size: "3.2 MB", error: t("upload.unsupportedType", lang) },
        { name: "Annual Report.pdf", type: "PDF", size: "4.1 MB" },
      ];
    case "file-too-large":
      return [
        { name: "Product Video.mp4", type: "MP4", size: "15 MB", error: t("upload.fileTooLarge", lang) },
      ];
    case "duplicate-name":
      return [
        { name: "Q3 Strategy Deck.pdf", type: "PDF", size: "2.8 MB", error: t("upload.duplicateName", lang) },
      ];
    case "storage-cap":
      return [
        { name: "Quarterly Report.pdf", type: "PDF", size: "5.6 MB" },
        { name: "Market Analysis.docx", type: "DOCX", size: "3.2 MB" },
      ];
    case "file-limit":
      return [
        { name: "New Policy.pdf", type: "PDF", size: "1.4 MB" },
      ];
    case "batch-mixed":
      return [
        { name: "Annual Report.pdf", type: "PDF", size: "4.1 MB" },
        { name: "setup.exe", type: "EXE", size: "3.2 MB", error: t("upload.unsupportedType", lang) },
        { name: "Product Video.mp4", type: "MP4", size: "15 MB", error: t("upload.fileTooLarge", lang) },
        { name: "Q3 Strategy Deck.pdf", type: "PDF", size: "2.8 MB", error: t("upload.duplicateName", lang) },
      ];
  }
}

function getTopBanner(variant: Variant, lang: "en" | "ar"): string | null {
  if (variant === "storage-cap") return t("upload.storageCapExceeded", lang);
  if (variant === "file-limit") return t("upload.fileLimitExceeded", lang);
  return null;
}
