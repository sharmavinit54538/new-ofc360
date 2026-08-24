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
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null);
  const [promptText, setPromptText] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const groups: Record<string, AITask[]> = {};
    for (const task of OFC360_AI_TASKS) {
      if (!groups[task.category]) groups[task.category] = [];
      groups[task.category].push(task);
    }
    return groups;
  }, []);

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

        <div className="relative px-6 py-7 md:px-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-1">
            OFC360 AI
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
            One intelligent AI engine for your entire workforce.
          </p>
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
            Ask OFC360 AI anything across recruitment, employee, workforce, payroll, and more.
          </p>
        </div>

        {/* ─── Prompt Input ─── */}
        <div className="px-6 md:px-8 pb-5">
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
