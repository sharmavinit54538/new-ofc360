import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, User } from "lucide-react";
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
import { useSaveStep4Mutation } from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";

interface Step4EmergencyContactProps {
  initialData?: {
    primary_contact_name?: string;
    primary_relationship?: string;
    primary_phone?: string;
    secondary_contact_name?: string;
    secondary_relationship?: string;
    secondary_phone?: string;
  };
  onSave: (data: {
    primary_contact_name: string;
    primary_relationship: string;
    primary_phone: string;
    secondary_contact_name: string;
    secondary_relationship: string;
    secondary_phone: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step4EmergencyContact({ initialData, onSave, onBack, isLoading }: Step4EmergencyContactProps) {
  const [formData, setFormData] = useState({
    primary_contact_name: initialData?.primary_contact_name || "",
    primary_relationship: initialData?.primary_relationship || "",
    primary_phone: initialData?.primary_phone || "",
    secondary_contact_name: initialData?.secondary_contact_name || "",
    secondary_relationship: initialData?.secondary_relationship || "",
    secondary_phone: initialData?.secondary_phone || "",
  });

  const [saveStep4, { isLoading: isSaving }] = useSaveStep4Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primary_contact_name || !formData.primary_phone) {
      toast.error("Primary contact name and phone are required.");
      return;
    }
    try {
      await onSave(formData);
      toast.success("Step 4 (Emergency Contacts) saved!");
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
        <h3 className="text-xl font-bold text-foreground">Step 4 — Emergency Contacts</h3>
        <p className="text-xs text-muted-foreground">Emergency contact details for workplace safety.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Primary Contact Name *</Label>
          <Input
            placeholder="Full name"
            value={formData.primary_contact_name}
            onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Relationship *</Label>
          <Select value={formData.primary_relationship} onValueChange={(val) => setFormData({ ...formData, primary_relationship: val })}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Primary Phone *</Label>
          <Input
            placeholder="+91 00000 00000"
            value={formData.primary_phone}
            onChange={(e) => setFormData({ ...formData, primary_phone: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Secondary Contact Name</Label>
          <Input
            placeholder="Full name"
            value={formData.secondary_contact_name}
            onChange={(e) => setFormData({ ...formData, secondary_contact_name: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Relationship</Label>
          <Select value={formData.secondary_relationship} onValueChange={(val) => setFormData({ ...formData, secondary_relationship: val })}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Child">Child</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Secondary Phone</Label>
          <Input
            placeholder="+91 00000 00000"
            value={formData.secondary_phone}
            onChange={(e) => setFormData({ ...formData, secondary_phone: e.target.value })}
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

export { Step4EmergencyContact };