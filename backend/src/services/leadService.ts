import fs from 'fs';
import path from 'path';
import { LeadModel, ILead } from '../models/Lead.js';
import { calculateLeadScore, DEFAULT_TARGET_CRITERIA, TargetCriteria } from './leadScoring.js';

export async function seedLeads(forceReset = false) {
  const count = await LeadModel.countDocuments();
  if (count > 0 && !forceReset) {
    return { message: 'Database already populated', count };
  }

  if (forceReset) {
    await LeadModel.deleteMany({});
  }

  let seedPath = path.resolve(process.cwd(), 'src/data/leads.json');
  if (!fs.existsSync(seedPath)) {
    seedPath = path.resolve(process.cwd(), 'dist/data/leads.json');
  }
  if (!fs.existsSync(seedPath)) {
    seedPath = path.resolve(process.cwd(), 'backend/src/data/leads.json');
  }
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed file not found at ${seedPath}`);
  }

  const rawData = fs.readFileSync(seedPath, 'utf-8');
  const seedItems = JSON.parse(rawData);

  const leadsToSave = seedItems.map((item: any) => {
    const scored = calculateLeadScore(item);
    return {
      ...item,
      leadScore: scored.score,
      priority: scored.priority,
      scoreBreakdown: scored.breakdown
    };
  });

  const inserted = await LeadModel.insertMany(leadsToSave);
  return { message: 'Seed leads inserted successfully', count: inserted.length };
}

export interface LeadQueryFilter {
  search?: string;
  industry?: string | string[];
  location?: string | string[];
  minEmployees?: number;
  maxEmployees?: number;
  technologies?: string | string[];
  minScore?: number;
  maxScore?: number;
  priority?: 'High' | 'Medium' | 'Low' | string;
  isSaved?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function getLeads(query: LeadQueryFilter) {
  const dbQuery: any = {};

  // Text search in name, website, industry, location, contact
  if (query.search && query.search.trim()) {
    const regex = new RegExp(query.search.trim(), 'i');
    dbQuery.$or = [
      { name: regex },
      { website: regex },
      { industry: regex },
      { location: regex },
      { 'contact.name': regex },
      { 'contact.email': regex },
      { technologies: regex }
    ];
  }

  // Industry filter
  if (query.industry) {
    const indList = Array.isArray(query.industry)
      ? query.industry
      : query.industry.split(',').map((s) => s.trim());
    if (indList.length > 0 && indList[0] !== '') {
      dbQuery.industry = { $in: indList.map((i) => new RegExp(`^${i}$`, 'i')) };
    }
  }

  // Location filter
  if (query.location) {
    const locList = Array.isArray(query.location)
      ? query.location
      : query.location.split(',').map((s) => s.trim());
    if (locList.length > 0 && locList[0] !== '') {
      dbQuery.location = { $in: locList.map((l) => new RegExp(l, 'i')) };
    }
  }

  // Employee range filter
  if (query.minEmployees !== undefined || query.maxEmployees !== undefined) {
    dbQuery.employeeCount = {};
    if (query.minEmployees !== undefined) dbQuery.employeeCount.$gte = Number(query.minEmployees);
    if (query.maxEmployees !== undefined) dbQuery.employeeCount.$lte = Number(query.maxEmployees);
  }

  // Technology stack filter
  if (query.technologies) {
    const techList = Array.isArray(query.technologies)
      ? query.technologies
      : query.technologies.split(',').map((s) => s.trim());
    if (techList.length > 0 && techList[0] !== '') {
      dbQuery.technologies = { $in: techList.map((t) => new RegExp(`^${t}$`, 'i')) };
    }
  }

  // Minimum / Maximum Score filter
  if (query.minScore !== undefined || query.maxScore !== undefined) {
    dbQuery.leadScore = {};
    if (query.minScore !== undefined) dbQuery.leadScore.$gte = Number(query.minScore);
    if (query.maxScore !== undefined) dbQuery.leadScore.$lte = Number(query.maxScore);
  }

  // Priority filter
  if (query.priority && query.priority !== 'All') {
    dbQuery.priority = query.priority;
  }

  // Saved filter
  if (query.isSaved !== undefined) {
    dbQuery.isSaved = Boolean(query.isSaved);
  }

  // Sorting
  const sortField = query.sortBy || 'leadScore';
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const sortObj: any = { [sortField]: sortDirection };

  // Pagination
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 50));
  const skip = (page - 1) * limit;

  const total = await LeadModel.countDocuments(dbQuery);
  const leads = await LeadModel.find(dbQuery).sort(sortObj).skip(skip).limit(limit);

  return {
    leads,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getLeadById(id: string) {
  return LeadModel.findById(id);
}

export async function toggleSaveLead(id: string) {
  const lead = await LeadModel.findById(id);
  if (!lead) return null;
  lead.isSaved = !lead.isSaved;
  await lead.save();
  return lead;
}

export async function createLead(leadData: any, criteria: TargetCriteria = DEFAULT_TARGET_CRITERIA) {
  const normalizedName = (leadData.name || '').trim();
  const normalizedEmail = (leadData.contact?.email || '').trim().toLowerCase();
  let normalizedDomain = (leadData.website || '').trim().toLowerCase();
  
  if (normalizedDomain) {
    normalizedDomain = normalizedDomain.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  }

  // Deduplication check by website, contact email, or normalized company name
  const existingDomain = await LeadModel.findOne({
    $or: [
      { website: new RegExp(normalizedDomain, 'i') },
      { 'contact.email': normalizedEmail },
      { name: new RegExp(`^\\s*${normalizedName}\\s*$`, 'i') }
    ]
  });

  if (existingDomain) {
    throw new Error(
      `Duplicate Lead detected: Company name "${leadData.name}", website "${leadData.website}", or email "${leadData.contact?.email}" already exists!`
    );
  }

  // Calculate lead score & priority
  const scored = calculateLeadScore(leadData, criteria);

  const newLead = new LeadModel({
    ...leadData,
    leadScore: scored.score,
    priority: scored.priority,
    scoreBreakdown: scored.breakdown,
    verified: leadData.verified ?? true,
    isSaved: leadData.isSaved ?? false
  });

  return newLead.save();
}

export async function getDashboardStats() {
  const totalLeads = await LeadModel.countDocuments();
  const highScoreLeads = await LeadModel.countDocuments({ priority: 'High' });
  const savedLeads = await LeadModel.countDocuments({ isSaved: true });

  const scoreAggregate = await LeadModel.aggregate([
    { $group: { _id: null, avgScore: { $avg: '$leadScore' } } }
  ]);
  const avgScore = scoreAggregate.length > 0 ? Math.round(scoreAggregate[0].avgScore) : 0;

  // Industry breakdown
  const industryDistribution = await LeadModel.aggregate([
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Technology breakdown
  const techDistribution = await LeadModel.aggregate([
    { $unwind: '$technologies' },
    { $group: { _id: '$technologies', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  return {
    totalLeads,
    highScoreLeads,
    savedLeads,
    avgScore,
    industryDistribution: industryDistribution.map((i) => ({ industry: i._id, count: i.count })),
    techDistribution: techDistribution.map((t) => ({ tech: t._id, count: t.count }))
  };
}

export async function generateCSVExport(query: LeadQueryFilter) {
  const { leads } = await getLeads({ ...query, limit: 1000, page: 1 });

  const headers = [
    'company_name',
    'industry',
    'location',
    'employees',
    'technology',
    'revenue_usd',
    'lead_score',
    'priority',
    'contact_name',
    'contact_title',
    'contact_email',
    'contact_phone',
    'verified',
    'website'
  ];

  const rows = leads.map((lead) => {
    const techs = (lead.technologies || []).join('; ');
    return [
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.industry || '').replace(/"/g, '""')}"`,
      `"${(lead.location || '').replace(/"/g, '""')}"`,
      lead.employeeCount,
      `"${techs.replace(/"/g, '""')}"`,
      lead.revenueEstimate,
      lead.leadScore,
      lead.priority,
      `"${(lead.contact?.name || '').replace(/"/g, '""')}"`,
      `"${(lead.contact?.title || '').replace(/"/g, '""')}"`,
      `"${(lead.contact?.email || '').replace(/"/g, '""')}"`,
      `"${(lead.contact?.phone || '').replace(/"/g, '""')}"`,
      lead.verified ? 'Yes' : 'No',
      `"${(lead.website || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
