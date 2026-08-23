export function CreateReportFormActions({ isCreating, onCancel }: { isCreating: boolean; onCancel: () => void }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
      <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer">Cancel</button>
      <button type="submit" disabled={isCreating} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium cursor-pointer flex items-center gap-2">{isCreating ? "Generating..." : "Generate"}</button>
    </div>
  );
}
