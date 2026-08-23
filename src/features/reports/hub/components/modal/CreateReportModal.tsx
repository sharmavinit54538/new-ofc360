import { FileText } from "lucide-react";
import { useCreateReportForm } from "../../hooks/useCreateReportForm";
import { CreateReportFormFields } from "./CreateReportFormFields";
import { CreateReportFormActions } from "./CreateReportFormActions";

export function CreateReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const f = useCreateReportForm(onClose);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3"><h3 className="text-base font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400" />Generate / Schedule New Report</h3><button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer text-lg font-bold">✕</button></div>
        <form onSubmit={f.handleCreate} className="space-y-4 text-xs">
          <CreateReportFormFields name={f.name} setName={f.setName} desc={f.description} setDesc={f.setDescription} type={f.type} setType={f.setType} format={f.format} setFormat={f.setFormat} sched={f.schedule} setSched={f.setSchedule} />
          <CreateReportFormActions isCreating={f.isCreating} onCancel={onClose} />
        </form>
      </div>
    </div>
  );
}