import { useState } from "react";
import { usePayrollCopilotChatMutation } from "@/features/payroll";

export function useCopilotActions() {
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your OFC360 Payroll AI Copilot. I continuously audit loss-of-pay sync, overtime anomalies, and statutory TDS compliance before disbursement. How can I assist you with this payroll run?",
    },
  ]);
  const [copilotChat, { isLoading: isCopilotThinking }] = usePayrollCopilotChatMutation();
  return {
    copilotInput, setCopilotInput,
    copilotMessages, setCopilotMessages,
    copilotChat, isCopilotThinking,
  };
}
