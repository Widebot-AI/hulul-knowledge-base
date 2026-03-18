import { ToggleRight, Info, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Props = {
  readOnly?: boolean;
};

export function StackSettingsScreen({ readOnly }: Props) {
  const { lang } = useKB();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{t("stack.title", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("stack.desc", lang)}</p>
      </div>

      {readOnly && (
        <div role="alert" className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg text-xs text-foreground">
          <Lock className="w-4 h-4 shrink-0 text-muted-foreground" />
          <span>{t("stack.readOnly", lang)}</span>
        </div>
      )}

      {/* KB Stack Card */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 bg-panel border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-base font-bold text-primary">KB</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t("stack.kbTitle", lang)}</h3>
              <p className="text-xs text-muted-foreground">{t("stack.kbDesc", lang)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-success/10 text-success text-[10px] border-0">{t("stack.active", lang)}</Badge>
            <button className={readOnly ? "text-muted-foreground cursor-not-allowed" : "text-success"} disabled={readOnly}>
              <ToggleRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">{t("stack.channels", lang)}</h4>
            <div className="flex flex-wrap gap-2">
              {["WhatsApp", "Facebook Messenger", "Instagram", "Web Chat", "Telegram"].map((ch) => (
                <Badge key={ch} variant="secondary" className="text-xs">{ch}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Info className="w-3 h-3 shrink-0" />
              {t("stack.channelHint", lang)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">{t("stack.streaming", lang)}</h4>
              <p className="text-xs text-muted-foreground">{t("stack.streamingDesc", lang)}</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">{t("stack.perChannel", lang)}</Badge>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground mb-1.5">{t("stack.prompt", lang)}</h4>
            <textarea
              className="w-full h-24 text-xs border border-border rounded-lg px-3 py-2 bg-background outline-none focus:ring-2 focus:ring-ring/30 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder={t("stack.prompt", lang)}
              defaultValue="You are a helpful assistant for our enterprise customers. Always prioritize accuracy and cite your sources. Keep answers professional and concise."
              readOnly
              disabled={readOnly}
            />
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <Info className="w-3 h-3 shrink-0" />
              {t("stack.promptHint", lang)}
            </div>
          </div>
        </div>
      </div>

      <div role="alert" className="bg-warning/10 border border-warning/20 rounded-lg px-4 py-2.5 text-xs text-warning">
        <strong>{t("common.note", lang)}</strong> {t("stack.disableWarning", lang)}
      </div>
    </div>
  );
}
