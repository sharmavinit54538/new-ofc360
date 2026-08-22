import { TabsContent } from "@/components/ui/tabs";
import { useHRSettings } from "../../hooks/useHRSettings";
import { HRFormHeader } from "./HRFormHeader";
import { HRFormBody } from "./HRFormBody";
import { HRLoader } from "./HRLoader";

export function HRTab() {
  const { hrData, setHrData, isLoadingHR, isFetchingHR, isSavingHR, refetchHR, handleSaveHR } = useHRSettings();
  return (
    <TabsContent value="hr">
      <form onSubmit={handleSaveHR} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm relative">
        <HRFormHeader isSaving={isSavingHR} isLoading={isLoadingHR} isFetching={isFetchingHR} onRefresh={refetchHR} />
        {isLoadingHR ? <HRLoader /> : <HRFormBody data={hrData} onChange={setHrData} />}
      </form>
    </TabsContent>
  );
}