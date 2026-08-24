import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Play,
  Copy,
  Download,
  Save,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  Briefcase,
  Users,
  Calendar,
  Layers,
  ShieldCheck,
  Building2,
  Video,
  ScanFace,
  Check,
  Loader2,
  FileSpreadsheet,
  AlertOctagon,
  Search,
  BookOpen,
  UserCheck,
  Coins,
  Compass,
  FileCode,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AIToolItem } from "@/types/ai";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useATSStore } from "@/stores/atsStore";
import { aiService } from "@/ai";
import { toast } from "sonner";

interface AIModelWorkspaceModalProps {
  model: AIToolItem | null;
  onClose: () => void;
}

export function AIModelWorkspaceModal({ model, onClose }: AIModelWorkspaceModalProps) {
  const { employees } = useEmployeeStore();
  const { jobs } = useATSStore();

  // Common Input States
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || "EMP-101");
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "JOB-101");
  const [promptText, setPromptText] = useState<string>("");
  const [department, setDepartment] = useState<string>("Engineering");
  const [horizon, setHorizon] = useState<string>("30 Days");

  // Document Gen Specific Inputs
  const [recipientName, setRecipientName] = useState<string>("Alex Mercer");
  const [designation, setDesignation] = useState<string>("Senior Fullstack Engineer");
  const [joiningDate, setJoiningDate] = useState<string>("2026-09-01");
  const [annualCtc, setAnnualCtc] = useState<string>("15,00,000");

  // File & Transcript Input State
  const [fileName, setFileName] = useState<string | null>(null);

  // Execution & Streaming State
  const [isExecuting, setIsExecuting] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [tokensUsed, setTokensUsed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  if (!model) return null;

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Execute AI Model Handler
  const handleExecuteModel = async () => {
    let finalPrompt = promptText.trim();

    // Contextual prompt construction based on Model Category if empty
    if (!finalPrompt) {
      if (model.category === "Recruitment AI") {
        finalPrompt = `Analyze candidate for target job requisition '${selectedJob?.title || "Senior Engineer"}'. Required experience: 5 years.`;
      } else if (model.category === "Employee AI") {
        finalPrompt = `Perform AI workspace analysis for employee ${selectedEmployee?.name || "Alex Mercer"} (${selectedEmployee?.department || "Engineering"}).`;
      } else if (model.category === "Document Gen AI") {
        finalPrompt = `Generate official ${model.title} for ${recipientName} (${designation}). Effective Date: ${joiningDate}. CTC: ₹${annualCtc}.`;
      } else {
        finalPrompt = model.demoPrompt || `Execute AI analysis for ${model.title}.`;
      }
    }

    setIsExecuting(true);
    setResultText("");
    setLatencyMs(null);
    setTokensUsed(null);

    try {
      const res = await aiService.generate({
        prompt: finalPrompt,
        task: 'text',
        parameters: { stream: true },
      });
      setLatencyMs(res.latencyMs);
      setTokensUsed(res.tokensUsed);

      // Simulate streaming for UI
      const fullResponse = res.content;
      let currentText = '';
      for (let i = 0; i < fullResponse.length; i++) {
        currentText = fullResponse.slice(0, i + 1);
        setResultText(currentText);
        await new Promise(r => setTimeout(r, 16));
      }

      setIsExecuting(false);
      toast.success(`⚡ ${model.title} workspace executed cleanly! (${res.latencyMs}ms)`);
    } catch (err: any) {
      setIsExecuting(false);
      toast.error(`AI Model Execution Failed: ${err.message || "Unknown error"}`);
    }
  };

  const handleCopyResult = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      toast.success("AI Result copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportResult = () => {
    if (resultText) {
      const blob = new Blob([resultText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `OFC360_${model.id.toUpperCase()}_Report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("AI Result exported to file!");
    }
  };

  return (
    <Dialog open={!!model} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border/80 rounded-3xl p-6 shadow-2xl scrollbar-thin">
        {/* MODAL HEADER */}
        <DialogHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  {model.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {model.description}
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px] font-bold border-primary/30 text-primary">
              {model.category}
            </Badge>
          </div>
        </DialogHeader>

        {/* WORKSPACE INPUT CONTROLS */}
        <div className="space-y-5 py-2">
          {/* 1. RECRUITMENT AI INPUT CONTROLS */}
          {model.category === "Recruitment AI" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" /> Target Requisition / Role
                </Label>
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger className="bg-card text-xs h-9 border-border/60 rounded-xl">
                    <SelectValue placeholder="Select requisition" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={j.id} className="text-xs">
                        {j.title} ({j.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <UploadCloud className="w-3.5 h-3.5 text-primary" /> Upload Candidate Resume / DOCX
                </Label>
                <Input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                  className="bg-card text-xs h-9 border-border/60 rounded-xl file:text-xs file:font-bold file:text-primary"
                />
                {fileName && (
                  <p className="text-[11px] text-emerald-500 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Attached: {fileName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 2. EMPLOYEE AI INPUT CONTROLS */}
          {model.category === "Employee AI" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" /> Select Employee Context
                </Label>
                <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                  <SelectTrigger className="bg-card text-xs h-9 border-border/60 rounded-xl">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={e.id} className="text-xs">
                        {e.name} ({e.department} - {e.designation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Department
                </Label>
                <Input
                  value={selectedEmployee?.department || department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="bg-card text-xs h-9 border-border/60 rounded-xl"
                  readOnly
                />
              </div>
            </div>
          )}

          {/* 3. DOCUMENT GEN AI INPUT CONTROLS */}
          {model.category === "Document Gen AI" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Recipient Name</Label>
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="bg-card text-xs h-8 border-border/60 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Designation</Label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="bg-card text-xs h-8 border-border/60 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Effective Date</Label>
                <Input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="bg-card text-xs h-8 border-border/60 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold">Annual CTC (INR)</Label>
                <Input
                  value={annualCtc}
                  onChange={(e) => setAnnualCtc(e.target.value)}
                  className="bg-card text-xs h-8 border-border/60 rounded-xl font-mono"
                />
              </div>
            </div>
          )}

          {/* 4. WORKFORCE & ANALYTICS HORIZON INPUT */}
          {(model.category === "Workforce & Shift AI" || model.category === "Analytics & Predictive AI") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Target Department
                </Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="bg-card text-xs h-9 border-border/60 rounded-xl">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering" className="text-xs">Engineering</SelectItem>
                    <SelectItem value="Product Design" className="text-xs">Product Design</SelectItem>
                    <SelectItem value="Human Resources" className="text-xs">Human Resources</SelectItem>
                    <SelectItem value="Finance & Ops" className="text-xs">Finance & Ops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Forecast Horizon
                </Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger className="bg-card text-xs h-9 border-border/60 rounded-xl">
                    <SelectValue placeholder="Select forecast window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 Days" className="text-xs">30 Days (Short-term)</SelectItem>
                    <SelectItem value="90 Days" className="text-xs">90 Days (Quarterly)</SelectItem>
                    <SelectItem value="1 Year" className="text-xs">1 Year (Annual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 5. MEETING INTELLIGENCE TRANSCRIPT DROPZONE */}
          {model.category === "Meeting Intelligence AI" && (
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-primary" /> Upload Audio / Video Transcript (.txt / .vtt)
              </Label>
              <Input
                type="file"
                accept=".txt,.vtt,.srt"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                className="bg-card text-xs h-9 border-border/60 rounded-xl file:text-xs file:font-bold file:text-primary"
              />
              {fileName && (
                <p className="text-[11px] text-emerald-500 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Audio Transcript Attached: {fileName}
                </p>
              )}
            </div>
          )}

          {/* 6. BIOMETRICS & VISION TELEMETRY */}
          {model.category === "Biometrics & Vision AI" && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <ScanFace className="w-5 h-5 animate-pulse" />
                <span>3D Optical Liveness & Face Anti-Spoofing Camera Sensor Active</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                HQ Sensor #04 Online
              </Badge>
            </div>
          )}

          {/* GENERAL PROMPT INPUT TEXTAREA */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Input Prompt / Specific Instructions:
            </Label>
            <Textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={model.demoPrompt || "Enter input parameters, query, or customized instructions..."}
              rows={3}
              className="text-xs bg-secondary/30 border-border/60 rounded-xl resize-none font-sans"
            />
          </div>

          {/* AI OUTPUT CONTAINER */}
          <AnimatePresence>
            {resultText !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> AI Engine Result Output
                  </span>
                  {latencyMs && (
                    <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                      {latencyMs}ms • {tokensUsed || 32} tokens
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-foreground font-mono leading-relaxed bg-background/80 p-4 rounded-xl border border-border/40 whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin">
                  {resultText || "AI processing in progress..."}
                </div>

                {/* OUTPUT ACTIONS */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={handleCopyResult} className="h-7 text-xs gap-1 border-border/60">
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />} Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleExportResult} className="h-7 text-xs gap-1 border-border/60">
                    <Download className="w-3 h-3" /> Export Report
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MODAL FOOTER */}
        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-3 border-t border-border/40">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-9 rounded-xl">
            Close
          </Button>
          <Button
            size="sm"
            onClick={handleExecuteModel}
            disabled={isExecuting}
            className="gap-1.5 gradient-bg text-primary-foreground font-bold text-xs h-9 px-5 rounded-xl shadow-sm"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Executing {model.title}...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Execute AI Model
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}