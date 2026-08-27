import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Mail,
  Building2,
  DollarSign,
  Clock,
  Trash2,
  ArrowRight,
  Check,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useAskPeopleAIMutation } from "@/services/api/peopleAiApi";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useGetDepartmentsQuery } from "@/services/api/departmentApi";
import { useGetManagersQuery } from "@/services/api/managerApi";
import type {
  AskPeopleAIResponse,
  CleanEmployeeItem,
  ConfirmationDetails,
  StructuredAIOutput,
} from "@/services/people-ai/peopleAiTypes";
import { toast } from "sonner";

interface PeopleAICopilotDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  structuredOutput?: StructuredAIOutput;
  responsePayload?: AskPeopleAIResponse;
  timestamp: string;
}

const getStatusBadgeColor = (status?: string) => {
  const s = (status || "active").toLowerCase();
  if (s.includes("active") && !s.includes("in")) {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  }
  if (s.includes("invite") || s.includes("pending")) {
    return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
  }
  if (s.includes("probation")) {
    return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
  }
  if (s.includes("leave")) {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
  }
  if (s.includes("notice") || s.includes("inactive") || s.includes("resign")) {
    return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
  }
  return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
};

/* -------------------------------------------------------------------------- */
/* 1. Single Employee Card Component                                          */
/* -------------------------------------------------------------------------- */
const EmployeeCardComponent: React.FC<{ employee: CleanEmployeeItem }> = ({ employee }) => {
  const initials = employee.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "E";

  const isEmpActive = (employee.status || "Active").toLowerCase().includes("active");

  return (
    <div className="rounded-xl p-3.5 bg-card border border-border/70 shadow-xs space-y-3 my-1 transition-all">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-foreground truncate">{employee.name}</h4>
            <p className="text-[11px] text-muted-foreground truncate">
              {employee.role} · <span className="font-medium text-foreground/80">{employee.department}</span>
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeColor(
            employee.status
          )}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isEmpActive ? "bg-emerald-500 animate-pulse" : "bg-current"
            }`}
          />
          <span>{employee.status || "Active"}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-border/40 text-muted-foreground">
        <div>
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider block">
            Reporting Manager
          </span>
          <span className="font-medium text-foreground truncate block">
            {employee.manager || "Not Assigned"}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider block">
            Official Email
          </span>
          {employee.email ? (
            <a
              href={`mailto:${employee.email}`}
              className="font-medium text-primary hover:underline truncate flex items-center gap-1"
            >
              <Mail className="w-3 h-3 shrink-0" />
              <span className="truncate">{employee.email}</span>
            </a>
          ) : (
            <span className="font-medium text-muted-foreground">Not recorded</span>
          )}
        </div>

        {employee.salary && (
          <div>
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider block">
              Annual CTC
            </span>
            <span className="font-medium text-foreground font-mono">
              ₹{Number(employee.salary).toLocaleString()}/yr
            </span>
          </div>
        )}

        {employee.joinedAt && (
          <div>
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider block">
              Joined Date
            </span>
            <span className="font-medium text-foreground font-mono">{employee.joinedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Employee List Component                                                 */
/* -------------------------------------------------------------------------- */
const EmployeeListComponent: React.FC<{
  title?: string;
  count?: number;
  employees: CleanEmployeeItem[];
}> = ({ title, count, employees }) => {
  return (
    <div className="rounded-xl bg-card border border-border/70 shadow-xs overflow-hidden my-1">
      {title && (
        <div className="px-3.5 py-2 bg-secondary/40 border-b border-border/50 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">{title}</span>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-semibold font-mono">
            {count ?? employees.length} {employees.length === 1 ? "Employee" : "Employees"}
          </Badge>
        </div>
      )}

      <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto">
        {employees.map((emp, idx) => {
          const initials = emp.name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "E";

          return (
            <div
              key={emp.id || idx}
              className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-7 w-7 border border-primary/20 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{emp.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {emp.role} · <span className="text-foreground/75">{emp.department}</span>
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider shrink-0 border ${getStatusBadgeColor(
                  emp.status
                )}`}
              >
                {emp.status || "Active"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Action Result Card Component                                            */
/* -------------------------------------------------------------------------- */
const ActionResultCard: React.FC<{
  result: {
    success: boolean;
    actionType: string;
    message: string;
    employeeName?: string;
    details?: string;
  };
}> = ({ result }) => {
  return (
    <div className="rounded-xl p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-foreground space-y-1.5 my-1">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
        <span>Done</span>
      </div>
      <p className="text-xs font-medium text-foreground leading-relaxed">
        {result.message}
      </p>
      {result.details && (
        <p className="text-[11px] text-muted-foreground">{result.details}</p>
      )}
      <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
        The Employee Directory has been updated.
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Confirmation Card Component                                             */
/* -------------------------------------------------------------------------- */
const ConfirmationCard: React.FC<{
  confirmation: ConfirmationDetails;
  onConfirm: (conf: ConfirmationDetails) => void;
  onCancel: () => void;
  isExecuting?: boolean;
}> = ({ confirmation, onConfirm, onCancel, isExecuting }) => {
  return (
    <div className="rounded-xl p-3.5 bg-card border border-primary/30 shadow-sm space-y-3 my-1">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-foreground">{confirmation.title}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 whitespace-pre-line leading-relaxed">
            {confirmation.description}
          </p>
        </div>
      </div>

      {confirmation.affectedEmployees && confirmation.affectedEmployees.length > 0 && (
        <div className="rounded-lg bg-secondary/50 p-2 text-[11px] text-foreground max-h-28 overflow-y-auto space-y-1 border border-border/40">
          <span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider block">
            Affected Employees ({confirmation.affectedEmployees.length}):
          </span>
          {confirmation.affectedEmployees.map((e, i) => (
            <p key={i} className="truncate">
              • <span className="font-semibold">{e.name}</span> ({e.department || "General"})
            </p>
          ))}
        </div>
      )}

      <div className="pt-1 flex items-center justify-end gap-2 border-t border-border/40">
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isExecuting}
          className="h-8 text-xs font-semibold px-3 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onConfirm(confirmation)}
          disabled={isExecuting}
          className="h-8 text-xs font-semibold px-3.5 gradient-bg text-primary-foreground gap-1.5 shadow-xs cursor-pointer"
        >
          {isExecuting ? (
            <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          <span>Confirm</span>
        </Button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Compensation Overview Component                                         */
/* -------------------------------------------------------------------------- */
const CompensationOverviewComponent: React.FC<{
  compensation: NonNullable<StructuredAIOutput["compensation"]>;
}> = ({ compensation }) => {
  return (
    <div className="rounded-xl p-3.5 bg-card border border-border/70 shadow-xs space-y-3 my-1">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <span className="text-xs font-bold text-foreground">Compensation Overview</span>
        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-mono">
          {compensation.headcount} Audited Staff
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-secondary/40 p-2.5 rounded-lg border border-border/40">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Annual Payroll</span>
          <span className="font-bold text-foreground font-mono text-sm">
            ₹{compensation.totalAnnual.toLocaleString()}
          </span>
        </div>
        <div className="bg-secondary/40 p-2.5 rounded-lg border border-border/40">
          <span className="text-[10px] text-muted-foreground uppercase font-bold block">Monthly Outflow</span>
          <span className="font-bold text-foreground font-mono text-sm">
            ₹{compensation.totalMonthly.toLocaleString()}
          </span>
        </div>
      </div>

      {compensation.departments && compensation.departments.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Department Breakdown
          </span>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {compensation.departments.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[11px] p-1.5 rounded-md hover:bg-secondary/40 transition-colors"
              >
                <span className="font-semibold text-foreground">{d.department} ({d.count})</span>
                <span className="font-mono text-muted-foreground">₹{d.annualTotal.toLocaleString()}/yr</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN PEOPLE AI COPILOT DRAWER                                              */
/* -------------------------------------------------------------------------- */
export const PeopleAICopilotDrawer: React.FC<PeopleAICopilotDrawerProps> = ({
  open,
  onClose,
}) => {
  const { user, role } = useAuth();
  const [queryInput, setQueryInput] = useState("");
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

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
      text: "Hi! What would you like me to do?\n\nYou can ask me inquiries or give direct workforce commands in English, Hindi, or Hinglish:\n• *\"Engineering ke saare employees dikhao\"*\n• *\"Move Rahul to Finance\"*\n• *\"Who is on leave today?\"*\n• *\"Show salary breakdown\"*\n• *\"Add Rahul Sharma to Engineering\"*",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickActionSuggestions = [
    "Engineering ke saare employees dikhao",
    "Show company salary breakdown",
    "Who is on leave today?",
    "Who is on probation right now?",
  ];

  // Auto-scroll when messages change or loading state changes
  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string, confirmedAction?: ConfirmationDetails) => {
    const textToSend = (customQuery || queryInput).trim();
    if ((!textToSend && !confirmedAction) || isLoading || isExecutingAction) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: confirmedAction ? `Confirm: ${confirmedAction.title}` : textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQueryInput("");

    try {
      if (confirmedAction) setIsExecutingAction(true);

      const res = await askPeopleApi({
        request: {
          query: textToSend || "Confirm",
          confirmedAction,
        },
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
        structuredOutput: res.structuredOutput,
        responsePayload: res,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "I couldn't complete that action. Please check your connection or permissions and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsExecutingAction(false);
    }
  };

  const handleConfirmAction = async (confirmation: ConfirmationDetails) => {
    await handleSend("Confirm", confirmation);
  };

  const handleCancelAction = () => {
    const cancelMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: "Action cancelled. No changes were made.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, cancelMsg]);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "ai",
        text: "Conversation cleared. How can I help you manage your workforce today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-background/50 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="w-full sm:max-w-lg md:max-w-xl bg-card border-l border-border/70 shadow-2xl h-full flex flex-col justify-between"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border/50 flex items-center justify-between bg-secondary/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>People AI</span>
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  AI workforce assistant
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
                title="Close Drawer"
                className="h-8 w-8 rounded-lg hover:bg-secondary/70 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Body */}
          <div
            ref={scrollViewportRef}
            className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-border"
          >
            {messages.map((msg) => {
              const structured = msg.structuredOutput;

              return (
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
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-xs shadow-xs"
                        : "glass-card bg-secondary/35 border border-border/60 text-foreground rounded-tl-xs space-y-2.5 shadow-xs"
                    }`}
                  >
                    {/* Render Markdown Text (Clean without raw UUIDs) */}
                    <div className="prose prose-xs dark:prose-invert max-w-none text-foreground leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h3: ({ node, ...props }) => (
                            <h3 className="text-xs font-bold text-foreground border-b border-border/50 pb-1 mt-1 mb-2" {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="text-[11px] font-bold text-foreground mt-2 mb-1" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="mb-2 leading-relaxed text-xs text-foreground/90 whitespace-pre-line" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-4 space-y-1 mb-2 text-xs" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-xs leading-relaxed" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-foreground" {...props} />
                          ),
                          a: ({ node, ...props }) => (
                            <a className="text-primary hover:underline font-medium" {...props} />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>

                    {/* Render Structured UI Components if present */}
                    {structured && (
                      <div className="space-y-2 pt-1">
                        {/* 1. Single Employee Profile Card */}
                        {structured.type === "employee_card" && structured.employee && (
                          <EmployeeCardComponent employee={structured.employee} />
                        )}

                        {/* 2. Employee List (e.g. Engineering Employees) */}
                        {structured.type === "employee_list" && structured.employees && (
                          <EmployeeListComponent
                            title={structured.title}
                            count={structured.count}
                            employees={structured.employees}
                          />
                        )}

                        {/* 3. Interactive Confirmation Card */}
                        {structured.type === "confirmation_request" && structured.confirmation && (
                          <ConfirmationCard
                            confirmation={structured.confirmation}
                            onConfirm={handleConfirmAction}
                            onCancel={handleCancelAction}
                            isExecuting={isExecutingAction}
                          />
                        )}

                        {/* 4. Action Result Banner */}
                        {structured.type === "action_result" && structured.actionResult && (
                          <ActionResultCard result={structured.actionResult} />
                        )}

                        {/* 5. Compensation Overview */}
                        {structured.type === "compensation_overview" && structured.compensation && (
                          <CompensationOverviewComponent compensation={structured.compensation} />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-end text-[9px] text-muted-foreground/70 pt-0.5">
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-secondary border border-border/60 text-foreground flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-primary" />
                </div>
                <div className="glass-card bg-secondary/40 border border-border/60 rounded-2xl px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2 shadow-xs">
                  <span className="font-semibold text-foreground animate-pulse">People AI is working...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions on fresh chat */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-secondary/15 border-t border-border/40 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
                Try:
              </span>
              {quickActionSuggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-[11px] font-medium bg-secondary/60 hover:bg-primary/10 text-foreground hover:text-primary px-2.5 py-1 rounded-md border border-border/50 transition-all shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

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
                placeholder="Ask People AI... (e.g. 'Move Rahul to Finance', 'Engineering ke saare employees dikhao')"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                disabled={isLoading || isExecutingAction}
                className="text-xs h-10 bg-card border-border/60 focus-visible:ring-primary/40 rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!queryInput.trim() || isLoading || isExecutingAction}
                className="h-10 w-10 shrink-0 gradient-bg text-primary-foreground shadow-xs cursor-pointer rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
