import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { selectAuth } from "@/features/auth/authSelectors";
import { setCredentials, updateUser, setInitializing, logout } from "@/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/services/api/authApi";
import { baseApi } from "@/services/api/baseApi";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  // Invoke /auth/me on startup with credentials: "include" to restore active session from cookie
  const { data: currentUser, error, isLoading } = useGetCurrentUserQuery(undefined);

  useEffect(() => {
    if (currentUser) {
      if (!user) {
        dispatch(
          setCredentials({
            user: currentUser,
            companyId: currentUser.companyId,
          })
        );
      } else {
        dispatch(updateUser(currentUser));
      }
      dispatch(setInitializing(false));
    } else if (error) {
      const status = (error as any)?.status;
      if (status === 401) {
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
      }
      dispatch(setInitializing(false));
    } else if (!isLoading) {
      dispatch(setInitializing(false));
    }
  }, [currentUser, error, isLoading, user, dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}


