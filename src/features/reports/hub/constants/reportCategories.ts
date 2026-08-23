import { Users, Award, Heart, Globe2, ShieldCheck } from "lucide-react";
import type { CategoryTabItem } from "../types/hubTypes";

export const CATEGORIES: CategoryTabItem[] = [
  { id: "workforce", label: "Workforce & Headcount", icon: Users },
  { id: "performance", label: "Performance & Appraisal", icon: Award },
  { id: "engagement", label: "Engagement & eNPS", icon: Heart },
  { id: "culture", label: "Culture & D&I Telemetry", icon: Globe2 },
  { id: "compliance", label: "Compliance & Risk Audit", icon: ShieldCheck },
];
