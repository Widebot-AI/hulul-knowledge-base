import { Globe, AlertCircle, RefreshCw, Link2, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Variant =
  | "success"
  | "page-not-found"
  | "page-blocked"
  | "no-content"
  | "auth-required"
  | "rate-limited"
  | "timeout"
  | "service-unavailable"
  | "content-too-large"
  | "duplicate";

type Props = {
  variant: Variant;
};

const ERROR_VARIANTS: Variant[] = [
  "page-not-found",
  "page-blocked",
  "no-content",
  "auth-required",
  "rate-limited",
  "timeout",
  "service-unavailable",
  "content-too-large",
];

function getErrorKey(variant: Variant): string {
  const map: Record<string, string> = {
    "page-not-found": "url.notFound",
    "page-blocked": "url.blocked",
    "no-content": "url.noContent",
    "auth-required": "url.authRequired",
    "rate-limited": "url.rateLimited",
    "timeout": "url.timeout",
    "service-unavailable": "url.serviceUnavailable",
    "content-too-large": "url.contentTooLarge",
  };
  return map[variant] ?? "url.notFound";
}

export function UrlIngestionScreen({ variant }: Props) {
  const { lang } = useKB();

  if (variant === "success") {
    return <SuccessLayout lang={lang} />;
  }

  if (variant === "duplicate") {
    return <DuplicateLayout lang={lang} />;
  }

  if ((ERROR_VARIANTS as string[]).includes(variant)) {
    return <ErrorLayout variant={variant} lang={lang} />;
  }

  return null;
}

/* ── Success: split-like layout with source panel showing fetching state ── */
function SuccessLayout({ lang }: { lang: "en" | "ar" }) {
  return (
    <div className="flex items-center justify-center h-full bg-background/60 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h3>
        </div>

        {/* Source row — fetching */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-secondary/40">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">Getting Started Guide</p>
              <p className="text-xs text-muted-foreground truncate">https://docs.example.com/guide</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className="text-[10px] h-4">URL</Badge>
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t("status.fetching", lang)}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Fetching and indexing URL content…
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Error layout: source card with Failed badge + specific error ── */
function ErrorLayout({ variant, lang }: { variant: Variant; lang: "en" | "ar" }) {
  const errorKey = getErrorKey(variant);
  const errorMessage = t(errorKey as Parameters<typeof t>[0], lang);

  return (
    <div className="flex items-center justify-center h-full bg-background/60 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{t("sources.title", lang)}</h3>
        </div>

        <div className="p-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 space-y-2.5">
            {/* Source row header */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center shrink-0 mt-0.5">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">https://docs.example.com/guide</p>
                <p className="text-xs text-muted-foreground">https://docs.example.com/guide</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="secondary" className="text-[10px] h-4">URL</Badge>
                <span className="text-[11px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-medium">
                  {t("status.failed", lang)}
                </span>
              </div>
            </div>

            {/* Error message */}
            <div className="flex items-start gap-2 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>

            {/* Retry */}
            <div className="flex justify-end">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs h-7">
                <RefreshCw className="w-3 h-3" />
                {t("sources.retry", lang)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Duplicate: URL tab of add source modal with inline duplicate error ── */
function DuplicateLayout({ lang }: { lang: "en" | "ar" }) {
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

        {/* Tab strip (URL tab active) */}
        <div className="flex border-b border-border">
          <div className="flex-1 text-sm py-2.5 font-medium text-center border-b-2 border-transparent text-muted-foreground">
            {t("addSource.fileUpload", lang)}
          </div>
          <div className="flex-1 text-sm py-2.5 font-medium text-center border-b-2 border-primary text-primary">
            <Link2 className="w-4 h-4 inline me-1.5" />
            {t("addSource.url", lang)}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              {t("addSource.urlLabel", lang)}
            </label>
            <div className={cn(
              "flex items-center border rounded-lg px-3 py-2 bg-background",
              "border-destructive"
            )}>
              <Link2 className="w-4 h-4 text-muted-foreground me-2 shrink-0" />
              <span className="flex-1 text-sm text-foreground" dir="ltr">
                https://docs.example.com/guide
              </span>
            </div>
            <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {t("url.duplicate", lang)}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">{t("chat.cancel", lang)}</Button>
            <Button size="sm">{t("addSource.addUrl", lang)}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
