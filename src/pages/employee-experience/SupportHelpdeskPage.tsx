import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/components/talent-intelligence/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/components/talent-intelligence/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/components/talent-intelligence/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { LifeBuoy, MessageSquare, Clock, ShieldCheck, CheckCircle2, Bot } from "lucide-react";

const featureCards = [
  {
    title: "HR & Payroll Queries",
    description: "Raise tickets for payslip deductions, tax forms, bonus clarification, and leave balance.",
    icon: LifeBuoy,
    category: "HR Support",
  },
  {
    title: "IT & Hardware Helpdesk",
    description: "Request VPN access, software licenses, password resets, and peripheral replacements.",
    icon: MessageSquare,
    category: "IT Support",
  },
  {
    title: "Admin & Facilities",
    description: "Office access cards, desk ergonomics, parking allocation, and meeting room support.",
    icon: ShieldCheck,
    category: "Admin",
  },
  {
    title: "SLA Resolution Tracking",
    description: "Real-time ticket status, priority badges, and turnaround time commitments.",
    icon: Clock,
    category: "SLA",
  },
  {
    title: "Knowledge Base FAQs",
    description: "Self-help directory of standard operating procedures, policies, and troubleshooting.",
    icon: CheckCircle2,
    category: "Knowledge",
  },
  {
    title: "AI Support Copilot",
    description: "Instant conversational answers and auto-routing of internal employee grievances.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "My Support Tickets", desc: "List of your active, pending, and resolved internal service tickets." },
  { title: "Knowledge Base FAQs", desc: "Top searched questions regarding leave policies, medical insurance, and IT setup." },
];

export default function SupportHelpdeskPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Support Helpdesk Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map((card) => (
              <TalentIntelligenceFeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                category={card.category}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {overviewSections.map((sec) => (
            <TalentIntelligenceSection key={sec.title} title={sec.title} description={sec.desc}>
              <TalentIntelligenceEmptyState
                title={`No support tickets created`}
                description="Helpdesk tickets will appear here when submitted."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}