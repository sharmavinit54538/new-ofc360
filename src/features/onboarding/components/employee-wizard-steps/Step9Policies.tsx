import React from "react";
import { FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface Step9PoliciesProps {
  formData: {
    nda_acknowledged: boolean;
    code_of_conduct_acknowledged: boolean;
    signature_name: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step9PoliciesProps["formData"]>>;
  isSavingStep9: boolean;
  isCompletingOnboarding: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step9Policies({ formData, setFormData, isSavingStep9, isCompletingOnboarding, onSubmit, onBack }: Step9PoliciesProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 9 — NDA & Corporate Policy Sign-off</h3>
        <p className="text-xs text-muted-foreground">Acknowledge corporate security policies and provide digital sign-off.</p>
      </div>

      <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60 text-xs space-y-2">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="nda"
            checked={formData.nda_acknowledged}
            onChange={(e) => setFormData({ ...formData, nda_acknowledged: e.target.checked })}
            className="mt-0.5"
            required
          />
          <Label htmlFor="nda" className="text-xs font-semibold cursor-pointer">
            I agree to the Non-Disclosure Agreement (NDA) and Intellectual Property Assignment terms of OFC360.
          </Label>
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="code"
            checked={formData.code_of_conduct_acknowledged}
            onChange={(e) => setFormData({ ...formData, code_of_conduct_acknowledged: e.target.checked })}
            className="mt-0.5"
            required
          />
          <Label htmlFor="code" className="text-xs font-semibold cursor-pointer">
            I acknowledge the Workplace Code of Conduct, Anti-Harassment Policy, and Information Security Directives.
          </Label>
        </div>

        <div className="space-y-1 pt-2">
          <Label className="text-xs font-semibold">Type Full Legal Name as Electronic Signature *</Label>
          <Input
            placeholder="Full Legal Signature"
            value={formData.signature_name}
            onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs"><ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back</Button>
        <Button type="submit" disabled={isSavingStep9 || isCompletingOnboarding} className="gradient-bg gap-2 text-xs">
          {isSavingStep9 || isCompletingOnboarding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Complete Onboarding</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}