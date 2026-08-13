import React from "react";
import {
  useGetPayCyclesQuery,
  useActivatePayCycleMutation,
  useLockPayCycleMutation,
  useArchivePayCycleMutation,
} from "../payCyclesApi";
import { PayCycle } from "../types";

export const PayCyclesList: React.FC = () => {
  const { data: response, isLoading, isError, error, refetch } = useGetPayCyclesQuery();
  const [activateCycle, { isLoading: isActivating }] = useActivatePayCycleMutation();
  const [lockCycle, { isLoading: isLocking }] = useLockPayCycleMutation();
  const [archiveCycle, { isLoading: isArchiving }] = useArchivePayCycleMutation();

  const payCycles: PayCycle[] = response?.data || [];

  const handleActivate = async (id: string) => {
    try {
      await activateCycle(id).unwrap();
    } catch (err) {
      console.error("Failed to activate cycle:", err);
    }
  };

  const handleLock = async (id: string) => {
    try {
      await lockCycle(id).unwrap();
    } catch (err) {
      console.error("Failed to lock cycle:", err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveCycle(id).unwrap();
    } catch (err) {
      console.error("Failed to archive cycle:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-400 animate-pulse">
        Loading pay cycles...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
        <p className="font-semibold">Error loading pay cycles</p>
        <p className="text-sm opacity-80">{JSON.stringify(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Payroll Cycles</h2>
          <p className="text-xs text-slate-400">Manage pay period schedules, activation, and locks</p>
        </div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Cycle Name</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Pay Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payCycles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No pay cycles found.
                </td>
              </tr>
            ) : (
              payCycles.map((cycle) => (
                <tr key={cycle.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3 font-semibold text-slate-100">{cycle.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {cycle.period_start} — {cycle.period_end}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">{cycle.pay_date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        cycle.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : cycle.status === "locked"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : cycle.status === "archived"
                          ? "bg-slate-500/10 text-slate-400 border border-slate-500/30"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {cycle.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {cycle.status !== "active" && (
                      <button
                        onClick={() => handleActivate(cycle.id)}
                        disabled={isActivating}
                        className="px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded text-xs font-medium transition disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}
                    {cycle.status !== "locked" && (
                      <button
                        onClick={() => handleLock(cycle.id)}
                        disabled={isLocking}
                        className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded text-xs font-medium transition disabled:opacity-50"
                      >
                        Lock
                      </button>
                    )}
                    {cycle.status !== "archived" && (
                      <button
                        onClick={() => handleArchive(cycle.id)}
                        disabled={isArchiving}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium transition disabled:opacity-50"
                      >
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayCyclesList;
