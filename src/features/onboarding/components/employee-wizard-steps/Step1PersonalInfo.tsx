import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight } from "lucide-react";

interface Step1PersonalInfoProps {
  formData: {
    full_name: string;
    dob: string;
    gender: string;
    personal_email: string;
    mobile: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step1PersonalInfoProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function Step1PersonalInfo({ formData, setFormData, isLoading, onSubmit }: Step1PersonalInfoProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
            <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
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

        <div className="space-y-1 sm:col-span-2">
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
          <Input
            placeholder="Full postal address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </form>
  );
}