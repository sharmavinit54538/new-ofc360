import { useState } from "react";
import { Info, Database, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface TalentIntelligenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  moduleName?: string;
}

export function TalentIntelligenceModal({
  open,
  onOpenChange,
  title = "Data Required for Talent Intelligence",
  moduleName = "Talent Intelligence"
}: TalentIntelligenceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-foreground tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Organizational Data Connectivity Info
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs">
          <div className="p-3.5 rounded-xl bg-secondary/40 border border-border/50 space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <span>System Notification</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {moduleName} requires organizational data before insights, analytics, and recommendations can be generated.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-background/60 border border-border/30 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Status: Ready for Sync</span>
            <span className="font-mono text-[10px] text-emerald-400">Zero Mock State</span>
          </div>
        </div>

        <DialogFooter>
          <Button size="sm" onClick={() => onOpenChange(false)} className="w-full gradient-bg">
            Understand & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}