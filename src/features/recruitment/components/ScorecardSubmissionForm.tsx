import React, { useState } from "react";
import { Star, CheckCircle2, FileText, Loader2, Award } from "lucide-react";
import { useSubmitScorecardMutation } from "../scorecardsApi";
import { ScorecardSubmissionInput } from "../types";

interface Props {
  roundId: string;
  candidateId: string;
  candidateName?: string;
  onSuccess?: () => void;
}

export const ScorecardSubmissionForm: React.FC<Props> = ({
  roundId,
  candidateId,
  candidateName = "Candidate",
  onSuccess,
}) => {
  const [overallRating, setOverallRating] = useState<number>(4);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({
    "Technical Competency": 4,
    "Cultural & Team Fit": 5,
    "Communication & Soft Skills": 4,
    "Problem Solving Ability": 4,
  });
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState<
    "strong_hire" | "hire" | "no_hire" | "strong_no_hire"
  >("hire");

  const [submitScorecard, { isLoading, isSuccess }] = useSubmitScorecardMutation();

  const handleRatingChange = (category: string, value: number) => {
    setCategoryRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ScorecardSubmissionInput = {
      round_id: roundId,
      candidate_id: candidateId,
      overall_rating: overallRating,
      category_ratings: categoryRatings,
      comments,
      recommendation,
    };

    try {
      await submitScorecard(payload).unwrap();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Submit Scorecard failed:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl mx-auto text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Structured Scorecard Submission
          </h3>
          <p className="text-xs text-slate-400">
            Evaluating <span className="font-semibold text-slate-200">{candidateName}</span> (Round #{roundId})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating (1-5 Stars) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Overall Rating Rubric
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOverallRating(star)}
                className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= overallRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-400 ml-2">
              {overallRating} / 5 Stars
            </span>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Category Breakdown
          </label>
          {Object.entries(categoryRatings).map(([catName, rating]) => (
            <div
              key={catName}
              className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between"
            >
              <span className="text-xs text-slate-300 font-medium">{catName}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(catName, star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Hiring Recommendation
          </label>
          <select
            value={recommendation}
            onChange={(e) =>
              setRecommendation(
                e.target.value as "strong_hire" | "hire" | "no_hire" | "strong_no_hire"
              )
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100"
          >
            <option value="strong_hire">Strong Hire</option>
            <option value="hire">Hire</option>
            <option value="no_hire">No Hire</option>
            <option value="strong_no_hire">Strong No Hire</option>
          </select>
        </div>

        {/* Feedback Comments */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Detailed Interview Notes & Feedback
          </label>
          <textarea
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-sm text-slate-100"
            placeholder="Key strengths demonstrated, technical areas probed, or concerns..."
          />
        </div>

        {isSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3 rounded-md text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Scorecard evaluation submitted successfully!
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2 rounded-md flex items-center gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            Submit Evaluation Scorecard
          </button>
        </div>
      </form>
    </div>
  );
};