import { PresenceStatus } from "@/types/connect";
import { useConnectStore } from "@/stores/connectStore";
import { PresenceIndicator } from "./PresenceIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

const OPTIONS: { status: PresenceStatus; label: string; description: string }[] = [
  { status: "online", label: "Online", description: "Available for calls & chats" },
  { status: "away", label: "Away", description: "Temporarily stepping out" },
  { status: "busy", label: "Busy", description: "In a meeting or focused" },
  { status: "dnd", label: "Do Not Disturb", description: "Mute all notifications" },
  { status: "offline", label: "Appear Offline", description: "Invisible to colleagues" },
];

export function PresenceSelector({ compact = false }: { compact?: boolean }) {
  const currentUserPresence = useConnectStore((s) => s.currentUserPresence);
  const setCurrentUserPresence = useConnectStore((s) => s.setCurrentUserPresence);

  const currentOption = OPTIONS.find((o) => o.status === currentUserPresence) || OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 gap-2 border-border/70 hover:bg-accent/40 text-xs font-medium rounded-lg"
        >
          <PresenceIndicator status={currentUserPresence} size="sm" withPulse={currentUserPresence === "online"} />
          {!compact && (
            <>
              <span className="text-foreground">{currentOption.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 p-1">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-medium px-2 py-1.5">
          Set Presence Status
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map((item) => (
          <DropdownMenuItem
            key={item.status}
            onClick={() => setCurrentUserPresence(item.status)}
            className="flex items-center justify-between px-2 py-2 cursor-pointer rounded-md text-xs"
          >
            <div className="flex items-center gap-2.5">
              <PresenceIndicator status={item.status} size="sm" />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-[11px] text-muted-foreground">{item.description}</span>
              </div>
            </div>
            {currentUserPresence === item.status && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
