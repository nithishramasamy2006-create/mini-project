import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Verify JWT & attach user to req ───────────────────────
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Not authenticated. Please login.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');
    if (!user)    return res.status(401).json({ message: 'User not found.' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated.' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired. Please login again.' });
  }
};

// ── Role gate factory ─────────────────────────────────────
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated.' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. This area is for: ${roles.join(', ')} only.`,
    });
  }
  next();
};

// ── Shorthand guards ──────────────────────────────────────
export const studentOnly  = requireRole('student');
export const companyOnly  = requireRole('company');
export const collegeOnly  = requireRole('college');
export const adminOnly    = requireRole('admin');
export const staffOnly    = requireRole('company', 'college', 'admin');
