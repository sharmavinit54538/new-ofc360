import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";

export function usePayrollNav() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "salary-processing";
  const setTab = (tab: string) => setSearchParams({ tab });
  const { user } = useAuth();
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  return { activeTab, setTab, user, employees };
}
