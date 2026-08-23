import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReportDomainSelect({ activeTab, onSelect }: { activeTab: string; onSelect: (t: string) => void }) {
  return (
    <Select value={activeTab} onValueChange={onSelect}>
      <SelectTrigger className="w-60 text-xs h-9 bg-card border-border/70 font-semibold shadow-xs"><SelectValue placeholder="Select Report Domain" /></SelectTrigger>
      <SelectContent>
        {[
          { id: "workforce", label: "Workforce & Headcount Reports" },
          { id: "performance", label: "Performance & Appraisal Reports" },
          { id: "engagement", label: "Engagement & eNPS Reports" },
          { id: "culture", label: "Culture & D&I Telemetry" },
          { id: "compliance", label: "Compliance & Risk Audit Register" },
        ].map((t) => <SelectItem key={t.id} value={t.id} className="text-xs">{t.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
