import React from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface Step7TaxPFProps {
  formData: {
    tax_regime: string;
    uan_number: string;
    pf_account_number: string;
    nominee_name: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step7TaxPFProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step7TaxPF({ formData, setFormData, isLoading, onSubmit, onBack }: Step7TaxPFProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 7 — Tax Regime & PF Declaration</h3>
        <p className="text-xs text-muted-foreground">Select income tax regime and provident fund identifiers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Income Tax Regime</Label>
          <Select value={formData.tax_regime} onValueChange={(val) => setFormData({ ...formData, tax_regime: val })}>
            <SelectTrigger><SelectValue placeholder="Select Regime" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="New Regime">New Tax Regime (Default)</SelectItem>
              <SelectItem value="Old Regime">Old Tax Regime</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">UAN (Universal Account Number)</Label>
          <Input
            placeholder="12-digit UAN"
            value={formData.uan_number}
            onChange={(e) => setFormData({ ...formData, uan_number: e.target.value })}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">PF Account Number</Label>
          <Input
            placeholder="PF Account Number"
            value={formData.pf_account_number}
            onChange={(e) => setFormData({ ...formData, pf_account_number: e.target.value })}
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label className="text-xs font-semibold">Nominee Name for PF/Insurance</Label>
          <Input
            placeholder="Nominee full name"
            value={formData.nominee_name}
            onChange={(e) => setFormData({ ...formData, nominee_name: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs"><ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back</Button>
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </form>
  );
}