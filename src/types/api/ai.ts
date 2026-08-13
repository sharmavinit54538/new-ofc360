export interface AIInsight {
  id: string;
  category: 'attrition' | 'burnout' | 'performance' | 'hiring';
  title: string;
  description: string;
  riskScore: number;
  recommendation: string;
  createdAt: string;
}
