import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompanyFormHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4">
      <div>
        <h3 className="text-base font-bold text-foreground">Organization Identity & Details</h3>
        <p className="text-xs text-muted-foreground">Enter official registered company information and corporate metadata.</p>
      </div>
      <Button type="submit" size="sm" className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold">
        <Save className="w-3.5 h-3.5" /> Save Changes
      </Button>
    </div>
  );
}
