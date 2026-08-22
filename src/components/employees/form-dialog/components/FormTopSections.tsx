import type { EmployeeFormState } from "../types/employeeFormState";
import { BasicInfoSection } from "./BasicInfoSection";
import { ContactDetailsSection } from "./ContactDetailsSection";
import { JobDetailsSection } from "./JobDetailsSection";
import { CompensationSection } from "./CompensationSection";

export function FormTopSections({ state }: { state: EmployeeFormState }) {
  return (
    <>
      <BasicInfoSection basic={state.basic} />
      <ContactDetailsSection contact={state.contact} />
      <JobDetailsSection job={state.job} meta={state.meta} />
      <CompensationSection comp={state.comp} />
    </>
  );
}
