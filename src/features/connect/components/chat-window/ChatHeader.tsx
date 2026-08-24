import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Phone, Video, MoreVertical, Pin, Sparkles, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PresenceIndicator } from "../PresenceIndicator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  participant: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    avatar?: string;
    presence: "online" | "away" | "busy" | "dnd" | "offline";
  };
  initials: string;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  messageSearch: string;
  setMessageSearch: (search: string) => void;
  onOpenVideoCall: (user: any) => void;
  onOpenAudioCall: (user: any) => void;
}

export function ChatHeader({
  participant,
  initials,
  showSearch,
  setShowSearch,
  messageSearch,
  setMessageSearch,
  onOpenVideoCall,
  onOpenAudioCall,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="h-16 px-3 md:px-4 border-b border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-between gap-2 md:gap-3 shrink-0">
      {/* Recipient Profile */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Mobile Back to List Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/connect/chat")}
          className="md:hidden h-8 w-8 -ml-1 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
          title="Back to conversations"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="relative shrink-0">
          <Avatar className="w-10 h-10 border border-border/60">
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback className="text-xs bg-primary/15 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <PresenceIndicator
            status={participant.presence}
            size="sm"
            withPulse={participant.presence === "online"}
            className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground truncate">{participant.name}</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
            <span>{participant.role || "Team Member"} • {participant.department || "General"}</span>
            <span>•</span>
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                participant.presence === "online"
                  ? "text-emerald-500"
                  : participant.presence === "away"
                  ? "text-amber-500"
                  : participant.presence === "busy" || participant.presence === "dnd"
                  ? "text-rose-500"
                  : "text-muted-foreground"
              }`}
            >
              {participant.presence === "online"
                ? "● Online"
                : participant.presence === "away"
                ? "● Away"
                : participant.presence === "busy"
                ? "● Busy"
                : participant.presence === "dnd"
                ? "● Do Not Disturb"
                : "○ Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        {showSearch && (
          <div className="relative w-48 mr-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={messageSearch}
              onChange={(e) => setMessageSearch(e.target.value)}
              placeholder="Search messages..."
              className="pl-7 h-8 text-xs rounded-xl bg-muted/40 border-border/60"
              autoFocus
            />
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
          className="w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground"
          title="Search In Conversation"
        >
          <Search className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onOpenAudioCall(participant)}
          className="w-8 h-8 rounded-xl text-primary hover:bg-primary/15"
          title="Audio Call"
        >
          <Phone className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onOpenVideoCall(participant)}
          className="w-8 h-8 rounded-xl text-primary hover:bg-primary/15"
          title="Video Call"
        >
          <Video className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}