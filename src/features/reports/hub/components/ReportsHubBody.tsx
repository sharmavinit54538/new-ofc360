import { ReportsHubTop } from "./ReportsHubTop";
import { ReportsCategoryContent } from "./tabs/ReportsCategoryContent";
import { ReportsListSection } from "./reports-list/ReportsListSection";
import { CreateReportModal } from "./modal/CreateReportModal";

export function ReportsHubBody({ d }: { d: any }) {
  const { s, c, wf, perf, eng, cult, comp, a } = d;
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 space-y-8">
      <ReportsHubTop s={s} c={c} />
      <ReportsCategoryContent activeCategory={s.activeCategory} wf={wf} perf={perf} eng={eng} cult={cult} comp={comp} />
      <ReportsListSection searchTerm={s.searchTerm} setSearchTerm={s.setSearchTerm} selectedType={s.selectedType} setSelectedType={s.setSelectedType} reportsList={c.reportsList} loading={c.reportsLoading} isRefreshing={a.isRefreshing} isDeleting={a.isDeleting} onRefresh={a.handleRefresh} onDelete={a.handleDelete} />
      <CreateReportModal isOpen={s.isModalOpen} onClose={() => s.setIsModalOpen(false)} />
    </div>
  );
}
