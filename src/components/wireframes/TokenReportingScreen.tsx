import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  variant?: "normal" | "empty" | "error";
};

export function TokenReportingScreen({ variant = "normal" }: Props) {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Settings → Subscription → Billing</div>
        <h1 className="text-xl font-semibold text-foreground">AI Services</h1>
        <p className="text-sm text-muted-foreground mt-1">Knowledge Base usage against your workspace plan.</p>
      </div>

      {/* US-010 Req: Error state */}
      {variant === "error" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-destructive" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-foreground">Failed to Load Usage Data</h3>
            <p className="text-xs text-muted-foreground mt-1">We couldn't retrieve your usage data. Please try again.</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </Button>
        </div>
      )}

      {variant !== "error" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">Token Usage</div>
              <div className="text-2xl font-semibold text-foreground">
                {variant === "empty" ? "0" : "423,891"}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ 1,000,000</span>
              </div>
              <Progress value={variant === "empty" ? 0 : 42} className="h-1.5 mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {variant === "empty" ? "0%" : "42%"} consumed this billing cycle
              </div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">Storage</div>
              <div className="text-2xl font-semibold text-foreground">{variant === "empty" ? "0" : "65"}%</div>
              <Progress value={variant === "empty" ? 0 : 65} className="h-1.5 mt-2" />
              <div className="text-[10px] text-muted-foreground mt-1">Of total storage capacity</div>
            </div>
            <div className="border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground mb-1">Files</div>
              <div className="text-2xl font-semibold text-foreground">
                {variant === "empty" ? "0" : "12"}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ 50</span>
              </div>
              <Progress value={variant === "empty" ? 0 : 24} className="h-1.5 mt-2" />
              <div className="text-[10px] text-muted-foreground mt-1">
                {variant === "empty" ? "0%" : "24%"} of file limit used
              </div>
            </div>
          </div>

          {/* Token Breakdown Table */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 bg-panel border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Token Consumption Breakdown</h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-panel">
                  <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Source</th>
                  <th className="text-right px-5 py-2.5 font-medium text-muted-foreground">Input Tokens</th>
                  <th className="text-right px-5 py-2.5 font-medium text-muted-foreground">Output Tokens</th>
                  <th className="text-right px-5 py-2.5 font-medium text-muted-foreground">Total Tokens</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-5 py-2.5 text-foreground font-medium">In-App KB Chat</td>
                  <td className="px-5 py-2.5 text-right text-foreground">{variant === "empty" ? "0" : "185,230"}</td>
                  <td className="px-5 py-2.5 text-right text-foreground">{variant === "empty" ? "0" : "42,891"}</td>
                  <td className="px-5 py-2.5 text-right font-medium text-foreground">{variant === "empty" ? "0" : "228,121"}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-5 py-2.5 text-foreground font-medium">Channel Sessions</td>
                  <td className="px-5 py-2.5 text-right text-foreground">{variant === "empty" ? "0" : "132,450"}</td>
                  <td className="px-5 py-2.5 text-right text-foreground">{variant === "empty" ? "0" : "38,120"}</td>
                  <td className="px-5 py-2.5 text-right font-medium text-foreground">{variant === "empty" ? "0" : "170,570"}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-5 py-2.5 text-foreground font-medium">Summarization</td>
                  <td className="px-5 py-2.5 text-right text-foreground">{variant === "empty" ? "0" : "18,700"}</td>
                  <td className="px-5 py-2.5 text-right text-foreground">{variant === "empty" ? "0" : "6,500"}</td>
                  <td className="px-5 py-2.5 text-right font-medium text-foreground">{variant === "empty" ? "0" : "25,200"}</td>
                </tr>
                <tr className="bg-panel">
                  <td className="px-5 py-2.5 font-semibold text-foreground">Total</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-foreground">{variant === "empty" ? "0" : "336,380"}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-foreground">{variant === "empty" ? "0" : "87,511"}</td>
                  <td className="px-5 py-2.5 text-right font-semibold text-foreground">{variant === "empty" ? "0" : "423,891"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
