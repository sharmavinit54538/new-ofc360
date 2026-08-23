import { useReportsPageData } from "./reports-page/hooks/useReportsPageData";
import { ReportsPageBody } from "./reports-page/components/ReportsPageBody";

export default function ReportsPage() {
  const data = useReportsPageData();
  return <ReportsPageBody d={data} />;
}