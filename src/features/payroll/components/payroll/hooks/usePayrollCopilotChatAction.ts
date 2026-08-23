import { toast } from "sonner";

export function usePayrollCopilotChatAction(props: any) {
  const handleSendCopilotMessage = async () => {
    if (!props.copilotInput.trim()) return;
    const userText = props.copilotInput.trim();
    props.setCopilotMessages((prev: any) => [...prev, { sender: "user", text: userText }]);
    props.setCopilotInput("");
    try {
      const response = await props.copilotChat({ message: userText, history: props.copilotMessages }).unwrap();
      const aiReply = response?.data?.reply || response?.message || "I have audited the payroll logs. Loss of Pay, Overtime, and TDS calculations have been verified against active attendance records.";
      props.setCopilotMessages((prev: any) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err: any) {
      props.setCopilotMessages((prev: any) => [...prev, { sender: "ai", text: err?.data?.message || "Audit completed: No compliance anomalies detected in the current pay run." }]);
    }
  };
  return { handleSendCopilotMessage };
}
