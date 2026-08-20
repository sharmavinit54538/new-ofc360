import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Star, Eye, MessageSquare, FileText, Sparkles, Send, Tag, Phone, Mail, MapPin, Building, Award, ChevronDown, ChevronUp, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRecruitmentCandidatesQuery } from "@/services/api/recruitmentApi";
import type { BackendCandidateListItem } from "@/services/api/recruitmentApi";
import { useCandidateRanking } from "@/hooks/useCandidateRanking";
import type { CandidateRankScore } from "@/types/ranking";
import { toast } from "sonner";

// ── Stage badge colors ─────────────────────────────────────────────────
type StageKey = "Applied" | "Screening" | "Shortlisted" | "Interview" | "Technical" | "HR" | "Offer" | "Hired";

const stageColors: Record<string, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Screening: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Shortlisted: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Interview: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Technical: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  HR: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Offer: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hired: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  APPLIED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
};

// ── AI Ranking dimension keys & labels ──────────────────────────────────
const RANK_DIMENSIONS: { key: string; label: string }[] = [
  { key: "skills_score", label: "Skills Fit" },
  { key: "experience_score", label: "Experience" },
  { key: "semantic_similarity_score", label: "Semantic Match" },
  { key: "projects_score", label: "Projects" },
  { key: "culture_fit_score", label: "Culture Fit" },
  { key: "education_score", label: "Education" },
  { key: "career_growth_score", label: "Career Growth" },
  { key: "stability_score", label: "Stability" },
  { key: "leadership_score", label: "Leadership" },
  { key: "certifications_score", label: "Certifications" },
];

// ── Component Props ─────────────────────────────────────────────────────
interface CandidateDirectoryProps {
  jobId?: string;
}

