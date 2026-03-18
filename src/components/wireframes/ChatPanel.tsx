import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, Loader2, AlertTriangle, AlertCircle, BookmarkPlus, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKB } from "./KBContext";

export function ChatPanel() {
  const {
    messages, sendMessage, isStreaming, sources,
    citationDrawer, openCitation, closeCitation,
    sessionTokenPercent, resetChat, openModal, modal,
  } = useKB();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasSelectedReady = sources.some(s => s.selected && s.status === "ready");
  const isEmpty = messages.length === 0;
  const sessionWarning = sessionTokenPercent >= 80 && sessionTokenPercent < 100;
  const sessionCeiling = sessionTokenPercent >= 100;
  const disabled = !hasSelectedReady || sessionCeiling;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || disabled || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Session warnings */}
      {sessionWarning && (
        <div role="alert" className="mx-4 mt-3 px-4 py-2.5 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning flex items-center justify-between">
          <span>This conversation is getting long. Consider resetting to maintain response quality.</span>
          <Button
            size="sm" variant="ghost"
            className="h-6 text-[10px] text-warning hover:text-warning gap-1"
            onClick={() => openModal({ kind: "reset-confirm" })}
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </Button>
        </div>
      )}
      {sessionCeiling && (
        <div role="alert" className="mx-4 mt-3 px-4 py-2.5 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-center justify-between">
          <span>Session limit reached. Please reset your conversation to continue chatting.</span>
          <Button
            size="sm" variant="ghost"
            className="h-6 text-[10px] text-destructive hover:text-destructive gap-1"
            onClick={resetChat}
          >
            <RotateCcw className="w-3 h-3" /> Reset Session
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {hasSelectedReady ? "Ask a question about your sources" : "Add sources to start chatting"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {hasSelectedReady ? "Your selected sources will be used to ground AI responses" : "Upload files or add URLs to your Knowledge Base"}
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary/15 text-foreground"
                      : "bg-secondary text-secondary-foreground",
                    msg.isError && "border border-destructive/30"
                  )}
                >
                  {/* Thinking indicator before content appears */}
                  {msg.role === "assistant" && msg.isStreaming && !msg.content && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                      </div>
                      <span className="text-xs">Thinking...</span>
                    </div>
                  )}
                  {msg.content && <div className="whitespace-pre-line">{msg.content}</div>}
                  {msg.isStreaming && msg.content && (
                    <span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />
                  )}
                  {msg.citations && msg.citations.length > 0 && !msg.isStreaming && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.citations.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => openCitation(c.id, c.deleted)}
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded cursor-pointer transition-colors",
                            c.deleted
                              ? "bg-muted text-muted-foreground line-through"
                              : msg.role === "user"
                              ? "bg-primary/20 text-primary"
                              : "bg-accent text-accent-foreground hover:bg-primary/10"
                          )}
                        >
                          [{c.id}] {c.source}
                          {c.deleted && " (deleted)"}
                        </button>
                      ))}
                    </div>
                  )}
                  {msg.isError && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Response interrupted — partial content shown</span>
                      <button className="underline ml-1 font-medium">Retry</button>
                    </div>
                  )}
                </div>
                {/* Action buttons for completed assistant messages */}
                {msg.role === "assistant" && !msg.isStreaming && msg.content && (
                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    <button className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-secondary transition-colors">
                      <BookmarkPlus className="w-3.5 h-3.5" /> Add note
                    </button>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Citation Drawer */}
      {citationDrawer && (
        <div className="absolute right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-10 overflow-y-auto">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Citation [{citationDrawer.citationId}]</h3>
            <button onClick={closeCitation} className="text-xs text-muted-foreground hover:text-foreground">✕</button>
          </div>
          <div className="p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="text-[11px] text-muted-foreground">Source</div>
              <div className="text-sm font-medium text-foreground">
                {citationDrawer.deleted ? "Sales Pipeline.xlsx" : "Q3 Strategy Deck.pdf"}
              </div>
            </div>
            {citationDrawer.deleted && (
              <div className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg text-[11px] text-warning">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                This source is no longer available.
              </div>
            )}
            <div className="flex gap-4">
              <div>
                <div className="text-[11px] text-muted-foreground">Type</div>
                <div className="text-xs text-foreground">{citationDrawer.deleted ? "XLSX" : "PDF"}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Status</div>
                {citationDrawer.deleted ? (
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
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">Excerpt</div>
              <div className="text-xs text-foreground bg-accent rounded-lg p-3 leading-relaxed border border-accent-foreground/10">
                "Revenue target exceeded by 12%, driven primarily by enterprise segment growth. The sales team closed 14 new enterprise accounts..."
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirm overlay */}
      {modal?.kind === "reset-confirm" && (
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
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => openModal(null)}>Cancel</Button>
                <Button className="flex-1 gap-1" onClick={resetChat}>
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="max-w-2xl mx-auto">
          {disabled ? (
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl">
              <span className="text-xs text-muted-foreground flex-1">
                {sessionCeiling
                  ? "Session limit reached. Reset to continue."
                  : "Add and select sources to start chatting."}
              </span>
              {sessionCeiling && (
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={resetChat}>
                  <RotateCcw className="w-3 h-3" /> Reset
                </Button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask a question about your sources..."
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
              />
              <Button
                size="icon"
                className="h-8 w-8 rounded-lg shrink-0"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
              >
                {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
