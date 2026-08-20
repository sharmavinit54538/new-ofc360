import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { TalentIntelligenceHeader } from "@/components/talent-intelligence/TalentIntelligenceHeader";
import { TalentIntelligenceFeatureCard } from "@/components/talent-intelligence/TalentIntelligenceFeatureCard";
import { TalentIntelligenceSection } from "@/components/talent-intelligence/TalentIntelligenceSection";
import { TalentIntelligenceEmptyState } from "@/components/talent-intelligence/TalentIntelligenceEmptyState";
import { Receipt, CreditCard, Upload, CheckCircle2, DollarSign, Bot } from "lucide-react";

const featureCards = [
  {
    title: "Expense Reimbursement",
    description: "Submit expense slips for client dinners, broadband, cell phone, and stationery.",
    icon: Receipt,
    category: "Claims",
  },
  {
    title: "OCR Receipt Scanning",
    description: "Auto-extract merchant name, tax breakdown, and total cost from receipt photos.",
    icon: Upload,
    category: "OCR",
  },
  {
    title: "Approval Workflow",
    description: "Multi-level managerial routing, finance approval queues, and policy limit checks.",
    icon: CheckCircle2,
    category: "Workflow",
  },
  {
    title: "Corporate Cards",
    description: "Reconcile corporate card swipes against uploaded bills and travel vouchers.",
    icon: CreditCard,
    category: "Corporate",
  },
  {
    title: "Direct Payouts",
    description: "Automated reimbursement disbursement alongside monthly payroll cycles.",
    icon: DollarSign,
    category: "Payouts",
  },
  {
    title: "AI Policy Audit",
    description: "Flag duplicate claims, weekend expenses, and out-of-policy spending limits.",
    icon: Bot,
    category: "AI Copilot",
  },
];

const overviewSections = [
  { title: "Active Claims Queue", desc: "List of pending, approved, and reimbursed employee claims." },
  { title: "Expense Category Breakdown", desc: "Monthly spend distribution across travel, food, tech, and wellness." },
];

export default function ExpenseClaimsPage() {
  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6">

        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground">Expense Management Modules</h3>
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
                description="Expense insights will appear when employee claims and receipts are submitted."
                moduleName={sec.title}
              />
            </TalentIntelligenceSection>
          ))}
        </div>
      </div>
    </TalentIntelligenceLayout>
  );
}