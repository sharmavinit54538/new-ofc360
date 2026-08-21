import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  AutomationRule,
  AutomationRuleCreateInput,
} from "./types";

let sessionAutomationRules: AutomationRule[] = [];

export const workflowAutomationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAutomationRules: builder.query<APIResponse<AutomationRule[]>, void>({
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Workflow automation rules retrieved",
            data: sessionAutomationRules,
            errors: null,
          },
        };
      },
      providesTags: [{ type: "WorkflowRule", id: "LIST" }],
    }),

    createAutomationRule: builder.mutation<
      APIResponse<AutomationRule>,
      AutomationRuleCreateInput
    >({
      queryFn: async (newRuleInput) => {
        const newRule: AutomationRule = {
          id: `rule-${Date.now()}`,
          trigger: newRuleInput.trigger,
          condition: newRuleInput.condition,
          action: newRuleInput.action,
          enabled: true,
        };
        sessionAutomationRules = [newRule, ...sessionAutomationRules];
        return {
          data: {
            success: true,
            message: "Automation rule created",
            data: newRule,
            errors: null,
          },
        };
      },
      invalidatesTags: [{ type: "WorkflowRule", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useListAutomationRulesQuery, useCreateAutomationRuleMutation } =
  workflowAutomationApi;