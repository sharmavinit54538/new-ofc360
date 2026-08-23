import { useState } from "react";
import { useGetCompanyFaceAttendanceQuery } from "@/services/api/faceAttendanceApi";

export function useCompanyFaceAttendance(enabled: boolean) {
  const [companyPage, setCompanyPage] = useState(1);
  const [companySearch, setCompanySearch] = useState("");
  const [companyDept, setCompanyDept] = useState("all");
  const [companyDate, setCompanyDate] = useState("");
  const [companyStatus, setCompanyStatus] = useState("all");

  const query = useGetCompanyFaceAttendanceQuery(
    { page: companyPage, limit: 10, search: companySearch || undefined, department: companyDept, date: companyDate || undefined, status: companyStatus },
    { skip: !enabled }
  );

  return { companyPage, setCompanyPage, companySearch, setCompanySearch, companyDept, setCompanyDept, companyDate, setCompanyDate, companyStatus, setCompanyStatus, ...query };
}
