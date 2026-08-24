import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileCheck, Mail, Shield } from "lucide-react";
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
import { useSaveStep3Mutation } from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";

interface Step3StatutoryProps {
  initialData?: {
    pan_number?: string;
    aadhaar_number?: string;
    passport_number?: string;
    pf_account_number?: string;
    esi_number?: string;
  };
  onSave: (data: {
    pan_number: string;
    aadhaar_number: string;
    passport_number: string;
    pf_account_number: string;
    esi_number: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step3Statutory({ initialData, onSave, onBack, isLoading }: Step3StatutoryProps) {
  const [formData, setFormData] = useState({
    pan_number: initialData?.pan_number || "",
    aadhaar_number: initialData?.aadhaar_number || "",
    passport_number: initialData?.passport_number || "",
    pf_account_number: initialData?.pf_account_number || "",
    esi_number: initialData?.esi_number || "",
  });

  const [saveStep3, { isLoading: isSaving }] = useSaveStep3Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success("Step 3 (Statutory IDs) saved successfully!");
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
        <h3 className="text-xl font-bold text-foreground">Step 3 — Statutory IDs</h3>
        <p className="text-xs text-muted-foreground">Government identity numbers for tax and compliance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">PAN Number *</Label>
          <Input
            placeholder="10-digit PAN (e.g. ABCDE1234F)"
            value={formData.pan_number}
            onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Aadhaar Number *</Label>
          <Input
            placeholder="12-digit Aadhaar number"
            value={formData.aadhaar_number}
            onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Passport Number</Label>
          <Input
            placeholder="Passport number"
            value={formData.passport_number}
            onChange={(e) => setFormData({ ...formData, passport_number: e.target.value }))
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">PF Account Number</Label>
          <Input
            placeholder="PF account number"
            value={formData.pf_account_number}
            onChange={(e) => setFormData({ ...formData, pf_account_number: e.target.value }))
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">ESI Number</Label>
          <Input
            placeholder="ESI number"
            value={formData.esi_number}
            onChange={(e) => setFormData({ ...formData, esi_number: e.target.value }))
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

export { Step3Statutory };