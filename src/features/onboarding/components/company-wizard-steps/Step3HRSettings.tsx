import React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step3HRSettingsProps {
  formData: {
    leave_year_start: string;
    require_document_verification: boolean;
    auto_invite_employees: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step3HRSettingsProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step3HRSettings({ formData, setFormData, isLoading, onSubmit, onBack }: Step3HRSettingsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-indigo-400" /> Step 3: HR System Settings
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Leave Year Cycle Start
          </Label>
          <Select value={formData.leave_year_start} onValueChange={(e) => setFormData({ ...formData, leave_year_start: e.target.value })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 h-10">
              <SelectValue placeholder="Select cycle start" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January 1">January 1st (Calendar Year)</SelectItem>
              <SelectItem value="April 1">April 1st (Financial Year)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
          <input
            type="checkbox"
            id="docVerify"
            checked={formData.require_document_verification}
            onChange={(e) => setFormData({ ...formData, require_document_verification: e.target.checked })}
            className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
          />
          <Label htmlFor="docVerify" className="text-sm text-slate-300 cursor-pointer">
            Require mandatory HR approval for uploaded employee documents
          </Label>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
          <input
            type="checkbox"
            id="autoInvite"
            checked={formData.auto_invite_employees}
            onChange={(e) => setFormData({ ...formData, auto_invite_employees: e.target.checked })}
            className="w-4 h-4 text-indigo-600 bg-slate-900 border-slate-700 rounded focus:ring-indigo-500"
          />
          <Label htmlFor="autoInvite" className="text-sm text-slate-300 cursor-pointer">
            Auto-invite employees after onboarding completion
          </Label>
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
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}