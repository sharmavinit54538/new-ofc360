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
import { useATSStore } from "@/stores/atsStore";
import { useATSAnalysisStore } from "@/stores/atsAnalysisStore";
import {
  parseResumeContent,
  analyzeResumeAgainstJob,
  type ATSAnalysisResult,
  type ParsedResumeData,
} from "@/utils/atsScoringEngine";
import { toast } from "sonner";

export default function AIATSPage() {
  const { jobs } = useATSStore();
  const { history, saveAnalysis, deleteAnalysis, setActiveAnalysis } = useATSAnalysisStore();

  const [activeTab, setActiveTab] = useState<"analyzer" | "history">("analyzer");
  const [jobInputMode, setJobInputMode] = useState<"select" | "custom">("select");
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Job Description Inputs
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "JOB-101");
  const [customJobTitle, setCustomJobTitle] = useState("Senior AI & Fullstack Lead Engineer");
  const [customDept, setCustomDept] = useState("Engineering");
  const [customExpYears, setCustomExpYears] = useState("5");
  const [customDescription, setCustomDescription] = useState(
    "Seeking a Senior Fullstack Engineer proficient in React, TypeScript, Node.js, REST APIs, System Design, Docker, and AWS. Minimum 5 years of experience."
  );

  // Execution & Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysisResult | null>(null);
  const [historySearch, setHistorySearch] = useState("");

  // Selected Job Details from Store
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // File Upload Handlers
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
      toast.error("File size must be under 10MB.");
      return;
    }

    setFile(f);
    toast.success(`Resume uploaded: ${f.name}`);
  };

  // Run ATS Analysis
  const handleAnalyzeResume = async () => {
    if (!file) {
      toast.error("Please upload a candidate resume file first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate file text extraction and parsing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const mockTextContent = `
        Alex Turner
        Email: alex.turner@example.com | Phone: +1 (555) 234-5678 | San Francisco, CA
        Summary: Senior Fullstack Engineer with 5.4 years of experience building high-scale React, TypeScript, Node.js microservices, and AI integrations.
        
        Skills: React, TypeScript, Node.js, Express, Python, REST APIs, GraphQL, Redux, PostgreSQL, Docker, AWS, Git, CI/CD, System Design, Agile, Scrum, Problem Solving.
        
        Work Experience:
        - Senior Fullstack Engineer | EquinoxSphere Systems (2023 - Present)
          Architected React/TypeScript frontend micro-dashboards serving 45,000+ daily active users.
          Integrated high-throughput Node.js microservices and Redis caching layer, cutting latency by 38%.
        - Frontend Software Engineer | Apex Global Tech (2021 - 2023)
          Developed responsive Web components with React, Redux, and Tailwind CSS.
        
        Education:
        - Bachelor of Science in Computer Science, California Institute of Technology (2021)
        
        Certifications:
        - AWS Certified Solutions Architect - Associate
      `;

      const parsedData = parseResumeContent(mockTextContent, file.name);

      const targetTitle = jobInputMode === "select" ? selectedJob.title : customJobTitle;
      const targetDesc = jobInputMode === "select" ? selectedJob.description + " " + selectedJob.requirements.join(" ") : customDescription;
      const targetReqSkills = jobInputMode === "select" ? selectedJob.requirements : [];
      const targetExp = jobInputMode === "select" ? 5 : parseInt(customExpYears) || 4;

      const result = analyzeResumeAgainstJob(parsedData, targetTitle, targetDesc, targetReqSkills, targetExp);
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      toast.success(`⚡ ATS Analysis complete! Score: ${result.overallScore}/100`);
    } catch (err: any) {
      setIsAnalyzing(false);
      toast.error("ATS Resume analysis failed. Please try again.");
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
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="bg-secondary/30 text-xs h-10 border-border/60 rounded-xl">
                      <SelectValue placeholder="Select active job opening" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((j) => (
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
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {selectedJob.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedJob.requirements.slice(0, 4).map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[9px]">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
                  <Loader2 className="w-5 h-5 animate-spin" /> Parsing Resume & Scoring ATS...
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
                    Extracting candidate skills, evaluating experience relevance, and calculating weighted ATS compatibility scores against job requirements...
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
