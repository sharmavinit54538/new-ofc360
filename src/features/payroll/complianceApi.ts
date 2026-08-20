import { baseApi } from "@/services/api/baseApi";
export * from "./compliance/complianceQueries";
export * from "./compliance/complianceMutations";
export const complianceApi = baseApi as any;