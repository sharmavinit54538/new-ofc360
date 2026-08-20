import { useState } from "react";
import { ConnectChannel } from "@/types/connect";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Hash,
  Lock,
  Users,
  Search,
  MoreVertical,
  Archive,
  LogOut,
  Info,
  UserPlus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useArchiveChannelMutation,
  useLeaveChannelMutation,
  useAddChannelMembersMutation,
  useRemoveChannelMemberMutation,
  useGetColleaguesQuery,
} from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChannelHeaderProps {
  channel: ConnectChannel;
  onToggleSearch?: () => void;
}

export function ChannelHeader({ channel, onToggleSearch }: ChannelHeaderProps) {
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserToAdd, setSelectedUserToAdd] = useState("");

  const { user: currentUser } = useAuth();
  const currentUserId = String(currentUser?.id || "");

  // RTK Query mutations
  const [archiveChannel] = useArchiveChannelMutation();
  const [leaveChannel] = useLeaveChannelMutation();
  const [addChannelMembers] = useAddChannelMembersMutation();
  const [removeChannelMember] = useRemoveChannelMemberMutation();
  const { data: colleagues = [] } = useGetColleaguesQuery(undefined, { skip: !showAddMember });

  const handleArchive = async () => {
    try {
      await archiveChannel({ channelId: channel.id, isArchived: true }).unwrap();
      toast.success(`Channel #${channel.name} archived.`);
    } catch {
      toast.error("Failed to archive channel.");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveChannel(channel.id).unwrap();
      toast.info(`Left channel #${channel.name}.`);
    } catch {
      toast.error("Failed to leave channel.");
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserToAdd) return;
    try {
      await addChannelMembers({
        channelId: channel.id,
        memberIds: [selectedUserToAdd],
      }).unwrap();
      toast.success("Member added to channel");
      setSelectedUserToAdd("");
      setShowAddMember(false);
    } catch {
      toast.error("Failed to add member.");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeChannelMember({ channelId: channel.id, userId }).unwrap();
      toast.success("Member removed from channel");
    } catch {
      toast.error("Failed to remove member.");
    }
  };

  return (
    <>
      <div className="h-16 px-4 border-b border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
        {/* Channel Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0 border border-primary/20">
            {channel.isPrivate ? <Lock className="w-5 h-5 text-amber-500" /> : <Hash className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground truncate">#{channel.name}</h2>
              {channel.isPrivate && (
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 rounded-md">
                  Private
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {channel.description || "No topic set for this channel"}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Members Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMembersDialog(true)}
            className="h-8 px-2.5 rounded-lg text-xs gap-1.5 border-border/80 hover:bg-accent/40 text-foreground"
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{channel.members?.length || 1}</span>
            <span className="hidden sm:inline">Members</span>
          </Button>

          {/* Search Trigger */}
          {onToggleSearch && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleSearch}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
              title="Search in channel"
            >
              <Search className="w-4 h-4" />
            </Button>
          )}

          {/* Channel Settings Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1 text-xs">
              <DropdownMenuItem onClick={() => setShowMembersDialog(true)} className="cursor-pointer gap-2 py-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" /> View Members
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Created: ${new Date(channel.createdAt).toLocaleDateString()}`)}
                className="cursor-pointer gap-2 py-1.5"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" /> Channel Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLeave} className="cursor-pointer gap-2 py-1.5 text-amber-600">
                <LogOut className="w-3.5 h-3.5" /> Leave Channel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleArchive}
                className="cursor-pointer gap-2 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Archive className="w-3.5 h-3.5" /> Archive Channel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Members Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl">
          <DialogHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              #{channel.name} Members ({channel.members?.length || 1})
            </DialogTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddMember(!showAddMember)}
              className="h-7 text-xs gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </Button>
          </DialogHeader>

          {/* Add member form */}
          {showAddMember && (
            <div className="p-3 border-b border-border/40 bg-muted/20 flex gap-2">
              <select
                value={selectedUserToAdd}
                onChange={(e) => setSelectedUserToAdd(e.target.value)}
                className="flex-1 h-8 rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">Select a colleague to add...</option>
                {colleagues
                  .filter((c) => !channel.members?.some((m) => m.id === c.id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.department || "General"})
                    </option>
                  ))}
              </select>
              <Button size="sm" onClick={handleAddMember} className="h-8 text-xs">
                Add
              </Button>
            </div>
          )}

          <div className="max-h-72 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {channel.members?.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 text-xs">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={m.avatar} alt={m.name} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {m.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.role || "Member"} • {m.department || "General"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {m.id === channel.createdBy ? (
                    <span className="text-[10px] bg-primary/15 text-primary font-bold px-1.5 py-0.5 rounded-md">
                      Host
                    </span>
                  ) : channel.createdBy === currentUserId && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveMember(m.id)}
                      className="w-6 h-6 text-muted-foreground hover:text-destructive"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}