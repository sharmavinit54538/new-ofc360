import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AI_CATEGORIES, type AIToolItem, type AICategory } from "@/types/ai";
import { ALL_71_AI_MODELS } from "@/data/aiToolsData";
import { AIModelWorkspaceModal } from "@/features/intelligence/components/AIModelWorkspaceModal";
import { useGetAiModelsQuery } from "@/services/api/intelligenceApi";

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

// Category accent colors for cards and badges
const categoryColors: Record<string, { bg: string; border: string; text: string; lightBg: string }> = {
  "Recruitment AI": { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600 dark:text-blue-400", lightBg: "bg-blue-500/15" },
  "Employee AI": { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-600 dark:text-pink-400", lightBg: "bg-pink-500/15" },
  "Workforce & Shift AI": { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-600 dark:text-indigo-400", lightBg: "bg-indigo-500/15" },
  "Performance & OKR AI": { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600 dark:text-amber-400", lightBg: "bg-amber-500/15" },
  "Payroll & Comp AI": { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600 dark:text-emerald-400", lightBg: "bg-emerald-500/15" },
  "Compliance & Legal AI": { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-600 dark:text-purple-400", lightBg: "bg-purple-500/15" },
  "Document Gen AI": { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-600 dark:text-sky-400", lightBg: "bg-sky-500/15" },
  "Meeting Intelligence AI": { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-600 dark:text-violet-400", lightBg: "bg-violet-500/15" },
  "Analytics & Predictive AI": { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-600 dark:text-cyan-400", lightBg: "bg-cyan-500/15" },
  "Knowledge & RAG AI": { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-600 dark:text-orange-400", lightBg: "bg-orange-500/15" },
  "Biometrics & Vision AI": { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-600 dark:text-teal-400", lightBg: "bg-teal-500/15" },
};

export default function IntelligenceLandingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeModel, setActiveModel] = useState<AIToolItem | null>(null);

  // Query server models with graceful offline fallback
  const { data: serverModels, isLoading, isError, refetch } = useGetAiModelsQuery();

  // Combine server AI models with built-in comprehensive catalog
  const allModels: AIToolItem[] = useMemo(() => {
    if (serverModels && Array.isArray(serverModels) && serverModels.length > 0) {
      const mappedServerModels: AIToolItem[] = serverModels.map((m) => {
        const matchingPreset = ALL_71_AI_MODELS.find(
          (p) => p.id === m.id || p.id === m.code || p.title.toLowerCase() === m.name.toLowerCase()
        );
        return {
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
            : matchingPreset?.category || "Analytics & Predictive AI") as Exclude<AICategory, "ALL">,
          description: m.description || matchingPreset?.description || "Intelligent OFC360 enterprise AI model.",
          badge: m.status?.toUpperCase() || matchingPreset?.badge || "ACTIVE",
          iconName: matchingPreset?.iconName || "Bot",
          route: matchingPreset?.route,
          demoPrompt: matchingPreset?.demoPrompt || `Execute ${m.name} analysis`,
          defaultOutput: matchingPreset?.defaultOutput || `AI Model ${m.name} execution completed with accuracy score of ${m.accuracy || 95}%.`,
        };
      });

      const existingIds = new Set(mappedServerModels.map((m) => m.id));
      const remainingPresets = ALL_71_AI_MODELS.filter((p) => !existingIds.has(p.id));
      return [...mappedServerModels, ...remainingPresets];
    }
    // Reliable fallback ensuring 100% availability
    return ALL_71_AI_MODELS;
  }, [serverModels]);

  // Filter models by search keyword & active category
  const filteredModules = useMemo(() => {
    return allModels.filter((mod) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        mod.title.toLowerCase().includes(term) ||
        mod.description.toLowerCase().includes(term) ||
        mod.badge.toLowerCase().includes(term) ||
        mod.category.toLowerCase().includes(term);

      const matchesCategory =
        activeCategory === "ALL" || mod.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allModels, search, activeCategory]);

  // Model count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allModels.length };
    for (const model of allModels) {
      counts[model.category] = (counts[model.category] || 0) + 1;
    }
    return counts;
  }, [allModels]);

  const handleOpenTool = (tool: AIToolItem) => {
    if (tool.route) {
      navigate(tool.route);
      return;
    }
    setActiveModel(tool);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">

      {/* FILTER & SEARCH BAR */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Categories Tab Scroll */}
          <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border/50 overflow-x-auto scrollbar-none max-w-full">
            {AI_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-card text-primary shadow-xs font-bold border border-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search 71+ AI models, tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 bg-card border-border/70 text-xs h-10 rounded-xl focus:ring-2 focus:ring-primary/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading AI models repository...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && filteredModules.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/40 space-y-3">
          <Brain className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No AI Models Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search
              ? `No AI models matching "${search}" in ${activeCategory}. Try clearing search.`
              : "No models available in this category."}
          </p>
          {search && (
            <Button size="sm" variant="outline" onClick={() => setSearch("")} className="mt-2 text-xs">
              Clear Search Filter
            </Button>
          )}
        </div>
      )}

      {/* GRID OF AI MODELS */}
      {!isLoading && filteredModules.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredModules.map((mod, idx) => {
              const IconComponent = iconMap[mod.iconName] || Bot;
              const colorInfo = categoryColors[mod.category] || {
                bg: "bg-primary/10",
                border: "border-primary/20",
                text: "text-primary",
                lightBg: "bg-primary/15",
              };

              return (
                <motion.div
                  key={mod.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.012, 0.25), duration: 0.2 }}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  onClick={() => handleOpenTool(mod)}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${colorInfo.bg} ${colorInfo.text} border ${colorInfo.border} group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border/60"
                      >
                        {mod.badge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[140px]">
                      {mod.category}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-primary group-hover:translate-x-0.5 transition-transform font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTool(mod);
                      }}
                    >
                      {mod.route ? "Open Page" : "Launch"} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* INTERACTIVE DOMAIN-TAILORED AI WORKSPACE MODAL */}
      <AIModelWorkspaceModal
        model={activeModel}
        onClose={() => setActiveModel(null)}
      />
    </div>
  );
}
