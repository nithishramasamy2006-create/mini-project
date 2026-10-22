import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

const router = express.Router();
router.use(protect, adminOnly);

// ── Platform overview ── GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [students, companies, colleges, admins] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'company' }),
      User.countDocuments({ role: 'college' }),
      User.countDocuments({ role: 'admin' }),
    ]);
    const totalApplications = await Application.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('-password');
    const recentApps  = await Application.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      success: true,
      stats: { students, companies, colleges, admins, totalApplications, totalUsers: students + companies + colleges + admins },
      recentUsers,
      recentApplications: recentApps,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── List all users (with filters) ── GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { role, q, page = 1, limit = 25, isActive } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (isActive !== undefined)  filter.isActive = isActive === 'true';
    if (q) filter.$or = [
      { name:        { $regex: q, $options: 'i' } },
      { email:       { $regex: q, $options: 'i' } },
      { companyName: { $regex: q, $options: 'i' } },
      { collegeName: { $regex: q, $options: 'i' } },
    ];

    const users = await User.find(filter).select('-password')
      .sort({ createdAt: -1 })
      .limit(+limit).skip((+page - 1) * +limit);
    const total = await User.countDocuments(filter);

    res.json({ success: true, users, total, pages: Math.ceil(total / +limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── Toggle user active status ── PATCH /api/admin/users/:id/toggle
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot deactivate admin accounts.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── Delete user ── DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin accounts.' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// ── Get all applications ── GET /api/admin/applications
router.get('/applications', async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (type   && type !== 'all')   filter.type = type;
    const apps  = await Application.find(filter).sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await Application.countDocuments(filter);
    res.json({ success: true, applications: apps, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;
