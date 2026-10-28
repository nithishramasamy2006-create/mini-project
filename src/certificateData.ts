// ============================================================
// CERTIFICATE DATA & MANAGEMENT SYSTEM
// Full support for Event Certificates (Participation, Achievement, Appreciation),
// Internship, Job, and Exam certificates with custom template uploads and web server sync.
// ============================================================

export type CertificateCategory = 'event' | 'internship' | 'job' | 'exam' | 'course';
export type CertificateSubType = 'participation' | 'achievement' | 'appreciation' | 'completion' | 'offer' | 'merit';
export type CertificateTheme =
  | 'burgundy-gold'       // Photo 1: Appreciation Burgundy & Gold
  | 'geometric-blue'      // Photo 2: Participation Modern Geometric Blue
  | 'crimson-arch'        // Photo 3: Achievement Royal Crimson Arch
  | 'navy-gold-wave'      // Photo 4: Participation Luxury Navy & Gold Wave
  | 'emerald-tech'        // Internship Tech Modern Emerald
  | 'executive-platinum'  // Job Appointment Corporate Platinum & Navy
  | 'sapphire-merit'      // Exam Academic Merit Sapphire & Gold
  | 'course-classic-gold' // Course Completion Academic Gold & Sapphire
  | 'custom-upload';      // Custom user uploaded background

export type BadgeType =
  | 'gold-medal'             // 3D embossed medal with gold ribbon
  | 'gold-rosette-ribbon'    // Golden rosette seal with notched tails
  | 'crimson-medal'          // Gold medal with crimson ribbon tails
  | 'navy-gold-seal'         // Metallic gold seal on navy accent
  | 'tech-shield'            // Tech verified holographic shield
  | 'academic-crest'         // Academic university crest
  | 'none';

export interface CertificateSigner {
  title: string;          // e.g. "HEAD OF EVENT", "GENERAL MANAGER", "MENTOR"
  name: string;           // e.g. "Donna Stroupe", "Sacha Dubois"
  role?: string;
  signatureText?: string; // stylized cursive signature representation
}

export interface CertificateTemplate {
  id: string;
  name: string;
  category: CertificateCategory;
  subType: CertificateSubType;
  title: string;          // e.g. "CERTIFICATE OF APPRECIATION"
  subtitle: string;       // e.g. "THIS CERTIFICATE IS PRESENTED TO"
  theme: CertificateTheme;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  badgeType: BadgeType;
  badgePosition: 'bottom-center' | 'top-right' | 'top-left' | 'center-right';
  defaultBodyText: string;
  signers: CertificateSigner[];
  bgImage?: string;       // data URL or remote URL for uploaded or custom backgrounds
  isCustomUpload?: boolean;
}

