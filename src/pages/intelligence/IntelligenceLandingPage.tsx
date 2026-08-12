import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Brain,
  FileSearch,
  Mic,
  Video,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Heart,
  Globe,
  ShieldCheck,
  Lightbulb,
  Search,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  ScanFace,
  TrendingDown,
  FileCode,
  Wand2,
  HelpCircle,
  MailCheck,
  Target,
  Clock,
  Crown,
  UserCheck,
  UserPlus,
  Users,
  Calendar,
  AlertTriangle,
  CalendarOff,
  Coins,
  Compass,
  FileEdit,
  Award,
  Calculator,
  ShieldAlert,
  LineChart,
  Scale,
  FileCheck,
  ClipboardCheck,
  AlertOctagon,
  FilePlus,
  FileCheck2,
  FileBadge,
  FileX2,
  ScrollText,
  Shield,
  FileSignature,
  CheckSquare,
  BookmarkCheck,
  Send,
  LayoutDashboard,
  Repeat,
  Database,
  FileSpreadsheet,
  Play,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ALL_71_AI_MODELS,
  AI_CATEGORIES,
  type AIToolItem
} from "@/data/aiToolsData";
import { AIModelWorkspaceModal } from "@/components/intelligence/AIModelWorkspaceModal";
import { executeAiModel, streamAiResponse } from "@/utils/aiModelRouter";
import { useAIStore } from "@/stores/aiStore";
import { toast } from "sonner";

// Dynamic Icon Map
const iconMap: Record<string, any> = {
  FileSearch,
  TrendingDown,
  FileCode,
  Wand2,
  HelpCircle,
  Zap,
  Sparkles,
  MailCheck,
  FileText,
  Target,
  Bot,
  Clock,
  TrendingUp,
  BookOpen: Brain,
  Crown,
  Heart,
  UserCheck,
  UserPlus,
  PieChart,
  Users,
  Calendar,
  AlertTriangle,
  CalendarOff,
  Activity,
  BarChart3,
  Coins,
  Compass,
  FileEdit,
  Globe,
  Award,
  Calculator,
  ShieldAlert,
  LineChart,
  ShieldCheck,
  Scale,
  FileCheck,
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
  Search,
  ScanFace,
};

export default function IntelligenceLandingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Interactive Live Simulator State
  const [activeModel, setActiveModel] = useState<AIToolItem | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const filteredModules = ALL_71_AI_MODELS.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(search.toLowerCase()) ||
      mod.description.toLowerCase().includes(search.toLowerCase()) ||
      mod.badge.toLowerCase().includes(search.toLowerCase()) ||
      mod.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "ALL" || mod.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenTool = (tool: AIToolItem) => {
    if (tool.route) {
      navigate(tool.route);
      return;
    }
    setActiveModel(tool);
    setUserPrompt(tool.demoPrompt || "");
    setAiResponse(null);
    setIsRunning(false);
  };

  const handleRunSimulation = async () => {
    if (!userPrompt.trim()) {
      toast.error("Please enter a prompt or instruction.");
      return;
    }
    if (!activeModel) return;

    setIsRunning(true);
    setAiResponse("");

    try {
      const res = await executeAiModel(activeModel.id, userPrompt, { stream: true });
      
      // Stream tokens progressively chunk by chunk
      streamAiResponse(
        res.response,
        (chunkText) => setAiResponse(chunkText),
        () => {
          setIsRunning(false);
          useAIStore.getState().addLog({
            modelId: activeModel.id,
            modelTitle: activeModel.title,
            category: activeModel.category,
            promptSnippet: userPrompt.slice(0, 50),
            tokensUsed: res.tokensUsed,
            latencyMs: res.latencyMs,
            status: "Success",
          });
          toast.success(`⚡ ${activeModel.title} executed successfully! (${res.latencyMs}ms)`);
        },
        18
      );
    } catch (err: any) {
      setIsRunning(false);
      toast.error(`AI Model Error: ${err.message || "Request failed"}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Pills & Search Controls Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Categories Tab Scroll */}
          <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border/50 overflow-x-auto scrollbar-none max-w-full">
            {AI_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-card text-primary shadow-xs font-bold border border-border/70"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search AI models and tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30 text-xs h-10 border-border/60 rounded-xl"
            />
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-end gap-2 px-1">
          <div className="flex items-center gap-2">
            <Link to="/ai-chat">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8 border-primary/30 text-primary">
                <Bot className="w-3.5 h-3.5" /> AI Copilot Chat
              </Button>
            </Link>
            <Link to="/ai/face-attendance">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8 border-teal-500/30 text-teal-600 dark:text-teal-400">
                <ScanFace className="w-3.5 h-3.5" /> Face Attendance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 71 AI Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod, idx) => {
          const Icon = iconMap[mod.iconName] || Sparkles;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.015, 0.3), duration: 0.2 }}
            >
              <div
                onClick={() => handleOpenTool(mod)}
                className="group block h-full p-4 sm:p-5 rounded-2xl glass-card border border-border/60 bg-card hover:border-primary/50 transition-all duration-200 shadow-xs relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md"
              >
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold bg-secondary/80 text-foreground border-border/60"
                    >
                      {mod.badge}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border/30 flex items-center justify-between text-xs font-semibold text-primary relative z-10">
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                    {mod.category}
                  </span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{mod.route ? "Open Page" : "Launch Tool"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
          <Brain className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <h4 className="font-bold text-sm text-foreground">No AI Models Found</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      )}

      {/* REUSABLE DOMAIN-TAILORED AI WORKSPACE MODAL */}
      <AIModelWorkspaceModal
        model={activeModel}
        onClose={() => setActiveModel(null)}
      />
    </div>
  );
}
