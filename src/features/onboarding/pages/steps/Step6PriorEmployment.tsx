import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSaveStep6Mutation } from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";

interface Step6PriorEmploymentProps {
  initialData?: {
    previous_company?: string;
    last_designation?: string;
    employment_duration?: string;
    reason_for_leaving?: string;
    reference_contact?: string;
  };
  onSave: (data: {
    previous_company: string;
    last_designation: string;
    employment_duration: string;
    reason_for_leaving: string;
    reference_contact: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step6PriorEmployment({ initialData, onSave, onBack, isLoading }: Step6PriorEmploymentProps) {
  const [formData, setFormData] = useState({
    previous_company: initialData?.previous_company || "",
    last_designation: initialData?.last_designation || "",
    employment_duration: initialData?.employment_duration || "",
    reason_for_leaving: initialData?.reason_for_leaving || "",
    reference_contact: initialData?.reference_contact || "",
  });

  const [saveStep6, { isLoading: isSaving }] = useSaveStep6Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success("Step 6 (Prior Employment) saved!");
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
        <h3 className="text-xl font-bold text-foreground">Step 6 — Prior Work Experience</h3>
        <p className="text-xs text-muted-foreground">Previous employer and work history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Previous Company</Label>
          <Input
            placeholder="Company name"
            value={formData.previous_company}
            onChange={(e) => setFormData({ ...formData, previous_company: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Last Designation</Label>
          <Input
            placeholder="Role title"
            value={formData.last_designation}
            onChange={(e) => setFormData({ ...formData, last_designation: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Employment Duration</Label>
          <Input
            placeholder="e.g. 2 years 6 months"
            value={formData.employment_duration}
            onChange={(e) => setFormData({ ...formData, employment_duration: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Reason for Leaving</Label>
          <Input
            placeholder="Reason for leaving"
            value={formData.reason_for_leaving}
            onChange={(e) => setFormData({ ...formData, reason_for_leaving: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Reference Contact (Optional)</Label>
          <Input
            placeholder="Reference name and contact"
            value={formData.reference_contact}
            onChange={(e) => setFormData({ ...formData, reference_contact: e.target.value })}
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

export { Step6PriorEmployment };