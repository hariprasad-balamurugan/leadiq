export interface IContact {
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
}

export interface IScoreBreakdown {
  signal: string;
  maxPoints: number;
  points: number;
  matched: boolean;
  description: string;
}

export interface ILead {
  _id: string;
  name: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: number;
  technologies: string[];
  revenueEstimate: number;
  growthSignals: string[];
  contact: IContact;
  leadScore: number;
  priority: 'High' | 'Medium' | 'Low';
  scoreBreakdown: IScoreBreakdown[];
  whySummary?: string[];
  verified: boolean;
  isSaved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILeadStats {
  totalLeads: number;
  highScoreLeads: number;
  savedLeads: number;
  avgScore: number;
  industryDistribution: { industry: string; count: number }[];
  techDistribution: { tech: string; count: number }[];
}

export interface FilterState {
  search: string;
  industries: string[];
  location: string;
  minEmployees: number;
  maxEmployees: number;
  technologies: string[];
  minScore: number;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  isSaved?: boolean;
}
