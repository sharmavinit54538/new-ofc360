import React from "react";
import { useDispatch } from "react-redux";
import { PhoneCall, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveEmployeeStep4Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step4EmergencyContactsProps {
  formData: {
    primary_contact_name: string;
    primary_relationship: string;
    primary_phone: string;
    secondary_contact_name: string;
    secondary_relationship: string;
    secondary_phone: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step4EmergencyContactsProps.formData>>;
  isLoading: boolean;
  onBack: () => void;
}

export function Step4EmergencyContacts({ formData, setFormData, isLoading, onBack }: Step4EmergencyContactsProps) {
  const dispatch = useDispatch();
  const [saveStep4] = useSaveEmployeeStep4Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep4(formData).unwrap();
      dispatch(setCurrentWizardStep(5));
    } catch (err) {
      console.error("Failed to save step 4:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <PhoneCall className="w-5 h-5 text-violet-400" /> Step 4: Emergency Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Primary Contact Name *</Label>
          <Input
            required
            value={formData.primary_contact_name}
            onChange={(e) => setFormData({ ...formData, primary_contact_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Relationship *</Label>
          <Input
            required
            value={formData.primary_relationship}
            onChange={(e) => setFormData({ ...formData, primary_relationship: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</Label>
          <Input
            required
            value={formData.primary_phone}
            onChange={(e) => setFormData({ ...formData, primary_phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Secondary Contact Name</Label>
          <Input
            value={formData.secondary_contact_name}
            onChange={(e) => setFormData({ ...formData, secondary_contact_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Relationship</Label>
          <Input
            value={formData.secondary_relationship}
            onChange={(e) => setFormData({ ...formData, secondary_relationship: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</Label>
          <Input
            value={formData.secondary_phone}
            onChange={(e) => setFormData({ ...formData, secondary_phone: e.target.value })}
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