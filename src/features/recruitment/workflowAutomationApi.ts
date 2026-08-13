/**
 * TODO: backend not implemented — replace when recruitment workflow automation engine endpoints ship.
 * 
 * Note: This slice uses RTK Query `queryFn` to return typed static mock data
 * wrapped inside standard APIResponse<T> envelope.
 */

import { baseApi } from "@/services/api/baseApi";
import {
  APIResponse,
  AutomationRule,
  AutomationRuleCreateInput,
} from "./types";

let MOCK_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: "rule-101",
    trigger: "Candidate Stage Changed to Interview",
    condition: { stage: "Interview", auto_calendar: true },
    action: "Send Calendly Invitation & Trigger Slack Notification to Hiring Manager",
    enabled: true,
  },
  {
    id: "rule-102",
    trigger: "Scorecard Submitted (Rating >= 4.5)",
    condition: { overall_rating: 4.5 },
    action: "Auto-advance Candidate to Final Offer Stage & Notify HR Lead",
    enabled: true,
  },
  {
    id: "rule-103",
    trigger: "Offer Accepted",
    condition: { status: "accepted" },
    action: "Trigger Onboarding Handoff & Create Provisioning Tasks",
    enabled: false,
  },
];

export const workflowAutomationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAutomationRules: builder.query<APIResponse<AutomationRule[]>, void>({
      // TODO: backend not implemented — mock queryFn
      queryFn: async () => {
        return {
          data: {
            success: true,
            message: "Workflow automation rules retrieved (Mocked Data)",
            data: MOCK_AUTOMATION_RULES,
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
      // TODO: backend not implemented — mock queryFn
      queryFn: async (newRuleInput) => {
        const newRule: AutomationRule = {
          id: `rule-${Date.now()}`,
          trigger: newRuleInput.trigger,
          condition: newRuleInput.condition,
          action: newRuleInput.action,
          enabled: true,
        };
        MOCK_AUTOMATION_RULES = [newRule, ...MOCK_AUTOMATION_RULES];
        return {
          data: {
            success: true,
            message: "Automation rule created (Mocked Data)",
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
