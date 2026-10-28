import express from 'express';

const router = express.Router();

// In-memory / server cache for templates, event settings, and issued certificates
let serverTemplates = [];
let eventCertificateSettings = {};
let issuedCertificates = [
  {
    id: 'cert-sample-1',
    templateId: 'event-participation-blue',
    studentName: 'nithish',
    studentEmail: 'nithish@college.edu',
    collegeName: 'Anna University',
    eventTitle: 'LICERIA HACKATHON & INNOVATION EVENT',
    eventId: 1,
    category: 'event',
    subType: 'participation',
    issuer: 'NaanMudhalvan',
    issuerType: 'college',
    issueDate: '19 March, 2025',
    credentialId: 'NM-2025-EVT-8842',
    signers: [
      { name: 'Isabel Mercado', title: 'Head of Event', signatureText: 'Isabel Mercado' },
    ],
    theme: 'geometric-blue',
  },
  {
    id: 'cert-sample-2',
    templateId: 'event-achievement-crimson',
    studentName: 'nithish',
    studentEmail: 'nithish@college.edu',
    collegeName: 'PSG College of Technology',
    eventTitle: 'Tamil Nadu State AI Hackathon 2025',
    eventId: 1,
    category: 'event',
    subType: 'achievement',
    achievementRank: '1st Place Winner (Gold Trophy)',
    issuer: 'Zoho Corporation',
    issuerType: 'company',
    issueDate: '16 February, 2025',
    credentialId: 'NM-2025-ACH-9912',
    signers: [
      { name: 'KYRIE PETRAKIS', title: 'HEAD OF EVENT', signatureText: 'Kyrie Petrakis' },
      { name: 'SAMIRA HADID', title: 'GENERAL MANAGER', signatureText: 'Samira Hadid' },
    ],
    theme: 'crimson-arch',
  },
  {
    id: 'cert-sample-3',
    templateId: 'course-completion-gold',
    studentName: 'nithish',
    studentEmail: 'nithish@college.edu',
    collegeName: 'Anna University',
    eventTitle: 'Full Stack Web Development with React & Node.js',
    eventId: 101,
    category: 'course',
    subType: 'completion',
    achievementRank: 'Grade A+ (Distinction)',
    issuer: 'Naan Mudhalvan Academy & Dr. Ramesh Kumar',
    issuerType: 'college',
    issueDate: 'October 2026',
    credentialId: 'NM-2026-CRS-1018',
    signers: [
      { name: 'Dr. Ramesh Kumar', title: 'Lead Course Instructor', signatureText: 'Dr. Ramesh Kumar' },
      { name: 'Prof. S. Ranganathan', title: 'Dean of Technology', signatureText: 'S. Ranganathan' },
    ],
    theme: 'course-classic-gold',
  },
  {
    id: 'cert-sample-4',
    templateId: 'internship-tech-emerald',
    studentName: 'nithish',
    studentEmail: 'nithish@college.edu',
    collegeName: 'Anna University',
    eventTitle: 'Cloud Native & Full Stack Web Development Internship',
    category: 'internship',
    subType: 'completion',
    issuer: 'Freshworks Inc.',
    issuerType: 'company',
    issueDate: 'October 2026',
    credentialId: 'NM-2026-INT-4491',
    signers: [
      { name: 'Rajesh Varma', title: 'VP of Engineering', signatureText: 'Rajesh Varma' },
      { name: 'Ananya Deshmukh', title: 'Mentor', signatureText: 'Ananya Deshmukh' },
    ],
    theme: 'emerald-tech',
  },
];

// GET all templates
router.get('/templates', (_req, res) => {
  res.json({ success: true, templates: serverTemplates });
});

// POST upload custom template
router.post('/templates/upload', (req, res) => {
  const newTpl = req.body;
  if (!newTpl || !newTpl.name) {
    return res.status(400).json({ success: false, message: 'Template name is required.' });
  }
  serverTemplates.unshift(newTpl);
  res.json({ success: true, template: newTpl, message: 'Template uploaded successfully to web server.' });
});

// GET settings for an event
router.get('/events/:eventId/settings', (req, res) => {
  const { eventId } = req.params;
  const s = eventCertificateSettings[eventId] || null;
  res.json({ success: true, settings: s });
});

// POST save settings for an event
router.post('/events/:eventId/settings', (req, res) => {
  const { eventId } = req.params;
  eventCertificateSettings[eventId] = req.body;
  res.json({ success: true, message: 'Event certificate settings saved.' });
});

// POST issue certificate
router.post('/issue', (req, res) => {
  const cert = req.body;
  if (!cert || !cert.studentName) {
    return res.status(400).json({ success: false, message: 'Student name is required.' });
  }
  issuedCertificates.unshift(cert);
  res.json({ success: true, certificate: cert, message: 'Certificate issued successfully.' });
});

// GET certificates for a student
router.get('/student/:studentEmail', (req, res) => {
  const { studentEmail } = req.params;
  const q = (studentEmail || '').trim().toLowerCase();
  const matched = issuedCertificates.filter(
    (c) => c.studentEmail.toLowerCase() === q || c.studentName.toLowerCase() === q
  );
  res.json({ success: true, certificates: matched.length > 0 ? matched : issuedCertificates });
});

// GET all issued certificates
router.get('/issued', (_req, res) => {
  res.json({ success: true, certificates: issuedCertificates });
});

export default router;
