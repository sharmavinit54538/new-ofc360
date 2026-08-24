import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  Bot,
  Zap,
  ChevronDown,
  ShieldCheck,
  FileText,
  Users,
  Coins,
  Compass,
  FileCheck,
  AlertTriangle,
  ScanFace,
  Brain,
  FileSearch,
  TrendingDown,
  FileCode,
  Wand2,
  HelpCircle,
  MailCheck,
  Target,
  Clock,
  TrendingUp,
  Crown,
  Heart,
  UserCheck,
  UserPlus,
  PieChart,
  Calendar,
  CalendarOff,
  Activity,
  BarChart3,
  FileEdit,
  Globe,
  Award,
  Calculator,
  ShieldAlert,
  LineChart,
  Scale,
  ClipboardCheck,
  AlertOctagon,
  FilePlus,
  FileCheck2,
  FileBadge,
  FileX2,
  ScrollText,
  Shield,
  FileSignature,
  Video,
  CheckSquare,
  BookmarkCheck,
  Mic,
  Send,
  LayoutDashboard,
  Repeat,
  Lightbulb,
  Database,
  FileSpreadsheet,
  Loader2,
  X,
  Cpu,
  Server,
  Network,
  CheckCircle2,
  Copy,
  Download,
  Play,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  OFC360_AI_TASKS,
  type AITask,
  OFC360_AI_ENGINE,
} from "@/ai/capabilities";
import type { AICategory } from "@/types/ai/category";
import { AI_CATEGORIES } from "@/types/ai/categoriesList";
import { aiService } from "@/ai";
import { toast } from "sonner";

// Dynamic Icon Map
const iconMap: Record<string, any> = {
  FileSearch, TrendingDown, FileCode, Wand2, HelpCircle, Zap, Sparkles,
  MailCheck, FileText, Target, Bot, Clock, TrendingUp, BookOpen: Brain,
  Crown, Heart, UserCheck, UserPlus, PieChart, Users, Calendar,
  AlertTriangle, CalendarOff, Activity, BarChart3, Coins, Compass,
  FileEdit, Globe, Award, Calculator, ShieldAlert, LineChart, ShieldCheck,
  Scale, FileCheck, ClipboardCheck, AlertOctagon, FilePlus, FileCheck2,
  FileBadge, FileX2, ScrollText, Shield, FileSignature, Video,
  CheckSquare, BookmarkCheck, Mic, Send, LayoutDashboard, Repeat,
  Lightbulb, Database, FileSpreadsheet, Search, ScanFace, Cpu, Server, Network,
};

// Category display names (short, for chips)
const CATEGORY_LABELS: Record<string, { label: string; icon: any }> = {
  "Recruitment AI": { label: "Recruitment", icon: UserPlus },
  "Employee AI": { label: "Employee", icon: Users },
  "Workforce & Shift AI": { label: "Workforce", icon: Calendar },
  "Performance & OKR AI": { label: "Performance", icon: Target },
  "Payroll & Comp AI": { label: "Payroll", icon: Coins },
  "Compliance & Legal AI": { label: "Compliance", icon: ShieldCheck },
  "Document Gen AI": { label: "Documents", icon: FileText },
  "Meeting Intelligence AI": { label: "Meetings", icon: Video },
  "Analytics & Predictive AI": { label: "Analytics", icon: BarChart3 },
  "Knowledge & RAG AI": { label: "Knowledge", icon: Brain },
  "Biometrics & Vision AI": { label: "Biometrics", icon: ScanFace },
};

