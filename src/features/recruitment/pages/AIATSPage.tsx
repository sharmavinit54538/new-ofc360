import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useATSAnalysisStore } from "@/stores/atsAnalysisStore";
import {
  useGetRecruitmentJobsQuery,
  useUploadResumeForScreeningMutation,
  type BackendCandidateScreeningResponse,
} from "@/services/api/recruitmentApi";
import { ATSAnalysisResult } from "@/utils/atsScoringEngine";
import { toast } from "sonner";
import {
  ResumeUpload,
  JobSelection,
  ATSResultsDashboard,
  HistoryTab,
  exportATSReport,
  mapBackendToATSResult,
} from "@/features/recruitment/components/ai-ats";

export default function AIATSPage() {
  const { history, saveAnalysis, deleteAnalysis, setActiveAnalysis } = useATSAnalysisStore();

  // Backend Data
  const { data: jobsData, isLoading: jobsLoading } = useGetRecruitmentJobsQuery({ status: "PUBLISHED", limit: 50 });
  const [uploadResume] = useUploadResumeForScreeningMutation();
  const backendJobs = Array.isArray(jobsData?.items) ? jobsData.items : Array.isArray(jobsData) ? (jobsData as any) : [];

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

  // Run ATS Analysis via Backend API
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
            <ResumeUpload
              file={file}
              setFile={setFile}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              uploadError={uploadError}
              setUploadError={setUploadError}
            />

            {/* 2. JOB DESCRIPTION SELECTION CARD */}
            <JobSelection
              jobInputMode={jobInputMode}
              setJobInputMode={setJobInputMode}
              backendJobs={backendJobs}
              jobsLoading={jobsLoading}
              selectedJobId={selectedJobId}
              setSelectedJobId={setSelectedJobId}
              customJobTitle={customJobTitle}
              setCustomJobTitle={setCustomJobTitle}
              customDept={customDept}
              setCustomDept={setCustomDept}
              customExpYears={customExpYears}
              setCustomExpYears={setCustomExpYears}
              customDescription={customDescription}
              setCustomDescription={setCustomDescription}
            />

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
                <ATSResultsDashboard
                  analysisResult={analysisResult}
                  onSaveToStore={handleSaveToStore}
                  onExportReport={exportATSReport}
                />
              ) : null}
            </div>
          )}
        </div>
      ) : (
        /* HISTORY TAB */
        <HistoryTab
          history={history}
          historySearch={historySearch}
          setHistorySearch={setHistorySearch}
          onExportReport={exportATSReport}
          onDeleteAnalysis={deleteAnalysis}
        />
      )}
    </motion.div>
  );
}