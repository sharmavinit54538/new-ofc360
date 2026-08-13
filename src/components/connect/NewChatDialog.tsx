import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Users, UserCheck } from "lucide-react";
import { useConnectStore } from "@/stores/connectStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { PresenceIndicator } from "./PresenceIndicator";

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectConversation?: (conversationId: string) => void;
}

export function NewChatDialog({ open, onOpenChange, onSelectConversation }: NewChatDialogProps) {
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();
  const { startDirectConversation } = useConnectStore();

  // Load real employees from RTK Query with fallback to employeeStore
  const { data: employeesResponse, isLoading: isRtkLoading } = useGetEmployeesQuery(undefined, {
    skip: !open,
  });
  const storeEmployees = useEmployeeStore((s) => s.employees);

  const employeesList = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(employeesResponse)) {
      list = employeesResponse;
    } else if (employeesResponse && (employeesResponse as any).data && Array.isArray((employeesResponse as any).data)) {
      list = (employeesResponse as any).data;
    } else if (storeEmployees && storeEmployees.length > 0) {
      list = storeEmployees;
    }

    return list.filter((emp) => emp.id !== currentUser?.id && emp.email !== currentUser?.email);
  }, [employeesResponse, storeEmployees, currentUser]);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employeesList;
    const q = search.toLowerCase();
    return employeesList.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.firstName && e.firstName.toLowerCase().includes(q)) ||
        (e.lastName && e.lastName.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        (e.role && e.role.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q))
    );
  }, [employeesList, search]);

  const handleStartChat = (emp: any) => {
    const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
    const targetUser: ConnectUser = {
      id: String(emp.id),
      name: fullName,
      email: emp.email || "",
      role: emp.designation || emp.role || "Team Member",
      department: emp.department || "General",
      avatar: emp.avatar || emp.photoUrl,
      presence: "online",
    };

    const convId = startDirectConversation(targetUser);
    onOpenChange(false);
    onSelectConversation?.(convId);
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
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8 px-4 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No colleagues found</p>
              <p className="text-[11px] opacity-75 mt-0.5">Try searching with a different keyword</p>
            </div>
          ) : (
            filteredEmployees.map((emp) => {
              const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
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
                        status="online"
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
