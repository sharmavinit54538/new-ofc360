import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompanyFormHeader({ isSaving, isLoading }: { isSaving?: boolean; isLoading?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4">
      <div>
        <h3 className="text-base font-bold text-foreground">Organization Identity & Details</h3>
        <p className="text-xs text-muted-foreground">Enter official registered company information and corporate metadata.</p>
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isSaving || isLoading}
        className="gradient-bg gap-1.5 text-xs text-primary-foreground font-semibold shadow-xs"
      >
        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}

