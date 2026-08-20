import { useState } from "react";
import { BarChart3, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TalentIntelligenceModal } from "./TalentIntelligenceModal";

interface TalentIntelligenceEmptyStateProps {
  title?: string;
  description?: string;
  moduleName?: string;
}

export function TalentIntelligenceEmptyState({
  title = "No data available yet",
  description = "Connect organizational data to unlock intelligent talent insights.",
  moduleName = "Talent Intelligence"
}: TalentIntelligenceEmptyStateProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="glass-card rounded-2xl p-8 text-center space-y-4 border border-border/50 bg-secondary/10 max-w-xl mx-auto my-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20 shadow-sm">
          <BarChart3 className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-base text-foreground tracking-tight">{title}</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        </div>

      </div>

      <TalentIntelligenceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={`Data Required for ${moduleName}`}
        moduleName={moduleName}
      />
    </>
  );
}