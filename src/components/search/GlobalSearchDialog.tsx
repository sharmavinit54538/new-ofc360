import { useState, useEffect, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useGetRecruitmentCandidatesQuery } from "@/services/api/recruitment/recruitmentCandidateEndpoints";
import { Employee } from "@/types/hr";
import { BackendCandidateListItem } from "@/services/api/recruitment/recruitmentCandidateTypes";
import { NAVIGATION_SEARCH_ITEMS } from "./searchNavItems";
import { ActionSearchItem, NavSearchItem, SearchCategory } from "./searchTypes";
import { SearchCategoryTabs } from "./SearchCategoryTabs";
import { SearchEmployeeItem } from "./SearchEmployeeItem";
import { SearchCandidateItem } from "./SearchCandidateItem";
import { SearchNavItem } from "./SearchNavItem";
import { SearchActionItem } from "./SearchActionItem";
import {
  Search,
  X,
  UserPlus,
  Calendar,
  CreditCard,
  Sparkles,
  MessageSquare,
  Sun,
  Moon,
  LogOut,
  CornerDownLeft,
  ArrowUpDown,
  Command as CommandIcon,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface GlobalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

type FlattenedSearchItem =
  | { type: "employee"; data: Employee }
  | { type: "candidate"; data: BackendCandidateListItem }
  | { type: "page"; data: NavSearchItem }
  | { type: "action"; data: ActionSearchItem };

export function GlobalSearchDialog({
  open,
  onOpenChange,
  initialQuery = "",
}: GlobalSearchDialogProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Sync initial query when dialog opens
  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setDebouncedQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialQuery]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 120);
    return () => clearTimeout(timer);
  }, [query]);

  // Live queries
  const { data: rawEmployees = [] } = useGetEmployeesQuery(undefined, {
    skip: !open,
  });
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  const { data: candidatesData } = useGetRecruitmentCandidatesQuery(undefined, {
    skip: !open,
  });
  const candidates = useMemo(() => Array.isArray(candidatesData?.items) ? candidatesData.items : [], [candidatesData]);

  // Action definitions
  const quickActions: ActionSearchItem[] = useMemo(() => [
    {
      id: "action-add-employee",
      title: "Add New Employee",
      description: "Create a new workforce profile and onboard team member",
      category: "actions",
      icon: UserPlus,
      shortcut: "Alt+N",
      keywords: ["create employee", "new hire", "register employee", "add staff"],
      action: () => {
        navigate("/people");
        onOpenChange(false);
      },
    },
    {
      id: "action-apply-leave",
      title: "Apply for Leave",
      description: "Submit a new time-off or vacation request",
      category: "actions",
      icon: Calendar,
      keywords: ["leave", "vacation", "holiday", "sick day", "time off"],
      action: () => {
        navigate("/attendance");
        onOpenChange(false);
      },
    },
    {
      id: "action-payroll",
      title: "Process Payroll",
      description: "Review payroll disbursements and salary calculations",
      category: "actions",
      icon: CreditCard,
      keywords: ["salary", "payroll", "payslip", "wages", "pay run"],
      action: () => {
        navigate("/payroll");
        onOpenChange(false);
      },
    },
    {
      id: "action-screen-resume",
      title: "Screen Resume & ATS",
      description: "Upload resume to test ATS parser and match candidates",
      category: "actions",
      icon: Sparkles,
      keywords: ["ats", "resume", "score", "candidate", "screen", "cv"],
      action: () => {
        navigate("/talent-intelligence");
        onOpenChange(false);
      },
    },
    {
      id: "action-new-chat",
      title: "New Connect Message",
      description: "Start a direct conversation with a colleague",
      category: "actions",
      icon: MessageSquare,
      keywords: ["chat", "message", "dm", "connect", "conversation"],
      action: () => {
        navigate("/connect");
        onOpenChange(false);
      },
    },
    {
      id: "action-toggle-theme",
      title: "Toggle Light / Dark Theme",
      description: "Switch between dark mode and light mode interface",
      category: "actions",
      icon: document.documentElement.classList.contains("dark") ? Sun : Moon,
      shortcut: "Ctrl+D",
      keywords: ["dark mode", "light mode", "theme", "color", "appearance"],
      action: () => {
        const isDark = document.documentElement.classList.toggle("dark");
        toast.success(`Switched to ${isDark ? "Dark" : "Light"} mode`);
        onOpenChange(false);
      },
    },
    {
      id: "action-logout",
      title: "Sign Out / Logout",
      description: "End your current active session securely",
      category: "actions",
      icon: LogOut,
      keywords: ["logout", "sign out", "exit", "leave"],
      action: async () => {
        onOpenChange(false);
        try {
          await logout();
        } finally {
          toast.success("Signed out successfully");
          navigate("/login");
        }
      },
    },
  ], [navigate, onOpenChange, logout]);

  // Filtering logic
  const filteredResults = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);

    const matchesAllWords = (text: string) => {
      if (!words.length) return true;
      const lower = text.toLowerCase();
      return words.every((w) => lower.includes(w));
    };

    // Employees
    const filteredEmployees = employees.filter((emp) => {
      if (!q) return true;
      const haystack = [
        emp.name,
        emp.full_name,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.personalEmail,
        emp.companyWorkEmail,
        emp.department,
        emp.designation,
        emp.role,
        emp.employeeId,
        emp.employeeCode,
        emp.phone,
      ]
        .filter(Boolean)
        .join(" ");
      return matchesAllWords(haystack);
    });

    // Candidates
    const filteredCandidates = candidates.filter((cand) => {
      if (!q) return true;
      const haystack = [
        cand.name,
        cand.email,
        cand.job_title,
        cand.current_role,
        cand.match_tier,
        cand.status,
      ]
        .filter(Boolean)
        .join(" ");
      return matchesAllWords(haystack);
    });

    // Navigation Pages
    const filteredPages = NAVIGATION_SEARCH_ITEMS.filter((item) => {
      if (!q) return true;
      const haystack = [
        item.title,
        item.section,
        item.path,
        ...(item.keywords || []),
      ]
        .filter(Boolean)
        .join(" ");
      return matchesAllWords(haystack);
    });

    // Actions
    const filteredActions = quickActions.filter((act) => {
      if (!q) return true;
      const haystack = [
        act.title,
        act.description,
        ...(act.keywords || []),
      ]
        .filter(Boolean)
        .join(" ");
      return matchesAllWords(haystack);
    });

    return {
      employees: filteredEmployees,
      candidates: filteredCandidates,
      pages: filteredPages,
      actions: filteredActions,
    };
  }, [debouncedQuery, employees, candidates, quickActions]);

  // Counts for category tabs
  const counts = useMemo(() => {
    const empLen = filteredResults?.employees?.length ?? 0;
    const candLen = filteredResults?.candidates?.length ?? 0;
    const pageLen = filteredResults?.pages?.length ?? 0;
    const actLen = filteredResults?.actions?.length ?? 0;
    return {
      all: empLen + candLen + pageLen + actLen,
      employees: empLen,
      candidates: candLen,
      pages: pageLen,
      actions: actLen,
    };
  }, [filteredResults]);

  // Flattened visible items for keyboard navigation
  const flattenedItems: FlattenedSearchItem[] = useMemo(() => {
    const list: FlattenedSearchItem[] = [];
    const empList = filteredResults?.employees || [];
    const candList = filteredResults?.candidates || [];
    const pageList = filteredResults?.pages || [];
    const actList = filteredResults?.actions || [];

    if (activeCategory === "all" || activeCategory === "employees") {
      const slice = activeCategory === "all" ? empList.slice(0, 5) : empList;
      slice.forEach((emp) => list.push({ type: "employee", data: emp }));
    }

    if (activeCategory === "all" || activeCategory === "candidates") {
      const slice = activeCategory === "all" ? candList.slice(0, 4) : candList;
      slice.forEach((cand) => list.push({ type: "candidate", data: cand }));
    }

    if (activeCategory === "all" || activeCategory === "pages") {
      const slice = activeCategory === "all" ? pageList.slice(0, 5) : pageList;
      slice.forEach((page) => list.push({ type: "page", data: page }));
    }

    if (activeCategory === "all" || activeCategory === "actions") {
      const slice = activeCategory === "all" ? actList.slice(0, 4) : actList;
      slice.forEach((act) => list.push({ type: "action", data: act }));
    }

    return list;
  }, [activeCategory, filteredResults]);

  // Reset selectedIndex when flattened list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [flattenedItems.length, activeCategory, debouncedQuery]);

  // Selection handlers
  const handleSelectEmployee = (emp: Employee) => {
    onOpenChange(false);
    const searchParam = emp.name || emp.full_name || emp.email || "";
    navigate(`/people?search=${encodeURIComponent(searchParam)}`);
    toast.info(`Opening profile for ${emp.name || emp.full_name || "Employee"}`);
  };

  const handleSelectCandidate = (candidate: BackendCandidateListItem) => {
    onOpenChange(false);
    navigate(`/talent-intelligence?candidate=${encodeURIComponent(candidate.candidate_id)}`);
    toast.info(`Opening ATS profile for ${candidate.name}`);
  };

  const handleSelectPage = (page: NavSearchItem) => {
    onOpenChange(false);
    navigate(page.path);
  };

  const handleSelectAction = (actionItem: ActionSearchItem) => {
    actionItem.action();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (flattenedItems.length > 0 ? (prev + 1) % flattenedItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (flattenedItems.length > 0 ? (prev - 1 + flattenedItems.length) % flattenedItems.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = flattenedItems[selectedIndex];
      if (current) {
        if (current.type === "employee") handleSelectEmployee(current.data);
        else if (current.type === "candidate") handleSelectCandidate(current.data);
        else if (current.type === "page") handleSelectPage(current.data);
        else if (current.type === "action") handleSelectAction(current.data);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  const totalResultsCount = counts.all;
  const hasNoResults = debouncedQuery.length > 0 && totalResultsCount === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onKeyDown={handleKeyDown}
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Workspace & Directory</DialogTitle>
          <DialogDescription>Search across employees, candidates, pages, and actions</DialogDescription>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-border/50 bg-secondary/20">
          <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workforce, employees, candidates, pages, actions..."
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm md:text-base placeholder:text-muted-foreground/60 h-auto"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors ml-2"
              title="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-muted-foreground bg-muted border border-border/50 rounded shadow-xs ml-2">
              ESC
            </kbd>
          )}
        </div>

        {/* Category Tabs */}
        <SearchCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        {/* Results Container */}
        <div className="max-h-[400px] overflow-y-auto p-3 space-y-4 scrollbar-thin">
          {hasNoResults ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center mx-auto text-muted-foreground">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  No matching results for "{debouncedQuery}"
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try searching with different keywords, employee IDs, department names, or check your spelling.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Workforce / Employees Section */}
              {(activeCategory === "all" || activeCategory === "employees") &&
                (filteredResults?.employees?.length || 0) > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Workforce ({filteredResults.employees.length})
                      </span>
                      {activeCategory === "all" && filteredResults.employees.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory("employees")}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          View all {filteredResults.employees.length}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {(activeCategory === "all"
                        ? filteredResults.employees.slice(0, 5)
                        : filteredResults.employees
                      ).map((emp) => {
                        const globalIndex = flattenedItems.findIndex(
                          (item) => item.type === "employee" && item.data.id === emp.id
                        );
                        return (
                          <SearchEmployeeItem
                            key={`emp-${emp.id || emp.email}`}
                            employee={emp}
                            isSelected={selectedIndex === globalIndex}
                            onSelect={handleSelectEmployee}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Candidates Section */}
              {(activeCategory === "all" || activeCategory === "candidates") &&
                (filteredResults?.candidates?.length || 0) > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        ATS Candidates ({filteredResults.candidates.length})
                      </span>
                      {activeCategory === "all" && filteredResults.candidates.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory("candidates")}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          View all {filteredResults.candidates.length}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {(activeCategory === "all"
                        ? filteredResults.candidates.slice(0, 4)
                        : filteredResults.candidates
                      ).map((cand) => {
                        const globalIndex = flattenedItems.findIndex(
                          (item) => item.type === "candidate" && item.data.candidate_id === cand.candidate_id
                        );
                        return (
                          <SearchCandidateItem
                            key={`cand-${cand.candidate_id}`}
                            candidate={cand}
                            isSelected={selectedIndex === globalIndex}
                            onSelect={handleSelectCandidate}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Pages Section */}
              {(activeCategory === "all" || activeCategory === "pages") &&
                (filteredResults?.pages?.length || 0) > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Pages & Modules ({filteredResults.pages.length})
                      </span>
                      {activeCategory === "all" && filteredResults.pages.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setActiveCategory("pages")}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          View all {filteredResults.pages.length}
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {(activeCategory === "all"
                        ? filteredResults.pages.slice(0, 5)
                        : filteredResults.pages
                      ).map((page) => {
                        const globalIndex = flattenedItems.findIndex(
                          (item) => item.type === "page" && item.data.id === page.id
                        );
                        return (
                          <SearchNavItem
                            key={`page-${page.id}`}
                            item={page}
                            isSelected={selectedIndex === globalIndex}
                            onSelect={handleSelectPage}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Quick Actions Section */}
              {(activeCategory === "all" || activeCategory === "actions") &&
                (filteredResults?.actions?.length || 0) > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Quick Actions ({filteredResults.actions.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {(activeCategory === "all"
                        ? filteredResults.actions.slice(0, 4)
                        : filteredResults.actions
                      ).map((act) => {
                        const globalIndex = flattenedItems.findIndex(
                          (item) => item.type === "action" && item.data.id === act.id
                        );
                        return (
                          <SearchActionItem
                            key={`act-${act.id}`}
                            item={act}
                            isSelected={selectedIndex === globalIndex}
                            onSelect={handleSelectAction}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
            </>
          )}
        </div>

        {/* Dialog Footer with Keyboard Shortcuts Hints */}
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border border-border/60 rounded text-[10px] font-mono">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border border-border/60 rounded text-[10px] font-mono">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted border border-border/60 rounded text-[10px] font-mono">
                ESC
              </kbd>
              <span>to close</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-medium">
            <CommandIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground">OFC360 Global Search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
