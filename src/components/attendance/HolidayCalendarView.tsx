import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CalendarDays,
  LayoutGrid,
  Filter,
  CheckCircle,
  MapPin,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HolidayItem } from "@/stores/attendanceStore";

interface HolidayCalendarViewProps {
  holidays: HolidayItem[];
  onAddHoliday: (defaultDate?: string) => void;
  onDeleteHoliday: (id: string) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HolidayCalendarView({
  holidays,
  onAddHoliday,
  onDeleteHoliday,
}: HolidayCalendarViewProps) {
  const [viewDate, setViewDate] = useState(() => new Date(2026, 7, 1)); // Default to August 2026
  const [viewMode, setViewMode] = useState<"calendar" | "grid">("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [activeDateStr, setActiveDateStr] = useState<string | null>("2026-08-15");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Navigation Handlers
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // Filtered Holidays
  const filteredHolidays = useMemo(() => {
    return holidays.filter((h) => {
      const matchSearch =
        h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.date.includes(searchQuery);
      const matchType = selectedType === "ALL" || h.type === selectedType;
      const matchBranch =
        selectedBranch === "ALL" ||
        h.branchLocation === selectedBranch ||
        h.branchLocation === "All Branches";
      return matchSearch && matchType && matchBranch;
    });
  }, [holidays, searchQuery, selectedType, selectedBranch]);

  // Holidays map by YYYY-MM-DD
  const holidaysByDate = useMemo(() => {
    const map = new Map<string, HolidayItem[]>();
    filteredHolidays.forEach((h) => {
      const normalizedDate = h.date.includes("T") ? h.date.split("T")[0] : h.date.trim();
      const existing = map.get(normalizedDate) || [];
      existing.push(h);
      map.set(normalizedDate, existing);
    });
    return map;
  }, [filteredHolidays]);

  // Month stats
  const currentMonthHolidays = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    return filteredHolidays.filter((h) => h.date.startsWith(prefix));
  }, [filteredHolidays, year, month]);

