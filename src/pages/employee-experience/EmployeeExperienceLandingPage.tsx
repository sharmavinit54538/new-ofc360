import { TalentIntelligenceLayout } from "@/features/talent-intelligence/components/TalentIntelligenceLayout";
import { TalentIntelligenceCard } from "@/features/talent-intelligence/components/TalentIntelligenceCard";
import { TalentIntelligenceEmptyState } from "@/features/talent-intelligence/components/TalentIntelligenceEmptyState";
import { Clock, UserCheck, Receipt, Plane, Megaphone, LifeBuoy } from "lucide-react";

const expModules = [
  {
    title: "Employee Timeline",
    description: "Career milestones, promotion history, awards, project anniversaries, and personal achievement roadmap.",
    icon: Clock,
    path: "/employee-experience/timeline",
    tag: "Milestones",
  },
  {
    title: "Visitor Management",
    description: "Digital guest check-ins, visitor security passes, host notifications, and front-desk visitor logs.",
    icon: UserCheck,
    path: "/employee-experience/visitors",
    tag: "Security",
  },
  {
    title: "Expense Claims",
    description: "Submit receipts, corporate expense reimbursements, mileage tracking, and manager approval queues.",
    icon: Receipt,
    path: "/employee-experience/expenses",
    tag: "Finance",
  },
  {
    title: "Travel Requests",
    description: "Corporate travel authorizations, flight and hotel reservations, itineraries, and per-diem management.",
    icon: Plane,
    path: "/employee-experience/travel",
    tag: "Travel",
  },
  {
    title: "Company Announcements",
    description: "Official leadership broadcasts, townhall updates, holiday notices, cultural recognitions, and circulars.",
    icon: Megaphone,
    path: "/employee-experience/announcements",
    tag: "Broadcasts",
  },
  {
    title: "Support Help Desk",
    description: "Internal IT, HR, and Operations ticketing system with SLA resolutions and request tracking.",
    icon: LifeBuoy,
    path: "/employee-experience/helpdesk",
    tag: "Support",
  },
];

export default function EmployeeExperienceLandingPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">
        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expModules.map((mod) => (
            <TalentIntelligenceCard
              key={mod.title}
              title={mod.title}
              description={mod.description}
              icon={mod.icon}
              path={mod.path}
              tag={mod.tag}
            />
          ))}
        </div>

        {/* Experience Overview Section */}
        <div className="space-y-4 pt-2">
          <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-foreground">
              Experience Telemetry & Activity Log
            </h4>
            <TalentIntelligenceEmptyState
              title="No active workplace requests or submissions"
              description="Submitted expense claims, travel authorizations, and visitor passes will appear here."
            />
          </div>
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}
