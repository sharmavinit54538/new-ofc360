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
  X,
  Cpu,
  Server,
  Network,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AI_CATEGORIES,
  type AICapability,
  type AICategory,
  OFC360_AI_ENGINE,
  OFC360_AI_CAPABILITIES,
} from "@/types/ai";
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
  Cpu,
  Server,
  Network,
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
  const [activeCapability, setActiveCapability] = useState<AICapability | null>(null);

  // Query server endpoints with graceful offline fallback
  const { data: serverModels, isLoading } = useGetAiModelsQuery();

  // Normalize server response into canonical OFC360 capabilities
  const capabilities: AICapability[] = useMemo(() => {
    if (serverModels && Array.isArray(serverModels) && serverModels.length > 0) {
      const mappedServerCapabilities: AICapability[] = serverModels.map((m) => {
        const matchingPreset = OFC360_AI_CAPABILITIES.find(
          (p) => p.id === m.id || p.id === (m as any).code || p.title.toLowerCase() === m.name.toLowerCase()
        );
        return {
          id: m.id || (m as any).code,
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
          description: m.description || matchingPreset?.description || "Intelligent OFC360 enterprise capability.",
          taskType: (m as any).taskType || matchingPreset?.taskType || "task",
          badge: (m as any).status?.toUpperCase() || matchingPreset?.badge || "ACTIVE",
          engine: "ofc360-ai",
          iconName: matchingPreset?.iconName || "Bot",
          route: matchingPreset?.route,
          demoPrompt: matchingPreset?.demoPrompt || `Execute ${m.name} capability`,
          defaultOutput: matchingPreset?.defaultOutput || `OFC360 AI executed ${m.name} with 95% confidence score.`,
        };
      });

      const existingIds = new Set(mappedServerCapabilities.map((m) => m.id));
      const remainingPresets = OFC360_AI_CAPABILITIES.filter((p) => !existingIds.has(p.id));
      return [...mappedServerCapabilities, ...remainingPresets];
    }
    return OFC360_AI_CAPABILITIES;
  }, [serverModels]);

  // Filter capabilities by search keyword & active category
  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((cap) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        cap.title.toLowerCase().includes(term) ||
        cap.description.toLowerCase().includes(term) ||
        cap.badge.toLowerCase().includes(term) ||
        cap.category.toLowerCase().includes(term);

      const matchesCategory =
        activeCategory === "ALL" || cap.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [capabilities, search, activeCategory]);

  // Capability count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: capabilities.length };
    for (const cap of capabilities) {
      counts[cap.category] = (counts[cap.category] || 0) + 1;
    }
    return counts;
  }, [capabilities]);

  const handleOpenCapability = (cap: AICapability) => {
    if (cap.route) {
      navigate(cap.route);
      return;
    }
    setActiveCapability(cap);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HERO & CANONICAL ENGINE BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Hero Title */}
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>One AI Model — All Capabilities</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              OFC360 AI
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              One intelligent AI engine powering every workflow across OFC360.
            </p>
          </div>

          {/* Right AI Engine Spec Card */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border/70 backdrop-blur-sm space-y-3 min-w-[280px] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shadow-xs">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{OFC360_AI_ENGINE.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">1 Core AI Engine</div>
                </div>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {OFC360_AI_ENGINE.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
              <div>
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-semibold text-foreground ml-1">{OFC360_AI_ENGINE.provider}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Model:</span>
                <span className="font-mono font-semibold text-primary ml-1">{OFC360_AI_ENGINE.model}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-primary" /> Architecture
              </span>
              <span className="font-mono text-[10px] font-medium text-foreground">
                OFC360 AI → Ollama → qwen3:30b
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Categories Tab Scroll */}
          <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border/50 overflow-x-auto scrollbar-none max-w-full">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "ALL"
                  ? "bg-card text-primary shadow-xs font-bold border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <span>ALL — 1 AI ENGINE</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeCategory === "ALL"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {categoryCounts.ALL || capabilities.length}
              </span>
            </button>

            {AI_CATEGORIES.filter((c) => c !== "ALL").map((cat) => {
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
              placeholder="Search AI capabilities, tasks..."
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

      {/* 3. LOADING STATE */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting to OFC360 AI engine...</p>
        </div>
      )}

      {/* 4. EMPTY STATE */}
      {!isLoading && filteredCapabilities.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/40 space-y-3">
          <Brain className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No AI Capabilities Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search
              ? `No capabilities matching "${search}" in ${activeCategory}. Try clearing your search.`
              : "No capabilities available in this category."}
          </p>
          {search && (
            <Button size="sm" variant="outline" onClick={() => setSearch("")} className="mt-2 text-xs">
              Clear Search Filter
            </Button>
          )}
        </div>
      )}

      {/* 5. GRID OF AI CAPABILITIES */}
      {!isLoading && filteredCapabilities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCapabilities.map((cap, idx) => {
              const IconComponent = iconMap[cap.iconName] || Bot;
              const colorInfo = categoryColors[cap.category] || {
                bg: "bg-primary/10",
                border: "border-primary/20",
                text: "text-primary",
                lightBg: "bg-primary/15",
              };

              return (
                <motion.div
                  key={cap.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.012, 0.25), duration: 0.2 }}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  onClick={() => handleOpenCapability(cap)}
                >
                  <div className="space-y-3">
                    {/* Header Badges: Status + Engine */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${colorInfo.bg} ${colorInfo.text} border ${colorInfo.border} group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="text-[9px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground border border-border/60"
                        >
                          {cap.badge}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[9px] font-mono border-primary/30 text-primary bg-primary/5"
                        >
                          OFC360 AI
                        </Badge>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Category + Powered By + Action */}
                  <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-foreground truncate max-w-[130px]">
                        {cap.category}
                      </div>
                      <div className="text-[9px] text-muted-foreground font-mono">
                        Powered by OFC360 AI
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-primary group-hover:translate-x-0.5 transition-transform font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCapability(cap);
                      }}
                    >
                      {cap.route ? "Open Page" : "Open Capability"} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* 6. INTERACTIVE DOMAIN-TAILORED AI WORKSPACE MODAL */}
      <AIModelWorkspaceModal
        model={activeCapability}
        onClose={() => setActiveCapability(null)}
      />
    </div>
  );
}
