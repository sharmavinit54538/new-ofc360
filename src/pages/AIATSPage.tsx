import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Download,
  Save,
  Trash2,
  Search,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  ShieldCheck,
  Building2,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Clock,
  Loader2,
  FileCheck2,
  AlertOctagon,
  RefreshCw,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useATSAnalysisStore } from "@/stores/atsAnalysisStore";
import {
  useGetRecruitmentJobsQuery,
  useUploadResumeForScreeningMutation,
  type BackendCandidateScreeningResponse,
} from "@/services/api/recruitmentApi";
import { type ATSAnalysisResult } from "@/utils/atsScoringEngine";
import { toast } from "sonner";

/**
 * Maps the backend CandidateScreeningResponse into the frontend ATSAnalysisResult
 * format so the existing results UI continues to work.
 */
function mapBackendToATSResult(
  backend: BackendCandidateScreeningResponse,
  jobTitle: string,
  jobDepartment: string,
  requiredExperienceYears: number
): ATSAnalysisResult {
  const cd = backend.candidate_details;
  const ab = backend.ats_breakdown;
  const ai = backend.ai_insights;

  const overallScore = Math.round(ab.overall_ats_score);

  let recruiterRecommendation: ATSAnalysisResult["recruiterRecommendation"] = "Strong Match";
  if (overallScore >= 85) recruiterRecommendation = "Strong Match";
  else if (overallScore >= 75) recruiterRecommendation = "Good Match";
  else if (overallScore >= 65) recruiterRecommendation = "Potential Match";
  else if (overallScore >= 50) recruiterRecommendation = "Weak Match";
  else recruiterRecommendation = "Not Recommended";

  const candidateYears = cd.total_experience_years || 0;
  let expMatchLevel: "Strong Match" | "Good Match" | "Partial Match" | "Needs Experience" = "Strong Match";
  if (candidateYears >= requiredExperienceYears) expMatchLevel = "Strong Match";
  else if (candidateYears >= requiredExperienceYears - 1) expMatchLevel = "Good Match";
  else if (candidateYears >= requiredExperienceYears - 2) expMatchLevel = "Partial Match";
  else expMatchLevel = "Needs Experience";

  return {
    id: `ATS-${backend.candidate_id.slice(-6)}`,
    analyzedAt: new Date(backend.created_at).toLocaleString(),
    candidate: {
      candidateName: cd.candidate_name || "Unknown Candidate",
      email: cd.email || "",
      phone: cd.phone || "",
      location: cd.current_location || cd.address || "",
      summary: cd.summary || ai.candidate_summary || "",
      extractedSkills: cd.skills || [],
      technicalSkills: cd.technical_skills || [],
      softSkills: cd.soft_skills || [],
      totalExperienceYears: candidateYears,
      workExperience: (cd.work_history || []).map((w) => ({
        title: w.designation || "Role",
        company: w.company,
        duration: w.duration_months ? `${Math.round(w.duration_months / 12 * 10) / 10} Yrs` : (w.start_date && w.end_date ? `${w.start_date} - ${w.end_date}` : ""),
        highlights: w.description ? [w.description] : [],
      })),
      education: (cd.education || []).map((e) => ({
        degree: e.degree || "",
        institution: e.university || e.college || "",
        year: e.passing_year ? String(e.passing_year) : "",
      })),
      certifications: cd.certifications || [],
      projects: (cd.projects || []).map((p) => p.title),
      formatHealth: {
        contactInfoComplete: !!(cd.email && cd.phone),
        hasSummary: !!(cd.summary && cd.summary.length > 50),
        hasClearHeadings: true,
        fontReadabilityScore: Math.round(ab.formatting_quality || 90),
        atsParsingHealth: backend.quality_analysis.is_valid ? "Good" : "Warning",
        formattingFlags: backend.quality_analysis.issues || [],
      },
    },
    jobTitle,
    jobDepartment,
    requiredExperienceYears,
    overallScore,
    scoreBreakdown: {
      skillsMatchPct: Math.round(ab.skill_match_score),
      experienceMatchPct: Math.round(ab.experience_match_score),
      keywordMatchPct: Math.round(ab.keyword_match_score),
      educationMatchPct: Math.round(ab.education_match_score),
      responsibilitiesMatchPct: Math.round(ab.role_match_score),
      jobTitleMatchPct: Math.round(ab.role_match_score),
      certificationsMatchPct: Math.round(ab.certification_match_score),
    },
    matchedSkills: ab.matched_skills || [],
    missingSkills: ab.missing_skills || [],
    matchedKeywords: ab.matched_skills || [],
    missingKeywords: ab.missing_skills || [],
    keywordCoveragePct: Math.round(ab.keyword_match_score),
    experienceComparison: {
      requiredYears: requiredExperienceYears,
      candidateYears,
      matchLevel: expMatchLevel,
      relevantRoles: (cd.work_history || []).map((w) => `${w.designation || "Role"} at ${w.company}`),
    },
    educationComparison: {
      requiredDegree: "Bachelor's or equivalent",
      candidateDegree: cd.education?.[0]?.degree || "Not specified",
      status: ab.education_match_score >= 70 ? "Match" : ab.education_match_score >= 40 ? "Partial Match" : "Not Found",
    },
    responsibilityComparison: {
      matched: ai.strengths || [],
      partiallyMatched: [],
      missing: ai.weaknesses || [],
    },
    recommendations: [
      ...(ai.missing_skills.length > 0 ? [`Highlight experience with missing skills: ${ai.missing_skills.slice(0, 3).join(", ")}.`] : []),
      ...ai.recommended_interview_questions.slice(0, 2).map((q) => `Interview Question: ${q}`),
      "Ensure section headings use standard ATS keywords.",
    ],
    recruiterRecommendation,
    recruiterSummary: {
      verdict: ai.candidate_summary || `${cd.candidate_name || "Candidate"} is a ${recruiterRecommendation} (${overallScore}/100) for the ${jobTitle} role.`,
      topStrengths: ai.strengths.length > 0 ? ai.strengths.slice(0, 3) : ["Analysis completed successfully."],
      keyGaps: ai.weaknesses.length > 0 ? ai.weaknesses.slice(0, 3) : ["No critical gaps identified."],
      improvementOpportunities: ai.risk_factors.length > 0 ? ai.risk_factors.slice(0, 3) : [
        "Include metric-driven achievement metrics.",
        "Add cloud deployment keywords.",
      ],
    },
  };
}

