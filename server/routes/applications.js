import express from 'express';
import jwt from 'jsonwebtoken';
import Application from '../models/Application.js';

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
    const existing = await Application.findOne({ userId: req.user.id, type, itemId });
    if (existing) return res.status(400).json({ message: `You already applied to this ${type}!` });
    const app = await Application.create({
      userId: req.user.id, user: req.user.id,
      userName, userEmail, userCollege, userBranch, userPhone,
      type, itemId, itemTitle, itemCompany, company: itemCompany,
      coverLetter, resumeLink, skills,
    });
    res.status(201).json({ success: true, message: 'Application submitted successfully! 🎉', application: app });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You already applied to this!' });
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