// ── Default Web Server & Built-in Templates ─────────────────
export const BUILTIN_CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  // ── 1. APPRECIATION (Matches Photo 1: Burgundy & Gold Filigree) ──
  {
    id: 'event-appreciation-burgundy',
    name: 'Classic Burgundy & Gold (Appreciation)',
    category: 'event',
    subType: 'appreciation',
    title: 'CERTIFICATE',
    subtitle: 'OF APPRECIATION',
    theme: 'burgundy-gold',
    description: 'Vintage luxury burgundy with ornamental filigree corners, cream parchment, and gold medal.',
    primaryColor: '#5c141c',
    secondaryColor: '#c59b27',
    accentColor: '#8a1d28',
    textColor: '#2a080c',
    badgeType: 'gold-medal',
    badgePosition: 'bottom-center',
    defaultBodyText: 'With sincere appreciation, we hereby present this Certificate to {{studentName}}, for demonstrating exemplary performance, professionalism, and extraordinary contribution',
    signers: [
      { name: 'DONNA STROUPE', title: 'HEAD OF EVENT', signatureText: 'Donna Stroupe' },
      { name: 'SACHA DUBOIS', title: 'GENERAL MANAGER', signatureText: 'Sacha Dubois' },
    ],
  },

  // ── 2. PARTICIPATION (Matches Photo 2: Modern Geometric Blue & Cyan) ──
  {
    id: 'event-participation-blue',
    name: 'Modern Geometric Blue (Participation)',
    category: 'event',
    subType: 'participation',
    title: 'CERTIFICATE',
    subtitle: 'OF PARTICIPATION',
    theme: 'geometric-blue',
    description: 'Crisp white layout with vivid cyan and royal blue angular geometric facets and top-right gold rosette seal.',
    primaryColor: '#0284c7',
    secondaryColor: '#1d4ed8',
    accentColor: '#d4af37',
    textColor: '#0f172a',
    badgeType: 'gold-rosette-ribbon',
    badgePosition: 'top-right',
    defaultBodyText: 'has successfully completed and actively participated in the:\n{{eventTitle}}\nHeld on {{eventDate}}\nWe extend our sincere appreciation for their enthusiasm, dedication, and meaningful engagement throughout the event.',
    signers: [
      { name: 'Isabel Mercado', title: 'Head of Event', signatureText: 'Isabel Mercado' },
    ],
  },

  // ── 3. ACHIEVEMENT (Matches Photo 3: Royal Crimson Arch & Gold Mandala) ──
  {
    id: 'event-achievement-crimson',
    name: 'Royal Crimson Arch & Gold (Achievement / Winner)',
    category: 'event',
    subType: 'achievement',
    title: 'CERTIFICATE',
    subtitle: 'OF ACHIEVEMENT',
    theme: 'crimson-arch',
    description: 'Majestic crimson curved arch borders, gold ribbons, intricate mandala lace corners, and center-bottom red ribbon medal.',
    primaryColor: '#8b1524',
    secondaryColor: '#d4af37',
    accentColor: '#b91c1c',
    textColor: '#29060b',
    badgeType: 'crimson-medal',
    badgePosition: 'bottom-center',
    defaultBodyText: 'Awarded with pride for outstanding achievements that demonstrate perseverance, excellence, and fighting spirit in {{eventTitle}}.',
    signers: [
      { name: 'KYRIE PETRAKIS', title: 'HEAD OF EVENT', signatureText: 'Kyrie Petrakis' },
      { name: 'SAMIRA HADID', title: 'MANAGER', signatureText: 'Samira Hadid' },
    ],
  },

  // ── 4. PARTICIPATION (Matches Photo 4: Luxury Navy & Gold Wave) ──
  {
    id: 'event-participation-navy-gold',
    name: 'Luxury Navy & Gold Wave (Training / Participation)',
    category: 'event',
    subType: 'participation',
    title: 'CERTIFICATE',
    subtitle: 'OF PARTICIPATION',
    theme: 'navy-gold-wave',
    description: 'Double golden frame, top-left golden rosette badge, and flowing royal navy and brushed gold waves at bottom.',
    primaryColor: '#0f172a',
    secondaryColor: '#d4af37',
    accentColor: '#1e3a8a',
    textColor: '#0f172a',
    badgeType: 'gold-rosette-ribbon',
    badgePosition: 'top-left',
    defaultBodyText: 'For Participation in {{eventTitle}} by {{organizer}}, on {{eventDate}}.\nDemonstrating high diligence, active learning, and creative problem solving.',
    signers: [
      { name: 'Cahaya Dewi', title: 'Mentor', signatureText: 'Cahaya Dewi' },
    ],
  },

  // ── 5. INTERNSHIP (Web Server Template: Tech & Modern Corporate) ──
  {
    id: 'internship-tech-emerald',
    name: 'Executive Tech & Emerald (Internship Completion)',
    category: 'internship',
    subType: 'completion',
    title: 'CERTIFICATE',
    subtitle: 'OF INTERNSHIP COMPLETION',
    theme: 'emerald-tech',
    description: 'Sleek obsidian with vivid emerald neon border, verifiable blockchain security badge, and company mentor sign-off.',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    accentColor: '#34d399',
    textColor: '#022c22',
    badgeType: 'tech-shield',
    badgePosition: 'top-right',
    defaultBodyText: 'This certifies that {{studentName}} has successfully completed an intensive industry internship program in {{eventTitle}} with {{organizer}}, demonstrating exceptional problem-solving and software development skills.',
    signers: [
      { name: 'Rajesh Varma', title: 'VP of Engineering', signatureText: 'Rajesh Varma' },
      { name: 'Ananya Deshmukh', title: 'Technical Mentor', signatureText: 'Ananya Deshmukh' },
    ],
  },

  // ── 6. JOB / APPOINTMENT (Web Server Template: Corporate Platinum & Royal Navy) ──
  {
    id: 'job-offer-platinum',
    name: 'Prestige Platinum & Navy (Job Selection / Offer)',
    category: 'job',
    subType: 'offer',
    title: 'CERTIFICATE',
    subtitle: 'OF SELECTION & EMPLOYMENT',
    theme: 'executive-platinum',
    description: 'Corporate institutional layout with platinum metallic accents, official company stamp, and HR Director endorsement.',
    primaryColor: '#1e293b',
    secondaryColor: '#3b82f6',
    accentColor: '#d4af37',
    textColor: '#0f172a',
    badgeType: 'navy-gold-seal',
    badgePosition: 'bottom-center',
    defaultBodyText: 'This is to officially certify that {{studentName}} has successfully cleared all technical assessments and interview rounds, receiving selection for the position of {{eventTitle}} at {{organizer}}.',
    signers: [
      { name: 'Vikramaditya Iyer', title: 'Head of Talent Acquisition', signatureText: 'Vikramaditya Iyer' },
      { name: 'Elena Rostova', title: 'Chief Human Resources Officer', signatureText: 'Elena Rostova' },
    ],
  },

  // ── 7. EXAM / MERIT (Web Server Template: Academic Sapphire & Gold) ──
  {
    id: 'exam-merit-sapphire',
    name: 'Academic Sapphire & Gold (Examination Merit)',
    category: 'exam',
    subType: 'merit',
    title: 'CERTIFICATE',
    subtitle: 'OF EXAMINATION MERIT',
    theme: 'sapphire-merit',
    description: 'Prestigious university seal, deep royal sapphire and gold accents, official proctor signoff and percentile recognition.',
    primaryColor: '#1d4ed8',
    secondaryColor: '#f59e0b',
    accentColor: '#2563eb',
    textColor: '#1e1b4b',
    badgeType: 'academic-crest',
    badgePosition: 'top-right',
    defaultBodyText: 'Presented to {{studentName}} for exceptional academic merit and scoring in the top percentile of the {{eventTitle}} conducted under the Naan Mudhalvan academic evaluation framework.',
    signers: [
      { name: 'Dr. K. Swaminathan', title: 'Controller of Examinations', signatureText: 'Dr. K. Swaminathan' },
      { name: 'Prof. M. Soundararajan', title: 'Academic Dean', signatureText: 'M. Soundararajan' },
    ],
  },

  // ── 8. COURSE COMPLETION (Web Server Template: Academic Royal Gold & Deep Navy) ──
  {
    id: 'course-completion-gold',
    name: 'Verified Course Accreditation (Course Completion)',
    category: 'course',
    subType: 'completion',
    title: 'CERTIFICATE',
    subtitle: 'OF COURSE COMPLETION',
    theme: 'course-classic-gold',
    description: 'Accredited certificate with dual gold border, rosette seal, curriculum director endorsement, and verified course syllabus recognition.',
    primaryColor: '#1e3a8a',
    secondaryColor: '#d4af37',
    accentColor: '#3b82f6',
    textColor: '#0f172a',
    badgeType: 'gold-rosette-ribbon',
    badgePosition: 'top-right',
    defaultBodyText: 'This is to officially certify that {{studentName}} has successfully completed the comprehensive training course on {{eventTitle}} with outstanding dedication, practical lab assignments, and project demonstration.',
    signers: [
      { name: 'Dr. Ramesh Kumar', title: 'Lead Course Instructor', signatureText: 'Dr. Ramesh Kumar' },
      { name: 'Prof. S. Ranganathan', title: 'Dean of Technology', signatureText: 'S. Ranganathan' },
    ],
  },
];

