import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/components/talent-intelligence/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/components/talent-intelligence/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/components/talent-intelligence/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { Plane, Building, Compass, FileCheck, DollarSign, Calendar } from "lucide-react";

const featureCards = [
  {
    title: "Travel Requisitions",
    description: "Submit travel purpose, destination city, client meetings, and departure dates.",
    icon: Plane,
    category: "Requisitions",
  },
  {
    title: "Hotel & Stay Booking",
    description: "Company-preferred partner hotels and corporate accommodation rates.",
    icon: Building,
    category: "Accommodation",
  },
  {
    title: "Daily Per-Diem Rates",
    description: "Automated standard daily allowances based on domestic and international tiers.",
    icon: DollarSign,
    category: "Per-Diem",
  },
  {
    title: "Travel Desk Approvals",
    description: "Budget verification, manager approvals, and corporate travel agent dispatch.",
    icon: FileCheck,
    category: "Approvals",
  },
  {
    title: "Itinerary & Flight Tickets",
    description: "Centralized boarding passes, cab vouchers, and travel insurance documents.",
    icon: Compass,
    category: "Itinerary",
  },
  {
    title: "Travel Calendar",
    description: "Synchronized department view of team members traveling on onsite client visits.",
    icon: Calendar,
    category: "Calendar",
  },
];

const overviewSections = [
  { title: "Upcoming Business Trips", desc: "Approved itineraries, flight times, and hotel booking vouchers." },
  { title: "Travel Budget Telemetry", desc: "Departmental travel spend versus allocated quarterly travel budgets." },
];

export default function TravelRequestsPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Corporate Travel Modules</h3>
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
                title={`No data available for ${sec.title}`}
                description="Travel records will appear when team members submit travel requests."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}