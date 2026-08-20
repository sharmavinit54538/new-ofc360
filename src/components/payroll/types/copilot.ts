import React from "react";
export interface CopilotContext {
  copilotInput: string;
  setCopilotInput: (val: string) => void;
  copilotMessages: Array<{ sender: "user" | "ai"; text: string }>;
  setCopilotMessages: React.Dispatch<React.SetStateAction<Array<{ sender: "user" | "ai"; text: string }>>>;
  fmt: (n: number) => string;
}
