import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
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

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}

export const AuthProvider = ReduxProvider;