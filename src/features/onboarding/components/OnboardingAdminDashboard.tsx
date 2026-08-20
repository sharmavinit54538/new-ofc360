import React, { useState } from "react";
import {
  useListEmployeeProgressQuery,
  useGetEmployeeProgressDetailQuery,
  useVerifyEmployeeDocumentMutation,
} from "../onboardingAdminApi";
import { EmployeeProgressFilters } from "../types";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  FileCheck2,
  Clock,
  ChevronRight,
  Sparkles,
  Building,
} from "lucide-react";

export const OnboardingAdminDashboard: React.FC = () => {
  const [filters, setFilters] = useState<EmployeeProgressFilters>({
    status: "",
    department: "",
    search: "",
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [verifyNotes, setVerifyNotes] = useState<string>("");

  const { data: listData, isLoading: isLoadingList } =
    useListEmployeeProgressQuery(filters);
  const { data: detailData, isLoading: isLoadingDetail } =
    useGetEmployeeProgressDetailQuery(selectedEmployeeId || "", {
      skip: !selectedEmployeeId,
    });

  const [verifyDocument, { isLoading: isVerifying }] =
    useVerifyEmployeeDocumentMutation();

  const handleVerify = async (docId: string, verified: boolean) => {
    if (!selectedEmployeeId) return;
    try {
      await verifyDocument({
        employeeId: selectedEmployeeId,
        docId,
        body: { verified, notes: verifyNotes },
      }).unwrap();
      setVerifyNotes("");
    } catch (err: any) {
      console.error("Failed to verify document", err);
    }
  };

  const employees = listData?.data || [];
  const selectedEmployee = detailData?.data;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Employee Onboarding Oversight
            <span className="text-xs font-normal px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> HR Admin Monitor
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Track new hire wizard progress, verify compliance documents, and inspect completion status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search employee..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-48"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.status || ""}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl">
        {isLoadingList ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading onboarding records...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No employee onboarding records found matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-semibold uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Department / Role</th>
                  <th className="px-6 py-4">Current Step</th>
                  <th className="px-6 py-4">Completion</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {employees.map((emp) => (
                  <tr
                    key={emp.employee_id}
                    onClick={() => setSelectedEmployeeId(emp.employee_id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-100">{emp.employee_name}</div>
                      <div className="text-xs text-slate-400">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-200">{emp.designation}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Building className="w-3 h-3" /> {emp.department}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                        Step {emp.current_step} of 9
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{emp.completion_percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400"
                            style={{ width: `${emp.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {emp.onboarding_completed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3 h-3" /> Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployeeId(emp.employee_id);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" /> Detail <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Detail Drawer Modal */}
      {selectedEmployeeId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Employee Onboarding Detail</h3>
                <p className="text-xs text-slate-400">ID: {selectedEmployeeId}</p>
              </div>
              <button
                onClick={() => setSelectedEmployeeId(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Fetching detail...</p>
              </div>
            ) : selectedEmployee ? (
              <div className="space-y-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-base font-semibold text-slate-100">
                    {selectedEmployee.employee_name}
                  </div>
                  <div className="text-xs text-slate-400">{selectedEmployee.email}</div>
                  <div className="flex gap-4 text-xs text-slate-300 pt-2">
                    <div>
                      <span className="text-slate-500">Dept:</span> {selectedEmployee.department}
                    </div>
                    <div>
                      <span className="text-slate-500">Role:</span> {selectedEmployee.designation}
                    </div>
                  </div>
                </div>

                {/* Documents Verification Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-cyan-400" /> Uploaded Documents Verification
                  </h4>

                  {verifyNotes && (
                    <input
                      type="text"
                      placeholder="Optional verification note/comment..."
                      value={verifyNotes}
                      onChange={(e) => setVerifyNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                    />
                  )}

                  {!selectedEmployee.documents || selectedEmployee.documents.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center border border-dashed border-slate-800 rounded-lg">
                      No documents submitted yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedEmployee.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-medium text-slate-200">{doc.name}</div>
                            <div className="text-[11px] text-slate-500 capitalize">
                              {doc.document_type.replace(/_/g, " ")} • Status: {doc.status}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleVerify(doc.id, true)}
                              disabled={isVerifying}
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerify(doc.id, false)}
                              disabled={isVerifying}
                              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};