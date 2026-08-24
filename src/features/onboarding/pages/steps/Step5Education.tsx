import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSaveStep5Mutation } from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";

interface Step5EducationProps {
  initialData?: {
    degree?: string;
    institution?: string;
    field_of_study?: string;
    passing_year?: string;
    grade?: string;
  };
  onSave: (data: {
    degree: string;
    institution: string;
    field_of_study: string;
    passing_year: string;
    grade: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step5Education({ initialData, onSave, onBack, isLoading }: Step5EducationProps) {
  const [formData, setFormData] = useState({
    degree: initialData?.degree || "",
    institution: initialData?.institution || "",
    field_of_study: initialData?.field_of_study || "",
    passing_year: initialData?.passing_year || "",
    grade: initialData?.grade || "",
  });

  const [saveStep5, { isLoading: isSaving }] = useSaveStep5Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree || !formData.institution) {
      toast.error("Degree and Institution are required.");
      return;
    }
    try {
      await onSave(formData);
      toast.success("Step 5 (Education) saved!");
    } catch (err: any) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 5 — Education Records</h3>
        <p className="text-xs text-muted-foreground">Highest qualification and academic institution details.</      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Degree / Qualification *</Label>
          <Input
            placeholder="e.g. B.Tech Computer Science / MBA"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Institution / University *</Label>
          <Input
            placeholder="University name"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Field of Study</Label>
          <Input
            placeholder="e.g. Engineering / Business"
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value }))
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Year of Passing</Label>
          <Input
            placeholder="e.g. 2024"
            value={formData.passing_year}
            onChange={(e) => setFormData({ ...formData, passing_year: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Grade / CGPA / Percentage</Label>
          <Input
            placeholder="e.g. 8.5 CGPA / 85%"
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            className="text-xs h-8"
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs">Back</Button>
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </motion.form>
  );
}

export { Step5Education };