import { AlertTriangle, MessageCircle, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKB } from "./KBContext";
import { t } from "./translations";
import { cn } from "@/lib/utils";

type Variant = "no-sources-with-context" | "no-sources-no-context" | "quota-depleted";

type Props = {
  variant: Variant;
};

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

function ChatBubble({ role, text }: ChatMessage) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-[#DCF8C6] text-gray-900 rounded-br-sm"
            : "bg-white text-gray-900 shadow-sm rounded-bl-sm border border-gray-100"
        )}
      >
        {text}
      </div>
    </div>
  );
}

export function ChannelQueryStatesScreen({ variant }: Props) {
  const { lang } = useKB();

  const messages: Record<Variant, ChatMessage[]> = {
    "no-sources-with-context": [
      { role: "user", text: "What are your business hours?" },
      { role: "bot", text: "Our office hours are Sunday to Thursday, 9 AM to 6 PM. How can I help you today?" },
    ],
    "no-sources-no-context": [
      { role: "user", text: "Tell me about your services" },
      { role: "bot", text: "I'd be happy to help! However, I don't have specific information about services configured. Please contact our team for details." },
    ],
    "quota-depleted": [
      { role: "user", text: "I need help with my order" },
    ],
  };

  const infoNote = {
    "no-sources-with-context": t("channel.noSourcesContext", lang),
    "no-sources-no-context": t("channel.noSourcesBare", lang),
    "quota-depleted": null,
  }[variant];

  const isQuotaDepleted = variant === "quota-depleted";

  return (
    <div className="flex flex-col items-center justify-start py-8 px-4 min-h-full gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground text-center">{t("channel.title", lang)}</h1>
        <p className="text-sm text-muted-foreground mt-1 text-center">
          Simulates how channel queries are handled under different configurations.
        </p>
      </div>

      {/* Phone-like frame */}
      <div className="w-full max-w-[400px] rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden bg-[#ECE5DD]">
        {/* WhatsApp-style header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm">WhatsApp Business</div>
            <div className="text-[#B2DFDB] text-xs flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              Online
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#25D366]" />
        </div>

        {/* Chat area */}
        <div className="px-3 py-4 space-y-2.5 min-h-[280px] flex flex-col justify-end">
          {messages[variant].map((msg, i) => (
            <ChatBubble key={i} role={msg.role} text={msg.text} />
          ))}

          {/* Quota depleted: show "no reply" placeholder */}
          {isQuotaDepleted && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/60 border border-gray-200 text-xs text-gray-400 max-w-[75%]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span className="italic">No response sent</span>
              </div>
            </div>
          )}
        </div>

        {/* Info / warning note inside the frame */}
        {infoNote && (
          <div className="mx-3 mb-3 px-3 py-2 bg-white/80 border border-gray-200 rounded-xl text-xs text-gray-600 text-center leading-relaxed">
            {infoNote}
          </div>
        )}

        {isQuotaDepleted && (
          <div className="mx-3 mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t("channel.quotaDepleted", lang)}</span>
          </div>
        )}

        {/* WhatsApp-style input bar */}
        <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2 border-t border-gray-200">
          <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-400">
            Type a message
          </div>
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Admin-facing quota banner — outside the phone frame */}
      {isQuotaDepleted && (
        <div className="w-full max-w-[400px] bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 shrink-0 text-destructive" />
            <span className="text-xs text-destructive leading-relaxed">{t("channel.quotaAdmin", lang)}</span>
          </div>
          <Button size="sm" variant="destructive" className="h-7 text-xs shrink-0">
            Upgrade
          </Button>
        </div>
      )}
    </div>
  );
}