  // Calendar Grid Matrix Calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        holidays: holidaysByDate.get(dateStr) || [],
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
        holidays: holidaysByDate.get(dateStr) || [],
      });
    }

    // Next month filler days to complete grid (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
        holidays: holidaysByDate.get(dateStr) || [],
      });
    }

    return days;
  }, [year, month, holidaysByDate]);

  const getHolidayBadgeStyle = (type: HolidayItem["type"]) => {
    switch (type) {
      case "National":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      case "Public":
        return "bg-blue-500/15 text-blue-500 border-blue-500/30";
      case "Regional":
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
      case "Optional Floating":
        return "bg-purple-500/15 text-purple-500 border-purple-500/30";
      default:
        return "bg-primary/15 text-primary border-primary/30";
    }
  };

  const selectedDateHolidays = activeDateStr ? holidaysByDate.get(activeDateStr) || [] : [];

  return (
    <div className="space-y-6">
      {/* Top Header Row with View Mode Switcher and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Company Holidays & Observances</h2>
          <p className="text-xs text-muted-foreground">
            Interactive annual holiday schedule, national closures, and optional floating observances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary/40 border border-border/50 p-0.5 rounded-xl">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("calendar")}
              className={`h-8 text-xs font-semibold rounded-lg gap-1.5 px-3 transition-all ${
                viewMode === "calendar"
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`h-8 text-xs font-semibold rounded-lg gap-1.5 px-3 transition-all ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards Grid</span>
            </Button>
          </div>

          <Button
            onClick={() => onAddHoliday(activeDateStr || undefined)}
            className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Company Holiday
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search holiday name or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-secondary/30 border-border/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/60 w-36 font-medium">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
              <SelectItem value="National" className="text-xs">National</SelectItem>
              <SelectItem value="Public" className="text-xs">Public</SelectItem>
              <SelectItem value="Regional" className="text-xs">Regional</SelectItem>
              <SelectItem value="Optional Floating" className="text-xs">Optional Floating</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/60 w-40 font-medium">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Branches</SelectItem>
              <SelectItem value="Headquarters (HQ)" className="text-xs">Headquarters (HQ)</SelectItem>
              <SelectItem value="Tech Innovation Hub" className="text-xs">Tech Hub (BLR)</SelectItem>
              <SelectItem value="Regional Office - West" className="text-xs">Regional Office</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || selectedType !== "ALL" || selectedBranch !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("ALL");
                setSelectedBranch("ALL");
              }}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Month Calendar Matrix (3 Columns) */}
          <div className="lg:col-span-3 glass-card rounded-3xl p-6 border border-border/60 bg-card shadow-sm space-y-4">
            {/* Calendar Controls Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground tracking-tight">
                    {MONTH_NAMES[month]} {year}
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {currentMonthHolidays.length} {currentMonthHolidays.length === 1 ? "Holiday" : "Holidays"} scheduled this month
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToday}
                  className="h-8 text-xs font-semibold border-border/60 bg-secondary/20"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevMonth}
                  className="h-8 w-8 border-border/60 bg-secondary/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8 border-border/60 bg-secondary/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-muted-foreground py-1">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div
                  key={day}
                  className={`py-1 rounded-lg ${
                    idx === 0 || idx === 6 ? "text-amber-500/80 bg-amber-500/5 font-semibold" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days 7x6 Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((cell, index) => {
                const isSelected = activeDateStr === cell.dateStr;
                const hasHolidays = cell.holidays.length > 0;
                const isToday =
                  cell.dateStr === new Date().toISOString().split("T")[0];

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setActiveDateStr(cell.dateStr);
                    }}
                    className={`min-h-[85px] sm:min-h-[96px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      !cell.isCurrentMonth
                        ? "bg-secondary/10 border-border/20 opacity-40 hover:opacity-75"
                        : isSelected
                        ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary/30"
                        : hasHolidays
                        ? "bg-secondary/30 border-primary/20 hover:border-primary/50 hover:bg-secondary/40"
                        : "bg-card border-border/40 hover:border-border/80 hover:bg-secondary/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold font-mono rounded-lg w-6 h-6 flex items-center justify-center ${
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : isSelected
                            ? "text-primary font-extrabold"
                            : cell.isCurrentMonth
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {hasHolidays && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-1 mt-1 overflow-hidden">
                      {cell.holidays.slice(0, 2).map((h) => (
                        <div
                          key={h.id}
                          className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate border ${getHolidayBadgeStyle(
                            h.type
                          )}`}
                          title={`${h.title} (${h.type})`}
                        >
                          {h.title}
                        </div>
                      ))}
                      {cell.holidays.length > 2 && (
                        <span className="text-[9px] text-muted-foreground font-semibold block text-right">
                          +{cell.holidays.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground">Holiday Types:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>National (Mandatory)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Public Closure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Regional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Optional Floating</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Selected Date & Monthly Overview (1 Column) */}
          <div className="space-y-4 flex flex-col">
            {/* Selected Date Inspector Card */}
            <div className="glass-card rounded-3xl p-5 border border-border/60 bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground">Selected Date Details</span>
                <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md">
                  {activeDateStr || "None"}
                </span>
              </div>

              {selectedDateHolidays.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateHolidays.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 rounded-2xl bg-secondary/30 border border-border/50 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge className={`text-[10px] font-bold ${getHolidayBadgeStyle(h.type)}`}>
                            {h.type}
                          </Badge>
                          <h4 className="font-bold text-sm text-foreground mt-1.5">{h.title}</h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteHoliday(h.id)}
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="text-[11px] text-muted-foreground space-y-1 pt-1.5 border-t border-border/30">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {h.branchLocation}
                          </span>
                          <Badge className={h.mandatory ? "bg-emerald-500/15 text-emerald-500 text-[9px]" : "bg-secondary text-muted-foreground text-[9px]"}>
                            {h.mandatory ? "Mandatory" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2 bg-secondary/15 rounded-2xl p-4 border border-dashed border-border/50">
                  <CalendarDays className="w-7 h-7 mx-auto text-muted-foreground/40" />
                  <p className="text-xs font-semibold text-foreground">Standard Working Day</p>
                  <p className="text-[11px] text-muted-foreground">
                    No holiday scheduled for {activeDateStr}.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddHoliday(activeDateStr || undefined)}
                    className="h-7 text-xs font-semibold gap-1 mt-1 border-border/60 bg-background"
                  >
                    <Plus className="w-3 h-3" /> Schedule Holiday
                  </Button>
                </div>
              )}
            </div>

            {/* Month Summary & Upcoming Observances Card */}
            <div className="glass-card rounded-3xl p-5 border border-border/60 bg-card shadow-sm space-y-3 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs font-bold text-foreground">All Holidays in {MONTH_NAMES[month]}</span>
                <Badge variant="outline" className="text-[10px] font-bold text-primary">
                  {currentMonthHolidays.length} Total
                </Badge>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {currentMonthHolidays.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-xs space-y-1">
                    <Sparkles className="w-6 h-6 mx-auto text-muted-foreground/30" />
                    <p className="font-semibold text-foreground">No Holidays This Month</p>
                    <p className="text-[11px]">Use the navigation arrows to view other months.</p>
                  </div>
                ) : (
                  currentMonthHolidays.map((h) => (
                    <div
                      key={h.id}
                      onClick={() => setActiveDateStr(h.date)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        activeDateStr === h.date
                          ? "bg-primary/10 border-primary/40 text-foreground"
                          : "bg-secondary/25 border-border/40 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-foreground block truncate">{h.title}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{h.date}</span>
                      </div>
                      <Badge className={`text-[9px] font-semibold shrink-0 ${getHolidayBadgeStyle(h.type)}`}>
                        {h.type}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CARDS GRID VIEW */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHolidays.map((h) => (
            <div key={h.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-[10px] font-bold ${getHolidayBadgeStyle(h.type)}`}>
                  {h.type}
                </Badge>
                <Button variant="ghost" size="icon" onClick={() => onDeleteHoliday(h.id)} className="h-7 w-7 text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{h.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-mono">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary" /> {h.date}
                </p>
              </div>
              <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/30 flex items-center justify-between">
                <span>{h.branchLocation}</span>
                <Badge className={h.mandatory ? "bg-emerald-500/15 text-emerald-500 text-[10px]" : "bg-secondary text-muted-foreground text-[10px]"}>
                  {h.mandatory ? "Mandatory" : "Optional"}
                </Badge>
              </div>
            </div>
          ))}

          {filteredHolidays.length === 0 && (
            <div className="col-span-full p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
              <CalendarIcon className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <h4 className="font-bold text-sm text-foreground">No Holidays Found</h4>
              <p className="text-xs text-muted-foreground">Click "+ Add Company Holiday" or adjust your search filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HolidayCalendarView;