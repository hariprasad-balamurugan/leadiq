import { Request, Response } from 'express';
import * as leadService from '../services/leadService.js';
import { calculateLeadScore, DEFAULT_TARGET_CRITERIA } from '../services/leadScoring.js';

export async function getLeads(req: Request, res: Response) {
  try {
    const query = {
      search: req.query.search as string,
      industry: req.query.industry as string | string[],
      location: req.query.location as string | string[],
      minEmployees: req.query.minEmployees ? Number(req.query.minEmployees) : undefined,
      maxEmployees: req.query.maxEmployees ? Number(req.query.maxEmployees) : undefined,
      technologies: req.query.technologies as string | string[],
      minScore: req.query.minScore ? Number(req.query.minScore) : undefined,
      maxScore: req.query.maxScore ? Number(req.query.maxScore) : undefined,
      priority: req.query.priority as string,
      isSaved: req.query.isSaved !== undefined ? req.query.isSaved === 'true' : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 50
    };

    const result = await leadService.getLeads(query);
    return res.json({ success: true, data: result.leads, pagination: { total: result.total, page: result.page, totalPages: result.totalPages } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getLeadById(req: Request, res: Response) {
  try {
    const lead = await leadService.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    const scored = calculateLeadScore(lead.toObject());
    return res.json({ success: true, data: { ...lead.toObject(), whySummary: scored.whySummary } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getSavedLeads(req: Request, res: Response) {
  try {
    const result = await leadService.getLeads({ isSaved: true, limit: 100 });
    return res.json({ success: true, data: result.leads, total: result.total });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function toggleSaveLead(req: Request, res: Response) {
  try {
    const updatedLead = await leadService.toggleSaveLead(req.params.id);
    if (!updatedLead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    return res.json({ success: true, message: updatedLead.isSaved ? 'Lead saved' : 'Lead unsaved', data: updatedLead });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function createLead(req: Request, res: Response) {
  try {
    const { name, website, industry, location, employeeCount, technologies, contact } = req.body;

    // Validation
    if (!name || !website || !industry || !location || !employeeCount || !contact?.name || !contact?.email) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: name, website, industry, location, employeeCount, and contact name & email are required.'
      });
    }

    const createdLead = await leadService.createLead(req.body);
    return res.status(201).json({ success: true, message: 'Lead successfully created and scored', data: createdLead });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

export async function calculateCustomScore(req: Request, res: Response) {
  try {
    const { leadData, targetCriteria } = req.body;
    if (!leadData) {
      return res.status(400).json({ success: false, error: 'leadData is required' });
    }
    const result = calculateLeadScore(leadData, targetCriteria || DEFAULT_TARGET_CRITERIA);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const stats = await leadService.getDashboardStats();
    return res.json({ success: true, data: stats });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function exportCSV(req: Request, res: Response) {
  try {
    const query = {
      search: req.query.search as string,
      industry: req.query.industry as string,
      location: req.query.location as string,
      minEmployees: req.query.minEmployees ? Number(req.query.minEmployees) : undefined,
      maxEmployees: req.query.maxEmployees ? Number(req.query.maxEmployees) : undefined,
      technologies: req.query.technologies as string,
      minScore: req.query.minScore ? Number(req.query.minScore) : undefined,
      priority: req.query.priority as string,
      isSaved: req.query.isSaved !== undefined ? req.query.isSaved === 'true' : undefined
    };

    const csvContent = await leadService.generateCSVExport(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leadiq_prospects_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function reseedDatabase(req: Request, res: Response) {
  try {
    const result = await leadService.seedLeads(true);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
