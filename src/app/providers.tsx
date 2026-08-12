import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { selectAuth } from "@/features/auth/authSelectors";
import { updateUser, logout, setInitializing } from "@/features/auth/authSlice";
import { useGetCurrentUserQuery } from "@/services/api/authApi";
import { baseApi } from "@/services/api/baseApi";

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(selectAuth);

  const { data: currentUser, error } = useGetCurrentUserQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (currentUser) {
      dispatch(updateUser(currentUser));
      dispatch(setInitializing(false));
    } else if (error) {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      dispatch(setInitializing(false));
    }
  }, [currentUser, error, dispatch]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthBootstrap>{children}</AuthBootstrap>
    </Provider>
  );
}
