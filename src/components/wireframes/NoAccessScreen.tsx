import { ShieldAlert } from "lucide-react";
import { useKB } from "./KBContext";
import { t } from "./translations";

export function NoAccessScreen() {
  const { lang } = useKB();

  return (
    <div className="flex items-center justify-center h-full bg-background p-4">
      <div className="max-w-sm text-center space-y-4 px-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{t("noAccess.title", lang)}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("noAccess.desc", lang)}
        </p>
      </div>
    </div>
  );
}
