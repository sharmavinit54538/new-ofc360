import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { selectAuth } from "@/features/auth/authSelectors";
import { updateUser, setInitializing, logout } from "@/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/services/api/authApi";
import { baseApi } from "@/services/api/baseApi";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector(selectAuth);

  const { data: currentUser, error, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    // If no token exists at all, settle initializing immediately
    if (!token) {
      dispatch(setInitializing(false));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
      dispatch(setInitializing(false));
    } else if (error) {
      // Only log out if it's an authenticated 401 where refresh failed
      const status = (error as any)?.status;
      if (status === 401) {
        dispatch(logout());
        dispatch(baseApi.util.resetApiState());
      }
      // For network errors (FETCH_ERROR) or 500 server errors, do NOT wipe user session.
      // Settle initializing so cached user session continues.
      dispatch(setInitializing(false));
    } else if (!isLoading && !token) {
      dispatch(setInitializing(false));
    }
  }, [currentUser, error, isLoading, token, dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}

