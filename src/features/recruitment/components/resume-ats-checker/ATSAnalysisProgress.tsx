import React from "react";
import { Cpu, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ATSAnalysisProgressProps {
  progress?: number;
}

export function ATSAnalysisProgress({ progress = 68 }: ATSAnalysisProgressProps) {
  return (
    <Card className="border-border/60 shadow-lg p-8 sm:p-12 text-center bg-card/80 backdrop-blur-md">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground">Evaluating Resume against ATS Algorithms</h3>
          <p className="text-xs text-muted-foreground">
            Executing OCR text extraction, structured entity parsing, structural quality evaluation, and weighted multi-dimension ATS scoring...
          </p>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>Parsing Sections</span>
            <span>Calculating Weights</span>
          </div>
        </div>
      </div>
    </Card>
  );
}