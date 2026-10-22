import express from 'express';
import { protect, companyOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

const router = express.Router();

// All company routes require auth + company role
router.use(protect, companyOnly);

// ── GET dashboard stats ── GET /api/company/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const applications = await Application.find({ company: req.user.companyName })
      .sort({ createdAt: -1 }).limit(10);
    const totalApps = await Application.countDocuments({ company: req.user.companyName });
    const pending   = await Application.countDocuments({ company: req.user.companyName, status: 'pending' });
    const shortlisted = await Application.countDocuments({ company: req.user.companyName, status: 'shortlisted' });
    const hired     = await Application.countDocuments({ company: req.user.companyName, status: 'hired' });

    res.json({
      success: true,
      stats: { totalApps, pending, shortlisted, hired, activeListings: req.user.activeListings || 0 },
      recentApplications: applications,
      company: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET all applications for this company ── GET /api/company/applications
router.get('/applications', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = { company: req.user.companyName };
    if (status && status !== 'all') filter.status = status;
    if (type   && type !== 'all')   filter.type = type;

    const apps  = await Application.find(filter)
      .populate('user', 'name email college year branch phone skills cgpa linkedIn github resume')
      .sort({ createdAt: -1 })
      .limit(+limit).skip((+page - 1) * +limit);
    const total = await Application.countDocuments(filter);

    res.json({ success: true, applications: apps, total, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── UPDATE application status ── PATCH /api/company/applications/:id
router.patch('/applications/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const valid = ['pending', 'shortlisted', 'interview', 'hired', 'rejected'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found.' });
    if (app.company !== req.user.companyName) return res.status(403).json({ message: 'Not authorized.' });

    app.status = status;
    if (notes) app.notes = notes;
    await app.save();

    res.json({ success: true, message: `Application marked as ${status}.`, application: app });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET company profile ── GET /api/company/profile
router.get('/profile', async (req, res) => {
  res.json({ success: true, company: req.user });
});

// ── UPDATE company profile ── PUT /api/company/profile
router.put('/profile', async (req, res) => {
  try {
    const allowed = ['companyName', 'industry', 'website', 'companySize', 'location', 'description', 'hrName', 'hrPhone', 'bio'];
    allowed.forEach(field => { if (req.body[field] !== undefined) req.user[field] = req.body[field]; });
    await req.user.save();
    res.json({ success: true, message: 'Profile updated.', company: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