export function CandidateDirectory({ jobId }: CandidateDirectoryProps = {}) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // ── Real backend: fetch candidates ────────────────────────────────────
  const {
    data: candidatesData,
    isLoading: isLoadingCandidates,
    isFetching: isFetchingCandidates,
  } = useGetRecruitmentCandidatesQuery({
    search: search || undefined,
    status: stageFilter !== "ALL" ? stageFilter : undefined,
    page,
    limit: 50,
  });

  const candidates: BackendCandidateListItem[] = candidatesData?.items ?? [];
  const totalCandidates = candidatesData?.total ?? 0;

  // ── AI Ranking hook ───────────────────────────────────────────────────
  const {
    runRanking,
    rankResult,
    isRanking,
    isRankError,
    rankError,
    topRanked,
    isLoadingTopRanked,
  } = useCandidateRanking(jobId ?? "", 50);

  // ── Show ranking error via toast ──────────────────────────────────────
  useEffect(() => {
    if (isRankError && rankError) {
      const errMsg = "message" in (rankError as any)
        ? (rankError as any).message
        : "data" in (rankError as any)
          ? JSON.stringify((rankError as any).data)
          : "AI ranking failed. Please try again.";
      toast.error(errMsg);
    }
  }, [isRankError, rankError]);

  // ── Build rank map from latest result (mutation result or cached topRanked) ──
  const rankMap = useMemo(() => {
    const map = new Map<string, CandidateRankScore>();

    // Prefer fresh mutation result
    if (rankResult?.ranked_candidates) {
      for (const rc of rankResult.ranked_candidates) {
        map.set(rc.candidate_id, rc);
      }
    }
    // Fallback to cached topRanked query
    else if (topRanked?.ranked_candidates) {
      for (const rc of topRanked.ranked_candidates) {
        if (rc.candidate_id) {
          map.set(rc.candidate_id, {
            candidate_id: rc.candidate_id,
            candidate_name: rc.candidate_name ?? "",
            rank: rc.rank,
            overall_score: rc.overall_match_score,
            skills_score: rc.skill_match_score,
            experience_score: rc.experience_match_score,
            projects_score: 0,
            certifications_score: 0,
            semantic_similarity_score: 0,
            culture_fit_score: 0,
            education_score: 0,
            career_growth_score: 0,
            stability_score: 0,
            leadership_score: 0,
            score_explanations: {},
          });
        }
      }
    }

    return map;
  }, [rankResult, topRanked]);

  // ── Sort candidates by rank if ranked ─────────────────────────────────
  const sortedCandidates = useMemo(() => {
    if (rankMap.size === 0) return candidates;

    return [...candidates].sort((a, b) => {
      const ra = rankMap.get(a.candidate_id);
      const rb = rankMap.get(b.candidate_id);
      if (ra && rb) return ra.rank - rb.rank;
      if (ra) return -1;
      if (rb) return 1;
      return 0;
    });
  }, [candidates, rankMap]);

  const selectedCandidate = sortedCandidates.find((c) => c.candidate_id === selectedCandidateId);
  const selectedRank = selectedCandidateId ? rankMap.get(selectedCandidateId) : null;

  // ── handleRank ────────────────────────────────────────────────────────
  const handleRank = async () => {
    const resumeDocIds = candidates
      .map((c) => c.resume_document_id)
      .filter(Boolean) as string[];

    if (resumeDocIds.length === 0) {
      toast.error("No parsed resumes found for this job's candidates.");
      return;
    }

    try {
      await runRanking(resumeDocIds, { top_n: 50 });
      toast.success("AI ranking completed!");
    } catch {
      // error already handled by useEffect above
    }
  };

  // ── Initials helper ───────────────────────────────────────────────────
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* ── Header with Search, Filter & AI Rank Button ─────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name, role, or skill..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={stageFilter} onValueChange={(v) => { setStageFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Pipeline Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Stages</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="UNDER_REVIEW">Screening</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
              <SelectItem value="INTERVIEW_SCHEDULED">Interview</SelectItem>
              <SelectItem value="INTERVIEW_COMPLETED">Technical</SelectItem>
              <SelectItem value="SELECTED">HR</SelectItem>
              <SelectItem value="OFFER_SENT">Offer</SelectItem>
              <SelectItem value="HIRED">Hired</SelectItem>
            </SelectContent>
          </Select>

          {jobId && (
            <Button
              onClick={handleRank}
              disabled={isRanking || isLoadingCandidates}
              className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
            >
              {isRanking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isRanking ? "Ranking..." : "AI Rank Candidates"}
            </Button>
          )}
        </div>
      </div>

      {/* ── Ranking result banner ──────────────────────────────────── */}
      {rankResult && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
          <Trophy className="w-5 h-5 text-violet-400" />
          <span className="text-sm text-violet-300 font-medium">
            AI ranked {rankResult.total_candidates} candidates • Top {rankResult.top_n} shown • Model: {rankResult.model_used}
          </span>
        </div>
      )}

      {/* ── Loading skeleton ───────────────────────────────────────── */}
      {(isLoadingCandidates || isRanking) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-1.5 w-full" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Candidate Grid ─────────────────────────────────────────── */}
      {!isLoadingCandidates && !isRanking && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCandidates.map((c) => {
            const rank = rankMap.get(c.candidate_id);

            return (
              <div
                key={c.candidate_id}
                onClick={() => setSelectedCandidateId(c.candidate_id)}
                className={`glass-card-hover rounded-xl p-5 border cursor-pointer transition-all space-y-3 ${
                  selectedCandidateId === c.candidate_id ? "border-primary ring-1 ring-primary" : "border-border/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* Rank badge */}
                    {rank && (
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[11px] font-black text-white shadow-md shadow-amber-500/30">
                          #{rank.rank}
                        </div>
                      </div>
                    )}

                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center font-bold text-sm text-primary-foreground">
                      {getInitials(c.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base hover:text-primary transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{c.job_title ?? c.current_role ?? "Candidate"}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] border ${stageColors[c.status] ?? stageColors.Applied}`}>
                    {c.status}
                  </Badge>
                </div>

                {/* AI Score — rank overall_score or fallback to ats_score */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">
                    {rank ? "AI Rank Score" : "ATS Match Score"}
                  </span>
                  <span className="font-bold text-primary">
                    {rank ? `${Math.round(rank.overall_score * 100)}%` : `${Math.round(c.ats_score)}%`}
                  </span>
                </div>
                <Progress
                  value={rank ? rank.overall_score * 100 : c.ats_score}
                  className="h-1.5"
                />

                {/* Quick meta pills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {c.current_company && (
                    <Badge variant="secondary" className="text-[10px]">
                      {c.current_company}
                    </Badge>
                  )}
                  {c.years_experience > 0 && (
                    <Badge variant="outline" className="text-[10px]">
                      {c.years_experience}y exp
                    </Badge>
                  )}
                  {c.location && (
                    <Badge variant="outline" className="text-[10px]">
                      {c.location}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!isLoadingCandidates && !isRanking && sortedCandidates.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h3 className="font-semibold text-lg">No candidates found</h3>
          <p className="text-sm text-muted-foreground">Upload resumes or adjust your filters.</p>
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────────────── */}
      {totalCandidates > 50 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground self-center">
            Page {page} of {Math.ceil(totalCandidates / 50)}
          </span>
          <Button variant="outline" size="sm" disabled={page >= Math.ceil(totalCandidates / 50)} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}

      {/* ── 360° Candidate Profile Drawer / Sheet ──────────────────── */}
      <Sheet open={Boolean(selectedCandidateId)} onOpenChange={(open) => !open && setSelectedCandidateId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto space-y-6">
          {selectedCandidate && (
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-4">
                  {selectedRank && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-amber-500/30">
                      #{selectedRank.rank}
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center font-bold text-xl text-primary-foreground shadow-lg">
                    {getInitials(selectedCandidate.name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedCandidate.job_title ?? selectedCandidate.current_role ?? "Candidate"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs border ${stageColors[selectedCandidate.status] ?? ""}`}>
                        {selectedCandidate.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs font-mono">
                        ID: {selectedCandidate.candidate_id.slice(0, 8)}…
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-secondary/30 p-3 rounded-xl border border-border/40">
                {selectedCandidate.email && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.email}
                  </div>
                )}
                {selectedCandidate.phone && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.phone}
                  </div>
                )}
                {selectedCandidate.location && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.location}
                  </div>
                )}
                {selectedCandidate.current_company && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Building className="w-3.5 h-3.5 text-primary" /> {selectedCandidate.current_company}
                  </div>
                )}
              </div>

              {/* Tabs: AI Ranking Breakdown / Overview */}
              <Tabs defaultValue={selectedRank ? "ai-ranking" : "overview"} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="ai-ranking" disabled={!selectedRank}>
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Ranking
                  </TabsTrigger>
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 pt-4 text-xs">
                  <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> ATS Match Score
                      </span>
                      <span className="font-bold text-sm text-primary">{Math.round(selectedCandidate.ats_score)}%</span>
                    </div>
                    <Progress value={selectedCandidate.ats_score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/30 p-3 rounded-lg border border-border/30">
                      <p className="text-muted-foreground">Experience</p>
                      <p className="font-bold text-sm">{selectedCandidate.years_experience} years</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg border border-border/30">
                      <p className="text-muted-foreground">Match Tier</p>
                      <p className="font-bold text-sm">{selectedCandidate.match_tier}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* AI Ranking Breakdown Tab */}
                <TabsContent value="ai-ranking" className="space-y-4 pt-4 text-xs">
                  {selectedRank && (
                    <>
                      {/* Overall Score Hero */}
                      <div className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-5 rounded-xl border border-violet-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-violet-400 flex items-center gap-1.5">
                            <Trophy className="w-4 h-4" /> AI Overall Score
                          </span>
                          <span className="font-black text-2xl text-violet-300">
                            {Math.round(selectedRank.overall_score * 100)}%
                          </span>
                        </div>
                        <Progress value={selectedRank.overall_score * 100} className="h-2.5" />
                      </div>

                      {/* 10 Dimension Breakdown */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-sm flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-primary" /> Score Breakdown (10 Dimensions)
                        </h4>

                        {RANK_DIMENSIONS.map(({ key, label }) => {
                          const score = (selectedRank as any)[key] ?? 0;
                          const explanation = selectedRank.score_explanations?.[key] ?? "";
                          const isExpanded = expandedBreakdown === key;

                          return (
                            <div key={key} className="bg-secondary/20 rounded-lg border border-border/30 overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedBreakdown(isExpanded ? null : key);
                                }}
                                className="w-full p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="font-medium text-sm w-32 text-left">{label}</span>
                                  <div className="flex-1">
                                    <Progress value={score * 100} className="h-1.5" />
                                  </div>
                                  <span className="font-bold text-sm w-12 text-right">
                                    {Math.round(score * 100)}%
                                  </span>
                                </div>
                                {explanation && (
                                  isExpanded
                                    ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                                    : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-2" />
                                )}
                              </button>
                              {isExpanded && explanation && (
                                <div className="px-3 pb-3 text-muted-foreground text-xs leading-relaxed border-t border-border/20 pt-2">
                                  {explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Resume Tab */}
                <TabsContent value="resume" className="pt-4">
                  <div className="border border-border/50 rounded-xl p-8 bg-slate-950/60 text-center space-y-3">
                    <FileText className="w-12 h-12 text-primary mx-auto opacity-75" />
                    <h4 className="font-bold text-sm">Resume Document</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Parsed resume for {selectedCandidate.name}.
                      {selectedCandidate.resume_document_id && (
                        <span className="block mt-1 font-mono text-[10px]">
                          Doc ID: {selectedCandidate.resume_document_id}
                        </span>
                      )}
                    </p>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Download Original PDF
                    </Button>
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
