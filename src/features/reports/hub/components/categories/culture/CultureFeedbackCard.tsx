export function CultureFeedbackCard({ cultureFeedbackRes }: { cultureFeedbackRes: any }) {
  const list = cultureFeedbackRes?.data;
  if (!list || list.length === 0) return null;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Anonymous Culture Feedback Sentiment</h3>
      <div className="space-y-2.5">
        {list.map((fb: any) => (
          <div key={fb.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-xs flex justify-between items-center">
            <div><span className="font-semibold text-white">{fb.theme}</span>{fb.comment && <p className="text-slate-400 mt-0.5">{fb.comment}</p>}</div>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${fb.sentiment === "positive" ? "bg-emerald-500/20 text-emerald-300" : fb.sentiment === "negative" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"}`}>{fb.sentiment}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
