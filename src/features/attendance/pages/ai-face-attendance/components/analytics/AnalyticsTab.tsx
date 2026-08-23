import { TabsContent } from "@/components/ui/tabs";
import { AnalyticsKpiCards } from "./AnalyticsKpiCards";
import { DailyTrendChart } from "./DailyTrendChart";
import { DepartmentStatsChart } from "./DepartmentStatsChart";

export function AnalyticsTab({ analyticsData }: { analyticsData: any }) {
  const dailyTrend = analyticsData?.dailyTrend || [];
  const deptStats = analyticsData?.departmentStats || [];
  return (
    <TabsContent value="analytics" className="space-y-6">
      <AnalyticsKpiCards analyticsData={analyticsData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyTrendChart data={dailyTrend} /><DepartmentStatsChart data={deptStats} />
      </div>
    </TabsContent>
  );
}
