import { ReportsHubHeader } from "./header/ReportsHubHeader";
import { ReportStatsCards } from "./stats/ReportStatsCards";
import { ReportsCategoryTabs } from "./tabs/ReportsCategoryTabs";

export function ReportsHubTop({ s, c }: { s: any; c: any }) {
  return (
    <>
      <ReportsHubHeader dateFrom={s.dateFrom} setDateFrom={s.setDateFrom} dateTo={s.dateTo} setDateTo={s.setDateTo} onOpenCreate={() => s.setIsModalOpen(true)} />
      <ReportStatsCards stats={c.stats} loading={c.statsLoading} />
      <ReportsCategoryTabs activeCategory={s.activeCategory} onSelect={s.setActiveCategory} />
    </>
  );
}
