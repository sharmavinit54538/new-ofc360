import type { CompensationState } from "../types/compensationTypes";

export function buildCompPayload(comp: CompensationState) {
  return {
    salary: comp.ctc,
    ctc: comp.ctc,
    basicSalary: comp.basicSalary,
    hra: comp.hra,
    bonus: comp.bonus,
    pfDeduction: comp.pfDeduction,
    esiDeduction: comp.esiDeduction,
    profTax: comp.profTax,
  };
}
