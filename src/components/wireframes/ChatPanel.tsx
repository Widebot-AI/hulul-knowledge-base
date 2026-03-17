import { Send, RotateCcw, Loader2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: { id: number; source: string; deleted?: boolean }[];
  isError?: boolean;
  isStreaming?: boolean;
};

const mockMessages: ChatMessage[] = [
  { role: "user", content: "What were the key takeaways from the Q3 strategy review?" },
  {
    role: "assistant",
    content: "Based on the Q3 Strategy Deck, the key takeaways were:\n\n1. **Revenue target exceeded by 12%** — driven primarily by enterprise segment growth.\n2. **Customer retention improved** to 94.2%, up from 91.8% in Q2.\n3. **Three new product lines** were greenlit for Q4 launch.\n\nThe deck also highlighted risks around supply chain dependencies that the team flagged for mitigation planning.",
    citations: [
      { id: 1, source: "Q3 Strategy Deck.pdf" },
      { id: 2, source: "Q3 Strategy Deck.pdf" },
    ],
  },
  { role: "user", content: "What are the supply chain risks mentioned?" },
  {
    role: "assistant",
    content: "The identified supply chain risks include:\n\n• **Single-vendor dependency** for core components — recommended diversifying to at least 2 suppliers by Q1.\n• **Logistics bottlenecks** in APAC region affecting delivery timelines.\n• **Raw material cost increases** of ~8% projected for next quarter.\n\nThe mitigation plan proposes establishing backup supplier agreements and building a 30-day inventory buffer.",
    citations: [
      { id: 3, source: "Q3 Strategy Deck.pdf" },
    ],
  },
];

const streamingErrorMessages: ChatMessage[] = [
  { role: "user", content: "Summarize the employee handbook policies." },
  {
    role: "assistant",
    content: "Based on the Employee Handbook, the key policies include:\n\n1. **Remote work** — Employees may work remotely up to 3 days per week with manager approval.\n2. **PTO accrual** — Full-time employees accrue 20 days PTO annually, with a maximum carryover of",
    isError: true,
    isStreaming: false,
  },
];

const deletedCitationMessages: ChatMessage[] = [
  { role: "user", content: "What were the Q2 sales targets?" },
  {
    role: "assistant",
    content: "According to the Sales Pipeline document, the Q2 targets were set at $4.2M total revenue with a focus on enterprise accounts.",
    citations: [
      { id: 1, source: "Sales Pipeline.xlsx", deleted: true },
    ],
  },
];

type Props = {
  disabled?: boolean;
  disabledReason?: string;
  sessionAlert?: "warning" | "ceiling";
  showCitation?: boolean;
  showDeletedCitation?: boolean;
  empty?: boolean;
  streamingError?: boolean;
  sessionCreateError?: boolean;
  showResetConfirm?: boolean;
  resetError?: boolean;
};

export function ChatPanel({
  disabled,
  disabledReason,
  sessionAlert,
  showCitation,
  showDeletedCitation,
  empty,
  streamingError,
  sessionCreateError,
  showResetConfirm,
  resetError,
}: Props) {
  const messages = empty
    ? []
    : streamingError
    ? streamingErrorMessages
    : showDeletedCitation
    ? deletedCitationMessages
    : mockMessages;

  return (
    <div className="flex flex-col h-full">
      {/* Session warnings */}
      {sessionAlert === "warning" && (
        <div className="mx-4 mt-3 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning flex items-center justify-between">
          <span>This conversation is getting long. Consider resetting to maintain response quality.</span>
          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-warning hover:text-warning gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
        </div>
      )}
      {sessionAlert === "ceiling" && (
        <div className="mx-4 mt-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-center justify-between">
          <span>Session limit reached. Please reset your conversation to continue chatting.</span>
          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-destructive hover:text-destructive gap-1">
            <RotateCcw className="w-3 h-3" /> Reset Session
          </Button>
        </div>
      )}

      {/* US-003 S5: Session creation failure */}
      {sessionCreateError && (
        <div className="mx-4 mt-3 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to create chat session. Please try again.</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 text-[10px] text-destructive hover:text-destructive gap-1">
            <RotateCcw className="w-3 h-3" /> Retry
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {empty && !sessionCreateError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Add sources to start chatting</p>
              <p className="text-xs text-muted-foreground mt-1">Upload files or add URLs to your Knowledge Base</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground",
                    msg.isError && "border border-destructive/30"
                  )}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.citations.map((c) => (
                        <button
                          key={c.id}
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
                            c.deleted
                              ? "bg-muted text-muted-foreground line-through"
                              : msg.role === "user"
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-accent text-accent-foreground hover:bg-primary/10"
                          )}
                        >
                          [{c.id}] {c.source}
                          {c.deleted && " (deleted)"}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* US-006 S4: Streaming error / partial response */}
                  {msg.isError && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-destructive">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Response interrupted — partial content shown</span>
                      <button className="underline ml-1 font-medium">Retry</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* US-006 S2: Citation Drawer with deleted source note */}
      {(showCitation || showDeletedCitation) && (
        <div className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-10 overflow-y-auto">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Citation [1]</h3>
            <button className="text-xs text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="text-[11px] text-muted-foreground">Source</div>
              <div className="text-sm font-medium text-foreground">
                {showDeletedCitation ? "Sales Pipeline.xlsx" : "Q3 Strategy Deck.pdf"}
              </div>
            </div>

            {/* US-006 S2: Deleted source note */}
            {showDeletedCitation && (
              <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-[11px] text-warning">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                This source is no longer available. The information below is from the time of the response.
              </div>
            )}

            <div className="flex gap-4">
              <div>
                <div className="text-[11px] text-muted-foreground">Type</div>
                <div className="text-xs text-foreground">{showDeletedCitation ? "XLSX" : "PDF"}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Status</div>
                {showDeletedCitation ? (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">Deleted</span>
                ) : (
                  <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full">Ready</span>
                )}
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Uploaded</div>
                <div className="text-xs text-foreground">Mar 10, 2026</div>
              </div>
            </div>
            {!showDeletedCitation && (
              <div>
                <div className="text-[11px] text-muted-foreground mb-1">Tags</div>
                <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded">department: strategy</span>
              </div>
            )}
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Excerpt</div>
              <div className="text-xs text-foreground bg-accent rounded-lg p-3 leading-relaxed border border-accent-foreground/10">
                {showDeletedCitation
                  ? '"Q2 sales targets were finalized at $4.2M total revenue with primary focus on enterprise accounts representing 65% of pipeline value..."'
                  : '"Revenue target exceeded by 12%, driven primarily by enterprise segment growth. The sales team closed 14 new enterprise accounts, contributing to a total ARR increase of $2.3M..."'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* US-006 S8/S9: Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center z-20">
          <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-sm">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Reset Conversation</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Your conversation history will be cleared and a fresh session will begin. Selected sources will remain unchanged.
                </p>
              </div>
              {resetError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Reset failed. Please try again.
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1">Cancel</Button>
                <Button className="flex-1 gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  {resetError ? "Retry Reset" : "Reset"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {disabled || sessionAlert === "ceiling" ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl">
              <span className="text-xs text-muted-foreground flex-1">
                {disabledReason || (sessionAlert === "ceiling" ? "Session limit reached. Reset to continue." : "Add sources to start chatting.")}
              </span>
              {sessionAlert === "ceiling" && (
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30">
              <input
                type="text"
                placeholder="Ask a question about your sources..."
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                readOnly
              />
              <Button size="icon" className="h-8 w-8 rounded-lg shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