// ── Issued Certificate Record ──────────────────────────────────
export interface IssuedCertificate {
  id: string;
  templateId: string;
  studentName: string;
  studentEmail: string;
  collegeName?: string;
  eventTitle: string;
  eventId?: number | string;
  category: CertificateCategory;
  subType: CertificateSubType;
  achievementRank?: string; // e.g. "1st Place Winner", "Top Innovator", "Finalist"
  issuer: string;
  issuerType: 'college' | 'company' | 'mentor';
  issueDate: string;
  credentialId: string;
  signers: CertificateSigner[];
  customBgImage?: string;
  customBodyText?: string;
  theme?: CertificateTheme;
}

// ── Event Certificate Settings ─────────────────────────────────
export interface EventCertificateSettings {
  eventId: number | string;
  eventTitle: string;
  organizer: string;
  organizerType: 'college' | 'company' | 'mentor';
  enabledCertificates: {
    participation: boolean;
    achievement: boolean;
    appreciation: boolean;
  };
  participationTemplateId: string;
  achievementTemplateId: string;
  appreciationTemplateId: string;
  customTemplateImage?: string;
  headOfEventName: string;
  headOfEventTitle: string;
  mentorOrManagerName: string;
  mentorOrManagerTitle: string;
  updatedAt: string;
  updatedBy: string;
}

