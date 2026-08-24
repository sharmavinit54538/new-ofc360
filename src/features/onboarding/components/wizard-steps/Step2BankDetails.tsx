import React from "react";
import { useDispatch } from "react-redux";
import { CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveEmployeeStep2Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step2BankDetailsProps {
  formData: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    branch_name: string;
    account_type: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step2BankDetailsProps.formData>>;
  isLoading: boolean;
  onBack: () => void;
}

export function Step2BankDetails({ formData, setFormData, isLoading, onBack }: Step2BankDetailsProps) {
  const dispatch = useDispatch();
  const [saveStep2] = useSaveEmployeeStep2Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep2(formData).unwrap();
      dispatch(setCurrentWizardStep(3));
    } catch (err) {
      console.error("Failed to save step 2:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-violet-400" /> Step 2: Direct Deposit & Bank Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Bank Name *</Label>
          <Input
            required
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Account Number *</Label>
          <Input
            required
            value={formData.account_number}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">IFSC / Routing Code *</Label>
          <Input
            required
            value={formData.ifsc_code}
            onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Branch Name</Label>
          <Input
            value={formData.branch_name}
            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Account Type</Label>
          <Select value={formData.account_type} onValueChange={(v) => setFormData({ ...formData, account_type: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="current">Current</SelectItem>
            </SelectContent>
          </Select>
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