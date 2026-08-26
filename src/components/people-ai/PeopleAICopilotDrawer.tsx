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
  HelpCircle,
  TrendingUp,
  Users,
  Briefcase,
  Crown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
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
      text: "Hello! I am your OFC360 People Intelligence Copilot. Ask me any question about workforce health, employee milestones, performance velocity, department staffing, or pending approvals.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const hrSuggestedQueries = [
    "Who needs attention today?",
    "Show me employees whose performance is declining.",
    "Which departments are understaffed?",
    "Who has upcoming probation completion?",
    "What HR actions are pending?",
  ];

  const managerSuggestedQueries = [
    "How is my team performing?",
    "Who needs support?",
    "Who is overloaded?",
    "Which goals are falling behind?",
    "What actions should I take this week?",
  ];

  const executiveSuggestedQueries = [
    "Give me workforce health.",
    "Which departments are at risk?",
    "What are the biggest People risks?",
    "Show workforce trends.",
    "Where should leadership intervene?",
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
      }).unwrap();

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

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-md bg-card border-l border-border/60 shadow-2xl h-full flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>Ask People AI</span>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    OFC360 Engine
                  </Badge>
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Grounded on live organization data with strict RBAC
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg hover:bg-secondary/70 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Persona selector */}
          <div className="px-4 pt-3 pb-2 border-b border-border/40 bg-secondary/10">
            <Tabs value={activePersona} onValueChange={(v) => setActivePersona(v as any)}>
              <TabsList className="w-full grid grid-cols-3 bg-secondary/40 p-0.5 rounded-lg h-7">
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

          {/* Messages Body */}
          <ScrollArea className="flex-1 p-4 space-y-4">
            <div className="space-y-4 pb-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-xs"
                        : "glass-card bg-secondary/40 border border-border/60 text-foreground rounded-tl-xs space-y-2"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Evidence & Supporting data points if available */}
                    {msg.responsePayload && (
                      <div className="pt-2 border-t border-border/40 space-y-1.5 mt-2">
                        {msg.responsePayload.supportingDataPoints.length > 0 && (
                          <div className="text-[10px] text-muted-foreground bg-secondary/50 p-2 rounded-lg space-y-1">
                            <span className="font-bold text-foreground flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Evidence & Data Grounding
                            </span>
                            {msg.responsePayload.supportingDataPoints.map((pt, i) => (
                              <p key={i}>• {pt}</p>
                            ))}
                          </div>
                        )}

                        {/* Suggested Follow ups */}
                        {msg.responsePayload.suggestedFollowUps && (
                          <div className="pt-1 flex flex-wrap gap-1">
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
                        )}
                      </div>
                    )}

                    <span className="block text-[9px] text-muted-foreground/80 text-right mt-1">
                      {msg.timestamp}
                    </span>
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
                    <span className="animate-pulse font-semibold">Synthesizing authorized organizational data...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggested prompt pills */}
            <div className="pt-2 border-t border-border/40 space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Suggested {activePersona.toUpperCase()} Questions
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
                placeholder="Ask about team health, risks, trends, probation..."
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
