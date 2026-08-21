import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AnalyticsComplianceCard() {
  return (
    <Card className="border border-border/80 shadow-sm bg-card">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-foreground">Biometric Facial Verification Accuracy</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">High confidence verification with live anti-spoofing telemetry enabled.</p>
        </div>
        <Badge className="bg-emerald-600 text-white text-xs">99.8% Match Rate</Badge>
      </CardContent>
    </Card>
  );
}
