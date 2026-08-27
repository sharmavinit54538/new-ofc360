import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  Crown,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  DollarSign,
  Clock,
  Building2,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAskPeopleAIMutation } from "@/services/api/peopleAiApi";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useGetDepartmentsQuery } from "@/services/api/departmentApi";
import { useGetManagersQuery } from "@/services/api/managerApi";
import type { AskPeopleAIResponse } from "@/services/people-ai/peopleAiTypes";
import { toast } from "sonner";

interface PeopleAICopilotDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  responsePayload?: AskPeopleAIResponse;
  timestamp: string;
}

export const PeopleAICopilotDrawer: React.FC<PeopleAICopilotDrawerProps> = ({
  open,
  onClose,
}) => {
  const { user, role } = useAuth();
  const [queryInput, setQueryInput] = useState("");
  const [activePersona, setActivePersona] = useState<"hr" | "manager" | "executive">("hr");
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const { data: rawDepartments = [] } = useGetDepartmentsQuery();
  const { data: rawManagers = [] } = useGetManagersQuery();

  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const departments = Array.isArray(rawDepartments) ? rawDepartments : [];
  const managers = Array.isArray(rawManagers) ? rawManagers : [];

  const [askPeopleApi, { isLoading }] = useAskPeopleAIMutation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "### Welcome to OFC360 People Intelligence Copilot\n\nI have complete access to live organizational data with verified role-based access control and zero mock data.\n\n**You can execute actions and inquiries in English, Hindi, or Hinglish, such as:**\n* *\"Move [Employee] to Finance\"* or *\"[Employee] ko Finance me move karo\"*\n* *\"Make [Manager] [Employee]'s manager\"* or *\"[Employee] ka manager [Manager] ko banao\"*\n* *\"List all employees in directory\"* or *\"Sabhi employees dikhao\"*\n* *\"Show salary breakdown and payroll totals\"*\n* *\"Who is on leave today and what is the attendance rate?\"*\n* *\"Tell me about [Employee Name]\"* or *\"Who is on probation?\"*",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const hrSuggestedQueries = [
    "Who needs attention today?",
    "Show me all employees in a directory",
    "Which departments are understaffed?",
    "Who is on probation right now?",
    "Show company salary & payroll breakdown",
    "What HR actions are pending?",
  ];

  const managerSuggestedQueries = [
    "How is my team performing?",
    "Who are the top performers?",
    "Who is on leave today?",
    "Who needs 1-on-1 coaching?",
    "What actions should I take this week?",
  ];

  const executiveSuggestedQueries = [
    "Give me workforce health overview.",
    "Show compensation & payroll totals.",
    "Which departments are at risk?",
    "Who are the leadership members?",
    "Show all department comparisons.",
  ];

  const quickActionChips = [
    { label: "All Employees", query: "Show all employees in directory table", icon: Users },
    { label: "Salaries & Payroll", query: "Show company salary and payroll breakdown", icon: DollarSign },
    { label: "Attendance & Leaves", query: "Who is on leave and what is the attendance rate?", icon: Clock },
    { label: "Probation List", query: "Who is on probation right now?", icon: AlertTriangle },
    { label: "Departments", query: "Show all departments in organization", icon: Building2 },
    { label: "Leadership", query: "Who are the leaders and managers in organization?", icon: Crown },
  ];

  const currentSuggested =
    activePersona === "manager"
      ? managerSuggestedQueries
      : activePersona === "executive"
      ? executiveSuggestedQueries
      : hrSuggestedQueries;

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || queryInput).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQueryInput("");

    try {
      const res = await askPeopleApi({
        request: { query: textToSend },
        employees,
        departments,
        managers,
        role: role || "hr_admin",
        userId: user?.id || "hr-admin",
        actorName: (user as any)?.name || user?.email || "Authenticated User",
      }).unwrap();

      if (res.actionExecuted?.success) {
        toast.success(res.actionExecuted.message);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.answer,
        responsePayload: res,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I was unable to process your query against the live data store. Please verify your connection or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };


  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    toast.success("Intelligence report copied to clipboard!");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "ai",
        text: "Conversation cleared. Ask me any inquiry about OFC360 employees, salaries, departments, attendance, or operations.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.info("Chat history cleared.");
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-2xl bg-card border-l border-border/60 shadow-2xl h-full flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>Ask People AI</span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-bold">
                    OFC360 Grounded Engine
                  </Badge>
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Grounded intelligence across workforce, payroll, and organization
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                title="Clear Chat"
                className="h-8 w-8 rounded-lg hover:bg-secondary/70 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-secondary/70 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Persona selector */}
          <div className="px-4 pt-2.5 pb-2 border-b border-border/40 bg-secondary/10 flex items-center justify-between gap-2">
            <Tabs value={activePersona} onValueChange={(v) => setActivePersona(v as any)} className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-secondary/50 p-0.5 rounded-lg h-7">
                <TabsTrigger value="hr" className="text-[11px] font-semibold">
                  <Users className="w-3 h-3 mr-1" /> HR Admin
                </TabsTrigger>
                <TabsTrigger value="manager" className="text-[11px] font-semibold">
                  <Briefcase className="w-3 h-3 mr-1" /> Manager
                </TabsTrigger>
                <TabsTrigger value="executive" className="text-[11px] font-semibold">
                  <Crown className="w-3 h-3 mr-1" /> Executive
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Quick Categories Bar */}
          <div className="px-4 py-2 border-b border-border/30 bg-card flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickActionChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.query)}
                  className="flex items-center gap-1.5 text-[11px] font-medium bg-secondary/60 hover:bg-primary/10 text-foreground hover:text-primary px-2.5 py-1 rounded-md border border-border/50 transition-all shrink-0 cursor-pointer"
                >
                  <Icon className="w-3 h-3 text-primary" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Body */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            <div className="space-y-4 pb-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-xs shadow-xs"
                        : "glass-card bg-secondary/40 border border-border/60 text-foreground rounded-tl-xs space-y-2.5 shadow-xs"
                    }`}
                  >
                    {/* Rich Markdown Rendering */}
                    {msg.sender === "ai" ? (
                      <div className="prose prose-xs dark:prose-invert max-w-none text-foreground leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h3: ({ node, ...props }) => (
                              <h3 className="text-xs font-bold text-foreground border-b border-border/50 pb-1 mt-3 mb-2 flex items-center gap-1" {...props} />
                            ),
                            h4: ({ node, ...props }) => (
                              <h4 className="text-[11px] font-bold text-foreground mt-2 mb-1" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                              <p className="mb-2 leading-relaxed text-xs text-foreground/90" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4 space-y-1 mb-2 text-xs" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol className="list-decimal pl-4 space-y-1 mb-2 text-xs font-medium" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="text-xs leading-relaxed" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-bold text-foreground" {...props} />
                            ),
                            table: ({ node, ...props }) => (
                              <div className="overflow-x-auto my-2 rounded-lg border border-border/60">
                                <table className="w-full text-[11px] text-left border-collapse" {...props} />
                              </div>
                            ),
                            thead: ({ node, ...props }) => (
                              <thead className="bg-secondary/70 text-foreground font-bold border-b border-border/60" {...props} />
                            ),
                            tbody: ({ node, ...props }) => (
                              <tbody className="divide-y divide-border/40" {...props} />
                            ),
                            tr: ({ node, ...props }) => (
                              <tr className="hover:bg-secondary/30 transition-colors" {...props} />
                            ),
                            th: ({ node, ...props }) => (
                              <th className="p-2 font-bold whitespace-nowrap text-foreground" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                              <td className="p-2 align-top text-foreground/90" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                              <code className="bg-primary/10 text-primary font-mono text-[10px] px-1.5 py-0.5 rounded border border-primary/20" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="border-l-2 border-primary/40 pl-3 py-1 my-2 bg-secondary/30 rounded-r-md text-muted-foreground text-[11px] italic" {...props} />
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-xs">{msg.text}</p>
                    )}

                    {/* Evidence & Supporting data points if available */}
                    {msg.responsePayload && (
                      <div className="pt-2.5 border-t border-border/40 space-y-2 mt-2">
                        {msg.responsePayload.supportingDataPoints.length > 0 && (
                          <div className="text-[10px] text-muted-foreground bg-secondary/60 p-2.5 rounded-xl space-y-1 border border-border/40">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Evidence & Grounding
                              </span>
                              <Badge variant="outline" className="text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                {msg.responsePayload.confidence} CONFIDENCE
                              </Badge>
                            </div>
                            {msg.responsePayload.supportingDataPoints.map((pt, i) => (
                              <p key={i}>• {pt}</p>
                            ))}
                          </div>
                        )}

                        {/* Suggested Follow ups */}
                        {msg.responsePayload.suggestedFollowUps && (
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                              Suggested Follow-Ups:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {msg.responsePayload.suggestedFollowUps.map((fu, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSend(fu)}
                                  className="text-[10px] font-medium bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5 rounded-md border border-primary/20 transition-all text-left flex items-center gap-1 cursor-pointer"
                                >
                                  <span>{fu}</span>
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Footer: Timestamp & Copy Button */}
                    <div className="flex items-center justify-between pt-1 text-[9px] text-muted-foreground/80 border-t border-border/20 mt-1">
                      <span>{msg.timestamp}</span>
                      {msg.sender === "ai" && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-500" />
                              <span className="text-emerald-500 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-secondary border border-border/60 text-foreground flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="glass-card bg-secondary/40 border border-border/60 rounded-2xl px-3.5 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
                    <span className="animate-pulse font-semibold">Synthesizing live organizational telemetry & personnel database...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggested prompt pills */}
            <div className="pt-3 border-t border-border/40 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Recommended {activePersona.toUpperCase()} Inquiries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentSuggested.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-[11px] font-medium bg-secondary/60 hover:bg-secondary text-foreground hover:text-primary px-2.5 py-1 rounded-lg border border-border/50 transition-all cursor-pointer text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Bottom input */}
          <div className="p-3 border-t border-border/50 bg-secondary/20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="Ask about any employee, salary, attendance, probation, department..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                disabled={isLoading}
                className="text-xs h-9 bg-card border-border/60 focus-visible:ring-primary/40"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!queryInput.trim() || isLoading}
                className="h-9 w-9 shrink-0 gradient-bg text-primary-foreground shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
