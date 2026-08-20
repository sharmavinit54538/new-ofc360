import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  Layers,
  ArrowRight,
  RefreshCw,
  Copy,
  Printer,
  FileCheck,
  Zap,
  Target,
  FileSearch,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  HelpCircle,
  Sliders,
  Flame,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCheckResumeATSMutation,
  ResumeATSReport,
} from "@/services/api/resumeAtsCheckerApi";
import { toast } from "sonner";

const ALLOWED_FORMATS = [".pdf", ".docx", ".doc", ".png", ".jpg", ".jpeg", ".tiff"];
const MAX_SIZE_MB = 15;

export default function ResumeATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [showJobContext, setShowJobContext] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [checkResumeATS, { isLoading }] = useCheckResumeATSMutation();
  const [report, setReport] = useState<ResumeATSReport | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_FORMATS.includes(ext)) {
      toast.error(`Format not supported. Please upload ${ALLOWED_FORMATS.join(", ")}`);
      return;
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File size exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (jobTitle.trim()) formData.append("job_title", jobTitle.trim());
    if (jobDescription.trim()) formData.append("job_description", jobDescription.trim());
    if (requiredSkills.trim()) formData.append("required_skills", requiredSkills.trim());

    try {
      const result = await checkResumeATS(formData).unwrap();
      setReport(result);
      toast.success("Resume ATS analysis complete!");
      setActiveTab("overview");
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.data?.detail || "Failed to analyze resume. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleReset = () => {
    setFile(null);
    setReport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopySummary = () => {
    if (!report) return;
    const text = `OFC360 Resume ATS Score: ${report.ats_score}/100
Candidate: ${report.parsed_resume.name || "N/A"}
Formatting Quality: ${report.formatting_score}/100
Matched Skills: ${report.matched_skills.join(", ") || "None"}
Missing Skills: ${report.missing_skills.join(", ") || "None"}
Top Recommendation: ${report.recommendations[0] || "None"}`;
    navigator.clipboard.writeText(text);
    toast.success("Report summary copied to clipboard!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500 border-emerald-500 bg-emerald-500/10";
    if (score >= 65) return "text-blue-500 stroke-blue-500 border-blue-500 bg-blue-500/10";
    if (score >= 50) return "text-amber-500 stroke-amber-500 border-amber-500 bg-amber-500/10";
    return "text-rose-500 stroke-rose-500 border-rose-500 bg-rose-500/10";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: "ATS Ready (Excellent)", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400" };
    if (score >= 70) return { label: "Competitive (Good)", color: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400" };
    if (score >= 50) return { label: "Needs Polish (Moderate)", color: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400" };
    return { label: "Major Gaps (Low Match)", color: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400" };
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-secondary/30 border border-border/60 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Zap className="w-80 h-80 text-primary" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/25 font-semibold text-xs flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> AI ATS Intelligence 2.0
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-secondary/80 text-muted-foreground border-border text-xs">
              Direct OCR & Structured LLM Pipeline
            </Badge>
            <Badge variant="outline" className="px-3 py-1 bg-secondary/80 text-muted-foreground border-border text-xs">
              All Users & Candidates
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            Resume ATS Checker & Diagnostic Report
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Upload your resume to get an instant, genuine ATS compatibility score, formatting audit, keyword gap analysis, and tailored recommendations. Powered by real Document AI and semantic scoring models.
          </p>
        </div>
      </div>

      {/* Main Upload / Control Box */}
      {!report && (
        <Card className="border-border/60 shadow-md bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-primary" />
              Upload Resume Document
            </CardTitle>
            <CardDescription>
              Supported formats: PDF, DOCX, DOC, JPG, PNG, TIFF (Max {MAX_SIZE_MB}MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleAnalyze} className="space-y-6">
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                  dragActive
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border/80 hover:border-primary/60 hover:bg-secondary/40"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_FORMATS.join(",")}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shadow-inner">
                      <FileCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-base text-foreground max-w-md truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "Document"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="mt-2 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      Remove & Choose Another
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner transition-transform group-hover:scale-110">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-base text-foreground">
                        Drag and drop your resume here, or <span className="text-primary underline">browse files</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF or DOCX documents produce the fastest and most accurate parsing
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                      {ALLOWED_FORMATS.map((ext) => (
                        <span key={ext} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/40">
                          {ext.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Optional Job Context Section */}
              <div className="border border-border/60 rounded-xl overflow-hidden bg-secondary/20">
                <button
                  type="button"
                  onClick={() => setShowJobContext(!showJobContext)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 text-foreground">
                    <Target className="w-4 h-4 text-primary" />
                    <span>Target Job Context (Optional — for targeted ATS Keyword Match)</span>
                    <Badge variant="outline" className="text-[10px] px-2 py-0.2 bg-primary/10 text-primary border-primary/20">
                      Optional
                    </Badge>
                  </div>
                  {showJobContext ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {showJobContext && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 pt-0 space-y-4 border-t border-border/40"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="jobTitle" className="text-xs font-semibold">
                            Target Job Title
                          </Label>
                          <Input
                            id="jobTitle"
                            placeholder="e.g. Senior Full Stack Engineer"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="bg-background text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="requiredSkills" className="text-xs font-semibold">
                            Required Skills (comma-separated)
                          </Label>
                          <Input
                            id="requiredSkills"
                            placeholder="e.g. React, Node.js, Python, PostgreSQL, AWS"
                            value={requiredSkills}
                            onChange={(e) => setRequiredSkills(e.target.value)}
                            className="bg-background text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="jobDescription" className="text-xs font-semibold">
                          Job Description / Requirements Text
                        </Label>
                        <Textarea
                          id="jobDescription"
                          rows={4}
                          placeholder="Paste the target job description or requirements here for semantic keyword gap matching..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="bg-background text-xs"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={!file || isLoading}
                  className="w-full sm:w-auto px-8 h-11 text-sm font-semibold gap-2 shadow-md"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing with ATS Engine...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Check ATS Score
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading Progress State */}
      {isLoading && (
        <Card className="border-border/60 shadow-lg p-8 sm:p-12 text-center bg-card/80 backdrop-blur-md">
          <div className="max-w-md mx-auto space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center">
                <Cpu className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Evaluating Resume against ATS Algorithms</h3>
              <p className="text-xs text-muted-foreground">
                Executing OCR text extraction, structured entity parsing, structural quality evaluation, and weighted multi-dimension ATS scoring...
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={68} className="h-2" />
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>Parsing Sections</span>
                <span>Calculating Weights</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Dashboard */}
      {report && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Top Score Banner Card */}
          <Card className="border-border/60 shadow-lg bg-card/90 overflow-hidden relative">
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Score Gauge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-2xl border border-border/40 text-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="stroke-secondary fill-none"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(report.ats_score).split(" ")[1]}`}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - report.ats_score / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {report.ats_score}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      / 100 ATS Score
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <Badge variant="outline" className={`px-3 py-1 font-bold text-xs border ${getScoreBadge(report.ats_score).color}`}>
                    {getScoreBadge(report.ats_score).label}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground">
                    {report.has_job_context ? "Evaluated with Job Context Match" : "Evaluated as General Resume Health"}
                  </p>
                </div>
              </div>

              {/* High Level Metrics & Diagnostics */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {report.parsed_resume.name || "Candidate Resume"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {report.parsed_resume.current_designation ? `${report.parsed_resume.current_designation} • ` : ""}
                      {report.parsed_resume.experience_years > 0 ? `${report.parsed_resume.experience_years} Years Experience` : "Fresher / Not Specified"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopySummary} className="h-8 text-xs gap-1.5">
                      <Copy className="w-3.5 h-3.5" /> Copy Summary
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="h-8 text-xs gap-1.5">
                      <Printer className="w-3.5 h-3.5" /> Print Report
                    </Button>
                    <Button variant="default" size="sm" onClick={handleReset} className="h-8 text-xs gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5" /> New Analysis
                    </Button>
                  </div>
                </div>

                {/* Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-[11px] text-muted-foreground font-medium">Formatting Quality</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{report.formatting_score}%</p>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-[11px] text-muted-foreground font-medium">Job Compatibility</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">
                      {report.job_match_score !== null ? `${report.job_match_score}%` : "N/A (No JD)"}
                    </p>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-[11px] text-muted-foreground font-medium">Skills Extracted</p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{report.parsed_resume.skills.length}</p>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/30">
                    <p className="text-[11px] text-muted-foreground font-medium">Issues Detected</p>
                    <p className={`text-lg font-bold mt-0.5 ${report.issues.length > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                      {report.issues.length}
                    </p>
                  </div>
                </div>

                {/* Meta details footer */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>File: <strong className="text-foreground font-medium">{report.meta.file_name}</strong></span>
                  <span>Size: <strong className="text-foreground font-medium">{(report.meta.file_size_bytes / 1024).toFixed(1)} KB</strong></span>
                  <span>Text Length: <strong className="text-foreground font-medium">{report.meta.char_count} chars</strong></span>
                  <span>Engine: <strong className="text-foreground font-medium">{report.meta.ocr_engine_used}</strong></span>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation Tabs for Detailed Deep Dive */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary/40 p-1 rounded-xl border border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-2xl">
              <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">
                Score Breakdown
              </TabsTrigger>
              <TabsTrigger value="skills" className="rounded-lg text-xs font-semibold">
                Skills Match Matrix
              </TabsTrigger>
              <TabsTrigger value="quality" className="rounded-lg text-xs font-semibold">
                Quality & Issues ({report.issues.length})
              </TabsTrigger>
              <TabsTrigger value="parsed" className="rounded-lg text-xs font-semibold">
                Parsed Content
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW & BREAKDOWN */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Detailed Category Progress Bars */}
                <Card className="lg:col-span-7 border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-primary" />
                      ATS Category Contribution Breakdown
                    </CardTitle>
                    <CardDescription>
                      How each resume pillar contributed to your overall weighted ATS score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Technical & Soft Skills Match", key: "skills", score: report.category_scores.skills, weight: "35%" },
                      { label: "Experience Relevance & Timeline", key: "experience", score: report.category_scores.experience, weight: "20%" },
                      { label: "NLP Keyword & Context Alignment", key: "keywords", score: report.category_scores.keywords, weight: "15%" },
                      { label: "Education & Degree Verification", key: "education", score: report.category_scores.education, weight: "10%" },
                      { label: "Projects & Technical Portfolio", key: "projects", score: report.category_scores.projects, weight: "10%" },
                      { label: "Industry Certifications", key: "certifications", score: report.category_scores.certifications, weight: "5%" },
                      { label: "Formatting & Document Integrity", key: "resume_quality", score: report.category_scores.resume_quality, weight: "5%" },
                    ].map((item) => (
                      <div key={item.key} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            {item.label}
                            <span className="text-[10px] text-muted-foreground font-normal">({item.weight} weight)</span>
                          </span>
                          <span className="font-bold text-foreground">{item.score}/100</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommendations Card */}
                <Card className="lg:col-span-5 border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Actionable Recommendations
                    </CardTitle>
                    <CardDescription>
                      Prioritized steps to boost your ATS compatibility score
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {report.recommendations.length > 0 ? (
                      report.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30 text-xs"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                            {index + 1}
                          </div>
                          <span className="text-foreground leading-relaxed font-medium">{rec}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-muted-foreground bg-secondary/20 rounded-xl">
                        No major gaps detected! Your resume matches standard ATS criteria smoothly.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 2: SKILLS MATRIX */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Matched Skills */}
                <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Matched Skills ({report.matched_skills.length})
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Skills found in both resume and target criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {report.matched_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {report.matched_skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs py-1 px-2.5 font-medium"
                          >
                            <Check className="w-3 h-3 mr-1" /> {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No direct job match skills found.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Missing Skills */}
                <Card className="border-rose-500/30 bg-rose-500/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Missing Skills ({report.missing_skills.length})
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Required by JD but absent in your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {report.missing_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {report.missing_skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 text-xs py-1 px-2.5 font-medium"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" /> {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {report.has_job_context ? "Great! No missing required skills." : "Provide target job skills to detect gaps."}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Extra / Bonus Skills */}
                <Card className="border-blue-500/30 bg-blue-500/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Extra / Discovered Skills ({report.extra_skills.length})
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Additional competencies extracted from your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {report.extra_skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {report.extra_skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs py-1 px-2.5 font-medium"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No extra skills identified.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 3: QUALITY & ISSUES */}
            <TabsContent value="quality" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Structural Issues */}
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Detected Structural Issues ({report.issues.length})
                    </CardTitle>
                    <CardDescription>
                      Formatting or clarity anomalies identified by the document scanner
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {report.issues.length > 0 ? (
                      report.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium leading-relaxed">{issue}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                        No structural or readability issues detected!
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Missing Standard Fields */}
                <Card className="border-border/60 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <FileSearch className="w-4 h-4 text-rose-500" />
                      Missing Standard Sections ({report.missing_fields.length})
                    </CardTitle>
                    <CardDescription>
                      Core resume sections expected by enterprise ATS parsers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {report.missing_fields.length > 0 ? (
                      report.missing_fields.map((field, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs"
                        >
                          <span className="font-semibold text-rose-700 dark:text-rose-300 capitalize">
                            Missing Section: {field}
                          </span>
                          <Badge variant="outline" className="bg-rose-500/15 text-rose-600 border-rose-500/30 text-[10px]">
                            Action Required
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-1" />
                        All standard sections (Email, Phone, Skills, Education) are present.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB 4: PARSED RESUME CONTENT */}
            <TabsContent value="parsed" className="space-y-6">
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Structured Data Extracted From Your Resume
                  </CardTitle>
                  <CardDescription>
                    Verify what the OCR & AI parser extracted to ensure high readability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact / Header Info */}
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/40 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Header & Contact Details
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Full Name</span>
                        <strong className="text-foreground">{report.parsed_resume.name || "Not Found"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Email Address</span>
                        <strong className="text-foreground">{report.parsed_resume.email || "Not Found"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Phone Number</span>
                        <strong className="text-foreground">{report.parsed_resume.phone || "Not Found"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Location</span>
                        <strong className="text-foreground">{report.parsed_resume.address || "Not Specified"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Current Designation</span>
                        <strong className="text-foreground">{report.parsed_resume.current_designation || "Not Specified"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Current Company</span>
                        <strong className="text-foreground">{report.parsed_resume.current_company || "Not Specified"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {report.parsed_resume.summary && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Professional Summary
                      </h4>
                      <p className="text-xs text-foreground bg-secondary/20 p-3.5 rounded-xl border border-border/30 leading-relaxed">
                        {report.parsed_resume.summary}
                      </p>
                    </div>
                  )}

                  {/* Education */}
                  {report.parsed_resume.education && report.parsed_resume.education.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" /> Education History
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {report.parsed_resume.education.map((edu, idx) => (
                          <div key={idx} className="p-3 bg-secondary/20 rounded-xl border border-border/30 text-xs space-y-1">
                            <p className="font-semibold text-foreground">{edu.degree || edu.field_of_study || "Degree"}</p>
                            <p className="text-muted-foreground">{edu.university || edu.college || "Institution"}</p>
                            {edu.passing_year && <p className="text-[11px] text-muted-foreground">Year: {edu.passing_year}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {report.parsed_resume.projects && report.parsed_resume.projects.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-primary" /> Key Projects
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {report.parsed_resume.projects.map((proj, idx) => (
                          <div key={idx} className="p-3 bg-secondary/20 rounded-xl border border-border/30 text-xs space-y-1.5">
                            <p className="font-semibold text-foreground">{proj.title}</p>
                            {proj.description && <p className="text-muted-foreground leading-relaxed">{proj.description}</p>}
                            {proj.technologies && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {proj.technologies.map((t, i) => (
                                  <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}