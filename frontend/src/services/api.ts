import axios from 'axios';
import { ILead, ILeadStats, FilterState } from '../types/lead';

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api/leads`;

export async function getLeads(filters?: Partial<FilterState> & { page?: number; limit?: number }) {
  const params: any = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.industries && filters.industries.length > 0) {
    params.industry = filters.industries.join(',');
  }
  if (filters?.location) params.location = filters.location;
  if (filters?.minEmployees) params.minEmployees = filters.minEmployees;
  if (filters?.maxEmployees) params.maxEmployees = filters.maxEmployees;
  if (filters?.technologies && filters.technologies.length > 0) {
    params.technologies = filters.technologies.join(',');
  }
  if (filters?.minScore) params.minScore = filters.minScore;
  if (filters?.priority && filters.priority !== 'All') params.priority = filters.priority;
  if (filters?.sortBy) params.sortBy = filters.sortBy;
  if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters?.isSaved !== undefined) params.isSaved = filters.isSaved;
  if (filters?.page) params.page = filters.page;
  if (filters?.limit) params.limit = filters.limit;

  const res = await axios.get(`${API_BASE}`, { params });
  return res.data;
}

export async function getLeadById(id: string) {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
}

export async function getSavedLeads() {
  const res = await axios.get(`${API_BASE}/saved`);
  return res.data;
}

export async function getDashboardStats(): Promise<{ success: boolean; data: ILeadStats }> {
  const res = await axios.get(`${API_BASE}/stats`);
  return res.data;
}

export async function toggleSaveLead(id: string) {
  const res = await axios.post(`${API_BASE}/${id}/save`);
  return res.data;
}

export async function createLead(leadData: Partial<ILead>) {
  const res = await axios.post(`${API_BASE}`, leadData);
  return res.data;
}

export async function calculateCustomScore(leadData: any) {
  const res = await axios.post(`${API_BASE}/score`, { leadData });
  return res.data;
}

export async function exportLeadsCSV(filters?: Partial<FilterState>) {
  const params: any = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.industries && filters.industries.length > 0) params.industry = filters.industries.join(',');
  if (filters?.location) params.location = filters.location;
  if (filters?.minEmployees) params.minEmployees = filters.minEmployees;
  if (filters?.maxEmployees) params.maxEmployees = filters.maxEmployees;
  if (filters?.technologies && filters.technologies.length > 0) params.technologies = filters.technologies.join(',');
  if (filters?.minScore) params.minScore = filters.minScore;
  if (filters?.priority && filters.priority !== 'All') params.priority = filters.priority;

  const res = await axios.get(`${API_BASE}/export`, {
    params,
    responseType: 'blob'
  });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `leadiq_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function reseedDatabase() {
  const res = await axios.post(`${API_BASE}/seed`);
  return res.data;
}
