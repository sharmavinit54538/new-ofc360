import React from "react";
import { useDispatch } from "react-redux";
import { FileCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveEmployeeStep3Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step3StatutoryIDsProps {
  formData: {
    pan_number: string;
    aadhaar_number: string;
    passport_number: string;
    pf_account_number: string;
    esi_number: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step3StatutoryIDsProps.formData>>;
  isLoading: boolean;
  onBack: () => void;
}

export function Step3StatutoryIDs({ formData, setFormData, isLoading, onBack }: Step3StatutoryIDsProps) {
  const dispatch = useDispatch();
  const [saveStep3] = useSaveEmployeeStep3Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep3(formData).unwrap();
      dispatch(setCurrentWizardStep(4));
    } catch (err) {
      console.error("Failed to save step 3:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <FileCheck className="w-5 h-5 text-violet-400" /> Step 3: Government Statutory IDs
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">PAN Number</Label>
          <Input
            value={formData.pan_number}
            onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Aadhaar Number</Label>
          <Input
            value={formData.aadhaar_number}
            onChange={(e) => setFormData({ ...formData, aadhaar_number: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Passport Number</Label>
          <Input
            value={formData.passport_number}
            onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">PF Account Number</Label>
          <Input
            value={formData.pf_account_number}
            onChange={(e) => setFormData({ ...formData, pf_account_number: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">ESI Number</Label>
          <Input
            value={formData.esi_number}
            onChange={(e) => setFormData({ ...formData, esi_number: e.target.value })}
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