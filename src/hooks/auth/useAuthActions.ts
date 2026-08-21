import { useCallback } from "react";
import { useAppDispatch } from "@/app/hooks";
import { setRole as setRoleAction, setCredentials } from "@/features/auth/authSlice";
import { SystemRole } from "@/features/auth/authTypes";

type SetCredentialsPayload = Parameters<typeof setCredentials>[0];

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const setRole = useCallback((r: SystemRole | "admin") => dispatch(setRoleAction(r)), [dispatch]);
  const setCredentialsCallback = useCallback((p: SetCredentialsPayload) => dispatch(setCredentials(p)), [dispatch]);
  return { setRole, setCredentials: setCredentialsCallback };
}
