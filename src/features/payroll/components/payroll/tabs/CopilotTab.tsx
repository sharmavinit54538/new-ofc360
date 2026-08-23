import { CopilotHealthScore } from "./copilot/CopilotHealthScore";
import { CopilotChatBox } from "./copilot/CopilotChatBox";

export function CopilotTab() {
  return (
    <div className="space-y-6">
      <CopilotHealthScore />
      <CopilotChatBox />
    </div>
  );
}
