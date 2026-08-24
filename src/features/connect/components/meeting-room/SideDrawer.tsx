import React from "react";
import { X, MessageSquare, Users, FolderArchive, Info, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectMessage, ConnectUser } from "@/types/connect";

interface SideDrawerProps {
  activePanel: "chat" | "participants" | "files" | "info" | null;
  setActivePanel: (panel: "chat" | "participants" | "files" | "info" | null) => void;
  inMeetingMessages: ConnectMessage[];
  inMeetingFiles: any[];
  participantsList: ConnectUser[];
  activeMeeting: {
    hostId: string;
    id: string;
  };
  currentUserId: string;
  inMeetingChatMessage: string;
  setInMeetingChatMessage: (message: string) => void;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  onSendChatMessage: (e: React.FormEvent) => void;
}

export function SideDrawer({
  activePanel,
  setActivePanel,
  inMeetingMessages,
  inMeetingFiles,
  participantsList,
  activeMeeting,
  currentUserId,
  inMeetingChatMessage,
  setInMeetingChatMessage,
  chatScrollRef,
  onSendChatMessage,
}: SideDrawerProps) {
  if (!activePanel) return null;

  return (
    <div className="w-80 md:w-96 bg-zinc-900 border-l border-white/10 flex flex-col shrink-0 z-20">
      {/* Drawer Header */}
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          {activePanel === "chat"
            ? "In-Meeting Chat"
            : activePanel === "participants"
            ? `Participants (${participantsList.length})`
            : activePanel === "files"
            ? "Shared Files"
            : "Meeting Details"}
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setActivePanel(null)}
          className="w-7 h-7 text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {activePanel === "chat" && (
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-2 flex-1 overflow-y-auto pr-1">
              {inMeetingMessages.length === 0 ? (
                <p className="text-center py-12 text-xs text-white/40">
                  No in-meeting messages yet.
                </p>
              ) : (
                inMeetingMessages.map((msg) => (
                  <div key={msg.id} className="p-2 rounded-xl bg-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-white/50">
                      <span className="font-bold text-primary">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="text-white/90">{msg.content}</p>
                  </div>
                ))
              )}
              <div ref={chatScrollRef} />
            </div>

            <form onSubmit={onSendChatMessage} className="flex items-center gap-2 pt-2">
              <Input
                value={inMeetingChatMessage}
                onChange={(e) => setInMeetingChatMessage(e.target.value)}
                placeholder="Send to everyone in room..."
                className="h-8 text-xs bg-white/10 border-white/10 text-white rounded-lg"
              />
              <Button type="submit" size="icon" className="w-8 h-8 rounded-lg gradient-bg shrink-0">
                <Send className="w-3.5 h-3.5 text-white" />
              </Button>
            </form>
          </div>
        )}

        {activePanel === "participants" && (
          <div className="space-y-1.5">
            {participantsList.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                      {p.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">
                      {p.name} {p.id === currentUserId && "(You)"}
                    </p>
                    <p className="text-[10px] text-white/50">{p.role || "Participant"}</p>
                  </div>
                </div>
                {p.id === activeMeeting.hostId && (
                  <span className="text-[10px] bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded-md">
                    Host
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activePanel === "files" && (
          <div className="space-y-2">
            {inMeetingFiles.length === 0 ? (
              <p className="text-center py-12 text-xs text-white/40">
                No files shared in this meeting yet.
              </p>
            ) : (
              inMeetingFiles.map((file) => (
                <div key={file.id} className="p-2.5 rounded-xl bg-white/5 text-xs space-y-1">
                  <p className="font-bold text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-white/50">Shared by {file.sharedBy?.name || "Member"}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activePanel === "info" && (
          <div className="space-y-3 text-xs text-white/70">
            <div>
              <span className="font-bold text-white block mb-0.5">Meeting Code</span>
              <p className="font-mono bg-white/5 p-2 rounded-lg text-white/90">{activeMeeting.id}</p>
            </div>
            <div>
              <span className="font-bold text-white block mb-0.5">Direct URL</span>
              <p className="break-all bg-white/5 p-2 rounded-lg text-[11px] text-white/90">
                {window.location.href}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}