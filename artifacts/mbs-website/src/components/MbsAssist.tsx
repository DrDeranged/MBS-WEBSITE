import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────
type Role = "user" | "assistant";
interface Msg {
  id: string;
  role: Role;
  content: string;
  streaming?: boolean;
  error?: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const APPLY_URL = "https://app.my-business-solutions.com/apply";
const STARTER_CHIPS = [
  "What do I need to apply?",
  "Which funding fits me?",
  "How fast is the process?",
];

// ── SSE streaming helper ──────────────────────────────────────────────────────
async function streamAssist(
  messages: { role: Role; content: string }[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
  signal: AbortSignal,
) {
  let resp: Response;
  try {
    resp = await fetch("/api/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (e) {
    if ((e as Error).name !== "AbortError") {
      onError("Couldn't reach the server. Please check your connection and try again.");
    }
    return;
  }

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError((data as { error?: string }).error ?? "Something went wrong. Please try again.");
    return;
  }

  const reader = resp.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const payload = JSON.parse(line.slice(6)) as {
            content?: string;
            done?: boolean;
            error?: string;
          };
          if (payload.error) { onError(payload.error); return; }
          if (payload.content) onChunk(payload.content);
          if (payload.done) { onDone(); return; }
        } catch {
          // skip malformed line
        }
      }
    }
  } catch (e) {
    if ((e as Error).name !== "AbortError") {
      onError("Stream interrupted. Please try again.");
    }
  } finally {
    reader.releaseLock();
  }
}

// ── MbsAssist widget ──────────────────────────────────────────────────────────
export function MbsAssist() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, [messages, prefersReducedMotion]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const addUserMsg = useCallback((text: string) => {
    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: "user", content: text }]);
    return id;
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      setInput("");
      setBusy(true);
      addUserMsg(trimmed);

      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", streaming: true },
      ]);

      // Build history for the API (only settled messages)
      const history = messages
        .filter((m) => !m.streaming && !m.error)
        .map(({ role, content }) => ({ role, content }));
      history.push({ role: "user", content: trimmed });

      const abort = new AbortController();
      abortRef.current = abort;

      await streamAssist(
        history,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        },
        () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, streaming: false } : m,
            ),
          );
          setBusy(false);
        },
        (errMsg) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: errMsg, streaming: false, error: true }
                : m,
            ),
          );
          setBusy(false);
        },
        abort.signal,
      );
    },
    [busy, messages, addUserMsg],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  // Panel animation variants
  const panelVariants = {
    hidden: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 },
  };

  return (
    <>
      {/* ── Floating pill trigger ────────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={() => setOpen(true)}
            aria-label="Open MbsAssist chat"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg font-semibold text-sm text-white select-none"
            style={{ backgroundColor: "#17A567" }}
          >
            {/* Chat bubble icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Ask MBS
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.32, 0.72, 0, 1] }}
            className={[
              "fixed z-50 flex flex-col",
              "inset-x-0 bottom-0 rounded-t-2xl h-[85dvh]",        // mobile
              "sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 sm:h-[600px] sm:max-h-[80vh] sm:rounded-2xl", // desktop
            ].join(" ")}
            style={{
              background: "#FFFFFF",
              boxShadow: "0 24px 64px rgba(14,42,71,0.22), 0 4px 16px rgba(14,42,71,0.1)",
            }}
            role="dialog"
            aria-label="MbsAssist chat"
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-5 py-4 rounded-t-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1F4E79 0%, #0E2A47 100%)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white font-heading"
                  style={{ backgroundColor: "#17A567" }}
                >
                  M
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">MbsAssist</p>
                  <p className="text-white/50 text-[11px]">My Business Solutions</p>
                </div>
              </div>
              <button
                onClick={() => {
                  abortRef.current?.abort();
                  setOpen(false);
                }}
                className="text-white/60 hover:text-white transition-colors p-1 rounded-lg"
                aria-label="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* ── Messages ───────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="space-y-3">
                  <AssistantBubble
                    content="Hi! I'm MbsAssist. I can help you understand your business funding options and how the process works. What's on your mind?"
                  />
                  {/* Starter chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {STARTER_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => void send(chip)}
                        disabled={busy}
                        className="text-xs rounded-full px-3 py-1.5 border font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
                        style={{ borderColor: "#DCE4EC", color: "#46586C" }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation */}
              {messages.map((m) =>
                m.role === "user" ? (
                  <UserBubble key={m.id} content={m.content} />
                ) : (
                  <AssistantBubble
                    key={m.id}
                    content={m.content}
                    streaming={m.streaming}
                    error={m.error}
                  />
                ),
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Input area ─────────────────────────────────────────────── */}
            <div
              className="border-t flex-shrink-0 px-4 pt-3 pb-2"
              style={{ borderColor: "#DCE4EC" }}
            >
              <div
                className="flex items-end gap-2 rounded-xl border px-3 py-2"
                style={{ borderColor: "#DCE4EC", background: "#F5F8FB" }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question…"
                  rows={1}
                  disabled={busy}
                  className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-gray-400 max-h-28 disabled:opacity-60"
                  style={{ color: "#0E2A47" }}
                />
                <button
                  onClick={() => void send(input)}
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "#17A567" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Footer: Apply Now */}
              <div className="flex justify-center pt-2 pb-1">
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#1F4E79" }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Apply now — it's free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
            className="fixed inset-0 z-40 sm:hidden"
            style={{ background: "rgba(14,42,71,0.4)" }}
            onClick={() => {
              abortRef.current?.abort();
              setOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Bubble sub-components ─────────────────────────────────────────────────────
function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white leading-relaxed"
        style={{ backgroundColor: "#1F4E79" }}
      >
        {content}
      </div>
    </div>
  );
}

function AssistantBubble({
  content,
  streaming,
  error,
}: {
  content: string;
  streaming?: boolean;
  error?: boolean;
}) {
  return (
    <div className="flex justify-start">
      <div
        className={[
          "max-w-[90%] rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed",
          error ? "border" : "",
        ].join(" ")}
        style={{
          background: error ? "#FEF2F2" : "#F5F8FB",
          color: error ? "#B91C1C" : "#0E2A47",
          borderColor: error ? "#FECACA" : undefined,
        }}
      >
        {content || (streaming && <TypingIndicator />)}
        {streaming && content && <BlinkingCursor />}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "#46586C",
            animation: `mbsDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function BlinkingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-3.5 ml-0.5 align-middle rounded-full"
      style={{
        backgroundColor: "#17A567",
        animation: "mbsBlink 1s step-end infinite",
      }}
    />
  );
}
