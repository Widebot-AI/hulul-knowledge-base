import { ToggleLeft, ToggleRight, Info, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  readOnly?: boolean;
};

export function StackSettingsScreen({ readOnly }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Conversational AI Models</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure AI stacks for your workspace channels.</p>
      </div>

      {/* US-010 S2: Non-admin read-only banner */}
      {readOnly && (
        <div className="flex items-center gap-2 px-4 py-3 bg-accent border border-accent-foreground/10 rounded-lg text-xs text-muted-foreground">
          <Lock className="w-4 h-4 shrink-0" />
          <span>You have view-only access. Contact your workspace Owner or Admin to make changes.</span>
        </div>
      )}

      {/* KB Stack Card */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-panel border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-base font-bold text-primary">KB</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Knowledge Base</h3>
              <p className="text-xs text-muted-foreground">Ground responses in your indexed sources</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-success/10 text-success text-[10px] border-0">Active</Badge>
            <button className={readOnly ? "text-muted-foreground cursor-not-allowed" : "text-success"} disabled={readOnly}>
              <ToggleRight className="w-8 h-8" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Connected Channels */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">Connected Channels</h4>
            <div className="flex flex-wrap gap-2">
              {["WhatsApp", "Facebook Messenger", "Instagram", "Web Chat", "Telegram"].map((ch) => (
                <Badge key={ch} variant="secondary" className="text-xs">
                  {ch}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
              <Info className="w-3 h-3" />
              All enabled channels are auto-connected. Per-channel opt-out coming soon.
            </div>
          </div>

          {/* Streaming */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Streaming</h4>
              <p className="text-[11px] text-muted-foreground">In-app KB chat always uses streaming. Channel streaming depends on capability.</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">Per-channel</Badge>
          </div>

          {/* Custom Prompt */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-1.5">Custom System Prompt</h4>
            <textarea
              className="w-full h-24 text-xs border border-border rounded-lg px-3 py-2 bg-background outline-none focus:ring-2 focus:ring-ring/30 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Enter a custom system prompt for KB responses..."
              defaultValue="You are a helpful assistant for our enterprise customers. Always prioritize accuracy and cite your sources. Keep answers professional and concise."
              readOnly
              disabled={readOnly}
            />
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
              <Info className="w-3 h-3" />
              A platform-level system prompt is always prepended and cannot be edited.
            </div>
          </div>
        </div>
      </div>

      {/* Disable warning */}
      <div role="alert" className="bg-warning/10 border border-warning/20 rounded-lg px-4 py-2.5 text-xs text-muted-foreground">
        <strong className="text-warning">Note:</strong> Disabling the KB stack will route subsequent channel queries to the previously active stack. If no fallback stack exists, channels will stop receiving AI responses.
      </div>
    </div>
  );
}
