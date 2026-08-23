import type { useFaceAttendanceData } from "./useFaceAttendanceData";

export function useFaceActions(d: ReturnType<typeof useFaceAttendanceData>) {
  const myStatus = d.me.data?.status || "not_checked_in";
  const isCheckedIn = myStatus === "checked_in" || myStatus === "present";
  const isCheckedOut = myStatus === "checked_out";
  const isNotCheckedIn = !isCheckedIn && !isCheckedOut;

  const handleOpenCheckIn = () => { d.setModalMode("check-in"); d.setIsModalOpen(true); };
  const handleOpenCheckOut = () => { d.setModalMode("check-out"); d.setIsModalOpen(true); };
  const handleRefreshAll = () => {
    d.me.refetch();
    if (d.activeTab === "history") d.hist.refetch();
    if (d.activeTab === "team" && d.auth.isManagerOrAbove) d.team.refetch();
    if (d.activeTab === "company" && d.auth.isHrOrAdmin) d.comp.refetch();
    if (d.activeTab === "analytics" && d.auth.isManagerOrAbove) d.analytics.refetch();
  };
  return { isCheckedIn, isCheckedOut, isNotCheckedIn, handleOpenCheckIn, handleOpenCheckOut, handleRefreshAll };
}