import type { EmployeeFormState } from "../types/employeeFormState";
import { FormTopSections } from "./FormTopSections";
import { FormHistorySections } from "./FormHistorySections";
import { FormMiscSections } from "./FormMiscSections";

export function EmployeeFormBody({ state }: { state: EmployeeFormState }) {
  const holderName = `${state.basic.firstName} ${state.basic.lastName}`.trim();
  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8 scrollbar-thin">
      <FormTopSections state={state} />
      <FormHistorySections lists={state.lists} />
      <FormMiscSections lists={state.lists} holderName={holderName} />
    </div>
  );
}
