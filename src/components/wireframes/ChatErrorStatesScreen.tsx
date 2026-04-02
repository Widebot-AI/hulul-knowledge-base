import { AlertTriangle, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourcePanel } from "./SourcePanel";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Props = {
  variant: "streaming-interrupted" | "ai-service-error" | "session-creation-failed" | "reset-failed";
};

const mockHistory = [
  {
    id: "h1",
    role: "user" as const,
    content: "Can you summarize the main points from the Q3 report?",
  },
  {
    id: "h2",
    role: "assistant" as const,
    content:
      "Sure! The Q3 report highlights three major areas: revenue growth of 18% YoY, expansion into two new markets, and a reduction in customer churn to 4.2%. The enterprise segment was the primary growth driver, contributing 62% of total revenue.",
    citations: [
      { id: 1, source: "Q3 Strategy Deck.pdf" },
      { id: 2, source: "Finance Summary.xlsx" },
    ],
  },
];

function MessageBubble({
  role,
  children,
  isError,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
  isError?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", role === "user" ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
          role === "user"
            ? "bg-primary/15 text-foreground"
            : "bg-secondary text-secondary-foreground",
          isError && "border border-destructive/30"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ChatErrorStatesScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();

  const renderChatContent = () => {
    if (variant === "streaming-interrupted") {
      return (
        <div className="max-w-2xl mx-auto space-y-4">
          {mockHistory.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role}>
              <div className="whitespace-pre-line">{msg.content}</div>
              {msg.citations && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.citations.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-accent text-accent-foreground"
                    >
                      [{c.id}] {c.source}
                    </span>
                  ))}
                </div>
              )}
            </MessageBubble>
          ))}

          {/* Current question */}
          <MessageBubble role="user">
            What are the key takeaways from Q3?
          </MessageBubble>

          {/* Interrupted assistant response */}
          <MessageBubble role="assistant" isError>
            <div className="whitespace-pre-line">
              The key takeaways from Q3 are particularly noteworthy this quarter. First, the revenue exceeded targets by 12%, largely driven by the enterprise segment which saw unprecedented growth in the MENA region. Second, the product team shipped three major feature updates that contributed to a 23% increase in daily active users. The customer success team also managed to reduce time-to-value for new
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="w-3 h-3" />
              <span>{t("chat.interrupted", lang)}</span>
              <button className="underline ms-1 font-medium">{t("sources.retry", lang)}</button>
            </div>
          </MessageBubble>
        </div>
      );
    }

    if (variant === "ai-service-error") {
      return (
        <div className="max-w-2xl mx-auto space-y-4">
          {mockHistory.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role}>
              <div className="whitespace-pre-line">{msg.content}</div>
              {msg.citations && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {msg.citations.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-accent text-accent-foreground"
                    >
                      [{c.id}] {c.source}
                    </span>
                  ))}
                </div>
              )}
            </MessageBubble>
          ))}

          <MessageBubble role="user">
            What are the key takeaways from Q3?
          </MessageBubble>

          {/* AI service error response */}
          <MessageBubble role="assistant" isError>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">{t("chatError.aiServiceError", lang)}</span>
            </div>
            <div className="mt-2">
              <Button size="sm" variant="outline" className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10">
                {t("sources.retry", lang)}
              </Button>
            </div>
          </MessageBubble>
        </div>
      );
    }

    if (variant === "session-creation-failed") {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("chatError.sessionCreateFailed", lang)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("chatError.aiServiceError", lang)}
              </p>
            </div>
            <Button size="sm" variant="outline" className="gap-1">
              {t("sources.retry", lang)}
            </Button>
          </div>
        </div>
      );
    }

    // reset-failed: show conversation history
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {mockHistory.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role}>
            <div className="whitespace-pre-line">{msg.content}</div>
            {msg.citations && (
              <div className="mt-2 flex flex-wrap gap-1">
                {msg.citations.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-accent text-accent-foreground"
                  >
                    [{c.id}] {c.source}
                  </span>
                ))}
              </div>
            )}
          </MessageBubble>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="w-[30%] shrink-0">
            <SourcePanel />
          </div>
        )}
        <div className="flex-1 relative flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {renderChatContent()}
          </div>

          {/* Input area */}
          <div className="border-t border-border px-4 py-3 shrink-0">
            <div className="max-w-2xl mx-auto">
              {variant === "session-creation-failed" ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl">
                  <span className="text-xs text-muted-foreground flex-1">
                    {t("chatError.sessionCreateFailed", lang)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 bg-background focus-within:ring-2 focus-within:ring-ring/30">
                  <input
                    type="text"
                    dir="auto"
                    placeholder={t("chat.askQuestion", lang)}
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>

          {/* Reset-failed overlay */}
          {variant === "reset-failed" && (
            <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center z-20 p-4">
              <div className="bg-background rounded-xl shadow-xl border border-border w-full max-w-sm">
                <div className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {t("chatError.resetFailed", lang)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {t("chat.resetConfirmMsg", lang)}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1">
                      {t("chat.cancel", lang)}
                    </Button>
                    <Button className="flex-1 gap-1 bg-destructive hover:bg-destructive/90">
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t("chatError.retryReset", lang)}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
