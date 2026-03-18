import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { t } from "./translations";

export function DeleteConfirmDialog() {
  const { modal, closeModal, deleteSource, lang } = useKB();
  if (modal?.kind !== "delete-confirm") return null;

  return (
    <div className="fixed inset-0 bg-foreground/30 flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">{t("delete.title", lang)}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {t("delete.confirm", lang)} <strong>{modal.sourceName}</strong>? {t("delete.permanent", lang)}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={closeModal}>{t("chat.cancel", lang)}</Button>
            <Button variant="destructive" className="flex-1" onClick={() => deleteSource(modal.sourceId)}>{t("sources.delete", lang)}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
