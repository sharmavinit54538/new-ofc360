import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectLayout } from "@/components/connect/ConnectLayout";
import { useConnectStore } from "@/stores/connectStore";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAuth } from "@/hooks/useAuth";
import { ConnectUser } from "@/types/connect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  MessageSquare,
  Phone,
  Video,
  Building2,
  Mail,
  UserCheck,
} from "lucide-react";
import { PresenceIndicator } from "@/components/connect/PresenceIndicator";
import { ConnectEmptyState } from "@/components/connect/ConnectEmptyState";

export default function ConnectContactsPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const setActiveTab = useConnectStore((s) => s.setActiveTab);
  const startDirectConversation = useConnectStore((s) => s.startDirectConversation);
  const startCall = useConnectStore((s) => s.startCall);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");

  useEffect(() => {
    setActiveTab("contacts");
  }, [setActiveTab]);

  const { data: employeesResponse, isLoading } = useGetEmployeesQuery();

  const employeesList = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(employeesResponse)) {
      list = employeesResponse;
    } else if (employeesResponse && (employeesResponse as any).data && Array.isArray((employeesResponse as any).data)) {
      list = (employeesResponse as any).data;
    }
    return list.filter((emp) => emp.id !== currentUser?.id && emp.email !== currentUser?.email);
  }, [employeesResponse, currentUser]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    employeesList.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set);
  }, [employeesList]);

  const filteredEmployees = useMemo(() => {
    let list = employeesList;
    if (departmentFilter !== "ALL") {
      list = list.filter((e) => e.department === departmentFilter);
    }
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (e) =>
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.firstName && e.firstName.toLowerCase().includes(q)) ||
        (e.lastName && e.lastName.toLowerCase().includes(q)) ||
        (e.email && e.email.toLowerCase().includes(q)) ||
        (e.role && e.role.toLowerCase().includes(q)) ||
        (e.designation && e.designation.toLowerCase().includes(q))
    );
  }, [employeesList, departmentFilter, search]);

  const handleStartMessage = (emp: any) => {
    const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
    const targetUser: ConnectUser = {
      id: String(emp.id),
      name: fullName,
      email: emp.email || "",
      role: emp.designation || emp.role,
      department: emp.department,
      avatar: emp.avatar || emp.photoUrl,
    };
    const convId = startDirectConversation(targetUser);
    navigate(`/connect/chat/${convId}`);
  };

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
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 scrollbar-thin select-none">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Colleagues Directory
            </h2>
            <p className="text-xs text-muted-foreground">
              Direct access to all teammates across departments for fast communication
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1 rounded-lg self-start">
            {filteredEmployees.length} Colleagues
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, email..."
              className="pl-8 text-xs h-8 bg-background rounded-xl border-border/70"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium shrink-0">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-8 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="flex-1">
          {filteredEmployees.length === 0 ? (
            <ConnectEmptyState
              variant="contacts"
              title="No colleagues match your criteria"
              description="Try adjusting your department filter or search term."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredEmployees.map((emp) => {
                const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim() || emp.email;
                const initials = fullName.slice(0, 2).toUpperCase();

                return (
                  <div
                    key={emp.id}
                    className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                  >
                    <div className="space-y-3">
                      {/* Avatar & Presence */}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-border/60">
                            <AvatarImage src={emp.avatar || emp.photoUrl} alt={fullName} />
                            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <PresenceIndicator
                            status="online"
                            size="md"
                            className="absolute -bottom-0.5 -right-0.5 ring-2 ring-card"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {fullName}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {emp.designation || emp.role || "Team Member"}
                          </p>
                          <span className="text-[10px] text-primary/80 font-medium truncate block">
                            {emp.department || "General"}
                          </span>
                        </div>
                      </div>

                      {/* Email Info */}
                      {emp.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate pt-1 border-t border-border/40">
                          <Mail className="w-3 h-3 shrink-0 text-muted-foreground/70" />
                          <span className="truncate">{emp.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStartMessage(emp)}
                        className="h-8 rounded-xl text-[11px] gap-1 px-1 font-semibold"
                        title="Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-primary" />
                        <span>Chat</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartCall(emp, "audio")}
                        className="h-8 rounded-xl text-[11px] gap-1 px-1 font-semibold border-border/80"
                        title="Audio Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Call</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartCall(emp, "video")}
                        className="h-8 rounded-xl text-[11px] gap-1 px-1 font-semibold border-border/80"
                        title="Video Call"
                      >
                        <Video className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Video</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ConnectLayout>
  );
}
