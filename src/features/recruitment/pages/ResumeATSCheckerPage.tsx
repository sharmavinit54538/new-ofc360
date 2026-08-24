import React, { useState, useRef, useEffect } from "react";
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
import {
  ResumeUploadDropzone,
  JobContextForm,
  ATSAnalysisProgress,
  ScoreBanner,
  ResultsTabs,
} from "@/features/recruitment/components/resume-ats-checker";

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
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
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
            <CardContent className="space-y-6 p-6">
              <form onSubmit={handleAnalyze} className="space-y-6">
                <ResumeUploadDropzone
                  file={file}
                  dragActive={dragActive}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onFileChange={handleFileChange}
                  onRemoveFile={handleReset}
                  fileInputRef={fileInputRef}
                />

                <JobContextForm
                  showJobContext={showJobContext}
                  onToggle={() => setShowJobContext(!showJobContext)}
                  jobTitle={jobTitle}
                  onJobTitleChange={setJobTitle}
                  requiredSkills={requiredSkills}
                  onRequiredSkillsChange={setRequiredSkills}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={setJobDescription}
                />

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
        {isLoading && <ATSAnalysisProgress />}

        {/* Results Dashboard */}
        {report && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ScoreBanner
              report={report}
              onCopySummary={handleCopySummary}
              onPrint={() => window.print()}
              onNewAnalysis={handleReset}
              getScoreColor={getScoreColor}
              getScoreBadge={getScoreBadge}
            />

            <ResultsTabs
              report={report}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}