// ── Local Storage Keys ─────────────────────────────────────────
const LS_TEMPLATES_KEY = 'nm_custom_cert_templates';
const LS_ISSUED_KEY = 'nm_issued_certs';
const LS_EVENT_SETTINGS_KEY = 'nm_event_cert_settings';

// ── Templates Store Helper ─────────────────────────────────────
export function getAllCertificateTemplates(): CertificateTemplate[] {
  try {
    const custom = JSON.parse(localStorage.getItem(LS_TEMPLATES_KEY) || '[]');
    return [...BUILTIN_CERTIFICATE_TEMPLATES, ...custom];
  } catch {
    return BUILTIN_CERTIFICATE_TEMPLATES;
  }
}

export function saveCustomCertificateTemplate(tpl: CertificateTemplate): void {
  try {
    const existing: CertificateTemplate[] = JSON.parse(localStorage.getItem(LS_TEMPLATES_KEY) || '[]');
    const idx = existing.findIndex(t => t.id === tpl.id);
    if (idx >= 0) {
      existing[idx] = tpl;
    } else {
      existing.push(tpl);
    }
    localStorage.setItem(LS_TEMPLATES_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('nm_cert_storage_updated'));
  } catch (err) {
    console.error('Failed to save custom certificate template:', err);
  }
}

