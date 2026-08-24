import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";

interface Step2BankInfoProps {
  initialData?: {
    account_number?: string;
    bank_name?: string;
    ifsc_code?: string;
    branch_name?: string;
    account_type?: string;
  };
  onSave: (data: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    branch_name: string;
    account_type: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step2BankInfo({ initialData, onSave, onBack, isLoading }: Step2BankInfoProps) {
  const [formData, setFormData] = useState({
    account_number: initialData?.account_number || "",
    bank_name: initialData?.bank_name || "",
    ifsc_code: initialData?.ifsc_code || "",
    branch_name: initialData?.branch_name || "",
    account_type: initialData?.account_type || "savings",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success("Step 2 (Bank Details) saved successfully!");
    } catch (err: any) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 2 — Bank Details</h3>
        <p className="text-xs text-muted-foreground">Direct salary deposit bank details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Bank Name *</Label>
          <Input
            placeholder="e.g. HDFC Bank / ICICI Bank"
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Account Number *</Label>
          <Input
            placeholder="Bank account number"
            value={formData.account_number}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            required
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">IFSC Code *</Label>
          <Input
            placeholder="e.g. HDFC0001234"
            value={formData.ifsc_code}
            onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value.toUpperCase() })}
            required
            className="text-xs h-8 font-mono"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Branch Name</Label>
          <Input
            placeholder="Branch name"
            value={formData.branch_name}
            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
            className="text-xs h-8"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Account Type</Label>
          <Select value={formData.account_type} onValueChange={(val) => setFormData({ ...formData, account_type: val })}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs">Back</Button>
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </motion.form>
  );
}