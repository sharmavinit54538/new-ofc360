import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  Star,
  Calendar,
  Search,
  Plus,
  Filter,
  UserCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Heart,
  Gift,
  FileCheck2,
  Users
} from "lucide-react";
import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceFeatureCard } from "@/components/talent-intelligence/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/components/talent-intelligence/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useAuthStore } from "@/stores/authStore";
import { useTimelineStore } from "@/stores/timelineStore";
import { type TimelineCategory, type TimelineEvent } from "@/utils/timelineEngine";
import { toast } from "sonner";

const categoryCards = [
  {
    title: "Career Milestones",
    description: "Chronological timeline of role advancements, promotions, team transitions, and job titles.",
    icon: TrendingUp,
    category: "Career" as TimelineCategory,
  },
  {
    title: "Recognition & Kudos",
    description: "Peer-to-peer appreciation badges, manager spot awards, and quarterly star honors.",
    icon: Award,
    category: "Recognition" as TimelineCategory,
  },
  {
    title: "Work Anniversaries",
    description: "Service milestone recognitions, tenure anniversaries, and loyalty awards.",
    icon: Calendar,
    category: "Anniversaries" as TimelineCategory,
  },
  {
    title: "Project Achievements",
    description: "Highlights of successful product launches, critical sprints, and business deliverables.",
    icon: Star,
    category: "Projects" as TimelineCategory,
  },
  {
    title: "Skill Growth Log",
    description: "Validated competencies acquired during training programs and certifications.",
    icon: Sparkles,
    category: "Skills" as TimelineCategory,
  },
  {
    title: "Activity Audit History",
    description: "Historical log of organizational changes, performance reviews, and compensation updates.",
    icon: Clock,
    category: "Audit" as TimelineCategory,
  },
];

