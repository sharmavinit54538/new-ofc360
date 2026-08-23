import React from "react";
import { useReportsHubData } from "./hub/hooks/useReportsHubData";
import { ReportsHubBody } from "./hub/components/ReportsHubBody";

export const ReportsHub: React.FC = () => {
  const data = useReportsHubData();
  return <ReportsHubBody d={data} />;
};

export default ReportsHub;