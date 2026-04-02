import { BookOpen, Sparkles, FileText, Globe, ClipboardPaste, AlertTriangle, RotateCcw, CheckCircle } from "lucide-react";
import { useKB } from "./KBContext";
import { KBMainInterface } from "./KBMainInterface";
import { t } from "./translations";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "default" | "error";
};

export function ActivationScreen({ variant = "default" }: Props) {
  const { setPhase, lang } = useKB();

  const handleActivate = () => {
    setPhase("empty");
  };

  const valueProps = [
    "Upload documents",
    "Get AI-powered answers",
    "Source-cited responses",
  ];

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

          {/* Value propositions */}
          <ul className="space-y-2">
            {valueProps.map((prop) => (
              <li key={prop} className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                {prop}
              </li>
            ))}
          </ul>

          {/* Source type shortcuts */}
          <div className="grid grid-cols-3 gap-2">
            {sourceTypes.map(({ icon: Icon, labelKey }) => (
              <div
                key={labelKey}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-background text-center"
              >
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{t(labelKey, lang)}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <Button className="w-full" size="lg" onClick={handleActivate}>
            {t("activation.activate", lang)}
          </Button>

          {/* Error alert — only shown in error variant, placed below CTA */}
          {variant === "error" && (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-destructive">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{t("activation.errorMsg", lang)}</span>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10">
                <RotateCcw className="w-3 h-3 me-1" />
                {t("activation.retry", lang)}
              </Button>
            </div>
          )}

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
