import { useState, useMemo, useEffect } from "react";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnectStore } from "@/stores/connectStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Video, PhoneCall, Search, Users, PhoneIncoming, PhoneOutgoing, Clock } from "lucide-react";
import { ConnectEmptyState } from "@/components/connect/ConnectEmptyState";
import { PresenceIndicator } from "@/components/connect/PresenceIndicator";

export default function ConnectCallsPage() {
  const { user: currentUser } = useAuth();
  const setActiveTab = useConnectStore((s) => s.setActiveTab);
  const startCall = useConnectStore((s) => s.startCall);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setActiveTab("calls");
  }, [setActiveTab]);

  const { data: employeesResponse } = useGetEmployeesQuery();

  const employeesList = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(employeesResponse)) {
      list = employeesResponse;
    } else if (employeesResponse && (employeesResponse as any).data && Array.isArray((employeesResponse as any).data)) {
      list = (employeesResponse as any).data;
    }
    return list.filter((emp) => emp.id !== currentUser?.id && emp.email !== currentUser?.email);
  }, [employeesResponse, currentUser]);

  const filteredEmployees = useMemo(() => {
    if (!search.trim()) return employeesList;
    const q = search.toLowerCase();
    return employeesList.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.firstName && e.firstName.toLowerCase().includes(q)) ||
        (e.department && e.department.toLowerCase().includes(q)) ||
        (e.role && e.role.toLowerCase().includes(q))
    );
  }, [employeesList, search]);

  const handleStartCall = (emp: any, type: "audio" | "video") => {
    const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
    const targetUser: ConnectUser = {
      id: String(emp.id),
      name: fullName,
      email: emp.email || "",
      role: emp.designation || emp.role,
      department: emp.department,
      avatar: emp.avatar || emp.photoUrl,
    };
    startCall(targetUser, type);
  };

  return (
    <ConnectLayout>
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden select-none">
        {/* Left Side: Call History */}
        <div className="flex-1 flex flex-col border-r border-border/70 bg-card/40 p-4 md:p-6 overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Call Log</h2>
              <p className="text-xs text-muted-foreground">Recent incoming and outgoing team calls</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ConnectEmptyState
              variant="calls"
              title="No call history"
              description="Your recent audio and video calls will appear here."
            />
          </div>
        </div>

        {/* Right Side: Quick Dial Colleagues */}
        <div className="w-full md:w-96 flex flex-col bg-background p-4 md:p-6 shrink-0 overflow-hidden">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Quick Dial Team
            </h3>
            <p className="text-xs text-muted-foreground">Start an instant audio or video call</p>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search colleagues..."
              className="pl-8 text-xs h-8 rounded-xl bg-card border-border/70"
            />
          </div>

          {/* Colleagues List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
            {filteredEmployees.length === 0 ? (
              <p className="text-center py-8 text-xs text-muted-foreground">No colleagues found</p>
            ) : (
              filteredEmployees.map((emp) => {
                const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
                const initials = fullName.slice(0, 2).toUpperCase();

                return (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-card/60 hover:bg-accent/30 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <PresenceIndicator status="online" size="sm" className="absolute -bottom-0.5 -right-0.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{fullName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{emp.department || "General"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartCall(emp, "audio")}
                        className="w-7 h-7 rounded-lg text-primary hover:bg-primary/15"
                        title="Audio Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartCall(emp, "video")}
                        className="w-7 h-7 rounded-lg text-primary hover:bg-primary/15"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </ConnectLayout>
  );
}
