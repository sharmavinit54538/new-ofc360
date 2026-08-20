import { CopilotHeader } from "./CopilotHeader";
import { CopilotMessagesList } from "./CopilotMessagesList";
import { CopilotInputBar } from "./CopilotInputBar";

export function CopilotChatBox() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <CopilotHeader />
      <CopilotMessagesList />
      <CopilotInputBar />
    </div>
  );
}
