import React, { useState } from "react";
import { Sparkles, Briefcase, FileText, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectJobWizardStep,
  setJobWizardStep,
} from "../recruitmentUiSlice";
import {
  useCreateJobMutation,
  useGenerateDescriptionMutation,
  useAiAutofillMutation,
} from "../jobsApi";

export const JobsManagerWizard: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectJobWizardStep);

  const [aiPrompt, setAiPrompt] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Remote",
    type: "full-time",
    description: "",
    requirements: [""],
    salary_min: 80000,
    salary_max: 120000,
  });

  const [aiAutofill, { isLoading: isAutofilling }] = useAiAutofillMutation();
  const [generateDesc, { isLoading: isGeneratingDesc }] = useGenerateDescriptionMutation();
  const [createJob, { isLoading: isCreatingJob, isSuccess }] = useCreateJobMutation();

  const handleAiAutofill = async () => {
    if (!aiPrompt) return;
    try {
      const res = await aiAutofill({ prompt: aiPrompt, department: formData.department }).unwrap();
      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          title: res.data?.title || prev.title,
          department: res.data?.department || prev.department,
          description: res.data?.description || prev.description,
          requirements: res.data?.requirements || prev.requirements,
        }));
      }
    } catch (err) {
      console.error("AI Autofill failed:", err);
    }
  };

  const handleGenerateDesc = async () => {
    try {
      const res = await generateDesc({
        title: formData.title || "Software Engineer",
        department: formData.department || "Engineering",
        key_skills: formData.requirements.filter(Boolean),
        seniority_level: "Senior",
      }).unwrap();
      if (res.data) {
        setFormData((prev) => ({
          ...prev,
          description: res.data?.description || prev.description,
          requirements: res.data?.requirements?.length ? res.data.requirements : prev.requirements,
        }));
      }
    } catch (err) {
      console.error("Generate Description failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements.filter(Boolean),
        salary_range: {
          min: formData.salary_min,
          max: formData.salary_max,
          currency: "USD",
        },
      }).unwrap();
    } catch (err) {
      console.error("Create Job failed:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-4xl mx-auto text-slate-100">
      {/* Wizard Header & Stepper */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Jobs Manager & AI Wizard
          </h2>
          <p className="text-xs text-slate-400">
            Create job postings effortlessly with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
                currentStep === step
                  ? "bg-indigo-600 text-white"
                  : currentStep > step
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <span>Step {step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI One-Click Prompt Bar */}
      {currentStep === 1 && (
        <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              One-Click AI Job Autofill
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Senior Frontend React Developer for FinTech team in NY..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 bg-slate-900/80 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAiAutofill}
              disabled={isAutofilling || !aiPrompt}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
            >
              {isAutofilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Autofill
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100"
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100"
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Employment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">Job Description</label>
              <button
                type="button"
                onClick={handleGenerateDesc}
                disabled={isGeneratingDesc}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate with AI
              </button>
            </div>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-sm text-slate-100"
              placeholder="Detailed job responsibilities and overview..."
            />

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Requirements & Skills</label>
              {formData.requirements.map((req, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...formData.requirements];
                    newReqs[idx] = e.target.value;
                    setFormData({ ...formData, requirements: newReqs });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-slate-100 mb-2"
                  placeholder={`Requirement #${idx + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, requirements: [...formData.requirements, ""] })}
                className="text-xs text-indigo-400 hover:underline"
              >
                + Add Requirement
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">{formData.title || "Untitled Job"}</h3>
              <p className="text-xs text-slate-400 mb-3">{formData.department} • {formData.location} • {formData.type}</p>
              <div className="text-xs text-slate-300 whitespace-pre-wrap mb-3">{formData.description}</div>
              <div className="flex flex-wrap gap-1.5">
                {formData.requirements.filter(Boolean).map((req, i) => (
                  <span key={i} className="bg-indigo-950 text-indigo-300 text-[10px] px-2 py-0.5 rounded border border-indigo-800">
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {isSuccess && (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3 rounded-md text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Job posting created and published successfully!
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => dispatch(setJobWizardStep(currentStep - 1))}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => dispatch(setJobWizardStep(currentStep + 1))}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-md flex items-center gap-1.5"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isCreatingJob}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-5 py-2 rounded-md flex items-center gap-1.5"
            >
              {isCreatingJob ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              Publish Job Opening
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
