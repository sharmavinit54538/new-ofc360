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

  const handleSend = (textToSend?: string) => {
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

    setTimeout(() => {
      const botResponse: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        text: intelligentResponses.default,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
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
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] h-[520px] max-h-[82vh] rounded-2xl bg-card border border-border/70 shadow-2xl z-40 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/15 via-card to-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">OFC360 AI Assistant</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Workforce Intelligence & RAG Copilot</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                aria-label="Close OFC360 AI Assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-secondary/30 border-b border-border/30 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-card hover:bg-primary/10 hover:text-primary border border-border/60 text-muted-foreground transition-colors shrink-0 font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="space-y-1 max-w-[82%]">
                    <div
                      className={`text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl shadow-xs ${
                        m.role === "user"
                          ? "gradient-bg text-primary-foreground font-medium rounded-br-xs"
                          : "bg-secondary/70 text-foreground border border-border/40 rounded-bl-xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span
                      className={`block text-[10px] text-muted-foreground px-1 ${
                        m.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center text-xs text-muted-foreground pt-1">
                  <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <span className="italic text-[11px]">OFC360 AI is analyzing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-border/50 bg-card/60">
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
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpen(!open)}
            aria-label="Open OFC360 AI Assistant"
            className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 w-14 h-14 rounded-full gradient-bg shadow-xl shadow-primary/25 border border-white/20 flex items-center justify-center z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer transition-shadow"
          >
            <span className="absolute inset-0 rounded-full gradient-bg opacity-30 animate-ping pointer-events-none" />
            {open ? (
              <X className="w-6 h-6 text-primary-foreground relative z-10" />
            ) : (
              <Sparkles className="w-6 h-6 text-primary-foreground relative z-10" />
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left" className="text-xs font-semibold px-2.5 py-1 shadow-md">
          OFC360 AI Assistant
        </TooltipContent>
      </Tooltip>
    </>
  );
}