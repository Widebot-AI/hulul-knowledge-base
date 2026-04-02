import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import type { Lang } from "./translations";

/* ─── Source Model ─── */
export type SourceStatus = "fetching" | "uploading" | "pending" | "indexing" | "ready" | "failed" | "archived" | "pending_cleanup";

export type Source = {
  id: string;
  name: string;
  type: string;
  status: SourceStatus;
  selected: boolean;
  tags: { key: string; value: string }[];
  retryCount?: number;
  retryLocked?: boolean;
  avatar?: string;
};

/* ─── Chat Model ─── */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { id: number; source: string; deleted?: boolean }[];
  isError?: boolean;
  isStreaming?: boolean;
};

/* ─── Flags ─── */
export type KBFlags = {
  quotaWarning: boolean;
  quotaDepleted: boolean;
  sessionWarning: boolean;
  sessionCeiling: boolean;
  streaming: boolean;
  streamInterrupted: boolean;
  aiError: boolean;
  sessionCreateFail: boolean;
  resetFailed: boolean;
  deletionFailed: boolean;
  retentionWarning: boolean;
  retentionFinal: boolean;
};

const initialFlags: KBFlags = {
  quotaWarning: false,
  quotaDepleted: false,
  sessionWarning: false,
  sessionCeiling: false,
  streaming: false,
  streamInterrupted: false,
  aiError: false,
  sessionCreateFail: false,
  resetFailed: false,
  deletionFailed: false,
  retentionWarning: false,
  retentionFinal: false,
};

/* ─── Modal Types ─── */
export type ModalType =
  | null
  | { kind: "add-source"; tab: "file" | "url" }
  | { kind: "delete-confirm"; sourceId: string; sourceName: string }
  | { kind: "source-preview"; sourceId: string }
  | { kind: "reset-confirm" };

/* ─── App State ─── */
export type KBPhase = "activation" | "no-access" | "empty" | "active" | "archived";

type KBState = {
  phase: KBPhase;
  setPhase: (p: KBPhase) => void;
  sources: Source[];
  setSources: React.Dispatch<React.SetStateAction<Source[]>>;
  toggleSourceSelection: (id: string) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  sendMessage: (text: string) => void;
  isStreaming: boolean;
  modal: ModalType;
  openModal: (m: ModalType) => void;
  closeModal: () => void;
  activationError: boolean;
  setActivationError: (v: boolean) => void;
  citationDrawer: { citationId: number; deleted?: boolean } | null;
  openCitation: (id: number, deleted?: boolean) => void;
  closeCitation: () => void;
  resetChat: () => void;
  sessionTokenPercent: number;
  workspaceQuotaPercent: number;
  workspaceQuotaDepleted: boolean;
  flags: KBFlags;
  messageCount: number;
  uploadCount: number;
  deleteCount: number;
  setFlag: (flag: keyof KBFlags, value: boolean) => void;
  clearFlag: (flag: keyof KBFlags) => void;
  simulateRetention: () => void;
  cancelRetention: () => void;
  storageWarningDismissed: boolean;
  filecountWarningDismissed: boolean;
  tokenWarningDismissed: boolean;
  dismissStorageWarning: () => void;
  dismissFilecountWarning: () => void;
  dismissTokenWarning: () => void;
  retrySource: (id: string) => void;
  retryCleanup: (id: string) => void;
  deleteSource: (id: string) => void;
  addMockSource: (name: string, type: string, tags: { key: string; value: string }[]) => void;
  isDark: boolean;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  // dev drawer
  devDrawerOpen: boolean;
  setDevDrawerOpen: (v: boolean) => void;
};

const KBContext = createContext<KBState | null>(null);

export const useKB = () => {
  const ctx = useContext(KBContext);
  if (!ctx) throw new Error("useKB must be inside KBProvider");
  return ctx;
};

