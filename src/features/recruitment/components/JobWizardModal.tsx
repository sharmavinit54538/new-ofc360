import { useState } from "react";
import { Sparkles, Plus, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function JobWizardModal({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { addJob } = useATSStore();
  const [step, setStep] = useState(1);

  // Form States
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("San Francisco, CA / Remote");
  const [workType, setWorkType] = useState<"Remote" | "Hybrid" | "Onsite">("Hybrid");
  const [employmentType, setEmploymentType] = useState<"Full-Time" | "Contract">("Full-Time");
  const [salaryMin, setSalaryMin] = useState(130000);
  const [salaryMax, setSalaryMax] = useState(170000);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerateJD = () => {
    if (!title) return toast.error("Please enter a Job Title first!");
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDescription(
        `We are seeking a high-performing ${title} to join our ${department} team. You will lead cutting-edge development, shape design architectures, and collaborate closely with cross-functional product stakeholders.`
      );
      toast.success("AI Job Description generated successfully!");
    }, 1200);
  };

  const handleFinish = () => {
    if (!title) return toast.error("Job title is required");
    addJob({
      title,
      department,
      location,
      workType,
      employmentType,
      experienceLevel: "Senior",
      salaryMin,
      salaryMax,
      currency: "USD",
      description: description || "Role description.",
      responsibilities: ["Develop robust user interfaces", "Work with cross-functional teams"],
      requirements: ["Strong proficiency in domain skills"],
      perks: ["Health Insurance", "Remote work flexibility"],
      screeningQuestions: [],
      status: "Published",
      publishedTo: { careersSite: true, linkedIn: true, indeed: true, glassdoor: false },
      pipelineStages: ["Applied", "Screening", "Tech Interview", "Culture Round", "Offer Extended", "Hired"]
    });

    toast.success(`Job Opening "${title}" created & published!`);
    setOpen(false);
    setStep(1);
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Multi-Step Job Creator Wizard</span>
            <Badge variant="outline">Step {step} of 4</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Wizard Steps indicator */}
        <div className="flex items-center gap-2 py-2 border-b border-border/40 text-xs font-medium">
          <span className={`px-2.5 py-1 rounded-full ${step === 1 ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"}`}>1. Role Basics</span>
          <span>→</span>
          <span className={`px-2.5 py-1 rounded-full ${step === 2 ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"}`}>2. AI JD Generator</span>
          <span>→</span>
          <span className={`px-2.5 py-1 rounded-full ${step === 3 ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"}`}>3. Compensation</span>
          <span>→</span>
          <span className={`px-2.5 py-1 rounded-full ${step === 4 ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"}`}>4. Review & Publish</span>
        </div>

        <div className="py-4 space-y-4 text-sm">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Job Title *</Label>
                <Input placeholder="e.g. Lead AI Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product Design">Product Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Work Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Workplace Type</Label>
                  <Select value={workType} onValueChange={(val: any) => setWorkType(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Employment Type</Label>
                  <Select value={employmentType} onValueChange={(val: any) => setEmploymentType(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Job Description & Responsibilities</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAIGenerateJD}
                  disabled={isGenerating}
                  className="gap-1.5 text-xs text-purple-400 border-purple-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isGenerating ? "Generating with AI..." : "AI Generate Description"}
                </Button>
              </div>
              <Textarea
                placeholder="Click AI Generate Description above or type role specs..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label>Target Compensation Range (USD)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Minimum Salary ($)</Label>
                  <Input type="number" value={salaryMin} onChange={(e) => setSalaryMin(Number(e.target.value))} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Maximum Salary ($)</Label>
                  <Input type="number" value={salaryMax} onChange={(e) => setSalaryMax(Number(e.target.value))} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 bg-secondary/30 p-4 rounded-xl border border-border/40">
              <h4 className="font-bold text-base">{title || "Untitled Role"}</h4>
              <p className="text-xs text-muted-foreground">{department} · {location} · {workType}</p>
              <p className="text-xs font-mono text-primary">${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} USD</p>
              <p className="text-xs text-muted-foreground line-clamp-3">{description}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="gradient-bg">
              Publish Job Opening <Check className="w-4 h-4 ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}