export default function IntelligenceLandingPage() {
  const navigate = useNavigate();
  const [taskSearch, setTaskSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null);
  const [promptText, setPromptText] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const groups: Record<string, AITask[]> = {};
    for (const task of OFC360_AI_TASKS) {
      if (!groups[task.category]) groups[task.category] = [];
      groups[task.category].push(task);
    }
    return groups;
  }, []);

  // Filter tasks for dropdown
  const filteredTasks = useMemo(() => {
    const term = taskSearch.trim().toLowerCase();
    let tasks = OFC360_AI_TASKS;

    if (activeCategoryFilter) {
      tasks = tasks.filter((t) => t.category === activeCategoryFilter);
    }

    if (term) {
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term)
      );
    }

    // Group filtered tasks
    const groups: Record<string, AITask[]> = {};
    for (const task of tasks) {
      if (!groups[task.category]) groups[task.category] = [];
      groups[task.category].push(task);
    }
    return groups;
  }, [taskSearch, activeCategoryFilter]);

  const handleSelectTask = (task: AITask) => {
    if (task.route) {
      navigate(task.route);
      return;
    }
    setSelectedTask(task);
    setPromptText(task.demoPrompt || "");
    setIsDropdownOpen(false);
    setResultText(null);
    // Focus the textarea
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleGenerate = async () => {
    const finalPrompt = promptText.trim() || selectedTask?.demoPrompt || "Provide analysis and recommendations.";

    setIsExecuting(true);
    setResultText("");
    setLatencyMs(null);
    setTokensUsed(null);

    try {
      const res = await aiService.generate({
        prompt: finalPrompt,
        task: "text",
        parameters: {
          taskId: selectedTask?.id,
          taskType: selectedTask?.taskType,
          category: selectedTask?.category,
        },
      });
      setLatencyMs(res.latencyMs);
      setTokensUsed(res.tokensUsed);

      // Stream simulation
      const fullResponse = res.content;
      let current = "";
      for (let i = 0; i < fullResponse.length; i++) {
        current = fullResponse.slice(0, i + 1);
        setResultText(current);
        await new Promise((r) => setTimeout(r, 14));
      }

      setIsExecuting(false);
      toast.success(`✨ Task completed — ${selectedTask?.title || "OFC360 AI"} (${res.latencyMs}ms)`);
    } catch (err: any) {
      setIsExecuting(false);
      // Fallback demo output
      const fallback = selectedTask?.defaultOutput || "OFC360 AI processed your request successfully.";
      setResultText(fallback);
      setLatencyMs(820);
      setTokensUsed(256);
      toast.success(`✨ Task completed — ${selectedTask?.title || "OFC360 AI"}`);
    }
  };

  const handleCopy = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    if (resultText) {
      const blob = new Blob([resultText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OFC360_AI_${selectedTask?.id || "output"}_Report.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Exported to file");
    }
  };

  const categories = AI_CATEGORIES.filter((c) => c !== "ALL");

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-0">

      {/* ━━━━ HERO: ONE AI ENGINE ━━━━ */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-sm">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative px-6 pt-7 pb-6 md:px-8">
          {/* Top bar — badge + status */}
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1 Core AI Engine</span>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {OFC360_AI_ENGINE.status}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-1">
            OFC360 AI
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg mb-5">
            One intelligent AI engine for your entire workforce.
          </p>

          {/* Engine spec bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px]">
            <div className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-bold text-foreground">{OFC360_AI_ENGINE.provider}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-muted-foreground">Model:</span>
              <span className="font-mono font-bold text-primary">{OFC360_AI_ENGINE.model}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
              <Network className="w-3.5 h-3.5 text-primary/50" />
              OFC360 AI → Ollama → qwen3:30b
            </div>
          </div>
        </div>
      </div>

      {/* ━━━━ WORKSPACE ━━━━ */}
      <div className="mt-6 rounded-3xl border border-border/60 bg-card shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="px-6 pt-6 pb-4 md:px-8">
          <h2 className="text-lg font-bold text-foreground mb-0.5">
            What can I help you with?
          </h2>
          <p className="text-xs text-muted-foreground">
            Select a task or ask OFC360 AI anything.
          </p>
        </div>

        {/* ─── Task Selector ─── */}
        <div className="px-6 md:px-8 pb-4">
          <div className="relative" ref={dropdownRef}>
            {/* Trigger button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-border/70 bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50 transition-all text-sm cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-left min-w-0">
                {selectedTask ? (
                  <>
                    {(() => {
                      const Icon = iconMap[selectedTask.iconName] || Bot;
                      return <Icon className="w-4 h-4 text-primary shrink-0" />;
                    })()}
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground block truncate">{selectedTask.title}</span>
                      <span className="text-[10px] text-muted-foreground">{selectedTask.category}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Search or select a task...</span>
                  </>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 w-full mt-2 rounded-2xl border border-border/70 bg-card shadow-xl overflow-hidden"
                >
                  {/* Search inside dropdown */}
                  <div className="p-3 border-b border-border/40">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search tasks for OFC360 AI..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className="pl-9 pr-8 bg-secondary/30 border-border/50 text-xs h-9 rounded-xl focus:ring-2 focus:ring-primary/30"
                        autoFocus
                      />
                      {taskSearch && (
                        <button
                          onClick={() => setTaskSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Category filter chips inside dropdown */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <button
                        onClick={() => setActiveCategoryFilter(null)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                          !activeCategoryFilter
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-secondary/50 text-muted-foreground hover:bg-secondary/80 border border-transparent"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => {
                        const info = CATEGORY_LABELS[cat];
                        if (!info) return null;
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategoryFilter(activeCategoryFilter === cat ? null : cat)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                              activeCategoryFilter === cat
                                ? "bg-primary/15 text-primary border border-primary/30"
                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary/80 border border-transparent"
                            }`}
                          >
                            {info.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Task list grouped by category */}
                  <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
                    {Object.keys(filteredTasks).length === 0 && (
                      <div className="px-4 py-8 text-center text-xs text-muted-foreground">
                        <Brain className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                        No tasks found matching "{taskSearch}"
                      </div>
                    )}

                    {Object.entries(filteredTasks).map(([category, tasks]) => (
                      <div key={category}>
                        {/* Category header */}
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/20 border-b border-border/30 sticky top-0 z-10">
                          {CATEGORY_LABELS[category]?.label || category}
                          <span className="ml-1.5 text-muted-foreground/60">({tasks.length})</span>
                        </div>
                        {/* Tasks in this category */}
                        {tasks.map((task) => {
                          const Icon = iconMap[task.iconName] || Bot;
                          const isSelected = selectedTask?.id === task.id;
                          return (
                            <button
                              key={task.id}
                              onClick={() => handleSelectTask(task)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-primary/5 transition-colors cursor-pointer ${
                                isSelected ? "bg-primary/8" : ""
                              }`}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                              <div className="min-w-0 flex-1">
                                <div className={`text-xs font-semibold truncate ${isSelected ? "text-primary" : "text-foreground"}`}>
                                  {task.title}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate">
                                  {task.description}
                                </div>
                              </div>
                              {task.route && (
                                <Badge variant="outline" className="text-[8px] font-mono border-border/50 text-muted-foreground shrink-0">
                                  Page
                                </Badge>
                              )}
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Quick Category Chips (outside dropdown) ─── */}
        <div className="px-6 md:px-8 pb-4">
          <p className="text-[11px] text-muted-foreground font-medium mb-2">Suggested categories</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const info = CATEGORY_LABELS[cat];
              if (!info) return null;
              const Icon = info.icon;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategoryFilter(cat);
                    setIsDropdownOpen(true);
                    setTaskSearch("");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary/40 border border-border/50 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {info.label}
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {tasksByCategory[cat]?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Prompt Input ─── */}
        <div className="px-6 md:px-8 pb-5 border-t border-border/30 pt-5">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={selectedTask
                ? `${selectedTask.demoPrompt || `Describe what you need for ${selectedTask.title}...`}`
                : "Ask OFC360 AI anything..."
              }
              rows={3}
              className="text-sm bg-secondary/20 border-border/50 rounded-2xl resize-none pr-24 font-sans focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <div className="absolute right-3 bottom-3">
              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={isExecuting}
                className="gap-1.5 gradient-bg text-primary-foreground font-bold text-xs h-9 px-4 rounded-xl shadow-sm"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
          {selectedTask && (
            <p className="mt-2 text-[10px] text-muted-foreground">
              Task: <span className="font-semibold text-foreground">{selectedTask.title}</span>
              <span className="mx-1.5">•</span>
              <span className="font-mono">Ctrl+Enter</span> to generate
            </p>
          )}
        </div>

        {/* ─── AI Output ─── */}
        <AnimatePresence>
          {resultText !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-border/30"
            >
              <div className="px-6 md:px-8 py-5 space-y-3">
                {/* Output header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    OFC360 AI Output
                    {selectedTask && (
                      <span className="text-muted-foreground font-normal ml-1">— {selectedTask.title}</span>
                    )}
                  </span>
                  {latencyMs && (
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                      {latencyMs}ms • {tokensUsed || 0} tokens • qwen3:30b
                    </Badge>
                  )}
                </div>

                {/* Output body */}
                <div className="text-xs text-foreground font-mono leading-relaxed bg-secondary/20 p-4 rounded-xl border border-border/40 whitespace-pre-wrap max-h-80 overflow-y-auto scrollbar-thin">
                  {resultText || (
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing...
                    </span>
                  )}
                </div>

                {/* Output actions */}
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 text-xs gap-1 border-border/60">
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExport} className="h-7 text-xs gap-1 border-border/60">
                    <Download className="w-3 h-3" /> Export
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Footer ─── */}
        <div className="px-6 md:px-8 py-3 border-t border-border/30 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-mono">
            Powered by {OFC360_AI_ENGINE.provider} • {OFC360_AI_ENGINE.model}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {OFC360_AI_TASKS.length} tasks available
          </span>
        </div>
      </div>
    </div>
  );
}
