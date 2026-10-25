import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Square,
  Copy,
  Check,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Shield,
  Zap,
} from "lucide-react";
import { ArcReactor, ShieldEagleLogo } from "../marvel/MarvelIcons";
import { marvelAudio } from "../marvel/MarvelAudioEngine";
import { triggerMarvelBurst } from "../marvel/MarvelParticleBurst";
import { api, ChatMessage } from "../../lib/api";

interface StarkAiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  pageContext?: string;
  onNavigate?: (page: string) => void;
}

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Markdown Formatter for Stark HUD Responses
function FormattedContent({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-neutral-200 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-cyan-400 mt-3 mb-1 font-mono tracking-wide flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {parseInlineStyles(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="text-lg font-black uppercase text-white mt-4 mb-2 font-mono tracking-wider border-b border-cyan-500/30 pb-1"
            >
              {parseInlineStyles(trimmed.slice(3))}
            </h2>
          );
        }

        if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_6px_#00f0ff]" />
              <div className="flex-1">{parseInlineStyles(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Numbered list item like 1. 2.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1.5">
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-red-600/30 border border-red-500/40 text-red-300 rounded shrink-0">
                {numMatch[1]}
              </span>
              <div className="flex-1">{parseInlineStyles(numMatch[2])}</div>
            </div>
          );
        }

        // Tip or quote
        if (trimmed.startsWith("👉 ") || trimmed.startsWith("📈 ") || trimmed.startsWith("💡 ")) {
          return (
            <div
              key={idx}
              className="my-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs font-mono flex items-start gap-2"
            >
              <span>{trimmed.slice(0, 2)}</span>
              <div className="flex-1">{parseInlineStyles(trimmed.slice(2))}</div>
            </div>
          );
        }

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        return <p key={idx}>{parseInlineStyles(line)}</p>;
      })}
    </div>
  );
}

