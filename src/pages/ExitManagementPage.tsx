import { useState } from "react";
import { motion } from "framer-motion";
import { UserMinus, FileText, DollarSign, MessageSquare, CheckCircle2, Circle, Package, Send, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export default function ExitManagementPage() {
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const [cases, setCases] = useState<any[]>([]);

  useState(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const companyId = localStorage.getItem("companyId") || sessionStorage.getItem("companyId");
        const res = await fetch("/api/v1/exit-management/cases", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(companyId ? { "X-Company-ID": companyId } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setCases(data);
        }
      } catch (e) {}
    };
    fetchCases();
  });

  const exitingEmployees = cases.length > 0 ? cases : employees.filter(
    (e) => (e?.status || "").toUpperCase() === "INACTIVE" || (e?.status || "").toUpperCase() === "EXITED"
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div>
        <h1 className="page-header">Exit & Separation Management</h1>
        <p className="page-subheader">Resignation tracking, clearance workflows, asset recovery & full-and-final settlement</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Separations", value: String(exitingEmployees.length), icon: UserMinus },
          { label: "Completed Departures", value: "0", icon: CheckCircle2 },
          { label: "Pending Asset Clearances", value: "0", icon: Package },
          { label: "Exit Interviews Logged", value: "0", icon: MessageSquare },
        ].map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">Separation Cases</TabsTrigger>
          <TabsTrigger value="workflow">Standard Clearance Workflow</TabsTrigger>
          <TabsTrigger value="settlement">Full & Final (FnF) Engine</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Ongoing Resignations & Exits</CardTitle></CardHeader>
            <CardContent>
              {exitingEmployees.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No active exit cases in progress. When an employee resignation is submitted, it will appear here.
                </div>
              ) : (
                <div className="space-y-3">
                  {exitingEmployees.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.role} · {c.department}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{c.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Standard 8-Step Offboarding Checklist</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {[
                  "1. Resignation Submission & Timestamp",
                  "2. Reporting Manager Review & Notice Period Confirmation",
                  "3. HR Business Partner Approval",
                  "4. Knowledge Transfer & Handover Sign-off",
                  "5. Exit Feedback Survey & Sentiment Evaluation",
                  "6. Hardware, ID & IT Access Revocation",
                  "7. Full & Final Settlement (FnF) Calculation",
                  "8. Experience Certificate & Relieving Letter Dispatch",
                ].map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-secondary/20 border border-border/40 flex items-center gap-2">
                    <Circle className="w-3.5 h-3.5 text-primary" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="mt-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">FnF Settlement Engine</CardTitle></CardHeader>
            <CardContent>
              <div className="p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 text-xs text-muted-foreground">
                Select an active exit case to compute unbilled days, leave encashment, gratuity, and tax deductions.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}