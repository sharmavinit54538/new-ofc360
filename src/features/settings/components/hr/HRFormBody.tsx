import type { HRFormData } from "../../types/hrTypes";
import { HRContactFields } from "./HRContactFields";
import { HRGrievanceFields } from "./HRGrievanceFields";
import { HRNotificationDirectives } from "./HRNotificationDirectives";

export function HRFormBody({ data, onChange }: { data: HRFormData; onChange: (d: HRFormData) => void }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <HRContactFields data={data} onChange={onChange} />
        <HRGrievanceFields data={data} onChange={onChange} />
      </div>
      <HRNotificationDirectives data={data} onChange={onChange} />
    </>
  );
}