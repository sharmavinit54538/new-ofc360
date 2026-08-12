import { useDepartmentStore } from "@/stores/departmentStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight, ChevronDown, Users, Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DepartmentHierarchy() {
  const { departments, openCreateForm, openDrawer } = useDepartmentStore();
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasData = departments.length > 0;

  // Build tree
  const parentMap: Record<string, typeof departments> = {};
  const rootDepartments: typeof departments = [];

  departments.forEach((dept) => {
    if (!dept.parentDepartment) {
      rootDepartments.push(dept);
    } else {
      if (!parentMap[dept.parentDepartment]) {
        parentMap[dept.parentDepartment] = [];
      }
      parentMap[dept.parentDepartment].push(dept);
    }
  });

  if (!hasData) {
    return (
      <div className="glass-card rounded-xl p-12 border border-border/60 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Building2 className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-foreground">No organizational hierarchy available</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Create departments to build your organizational hierarchy tree and view departmental reporting chains.
          </p>
        </div>
        <Button size="sm" onClick={openCreateForm} className="gradient-bg text-primary-foreground gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Create Department
        </Button>
      </div>
    );
  }

  const renderNode = (dept: (typeof departments)[0], depth = 0) => {
    const children = parentMap[dept.name] || [];
    const hasChildren = children.length > 0;
    const isCollapsed = collapsedNodes[dept.id];

    return (
      <div key={dept.id} className="space-y-2">
        <div
          className={`flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/80 shadow-xs transition-all hover:border-primary/30 ${
            depth > 0 ? "ml-6 md:ml-10 border-l-2 border-l-primary/40" : ""
          }`}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleNode(dept.id)}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-6 shrink-0" />
          )}

          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 font-bold text-xs">
            {dept.code.slice(0, 3)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => openDrawer(dept)}
                className="text-xs font-bold text-foreground hover:text-primary transition-colors truncate"
              >
                {dept.name}
              </button>
              <Badge variant="outline" className="text-[10px] font-mono">
                {dept.code}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Head: <span className="text-foreground font-medium">{dept.head || "Unassigned"}</span>
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs shrink-0">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-primary" />
              Capacity: <span className="font-semibold text-foreground">{dept.capacity || "—"}</span>
            </span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
              {dept.status}
            </Badge>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {children.map((child) => renderNode(child, depth + 1))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div>
          <h3 className="text-sm font-bold text-foreground">Organizational Hierarchy Tree</h3>
          <p className="text-xs text-muted-foreground">Department reporting structure & sub-units</p>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {rootDepartments.length} Root Units
        </span>
      </div>

      <div className="space-y-3">
        {rootDepartments.map((dept) => renderNode(dept, 0))}
      </div>
    </div>
  );
}
