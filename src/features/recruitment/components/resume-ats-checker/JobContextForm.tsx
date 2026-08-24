import React from "react";
import { Target, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface JobContextFormProps {
  showJobContext: boolean;
  onToggle: () => void;
  jobTitle: string;
  onJobTitleChange: (value: string) => void;
  requiredSkills: string;
  onRequiredSkillsChange: (value: string) => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
}

export function JobContextForm({
  showJobContext,
  onToggle,
  jobTitle,
  onJobTitleChange,
  requiredSkills,
  onRequiredSkillsChange,
  jobDescription,
  onJobDescriptionChange,
}: JobContextFormProps) {
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-secondary/20">
      <button
        type="button"
        onClick={onToggle}
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
                  onChange={(e) => onJobTitleChange(e.target.value)}
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
                  onChange={(e) => onRequiredSkillsChange(e.target.value)}
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
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                className="bg-background text-xs"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}