import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SourcePanel } from "./SourcePanel";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type Props = {
  variant: "mid-session" | "pre-session";
};

const mockMessages = [
  {
    id: "m1",
    role: "user" as const,
    content: "What were the main highlights of last quarter?",
  },
  {
    id: "m2",
    role: "assistant" as const,
    content:
      "The main highlights of last quarter include a 15% increase in revenue, the successful launch of the new product line, and expansion into three new markets. Customer satisfaction scores also improved by 8 points.",
    citations: [
      { id: 1, source: "Q3 Report.pdf" },
    ],
  },
  {
    id: "m3",
    role: "user" as const,
    content: "How does that compare to the same period last year?",
  },
  {
    id: "m4",
    role: "assistant" as const,
    content:
      "Compared to the same period last year, revenue is up 15% vs 9%, market expansion went from 1 to 3 new markets, and customer satisfaction improved from 72 to 80 on the NPS scale. Overall, this quarter significantly outperformed the prior year.",
    citations: [
      { id: 1, source: "Q3 Report.pdf" },
      { id: 2, source: "Annual Review 2025.pdf" },
    ],
  },
];

function MessageBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", role === "user" ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed",
          role === "user"
            ? "bg-primary/15 text-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function TokenQuotaScreen({ variant }: Props) {
  const { lang } = useKB();
  const isMobile = useIsMobile();

  const bannerText =
    variant === "mid-session"
      ? t("quota.midSession", lang)
      : t("quota.preSession", lang);

  return (
    <div className="flex flex-col h-full">
      {/* Non-dismissable red banner */}
      <div
        role="alert"
        className="mx-4 mt-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5 flex items-center gap-2 text-xs text-destructive"
      >
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span className="flex-1">{bannerText}</span>
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-xs px-2 border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          {t("warn.upgrade", lang)}
        </Button>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <div className="w-[30%] shrink-0">
            <SourcePanel />
          </div>
        )}
        <div className="flex-1 relative flex flex-col">
          {/* Messages / empty state */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {variant === "mid-session" ? (
              <div className="max-w-2xl mx-auto space-y-4">
                {mockMessages.map((msg) => (
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("quota.preSession", lang)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("quota.upgradePrompt", lang)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Disabled input */}
          <div className="border-t border-border px-4 py-3 shrink-0">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary rounded-xl">
                <span className="text-xs text-muted-foreground flex-1">
                  {t("quota.upgradePrompt", lang)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs gap-1 border-destructive/40 text-destructive hover:bg-destructive/10"
                >
                  {t("warn.upgrade", lang)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
