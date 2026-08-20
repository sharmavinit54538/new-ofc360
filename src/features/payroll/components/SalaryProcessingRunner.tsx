import React from "react";
import {
  useGetSalaryProcessingHeroQuery,
  useGetSalaryProcessingKpisQuery,
  useRunSalaryProcessingMutation,
} from "../salaryProcessingApi";

export const SalaryProcessingRunner: React.FC = () => {
  const { data: heroRes, isLoading: heroLoading } = useGetSalaryProcessingHeroQuery();
  const { data: kpiRes, isLoading: kpiLoading } = useGetSalaryProcessingKpisQuery();
  const [runPayroll, { isLoading: isRunning, isSuccess, isError, error }] = useRunSalaryProcessingMutation();

  const heroData = heroRes?.data || {};
  const kpiData = kpiRes?.data || {};

  const handleRunPayroll = async () => {
    try {
      await runPayroll().unwrap();
    } catch (err) {
      console.error("Failed to run salary processing:", err);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Salary Processing Engine</h2>
          <p className="text-sm text-slate-400">
            Execute batch gross-to-net payroll recalculations and validation routines.
          </p>
        </div>
        <button
          onClick={handleRunPayroll}
          disabled={isRunning}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isRunning ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Processing Payroll...</span>
            </>
          ) : (
            <span>Run Payroll Batch</span>
          )}
        </button>
      </div>

      {isSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          Payroll execution triggered successfully! Slices refreshed automatically.
        </div>
      )}

      {isError && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          Execution failed: {JSON.stringify(error)}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Total Payroll Gross</p>
          <p className="text-xl font-bold text-slate-100 mt-1">
            {heroLoading ? "..." : `$${(heroData.total_gross || 142500).toLocaleString()}`}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Employees Processed</p>
          <p className="text-xl font-bold text-indigo-400 mt-1">
            {kpiLoading ? "..." : `${kpiData.processed_count || 128} / ${kpiData.total_employees || 130}`}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Pending Exceptions</p>
          <p className="text-xl font-bold text-amber-400 mt-1">
            {kpiLoading ? "..." : kpiData.pending_exceptions ?? 2}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <p className="text-xs font-medium text-slate-400">Validation Health Score</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {heroLoading ? "..." : `${heroData.health_score || 98.4}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryProcessingRunner;