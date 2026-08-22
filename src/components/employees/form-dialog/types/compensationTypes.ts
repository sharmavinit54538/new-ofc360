export interface CompensationState {
  ctc: number;
  setCtc: (v: number) => void;
  basicSalary: number;
  setBasicSalary: (v: number) => void;
  hra: number;
  setHra: (v: number) => void;
  bonus: number;
  setBonus: (v: number) => void;
  pfDeduction: number;
  setPfDeduction: (v: number) => void;
  esiDeduction: number;
  setEsiDeduction: (v: number) => void;
  profTax: number;
  setProfTax: (v: number) => void;
}
