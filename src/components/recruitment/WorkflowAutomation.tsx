import { useState } from "react";
import { Zap, Plus, Play, CheckCircle2, SwitchCamera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function WorkflowAutomation() {
  const { automations, toggleAutomation } = useATSStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Trigger-Action Workflow Automation Engine</h2>
          <p className="text-sm text-muted-foreground">
            Configure automated rules (If candidate moves to Stage X → Trigger Email Y & Schedule Meet Link).
          </p>
        </div>

        <Button size="sm" onClick={() => toast.info("New Trigger-Action Rule Creator launched")} className="gap-1.5 gradient-bg shadow">
          <Plus className="w-4 h-4" /> Add Trigger Rule
        </Button>
      </div>

      <div className="space-y-4">
        {automations.map((auto) => (
          <div key={auto.id} className="glass-card rounded-xl p-5 border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">{auto.id}</Badge>
                  <h3 className="font-bold text-base">{auto.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  IF <span className="text-primary font-mono">{auto.trigger}</span> THEN <span className="text-emerald-400 font-mono">{auto.action}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{auto.isActive ? "Active Rule" : "Paused"}</span>
              <Switch checked={auto.isActive} onCheckedChange={() => toggleAutomation(auto.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}