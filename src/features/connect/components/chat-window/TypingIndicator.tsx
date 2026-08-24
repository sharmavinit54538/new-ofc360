import React from "react";

interface TypingIndicatorProps {
  typingUsers: string[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-2 py-1">
      <span className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-200" />
      </span>
      <span>{typingUsers.join(", ")} is typing...</span>
    </div>
  );
}