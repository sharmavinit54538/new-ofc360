import { useFaceCheckInMutation, useFaceCheckOutMutation } from "../../attendanceApi";

export function useFaceMutations() {
  const [faceCheckIn, { isLoading: isCheckingIn }] = useFaceCheckInMutation();
  const [faceCheckOut, { isLoading: isCheckingOut }] = useFaceCheckOutMutation();
  return { faceCheckIn, faceCheckOut, isCheckingIn, isCheckingOut };
}
