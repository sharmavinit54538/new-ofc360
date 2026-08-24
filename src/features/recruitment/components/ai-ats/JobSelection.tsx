import React from "react";
import { Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobSelectionProps {
  jobInputMode: "select" | "custom";
  setJobInputMode: (mode: "select" | "custom") => void;
  backendJobs: any[];
  jobsLoading: boolean;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  customJobTitle: string;
  setCustomJobTitle: (title: string) => void;
  customDept: string;
  setCustomDept: (dept: string) => void;
  customExpYears: string;
  setCustomExpYears: (years: string) => void;
  customDescription: string;
  setCustomDescription: (desc: string) => void;
}

export function JobSelection({
  jobInputMode,
  setJobInputMode,
  backendJobs,
  jobsLoading,
  selectedJobId,
  setSelectedJobId,
  customJobTitle,
  setCustomJobTitle,
  customDept,
  setCustomDept,
  customExpYears,
  setCustomExpYears,
  customDescription,
  setCustomDescription,
}: JobSelectionProps) {
  return (
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

              {selectedJobId && backendJobs.find((j) => j.id === selectedJobId) && (
                <div className="p-3.5 rounded-2xl bg-secondary/30 border border-border/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>{backendJobs.find((j) => j.id === selectedJobId)?.title}</span>
                    <Badge variant="outline" className="text-[10px]">{backendJobs.find((j) => j.id === selectedJobId)?.department}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <Badge variant="secondary" className="text-[9px]">{backendJobs.find((j) => j.id === selectedJobId)?.location}</Badge>
                    <Badge variant="secondary" className="text-[9px]">{backendJobs.find((j) => j.id === selectedJobId)?.employment_type}</Badge>
                    <Badge variant="secondary" className="text-[9px]">{backendJobs.find((j) => j.id === selectedJobId)?.vacancies} vacancies</Badge>
                    <Badge variant="secondary" className="text-[9px]">{backendJobs.find((j) => j.id === selectedJobId)?.status}</Badge>
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
  );
}