import { TabsContent } from "@/components/ui/tabs";
import { PersonalHistoryFilters } from "./PersonalHistoryFilters";
import { PersonalHistoryTable } from "./PersonalHistoryTable";
import { PersonalHistoryPagination } from "./PersonalHistoryPagination";

export function PersonalHistoryTab({ hist }: { hist: any }) {
  return (
    <TabsContent value="history" className="space-y-4">
      <PersonalHistoryFilters status={hist.historyStatus} setStatus={(s: string) => { hist.setHistoryStatus(s); hist.setHistoryPage(1); }} month={hist.historyMonth} setMonth={(m: string) => { hist.setHistoryMonth(m); hist.setHistoryPage(1); }} total={hist.data?.total} />
      <div className="space-y-0">
        <PersonalHistoryTable isLoading={hist.isLoading} items={hist.data?.items} />
        <PersonalHistoryPagination page={hist.data?.page} totalPages={hist.data?.totalPages} setPage={hist.setHistoryPage} />
      </div>
    </TabsContent>
  );
}
