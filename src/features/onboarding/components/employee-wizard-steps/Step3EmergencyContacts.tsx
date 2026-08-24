import React from "react";
import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface Step3EmergencyContactsProps {
  formData: {
    emergency_name: string;
    relationship: string;
    emergency_phone: string;
    alternate_phone: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Step3EmergencyContactsProps["formData"]>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function Step3EmergencyContacts({ formData, setFormData, isLoading, onSubmit, onBack }: Step3EmergencyContactsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 3 — Emergency Contacts & Dependents</h3>
        <p className="text-xs text-muted-foreground">Emergency contacts for workplace safety and family insurance coverage.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Primary Contact Name *</Label>
          <Input
            placeholder="Full name"
            value={formData.emergency_name}
            onChange={(e) => setFormData({ ...formData, emergency_name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Relationship</Label>
          <Select value={formData.relationship} onValueChange={(val) => setFormData({ ...formData, relationship: val })}>
            <SelectTrigger><SelectValue placeholder="Relationship" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Parent">Parent</SelectItem>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Sibling">Sibling</SelectItem>
              <SelectItem value="Guardian">Guardian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Emergency Mobile Number *</Label>
          <Input
            placeholder="+91 00000 00000"
            value={formData.emergency_phone}
            onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Alternate Phone (Optional)</Label>
          <Input
            placeholder="+91 00000 00000"
            value={formData.alternate_phone}
            onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
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