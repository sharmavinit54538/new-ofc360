import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser, selectIsAuthenticated, selectCurrentRole } from "@/features/auth/authSelectors";
import { useGetCurrentUserQuery } from "@/api/endpoints/auth";

export function useCurrentUser() {
  const localUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectCurrentRole);
  const { data: serverUser, isLoading, isFetching, error, refetch } = useGetCurrentUserQuery(undefined, { skip: !isAuthenticated });
  return {
    user: serverUser || localUser, isAuthenticated, role: serverUser?.role || role,
    isLoading, isFetching, error, refetch,
  };
}