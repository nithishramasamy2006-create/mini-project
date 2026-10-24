// ── Email Routes — lightweight standalone endpoints ──
// POST /api/email/status-alert  — fire a status-change alert email
// (Used by portalApplications.ts for localStorage-based portal apps)

import express from 'express';
import { sendStatusChangeAlert } from '../services/emailService.js';

const router = express.Router();

// POST /api/email/status-alert
// Body: { studentName, studentEmail, role, company, status, notes? }
// Auth: optional — called from frontend with or without JWT
router.post('/status-alert', async (req, res) => {
  try {
    const { studentName, studentEmail, role, company, status, notes } = req.body;
    if (!studentEmail) return res.status(400).json({ message: 'studentEmail is required.' });

    const valid = ['pending', 'reviewed', 'shortlisted', 'interview', 'hired', 'accepted', 'rejected'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status.' });

    const result = await sendStatusChangeAlert({
      studentName:  studentName  || 'Student',
      studentEmail,
      role:         role    || 'Application',
      company:      company || 'NaanMudhalvan',
      status,
      notes:        notes   || '',
    });

    res.json({
      success:   result.success,
      messageId: result.messageId,
      message:   result.success ? 'Email alert sent.' : 'Email failed (backend logged error).',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
