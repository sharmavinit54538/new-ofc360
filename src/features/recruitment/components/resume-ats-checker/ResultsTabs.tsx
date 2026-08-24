import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATSOverviewTab } from "./ATSOverviewTab";
import { ATSSkillsTab } from "./ATSSkillsTab";
import { ATSQualityTab } from "./ATSQualityTab";
import { ATSContentTab } from "./ATSContentTab";
import { ResumeATSReport } from "@/services/api/resumeAtsCheckerApi";

interface ResultsTabsProps {
  report: ResumeATSReport;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ResultsTabs({ report, activeTab, onTabChange }: ResultsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="bg-secondary/40 p-1 rounded-xl border border-border/50 grid grid-cols-2 sm:grid-cols-4 gap-1 w-full max-w-2xl">
        <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">
          Score Breakdown
        </TabsTrigger>
        <TabsTrigger value="skills" className="rounded-lg text-xs font-semibold">
          Skills Match Matrix
        </TabsTrigger>
        <TabsTrigger value="quality" className="rounded-lg text-xs font-semibold">
          Quality & Issues ({(report.issues || []).length})
        </TabsTrigger>
        <TabsTrigger value="parsed" className="rounded-lg text-xs font-semibold">
          Parsed Content
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ATSOverviewTab report={report} />
          </motion.div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ATSSkillsTab report={report} />
          </motion.div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <motion.div
            key="quality"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ATSQualityTab report={report} />
          </motion.div>
        </TabsContent>

        <TabsContent value="parsed" className="space-y-6">
          <motion.div
            key="parsed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ATSContentTab report={report} />
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
}