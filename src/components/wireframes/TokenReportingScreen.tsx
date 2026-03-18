import { Progress } from "@/components/ui/progress";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { t } from "./translations";

type Props = {
  variant?: "normal" | "empty" | "error";
};

export function TokenReportingScreen({ variant = "normal" }: Props) {
  const { lang } = useKB();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
      <div>
        <div className="text-xs text-muted-foreground mb-1">{t("token.breadcrumb", lang)}</div>
        <h1 className="text-xl font-semibold text-foreground">{t("token.title", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("token.desc", lang)}</p>
      </div>

      {variant === "error" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-foreground">{t("token.errorTitle", lang)}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t("token.errorDesc", lang)}</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> {t("sources.retry", lang)}
          </Button>
        </div>
      )}

      {variant !== "error" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">{t("token.usage", lang)}</div>
              <div className="text-2xl font-semibold text-foreground">
                {variant === "empty" ? "0" : "423,891"}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ 1,000,000</span>
              </div>
              <Progress value={variant === "empty" ? 0 : 42} className="h-1.5 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {variant === "empty" ? "0%" : "42%"} {t("token.consumed", lang)}
              </div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">{t("token.storage", lang)}</div>
              <div className="text-2xl font-semibold text-foreground">{variant === "empty" ? "0" : "65"}%</div>
              <Progress value={variant === "empty" ? 0 : 65} className="h-1.5 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">{t("token.ofCapacity", lang)}</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">{t("token.files", lang)}</div>
              <div className="text-2xl font-semibold text-foreground">
                {variant === "empty" ? "0" : "12"}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ 50</span>
              </div>
              <Progress value={variant === "empty" ? 0 : 24} className="h-1.5 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {variant === "empty" ? "0%" : "24%"} {t("token.fileLimit", lang)}
              </div>
            </div>
          </div>

          {/* Token Breakdown Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 sm:px-5 py-3 bg-panel border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">{t("token.breakdown", lang)}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-panel">
                    <th className="text-start px-4 sm:px-5 py-2.5 font-medium text-muted-foreground">{t("token.sourceCol", lang)}</th>
                    <th className="text-end px-4 sm:px-5 py-2.5 font-medium text-muted-foreground">{t("token.inputTokens", lang)}</th>
                    <th className="text-end px-4 sm:px-5 py-2.5 font-medium text-muted-foreground">{t("token.outputTokens", lang)}</th>
                    <th className="text-end px-4 sm:px-5 py-2.5 font-medium text-muted-foreground">{t("token.totalTokens", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 sm:px-5 py-2.5 text-foreground font-medium">{t("token.inAppChat", lang)}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end text-foreground">{variant === "empty" ? "0" : "185,230"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end text-foreground">{variant === "empty" ? "0" : "42,891"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end font-medium text-foreground">{variant === "empty" ? "0" : "228,121"}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 sm:px-5 py-2.5 text-foreground font-medium">{t("token.channelSessions", lang)}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end text-foreground">{variant === "empty" ? "0" : "132,450"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end text-foreground">{variant === "empty" ? "0" : "38,120"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end font-medium text-foreground">{variant === "empty" ? "0" : "170,570"}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 sm:px-5 py-2.5 text-foreground font-medium">{t("token.summarization", lang)}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end text-foreground">{variant === "empty" ? "0" : "18,700"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end text-foreground">{variant === "empty" ? "0" : "6,500"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end font-medium text-foreground">{variant === "empty" ? "0" : "25,200"}</td>
                  </tr>
                  <tr className="bg-panel">
                    <td className="px-4 sm:px-5 py-2.5 font-semibold text-foreground">{t("token.total", lang)}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end font-semibold text-foreground">{variant === "empty" ? "0" : "336,380"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end font-semibold text-foreground">{variant === "empty" ? "0" : "87,511"}</td>
                    <td className="px-4 sm:px-5 py-2.5 text-end font-semibold text-foreground">{variant === "empty" ? "0" : "423,891"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
