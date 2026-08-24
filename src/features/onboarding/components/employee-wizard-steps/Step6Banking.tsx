import React from "react";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface Step6BankingProps {
  formData: {
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_code: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step6BankingProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step6Banking({ formData, setFormData, isLoading, onSubmit, onBack }: Step6BankingProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 6 — Payroll Banking</h3>
        <p className="text-xs text-muted-foreground">Direct salary deposit bank details.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Account Holder Name</Label>
          <Input
            placeholder="Name as per bank account"
            value={formData.account_holder_name}
            onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Bank Name</Label>
          <Input
            placeholder="e.g. HDFC Bank / ICICI Bank"
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Account Number *</Label>
          <Input
            placeholder="Bank account number"
            value={formData.account_number}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">IFSC Code *</Label>
          <Input
            placeholder="e.g. HDFC0001234"
            value={formData.ifsc_code}
            onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
            required
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