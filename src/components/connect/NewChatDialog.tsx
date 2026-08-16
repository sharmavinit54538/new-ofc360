import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Users, UserCheck } from "lucide-react";
import { useConnect } from "@/features/connect/hooks";
import { useGetColleaguesQuery, useCreateConversationMutation } from "@/services/api/connectApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { PresenceIndicator } from "./PresenceIndicator";
import { toast } from "sonner";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectConversation?: (conversationId: string) => void;
}

export function NewChatDialog({ open, onOpenChange, onSelectConversation }: NewChatDialogProps) {
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();
  const { setActiveConversationId, setActiveTab } = useConnect();

  // Load colleagues from connectApi
  // refetchOnMountOrArgChange ensures we always hit the network when the dialog opens,
  // even if stale/empty data is cached from a prior call (e.g. ConnectCallsPage uses
  // the same undefined cache key and may have cached an error response).
  const { data: colleaguesData, isLoading, isError, error } = useGetColleaguesQuery(undefined, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  // Surface any query errors for debugging
  if (isError) {
    console.error("[NewChatDialog] useGetColleaguesQuery failed:", error);
  }

  const [createConversation] = useCreateConversationMutation();

  const employeesList: ConnectUser[] = useMemo(() => {
    let list: ConnectUser[] = [];
    if (Array.isArray(colleaguesData)) {
      list = colleaguesData;
    } else if (colleaguesData && typeof colleaguesData === "object") {
      // Handle { colleagues: [...] } or { data: { colleagues: [...] } }
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
    // Filter out the current user; account for _id and emailAddress field variations
    const userId = currentUser?.id || (currentUser as any)?._id;
    const userEmail = currentUser?.email || (currentUser as any)?.emailAddress;
    return list.filter((emp) => {
      const empId = emp.id || (emp as any)?._id;
      const empEmail = emp.email || (emp as any)?.emailAddress;
      return empId !== userId && empEmail !== userEmail;
    });
  }, [colleaguesData, currentUser]);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employeesList;
    const q = search.toLowerCase();
    return employeesList.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        (e.role && e.role.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q))
    );
  }, [employeesList, search]);

  const handleStartChat = async (emp: ConnectUser) => {
    try {
      const res = await createConversation({ targetUserId: emp.id }).unwrap();
      const convId = res.id;
      setActiveConversationId(convId);
      setActiveTab("chat");
      onOpenChange(false);
      onSelectConversation?.(convId);
    } catch {
      const convId = `conv_${emp.id}`;
      setActiveConversationId(convId);
      setActiveTab("chat");
      onOpenChange(false);
      onSelectConversation?.(convId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl">
        <DialogHeader className="p-4 pb-3 border-b border-border/50">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Start a Direct Conversation
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select a colleague from your organization directory to start chatting.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="p-3 border-b border-border/40 bg-muted/20">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department, role..."
              className="pl-9 h-9 text-xs bg-background/70 border-border/70 rounded-xl"
              autoFocus
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin space-y-1">
          {isLoading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-card/60 animate-pulse border border-border/40" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8 px-4 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-destructive" />
              <p className="text-xs font-medium text-destructive">Failed to load colleagues</p>
              <p className="text-[11px] opacity-75 mt-0.5">Please check your connection and try again</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8 px-4 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No colleagues found</p>
              <p className="text-[11px] opacity-75 mt-0.5">Try searching with a different keyword</p>
            </div>
          ) : (
            filteredEmployees.map((emp) => {
              const fullName = emp.name || emp.email;
              const initials = fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <button
                  key={emp.id}
                  onClick={() => handleStartChat(emp)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/40 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar className="w-9 h-9 border border-border/50">
                        <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {initials || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <PresenceIndicator
                        status={emp.presence || "online"}
                        size="sm"
                        className="absolute -bottom-0.5 -right-0.5 ring-2 ring-background"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {fullName}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {emp.designation || emp.role || "Team Member"} • {emp.department || "General"}
                      </p>
                    </div>
                  </div>

                  <UserCheck className="w-4 h-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
