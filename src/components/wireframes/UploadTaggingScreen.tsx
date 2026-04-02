import { Upload, X, Tag, Lock, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Variant = "default" | "limit-reached" | "duplicate-key" | "locked-view";

type Props = {
  variant: Variant;
};

const LIMIT_TAGS = Array.from({ length: 10 }, (_, i) => ({
  key: `key${i + 1}`,
  value: `value${i + 1}`,
}));

export function UploadTaggingScreen({ variant }: Props) {
  const { lang } = useKB();

  if (variant === "locked-view") {
    return <LockedView lang={lang} />;
  }

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
          {/* Selected file */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-[10px] h-4 shrink-0">PDF</Badge>
              <span className="text-foreground font-medium">Q3 Strategy Deck.pdf</span>
              <span className="text-muted-foreground">2.8 MB</span>
            </div>
            <button className="ms-2 text-muted-foreground hover:text-destructive shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tag section */}
          <TagSection variant={variant} lang={lang} />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm">{t("chat.cancel", lang)}</Button>
            <Button size="sm">{t("addSource.upload", lang)}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TagSection({ variant, lang }: { variant: Exclude<Variant, "locked-view">; lang: "en" | "ar" }) {
  const isLimitReached = variant === "limit-reached";
  const isDuplicateKey = variant === "duplicate-key";

  const tags =
    isLimitReached
      ? LIMIT_TAGS
      : [
          { key: "department", value: "strategy" },
          { key: "quarter", value: "Q3" },
        ];

  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
        <Tag className="w-3.5 h-3.5" />
        <span>Tags</span>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[11px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full"
          >
            {tag.key}: {tag.value}
            <button className="text-muted-foreground hover:text-destructive">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Limit-reached warning */}
      {isLimitReached && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          {t("tag.limitReached", lang)}
        </p>
      )}

      {/* Key/Value input row */}
      <div className="space-y-1">
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <input
              type="text"
              placeholder={t("tag.key", lang)}
              defaultValue={isDuplicateKey ? "department" : ""}
              className={cn(
                "w-full text-xs border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground",
                isDuplicateKey ? "border-destructive" : "border-border"
              )}
              readOnly
            />
            {isDuplicateKey && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {t("tag.duplicateKey", lang)}
              </p>
            )}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder={t("tag.value", lang)}
              className="w-full text-xs border border-border rounded-md px-2.5 py-1.5 bg-background outline-none focus:ring-2 focus:ring-ring/30 placeholder:text-muted-foreground"
              readOnly
            />
          </div>
          <Button
            size="sm"
            className="text-xs h-8 shrink-0"
            disabled={isLimitReached}
          >
            {t("tag.addTag", lang)}
          </Button>
        </div>
      </div>

      {/* Immutability notice */}
      <div className="flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>{t("tag.immutableNotice", lang)}</span>
      </div>
    </div>
  );
}

function LockedView({ lang }: { lang: "en" | "ar" }) {
  const tags = [
    { key: "department", value: "strategy" },
    { key: "quarter", value: "Q3" },
    { key: "region", value: "EMEA" },
  ];

  return (
    <div className="flex items-center justify-center h-full bg-background/60 p-4">
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-lg p-5 space-y-4">
        {/* Source card header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-accent-foreground">PDF</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">Q3 Strategy Deck.pdf</p>
            <p className="text-xs text-muted-foreground">Mar 10, 2026 · 2.8 MB</p>
          </div>
          <Badge variant="secondary" className="ms-auto text-[10px] h-5 shrink-0">PDF</Badge>
        </div>

        <div className="border-t border-border" />

        {/* Locked tags section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>{t("tag.locked", lang)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[11px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full"
              >
                {tag.key}: {tag.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
