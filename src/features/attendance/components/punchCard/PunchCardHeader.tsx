import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function PunchCardHeader() {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" /> Facial Punch Station
        </CardTitle>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">AI Verified</span>
      </div>
      <CardDescription className="text-xs">Selfie biometric matching with real-time verification.</CardDescription>
    </CardHeader>
  );
}
