import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  Bot,
  Zap,
  ArrowRight,
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
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AI_CATEGORIES, type AIToolItem, type AICategory } from "@/types/ai";
import { AIModelWorkspaceModal } from "@/components/intelligence/AIModelWorkspaceModal";
import { executeAiModel, streamAiResponse } from "@/utils/aiModelRouter";
import { useAIStore } from "@/stores/aiStore";
import { useGetAiModelsQuery } from "@/services/api/intelligenceApi";
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

  const { data: serverModels, isLoading, isError, refetch } = useGetAiModelsQuery();

  // Interactive Live Simulator State
  const [activeModel, setActiveModel] = useState<AIToolItem | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Map server AI models or fallback array
  const allModels: AIToolItem[] = useMemo(() => {
    if (!serverModels || !Array.isArray(serverModels)) return [];
    return serverModels.map((m) => ({
      id: m.id || m.code,
      title: m.name,
      category: (m.category === "workforce"
        ? "Workforce & Shift AI"
        : m.category === "talent"
        ? "Employee AI"
        : m.category === "recruitment"
        ? "Recruitment AI"
        : m.category === "compliance"
        ? "Compliance & Legal AI"
        : m.category === "performance"
        ? "Performance & OKR AI"
        : "Analytics & Predictive AI") as Exclude<AICategory, "ALL">,
      description: m.description,
      badge: m.status.toUpperCase(),
      iconName: "Bot",
      demoPrompt: `Execute ${m.name} analysis`,
      defaultOutput: `AI Model ${m.name} execution completed with accuracy score of ${m.accuracy || 95}%.`,
    }));
  }, [serverModels]);

  const filteredModules = useMemo(() => {
    return allModels.filter((mod) => {
      const matchesSearch =
        mod.title.toLowerCase().includes(search.toLowerCase()) ||
        mod.description.toLowerCase().includes(search.toLowerCase()) ||
        mod.badge.toLowerCase().includes(search.toLowerCase()) ||
        mod.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "ALL" || mod.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allModels, search, activeCategory]);

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
      const res = await executeAiModel(activeModel, userPrompt, { stream: true });

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

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search AI models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border/70 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading AI models from backend...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Failed to connect to Intelligence API.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredModules.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
          <Bot className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground">No AI Models Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {search || activeCategory !== "ALL"
              ? "No AI models matched your search or category filter."
              : "No active models registered in the intelligence repository."}
          </p>
        </div>
      )}

      {/* Grid of AI Models */}
      {!isLoading && !isError && filteredModules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredModules.map((mod) => {
            const IconComponent = iconMap[mod.iconName] || Bot;
            return (
              <motion.div
                key={mod.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border/50">
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {mod.category}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-xs text-primary group-hover:translate-x-0.5 transition-transform"
                    onClick={() => handleOpenTool(mod)}
                  >
                    Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Simulator Modal */}
      {activeModel && (
        <Dialog open={!!activeModel} onOpenChange={(open) => !open && setActiveModel(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {activeModel.title}
              </DialogTitle>
              <DialogDescription>{activeModel.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Input Prompt / Context
                </label>
                <Textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Enter context, question, or input data..."
                  rows={4}
                  className="text-sm"
                />
              </div>

              {aiResponse !== null && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    Generated Model Output
                  </label>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/70 text-sm whitespace-pre-wrap font-mono text-foreground min-h-[100px]">
                    {aiResponse || (
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Generating response...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setActiveModel(null)}>
                Close
              </Button>
              <Button onClick={handleRunSimulation} disabled={isRunning}>
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Running...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" /> Execute Model
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
