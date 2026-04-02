import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { t } from "./translations";

export function StoreCapacityScreen() {
  const { lang } = useKB();

  return (
    <div className="flex items-center justify-center h-full bg-background p-4">
      <div className="max-w-sm w-full text-center space-y-4 px-6">
        <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">
            {t("upload.storeExhausted", lang)}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("upload.storeExhaustedDesc", lang)}
          </p>
        </div>
        <Button variant="outline" size="sm">
          Contact support
        </Button>
      </div>
    </div>
  );
}
