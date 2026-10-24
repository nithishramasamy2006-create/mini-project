import express from 'express';
import jwt from 'jsonwebtoken';
import Application from '../models/Application.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { sendApplicationConfirmation, sendStatusChangeAlert } from '../services/emailService.js';

const router = express.Router();

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Please login to apply' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please login again' });
  }
};

// POST /api/applications
router.post('/', protect, async (req, res) => {
  try {
    const { type, itemId, itemTitle, itemCompany, coverLetter, resumeLink, skills,
            userName, userEmail, userCollege, userBranch, userPhone } = req.body;

    // ── Prevent duplicate applications ──────────────────────
    const existing = await Application.findOne({ userId: req.user.id, type, itemId });
    if (existing) return res.status(400).json({ message: `You already applied to this ${type}!` });

    // ── Save application ─────────────────────────────────────
    const app = await Application.create({
      userId: req.user.id, user: req.user.id,
      userName, userEmail, userCollege, userBranch, userPhone,
      type, itemId, itemTitle, itemCompany, company: itemCompany,
      coverLetter, resumeLink, skills,
    });

    // ── Decrement spots & increment enrolled in Project ──────
    let updatedSpots = null;
    if (type === 'project' || type === 'internship') {
      const updated = await Project.findOneAndUpdate(
        { id: itemId, spots: { $gt: 0 } },
        { $inc: { spots: -1, enrolled: 1 } },
        { new: true }
      );
      if (updated) updatedSpots = updated.spots;
    }

    // ── Send confirmation email (non-blocking) ───────────────
    if (userEmail) {
      sendApplicationConfirmation({
        studentName:  userName  || 'Student',
        studentEmail: userEmail,
        role:         itemTitle   || type,
        company:      itemCompany || 'NaanMudhalvan',
        appId:        app._id?.toString(),
      }).catch(() => {}); // already handled inside service
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! 🎉 A confirmation email has been sent.',
      application: app,
      updatedSpots,
      emailSent: !!userEmail,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You already applied to this!' });
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/applications/:id/status — update status + send alert email
// Used by Company, College, and Admin portals
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const valid = ['pending', 'reviewed', 'shortlisted', 'interview', 'hired', 'accepted', 'rejected'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status value.' });

    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found.' });

    const prevStatus = app.status;
    app.status = status;
    if (notes !== undefined) app.notes = notes;
    await app.save();

    // ── Resolve student email (from app record or User lookup) ─
    let studentEmail = app.userEmail;
    let studentName  = app.userName;
    if (!studentEmail && app.userId) {
      const student = await User.findById(app.userId).select('email name');
      if (student) { studentEmail = student.email; studentName = student.name; }
    }

    // ── Send alert email (non-blocking, only when status actually changed) ──
    let emailSent = false;
    if (studentEmail && status !== prevStatus) {
      const result = await sendStatusChangeAlert({
        studentName:  studentName  || app.userName  || 'Student',
        studentEmail,
        role:         app.itemTitle   || app.type || 'Application',
        company:      app.itemCompany || app.company || 'NaanMudhalvan',
        status,
        notes:        notes || '',
        appId:        app._id?.toString(),
      });
      emailSent = result.success;
    }

    res.json({
      success:   true,
      message:   `Status updated to "${status}"${emailSent ? ' · Email alert sent ✉️' : ''}.`,
      application: app,
      emailSent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/my — student's own applications
router.get('/my', protect, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/mine — alias
router.get('/mine', protect, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications — all
router.get('/', protect, async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json({ success: true, applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
