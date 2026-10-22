import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'nm-admin-2026';

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── REGISTER ── POST /api/auth/register ──────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      role = 'student',
      name, email, password,
      // student
      phone, college, year, branch,
      // company
      companyName, industry, website, companySize, location, hrName, hrPhone,
      // college
      collegeName, affiliation, district, naac, studentCount, tpoName, tpoPhone,
      // admin
      adminKey, adminLevel,
    } = req.body;

    // Validation
    if (!name?.trim())  return res.status(400).json({ message: 'Name is required.' });
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required.' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (!['student', 'company', 'college', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });

    // Admin key check
    if (role === 'admin') {
      if (adminKey !== ADMIN_SECRET) return res.status(403).json({ message: 'Invalid admin access key.' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: 'An account already exists with this email.' });

    // Build user document based on role
    const userData = { name: name.trim(), email, password, role };

    if (role === 'student') {
      Object.assign(userData, { phone, college, year, branch });
    } else if (role === 'company') {
      if (!companyName?.trim()) return res.status(400).json({ message: 'Company name is required.' });
      Object.assign(userData, { companyName, industry, website, companySize, location, hrName, hrPhone });
    } else if (role === 'college') {
      if (!collegeName?.trim()) return res.status(400).json({ message: 'College name is required.' });
      Object.assign(userData, { collegeName, affiliation, district, naac, studentCount, tpoName, tpoPhone });
    } else if (role === 'admin') {
      Object.assign(userData, { adminLevel: adminLevel || 'moderator' });
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`,
      token: genToken(user._id),
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) return res.status(400).json({ message: 'Email already registered.' });
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── LOGIN ── POST /api/auth/login ────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) return res.status(401).json({ message: 'No account found with this email.' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated. Contact support.' });

    // Portal mismatch check
    if (expectedRole && user.role !== expectedRole) {
      const portalName = { student: 'Student Portal', company: 'Company Portal', college: 'College Portal', admin: 'Admin Portal' };
      return res.status(403).json({
        message: `This account is registered as "${user.role}". Please use the ${portalName[user.role] || user.role} to login.`,
        actualRole: user.role,
      });
    }

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Incorrect password.' });

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token: genToken(user._id),
      user: user.toJSON(),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET ME ── GET /api/auth/me ────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ success: true, user: user.toJSON() });
  } catch {
    res.status(401).json({ message: 'Session expired. Please login again.' });
  }
});

// ── UPDATE PROFILE ── PUT /api/auth/profile ───────────────────
// Authenticated route — user can update their own non-sensitive fields
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Role-specific allowed fields
    const common  = ['bio'];
    const byRole  = {
      student: ['phone', 'college', 'year', 'branch', 'skills', 'cgpa', 'linkedIn', 'github', 'resume'],
      company: ['companyName', 'industry', 'website', 'companySize', 'location', 'description', 'hrName', 'hrPhone'],
      college: ['collegeName', 'affiliation', 'district', 'naac', 'studentCount', 'tpoName', 'tpoPhone'],
      admin:   [],
    };
    const allowed = [...common, ...(byRole[user.role] || [])];
    allowed.forEach(field => { if (req.body[field] !== undefined) user[field] = req.body[field]; });
    await user.save();

    res.json({ success: true, message: 'Profile updated successfully.', user: user.toJSON() });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

export default router;
