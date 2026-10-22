import express from 'express';
import { protect, collegeOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

const router = express.Router();
router.use(protect, collegeOnly);

// ── GET dashboard stats ── GET /api/college/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Count students registered from this college
    const collegeName = req.user.collegeName || req.user.name;
    const students = await User.countDocuments({ role: 'student', college: { $regex: collegeName, $options: 'i' } });
    const applications = await Application.countDocuments({ userCollege: { $regex: collegeName, $options: 'i' } });
    const hired = await Application.countDocuments({ userCollege: { $regex: collegeName, $options: 'i' }, status: { $in: ['hired', 'accepted'] } });

    res.json({
      success: true,
      stats: { students, applications, hired, placementRate: students > 0 ? Math.round((hired / students) * 100) : 0 },
      college: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET students from this college ── GET /api/college/students
router.get('/students', async (req, res) => {
  try {
    const collegeName = req.user.collegeName || req.user.name;
    const { q, page = 1, limit = 25 } = req.query;
    const filter = { role: 'student', college: { $regex: collegeName, $options: 'i' } };
    if (q) filter.$or = [
      { name:   { $regex: q, $options: 'i' } },
      { branch: { $regex: q, $options: 'i' } },
    ];
    const students = await User.find(filter).select('-password').sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total    = await User.countDocuments(filter);
    res.json({ success: true, students, total, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET applications from this college ── GET /api/college/applications
router.get('/applications', async (req, res) => {
  try {
    const collegeName = req.user.collegeName || req.user.name;
    const { status, page = 1, limit = 25 } = req.query;
    const filter = { userCollege: { $regex: collegeName, $options: 'i' } };
    if (status && status !== 'all') filter.status = status;
    const apps  = await Application.find(filter).sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await Application.countDocuments(filter);
    res.json({ success: true, applications: apps, total, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── GET college profile ── GET /api/college/profile
router.get('/profile', (req, res) => {
  res.json({ success: true, college: req.user });
});

// ── UPDATE college profile ── PUT /api/college/profile
router.put('/profile', async (req, res) => {
  try {
    const allowed = ['collegeName', 'affiliation', 'district', 'naac', 'studentCount', 'tpoName', 'tpoPhone', 'bio'];
    allowed.forEach(field => { if (req.body[field] !== undefined) req.user[field] = req.body[field]; });
    await req.user.save();
    res.json({ success: true, message: 'Profile updated.', college: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
