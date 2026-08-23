import { Clock, Users, Building2, BarChart3 } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIFaceTabsList({ isManagerOrAbove, isHrOrAdmin }: { isManagerOrAbove: boolean; isHrOrAdmin: boolean }) {
  return (
    <TabsList className="bg-card border border-border/60 p-1 rounded-xl h-auto flex flex-wrap gap-1">
      <TabsTrigger value="history" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2"><Clock className="w-3.5 h-3.5" /><span>My Attendance History</span></TabsTrigger>
      {isManagerOrAbove && <TabsTrigger value="team" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2"><Users className="w-3.5 h-3.5" /><span>Team Attendance</span></TabsTrigger>}
      {isHrOrAdmin && <TabsTrigger value="company" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2"><Building2 className="w-3.5 h-3.5" /><span>Company Roster</span></TabsTrigger>}
      {isManagerOrAbove && <TabsTrigger value="analytics" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-2"><BarChart3 className="w-3.5 h-3.5" /><span>Analytics & Trends</span></TabsTrigger>}
    </TabsList>
  );
}