/* ─── Initial mock data ─── */
const initialSources: Source[] = [
  { id: "1", name: "Q3 Strategy Deck.pdf", type: "PDF", status: "ready", selected: true, tags: [{ key: "department", value: "strategy" }], avatar: "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" },
  { id: "2", name: "API Documentation.md", type: "MD", status: "ready", selected: true, tags: [] },
  { id: "3", name: "Employee Handbook.docx", type: "DOCX", status: "ready", selected: false, tags: [], avatar: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg" },
  { id: "4", name: "Sales Pipeline.xlsx", type: "XLSX", status: "indexing", selected: false, tags: [], avatar: "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg" },
  { id: "5", name: "Release Notes v2.1.txt", type: "TXT", status: "pending", selected: false, tags: [] },
  { id: "6", name: "https://docs.example.com/guide", type: "URL", status: "fetching", selected: false, tags: [], avatar: "https://www.google.com/s2/favicons?domain=example.com&sz=64" },
  { id: "7", name: "Old Policy.pdf", type: "PDF", status: "failed", selected: false, tags: [] },
];

/* ─── Simulated AI responses ─── */
const aiResponses = [
  {
    content: "Based on the Q3 Strategy Deck, the key takeaways were:\n\n1. **Revenue target exceeded by 12%** — driven primarily by enterprise segment growth.\n2. **Customer retention improved** to 94.2%, up from 91.8% in Q2.\n3. **Three new product lines** were greenlit for Q4 launch.\n\nThe deck also highlighted risks around supply chain dependencies that the team flagged for mitigation planning.",
    citations: [{ id: 1, source: "Q3 Strategy Deck.pdf" }, { id: 2, source: "Q3 Strategy Deck.pdf" }],
  },
  {
    content: "The identified supply chain risks include:\n\n• **Single-vendor dependency** for core components — recommended diversifying to at least 2 suppliers by Q1.\n• **Logistics bottlenecks** in APAC region affecting delivery timelines.\n• **Raw material cost increases** of ~8% projected for next quarter.\n\nThe mitigation plan proposes establishing backup supplier agreements and building a 30-day inventory buffer.",
    citations: [{ id: 3, source: "Q3 Strategy Deck.pdf" }],
  },
  {
    content: "According to the API Documentation, the authentication flow uses OAuth 2.0 with JWT tokens. Key endpoints include:\n\n• `POST /auth/token` — Request access token\n• `POST /auth/refresh` — Refresh expired token\n• `GET /auth/userinfo` — Get current user profile\n\nAll API calls require the `Authorization: Bearer <token>` header.",
    citations: [{ id: 4, source: "API Documentation.md" }],
  },
  {
    content: "I couldn't find specific information about that topic in your currently selected sources. Try selecting additional sources or rephrasing your question.",
    citations: [],
  },
];

let nextSourceId = 100;

export function KBProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<KBPhase>("activation");
  const [sources, setSources] = useState<Source[]>(initialSources);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [activationError, setActivationError] = useState(false);
  const [citationDrawer, setCitationDrawer] = useState<{ citationId: number; deleted?: boolean } | null>(null);
  const [sessionTokenPercent, setSessionTokenPercent] = useState(0);
  const [workspaceQuotaPercent, setWorkspaceQuotaPercent] = useState(72);
  const [storageWarningDismissed, setStorageWarningDismissed] = useState(false);
  const [filecountWarningDismissed, setFilecountWarningDismissed] = useState(false);
  const [tokenWarningDismissed, setTokenWarningDismissed] = useState(false);
  const [flags, setFlags] = useState<KBFlags>(initialFlags);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [deleteCount, setDeleteCount] = useState<number>(0);
  const [isDark, setIsDark] = useState(false);
  const [devDrawerOpen, setDevDrawerOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const streamRef = useRef<NodeJS.Timeout | null>(null);
  const messageCountRef = useRef(0);
  const responseIndexRef = useRef(0);
  const uploadCountRef = useRef(0);
  const deleteCountRef = useRef(0);
  const resetAttemptRef = useRef(0);
  const retentionTimersRef = useRef<NodeJS.Timeout[]>([]);

  const toggleSourceSelection = useCallback((id: string) => {
    setSources(prev => {
      const source = prev.find(s => s.id === id);
      if (!source || source.status !== "ready") return prev;
      // Ensure at least one remains selected
      const readySources = prev.filter(s => s.status === "ready");
      const selectedCount = readySources.filter(s => s.selected).length;
      if (source.selected && selectedCount <= 1) return prev;
      return prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s);
    });
  }, []);

  const setFlag = useCallback((flag: keyof KBFlags, value: boolean) => {
    setFlags(prev => ({ ...prev, [flag]: value }));
  }, []);

  const clearFlag = useCallback((flag: keyof KBFlags) => {
    setFlags(prev => ({ ...prev, [flag]: false }));
  }, []);

  const cancelRetention = useCallback(() => {
    retentionTimersRef.current.forEach(id => clearTimeout(id));
    retentionTimersRef.current = [];
    setFlags(prev => ({ ...prev, retentionWarning: false, retentionFinal: false }));
  }, []);

  const simulateRetention = useCallback(() => {
    // Clear any existing retention timers
    retentionTimersRef.current.forEach(id => clearTimeout(id));
    retentionTimersRef.current = [];

    // Set retentionWarning immediately
    setFlags(prev => ({ ...prev, retentionWarning: true, retentionFinal: false }));

    // After 10s: set retentionFinal, clear retentionWarning
    const t1 = setTimeout(() => {
      setFlags(prev => ({ ...prev, retentionWarning: false, retentionFinal: true }));
    }, 10000);

    // After 20s (10s after final): archive everything
    const t2 = setTimeout(() => {
      setFlags(prev => ({ ...prev, retentionWarning: false, retentionFinal: false }));
      setPhase("archived");
      setSources(prev => prev.map(s => ({ ...s, status: "archived" as const })));
      retentionTimersRef.current = [];
    }, 20000);

    retentionTimersRef.current = [t1, t2];
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (isStreaming || !text.trim()) return;
    const hasSelectedReady = sources.some(s => s.selected && s.status === "ready");
    if (!hasSelectedReady) return;

    // Cancel retention countdown on user activity
    if (flags.retentionWarning || flags.retentionFinal) {
      cancelRetention();
    }

    // Handle retry after stream interruption
    const isRetry = flags.streamInterrupted;
    if (isRetry) {
      setFlag("streamInterrupted", false);
      // Remove the error message (the partial one)
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.isError) return prev.slice(0, -1);
        return prev;
      });
      // Don't increment messageCountRef for retry
    } else {
      messageCountRef.current += 1;
      setMessageCount(c => c + 1);
    }

    const currentCount = messageCountRef.current;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const response = aiResponses[responseIndexRef.current % aiResponses.length];
    // For message 3 (interrupt), don't increment responseIndex so retry reuses it
    if (currentCount !== 3) {
      responseIndexRef.current++;
    }

    const assistantId = `a-${Date.now()}`;
    const fullText = response.content;
    let charIndex = 0;

    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", isStreaming: true }]);

    streamRef.current = setInterval(() => {
      charIndex += 3 + Math.floor(Math.random() * 5);

      // Message 3: interrupt at 60%
      if (currentCount === 3 && !isRetry && charIndex >= fullText.length * 0.6) {
        if (streamRef.current) clearInterval(streamRef.current);
        const partialText = fullText.slice(0, Math.floor(fullText.length * 0.6));
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: partialText, isStreaming: false, isError: true } : m)
        );
        setIsStreaming(false);
        setFlag("streamInterrupted", true);
        return;
      }

      if (charIndex >= fullText.length) {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: fullText, isStreaming: false, citations: response.citations } : m)
        );
        setIsStreaming(false);
        setSessionTokenPercent(p => Math.min(100, p + 40));
        setWorkspaceQuotaPercent(p => Math.min(120, p + 10));
        if (streamRef.current) clearInterval(streamRef.current);

        // After message 1 & 2: evaluate thresholds
        if (currentCount <= 2) {
          setWorkspaceQuotaPercent(prev => {
            const newVal = prev; // already incremented above
            if (newVal >= 80) setFlag("quotaWarning", true);
            return prev;
          });
          setSessionTokenPercent(prev => {
            if (prev >= 80 && prev < 100) setFlag("sessionWarning", true);
            return prev;
          });
        }

        // After retry (message 4 effectively): set quotaDepleted and sessionCeiling
        if (isRetry) {
          setFlag("quotaDepleted", true);
          setFlag("sessionCeiling", true);
          // Increment responseIndex now since we deferred it during message 3
          responseIndexRef.current++;
        }
      } else {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: fullText.slice(0, charIndex) } : m)
        );
      }
    }, 30);
  }, [isStreaming, sources, flags.streamInterrupted, setFlag, cancelRetention, flags.retentionWarning, flags.retentionFinal]);

  const dismissStorageWarning = useCallback(() => setStorageWarningDismissed(true), []);
  const dismissFilecountWarning = useCallback(() => setFilecountWarningDismissed(true), []);
  const dismissTokenWarning = useCallback(() => setTokenWarningDismissed(true), []);

  const resetChat = useCallback(() => {
    const attempt = resetAttemptRef.current;
    if (attempt === 0) {
      // Attempt 1: normal reset
      setMessages([]);
      setSessionTokenPercent(0);
      setCitationDrawer(null);
      setModal(null);
      clearFlag("sessionWarning");
      clearFlag("sessionCeiling");
      resetAttemptRef.current = 1;
    } else if (attempt === 1) {
      // Attempt 2: fail
      setFlag("resetFailed", true);
      setModal(null);
      resetAttemptRef.current = 2;
    } else {
      // Attempt 3+: recover
      clearFlag("resetFailed");
      setMessages([]);
      setSessionTokenPercent(0);
      setCitationDrawer(null);
      setModal(null);
      clearFlag("sessionWarning");
      clearFlag("sessionCeiling");
      resetAttemptRef.current = 0;
    }
  }, [setFlag, clearFlag]);

  const retrySource = useCallback((id: string) => {
    setSources(prev => prev.map(s => {
      if (s.id !== id) return s;
      if (s.status === "failed") return { ...s, status: "indexing" as const };
      return s;
    }));
    // Simulate processing
    setTimeout(() => {
      setSources(prev => {
        const updated = prev.map(s => s.id === id && s.status === "indexing" ? { ...s, status: "ready" as const } : s);
        // Auto-select if it's the only ready source without selection
        const readySelected = updated.filter(s => s.status === "ready" && s.selected);
        if (readySelected.length === 0) {
          return updated.map(s => s.id === id ? { ...s, selected: true } : s);
        }
        return updated;
      });
    }, 2000);
  }, []);

  const deleteSource = useCallback((id: string) => {
    deleteCountRef.current += 1;
    setDeleteCount(c => c + 1);
    const currentCount = deleteCountRef.current;

    if (currentCount === 1) {
      // Normal deletion
      setSources(prev => {
        const remaining = prev.filter(s => s.id !== id);
        const hasSelected = remaining.some(s => s.selected && s.status === "ready");
        if (!hasSelected) {
          const firstReady = remaining.find(s => s.status === "ready");
          if (firstReady) {
            return remaining.map(s => s.id === firstReady.id ? { ...s, selected: true } : s);
          }
        }
        return remaining;
      });
      setModal(null);
    } else if (currentCount === 2) {
      // Deletion fails
      setFlag("deletionFailed", true);
      setModal(null);
      setTimeout(() => {
        clearFlag("deletionFailed");
      }, 5000);
      // Reset counter so next delete works normally
      deleteCountRef.current = 0;
      setDeleteCount(0);
    } else if (currentCount === 3) {
      // Stuck in pending_cleanup
      setSources(prev => prev.map(s => s.id === id ? { ...s, status: "pending_cleanup" as const, retryCount: 0 } : s));
      setModal(null);
    } else {
      // Default: normal deletion for subsequent calls
      setSources(prev => {
        const remaining = prev.filter(s => s.id !== id);
        const hasSelected = remaining.some(s => s.selected && s.status === "ready");
        if (!hasSelected) {
          const firstReady = remaining.find(s => s.status === "ready");
          if (firstReady) {
            return remaining.map(s => s.id === firstReady.id ? { ...s, selected: true } : s);
          }
        }
        return remaining;
      });
      setModal(null);
    }
  }, [setFlag, clearFlag]);

  const retryCleanup = useCallback((id: string) => {
    setSources(prev => {
      const source = prev.find(s => s.id === id);
      if (!source || source.status !== "pending_cleanup" || source.retryLocked) return prev;
      const newRetryCount = (source.retryCount ?? 0) + 1;
      if (newRetryCount >= 3) {
        return prev.map(s => s.id === id ? { ...s, retryCount: newRetryCount, retryLocked: true } : s);
      }
      return prev.map(s => s.id === id ? { ...s, retryCount: newRetryCount } : s);
    });
  }, []);

  const addMockSource = useCallback((name: string, type: string, tags: { key: string; value: string }[]) => {
    uploadCountRef.current += 1;
    setUploadCount(c => c + 1);
    const currentUpload = uploadCountRef.current;

    const id = `src-${nextSourceId++}`;
    const newSource: Source = { id, name, type, status: "uploading", selected: false, tags };
    setSources(prev => [...prev, newSource]);
    setModal(null);

    // Simulate pipeline: uploading → pending → indexing → ready/failed
    setTimeout(() => setSources(prev => prev.map(s => s.id === id ? { ...s, status: "pending" } : s)), 1000);
    setTimeout(() => setSources(prev => prev.map(s => s.id === id ? { ...s, status: "indexing" } : s)), 2000);
    setTimeout(() => {
      if (currentUpload === 3) {
        // 3rd upload fails
        setSources(prev => prev.map(s => s.id === id ? { ...s, status: "failed" as const } : s));
      } else {
        setSources(prev => {
          const updated = prev.map(s => s.id === id ? { ...s, status: "ready" as const } : s);
          const readySelected = updated.filter(s => s.status === "ready" && s.selected);
          if (readySelected.length === 0) {
            return updated.map(s => s.id === id ? { ...s, selected: true } : s);
          }
          return updated;
        });
      }
      // If phase was empty, transition to active
      setPhase("active");
    }, 3500);
  }, []);

  // Simulate source processing progression for initial sources
  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setSources(prev => prev.map(s => s.id === "6" && s.status === "fetching" ? { ...s, status: "uploading" } : s));
    }, 4000);
    const timer2 = setTimeout(() => {
      setSources(prev => prev.map(s => s.id === "6" && s.status === "uploading" ? { ...s, status: "pending" } : s));
    }, 6000);
    const timer3 = setTimeout(() => {
      setSources(prev => prev.map(s => s.id === "4" && s.status === "indexing" ? { ...s, status: "ready" } : s));
    }, 5000);
    const timer4 = setTimeout(() => {
      setSources(prev => prev.map(s => s.id === "5" && s.status === "pending" ? { ...s, status: "indexing" } : s));
    }, 3000);
    const timer5 = setTimeout(() => {
      setSources(prev => prev.map(s => s.id === "5" && s.status === "indexing" ? { ...s, status: "ready" } : s));
    }, 7000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); clearTimeout(timer5); };
  }, []);

  // Theme + dir
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  React.useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <KBContext.Provider value={{
      phase, setPhase,
      sources, setSources,
      toggleSourceSelection,
      messages, setMessages,
      sendMessage, isStreaming,
      modal, openModal: setModal, closeModal: () => setModal(null),
      activationError, setActivationError,
      citationDrawer, openCitation: (id, deleted) => setCitationDrawer({ citationId: id, deleted }), closeCitation: () => setCitationDrawer(null),
      resetChat, sessionTokenPercent,
      workspaceQuotaPercent, workspaceQuotaDepleted: flags.quotaDepleted,
      flags, messageCount, uploadCount, deleteCount, setFlag, clearFlag, simulateRetention, cancelRetention,
      storageWarningDismissed, filecountWarningDismissed, tokenWarningDismissed,
      dismissStorageWarning, dismissFilecountWarning, dismissTokenWarning,
      retrySource, retryCleanup, deleteSource, addMockSource,
      isDark, toggleTheme: () => setIsDark(!isDark),
      lang, setLang,
      devDrawerOpen, setDevDrawerOpen,
    }}>
      {children}
    </KBContext.Provider>
  );
}
