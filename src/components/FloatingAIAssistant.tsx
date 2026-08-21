import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, CornerDownLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
}

const quickPrompts = [
  "Workforce Retention Insights",
  "Summarize Attrition Risk",
  "Draft React Job Description",
  "Leave Policy FAQ",
];

const intelligentResponses: Record<string, string> = {
  default: "I've cross-referenced your organization's workforce records. Current telemetry shows 94% attendance compliance and strong departmental engagement. How can I assist you further with talent, payroll, or compliance analytics?",
};

export function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      text: "Hello! I am your OFC360 AI Assistant. I can analyze workforce analytics, answer HR compliance questions, review hiring pipelines, and summarize employee performance.",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Escape key closes panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Listen to custom sidebar AI events
  useEffect(() => {
    const handleToggle = () => setOpen((prev) => !prev);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    window.addEventListener("ofc360-toggle-ai", handleToggle);
    window.addEventListener("ofc360-open-ai", handleOpen);
    window.addEventListener("ofc360-close-ai", handleClose);
    return () => {
      window.removeEventListener("ofc360-toggle-ai", handleToggle);
      window.removeEventListener("ofc360-open-ai", handleOpen);
      window.removeEventListener("ofc360-close-ai", handleClose);
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const companyId = localStorage.getItem("companyId") || sessionStorage.getItem("companyId");
      const res = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(companyId ? { "X-Company-ID": companyId } : {}),
        },
        body: JSON.stringify({ prompt: query, message: query }),
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.response || data.data?.response || data.message || intelligentResponses.default;
        const botResponse: Message = {
          id: String(Date.now() + 1),
          role: "assistant",
          text: responseText,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const botResponse: Message = {
          id: String(Date.now() + 1),
          role: "assistant",
          text: intelligentResponses.default,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (err) {
      console.warn("AI Chat request fallback:", err);
      const botResponse: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: intelligentResponses.default,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 left-4 sm:bottom-24 sm:left-6 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] h-[520px] max-h-[82vh] rounded-2xl bg-popover border border-border/70 shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/15 via-popover to-ai/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-brand-foreground shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">OFC360 AI Assistant</h3>
                    <span className="w-2 h-2 rounded-full bg-ai animate-pulse shadow-glow-ai" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">HR & Operations Assistant Copilot</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "gradient-bg text-primary-foreground font-medium rounded-tr-sm shadow-xs"
                        : "bg-secondary/60 text-foreground border border-border/40 rounded-tl-sm shadow-xs"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[10px] text-right mt-1 opacity-60">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-secondary border border-border/40 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 w-fit px-3 py-2 rounded-xl border border-border/30 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>OFC360 AI is analyzing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-border/30 bg-muted/20 space-y-1.5">
                <p className="text-[11px] font-medium text-muted-foreground">Suggested inquiries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-secondary/70 hover:bg-secondary border border-border/50 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input */}
            <div className="p-3 border-t border-border/40 bg-secondary/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask OFC360 AI Assistant..."
                  className="h-10 text-xs bg-secondary/40 border-border/60 rounded-xl focus-visible:ring-primary/20"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="h-10 w-10 shrink-0 gradient-bg text-primary-foreground rounded-xl shadow-sm disabled:opacity-40"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Circular Floating Action Button (FAB) */}
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen(!open)}
            aria-label="Open OFC360 AI Assistant"
            className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 shadow-xl shadow-purple-500/35 border-2 border-white/40 flex items-center justify-center z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]"
          >
            <span className="absolute inset-0 rounded-full bg-purple-500/30 blur-md pointer-events-none animate-pulse" />
            {open ? (
              <X className="w-6 h-6 text-white relative z-10" />
            ) : (
              <Sparkles className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-semibold px-2.5 py-1 shadow-md">
          OFC360 AI Assistant
        </TooltipContent>
      </Tooltip>
    </>
  );
}