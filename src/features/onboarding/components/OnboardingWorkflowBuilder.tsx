import React, { useState } from "react";
import {
  useListWorkflowsQuery,
  useCreateWorkflowMutation,
  useDeleteWorkflowMutation,
  useListNewHiresQuery,
  useCreateNewHireMutation,
  useDeleteNewHireMutation,
  useListDocumentRequirementsQuery,
  useCreateDocumentRequirementMutation,
  useDeleteDocumentRequirementMutation,
  useListTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
} from "../hrOnboardingWorkflowApi";
import {
  Workflow,
  ListCheck,
  FileCheck2,
  UserPlus,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export const OnboardingWorkflowBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "workflows" | "new_hires" | "documents" | "tasks"
  >("workflows");

  // RTK Query hooks
  const { data: workflowsData, isLoading: isWfLoading } = useListWorkflowsQuery();
  const [createWorkflow, { isLoading: isCreatingWf }] = useCreateWorkflowMutation();
  const [deleteWorkflow] = useDeleteWorkflowMutation();

  const { data: newHiresData, isLoading: isHiresLoading } = useListNewHiresQuery();
  const [createNewHire, { isLoading: isCreatingHire }] = useCreateNewHireMutation();
  const [deleteNewHire] = useDeleteNewHireMutation();

  const { data: docsData, isLoading: isDocsLoading } =
    useListDocumentRequirementsQuery();
  const [createDocReq, { isLoading: isCreatingDoc }] =
    useCreateDocumentRequirementMutation();
  const [deleteDocReq] = useDeleteDocumentRequirementMutation();

  const { data: tasksData, isLoading: isTasksLoading } = useListTasksQuery();
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Form states
  const [wfName, setWfName] = useState("");
  const [wfDept, setWfDept] = useState("Engineering");

  const [hireName, setHireName] = useState("");
  const [hireEmail, setHireEmail] = useState("");
  const [hireDept, setHireDept] = useState("Engineering");
  const [hireRole, setHireRole] = useState("Software Engineer");
  const [hireStartDate, setHireStartDate] = useState("2026-09-01");

  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Compliance");
  const [docMandatory, setDocMandatory] = useState(true);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskRole, setTaskRole] = useState("IT Support");
  const [taskDueDays, setTaskDueDays] = useState(3);

  // Submit handlers
  const handleAddWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName.trim()) return;
    await createWorkflow({ name: wfName, department: wfDept });
    setWfName("");
  };

  const handleAddNewHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hireName.trim() || !hireEmail.trim()) return;
    await createNewHire({
      employee_name: hireName,
      email: hireEmail,
      department: hireDept,
      designation: hireRole,
      start_date: hireStartDate,
    });
    setHireName("");
    setHireEmail("");
  };

  const handleAddDocReq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    await createDocReq({
      name: docName,
      category: docCategory,
      is_mandatory: docMandatory,
    });
    setDocName("");
  };

  const handleAddTaskReq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await createTask({
      title: taskTitle,
      assignee_role: taskRole,
      due_days: Number(taskDueDays),
      is_required: true,
    });
    setTaskTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            HR Onboarding Workflow Builder
            <span className="text-xs font-normal px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Operational Templates
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure department onboarding workflows, new hires tracking, required documents, and task checklists.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-slate-950 p-1 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("workflows")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "workflows"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Workflows
          </button>
          <button
            onClick={() => setActiveTab("new_hires")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "new_hires"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> New Hires
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "documents"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" /> Documents
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === "tasks"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ListCheck className="w-3.5 h-3.5" /> Tasks
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
        {/* Tab 1: Workflows */}
        {activeTab === "workflows" && (
          <div className="space-y-6">
            <form onSubmit={handleAddWorkflow} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Workflow name (e.g. Engineering Onboarding Plan)"
                value={wfName}
                onChange={(e) => setWfName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={wfDept}
                onChange={(e) => setWfDept(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>
              <button
                type="submit"
                disabled={isCreatingWf}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Workflow
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isWfLoading ? (
                <p className="text-xs text-slate-400 py-6 text-center col-span-2">Loading workflows...</p>
              ) : (workflowsData?.data || []).map((wf) => (
                <div
                  key={wf.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{wf.name}</div>
                    <div className="text-xs text-slate-500">Dept: {wf.department || "General"}</div>
                  </div>
                  <button
                    onClick={() => deleteWorkflow(wf.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: New Hires */}
        {activeTab === "new_hires" && (
          <div className="space-y-6">
            <form onSubmit={handleAddNewHire} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Employee Name"
                value={hireName}
                onChange={(e) => setHireName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                required
                placeholder="Work Email"
                value={hireEmail}
                onChange={(e) => setHireEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={hireStartDate}
                  onChange={(e) => setHireStartDate(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isCreatingHire}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </form>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
              {isHiresLoading ? (
                <p className="text-xs text-slate-400 p-6 text-center">Loading new hires...</p>
              ) : (newHiresData?.data || []).map((hire) => (
                <div key={hire.id} className="p-4 bg-slate-950 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{hire.employee_name}</div>
                    <div className="text-xs text-slate-400">
                      {hire.email} • {hire.designation} ({hire.department})
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" /> Starts: {hire.start_date}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNewHire(hire.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Document Requirements */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <form onSubmit={handleAddDocReq} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Document Requirement Name (e.g., Tax W-4 Form)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isCreatingDoc}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Requirement
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isDocsLoading ? (
                <p className="text-xs text-slate-400 py-6 text-center col-span-2">Loading documents...</p>
              ) : (docsData?.data || []).map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{doc.name}</div>
                    <div className="text-xs text-slate-500">
                      Category: {doc.category} • {doc.is_mandatory ? "Mandatory" : "Optional"}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDocReq(doc.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Task Requirements */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            <form onSubmit={handleAddTaskReq} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Checklist Task Title (e.g. IT: Provision Company Laptop)"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Role (e.g. IT Admin)"
                value={taskRole}
                onChange={(e) => setTaskRole(e.target.value)}
                className="w-36 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isCreatingTask}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </form>

            <div className="space-y-2">
              {isTasksLoading ? (
                <p className="text-xs text-slate-400 py-6 text-center">Loading task checklists...</p>
              ) : (tasksData?.data || []).map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{t.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Assigned To: {t.assignee_role} • Due within {t.due_days} days
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