export default function EmployeeTimelinePage() {
  const { user } = useAuthStore();
  const { employees } = useEmployeeStore();
  const {
    events,
    addEvent,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    getEventsForEmployee,
  } = useTimelineStore();

  // Employee Selection State (defaults to current user or first employee)
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    user?.id || employees[0]?.id || "EMP-101"
  );

  // Add Recognition / Milestone Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TimelineCategory>("Recognition");
  const [newDescription, setNewDescription] = useState("");
  const [newGivenBy, setNewGivenBy] = useState(user?.name || "Manager");
  const [newBadge, setNewBadge] = useState("Spot Award");

  const selectedEmployee =
    employees.find((e) => e.id === selectedEmpId) ||
    employees[0] || {
      id: "EMP-101",
      name: user?.name || "Alex Mercer",
      department: "Engineering",
      joiningDate: "2024-01-10",
    };

  // Get aggregated timeline events for selected employee
  const employeeEvents = getEventsForEmployee(
    selectedEmployee.id,
    selectedEmployee.joiningDate || "2024-01-10",
    selectedEmployee.name
  );

  // Filter events by Category and Search Query
  const filteredEvents = employeeEvents.filter((ev) => {
    const matchesCategory =
      selectedCategory === "ALL" || ev.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.badge && ev.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ev.details?.projectName && ev.details.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ev.details?.skillName && ev.details.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Submit New Recognition/Milestone Event
  const handleAddEvent = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Please enter event title and description.");
      return;
    }

    addEvent({
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      category: newCategory,
      title: newTitle,
      date: new Date().toISOString().split("T")[0],
      badge: newBadge,
      description: newDescription,
      details: {
        givenBy: newGivenBy,
        actor: user?.name || "HR Admin",
      },
    });

    setIsModalOpen(false);
    setNewTitle("");
    setNewDescription("");
    toast.success(`⚡ ${newCategory} event recorded for ${selectedEmployee.name}!`);
  };

  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">
        {/* TOP BAR: EMPLOYEE SELECTOR & ACTION BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-3xl border border-border/60 bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Employee Timeline Context</span>
              <div className="flex items-center gap-2">
                <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                  <SelectTrigger className="w-64 bg-secondary/30 text-xs font-bold h-8 border-border/60 rounded-xl">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id} className="text-xs">
                        {e.name} ({e.department} - {e.designation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  {selectedEmployee.department}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="gradient-bg text-primary-foreground text-xs font-bold h-9 px-4 rounded-xl gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Grant Kudos / Record Event
            </Button>
          </div>
        </div>

        {/* 6 MODULE FEATURE CARDS (CLICKABLE CATEGORY FILTERS) */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center justify-between">
            <span>Timeline Modules</span>
            {selectedCategory !== "ALL" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedCategory("ALL")}
                className="h-6 text-[11px] text-primary"
              >
                Clear Category Filter ({selectedCategory})
              </Button>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryCards.map((card) => {
              const isSelected = selectedCategory === card.category;
              return (
                <div
                  key={card.title}
                  onClick={() => setSelectedCategory(isSelected ? "ALL" : card.category)}
                  className={`cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-primary ring-offset-2 scale-[1.01]" : ""
                  }`}
                >
                  <TalentIntelligenceFeatureCard
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    category={card.category}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* MASTER TIMELINE SECTION WITH SEARCH & CHRONOLOGICAL STREAM */}
        <TalentIntelligenceSection
          title={`Master Timeline Progression — ${selectedEmployee.name}`}
          description={`Comprehensive chronological history of milestones, kudos awards, project launches, and skill development (${filteredEvents.length} events).`}
        >
          {/* SEARCH & CATEGORY CHIPS */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search milestones, projects, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary/30 text-xs h-9 border-border/60 rounded-xl"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 bg-secondary/40 p-1 rounded-2xl border border-border/50">
                {(["ALL", "Career", "Recognition", "Anniversaries", "Projects", "Skills", "Audit"] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-card text-primary shadow-xs border border-border/60"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* TIMELINE EVENT CHRONOLOGICAL STREAM */}
            {filteredEvents.length === 0 ? (
              <TalentIntelligenceEmptyState
                title={`No ${selectedCategory === "ALL" ? "" : selectedCategory} Timeline Events Found`}
                description={`No activity recorded for ${selectedEmployee.name} under ${selectedCategory}. Record a new milestone or clear your search filters.`}
                moduleName={selectedCategory}
              />
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                {filteredEvents.map((ev) => (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative glass-card p-5 rounded-2xl border border-border/60 bg-card space-y-2.5 shadow-xs"
                  >
                    {/* Timeline Event Node Bullet */}
                    <div className="absolute -left-6 top-5 w-4 h-4 rounded-full gradient-bg ring-4 ring-background flex items-center justify-center text-primary-foreground text-[8px] font-bold">
                      •
                    </div>

                    {/* Event Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            ev.category === "Career"
                              ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold"
                              : ev.category === "Recognition"
                              ? "bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold"
                              : ev.category === "Projects"
                              ? "bg-purple-500/15 text-purple-500 border-purple-500/30 text-[10px] font-bold"
                              : "bg-primary/15 text-primary border-primary/30 text-[10px] font-bold"
                          }
                        >
                          {ev.category}
                        </Badge>
                        {ev.badge && (
                          <Badge variant="secondary" className="text-[10px] font-mono">
                            {ev.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {ev.date}
                      </span>
                    </div>

                    {/* Event Title & Description */}
                    <div>
                      <h4 className="text-sm font-extrabold text-foreground">{ev.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">{ev.description}</p>
                    </div>

                    {/* Domain Specific Details */}
                    {ev.details && (
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-1">
                        {ev.details.previousRole && ev.details.newRole && (
                          <div className="flex items-center gap-2 text-foreground font-semibold">
                            <span>{ev.details.previousRole}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-emerald-500 font-bold">{ev.details.newRole}</span>
                          </div>
                        )}

                        {ev.details.givenBy && (
                          <div className="text-muted-foreground text-[11px]">
                            Recognized by: <strong className="text-foreground">{ev.details.givenBy}</strong>
                          </div>
                        )}

                        {ev.details.projectName && (
                          <div className="text-muted-foreground text-[11px]">
                            Project Deliverable: <strong className="text-foreground">{ev.details.projectName}</strong>
                          </div>
                        )}

                        {ev.details.skillName && (
                          <div className="text-muted-foreground text-[11px]">
                            Skill Progression: <strong className="text-foreground">{ev.details.skillName}</strong> ({ev.details.previousLevel || "Beginner"} → <span className="text-primary font-bold">{ev.details.newLevel || "Certified"}</span>)
                          </div>
                        )}

                        {ev.details.impact && (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5">
                            ⚡ Business Impact: {ev.details.impact}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TalentIntelligenceSection>

        {/* RECORD NEW EVENT / GRANT KUDOS MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl bg-card border-border/80 p-6 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-extrabold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Record Milestone / Grant Kudos
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add official career milestone, recognition badge, or skill achievement to {selectedEmployee.name}'s profile timeline.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <Select value={newCategory} onValueChange={(val) => setNewCategory(val as TimelineCategory)}>
                  <SelectTrigger className="bg-secondary/30 text-xs h-9 border-border/60 rounded-xl">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Recognition" className="text-xs">Recognition & Kudos</SelectItem>
                    <SelectItem value="Career" className="text-xs">Career Milestone</SelectItem>
                    <SelectItem value="Projects" className="text-xs">Project Achievement</SelectItem>
                    <SelectItem value="Skills" className="text-xs">Skill Growth Log</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Event Title</Label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Spot Honor for Launch Excellence"
                  className="bg-secondary/30 text-xs h-9 border-border/60 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Badge Tag</Label>
                <Input
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  placeholder="e.g. Spot Award / Promotion"
                  className="bg-secondary/30 text-xs h-9 border-border/60 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Description & Citation</Label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the milestone, project impact, or appreciation reason..."
                  className="bg-secondary/30 text-xs border-border/60 rounded-xl resize-none font-sans"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="text-xs h-9 rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleAddEvent} size="sm" className="gradient-bg text-primary-foreground text-xs font-bold h-9 px-4 rounded-xl">
                Record Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TalentIntelligenceLayout>
  );
}