// Inline styling parser: **bold**, `code`, *italic*
function parseInlineStyles(text: string): React.ReactNode[] {
  // Regex splitting by bold, code, and italic tokens
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-white font-mono text-[13px] text-cyan-300">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-black/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return (
        <em key={i} className="italic text-neutral-300">
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

const SUGGESTED_QUERIES = [
  {
    icon: "🎯",
    title: "Find Top Internships",
    prompt: "Find the strongest AI and Software internships matching my verified profile.",
  },
  {
    icon: "⚡",
    title: "Audit My Skill Gaps",
    prompt: "Analyze my current skill telemetry and identify critical leverage skills to reach 90%+ match.",
  },
  {
    icon: "🗺️",
    title: "12-Week AI Roadmap",
    prompt: "Generate a tactical 12-week roadmap from Python & SQL to Autonomous AI Agent Engineering.",
  },
  {
    icon: "🛡️",
    title: "Skill Passport Alignment",
    prompt: "How can I verify skills and projects on my Skill Passport to bypass traditional resume filters?",
  },
];

export default function StarkAiAssistantDrawer({
  isOpen,
  onClose,
  initialPrompt,
  pageContext = "general",
  onNavigate,
}: StarkAiAssistantDrawerProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "init-0",
      role: "assistant",
      content:
        "### 🛡️ Stark Tactical Career Guide Online\n\nSystems calibrated and standing by. I am connected to your verified Skill Passport telemetry and current hiring matrices.\n\n*How can I assist your career objectives today?*",
      timestamp: "Ready",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedInitial = useRef(false);

  // Auto scroll on new messages or streaming chunks
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Handle initial prompt from App.tsx if provided
  useEffect(() => {
    if (isOpen && initialPrompt && initialPrompt.trim() && !hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      handleSendMessage(initialPrompt.trim());
    }
  }, [isOpen, initialPrompt]);

  // Reset initial flag when drawer closes
  useEffect(() => {
    if (!isOpen) {
      hasLoadedInitial.current = false;
    }
  }, [isOpen]);

  async function handleSendMessage(queryText: string) {
    if (!queryText.trim() || isStreaming) return;

    marvelAudio.playRepulsorClick();

    const userMessage: MessageItem = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantMessageId = `ast-${Date.now() + 1}`;
    const initialAssistantMessage: MessageItem = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setInput("");
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Convert messages for backend API format
    const apiMessages: ChatMessage[] = messages
      .filter((m) => m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }));
    apiMessages.push({ role: "user", content: queryText.trim() });

    try {
      await api.chat.stream({
        messages: apiMessages,
        pageContext,
        signal: abortController.signal,
        onChunk: (chunk: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        },
        onDone: () => {
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
        onError: (err) => {
          console.error("Chat streaming error:", err);
          setIsStreaming(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content:
                      msg.content ||
                      `### ⚠️ Relay Interrupted\n\nCould not maintain active connection to tactical server: ${err.message}`,
                  }
                : msg
            )
          );
        },
      });
    } catch (err: any) {
      if (!abortController.signal.aborted) {
        setIsStreaming(false);
      }
    }
  }

  function handleStop() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
      marvelAudio.playRepulsorClick();
    }
  }

  function handleClearChat() {
    marvelAudio.playRepulsorClick();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: "assistant",
        content:
          "### 🛡️ Tactical Memory Cleared\n\nRelay cache flushed. Standing by for new career instructions.",
        timestamp: "Ready",
      },
    ]);
  }

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Stark HUD Drawer */}
      <div
        className="relative z-10 w-full max-w-2xl h-full bg-[#0A0B10]/95 border-l border-red-500/40 shadow-[-10px_0_40px_rgba(236,29,36,0.25)] flex flex-col font-sans backdrop-blur-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Stark Header Bar */}
        <div className="relative px-5 py-4 border-b border-red-500/30 bg-black/80 flex items-center justify-between shrink-0">
          {/* Subtle tech background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,29,36,0.15),transparent_70%)] pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <ArcReactor className="w-10 h-10 text-cyan-400" pulse={isStreaming} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black italic tracking-wider text-white uppercase font-sans">
                  STARK TACTICAL AI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EC1D24]/20 border border-[#EC1D24]/50 text-red-400 uppercase tracking-widest">
                  JARVIS RELAY
                </span>
              </div>
              <p className="text-[11px] font-mono text-cyan-400/80 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isStreaming
                      ? "bg-amber-400 animate-ping"
                      : "bg-emerald-400 shadow-[0_0_6px_#10b981]"
                  }`}
                />
                {isStreaming
                  ? "Streaming Career Telemetry..."
                  : `Online // Active Context: [${pageContext.toUpperCase()}]`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 relative z-10">
            <button
              onClick={handleClearChat}
              title="Clear Chat Log"
              className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                marvelAudio.playRepulsorClick();
                onClose();
              }}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans min-h-0">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-sm ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-black/80 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.25)]">
                  <ArcReactor className="w-5 h-5 text-cyan-400" pulse={false} />
                </div>
              )}

              <div
                className={`relative group max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 transition-all ${
                  m.role === "user"
                    ? "bg-[#EC1D24]/15 border border-[#EC1D24]/60 text-white rounded-br-none shadow-[0_0_15px_rgba(236,29,36,0.2)]"
                    : "bg-black/85 border border-white/15 text-neutral-200 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.6)] ring-1 ring-cyan-500/10"
                }`}
              >
                {/* Header label inside bubble */}
                <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-white/10 text-[10px] font-mono text-neutral-400">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                    {m.role === "user" ? (
                      <>
                        <User className="w-3 h-3 text-red-400" />
                        You
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 text-cyan-400" />
                        Stark Tactical Intelligence
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{m.timestamp}</span>
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                {m.role === "assistant" ? (
                  <div>
                    {m.content ? (
                      <FormattedContent text={m.content} />
                    ) : (
                      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs py-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        Synthesizing verified career telemetry...
                      </div>
                    )}
                    {isStreaming && m.id === messages[messages.length - 1].id && m.content && (
                      <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle" />
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-red-400" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 3 && !isStreaming && (
          <div className="px-5 py-2 shrink-0 border-t border-white/5 bg-black/40">
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Tactical Directives
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q.title}
                  onClick={(e) => {
                    triggerMarvelBurst(e.clientX, e.clientY);
                    handleSendMessage(q.prompt);
                  }}
                  className="text-left p-2.5 rounded-xl border border-white/10 bg-black/60 hover:bg-[#EC1D24]/10 hover:border-[#EC1D24]/50 text-xs transition-all cursor-pointer group flex items-start gap-2"
                >
                  <span className="text-sm shrink-0">{q.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white group-hover:text-red-300 transition-colors truncate">
                      {q.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate">{q.prompt}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Input Area */}
        <div className="p-4 sm:p-5 border-t border-red-500/30 bg-black/80 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="relative"
          >
            <div className="relative bg-[#0A0B10] rounded-xl border border-white/20 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(input);
                  }
                }}
                placeholder="Ask Stark AI about internships, skill verification, or career tactics..."
                rows={2}
                disabled={isStreaming}
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none font-sans"
              />

              <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 bg-black/40 rounded-b-xl">
                <span className="text-[10px] font-mono text-neutral-500">
                  Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">Enter ↵</kbd> to dispatch
                </span>

                <div className="flex items-center gap-2">
                  {isStreaming ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-mono font-bold tracking-wider cursor-pointer shadow-[0_0_10px_rgba(236,29,36,0.5)] transition-all"
                    >
                      <Square className="w-3 h-3 fill-white" />
                      HALT
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#EC1D24] hover:bg-[#ff2b33] disabled:opacity-40 disabled:hover:bg-[#EC1D24] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(236,29,36,0.4)] transition-all"
                    >
                      <Send className="w-3 h-3" />
                      ENGAGE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
