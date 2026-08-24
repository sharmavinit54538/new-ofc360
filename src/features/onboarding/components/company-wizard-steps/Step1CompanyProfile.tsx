import React from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface Step1CompanyProfileProps {
  formData: {
    company_name: string;
    industry: string;
    website: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step1CompanyProfileProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function Step1CompanyProfile({ formData, setFormData, isLoading, onSubmit }: Step1CompanyProfileProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-indigo-400" /> Step 1: Company Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Company Name *
          </Label>
          <Input
            required
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Acme Technologies Inc."
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Industry
          </Label>
          <Input
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="Software & IT Services"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Website URL
          </Label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="https://acme.com"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Headquarters City
          </Label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="San Francisco"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            State
          </Label>
          <Input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="CA"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">
            Country
          </Label>
          <Input
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="USA"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/40"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}