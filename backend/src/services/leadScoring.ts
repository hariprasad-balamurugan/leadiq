import { IScoreBreakdown } from '../models/Lead.js';

export interface TargetCriteria {
  targetIndustries?: string[];
  targetLocations?: string[];
  minEmployees?: number;
  maxEmployees?: number;
  targetTechnologies?: string[];
}

export const DEFAULT_TARGET_CRITERIA: TargetCriteria = {
  targetIndustries: ['SaaS', 'FinTech', 'Cybersecurity', 'Healthcare', 'AI'],
  targetLocations: ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'],
  minEmployees: 50,
  maxEmployees: 500,
  targetTechnologies: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Python']
};

export interface LeadScoreResult {
  score: number;
  priority: 'High' | 'Medium' | 'Low';
  breakdown: IScoreBreakdown[];
  whySummary: string[];
}

export function calculateLeadScore(
  leadData: {
    industry: string;
    location: string;
    employeeCount: number;
    technologies: string[];
    growthSignals: string[];
    contact?: { name?: string; title?: string; email?: string };
    verified?: boolean;
    website?: string;
  },
  criteria: TargetCriteria = DEFAULT_TARGET_CRITERIA
): LeadScoreResult {
  const breakdown: IScoreBreakdown[] = [];
  const whySummary: string[] = [];
  let score = 0;

  // 1. Industry Match (20 pts)
  const targetInds = criteria.targetIndustries || DEFAULT_TARGET_CRITERIA.targetIndustries!;
  const isIndustryMatch = targetInds.some((ind) =>
    leadData.industry?.toLowerCase().includes(ind.toLowerCase())
  );
  const indPoints = isIndustryMatch ? 20 : 5;
  score += indPoints;
  breakdown.push({
    signal: 'Industry match',
    maxPoints: 20,
    points: indPoints,
    matched: isIndustryMatch,
    description: isIndustryMatch
      ? `Matches target industry sector (${leadData.industry})`
      : `Secondary industry category (${leadData.industry})`
  });
  if (isIndustryMatch) {
    whySummary.push(`Industry matches target vertical (${leadData.industry})`);
  }

  // 2. Location Match (15 pts)
  const targetLocs = criteria.targetLocations || DEFAULT_TARGET_CRITERIA.targetLocations!;
  const isLocationMatch = targetLocs.some((loc) =>
    leadData.location?.toLowerCase().includes(loc.toLowerCase())
  );
  const locPoints = isLocationMatch ? 15 : 5;
  score += locPoints;
  breakdown.push({
    signal: 'Location match',
    maxPoints: 15,
    points: locPoints,
    matched: isLocationMatch,
    description: isLocationMatch
      ? `Operating in prime target hub (${leadData.location})`
      : `Located in region ${leadData.location}`
  });
  if (isLocationMatch) {
    whySummary.push(`Based in target tech hub (${leadData.location})`);
  }

  // 3. Company Size Match (15 pts)
  const minEmp = criteria.minEmployees ?? 50;
  const maxEmp = criteria.maxEmployees ?? 500;
  const empCount = leadData.employeeCount || 0;
  const isSizeMatch = empCount >= minEmp && empCount <= maxEmp;
  const sizePoints = isSizeMatch ? 15 : empCount > maxEmp ? 10 : 5;
  score += sizePoints;
  breakdown.push({
    signal: 'Company size match',
    maxPoints: 15,
    points: sizePoints,
    matched: isSizeMatch,
    description: isSizeMatch
      ? `Ideal sweet-spot employee size (${empCount} employees)`
      : `Company size ${empCount} employees`
  });
  if (isSizeMatch) {
    whySummary.push(`Ideal company size bracket (${empCount} employees)`);
  }

  // 4. Technology Match (15 pts)
  const targetTechs = criteria.targetTechnologies || DEFAULT_TARGET_CRITERIA.targetTechnologies!;
  const leadTechs = leadData.technologies || [];
  const matchedTechs = leadTechs.filter((tech) =>
    targetTechs.some((t) => t.toLowerCase() === tech.toLowerCase())
  );
  const techMatchRatio = matchedTechs.length > 0 ? Math.min(1, matchedTechs.length / 2) : 0;
  const techPoints = Math.round(techMatchRatio * 15);
  score += techPoints;
  breakdown.push({
    signal: 'Technology match',
    maxPoints: 15,
    points: techPoints,
    matched: matchedTechs.length > 0,
    description:
      matchedTechs.length > 0
        ? `Uses required tech stack (${matchedTechs.join(', ')})`
        : `No key target technologies detected`
  });
  if (matchedTechs.length > 0) {
    whySummary.push(`Uses required tech stack (${matchedTechs.join(', ')})`);
  }

  // 5. Growth Signals (15 pts)
  const growthSignals = leadData.growthSignals || [];
  const activeGrowth = growthSignals.length > 0;
  const growthPoints = Math.min(15, growthSignals.length * 5);
  score += growthPoints;
  breakdown.push({
    signal: 'Growth signal',
    maxPoints: 15,
    points: growthPoints,
    matched: activeGrowth,
    description: activeGrowth
      ? `Active growth signals identified: ${growthSignals.join(', ')}`
      : `No active hiring or funding signals detected`
  });
  if (activeGrowth) {
    whySummary.push(`Active growth signals (${growthSignals.join(', ')})`);
  }

  // 6. Contact Available (10 pts)
  const hasContact = Boolean(leadData.contact?.name && leadData.contact?.email);
  const isDecisionMaker =
    hasContact &&
    /ceo|cto|cpo|coo|vp|founder|head|director/i.test(leadData.contact?.title || '');
  const contactPoints = isDecisionMaker ? 10 : hasContact ? 6 : 0;
  score += contactPoints;
  breakdown.push({
    signal: 'Contact available',
    maxPoints: 10,
    points: contactPoints,
    matched: hasContact,
    description: isDecisionMaker
      ? `Verified Decision Maker identified (${leadData.contact?.name} - ${leadData.contact?.title})`
      : hasContact
      ? `Contact point available (${leadData.contact?.name})`
      : `No direct contact person available`
  });
  if (isDecisionMaker) {
    whySummary.push(`Decision maker identified (${leadData.contact?.title})`);
  }

  // 7. Website Verified (10 pts)
  const isVerified = Boolean(leadData.verified);
  const webPoints = isVerified ? 10 : 3;
  score += webPoints;
  breakdown.push({
    signal: 'Website verified',
    maxPoints: 10,
    points: webPoints,
    matched: isVerified,
    description: isVerified
      ? `Verified active web presence & domain security`
      : `Unverified domain presence`
  });
  if (isVerified) {
    whySummary.push(`Verified active web domain`);
  }

  // Calculate priority rating
  const priority: 'High' | 'Medium' | 'Low' =
    score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low';

  return {
    score,
    priority,
    breakdown,
    whySummary
  };
}
