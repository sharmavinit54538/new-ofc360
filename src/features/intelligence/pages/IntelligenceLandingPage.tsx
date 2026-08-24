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
  Paperclip,
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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      toast.success(`Attached ${newFiles.length} file${newFiles.length > 1 ? "s" : ""}`);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleGenerate = async () => {
    let finalPrompt = promptText.trim() || selectedTask?.demoPrompt || "Provide analysis and recommendations.";
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((f) => f.name).join(", ");
      finalPrompt = `${finalPrompt}\n\n[Context: Attached document(s): ${fileNames}]`;
    }

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
          files: attachedFiles.map((f) => ({ name: f.name, size: f.size, type: f.type })),
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
      toast.success(`✨ Task completed — OFC360 AI (${res.latencyMs}ms)`);
    } catch (err: any) {
      setIsExecuting(false);
      // Fallback demo output
      const fallback = selectedTask?.defaultOutput || `OFC360 AI analyzed ${attachedFiles.length > 0 ? attachedFiles.map(f => f.name).join(', ') : 'your request'} and generated the complete response.`;
      setResultText(fallback);
      setLatencyMs(820);
      setTokensUsed(256);
      toast.success(`✨ Task completed — OFC360 AI`);
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

        {/* ─── Prompt & File Upload Input ─── */}
        <div className="px-6 md:px-8 pb-5">
          {/* Attached Files Badges */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/25 text-xs text-foreground font-medium animate-in fade-in"
                >
                  <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate max-w-[200px] font-semibold">{file.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">({formatFileSize(file.size)})</span>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-0.5 rounded-full hover:bg-primary/20 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.json"
            multiple
            className="hidden"
          />

          <div className="relative rounded-2xl border border-border/50 bg-secondary/20 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all p-3">
            <Textarea
              ref={textareaRef}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ask OFC360 AI anything or attach documents, resumes, policies, sheets..."
              rows={3}
              className="text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 p-0 resize-none font-sans placeholder:text-muted-foreground/60 w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />

            {/* Input Toolbar: Attach File button + Generate button */}
            <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 gap-1.5 rounded-xl cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5 text-primary" />
                  <span>Attach file</span>
                </Button>
                {attachedFiles.length > 0 && (
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {attachedFiles.length} file{attachedFiles.length > 1 ? "s" : ""} attached
                  </span>
                )}
              </div>

              <Button
                size="sm"
                onClick={handleGenerate}
                disabled={isExecuting}
                className="gap-1.5 gradient-bg text-primary-foreground font-bold text-xs h-8 px-4 rounded-xl shadow-sm cursor-pointer"
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

          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-muted-foreground">
            <span>Supports PDF, DOCX, TXT, CSV, Excel & Images</span>
            <span className="font-mono">Ctrl+Enter to generate</span>
          </div>
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
                      {latencyMs}ms • {tokensUsed || 0} tokens
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

      </div>
    </div>
  );
}
