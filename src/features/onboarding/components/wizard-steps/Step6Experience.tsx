import React from "react";
import { useDispatch } from "react-redux";
import { Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveEmployeeStep6Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step6ExperienceProps {
  formData: {
    previous_company: string;
    last_designation: string;
    employment_duration: string;
    reason_for_leaving: string;
    reference_contact: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step6ExperienceProps.formData>>;
  isLoading: boolean;
  onBack: () => void;
}

export function Step6Experience({ formData, setFormData, isLoading, onBack }: Step6ExperienceProps) {
  const dispatch = useDispatch();
  const [saveStep6] = useSaveEmployeeStep6Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep6(formData).unwrap();
      dispatch(setCurrentWizardStep(7));
    } catch (err) {
      console.error("Failed to save step 6:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-violet-400" /> Step 6: Prior Work Experience
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Previous Company</Label>
          <Input
            value={formData.previous_company}
            onChange={(e) => setFormData({ ...formData, previous_company: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Last Job Title</Label>
          <Input
            value={formData.last_designation}
            onChange={(e) => setFormData({ ...formData, last_designation: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Employment Duration</Label>
          <Input
            value={formData.employment_duration}
            onChange={(e) => setFormData({ ...formData, employment_duration: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Reason for Leaving</Label>
          <Input
            value={formData.reason_for_leaving}
            onChange={(e) => setFormData({ ...formData, reason_for_leaving: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Reference Contact</Label>
          <Input
            value={formData.reference_contact}
            onChange={(e) => setFormData({ ...formData, reference_contact: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-800">
        <Button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}