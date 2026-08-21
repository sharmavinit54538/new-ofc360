/**
 * Canonical base API re-export.
 *
 * Previously this file contained a DUPLICATE createApi() call with the same
 * reducerPath "api" as src/api/client.ts — creating two competing API instances.
 * Auth endpoints injected into this orphaned instance were not registered in the
 * Redux store, causing authentication instability.
 *
 * Now all modules that import baseApi from this path use the ONE canonical
 * createApi instance that is registered in the Redux store.
 *
 * New code should import directly from "@/api/client".
 */
export {
  api as baseApi,
  baseQuery,
  baseQueryWithReauth,
} from "@/api/client";

export { isPublicRequest, isValidToken, isValidUUID, needsCompanyId } from "@/services/auth/authStorage";

export type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@/api/client";