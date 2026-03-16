import { Progress } from "@/components/ui/progress";

export function TokenReportingScreen() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div>
        <div className="text-xs text-muted-foreground mb-1">Settings → Subscription → Billing</div>
        <h1 className="text-xl font-semibold text-foreground">AI Services</h1>
        <p className="text-sm text-muted-foreground mt-1">Knowledge Base usage against your workspace plan.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">Token Usage</div>
          <div className="text-2xl font-semibold text-foreground">423,891 <span className="text-sm font-normal text-muted-foreground">/ 1,000,000</span></div>
          <Progress value={42} className="h-1.5 mt-2" />
          <div className="text-[10px] text-muted-foreground mt-1">42% consumed this billing cycle</div>
        </div>
        <div className="border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">Storage</div>
          <div className="text-2xl font-semibold text-foreground">65%</div>
          <Progress value={65} className="h-1.5 mt-2" />
          <div className="text-[10px] text-muted-foreground mt-1">Of total storage capacity</div>
        </div>
        <div className="border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground mb-1">Files</div>
          <div className="text-2xl font-semibold text-foreground">12 <span className="text-sm font-normal text-muted-foreground">/ 50</span></div>
          <Progress value={24} className="h-1.5 mt-2" />
          <div className="text-[10px] text-muted-foreground mt-1">24% of file limit used</div>
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
              <td className="px-5 py-2.5 text-right text-foreground">185,230</td>
              <td className="px-5 py-2.5 text-right text-foreground">42,891</td>
              <td className="px-5 py-2.5 text-right font-medium text-foreground">228,121</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-5 py-2.5 text-foreground font-medium">Channel Sessions</td>
              <td className="px-5 py-2.5 text-right text-foreground">132,450</td>
              <td className="px-5 py-2.5 text-right text-foreground">38,120</td>
              <td className="px-5 py-2.5 text-right font-medium text-foreground">170,570</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-5 py-2.5 text-foreground font-medium">Summarization</td>
              <td className="px-5 py-2.5 text-right text-foreground">18,700</td>
              <td className="px-5 py-2.5 text-right text-foreground">6,500</td>
              <td className="px-5 py-2.5 text-right font-medium text-foreground">25,200</td>
            </tr>
            <tr className="bg-panel">
              <td className="px-5 py-2.5 font-semibold text-foreground">Total</td>
              <td className="px-5 py-2.5 text-right font-semibold text-foreground">336,380</td>
              <td className="px-5 py-2.5 text-right font-semibold text-foreground">87,511</td>
              <td className="px-5 py-2.5 text-right font-semibold text-foreground">423,891</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
