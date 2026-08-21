import { useState, useMemo } from "react";
import { Cake, Award, Calendar, Sparkles, Send, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useAttendanceStore } from "@/stores/attendanceStore";

export function DashboardMilestones() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"birthdays" | "anniversaries" | "holidays">("birthdays");
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const holidays = useAttendanceStore((s) => s.holidays) || [];

  const birthdays = useMemo(() => {
    return employees
      .filter((e: any) => e?.dob || e?.date_of_birth || e?.birthDate)
      .map((e: any) => ({
        name: e.name,
        role: e.role || "Staff Member",
        date: e.dob || e.date_of_birth || e.birthDate,
        avatar: (e.name || "E").slice(0, 2).toUpperCase(),
      }));
  }, [employees]);

  const anniversaries = useMemo(() => {
    return employees
      .filter((e: any) => e?.joining_date || e?.joiningDate || e?.createdAt)
      .map((e: any) => ({
        name: e.name,
        role: e.role || "Staff Member",
        date: e.joining_date || e.joiningDate || e.createdAt,
        years: "1+ Year",
        avatar: (e.name || "E").slice(0, 2).toUpperCase(),
      }));
  }, [employees]);

  const handleSendWish = (name: string, type: string) => {
    toast({
      title: "Celebration Wish Sent! 🎉",
      description: `Wished ${name} a happy ${type}!`,
    });
  };

  return (
    <div className="glass-card rounded-xl p-5 border border-border/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <h3 className="font-semibold text-base text-foreground">Celebrations & Holidays</h3>
          </div>

          <div className="flex items-center bg-secondary/70 p-0.5 rounded-lg border border-border/50 text-xs">
            <button
              onClick={() => setTab("birthdays")}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                tab === "birthdays"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cake className="w-3 h-3 text-pink-500" />
              <span>Birthdays</span>
            </button>

            <button
              onClick={() => setTab("anniversaries")}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                tab === "anniversaries"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="w-3 h-3 text-amber-500" />
              <span>Milestones</span>
            </button>

            <button
              onClick={() => setTab("holidays")}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                tab === "holidays"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-3 h-3 text-indigo-500" />
              <span>Holidays</span>
            </button>
          </div>
        </div>

        {tab === "birthdays" && (
          <div className="space-y-2.5">
            {birthdays.length > 0 ? (
              birthdays.slice(0, 4).map((b) => (
                <div
                  key={b.name}
                  className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {b.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">{b.name}</div>
                      <div className="text-[11px] text-pink-500 font-medium">{b.date} • {b.role}</div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendWish(b.name, "Birthday")}
                    className="h-7 text-xs px-2.5 gap-1.5 text-pink-600 border-pink-500/30 hover:bg-pink-500/10 rounded-lg cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Wish</span>
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg bg-muted/10">
                <Cake className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1" />
                <p className="font-medium text-foreground">No upcoming birthdays</p>
                <p className="text-[11px] text-muted-foreground">Birthdays from registered staff profiles will appear here.</p>
              </div>
            )}
          </div>
        )}

        {tab === "anniversaries" && (
          <div className="space-y-2.5">
            {anniversaries.length > 0 ? (
              anniversaries.slice(0, 4).map((a) => (
                <div
                  key={a.name}
                  className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {a.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-foreground truncate">{a.name}</div>
                      <div className="text-[11px] text-amber-500 font-medium">
                        Joined {a.date}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSendWish(a.name, "Work Anniversary")}
                    className="h-7 text-xs px-2.5 gap-1.5 text-amber-600 border-amber-500/30 hover:bg-amber-500/10 rounded-lg cursor-pointer"
                  >
                    <Award className="w-3 h-3" />
                    <span>Kudos</span>
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg bg-muted/10">
                <Award className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1" />
                <p className="font-medium text-foreground">No upcoming work anniversaries</p>
                <p className="text-[11px] text-muted-foreground">Work anniversaries and tenures will be recognized here.</p>
              </div>
            )}
          </div>
        )}

        {tab === "holidays" && (
          <div className="space-y-2">
            {holidays.length > 0 ? (
              holidays.slice(0, 4).map((h: any) => (
                <div
                  key={h.id || h.title || h.name}
                  className="p-2.5 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-semibold text-xs text-foreground">{h.name || h.title}</div>
                    <div className="text-[11px] text-muted-foreground">{h.date} ({h.dayOfWeek || h.day || "Holiday"})</div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                    {h.type || "Official"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border/50 rounded-lg bg-muted/10">
                <CalendarX className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1" />
                <p className="font-medium text-foreground">No holidays configured</p>
                <p className="text-[11px] text-muted-foreground">Add official organization holidays in Attendance settings.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Organization Milestones</span>
        <span className="font-semibold text-indigo-500">Live Calendar</span>
      </div>
    </div>
  );
}
