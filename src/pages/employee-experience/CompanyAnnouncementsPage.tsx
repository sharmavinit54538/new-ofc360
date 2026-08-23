import { TalentIntelligenceLayout } from "@/features/talent-intelligence/components/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/features/talent-intelligence/components/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/features/talent-intelligence/components/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/features/talent-intelligence/components/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/features/talent-intelligence/components/TalentIntelligenceEmptyState";
import { Megaphone, Bell, Calendar, Sparkles, Pin, ShieldCheck } from "lucide-react";

const featureCards = [
  {
    title: "Leadership Broadcasts",
    description: "Townhall recaps, CEO updates, and company quarterly roadmap announcements.",
    icon: Megaphone,
    category: "Leadership",
  },
  {
    title: "Holiday Calendar",
    description: "Official statutory holidays, optional leaves, and company shutdown schedules.",
    icon: Calendar,
    category: "Holidays",
  },
  {
    title: "HR Policy Circulars",
    description: "New policy rollouts, remote-work guidelines, and compliance directives.",
    icon: ShieldCheck,
    category: "Policies",
  },
  {
    title: "Pinned Urgent Notices",
    description: "System maintenance downtimes, office closures, and critical weather advisories.",
    icon: Pin,
    category: "Urgent",
  },
  {
    title: "Team Spotlights",
    description: "Celebrating employee promotions, new hires, and cultural festivals.",
    icon: Sparkles,
    category: "Spotlight",
  },
  {
    title: "Push Notifications",
    description: "Multi-channel announcement broadcasts via Slack, Microsoft Teams, and Mobile App.",
    icon: Bell,
    category: "Channels",
  },
];

const overviewSections = [
  { title: "Active Announcements Board", desc: "Company-wide circulars and news feeds published by HR Leadership." },
  { title: "Upcoming Company Events", desc: "Townhall dates, hackathons, and cultural celebration schedules." },
];

export default function CompanyAnnouncementsPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Announcement Modules</h3>
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
                title={`No announcements published yet`}
                description="Company notices and circulars will appear when posted by leadership."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}
