import { TalentIntelligenceLayout } from "@/features/talent-intelligence/components/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/features/talent-intelligence/components/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/features/talent-intelligence/components/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/features/talent-intelligence/components/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/features/talent-intelligence/components/TalentIntelligenceEmptyState";
import { UserCheck, QrCode, ShieldAlert, Bell, FileSignature, Clock } from "lucide-react";

const featureCards = [
  {
    title: "Digital Guest Check-In",
    description: "Self-service iPad kiosk check-in with badge printing and contact capture.",
    icon: QrCode,
    category: "Check-In",
  },
  {
    title: "Host Notification",
    description: "Instant Slack/SMS alerts notifying host employees when their visitors arrive.",
    icon: Bell,
    category: "Alerts",
  },
  {
    title: "Digital NDA & Compliance",
    description: "Automated electronic signature capture for workplace confidentiality NDAs.",
    icon: FileSignature,
    category: "Compliance",
  },
  {
    title: "Visitor Security Log",
    description: "Real-time emergency muster roll and entry/exit timestamp auditing.",
    icon: ShieldAlert,
    category: "Security",
  },
  {
    title: "Pre-Registration Invites",
    description: "Send pre-scheduled visitor passes with QR codes for express lobby entry.",
    icon: UserCheck,
    category: "Invites",
  },
  {
    title: "Overstay Telemetry",
    description: "Automated alerts for visitors remaining on premises after operating hours.",
    icon: Clock,
    category: "Telemetry",
  },
];

const overviewSections = [
  { title: "Today's Visitor Log", desc: "Live status of checked-in guests, expected visitors, and checked-out attendees." },
  { title: "Pre-Registered Invites", desc: "Scheduled executive meetings, candidate interviews, and vendor site visits." },
];

export default function VisitorManagementPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Visitor Security Modules</h3>
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
                title={`No records available for ${sec.title}`}
                description="Visitor logs will appear when guests check in via the lobby kiosk."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}
