import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash, Lock, Users, Search, Check } from "lucide-react";
import { useConnect } from "@/features/connect/hooks";
import { useGetColleaguesQuery, useCreateChannelMutation } from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { toast } from "sonner";

interface NewChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChannelCreated?: (channelId: string) => void;
}

export function NewChannelDialog({ open, onOpenChange, onChannelCreated }: NewChannelDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");

  const { user: currentUser } = useAuth();
  const { setActiveChannelId, setActiveTab } = useConnect();

  // RTK Query hooks
  const { data: colleaguesData } = useGetColleaguesQuery(undefined, { skip: !open });
  const [createChannel, { isLoading: isCreating }] = useCreateChannelMutation();

  const employeesList: ConnectUser[] = useMemo(() => {
    let list: ConnectUser[] = [];
    if (Array.isArray(colleaguesData)) {
      list = colleaguesData;
    } else if (colleaguesData && typeof colleaguesData === "object") {
      const src = colleaguesData as any;
      if (Array.isArray(src.colleagues)) {
        list = src.colleagues;
      } else if (Array.isArray(src.data?.colleagues)) {
        list = src.data.colleagues;
      } else if (Array.isArray(src.data)) {
        list = src.data;
      } else if (Array.isArray(src.items)) {
        list = src.items;
      }
    }
    const userId = currentUser?.id || (currentUser as any)?._id;
    const userEmail = currentUser?.email || (currentUser as any)?.emailAddress;
    return list.filter((emp) => {
      const empId = emp.id || (emp as any)?._id;
      const empEmail = emp.email || (emp as any)?.emailAddress;
      return empId !== userId && empEmail !== userEmail;
    });
  }, [colleaguesData, currentUser]);

  const filteredEmployees = useMemo(() => {
    if (!memberSearch.trim()) return employeesList;
    const q = memberSearch.toLowerCase();
    return employeesList.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        (e.role && e.role.toLowerCase().includes(q))
    );
  }, [employeesList, memberSearch]);

  const toggleMember = (empId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide a channel name.");
      return;
    }

    try {
      const channel = await createChannel({
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        description: description.trim(),
        isPrivate,
        memberIds: selectedMemberIds,
      }).unwrap();

      toast.success(`Channel #${channel.name} created successfully.`);
      setName("");
      setDescription("");
      setIsPrivate(false);
      setSelectedMemberIds([]);
      onOpenChange(false);
      setActiveChannelId(channel.id);
      setActiveTab("channels");
      onChannelCreated?.(channel.id);
    } catch {
      toast.error("Failed to create channel.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl">
        <form onSubmit={handleCreate}>
          <DialogHeader className="p-5 pb-4 border-b border-border/50">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              {isPrivate ? <Lock className="w-4 h-4 text-amber-500" /> : <Hash className="w-4 h-4 text-primary" />}
              Create a New Channel
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Channels are where your team collaborates on topics, projects, or announcements.
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
            {/* Channel Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Channel Name</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-xs">
                  #
                </span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="e.g. project-apollo, design-system"
                  className="pl-7 text-xs h-9 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Topic / Description (Optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this channel about?"
                className="text-xs min-h-[64px] rounded-xl resize-none"
              />
            </div>

            {/* Privacy switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {isPrivate ? "Private Channel" : "Public Channel"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {isPrivate
                    ? "Only invited colleagues can view or join this channel."
                    : "Anyone in the organization can search and join this channel."}
                </p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
            </div>

            {/* Member selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  Add Members ({selectedMemberIds.length} selected)
                </Label>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Filter colleagues to invite..."
                  className="pl-8 text-xs h-8 rounded-lg"
                />
              </div>

              <div className="max-h-36 overflow-y-auto border border-border/60 rounded-xl p-1.5 space-y-1 scrollbar-thin">
                {filteredEmployees.length === 0 ? (
                  <p className="text-center py-4 text-[11px] text-muted-foreground">No colleagues found</p>
                ) : (
                  filteredEmployees.map((emp) => {
                    const fullName = emp.name || emp.email;
                    const isSelected = selectedMemberIds.includes(String(emp.id));

                    return (
                      <div
                        key={emp.id}
                        onClick={() => toggleMember(String(emp.id))}
                        className={`flex items-center justify-between p-1.5 px-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent/40 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                            <AvatarFallback className="text-[10px]">
                              {fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{fullName}</span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            ({emp.department || "General"})
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating}
              className="gradient-bg text-primary-foreground text-xs h-8 rounded-lg shadow-sm"
            >
              {isCreating ? "Creating..." : "Create Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}