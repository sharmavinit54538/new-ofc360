import { useAuthLogout } from "./auth/useAuthLogout";
import { useAuthSelectors } from "./auth/useAuthSelectors";
import { useAuthActions } from "./auth/useAuthActions";

export function useAuth() {
  const logout = useAuthLogout();
  const selectors = useAuthSelectors();
  const actions = useAuthActions();
  return {
    ...selectors,
    isLoading: selectors.loading,
    logout,
    ...actions,
  };
}