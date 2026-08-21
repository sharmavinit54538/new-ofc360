import { useGetTodayStatusQuery, useCheckInMutation, useCheckOutMutation } from "../../attendanceApi";
import { useAttendanceCamera } from "../../hooks/useAttendanceCamera";

export function usePunchCardData() {
  const { data: todayStatusRes, isLoading: isStatusLoading, refetch } = useGetTodayStatusQuery();
  const [checkInApi, { isLoading: isCheckingIn }] = useCheckInMutation();
  const [checkOutApi, { isLoading: isCheckingOut }] = useCheckOutMutation();
  const camera = useAttendanceCamera("checkin");
  const today = todayStatusRes?.data;
  const isCheckedIn = !!today?.checked_in;
  const isCheckedOut = !!today?.checked_out;

  return {
    today, isCheckedIn, isCheckedOut, isStatusLoading, isCheckingIn, isCheckingOut,
    camera, refetch, checkInApi, checkOutApi,
  };
}
