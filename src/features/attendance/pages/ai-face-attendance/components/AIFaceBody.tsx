import { AIFaceHeader } from "./header/AIFaceHeader";
import { TodayStationHero } from "./hero/TodayStationHero";
import { AIFaceTabsContainer } from "./AIFaceTabsContainer";
import { FaceCaptureModal } from "../../../components/FaceCaptureModal";

export function AIFaceBody({ d, actions }: any) {
  const { auth, isModalOpen, setIsModalOpen, modalMode, me, hist } = d;
  const { isCheckedIn, isCheckedOut, isNotCheckedIn, handleOpenCheckIn, handleOpenCheckOut, handleRefreshAll } = actions;
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AIFaceHeader isRefreshing={me.isFetching || hist.isFetching} onRefresh={handleRefreshAll} />
      <TodayStationHero user={auth.user} currentRole={auth.currentRole} myAttendance={me.data} isLoadingMe={me.isLoading} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} isNotCheckedIn={isNotCheckedIn} onCheckIn={handleOpenCheckIn} onCheckOut={handleOpenCheckOut} />
      <AIFaceTabsContainer d={d} />
      <FaceCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} onSuccess={handleRefreshAll} />
    </div>
  );
}