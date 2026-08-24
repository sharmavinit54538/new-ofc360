import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";

interface Step9PoliciesProps {
  initialData?: {
    nda_acknowledged?: boolean;
    code_of_conduct_acknowledged?: boolean;
    signature_name?: string;
  };
  onSave: (data: {
    nda_acknowledged: boolean;
    code_of_conduct_acknowledged: boolean;
    signature_name: string;
  }) => Promise<void>;
  onComplete: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step9Policies({ initialData, onSave, onComplete, onBack, isLoading }: Step9PoliciesProps) {
  const [formData, setFormData] = useState({
    nda_acknowledged: initialData?.nda_acknowledged || false,
    code_of_conduct_acknowledged: initialData?.code_of_conduct_acknowledged || false,
    signature_name: initialData?.signature_name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nda_acknowledged || !formData.code_of_conduct_acknowledged) {
      toast.error("Please acknowledge all corporate policy agreements.");
      return;
    }
    if (!formData.signature_name.trim()) {
      toast.error("Please type your full legal signature.");
      return;
    }
    try {
      await onComplete();
      toast.success("🎉 Employee Onboarding Completed Successfully!");
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
        <h3 className="text-xl font-bold text-foreground">Step 9 — NDA & Corporate Policy Sign-off</h3>
        <p className="text-xs text-muted-foreground">Acknowledge corporate security policies and provide digital sign-off.</p>
      </div>

      <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/60 text-xs">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="nda"
            checked={formData.nda_acknowledged}
            onChange={(e) => setFormData({ ...formData, nda_acknowledged: e.target.checked })}
            className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
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
            className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
            required
          />
          <Label htmlFor="code" className="text-xs font-semibold cursor-pointer">
            I acknowledge the Workplace Code of Conduct, Anti-Harassment Policy, and Information Security Directives.
          </Label>
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <Label className="text-xs font-semibold">Type Full Legal Name as Electronic Signature *</Label>
        <Input
          placeholder="Full Legal Signature"
          value={formData.signature_name}
          onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
          required
          className="text-xs bg-secondary/30 h-9 border-border/60 rounded-xl"
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs">Back</Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="gradient-bg text-primary-foreground text-xs font-bold h-9 px-4 rounded-xl gap-1.5 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Completing Onboarding...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> Complete Onboarding
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}