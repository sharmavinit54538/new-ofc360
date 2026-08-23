import { Tabs } from "@/components/ui/tabs";
import { AIFaceTabsList } from "./tabs/AIFaceTabsList";
import { PersonalHistoryTab } from "./history/PersonalHistoryTab";
import { TeamAttendanceTab } from "./team/TeamAttendanceTab";
import { CompanyRosterTab } from "./company/CompanyRosterTab";
import { AnalyticsTab } from "./analytics/AnalyticsTab";

export function AIFaceTabsContainer({ d }: { d: any }) {
  const { auth, activeTab, setActiveTab, hist, team, comp, analytics } = d;
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <AIFaceTabsList isManagerOrAbove={auth.isManagerOrAbove} isHrOrAdmin={auth.isHrOrAdmin} />
      <PersonalHistoryTab hist={hist} />
      {auth.isManagerOrAbove && <TeamAttendanceTab team={team} />}
      {auth.isHrOrAdmin && <CompanyRosterTab comp={comp} />}
      {auth.isManagerOrAbove && <AnalyticsTab analyticsData={analytics.data} />}
    </Tabs>
  );
}