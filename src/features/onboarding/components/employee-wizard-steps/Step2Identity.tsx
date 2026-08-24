import React from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface Step2IdentityProps {
  formData: {
    aadhaar_number: string;
    pan_number: string;
    passport_number: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step2IdentityProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step2Identity({ formData, setFormData, isLoading, onSubmit, onBack }: Step2IdentityProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 2 — Identity Proofs</h3>
        <p className="text-xs text-muted-foreground">Government identity numbers for tax and compliance verification.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Aadhaar Card Number *</Label>
          <Input
            placeholder="12-digit Aadhaar number"
            value={formData.aadhaar_number}
            onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">PAN Card Number *</Label>
          <Input
            placeholder="10-digit PAN (e.g. ABCDE1234F)"
            value={formData.pan_number}
            onChange={(e) => setFormData({ ...formData, pan_number: e.target.value.toUpperCase() })}
            required
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Passport Number (Optional)</Label>
          <Input
            placeholder="Passport number"
            value={formData.passport_number}
            onChange={(e) => setFormData({ ...formData, passport_number: e.target.value.toUpperCase() })}
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