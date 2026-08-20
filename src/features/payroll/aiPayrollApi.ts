import { baseApi } from "@/services/api/baseApi";
export * from "./ai/aiQueries";
export * from "./ai/aiMutations";
export const aiPayrollApi = baseApi as any;