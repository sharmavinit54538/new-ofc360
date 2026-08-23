import { useDeleteSalaryStructureMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollDeleteStructure() {
  const [deleteSalaryStructure, { isLoading: isDeletingStructure }] = useDeleteSalaryStructureMutation();
  const handleDeleteStructure = async (id: string) => {
    try {
      await deleteSalaryStructure(id).unwrap();
      toast.success("Salary structure removed.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete salary structure.");
    }
  };
  return { handleDeleteStructure, isDeletingStructure };
}
