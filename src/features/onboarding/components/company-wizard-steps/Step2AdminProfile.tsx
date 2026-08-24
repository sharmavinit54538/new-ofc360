import React from "react";
import { UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Step2AdminProfileProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    designation: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step2AdminProfileProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step2AdminProfile({ formData, setFormData, isLoading, onSubmit, onBack }: Step2AdminProfileProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <UserCheck className="w-5 h-5 text-indigo-400" /> Step 2: Admin Profile
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            First Name *
          </Label>
          <Input
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Last Name *
          </Label>
          <Input
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Work Email *
          </Label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Phone Number
          </Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Designation
          </Label>
          <Input
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Company Administrator"
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
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}