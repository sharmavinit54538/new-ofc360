import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileSearch,
  Wand2,
  Calendar,
  UserPlus,
  ScanFace,
  CalendarOff,
  Calculator,
  MessageCircle,
  Heart,
  TrendingDown,
  BookOpen,
  Shield,
  DoorOpen,
  Camera,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Feature = {
  icon: any;
  label: string;
  desc: string;
  category: string;
  route: string;
};

const features: Feature[] = [
  { icon: FileSearch, label: "Resume ATS Scoring", desc: "AI-powered applicant tracking score for every resume", category: "Recruitment", route: "/ai/ats" },
  { icon: TrendingDown, label: "Candidate Ranking", desc: "Rank candidates based on role compatibility and skills match", category: "Recruitment", route: "/recruitment" },
  { icon: Wand2, label: "JD Auto-Generator", desc: "AI-assisted job description generator from skill specifications", category: "Recruitment", route: "/hiring-planning" },
  { icon: Calendar, label: "AI Interview Scheduling", desc: "Smart scheduling based on panel availability patterns", category: "Recruitment", route: "/recruitment" },
  { icon: UserPlus, label: "Onboarding Automation", desc: "Automated workflows for new employee setup and document collection", category: "People", route: "/onboarding" },
  { icon: ScanFace, label: "OCR Document Verification", desc: "Instant government ID and certification scanning and validation", category: "AI Tools", route: "/ai/documents" },
  { icon: Camera, label: "Face Attendance", desc: "Biometric facial recognition attendance logging and verification", category: "Attendance", route: "/ai/cctv" },
  { icon: CalendarOff, label: "Leave & Shift Telemetry", desc: "Workforce leave management and presence rate tracking", category: "Attendance", route: "/attendance" },
  { icon: Calculator, label: "Salary & Tax Calculator", desc: "Automated TDS computation, PF/ESI deductions, and salary structuring", category: "Payroll", route: "/payroll" },
  { icon: MessageCircle, label: "Support Chatbot", desc: "AI-powered employee self-service and complaint resolution", category: "Connect", route: "/connect" },
  { icon: Heart, label: "Employee Wellbeing & Morale", desc: "Team engagement tracking, pulse checks, and recognition hub", category: "Culture", route: "/engagement" },
  { icon: TrendingDown, label: "Attrition & Risk Telemetry", desc: "Workforce analytics and predictive turnover indicators", category: "Intelligence", route: "/analytics" },
  { icon: BookOpen, label: "Skill Gap Analysis", desc: "Competency gap identification and training curriculum paths", category: "Training", route: "/training" },
  { icon: Shield, label: "Compliance Tracking", desc: "Monitor labor law adherence and regulatory policy compliance", category: "Legal", route: "/compliance" },
  { icon: DoorOpen, label: "Exit Management", desc: "Resignation workflows, asset recovery checklist, and clearance", category: "Lifecycle", route: "/exit-management" },
];

export default function AIInsightsPage() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">AI Features & Intelligence Directory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explore and launch active AI modules, copilot services, and workforce analytics tools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => navigate(f.route)}
            className="glass-card rounded-2xl p-5 border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <f.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold">
                  {f.category}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {f.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs font-semibold text-primary">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}