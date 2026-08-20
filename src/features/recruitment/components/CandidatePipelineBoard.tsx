import React from "react";
import { Users, Star, ArrowRight, CheckCircle, XCircle, Clock, FileCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectCandidateFilters,
  selectKanbanDraggedCandidateId,
  setKanbanDraggedCandidateId,
} from "../recruitmentUiSlice";
import { useGetCandidatesQuery } from "../candidatesApi";
import { usePassRoundMutation, useRejectRoundMutation, useHoldRoundMutation } from "../interviewsApi";
import { useCreateOfferMutation } from "../offersApi";
import { Candidate, CandidatePipelineStage } from "../types";

const STAGES: CandidatePipelineStage[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export const CandidatePipelineBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectCandidateFilters);
  const draggedCandidateId = useAppSelector(selectKanbanDraggedCandidateId);

  const { data: candidatesRes, isLoading } = useGetCandidatesQuery(filters);
  const candidates = candidatesRes?.data || [];

  const [passRound] = usePassRoundMutation();
  const [rejectRound] = useRejectRoundMutation();
  const [holdRound] = useHoldRoundMutation();
  const [createOffer] = useCreateOfferMutation();

  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
    e.dataTransfer.setData("text/plain", candidateId);
    dispatch(setKanbanDraggedCandidateId(candidateId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStage: CandidatePipelineStage) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("text/plain") || draggedCandidateId;
    dispatch(setKanbanDraggedCandidateId(null));
    if (!candidateId) return;

    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === targetStage) return;

    try {
      if (targetStage === "Interview") {
        await passRound({ roundId: `round-${candidateId}`, candidateId }).unwrap();
      } else if (targetStage === "Offer") {
        await createOffer({
          applicationId: candidateId,
          body: {
            candidate_id: candidateId,
            salary: 110000,
            start_date: "2026-09-01",
            expiry_date: "2026-09-15",
          },
        }).unwrap();
      } else if (targetStage === "Rejected") {
        await rejectRound({ roundId: `round-${candidateId}`, candidateId }).unwrap();
      } else if (targetStage === "Screening") {
        await holdRound({ roundId: `round-${candidateId}`, candidateId }).unwrap();
      }
    } catch (err) {
      console.error("Stage transition failed:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Drag & Drop Candidate Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Kanban pipeline driven by interview round evaluations and offer release
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-md">
          Total Candidates: <span className="font-semibold text-slate-200">{candidates.length}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400">
          Loading candidate pipeline...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 min-h-[350px] flex flex-col"
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300">{stage}</span>
                  <span className="text-[10px] font-medium bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    {stageCandidates.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate.id)}
                      className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-md shadow-sm cursor-grab active:cursor-grabbing transition-all group"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                          {candidate.name}
                        </h4>
                        {candidate.ats_score && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-emerald-400" />
                            {candidate.ats_score}%
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{candidate.current_role || "Applicant"}</p>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.5 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Quick stage action trigger */}
                      <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-800/60 text-[10px]">
                        <button
                          type="button"
                          onClick={() => passRound({ roundId: `round-${candidate.id}`, candidateId: candidate.id })}
                          title="Pass Round"
                          className="p-1 hover:bg-slate-800 text-emerald-400 rounded"
                        >
                          <CheckCircle className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => holdRound({ roundId: `round-${candidate.id}`, candidateId: candidate.id })}
                          title="Put on Hold"
                          className="p-1 hover:bg-slate-800 text-amber-400 rounded"
                        >
                          <Clock className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectRound({ roundId: `round-${candidate.id}`, candidateId: candidate.id })}
                          title="Reject Candidate"
                          className="p-1 hover:bg-slate-800 text-rose-400 rounded"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {stageCandidates.length === 0 && (
                    <div className="h-full flex items-center justify-center text-[10px] text-slate-600 border border-dashed border-slate-800 rounded p-4">
                      Drop candidate here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};