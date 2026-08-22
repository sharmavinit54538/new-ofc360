import { TabsContent } from "@/components/ui/tabs";
import { useHRSettings } from "../../hooks/useHRSettings";
import { HRFormHeader } from "./HRFormHeader";
import { HRContactFields } from "./HRContactFields";
import { HRGrievanceFields } from "./HRGrievanceFields";
import { HRNotificationDirectives } from "./HRNotificationDirectives";
import { HRLoader } from "./HRLoader";

export function HRTab() {
  const { hrData, setHrData, isLoadingHR, isFetchingHR, isSavingHR, refetchHR, handleSaveHR } = useHRSettings();
  return (
    <TabsContent value="hr">
      <form onSubmit={handleSaveHR} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm relative">
        <HRFormHeader isSaving={isSavingHR} isLoading={isLoadingHR} isFetching={isFetchingHR} onRefresh={refetchHR} />
        {isLoadingHR ? <HRLoader /> : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><HRContactFields data={hrData} onChange={setHrData} /><HRGrievanceFields data={hrData} onChange={setHrData} /></div>
            <HRNotificationDirectives data={hrData} onChange={setHrData} />
          </>
        )}
      </form>
    </TabsContent>
  );
}