export default function AIATSPage() {
  const { history, saveAnalysis, deleteAnalysis, setActiveAnalysis } = useATSAnalysisStore();

  // ── Backend Data ──────────────────────────────────────────────────────────
  const { data: jobsData, isLoading: jobsLoading } = useGetRecruitmentJobsQuery({ status: "PUBLISHED", limit: 50 });
  const [uploadResume] = useUploadResumeForScreeningMutation();
  const backendJobs = jobsData?.items || [];

  const [activeTab, setActiveTab] = useState<"analyzer" | "history">("analyzer");
  const [jobInputMode, setJobInputMode] = useState<"select" | "custom">(backendJobs.length > 0 ? "select" : "custom");

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Job Description Inputs
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [customJobTitle, setCustomJobTitle] = useState("");
  const [customDept, setCustomDept] = useState("");
  const [customExpYears, setCustomExpYears] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  // Execution & Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [historySearch, setHistorySearch] = useState("");

  // Selected Job Details
  const selectedJob = backendJobs.find((j) => j.id === selectedJobId) || backendJobs[0];

  // File Upload Handlers
  const validateAndSetFile = (f: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    const ext = f.name.slice(((f.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

    if (!validTypes.includes(f.type) && !["pdf", "docx", "doc"].includes(ext)) {
      setUploadError("Invalid file type. Please upload a PDF or DOCX resume document.");
      toast.error("Only PDF and DOCX files are supported.");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      toast.error("Resume file must be under 10MB.");
      return;
    }

    setFile(f);
    toast.success(`Resume uploaded: ${f.name}`);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // ── Run ATS Analysis via Backend API ──────────────────────────────────────
  const handleAnalyzeResume = async () => {
    if (!file) {
      toast.error("Please upload a candidate resume file first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Build FormData for backend upload
      const formData = new FormData();
      formData.append("file", file);

      // Attach job_id if a real job is selected
      if (jobInputMode === "select" && selectedJob) {
        formData.append("job_id", selectedJob.id);
      }

      // Call backend API: POST /api/v1/recruitment/resume/upload
      const response = await uploadResume(formData).unwrap();

      // Determine job details for display
      const targetTitle = jobInputMode === "select" && selectedJob ? selectedJob.title : (customJobTitle || "General Position");
      const targetDept = jobInputMode === "select" && selectedJob ? selectedJob.department : (customDept || "General");
      const targetExp = jobInputMode === "select" ? 3 : (parseInt(customExpYears) || 3);

      // Map backend response → frontend display format
      const result = mapBackendToATSResult(response, targetTitle, targetDept, targetExp);

      setAnalysisResult(result);
      setIsAnalyzing(false);
      toast.success(`⚡ ATS Analysis complete! Score: ${result.overallScore}/100`);
    } catch (err: any) {
      setIsAnalyzing(false);
      const errMsg = err?.data?.message || err?.data?.detail || err?.message || "ATS Resume analysis failed.";
      toast.error(errMsg);
      console.error("ATS Analysis error:", err);
    }
  };

  const handleSaveToStore = () => {
    if (analysisResult) {
      saveAnalysis(analysisResult);
      toast.success(`Analysis for ${analysisResult.candidate.candidateName} saved to history!`);
    }
  };

  const handleExportReport = (res: ATSAnalysisResult) => {
    const reportText = `
OFC360 ATS RESUME ANALYSIS REPORT
=================================
Candidate Name: ${res.candidate.candidateName}
Email: ${res.candidate.email}
Phone: ${res.candidate.phone}
Target Job Title: ${res.jobTitle}
Overall ATS Score: ${res.overallScore} / 100
Recruiter Recommendation: ${res.recruiterRecommendation}
Analyzed At: ${res.analyzedAt}

SCORE BREAKDOWN:
- Skills Match: ${res.scoreBreakdown.skillsMatchPct}%
- Experience Match: ${res.scoreBreakdown.experienceMatchPct}%
- Keyword Coverage: ${res.scoreBreakdown.keywordMatchPct}%
- Education Match: ${res.scoreBreakdown.educationMatchPct}%
- Responsibilities Match: ${res.scoreBreakdown.responsibilitiesMatchPct}%

MATCHED SKILLS:
${res.matchedSkills.join(", ")}

MISSING SKILLS:
${res.missingSkills.join(", ")}

RECRUITER SUMMARY:
${res.recruiterSummary.verdict}

KEY STRENGTHS:
- ${res.recruiterSummary.topStrengths.join("\n- ")}

RECOMMENDATIONS:
- ${res.recommendations.join("\n- ")}
`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `OFC360_ATS_Report_${res.candidate.candidateName.replace(/\s+/g, "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("ATS Analysis Report exported!");
  };

  const filteredHistory = history.filter(
    (h) =>
      h.candidate.candidateName.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.jobTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.recruiterRecommendation.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Resume ATS Scoring</h1>
          <p className="page-subheader">Upload a resume to get an AI-powered ATS compatibility score</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "analyzer"
                ? "bg-card text-primary shadow-xs font-bold border border-border/70"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ATS Resume Analyzer
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-card text-primary shadow-xs font-bold border border-border/70"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Previous Analyses ({history.length})
          </button>
        </div>
      </div>

      {activeTab === "analyzer" ? (
        <div className={analysisResult || isAnalyzing ? "grid grid-cols-1 lg:grid-cols-12 gap-6" : "max-w-2xl mx-auto space-y-6"}>
          {/* UPLOAD & JOB SELECTION PANEL */}
          <div className={analysisResult || isAnalyzing ? "lg:col-span-5 space-y-6" : "space-y-6"}>
            {/* 1. RESUME UPLOAD CARD */}
            <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-primary" /> Step 1: Upload Candidate Resume
                </span>
                <Badge variant="outline" className="text-[10px]">PDF, DOCX supported</Badge>
              </div>

              {!file ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-[0.99]"
                      : "border-border/80 hover:border-primary/50 bg-secondary/20"
                  }`}
                >
                  <input
                    type="file"
                    id="resume-file-input"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="resume-file-input" className="cursor-pointer space-y-2 block">
                    <FileSearch className="w-10 h-10 mx-auto text-primary/70 mb-2" />
                    <p className="text-sm font-bold text-foreground">Drag & drop candidate resume here</p>
                    <p className="text-xs text-muted-foreground">or click to browse from computer (Max 10MB)</p>
                  </label>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {(file.size / 1024).toFixed(1)} KB • Ready for Parsing
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setFile(null)}
                      className="h-8 text-xs text-rose-500 hover:bg-rose-500/10"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> {uploadError}
                </p>
              )}
            </div>

            {/* 2. JOB DESCRIPTION SELECTION CARD */}
            <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-primary" /> Step 2: Select / Enter Job Description
                </span>
                <div className="flex items-center gap-1 bg-secondary/60 p-1 rounded-xl">
                  <button
                    onClick={() => setJobInputMode("select")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      jobInputMode === "select" ? "bg-card text-primary shadow-xs" : "text-muted-foreground"
                    }`}
                  >
                    Select Job
                  </button>
                  <button
                    onClick={() => setJobInputMode("custom")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      jobInputMode === "custom" ? "bg-card text-primary shadow-xs" : "text-muted-foreground"
                    }`}
                  >
                    Paste Custom
                  </button>
                </div>
              </div>

              {jobInputMode === "select" ? (
                <div className="space-y-3">
                  <Label className="text-xs font-semibold">Active Recruitment Job Requisition</Label>
                  {jobsLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-4">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs from server...
                    </div>
                  ) : backendJobs.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 text-center">
                      <p className="text-xs text-muted-foreground">No published jobs found. Switch to "Paste Custom" to enter a job description manually.</p>
                    </div>
                  ) : (
                    <>
                      <Select value={selectedJobId || backendJobs[0]?.id || ""} onValueChange={setSelectedJobId}>
                        <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60 rounded-xl">
                          <SelectValue placeholder="Select active job opening" />
                        </SelectTrigger>
                        <SelectContent>
                          {backendJobs.map((j) => (
                            <SelectItem key={j.id} value={j.id} className="text-xs">
                              {j.title} ({j.department})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedJob && (
                        <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50 space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span>{selectedJob.title}</span>
                            <Badge variant="outline" className="text-[10px]">{selectedJob.department}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            <Badge variant="secondary" className="text-[9px]">{selectedJob.location}</Badge>
                            <Badge variant="secondary" className="text-[9px]">{selectedJob.employment_type}</Badge>
                            <Badge variant="secondary" className="text-[9px]">{selectedJob.vacancies} vacancies</Badge>
                            <Badge variant="secondary" className="text-[9px]">{selectedJob.status}</Badge>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Job Title</Label>
                      <Input
                        value={customJobTitle}
                        onChange={(e) => setCustomJobTitle(e.target.value)}
                        placeholder="e.g. Senior Backend Engineer"
                        className="text-xs bg-secondary/30 h-9 border-border/60 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold">Required Exp (Yrs)</Label>
                      <Input
                        value={customExpYears}
                        onChange={(e) => setCustomExpYears(e.target.value)}
                        placeholder="e.g. 5"
                        className="text-xs bg-secondary/30 h-9 border-border/60 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Job Description & Required Skills</Label>
                    <Textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      rows={4}
                      placeholder="Paste job description, required technical stack, and responsibilities..."
                      className="text-xs bg-secondary/30 border-border/60 rounded-xl resize-none font-sans"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. EXECUTE ANALYZE BUTTON */}
            <Button
              onClick={handleAnalyzeResume}
              disabled={isAnalyzing || !file}
              className="w-full h-12 gradient-bg text-primary-foreground font-extrabold text-sm rounded-2xl shadow-md gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Uploading & Analyzing Resume...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Analyze Resume & Score ATS Match
                </>
              )}
            </Button>
          </div>

          {/* RIGHT PANEL: ATS ANALYSIS RESULTS DASHBOARD (7 Cols) */}
          {(analysisResult || isAnalyzing) && (
            <div className="lg:col-span-7">
              {isAnalyzing ? (
                <div className="glass-card rounded-3xl p-12 text-center border border-border/60 bg-card space-y-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                  <h3 className="text-base font-bold text-foreground">AI Neural ATS Engine Processing</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Uploading resume to server, extracting text via Document AI, computing ATS compatibility scores against job requirements...
                  </p>
                </div>
              ) : analysisResult ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* OVERALL SCORE & RECOMMENDATION BANNER */}
                <div className="glass-card rounded-3xl p-6 border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                          ATS MATCH REPORT
                        </Badge>
                        <span className="text-xs text-muted-foreground">{analysisResult.analyzedAt}</span>
                      </div>
                      <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                        {analysisResult.candidate.candidateName}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Target Role: <strong className="text-foreground">{analysisResult.jobTitle}</strong>
                      </p>
                    </div>

                    {/* Circular Score Badge */}
                    <div className="flex items-center gap-4 bg-card/80 p-4 rounded-2xl border border-border/60 shrink-0">
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground uppercase font-bold text-[10px]">ATS Score</span>
                        <p className="text-3xl font-extrabold font-mono gradient-text">{analysisResult.overallScore}/100</p>
                      </div>
                      <div className="h-10 w-px bg-border/60" />
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Verdict</span>
                        <div>
                          <Badge className={
                            analysisResult.overallScore >= 85 ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-extrabold" : "bg-amber-500/15 text-amber-500 font-extrabold"
                          }>
                            {analysisResult.recruiterRecommendation}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                    <Button size="sm" variant="outline" onClick={handleSaveToStore} className="h-8 text-xs gap-1.5 border-border/60">
                      <Save className="w-3.5 h-3.5" /> Save Analysis
                    </Button>
                    <Button size="sm" onClick={() => handleExportReport(analysisResult)} className="h-8 text-xs gap-1.5 gradient-bg text-primary-foreground font-bold">
                      <Download className="w-3.5 h-3.5" /> Export Report (.txt)
                    </Button>
                  </div>
                </div>

                {/* SCORE BREAKDOWN BARS */}
                <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary" /> Weighted ATS Compatibility Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Skills Match</span>
                        <span className="font-mono text-emerald-500 font-bold">{analysisResult.scoreBreakdown.skillsMatchPct}%</span>
                      </div>
                      <Progress value={analysisResult.scoreBreakdown.skillsMatchPct} className="h-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Experience Relevance</span>
                        <span className="font-mono text-emerald-500 font-bold">{analysisResult.scoreBreakdown.experienceMatchPct}%</span>
                      </div>
                      <Progress value={analysisResult.scoreBreakdown.experienceMatchPct} className="h-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Keyword Coverage</span>
                        <span className="font-mono text-primary font-bold">{analysisResult.scoreBreakdown.keywordMatchPct}%</span>
                      </div>
                      <Progress value={analysisResult.scoreBreakdown.keywordMatchPct} className="h-2" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Education Alignment</span>
                        <span className="font-mono text-emerald-500 font-bold">{analysisResult.scoreBreakdown.educationMatchPct}%</span>
                      </div>
                      <Progress value={analysisResult.scoreBreakdown.educationMatchPct} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* MATCHED & MISSING SKILLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matched Skills */}
                  <div className="glass-card rounded-3xl p-5 border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Matched Required Skills ({analysisResult.matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matchedSkills.map((s) => (
                        <Badge key={s} className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px]">
                          {s}
                        </Badge>
                      ))}
                      {analysisResult.matchedSkills.length === 0 && (
                        <span className="text-xs text-muted-foreground">No matched skills data available.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="glass-card rounded-3xl p-5 border border-amber-500/30 bg-amber-500/5 space-y-3">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4" /> Missing / Recommended Skills ({analysisResult.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingSkills.length === 0 ? (
                        <span className="text-xs text-muted-foreground">Zero skill gaps detected!</span>
                      ) : (
                        analysisResult.missingSkills.map((s) => (
                          <Badge key={s} variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px]">
                            {s}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* RECRUITER VERDICT & RECOMMENDATIONS */}
                <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4">
                  <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary" /> Recruiter Verdict & Optimization Suggestions
                  </h3>
                  <p className="text-xs text-foreground font-semibold leading-relaxed bg-secondary/30 p-3 rounded-xl border border-border/50">
                    {analysisResult.recruiterSummary.verdict}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Key Candidate Strengths</span>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {analysisResult.recruiterSummary.topStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">ATS Optimization Advice</span>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-foreground">
                          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </div>
        )}
      </div>
      ) : (
        /* HISTORY TAB */
        <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Saved Candidate ATS Analysis History</h2>
              <p className="text-xs text-muted-foreground">Audit past resume ATS reports and recruiter match scores.</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates or job titles..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9 bg-secondary/30 text-xs h-9 border-border/60 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/60">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Candidate</TableHead>
                  <TableHead className="text-xs font-bold">Target Job Title</TableHead>
                  <TableHead className="text-xs font-bold">ATS Match Score</TableHead>
                  <TableHead className="text-xs font-bold">Recruiter Verdict</TableHead>
                  <TableHead className="text-xs font-bold">Analyzed Date</TableHead>
                  <TableHead className="text-right text-xs font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                      <FileSearch className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="font-bold text-sm text-foreground">No saved ATS analysis reports</p>
                      <p className="text-[11px]">Analyze candidate resumes and click "Save Analysis" to archive reports here.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="font-bold text-xs text-foreground">
                        <div>{h.candidate.candidateName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{h.candidate.email}</div>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{h.jobTitle}</TableCell>
                      <TableCell className="text-xs font-mono font-bold text-emerald-500">
                        {h.overallScore} / 100
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          h.overallScore >= 85 ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : "bg-amber-500/15 text-amber-500"
                        }>
                          {h.recruiterRecommendation}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-mono">{h.analyzedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExportReport(h)}
                            className="h-7 text-xs text-primary"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteAnalysis(h.id)}
                            className="h-7 text-xs text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
