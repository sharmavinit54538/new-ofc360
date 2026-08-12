import { useState } from "react";
import { Search, Filter, Star, Eye, MessageSquare, FileText, Sparkles, Send, Tag, Phone, Mail, MapPin, Building, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useATSStore } from "@/stores/atsStore";
import { Candidate, CandidateStage } from "@/types/ats";
import { toast } from "sonner";

const stageColors: Record<CandidateStage, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Screening: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Tech Interview": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Culture Round": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Offer Extended": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hired: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20"
};

export function CandidateDirectory() {
  const { candidates, selectedCandidateId, setSelectedCandidateId, updateCandidateStage, addCandidateNote } = useATSStore();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [newNoteText, setNewNoteText] = useState("");

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const filtered = candidates.filter((c) => {
    const nameMatch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const stageMatch = stageFilter === "ALL" || c.stage === stageFilter;
    return nameMatch && stageMatch;
  });

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedCandidate) return;
    addCandidateNote(selectedCandidate.id, newNoteText, "HR Recruiter");
    toast.success("Internal note added to candidate timeline!");
    setNewNoteText("");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name, role, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Pipeline Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Stages</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Screening">Screening</SelectItem>
            <SelectItem value="Tech Interview">Tech Interview</SelectItem>
            <SelectItem value="Culture Round">Culture Round</SelectItem>
            <SelectItem value="Offer Extended">Offer Extended</SelectItem>
            <SelectItem value="Hired">Hired</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Candidate List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCandidateId(c.id)}
            className={`glass-card-hover rounded-xl p-5 border cursor-pointer transition-all space-y-3 ${
              selectedCandidateId === c.id ? "border-primary ring-1 ring-primary" : "border-border/50"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold text-sm text-primary-foreground">
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-base hover:text-primary transition-colors">
                    {c.firstName} {c.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground">{c.jobTitle}</p>
                </div>
              </div>
              <Badge className={`text-[10px] border ${stageColors[c.stage]}`}>{c.stage}</Badge>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">AI Match Score</span>
              <span className="font-bold text-primary">{c.aiMatchScore}%</span>
            </div>
            <Progress value={c.aiMatchScore} className="h-1.5" />

            <div className="flex flex-wrap gap-1 pt-1">
              {c.skills.slice(0, 3).map((s) => (
                <Badge key={s} variant="secondary" className="text-[10px]">
                  {s}
                </Badge>
              ))}
              {c.skills.length > 3 && (
                <Badge variant="outline" className="text-[10px]">
                  +{c.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 360° Candidate Profile Drawer / Sheet */}
      <Sheet open={Boolean(selectedCandidateId)} onOpenChange={(open) => !open && setSelectedCandidateId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto space-y-6">
          {selectedCandidate && (
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center font-bold text-xl text-primary-foreground shadow-lg">
                    {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.jobTitle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs border ${stageColors[selectedCandidate.stage]}`}>{selectedCandidate.stage}</Badge>
                      <Badge variant="outline" className="text-xs font-mono">ID: {selectedCandidate.id}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-xl border border-border/40">
                <div className="flex items-center gap-1.5 text-muted-foreground"><Mail className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.email}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.phone}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.location}</div>
                <div className="flex items-center gap-1.5 text-muted-foreground"><Building className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.currentCompany || "N/A"}</div>
              </div>

              {/* Tabs for Resume / AI Fit / Timeline */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview & AI Fit</TabsTrigger>
                  <TabsTrigger value="resume">Split PDF Resume</TabsTrigger>
                  <TabsTrigger value="notes">Timeline & Notes ({selectedCandidate.notes.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4 text-xs">
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> AI Resume Intelligence Score
                      </span>
                      <span className="font-bold text-sm text-primary">{selectedCandidate.aiMatchScore}%</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{selectedCandidate.aiSummary}</p>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2 text-sm">Extracted Skill Matrix</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((s) => (
                        <Badge key={s} variant="outline" className="bg-secondary/40 text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resume" className="pt-4">
                  <div className="border border-border/50 rounded-xl p-8 bg-slate-950/60 text-center space-y-3">
                    <FileText className="w-12 h-12 text-primary mx-auto opacity-75" />
                    <h4 className="font-bold text-sm">Resume Previewer Overlay</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Parsed resume document for {selectedCandidate.firstName} {selectedCandidate.lastName}.
                    </p>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Download Original PDF
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an internal note or @mention HR colleague..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="text-xs"
                    />
                    <Button size="sm" onClick={handleAddNote} className="gap-1">
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {selectedCandidate.notes.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No internal notes added yet.</p>
                    ) : (
                      selectedCandidate.notes.map((n) => (
                        <div key={n.id} className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-xs space-y-1">
                          <div className="flex justify-between font-semibold">
                            <span className="text-primary">{n.author}</span>
                            <span className="text-muted-foreground text-[10px]">{n.timestamp}</span>
                          </div>
                          <p className="text-muted-foreground">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
