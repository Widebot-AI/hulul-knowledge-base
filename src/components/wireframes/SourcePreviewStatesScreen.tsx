import { X, Download, ExternalLink, FileText, FileWarning, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Variant = "pdf" | "text" | "non-renderable" | "load-failure" | "url-source" | "failed-source";

type Props = {
  variant: Variant;
};

export function SourcePreviewStatesScreen({ variant }: Props) {
  const { lang } = useKB();

  return (
    <div className="flex items-center justify-center h-full bg-background/60 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-2xl max-h-[80vh] flex flex-col">
        <PreviewHeader variant={variant} lang={lang} />
        <MetaBar variant={variant} lang={lang} />
        <PreviewBody variant={variant} lang={lang} />
      </div>
    </div>
  );
}

/* ── Header ── */
function PreviewHeader({ variant, lang }: { variant: Variant; lang: "en" | "ar" }) {
  const config = getHeaderConfig(variant);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shrink-0">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground truncate">{config.name}</h3>
        <Badge variant="secondary" className="text-[10px] h-4 shrink-0">{config.type}</Badge>
        {config.statusBadge}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {variant === "url-source" && (
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button size="icon" variant="ghost" className="h-7 w-7">
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ── Metadata bar ── */
function MetaBar({ variant, lang }: { variant: Variant; lang: "en" | "ar" }) {
  const isUrl = variant === "url-source";

  return (
    <div className="px-5 py-2.5 border-b border-border flex flex-wrap gap-4 sm:gap-6 text-xs shrink-0">
      <div>
        <span className="text-muted-foreground">{t("preview.added", lang)}: </span>
        <span className="text-foreground">Mar 10, 2026</span>
      </div>
      {isUrl && (
        <div className="min-w-0">
          <span className="text-muted-foreground">{t("chat.source", lang)}: </span>
          <a
            className="text-primary hover:underline truncate"
            href="https://docs.example.com/guide"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://docs.example.com/guide
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Preview body ── */
function PreviewBody({ variant, lang }: { variant: Variant; lang: "en" | "ar" }) {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      {variant === "pdf" && <PdfContent lang={lang} />}
      {variant === "text" && <TextContent />}
      {variant === "non-renderable" && <NonRenderableContent lang={lang} />}
      {variant === "load-failure" && <LoadFailureContent lang={lang} />}
      {variant === "url-source" && <UrlSourceContent lang={lang} />}
      {variant === "failed-source" && <FailedSourceContent lang={lang} />}
    </div>
  );
}

/* ── PDF content ── */
function PdfContent({ lang }: { lang: "en" | "ar" }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center h-64 bg-secondary rounded-lg">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t("preview.pdfArea", lang)}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("preview.pdfViewer", lang)}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-1.5">
          <Download className="w-3.5 h-3.5" /> {t("preview.download", lang)}
        </Button>
      </div>
    </div>
  );
}

/* ── Text/code content ── */
function TextContent() {
  const sample = `# config.yaml

app:
  name: "hulul-kb"
  version: "1.0.0"
  environment: production

database:
  host: localhost
  port: 5432
  name: hulul_db

storage:
  max_file_size_mb: 10
  allowed_types:
    - pdf
    - docx
    - txt
    - md`;

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-secondary border border-border overflow-auto max-h-56">
        <pre className="text-xs font-mono text-foreground p-4 whitespace-pre leading-relaxed">
          {sample}
        </pre>
      </div>
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-1.5">
          <Download className="w-3.5 h-3.5" />
          <span>Download File</span>
        </Button>
      </div>
    </div>
  );
}

/* ── Non-renderable (binary) content ── */
function NonRenderableContent({ lang }: { lang: "en" | "ar" }) {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="mx-auto w-14 h-14 rounded-full bg-accent flex items-center justify-center">
        <FileWarning className="w-7 h-7 text-muted-foreground" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{t("preview.notAvailable", lang)}</h4>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
          {t("preview.notAvailableDesc", lang)}
        </p>
      </div>
      <Button size="sm" variant="outline" className="gap-1">
        <Download className="w-3.5 h-3.5" /> {t("preview.download", lang)}
      </Button>
    </div>
  );
}

/* ── Load failure content ── */
function LoadFailureContent({ lang }: { lang: "en" | "ar" }) {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="mx-auto w-14 h-14 rounded-full bg-accent flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-muted-foreground" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{t("previewState.loadFailed", lang)}</h4>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
          {t("previewState.loadFailedDesc", lang)}
        </p>
      </div>
    </div>
  );
}

/* ── URL source content ── */
function UrlSourceContent({ lang: _lang }: { lang: "en" | "ar" }) {
  return (
    <div className="prose prose-sm max-w-none text-foreground">
      <h1 className="text-lg font-semibold text-foreground">Getting Started Guide</h1>
      <p className="text-muted-foreground text-xs mb-4">Content fetched on Mar 10, 2026</p>
      <h2 className="text-base font-semibold text-foreground mt-4 mb-2">Introduction</h2>
      <p className="text-sm text-foreground/90 leading-relaxed">
        Welcome to the platform. This guide walks you through the initial setup process and explains
        the core concepts you need to get started quickly.
      </p>
      <h2 className="text-base font-semibold text-foreground mt-4 mb-2">Step 1: Create Your Workspace</h2>
      <p className="text-sm text-foreground/90 leading-relaxed">
        Navigate to the dashboard and click "New Workspace". Enter your workspace name and select
        your plan tier. Your workspace will be ready within seconds.
      </p>
    </div>
  );
}

/* ── Failed source content ── */
function FailedSourceContent({ lang }: { lang: "en" | "ar" }) {
  return (
    <div className="p-8 text-center space-y-4">
      <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-foreground">{t("previewState.failedSource", lang)}</h4>
        <p className="text-xs text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
          {t("previewState.failedSourceDesc", lang)}
        </p>
      </div>
      <Button size="sm" variant="outline" className="gap-1.5">
        <RefreshCw className="w-3.5 h-3.5" /> {t("sources.retry", lang)}
      </Button>
    </div>
  );
}

/* ── Header config helper ── */
type HeaderConfig = {
  name: string;
  type: string;
  statusBadge: React.ReactNode;
};

function getHeaderConfig(variant: Variant): HeaderConfig {
  switch (variant) {
    case "pdf":
      return {
        name: "Q3 Strategy Deck.pdf",
        type: "PDF",
        statusBadge: (
          <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">
            Ready
          </span>
        ),
      };
    case "text":
      return {
        name: "config.yaml",
        type: "TXT",
        statusBadge: (
          <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">
            Ready
          </span>
        ),
      };
    case "non-renderable":
      return {
        name: "Employee Handbook.docx",
        type: "DOCX",
        statusBadge: (
          <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">
            Ready
          </span>
        ),
      };
    case "load-failure":
      return {
        name: "Annual Report.pdf",
        type: "PDF",
        statusBadge: (
          <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">
            Ready
          </span>
        ),
      };
    case "url-source":
      return {
        name: "https://docs.example.com/guide",
        type: "URL",
        statusBadge: (
          <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-medium">
            Ready
          </span>
        ),
      };
    case "failed-source":
      return {
        name: "Corrupted Document.pdf",
        type: "PDF",
        statusBadge: (
          <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-medium">
            Failed
          </span>
        ),
      };
  }
}
