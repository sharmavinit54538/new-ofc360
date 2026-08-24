import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useSaveStep1Mutation } from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";

interface Step1PersonalInfoProps {
  initialData?: {
    full_name?: string;
    dob?: string;
    gender?: string;
    personal_email?: string;
    mobile?: string;
    address?: string;
  };
  onSave: (data: {
    full_name: string;
    dob: string;
    gender: string;
    personal_email: string;
    mobile: string;
    address: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function Step1PersonalInfo({ initialData, onSave, isLoading }: Step1PersonalInfoProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveStep1, { isLoading: isSaving }] = useSaveStep1Mutation();
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    dob: initialData?.dob || "",
    gender: initialData?.gender || "Male",
    personal_email: initialData?.personal_email || "",
    mobile: initialData?.mobile || "",
    address: initialData?.address || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.mobile) {
      toast.error("Please fill in mandatory personal fields.");
      return;
    }
    try {
      await onSave(formData);
      toast.success("Step 1 (Personal Info) saved successfully!");
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
        <h3 className="text-xl font-bold text-foreground">Step 1 — Personal Information</h3>
        <p className="text-xs text-muted-foreground">Provide basic personal and residential details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Full Legal Name *</Label>
          <Input
            placeholder="Enter full name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Date of Birth</Label>
          <Input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Gender</Label>
          <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
            <SelectTrigger className="text-xs bg-secondary/30 h-8 border-border/60 rounded-xl">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Mobile Number *</Label>
          <Input
            placeholder="+91 00000 00000"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Personal Email</Label>
          <Input
            type="email"
            placeholder="personal@email.com"
            value={formData.personal_email}
            onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Residential Address</Label>
          <Textarea
            placeholder="Full postal address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
            className="text-xs bg-secondary/30 border-border/60 rounded-xl resize-none font-sans"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </motion.form>
  );
}

function Step1PersonalInfo({ initialData, onSave, isLoading }: Step1PersonalInfoProps) {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    dob: initialData?.dob || "",
    gender: initialData?.gender || "Male",
    personal_email: initialData?.personal_email || "",
    mobile: initialData?.mobile || "",
    address: initialData?.address || "",
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 1 — Personal Information</h3>
        <p className="text-xs text-muted-foreground">Provide basic personal and residential details.</      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Full Legal Name *</Label>
          <Input
            placeholder="Enter full name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Date of Birth</Label>
          <Input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Gender</Label>
          <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
            <SelectTrigger className="text-xs bg-secondary/30 h-8 border-border/60 rounded-xl">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Mobile Number *</Label>
          <Input
            placeholder="+91 00000 00000"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Personal Email</Label>
          <Input
            type="email"
            placeholder="personal@email.com"
            value={formData.personal_email}
            onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Residential Address</Label>
          <Textarea
            placeholder="Full postal address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={3}
            className="text-xs bg-secondary/30 border-border/60 rounded-xl resize-none font-sans"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </motion.form>
  );
}

export { Step1PersonalInfo };