// ── Issued Certificates Helper ─────────────────────────────────
export const INITIAL_ISSUED_CERTIFICATES: IssuedCertificate[] = [
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
    templateId: 'event-appreciation-burgundy',
    studentName: 'nithish',
    studentEmail: 'nithish@college.edu',
    collegeName: 'CIT Coimbatore',
    eventTitle: 'Creative Design & Engineering Summit',
    eventId: 2,
    category: 'event',
    subType: 'appreciation',
    issuer: 'NaanMudhalvan & Tata Consultancy Services',
    issuerType: 'company',
    issueDate: '24 January, 2025',
    credentialId: 'NM-2025-APP-7731',
    signers: [
      { name: 'DONNA STROUPE', title: 'HEAD OF EVENT', signatureText: 'Donna Stroupe' },
      { name: 'SACHA DUBOIS', title: 'GENERAL MANAGER', signatureText: 'Sacha Dubois' },
    ],
    theme: 'burgundy-gold',
  },
  {
    id: 'cert-sample-4',
    templateId: 'event-participation-navy-gold',
    studentName: 'nithish',
    studentEmail: 'nithish@college.edu',
    collegeName: 'Anna University',
    eventTitle: 'Creative Marketing & Brand Strategy Training',
    eventId: 3,
    category: 'event',
    subType: 'participation',
    issuer: 'Borcelle',
    issuerType: 'company',
    issueDate: '22 Oct 2024',
    credentialId: 'NM-2024-TRN-3301',
    signers: [
      { name: 'Cahaya Dewi', title: 'Mentor Borcelle', signatureText: 'Cahaya Dewi' },
    ],
    theme: 'navy-gold-wave',
  },
  {
    id: 'cert-sample-5',
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
  {
    id: 'cert-sample-course-101',
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
];

export function getIssuedCertificates(): IssuedCertificate[] {
  try {
    const raw = localStorage.getItem(LS_ISSUED_KEY);
    if (!raw) {
      localStorage.setItem(LS_ISSUED_KEY, JSON.stringify(INITIAL_ISSUED_CERTIFICATES));
      return INITIAL_ISSUED_CERTIFICATES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ISSUED_CERTIFICATES;
  }
}

export function saveIssuedCertificate(cert: IssuedCertificate): void {
  try {
    const current = getIssuedCertificates();
    const idx = current.findIndex(c => c.id === cert.id);
    if (idx >= 0) {
      current[idx] = cert;
    } else {
      current.unshift(cert);
    }
    localStorage.setItem(LS_ISSUED_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('nm_cert_storage_updated'));
  } catch (err) {
    console.error('Failed to save issued certificate:', err);
  }
}

export function createPersonalizedCertificates(studentName: string, studentEmail?: string): IssuedCertificate[] {
  const name = studentName || 'nithish';
  const email = studentEmail || `${name.toLowerCase()}@college.edu`;

  return [
    {
      id: `cert-${name}-1`,
      templateId: 'event-participation-blue',
      studentName: name,
      studentEmail: email,
      collegeName: 'Anna University',
      eventTitle: 'NM HackFest 2025 — AI for Social Good',
      eventId: 1,
      category: 'event',
      subType: 'participation',
      issuer: 'Naan Mudhalvan Institution',
      issuerType: 'college',
      issueDate: '14 February, 2025',
      credentialId: 'NM-2025-EVT-8842',
      signers: [
        { name: 'Isabel Mercado', title: 'Head of Event', signatureText: 'Isabel Mercado' },
      ],
      theme: 'geometric-blue',
    },
    {
      id: `cert-${name}-2`,
      templateId: 'event-achievement-crimson',
      studentName: name,
      studentEmail: email,
      collegeName: 'Anna University',
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
      id: `cert-${name}-3`,
      templateId: 'internship-tech-emerald',
      studentName: name,
      studentEmail: email,
      collegeName: 'Anna University',
      eventTitle: 'Full Stack Web Development & Cloud Internship',
      category: 'internship',
      subType: 'completion',
      issuer: 'Freshworks Inc.',
      issuerType: 'company',
      issueDate: 'October 2026',
      credentialId: 'NM-2026-INT-4491',
      signers: [
        { name: 'Rajesh Varma', title: 'VP of Engineering', signatureText: 'Rajesh Varma' },
        { name: 'Ananya Deshmukh', title: 'Technical Mentor', signatureText: 'Ananya Deshmukh' },
      ],
      theme: 'emerald-tech',
    },
    {
      id: `cert-${name}-4`,
      templateId: 'event-appreciation-burgundy',
      studentName: name,
      studentEmail: email,
      collegeName: 'Anna University',
      eventTitle: 'Creative Design & Engineering Summit',
      eventId: 2,
      category: 'event',
      subType: 'appreciation',
      issuer: 'NaanMudhalvan & TCS',
      issuerType: 'company',
      issueDate: '24 January, 2025',
      credentialId: 'NM-2025-APP-7731',
      signers: [
        { name: 'DONNA STROUPE', title: 'HEAD OF EVENT', signatureText: 'Donna Stroupe' },
        { name: 'SACHA DUBOIS', title: 'GENERAL MANAGER', signatureText: 'Sacha Dubois' },
      ],
      theme: 'burgundy-gold',
    },
    {
      id: `cert-${name}-5`,
      templateId: 'event-participation-navy-gold',
      studentName: name,
      studentEmail: email,
      collegeName: 'Anna University',
      eventTitle: 'Creative Marketing & Brand Strategy Training',
      eventId: 3,
      category: 'event',
      subType: 'participation',
      issuer: 'Borcelle',
      issuerType: 'company',
      issueDate: '22 Oct 2024',
      credentialId: 'NM-2024-TRN-3301',
      signers: [
        { name: 'Cahaya Dewi', title: 'Mentor Borcelle', signatureText: 'Cahaya Dewi' },
      ],
      theme: 'navy-gold-wave',
    },
    {
      id: `cert-${name}-course-101`,
      templateId: 'course-completion-gold',
      studentName: name,
      studentEmail: email,
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
  ];
}

// ── Course Certificate Automatic Generation & Issuance ───────────
export function issueCourseCertificate(params: {
  studentName: string;
  studentEmail?: string;
  courseId: number | string;
  courseTitle: string;
  instructor?: string;
  collegeName?: string;
  achievementRank?: string;
}): IssuedCertificate {
  const sName = (params.studentName || 'nithish').trim();
  const sEmail = (params.studentEmail || `${sName.toLowerCase()}@college.edu`).trim();
  const existing = getCertificatesForStudent(sEmail, sName);
  const found = existing.find(c =>
    (c.category === 'course' || c.templateId === 'course-completion-gold') &&
    (String(c.eventId) === String(params.courseId) || c.eventTitle.toLowerCase().includes(params.courseTitle.toLowerCase()))
  );
  if (found) return found;

  const credId = `NM-${new Date().getFullYear()}-CRS-${Math.floor(1000 + Math.random() * 9000)}`;
  const newCert: IssuedCertificate = {
    id: `cert-crs-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    templateId: 'course-completion-gold',
    studentName: sName,
    studentEmail: sEmail,
    collegeName: params.collegeName || 'Anna University',
    eventTitle: params.courseTitle,
    eventId: params.courseId,
    category: 'course',
    subType: 'completion',
    achievementRank: params.achievementRank || 'Grade A+ (Distinction)',
    issuer: params.instructor ? `Naan Mudhalvan Academy & ${params.instructor}` : 'Naan Mudhalvan Academy',
    issuerType: 'college',
    issueDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    credentialId: credId,
    signers: [
      { name: params.instructor || 'Dr. Ramesh Kumar', title: 'Lead Course Instructor', signatureText: params.instructor || 'Dr. Ramesh Kumar' },
      { name: 'Prof. S. Ranganathan', title: 'Dean of Technology', signatureText: 'S. Ranganathan' },
    ],
    theme: 'course-classic-gold',
  };

  saveIssuedCertificate(newCert);

  try {
    fetch('http://localhost:5000/api/certificates/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCert),
    }).catch(() => {});
  } catch {}

  return newCert;
}

export function getCertificatesForStudent(emailOrName: string, studentDisplayName?: string): IssuedCertificate[] {
  const currentName = (studentDisplayName || emailOrName || 'nithish').trim();
  const currentEmail = (emailOrName || '').trim();
  const qName = currentName.toLowerCase();
  const qEmail = currentEmail.toLowerCase();

  const isMockName = (n: string) => {
    const s = (n || '').toLowerCase();
    return s.includes('samira') || s.includes('marceline') || s.includes('rosa maria') || s === 'student' || s === 'student name';
  };

  let all = getIssuedCertificates();

  // If localStorage contains legacy mock names, clean them out
  const cleaned = all.filter(c => !isMockName(c.studentName || ''));
  if (cleaned.length !== all.length) {
    all = cleaned;
    try {
      localStorage.setItem(LS_ISSUED_KEY, JSON.stringify(cleaned));
    } catch {}
  }

  // Find all certificates strictly matching THIS student
  let myCerts = all.filter(c => {
    const cName = (c.studentName || '').trim().toLowerCase();
    const cEmail = (c.studentEmail || '').trim().toLowerCase();
    return (qName && cName === qName) || (qEmail && cEmail === qEmail && !isMockName(cName));
  });

  // If none strictly match THIS student yet, generate finished certificates personalized strictly for this student!
  if (myCerts.length === 0) {
    const personalCerts = createPersonalizedCertificates(currentName, currentEmail || `${qName || 'nithish'}@college.edu`);
    const updated = [...personalCerts, ...all.filter(c => (c.studentName || '').toLowerCase() !== qName)];
    try {
      localStorage.setItem(LS_ISSUED_KEY, JSON.stringify(updated));
    } catch {}
    return personalCerts;
  }

  // Ensure every certificate returned has this student's name
  return myCerts.map(c => ({
    ...c,
    studentName: currentName,
  }));
}

// ── Event Certificate Settings Helper ──────────────────────────
export function getEventCertificateSettings(eventId: number | string): EventCertificateSettings {
  try {
    const all = JSON.parse(localStorage.getItem(LS_EVENT_SETTINGS_KEY) || '{}');
    if (all[eventId]) return all[eventId];
  } catch {
    // fallback
  }

  // Default configuration
  return {
    eventId,
    eventTitle: 'Event Certificate',
    organizer: 'NaanMudhalvan',
    organizerType: 'college',
    enabledCertificates: {
      participation: true,
      achievement: true,
      appreciation: true,
    },
    participationTemplateId: 'event-participation-blue',
    achievementTemplateId: 'event-achievement-crimson',
    appreciationTemplateId: 'event-appreciation-burgundy',
    headOfEventName: 'Head of Event',
    headOfEventTitle: 'HEAD OF EVENT',
    mentorOrManagerName: 'Event Mentor',
    mentorOrManagerTitle: 'MENTOR & EVALUATOR',
    updatedAt: new Date().toISOString(),
    updatedBy: 'Organizer',
  };
}

export function saveEventCertificateSettings(settings: EventCertificateSettings): void {
  try {
    const all = JSON.parse(localStorage.getItem(LS_EVENT_SETTINGS_KEY) || '{}');
    all[settings.eventId] = settings;
    localStorage.setItem(LS_EVENT_SETTINGS_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('nm_cert_storage_updated'));
  } catch (err) {
    console.error('Failed to save event certificate settings:', err);
  }
}

// ── Mock Registered Students for an Event ──────────────────────
export interface EventParticipant {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  attendanceVerified: boolean;
  isWinner: boolean;
  winnerRank?: string;
  isAppreciated: boolean;
}

export function getEventParticipants(eventId: number | string): EventParticipant[] {
  const lsKey = `nm_event_participants_${eventId}`;
  try {
    const stored = localStorage.getItem(lsKey);
    if (stored) return JSON.parse(stored);
  } catch {}

  // Initial mock participants
  const mockParticipants: EventParticipant[] = [
    { id: 'p1', name: 'Samira Hadid', email: 'samira@college.edu', college: 'Anna University', branch: 'CSE', attendanceVerified: true, isWinner: true, winnerRank: '1st Place Winner' },
    { id: 'p2', name: 'Marceline Anderson', email: 'marceline@college.edu', college: 'PSG Tech', branch: 'IT', attendanceVerified: true, isWinner: true, winnerRank: '2nd Place Runner-Up' },
    { id: 'p3', name: 'Rosa Maria Aguado', email: 'rosa@college.edu', college: 'CIT Coimbatore', branch: 'ECE', attendanceVerified: true, isWinner: false, isAppreciated: true },
    { id: 'p4', name: 'Arun Kumar', email: 'arun@college.edu', college: 'Thiagarajar College', branch: 'MECH', attendanceVerified: true, isWinner: false, isAppreciated: false },
    { id: 'p5', name: 'Priya Selvi', email: 'priya@college.edu', college: 'Madras Institute of Tech', branch: 'AI & DS', attendanceVerified: true, isWinner: true, winnerRank: 'Best Innovation Award' },
    { id: 'p6', name: 'Karthik Raja', email: 'karthik@college.edu', college: 'Government College Salem', branch: 'EEE', attendanceVerified: true, isWinner: false, isAppreciated: false },
  ];

  try {
    localStorage.setItem(lsKey, JSON.stringify(mockParticipants));
  } catch {}

  return mockParticipants;
}

export function saveEventParticipants(eventId: number | string, participants: EventParticipant[]): void {
  try {
    localStorage.setItem(`nm_event_participants_${eventId}`, JSON.stringify(participants));
  } catch (err) {
    console.error('Failed to save participants:', err);
  }
}
