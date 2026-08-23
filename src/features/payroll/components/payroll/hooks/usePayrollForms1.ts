import { useState } from "react";

export function usePayrollForms1() {
  const [runMonth, setRunMonth] = useState("June 2026");
  const [structGrade, setStructGrade] = useState("");
  const [structBasic, setStructBasic] = useState("50");
  const [structHra, setStructHra] = useState("20");
  const [structDa, setStructDa] = useState("10");
  const [reimbCategory, setReimbCategory] = useState("Fuel & Travel");
  const [reimbAmount, setReimbAmount] = useState("");
  const [reimbDesc, setReimbDesc] = useState("");
  return {
    runMonth, setRunMonth, structGrade, setStructGrade,
    structBasic, setStructBasic, structHra, setStructHra, structDa, setStructDa,
    reimbCategory, setReimbCategory, reimbAmount, setReimbAmount, reimbDesc, setReimbDesc,
  };
}
