import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  getSavedLeads,
  toggleSaveLead,
  createLead,
  calculateCustomScore,
  getDashboardStats,
  exportCSV,
  reseedDatabase
} from '../controllers/leadController.js';

const router = Router();

// Specialized routes before parameterized routes
router.get('/stats', getDashboardStats);
router.get('/saved', getSavedLeads);
router.get('/export', exportCSV);
router.get('/search', getLeads);
router.post('/score', calculateCustomScore);
router.post('/seed', reseedDatabase);

// CRUD routes
router.get('/', getLeads);
router.post('/', createLead);
router.get('/:id', getLeadById);
router.post('/:id/save', toggleSaveLead);

export default router;
