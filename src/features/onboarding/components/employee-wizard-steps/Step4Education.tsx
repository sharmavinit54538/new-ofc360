import React from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface Step4EducationProps {
  formData: {
    degree: string;
    institution: string;
    field_of_study: string;
    passing_year: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step4EducationProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step4Education({ formData, setFormData, isLoading, onSubmit, onBack }: Step4EducationProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 4 — Education Records</h3>
        <p className="text-xs text-muted-foreground">Highest qualification and academic institution details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Degree / Qualification *</Label>
          <Input
            placeholder="e.g. B.Tech Computer Science / MBA"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">University / College *</Label>
          <Input
            placeholder="University name"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Field of Study</Label>
          <Input
            placeholder="e.g. Engineering / Business"
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Year of Passing</Label>
          <Input
            placeholder="e.g. 2024"
            value={formData.passing_year}
            onChange={(e) => setFormData({ ...formData, passing_year: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs"><ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back</Button>
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </form>
  );
}