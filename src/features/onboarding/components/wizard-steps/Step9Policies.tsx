import React from "react";
import { useDispatch } from "react-redux";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSaveEmployeeStep9Mutation, useCompleteEmployeeOnboardingMutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step9PoliciesProps {
  formData: {
    nd_agreement_accepted: boolean;
    code_of_conduct_accepted: boolean;
    it_policy_accepted: boolean;
    digital_signature: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step9PoliciesProps.formData>>;
  isLoading: boolean;
  isCompleting: boolean;
  onBack: () => void;
}

export function Step9Policies({ formData, setFormData, isLoading, isCompleting, onBack }: Step9PoliciesProps) {
  const dispatch = useDispatch();
  const [saveStep9] = useSaveEmployeeStep9Mutation();
  const [completeOnboarding] = useCompleteEmployeeOnboardingMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep9(formData).unwrap();
      await completeOnboarding().unwrap();
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-violet-400" /> Step 9: Compliance & Policy Acceptance
      </h3>
      <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
        <Label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.nd_agreement_accepted}
            onChange={(e) => setFormData({ ...formData, nd_agreement_accepted: e.target.checked })}
            className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
          />
          <span className="text-sm text-slate-300">
            I have read and agree to the Non-Disclosure & Intellectual Property Agreement.
          </span>
        </Label>
        <Label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.code_of_conduct_accepted}
            onChange={(e) => setFormData({ ...formData, code_of_conduct_accepted: e.target.checked })}
            className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
          />
          <span className="text-sm text-slate-300">
            I accept the Employee Code of Conduct and Workplace Policies.
          </span>
        </Label>
        <Label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={formData.it_policy_accepted}
            onChange={(e) => setFormData({ ...formData, it_policy_accepted: e.target.checked })}
            className="mt-0.5 w-4 h-4 text-violet-600 bg-slate-900 border-slate-700 rounded focus:ring-violet-500"
          />
          <span className="text-sm text-slate-300">
            I accept the IT Security Policy and Data Protection Guidelines.
          </span>
        </Label>
      </div>

      <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
        <Label className="block text-xs font-medium text-slate-300 mb-1">Digital Signature (Type Full Name)</Label>
        <input
          type="text"
          required
          value={formData.digital_signature}
          onChange={(e) => setFormData({ ...formData, digital_signature: e.target.value })}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          placeholder="Your full legal name as signature"
        />
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-800">
        <Button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Documents
        </Button>
        <Button
          type="submit"
          disabled={isLoading || isCompleting}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
        >
          {isCompleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Complete Onboarding <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}