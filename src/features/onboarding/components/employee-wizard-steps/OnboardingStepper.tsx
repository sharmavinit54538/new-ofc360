import React from "react";
import { Progress } from "@/components/ui/progress";
import {
  User,
  ShieldCheck,
  PhoneCall,
  GraduationCap,
  Briefcase,
  Building,
  Receipt,
  Upload,
  FileCheck,
} from "lucide-react";

interface Step {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OnboardingStepperProps {
  activeStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  completionPercentage: number;
}

const STEPS: Step[] = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Identity", icon: ShieldCheck },
  { id: 3, label: "Contacts", icon: PhoneCall },
  { id: 4, label: "Education", icon: GraduationCap },
  { id: 5, label: "Experience", icon: Briefcase },
  { id: 6, label: "Banking", icon: Building },
  { id: 7, label: "Tax & PF", icon: Receipt },
  { id: 8, label: "Documents", icon: Upload },
  { id: 9, label: "NDA & Policies", icon: FileCheck },
];

export function OnboardingStepper({ activeStep, completedSteps, onStepClick, completionPercentage }: OnboardingStepperProps) {
  return (
    <div className="glass-card border border-border/80 rounded-2xl p-4 sm:p-6 bg-card space-y-4 shadow-sm">
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground pb-2 border-b border-border/50">
        <span>Onboarding Completion</span>
        <span className="text-primary">{completionPercentage}% Completed</span>
      </div>

      <Progress value={completionPercentage} className="h-2" />

      {/* Stepper Buttons */}
      <div className="grid grid-cols-9 gap-1 pt-2 overflow-x-auto">
        {STEPS.map((s) => {
          const IconComp = s.icon;
          const isDone = completedSteps.includes(s.id);
          const isCurrent = activeStep === s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onStepClick(s.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all text-center border ${
                isCurrent
                  ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                  : isDone
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 font-semibold"
                  : "bg-secondary/30 text-muted-foreground border-border"
              }`}
            >
              <IconComp className="w-3.5 h-3.5 mb-1" />
              <span className="text-[9px] hidden md:inline">{s.id}. {s.label}</span>
              <span className="text-[8px] md:hidden">{s.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}