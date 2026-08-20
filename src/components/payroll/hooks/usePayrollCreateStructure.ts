import { useCreateSalaryStructureMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollCreateStructure(props: any) {
  const [createSalaryStructure, { isLoading: isCreatingStructure }] = useCreateSalaryStructureMutation();
  const handleCreateStructure = async () => {
    if (!props.structGrade.trim()) return toast.error("Please enter a grade band name.");
    try {
      await createSalaryStructure({ name: props.structGrade.trim(), base_salary: 100000, currency: "INR", is_active: true, basicPct: parseFloat(props.structBasic) || 50, hraPct: parseFloat(props.structHra) || 20, daPct: parseFloat(props.structDa) || 10, specialAllowancePct: 20, conveyance: 1600, lta: 25000 } as any).unwrap();
      toast.success("Salary CTC Grade Template created!");
      props.setStructGrade(""); props.setIsStructModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create salary structure.");
    }
  };
  return { handleCreateStructure, isCreatingStructure };
}
