import React, { useEffect, useRef } from "react";
import { store } from "./store";
import { useAppDispatch } from "./hooks";
import { authService } from "@/services/auth/authService";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      authService.initializeAuthSession(dispatch, () => store.getState());
    }
  }, [dispatch]);

  return <>{children}</>;
}
