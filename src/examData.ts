// ============================================================
// EXAM PORTAL DATA — NaanMudhalvan Platform
// ============================================================

export type ExamMode     = 'online' | 'offline' | 'hybrid';
export type ExamCategory = 'skill-assessment' | 'aptitude' | 'technical' | 'government' | 'certification' | 'language' | 'competitive';
export type ExamStatus   = 'open' | 'closing-soon' | 'closed' | 'upcoming' | 'result-declared';
export type ExamDifficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert';

// ── Offline Exam Center ─────────────────────────────────────────
export interface ExamCenter {
  id: string;
  city: string;
  state: string;
  venue: string;
  address: string;
  landmark: string;
  pincode: string;
  phone: string;
  seatsAvailable: number;
  totalSeats: number;
  mapLink: string;
}

// ── Syllabus Topic ──────────────────────────────────────────────
export interface SyllabusTopic {
  unit: string;
  topics: string[];
  marks: number;
}

// ── Exam Pattern ────────────────────────────────────────────────
export interface ExamPattern {
  totalQuestions: number;
  totalMarks: number;
  duration: number;           // in minutes
  marksPerQuestion: number;
  negativeMarking: number;    // 0 = none, 0.25 = 1/4 mark
  sections: { name: string; questions: number; marks: number }[];
}

// ── Main Exam Interface ─────────────────────────────────────────
export interface Exam {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  category: ExamCategory;
  mode: ExamMode;
  organizer: string;
  organizerLogo: string;
  eligibility: {
    branches: string[];
    years: string[];
    minCGPA?: number;
    others?: string[];
  };
  examDate: string;
  examTime: string;
  resultDate: string;
  registrationDeadline: string;
  admitCardDate: string;
  duration: string;           // human-readable e.g. "90 Minutes"
  pattern: ExamPattern;
  syllabus: SyllabusTopic[];
  centers?: ExamCenter[];     // for offline/hybrid
  onlineLink?: string;        // for online
  languages: string[];
  price: string;
  certificateOnPass: boolean;
  difficulty: ExamDifficulty;
  status: ExamStatus;
  featured: boolean;
  color: string;
  tags: string[];
  benefits: string[];
  totalRegistered: number;
  maxRegistrations: number;
  icon: string;
}

// ─── Category Metadata ──────────────────────────────────────────
export const EXAM_CATEGORIES: { id: ExamCategory | 'all'; label: string; icon: string; color: string }[] = [
  { id: 'all',            label: 'All Exams',        icon: '📋', color: '#7c3aed' },
  { id: 'skill-assessment', label: 'Skill Assessment', icon: '🎯', color: '#3b82f6' },
  { id: 'aptitude',       label: 'Aptitude',          icon: '🧠', color: '#f59e0b' },
  { id: 'technical',      label: 'Technical',         icon: '💻', color: '#10b981' },
  { id: 'certification',  label: 'Certification',     icon: '🏅', color: '#8b5cf6' },
  { id: 'government',     label: 'Government',        icon: '🏛️', color: '#06b6d4' },
  { id: 'competitive',    label: 'Competitive',       icon: '🏆', color: '#f97316' },
  { id: 'language',       label: 'Language',          icon: '🌐', color: '#ec4899' },
];

// ─── Tamil Nadu Exam Centers ────────────────────────────────────
export const TN_CENTERS: ExamCenter[] = [
  {
    id: 'chn-01', city: 'Chennai', state: 'Tamil Nadu',
    venue: 'Anna University – CEG Campus',
    address: 'Sardar Patel Rd, Guindy, Chennai – 600025',
    landmark: 'Near Guindy Metro Station',
    pincode: '600025', phone: '044-2235-7004',
    seatsAvailable: 420, totalSeats: 500,
    mapLink: 'https://maps.google.com/?q=Anna+University+Chennai',
  },
  {
    id: 'chn-02', city: 'Chennai', state: 'Tamil Nadu',
    venue: 'SRM Institute of Science & Technology',
    address: 'SRM Nagar, Kattankulathur, Chennai – 603203',
    landmark: 'Near Guduvancheri Highway',
    pincode: '603203', phone: '044-2745-2270',
    seatsAvailable: 312, totalSeats: 400,
    mapLink: 'https://maps.google.com/?q=SRM+University+Chennai',
  },
  {
    id: 'cbe-01', city: 'Coimbatore', state: 'Tamil Nadu',
    venue: 'PSG College of Technology',
    address: 'Peelamedu, Coimbatore – 641004',
    landmark: 'Near Peelamedu Police Station',
    pincode: '641004', phone: '0422-257-2177',
    seatsAvailable: 285, totalSeats: 350,
    mapLink: 'https://maps.google.com/?q=PSG+College+of+Technology',
  },
  {
    id: 'cbe-02', city: 'Coimbatore', state: 'Tamil Nadu',
    venue: 'Amrita School of Engineering',
    address: 'Ettimadai, Coimbatore – 641112',
    landmark: 'Amrita University Campus',
    pincode: '641112', phone: '0422-265-6422',
    seatsAvailable: 180, totalSeats: 250,
    mapLink: 'https://maps.google.com/?q=Amrita+University+Coimbatore',
  },
  {
    id: 'mdu-01', city: 'Madurai', state: 'Tamil Nadu',
    venue: 'Thiagarajar College of Engineering',
    address: 'Thiruparankundram, Madurai – 625015',
    landmark: 'Near Thiruparankundram Temple',
    pincode: '625015', phone: '0452-248-2240',
    seatsAvailable: 220, totalSeats: 280,
    mapLink: 'https://maps.google.com/?q=Thiagarajar+College+Engineering+Madurai',
  },
  {
    id: 'try-01', city: 'Trichy', state: 'Tamil Nadu',
    venue: 'NIT Trichy',
    address: 'Tanjore Main Rd, National Highway, Trichy – 620015',
    landmark: 'NIT Trichy Main Gate',
    pincode: '620015', phone: '0431-250-3000',
    seatsAvailable: 310, totalSeats: 380,
    mapLink: 'https://maps.google.com/?q=NIT+Trichy',
  },
  {
    id: 'sal-01', city: 'Salem', state: 'Tamil Nadu',
    venue: 'Salem Engineering College',
    address: 'Omalur Main Rd, Salem – 636202',
    landmark: 'Near Omalur Bus Stand',
    pincode: '636202', phone: '0427-248-5555',
    seatsAvailable: 145, totalSeats: 200,
    mapLink: 'https://maps.google.com/?q=Salem+Engineering+College',
  },
  {
    id: 'vellore-01', city: 'Vellore', state: 'Tamil Nadu',
    venue: 'VIT University',
    address: 'Tiruvalam Rd, Katpadi, Vellore – 632014',
    landmark: 'VIT Main Campus Gate',
    pincode: '632014', phone: '0416-220-2020',
    seatsAvailable: 480, totalSeats: 600,
    mapLink: 'https://maps.google.com/?q=VIT+Vellore',
  },
  {
    id: 'erode-01', city: 'Erode', state: 'Tamil Nadu',
    venue: 'Bannari Amman Institute of Technology',
    address: 'Sathyamangalam, Erode – 638401',
    landmark: 'BIT Sathyamangalam Main Gate',
    pincode: '638401', phone: '04295-226-000',
    seatsAvailable: 260, totalSeats: 320,
    mapLink: 'https://maps.google.com/?q=Bannari+Amman+Institute+Technology',
  },
  {
    id: 'tvm-01', city: 'Tirunelveli', state: 'Tamil Nadu',
    venue: 'Manonmaniam Sundaranar University',
    address: 'Abishekapatti, Tirunelveli – 627012',
    landmark: 'MSU Main Campus',
    pincode: '627012', phone: '0462-231-7285',
    seatsAvailable: 195, totalSeats: 250,
    mapLink: 'https://maps.google.com/?q=MS+University+Tirunelveli',
  },
];

// ─── EXAMS DATA ─────────────────────────────────────────────────
export const EXAMS: Exam[] = [
  // ────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'NaanMudhalvan Skill Assessment Test — AI & Machine Learning',
    shortTitle: 'NM-SAT AI/ML',
    description: 'Official NaanMudhalvan skill assessment for AI & ML. Tests Python, NumPy, Pandas, Scikit-learn, deep learning concepts, and real-world problem-solving. Passing score qualifies for NM Certified badge and project priority allocation.',
    category: 'skill-assessment',
    mode: 'hybrid',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    eligibility: {
      branches: ['CSE', 'IT', 'AI & DS', 'AI & ML', 'ECE'],
      years: ['2nd Year', '3rd Year', '4th Year', 'Alumni'],
      minCGPA: 6.0,
    },
    examDate: 'Feb 15, 2025',
    examTime: '10:00 AM – 12:30 PM',
    resultDate: 'Feb 22, 2025',
    registrationDeadline: 'Feb 5, 2025',
    admitCardDate: 'Feb 10, 2025',
    duration: '150 Minutes',
    pattern: {
      totalQuestions: 100,
      totalMarks: 100,
      duration: 150,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      sections: [
        { name: 'Python & Libraries', questions: 30, marks: 30 },
        { name: 'ML Algorithms',      questions: 35, marks: 35 },
        { name: 'Deep Learning',      questions: 25, marks: 25 },
        { name: 'Case Studies',       questions: 10, marks: 10 },
      ],
    },
    syllabus: [
      { unit: 'Python for ML', topics: ['NumPy Arrays', 'Pandas DataFrames', 'Data Wrangling', 'Matplotlib/Seaborn', 'Scikit-learn API'], marks: 25 },
      { unit: 'Supervised Learning', topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'SVM', 'K-NN', 'Ensemble Methods'], marks: 30 },
      { unit: 'Unsupervised Learning', topics: ['K-Means', 'DBSCAN', 'PCA', 'Autoencoders', 'Anomaly Detection'], marks: 20 },
      { unit: 'Deep Learning', topics: ['Neural Networks', 'CNN', 'RNN/LSTM', 'Transfer Learning', 'Model Deployment'], marks: 25 },
    ],
    centers: [TN_CENTERS[0], TN_CENTERS[2], TN_CENTERS[4], TN_CENTERS[5], TN_CENTERS[7], TN_CENTERS[8]],
    onlineLink: 'https://exam.naanmudhalvan.tn.gov.in',
    languages: ['English', 'Tamil'],
    price: 'Free',
    certificateOnPass: true,
    difficulty: 'Moderate',
    status: 'open',
    featured: true,
    color: '#7c3aed',
    tags: ['AI', 'ML', 'Python', 'NM Certified', 'Hybrid'],
    benefits: ['NM Certified Badge', 'Priority project allocation', 'LinkedIn credential', 'Scholarship eligibility'],
    totalRegistered: 14820,
    maxRegistrations: 20000,
    icon: '🤖',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'Full Stack Web Development Certification Exam',
    shortTitle: 'NM-FS Cert',
    description: 'Comprehensive online certification exam covering HTML, CSS, JavaScript, React, Node.js, REST APIs, and MongoDB. Pass to earn the NM Full Stack Developer certificate recognized by 200+ partner companies.',
    category: 'certification',
    mode: 'online',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    eligibility: {
      branches: ['CSE', 'IT', 'AI & DS', 'MCA', 'BCA', 'Any Branch'],
      years: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'],
    },
    examDate: 'Jan 25, 2025',
    examTime: '2:00 PM – 4:00 PM',
    resultDate: 'Jan 28, 2025',
    registrationDeadline: 'Jan 20, 2025',
    admitCardDate: 'Jan 23, 2025',
    duration: '120 Minutes',
    pattern: {
      totalQuestions: 80,
      totalMarks: 80,
      duration: 120,
      marksPerQuestion: 1,
      negativeMarking: 0,
      sections: [
        { name: 'HTML/CSS/JS',  questions: 25, marks: 25 },
        { name: 'React & State', questions: 20, marks: 20 },
        { name: 'Node.js & APIs', questions: 20, marks: 20 },
        { name: 'Database & Deploy', questions: 15, marks: 15 },
      ],
    },
    syllabus: [
      { unit: 'Frontend Fundamentals', topics: ['HTML5 Semantics', 'CSS Grid & Flexbox', 'JavaScript ES6+', 'DOM Manipulation', 'Fetch API'], marks: 25 },
      { unit: 'React.js', topics: ['Components & Props', 'State & Hooks', 'React Router', 'Context API', 'Performance Optimization'], marks: 20 },
      { unit: 'Backend – Node.js', topics: ['Express.js', 'Middleware', 'REST API Design', 'JWT Auth', 'Error Handling'], marks: 20 },
      { unit: 'Database & Deployment', topics: ['MongoDB', 'Mongoose', 'Docker basics', 'Vercel/Render Deploy', 'CI/CD'], marks: 15 },
    ],
    onlineLink: 'https://exam.naanmudhalvan.tn.gov.in',
    languages: ['English'],
    price: 'Free',
    certificateOnPass: true,
    difficulty: 'Moderate',
    status: 'open',
    featured: true,
    color: '#3b82f6',
    tags: ['Full Stack', 'React', 'Node.js', 'Online', 'Certification'],
    benefits: ['Employer-recognized certificate', 'Resume booster', 'GitHub badge', '₹500 course credit'],
    totalRegistered: 9340,
    maxRegistrations: 15000,
    icon: '💻',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 3,
    title: 'TNPSC Group IV Aptitude & Reasoning Mock Exam',
    shortTitle: 'TNPSC G4 Mock',
    description: 'Practice mock exam aligned to TNPSC Group IV pattern. Covers General Knowledge, Tamil, Mathematics, and Aptitude as per the official TNPSC syllabus. Available at 10 offline centers across Tamil Nadu.',
    category: 'government',
    mode: 'offline',
    organizer: 'NaanMudhalvan × TNPSC Coaching Cell',
    organizerLogo: '🏛️',
    eligibility: {
      branches: ['Any Branch', 'Arts', 'Science', 'Commerce'],
      years: ['Final Year', 'Alumni', 'Any Graduate'],
      others: ['Age 18–32 years', 'Tamil Nadu resident'],
    },
    examDate: 'Feb 1, 2025',
    examTime: '9:00 AM – 12:00 PM',
    resultDate: 'Feb 8, 2025',
    registrationDeadline: 'Jan 24, 2025',
    admitCardDate: 'Jan 28, 2025',
    duration: '180 Minutes',
    pattern: {
      totalQuestions: 200,
      totalMarks: 200,
      duration: 180,
      marksPerQuestion: 1,
      negativeMarking: 0,
      sections: [
        { name: 'General Tamil',          questions: 75, marks: 75 },
        { name: 'General Knowledge',      questions: 75, marks: 75 },
        { name: 'General Mathematics',    questions: 25, marks: 25 },
        { name: 'Mental Ability & Aptitude', questions: 25, marks: 25 },
      ],
    },
    syllabus: [
      { unit: 'General Tamil', topics: ['Tamil Grammar', 'Literature', 'Thirukkural', 'Tamil History', 'Comprehension'], marks: 75 },
      { unit: 'General Knowledge', topics: ['Indian History', 'Geography', 'Polity', 'Current Affairs', 'Science & Technology'], marks: 75 },
      { unit: 'Mathematics', topics: ['Number Systems', 'Algebra', 'Percentages', 'Time & Work', 'Data Interpretation'], marks: 25 },
      { unit: 'Aptitude & Reasoning', topics: ['Verbal Reasoning', 'Non-Verbal Reasoning', 'Logical Reasoning', 'Puzzles'], marks: 25 },
    ],
    centers: TN_CENTERS,
    languages: ['Tamil', 'English'],
    price: '₹50',
    certificateOnPass: false,
    difficulty: 'Moderate',
    status: 'open',
    featured: true,
    color: '#06b6d4',
    tags: ['TNPSC', 'Government', 'Offline', 'Mock Test', 'Tamil'],
    benefits: ['Performance report card', 'Rank among TN students', 'Free study material PDF', 'Answer key with explanations'],
    totalRegistered: 22100,
    maxRegistrations: 30000,
    icon: '🏛️',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 4,
    title: 'Data Science & Analytics Skill Test',
    shortTitle: 'NM-DS Test',
    description: 'Test your Data Science skills — Statistics, SQL, Python, Tableau, Power BI, and ML fundamentals. Online proctored exam with AI-monitored environment. Result in 72 hours.',
    category: 'skill-assessment',
    mode: 'online',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    eligibility: {
      branches: ['CSE', 'IT', 'AI & DS', 'Statistics', 'Mathematics', 'MBA', 'Any Branch'],
      years: ['2nd Year', '3rd Year', '4th Year', 'Alumni'],
      minCGPA: 5.5,
    },
    examDate: 'Jan 30, 2025',
    examTime: '11:00 AM – 12:30 PM',
    resultDate: 'Feb 2, 2025',
    registrationDeadline: 'Jan 25, 2025',
    admitCardDate: 'Jan 28, 2025',
    duration: '90 Minutes',
    pattern: {
      totalQuestions: 75,
      totalMarks: 75,
      duration: 90,
      marksPerQuestion: 1,
      negativeMarking: 0,
      sections: [
        { name: 'Statistics & Probability', questions: 20, marks: 20 },
        { name: 'SQL & Databases',          questions: 20, marks: 20 },
        { name: 'Python for Data Science',  questions: 20, marks: 20 },
        { name: 'ML & Visualization',       questions: 15, marks: 15 },
      ],
    },
    syllabus: [
      { unit: 'Statistics', topics: ['Descriptive Stats', 'Probability Distributions', 'Hypothesis Testing', 'Regression Analysis', 'Bayesian Statistics'], marks: 20 },
      { unit: 'SQL', topics: ['DDL/DML', 'JOINs', 'Subqueries', 'Window Functions', 'Query Optimization'], marks: 20 },
      { unit: 'Python DS Libraries', topics: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn basics'], marks: 20 },
      { unit: 'ML & BI Tools', topics: ['Classification & Regression', 'Model Evaluation', 'Tableau Basics', 'Power BI Dashboards', 'Feature Engineering'], marks: 15 },
    ],
    onlineLink: 'https://exam.naanmudhalvan.tn.gov.in',
    languages: ['English'],
    price: 'Free',
    certificateOnPass: true,
    difficulty: 'Hard',
    status: 'open',
    featured: false,
    color: '#f59e0b',
    tags: ['Data Science', 'SQL', 'Python', 'Online', 'Proctored'],
    benefits: ['NM Data Badge', 'Access to advanced DS projects', 'Performance analytics report'],
    totalRegistered: 6750,
    maxRegistrations: 10000,
    icon: '📊',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'Campus Placement Aptitude Test — TCS iON Pattern',
    shortTitle: 'Placement Aptitude',
    description: 'Simulates real TCS iON / Infosys / Cognizant placement aptitude rounds. Includes Quantitative, Verbal, Logical, and Coding sections. Score report shared with 50+ partner companies.',
    category: 'aptitude',
    mode: 'offline',
    organizer: 'NaanMudhalvan × Career Cell',
    organizerLogo: '🎓',
    eligibility: {
      branches: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Any Engineering'],
      years: ['3rd Year', '4th Year', 'Final Year'],
      minCGPA: 6.0,
      others: ['No active backlogs'],
    },
    examDate: 'Feb 8, 2025',
    examTime: '10:00 AM – 12:00 PM',
    resultDate: 'Feb 12, 2025',
    registrationDeadline: 'Feb 1, 2025',
    admitCardDate: 'Feb 5, 2025',
    duration: '120 Minutes',
    pattern: {
      totalQuestions: 90,
      totalMarks: 90,
      duration: 120,
      marksPerQuestion: 1,
      negativeMarking: 0,
      sections: [
        { name: 'Quantitative Aptitude', questions: 25, marks: 25 },
        { name: 'Verbal Ability',        questions: 25, marks: 25 },
        { name: 'Logical Reasoning',     questions: 25, marks: 25 },
        { name: 'Coding (Easy)',         questions: 15, marks: 15 },
      ],
    },
    syllabus: [
      { unit: 'Quantitative Aptitude', topics: ['Percentages', 'Profit & Loss', 'Time Speed Distance', 'Averages', 'Permutation & Combination', 'Probability'], marks: 25 },
      { unit: 'Verbal Ability', topics: ['Reading Comprehension', 'Fill in the Blanks', 'Error Correction', 'Vocabulary', 'Para Jumbles'], marks: 25 },
      { unit: 'Logical Reasoning', topics: ['Syllogisms', 'Blood Relations', 'Seating Arrangement', 'Coding-Decoding', 'Number Series'], marks: 25 },
      { unit: 'Coding', topics: ['Pattern Printing', 'Array Problems', 'String Manipulation', 'Basic Recursion'], marks: 15 },
    ],
    centers: [TN_CENTERS[0], TN_CENTERS[1], TN_CENTERS[2], TN_CENTERS[3], TN_CENTERS[4], TN_CENTERS[5], TN_CENTERS[6], TN_CENTERS[7], TN_CENTERS[8], TN_CENTERS[9]],
    languages: ['English'],
    price: 'Free',
    certificateOnPass: false,
    difficulty: 'Moderate',
    status: 'open',
    featured: true,
    color: '#10b981',
    tags: ['Aptitude', 'Placement', 'TCS', 'Infosys', 'Offline', 'Coding'],
    benefits: ['Score shared with 50+ companies', 'Percentile rank', 'Weak-area analysis', 'Interview call probability'],
    totalRegistered: 18430,
    maxRegistrations: 25000,
    icon: '🎯',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 6,
    title: 'Cybersecurity Fundamentals Certification Exam',
    shortTitle: 'NM-CyberSec',
    description: 'Online proctored exam testing cybersecurity fundamentals — network security, cryptography, ethical hacking basics, and compliance. Certificate powered by EC-Council partnership.',
    category: 'certification',
    mode: 'online',
    organizer: 'NaanMudhalvan × EC-Council',
    organizerLogo: '🔐',
    eligibility: {
      branches: ['CSE', 'IT', 'ECE', 'AI & DS', 'Any Engineering'],
      years: ['2nd Year', '3rd Year', '4th Year', 'Alumni'],
    },
    examDate: 'Feb 20, 2025',
    examTime: '3:00 PM – 4:30 PM',
    resultDate: 'Feb 25, 2025',
    registrationDeadline: 'Feb 12, 2025',
    admitCardDate: 'Feb 17, 2025',
    duration: '90 Minutes',
    pattern: {
      totalQuestions: 60,
      totalMarks: 60,
      duration: 90,
      marksPerQuestion: 1,
      negativeMarking: 0.25,
      sections: [
        { name: 'Network Security',    questions: 20, marks: 20 },
        { name: 'Cryptography',        questions: 15, marks: 15 },
        { name: 'Ethical Hacking',     questions: 15, marks: 15 },
        { name: 'Compliance & Policy', questions: 10, marks: 10 },
      ],
    },
    syllabus: [
      { unit: 'Network Security', topics: ['OSI Model', 'TCP/IP', 'Firewalls & IDS/IPS', 'VPN', 'Network Attacks'], marks: 20 },
      { unit: 'Cryptography', topics: ['Symmetric & Asymmetric', 'Hashing', 'PKI', 'SSL/TLS', 'Digital Signatures'], marks: 15 },
      { unit: 'Ethical Hacking', topics: ['Footprinting', 'Scanning & Enumeration', 'Vulnerability Assessment', 'Penetration Testing', 'Social Engineering'], marks: 15 },
      { unit: 'Compliance', topics: ['ISO 27001', 'GDPR Basics', 'IT Act 2000', 'CERT-In Guidelines'], marks: 10 },
    ],
    onlineLink: 'https://exam.naanmudhalvan.tn.gov.in',
    languages: ['English'],
    price: '₹199',
    certificateOnPass: true,
    difficulty: 'Hard',
    status: 'open',
    featured: false,
    color: '#ec4899',
    tags: ['Cybersecurity', 'EC-Council', 'Online', 'Proctored', 'Certification'],
    benefits: ['EC-Council co-badged certificate', 'LinkedIn credential', 'Internship shortlisting'],
    totalRegistered: 3240,
    maxRegistrations: 8000,
    icon: '🔐',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 7,
    title: 'Tamil Language Proficiency Test (TLPT)',
    shortTitle: 'TLPT 2025',
    description: 'Standardized Tamil language proficiency exam for students and working professionals. Tests reading, writing, grammar, and comprehension. Certificate valid for government job applications.',
    category: 'language',
    mode: 'offline',
    organizer: 'Tamil Nadu Language Commission',
    organizerLogo: '🌐',
    eligibility: {
      branches: ['Any Branch', 'Any Stream'],
      years: ['Any Year', 'Alumni', 'Working Professional'],
      others: ['Age 16 and above'],
    },
    examDate: 'Mar 1, 2025',
    examTime: '10:00 AM – 12:00 PM',
    resultDate: 'Mar 15, 2025',
    registrationDeadline: 'Feb 20, 2025',
    admitCardDate: 'Feb 25, 2025',
    duration: '120 Minutes',
    pattern: {
      totalQuestions: 100,
      totalMarks: 100,
      duration: 120,
      marksPerQuestion: 1,
      negativeMarking: 0,
      sections: [
        { name: 'Grammar (இலக்கணம்)',       questions: 30, marks: 30 },
        { name: 'Comprehension (படித்தல்)',  questions: 30, marks: 30 },
        { name: 'Vocabulary (சொல்லகராதி)', questions: 20, marks: 20 },
        { name: 'Composition (எழுத்து)',    questions: 20, marks: 20 },
      ],
    },
    syllabus: [
      { unit: 'Tamil Grammar', topics: ['Sandhi (புணர்ச்சி)', 'Verb Forms', 'Sentence Structure', 'Kural References', 'Ancient Tamil'], marks: 30 },
      { unit: 'Comprehension', topics: ['Prose Reading', 'Poetry Interpretation', 'Short Passages', 'Summary Writing'], marks: 30 },
      { unit: 'Vocabulary', topics: ['Synonyms', 'Antonyms', 'Idioms (பழமொழி)', 'Word Roots'], marks: 20 },
      { unit: 'Composition', topics: ['Letter Writing', 'Essay (கட்டுரை)', 'Précis Writing', 'Paragraph Writing'], marks: 20 },
    ],
    centers: TN_CENTERS,
    languages: ['Tamil'],
    price: '₹100',
    certificateOnPass: true,
    difficulty: 'Moderate',
    status: 'open',
    featured: false,
    color: '#f97316',
    tags: ['Tamil', 'Language', 'Offline', 'Government Valid', 'Certificate'],
    benefits: ['Government-recognized certificate', 'Valid for TNPSC applications', 'Proficiency level grading'],
    totalRegistered: 11870,
    maxRegistrations: 20000,
    icon: '🌐',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 8,
    title: 'Cloud Computing & DevOps Technical Assessment',
    shortTitle: 'NM-Cloud Test',
    description: 'Online technical exam for AWS, Azure, GCP basics, Docker, Kubernetes, and CI/CD pipelines. Designed for students targeting cloud careers. AWS exam voucher worth ₹2000 for top scorers.',
    category: 'technical',
    mode: 'online',
    organizer: 'NaanMudhalvan × AWS Educate',
    organizerLogo: '☁️',
    eligibility: {
      branches: ['CSE', 'IT', 'AI & DS', 'Any Engineering'],
      years: ['3rd Year', '4th Year', 'Alumni'],
    },
    examDate: 'Feb 25, 2025',
    examTime: '2:00 PM – 3:30 PM',
    resultDate: 'Mar 1, 2025',
    registrationDeadline: 'Feb 18, 2025',
    admitCardDate: 'Feb 22, 2025',
    duration: '90 Minutes',
    pattern: {
      totalQuestions: 65,
      totalMarks: 65,
      duration: 90,
      marksPerQuestion: 1,
      negativeMarking: 0,
      sections: [
        { name: 'Cloud Fundamentals',   questions: 20, marks: 20 },
        { name: 'AWS Core Services',    questions: 20, marks: 20 },
        { name: 'Docker & Kubernetes',  questions: 15, marks: 15 },
        { name: 'CI/CD & DevOps',       questions: 10, marks: 10 },
      ],
    },
    syllabus: [
      { unit: 'Cloud Fundamentals', topics: ['IaaS/PaaS/SaaS', 'Cloud Deployment Models', 'Shared Responsibility', 'Cost Models', 'Multi-cloud'], marks: 20 },
      { unit: 'AWS Services', topics: ['EC2', 'S3', 'RDS', 'Lambda', 'VPC', 'IAM', 'CloudFormation'], marks: 20 },
      { unit: 'Containers', topics: ['Docker Architecture', 'Dockerfile', 'Docker Compose', 'Kubernetes Objects', 'Helm basics'], marks: 15 },
      { unit: 'DevOps', topics: ['CI/CD Pipeline', 'GitHub Actions', 'Jenkins basics', 'Terraform', 'Monitoring with CloudWatch'], marks: 10 },
    ],
    onlineLink: 'https://exam.naanmudhalvan.tn.gov.in',
    languages: ['English'],
    price: 'Free',
    certificateOnPass: true,
    difficulty: 'Hard',
    status: 'upcoming',
    featured: false,
    color: '#f59e0b',
    tags: ['Cloud', 'AWS', 'DevOps', 'Online', 'Technical'],
    benefits: ['AWS voucher ₹2000 for top 10%', 'NM Cloud badge', 'Cloud internship priority'],
    totalRegistered: 2840,
    maxRegistrations: 5000,
    icon: '☁️',
  },
  // ────────────────────────────────────────────────────────────
  {
    id: 9,
    title: 'NM Competitive Coding Championship — Tamil Nadu',
    shortTitle: 'NM-CCC 2025',
    description: 'State-level competitive coding exam. Solve 5 algorithmic problems in 3 hours. Individual contest on a custom judge platform. Top 100 students invited to NM Grand Finale with ₹3 Lakh prize.',
    category: 'competitive',
    mode: 'hybrid',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    eligibility: {
      branches: ['CSE', 'IT', 'AI & DS', 'AI & ML', 'MCA', 'Any Engineering'],
      years: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'],
    },
    examDate: 'Mar 8, 2025',
    examTime: '10:00 AM – 1:00 PM',
    resultDate: 'Mar 10, 2025',
    registrationDeadline: 'Mar 1, 2025',
    admitCardDate: 'Mar 5, 2025',
    duration: '180 Minutes',
    pattern: {
      totalQuestions: 5,
      totalMarks: 500,
      duration: 180,
      marksPerQuestion: 100,
      negativeMarking: 0,
      sections: [
        { name: 'Easy Problems',   questions: 2, marks: 100 },
        { name: 'Medium Problems', questions: 2, marks: 200 },
        { name: 'Hard Problem',    questions: 1, marks: 200 },
      ],
    },
    syllabus: [
      { unit: 'Data Structures', topics: ['Arrays', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Heaps & Tries'], marks: 150 },
      { unit: 'Algorithms', topics: ['Sorting & Searching', 'Dynamic Programming', 'Greedy Algorithms', 'Backtracking', 'Graph Algorithms'], marks: 200 },
      { unit: 'Mathematics', topics: ['Number Theory', 'Combinatorics', 'Bit Manipulation', 'Modular Arithmetic'], marks: 150 },
    ],
    centers: [TN_CENTERS[0], TN_CENTERS[2], TN_CENTERS[5], TN_CENTERS[7]],
    onlineLink: 'https://code.naanmudhalvan.tn.gov.in',
    languages: ['C', 'C++', 'Java', 'Python', 'JavaScript'],
    price: 'Free',
    certificateOnPass: true,
    difficulty: 'Expert',
    status: 'upcoming',
    featured: true,
    color: '#8b5cf6',
    tags: ['Competitive Coding', 'DSA', 'Algorithms', 'Championship', 'Hybrid'],
    benefits: ['Top 100 → Grand Finale', '₹3 Lakh prize pool', 'Rating on NM Leaderboard', 'Internship offers from sponsors'],
    totalRegistered: 7650,
    maxRegistrations: 10000,
    icon: '🏆',
  },
  { id:10, title:'AWS Cloud Practitioner Certification Prep Exam', shortTitle:'AWS CP Prep', category:'certification', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x AWS Educate', targetAudience:['B.E/B.Tech','BCA','MCA'], eligibility:'Any branch', examDate:'Mar 5, 2025', registrationDeadline:'Feb 25, 2025', resultDate:'Mar 12, 2025', duration:90, totalQuestions:65, totalMarks:100, passingMarks:70, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Cloud Concepts','Security','AWS Core Services','Billing'], syllabus:[{unit:'Cloud Fundamentals',topics:['AWS Global Infra','Regions','AZs'],marks:30},{unit:'Core Services',topics:['EC2','S3','RDS','Lambda'],marks:40},{unit:'Security & Pricing',topics:['IAM','Shield','Cost Explorer'],marks:30}], benefits:['AWS Digital Badge','NM Certificate','CLF-C02 prep'], totalRegistered:4800, maxRegistrations:8000, icon:'☁️' },
  { id:11, title:'Python Programming Skill Assessment', shortTitle:'Python Assessment', category:'skill-assessment', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x GUVI', targetAudience:['All UG/PG Students'], eligibility:'Basic Python knowledge', examDate:'Feb 18, 2025', registrationDeadline:'Feb 14, 2025', resultDate:'Feb 22, 2025', duration:60, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['Python Syntax','OOP','Libraries','Problem Solving'], syllabus:[{unit:'Core Python',topics:['Variables','Loops','Functions','OOP'],marks:50},{unit:'Libraries',topics:['NumPy','Pandas','Matplotlib'],marks:30},{unit:'Algorithms',topics:['Sorting','Search','DSA basics'],marks:20}], benefits:['GUVI Verified Badge','NM Certificate'], totalRegistered:9200, maxRegistrations:15000, icon:'🐍' },
  { id:12, title:'SQL & Database Fundamentals Test', shortTitle:'SQL Fundamentals', category:'technical', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Freshworks', targetAudience:['BCA','B.Tech CSE/IT','MCA'], eligibility:'Enrolled in any CS programme', examDate:'Feb 12, 2025', registrationDeadline:'Feb 8, 2025', resultDate:'Feb 16, 2025', duration:45, totalQuestions:40, totalMarks:80, passingMarks:50, negativeMarking:false, languages:['English'], fee:'FREE', domains:['SQL Queries','Database Design','Joins','Indexing'], syllabus:[{unit:'SQL Basics',topics:['SELECT','WHERE','GROUP BY','ORDER BY'],marks:30},{unit:'Joins & Subqueries',topics:['INNER JOIN','LEFT JOIN','CTEs'],marks:30},{unit:'Schema Design',topics:['Normalization','Keys','Indexing'],marks:20}], benefits:['NM Certificate','Freshworks Talent Pool Shortlisting'], totalRegistered:6700, maxRegistrations:10000, icon:'🗃️' },
  { id:13, title:'Data Science & ML Aptitude Test', shortTitle:'DS/ML Aptitude', category:'aptitude', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Analytics Vidhya', targetAudience:['B.Tech','M.Sc Statistics','MCA'], eligibility:'Basic Python and Statistics', examDate:'Mar 10, 2025', registrationDeadline:'Mar 5, 2025', resultDate:'Mar 15, 2025', duration:90, totalQuestions:60, totalMarks:120, passingMarks:72, negativeMarking:true, languages:['English'], fee:'₹199', domains:['Statistics','ML Concepts','Python','Data Wrangling'], syllabus:[{unit:'Statistics',topics:['Probability','Distributions','Hypothesis Testing'],marks:40},{unit:'ML',topics:['Supervised','Unsupervised','Evaluation Metrics'],marks:50},{unit:'Tools',topics:['Pandas','Scikit-learn'],marks:30}], benefits:['AV Certificate','AV Fellowship shortlisting'], totalRegistered:5400, maxRegistrations:8000, icon:'📊' },
  { id:14, title:'Cybersecurity Fundamentals Exam', shortTitle:'Cyber Fundamentals', category:'certification', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x EC-Council Academia', targetAudience:['B.E/B.Tech'], eligibility:'Any Engineering branch', examDate:'Feb 28, 2025', registrationDeadline:'Feb 22, 2025', resultDate:'Mar 5, 2025', duration:60, totalQuestions:50, totalMarks:100, passingMarks:65, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Network Security','Ethical Hacking','Cryptography','Web Security'], syllabus:[{unit:'Network Security',topics:['Firewalls','IDS/IPS','VPNs'],marks:30},{unit:'Application Security',topics:['OWASP Top 10','XSS','SQLi'],marks:40},{unit:'Cryptography',topics:['Symmetric','Asymmetric','PKI'],marks:30}], benefits:['EC-Council Digital Badge','CEH prep'], totalRegistered:3800, maxRegistrations:6000, icon:'🔐' },
  { id:15, title:'Quantitative Aptitude & Reasoning Test', shortTitle:'QA & Reasoning', category:'aptitude', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan Campus Drive Prep', targetAudience:['All Final Year Students'], eligibility:'Any UG programme, Final Year', examDate:'Feb 20, 2025', registrationDeadline:'Feb 16, 2025', resultDate:'Feb 24, 2025', duration:60, totalQuestions:60, totalMarks:60, passingMarks:36, negativeMarking:true, languages:['English','Tamil'], fee:'FREE', domains:['Quantitative Aptitude','Logical Reasoning','Verbal Ability','Data Interpretation'], syllabus:[{unit:'Quant',topics:['Time & Work','Percentages','Ratios'],marks:20},{unit:'Reasoning',topics:['Puzzles','Syllogisms','Coding-Decoding'],marks:20},{unit:'Verbal',topics:['Reading Comprehension','Grammar'],marks:20}], benefits:['NM Certificate','Placement preparation scorecard'], totalRegistered:11200, maxRegistrations:20000, icon:'🧠' },
  { id:16, title:'React & Frontend Development Assessment', shortTitle:'React Assessment', category:'skill-assessment', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Zoho', targetAudience:['B.Tech CSE/IT','MCA'], eligibility:'Knowledge of HTML, CSS, JavaScript', examDate:'Mar 8, 2025', registrationDeadline:'Mar 4, 2025', resultDate:'Mar 12, 2025', duration:75, totalQuestions:50, totalMarks:100, passingMarks:65, negativeMarking:false, languages:['English'], fee:'FREE', domains:['React Core','Hooks','State Management','Performance'], syllabus:[{unit:'React Fundamentals',topics:['JSX','Components','Props','State'],marks:35},{unit:'Advanced React',topics:['Hooks','Context','Code Splitting'],marks:40},{unit:'Ecosystem',topics:['Redux','React Router','Testing'],marks:25}], benefits:['Zoho Talent Pool','NM React Badge'], totalRegistered:4200, maxRegistrations:6000, icon:'⚛️' },
  { id:17, title:'Tamil Language Proficiency Test (TNPSC Prep)', shortTitle:'Tamil Proficiency', category:'language', difficulty:'Moderate', mode:'offline', status:'open', conductedBy:'NaanMudhalvan x Tamil Nadu Govt', targetAudience:['All Tamil Nadu Students'], eligibility:'Tamil medium or bilingual students', examDate:'Mar 22, 2025', registrationDeadline:'Mar 10, 2025', resultDate:'Apr 5, 2025', duration:120, totalQuestions:100, totalMarks:200, passingMarks:120, negativeMarking:false, languages:['Tamil'], fee:'FREE', domains:['Tamil Grammar','Literature','Comprehension','Essay Writing'], syllabus:[{unit:'Grammar',topics:['Sandhi','Vibhakti','Tenses'],marks:60},{unit:'Literature',topics:['Classical Tamil','Thirukkural','Modern Literature'],marks:80},{unit:'Writing',topics:['Reading','Précis','Essay'],marks:60}], benefits:['NM Language Certificate','TNPSC Group prep score'], totalRegistered:8900, maxRegistrations:15000, icon:'📜' },
  { id:18, title:'Java Full Stack Developer Certification', shortTitle:'Java Full Stack', category:'certification', difficulty:'Hard', mode:'online', status:'upcoming', conductedBy:'NaanMudhalvan x TCS iON', targetAudience:['B.E/B.Tech CSE','MCA'], eligibility:'Core Java knowledge required', examDate:'Apr 5, 2025', registrationDeadline:'Mar 25, 2025', resultDate:'Apr 12, 2025', duration:120, totalQuestions:80, totalMarks:160, passingMarks:100, negativeMarking:true, languages:['English'], fee:'₹399', domains:['Core Java','Spring Boot','REST APIs','Databases'], syllabus:[{unit:'Core Java',topics:['OOP','Collections','Streams','Multithreading'],marks:50},{unit:'Spring Boot',topics:['Spring MVC','JPA','Security'],marks:60},{unit:'APIs & DB',topics:['REST','SQL','Microservices'],marks:50}], benefits:['TCS iON Digital Certificate','TCS Campus Drive eligibility'], totalRegistered:3200, maxRegistrations:5000, icon:'☕' },
  { id:19, title:'TNSET – Tamil Nadu State Eligibility Test Mock', shortTitle:'TNSET Mock', category:'government', difficulty:'Hard', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Mother Teresa Womens Univ', targetAudience:['Post-Graduate Students'], eligibility:'PG Degree in relevant subject', examDate:'Feb 25, 2025', registrationDeadline:'Feb 20, 2025', resultDate:'Mar 5, 2025', duration:180, totalQuestions:150, totalMarks:300, passingMarks:180, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['Research Aptitude','Subject Paper','Pedagogy'], syllabus:[{unit:'Research Aptitude',topics:['Research Methods','Statistics','ICT'],marks:100},{unit:'Subject Paper',topics:['Specialisation topics'],marks:150},{unit:'Teaching Aptitude',topics:['Curriculum','Classroom Management'],marks:50}], benefits:['TNSET Readiness Score','NM Research Certificate'], totalRegistered:4500, maxRegistrations:8000, icon:'🎓' },
  { id:20, title:'IoT & Embedded Systems Skill Test', shortTitle:'IoT Skills Test', category:'skill-assessment', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Bosch India', targetAudience:['B.E ECE/EEE/CSE'], eligibility:'Basic Electronics and C programming', examDate:'Mar 3, 2025', registrationDeadline:'Feb 27, 2025', resultDate:'Mar 8, 2025', duration:60, totalQuestions:45, totalMarks:90, passingMarks:55, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Microcontrollers','IoT Protocols','Sensors','RTOS'], syllabus:[{unit:'Embedded C',topics:['Pointers','Memory','Interrupts','RTOS'],marks:35},{unit:'IoT Protocols',topics:['MQTT','HTTP','LoRa','BLE'],marks:30},{unit:'Sensors',topics:['Temperature','Servo','ADC'],marks:25}], benefits:['Bosch Talent Pool','NM IoT Badge'], totalRegistered:2800, maxRegistrations:5000, icon:'🔌' },
  { id:21, title:'Cloud Computing & DevOps Assessment', shortTitle:'Cloud & DevOps', category:'technical', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Freshworks', targetAudience:['B.Tech CSE/IT','MCA'], eligibility:'Basic Linux and networking knowledge', examDate:'Mar 15, 2025', registrationDeadline:'Mar 10, 2025', resultDate:'Mar 20, 2025', duration:75, totalQuestions:55, totalMarks:110, passingMarks:66, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Cloud Fundamentals','Docker','Kubernetes','CI/CD'], syllabus:[{unit:'Cloud Concepts',topics:['IaaS/PaaS/SaaS','Serverless'],marks:35},{unit:'Containers',topics:['Docker','Kubernetes','Helm'],marks:40},{unit:'DevOps',topics:['CI/CD','Jenkins','Terraform'],marks:35}], benefits:['NM Cloud Badge','Freshworks DevOps Talent Pool'], totalRegistered:3600, maxRegistrations:6000, icon:'☸️' },
  { id:22, title:'English Communication & Technical Writing Test', shortTitle:'English Communication', category:'language', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x British Council', targetAudience:['All UG/PG Students'], eligibility:'All students', examDate:'Feb 10, 2025', registrationDeadline:'Feb 6, 2025', resultDate:'Feb 14, 2025', duration:60, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Grammar','Reading','Writing','Technical Communication'], syllabus:[{unit:'Grammar',topics:['Tenses','Articles','Prepositions'],marks:30},{unit:'Reading',topics:['Main Idea','Inference','Vocabulary'],marks:30},{unit:'Writing',topics:['Email','Report','Technical Description'],marks:40}], benefits:['British Council Letter','NM English Badge'], totalRegistered:8400, maxRegistrations:15000, icon:'📝' },
  { id:23, title:'NaanMudhalvan AI Skills Badge Exam', shortTitle:'NM AI Badge', category:'certification', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Google AI', targetAudience:['All Students'], eligibility:'Completion of NM AI Foundations course', examDate:'Rolling enrollment', registrationDeadline:'Apr 30, 2025', resultDate:'Immediate', duration:40, totalQuestions:30, totalMarks:60, passingMarks:42, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['AI Concepts','ML','Ethics','Applications'], syllabus:[{unit:'AI Basics',topics:['What is AI','Types of ML','Neural Networks'],marks:25},{unit:'Applications',topics:['NLP','Computer Vision','Recommender Systems'],marks:20},{unit:'AI Ethics',topics:['Bias','Privacy','Responsible AI'],marks:15}], benefits:['Google AI Badge','NM Platform Badge'], totalRegistered:14200, maxRegistrations:50000, icon:'🤖' },
  { id:24, title:'GATE CS Mock – Data Structures & Algorithms', shortTitle:'GATE CS Mock', category:'competitive', difficulty:'Hard', mode:'online', status:'open', conductedBy:'NaanMudhalvan x IIT Madras GATE Forum', targetAudience:['B.Tech/B.E CS/IT Final Year'], eligibility:'Pursuing or completed B.Tech CS/IT', examDate:'Feb 16, 2025', registrationDeadline:'Feb 12, 2025', resultDate:'Feb 20, 2025', duration:180, totalQuestions:65, totalMarks:100, passingMarks:50, negativeMarking:true, languages:['English'], fee:'₹99', domains:['Data Structures','Algorithms','OS','DBMS','CN'], syllabus:[{unit:'DS & Algorithms',topics:['Arrays','Trees','Graphs','DP'],marks:30},{unit:'OS & DBMS',topics:['Processes','Memory','Transactions'],marks:35},{unit:'Networks',topics:['TCP/IP','Routing','Application Layer'],marks:35}], benefits:['GATE readiness report','NM GATE preparation badge'], totalRegistered:6800, maxRegistrations:10000, icon:'📐' },
  { id:25, title:'UI/UX Design & Figma Skills Assessment', shortTitle:'UX Design Test', category:'skill-assessment', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Razorpay Design', targetAudience:['Design Students','CS Students'], eligibility:'Basic Figma knowledge', examDate:'Mar 1, 2025', registrationDeadline:'Feb 25, 2025', resultDate:'Mar 5, 2025', duration:60, totalQuestions:40, totalMarks:80, passingMarks:50, negativeMarking:false, languages:['English'], fee:'FREE', domains:['UX Principles','UI Design','Figma','User Research'], syllabus:[{unit:'UX Fundamentals',topics:['User Research','Wireframing','Journey Mapping'],marks:30},{unit:'UI Design',topics:['Typography','Color Theory','Components'],marks:30},{unit:'Figma',topics:['Auto Layout','Prototyping','Variables'],marks:20}], benefits:['Razorpay Design portfolio review','NM Design Badge'], totalRegistered:3200, maxRegistrations:5000, icon:'🎨' },
  { id:26, title:'Financial Markets & Investment Aptitude Test', shortTitle:'FinMarkets Aptitude', category:'aptitude', difficulty:'Moderate', mode:'online', status:'upcoming', conductedBy:'NaanMudhalvan x NSE Academy', targetAudience:['Commerce/Finance/MBA Students'], eligibility:'Basic financial literacy', examDate:'Apr 10, 2025', registrationDeadline:'Apr 3, 2025', resultDate:'Apr 15, 2025', duration:60, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:true, languages:['English'], fee:'₹149', domains:['Stock Markets','Mutual Funds','Derivatives','Ratios'], syllabus:[{unit:'Equity & Debt',topics:['Stocks','Bonds','IPO'],marks:35},{unit:'Derivatives',topics:['Options','Futures','Hedging'],marks:35},{unit:'Analysis',topics:['Fundamental','Technical','Portfolio'],marks:30}], benefits:['NSE Academy Certificate','NCFM preparation score'], totalRegistered:1800, maxRegistrations:4000, icon:'📈' },
  { id:27, title:'Web Development Hackathon Pre-Qualifier', shortTitle:'WebDev Qualifier', category:'technical', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan Hackathon Cell', targetAudience:['B.Tech/BCA/MCA Students'], eligibility:'Knowledge of HTML/CSS/JavaScript', examDate:'Feb 22, 2025', registrationDeadline:'Feb 18, 2025', resultDate:'Feb 26, 2025', duration:90, totalQuestions:60, totalMarks:120, passingMarks:72, negativeMarking:false, languages:['English'], fee:'FREE', domains:['HTML/CSS','JavaScript','React','Backend Basics'], syllabus:[{unit:'Frontend',topics:['HTML5','CSS Grid','JavaScript ES6+'],marks:40},{unit:'React',topics:['Components','Hooks','State','APIs'],marks:50},{unit:'Backend',topics:['Node.js','REST APIs','Databases'],marks:30}], benefits:['Hackathon Grand Finale Entry','₹50,000 Prize Pool Access'], totalRegistered:5600, maxRegistrations:8000, icon:'💻' },
  { id:28, title:'Blockchain & Web3 Technology Assessment', shortTitle:'Web3 Assessment', category:'technical', difficulty:'Moderate', mode:'online', status:'upcoming', conductedBy:'NaanMudhalvan x Polygon India', targetAudience:['CS/IT Students'], eligibility:'Basic programming knowledge', examDate:'Apr 20, 2025', registrationDeadline:'Apr 12, 2025', resultDate:'Apr 25, 2025', duration:75, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Blockchain Basics','Solidity','DeFi','Smart Contracts'], syllabus:[{unit:'Blockchain',topics:['Consensus','Cryptography','Wallets'],marks:30},{unit:'Smart Contracts',topics:['Solidity','EVM','Events'],marks:40},{unit:'DeFi & Web3',topics:['DeFi Protocols','NFTs','DAOs'],marks:30}], benefits:['Polygon Badge','Web3 developer portfolio shortlisting'], totalRegistered:2100, maxRegistrations:5000, icon:'⛓️' },
  { id:29, title:'Machine Learning Practical Exam', shortTitle:'ML Practical', category:'certification', difficulty:'Hard', mode:'online', status:'open', conductedBy:'NaanMudhalvan x IIT Madras Online Degree', targetAudience:['B.Tech/M.Sc/MCA Students'], eligibility:'Completion of ML Foundations course', examDate:'Mar 18, 2025', registrationDeadline:'Mar 12, 2025', resultDate:'Mar 25, 2025', duration:120, totalQuestions:0, totalMarks:100, passingMarks:65, negativeMarking:false, languages:['English'], fee:'₹299', domains:['Regression','Classification','Clustering','Evaluation'], syllabus:[{unit:'Supervised Learning',topics:['Linear Regression','Decision Trees','SVM'],marks:40},{unit:'Unsupervised',topics:['K-Means','PCA'],marks:30},{unit:'Evaluation',topics:['Cross-Validation','Hyperparameter Tuning','Metrics'],marks:30}], benefits:['IIT Madras Credit','NM ML Practitioner Badge'], totalRegistered:3900, maxRegistrations:6000, icon:'🤖' },
  { id:30, title:'Tamil Nadu Police Recruitment Aptitude Mock', shortTitle:'TN Police Mock', category:'government', difficulty:'Moderate', mode:'offline', status:'open', conductedBy:'NaanMudhalvan x TNUSRB Prep Cell', targetAudience:['Tamil Nadu Citizens (18–24 yrs)'], eligibility:'10th/12th pass, Tamil Nadu resident', examDate:'Mar 29, 2025', registrationDeadline:'Mar 20, 2025', resultDate:'Apr 8, 2025', duration:120, totalQuestions:100, totalMarks:100, passingMarks:50, negativeMarking:false, languages:['Tamil','English'], fee:'FREE', domains:['General Knowledge','Current Affairs','Tamil','Aptitude'], syllabus:[{unit:'GK',topics:['History','Geography','Polity','Science'],marks:35},{unit:'Current Affairs',topics:['TN News','National News','Sports'],marks:25},{unit:'Aptitude & Tamil',topics:['Maths','Reasoning','Tamil Language'],marks:40}], benefits:['Performance report','Recommended books and resources'], totalRegistered:18400, maxRegistrations:30000, icon:'🚔' },
  { id:31, title:'Android Development with Kotlin Exam', shortTitle:'Android Kotlin', category:'certification', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Google Developers', targetAudience:['B.Tech/MCA Students'], eligibility:'Basic Java/Kotlin knowledge', examDate:'Mar 12, 2025', registrationDeadline:'Mar 7, 2025', resultDate:'Mar 17, 2025', duration:90, totalQuestions:60, totalMarks:120, passingMarks:75, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Kotlin','Android SDK','Jetpack Compose','Firebase'], syllabus:[{unit:'Kotlin & OOP',topics:['Coroutines','Extensions','Data Classes'],marks:40},{unit:'Android SDK',topics:['Activities','Navigation','Room'],marks:50},{unit:'Firebase & Deployment',topics:['Auth','Firestore','Play Console'],marks:30}], benefits:['Google Developers Badge','NM Android Certificate'], totalRegistered:4200, maxRegistrations:7000, icon:'🤖' },
  { id:32, title:'Statistics & Probability for Data Science', shortTitle:'Stats for DS', category:'aptitude', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x IITM Online', targetAudience:['Maths/Statistics/CS Students'], eligibility:'12th level mathematics', examDate:'Feb 28, 2025', registrationDeadline:'Feb 23, 2025', resultDate:'Mar 4, 2025', duration:90, totalQuestions:60, totalMarks:120, passingMarks:72, negativeMarking:true, languages:['English'], fee:'₹149', domains:['Probability','Distributions','Hypothesis Testing','Regression'], syllabus:[{unit:'Probability',topics:['Bayes Theorem','Conditional Probability'],marks:40},{unit:'Distributions',topics:['Normal','Binomial','Poisson'],marks:40},{unit:'Inference',topics:['Hypothesis Testing','ANOVA','Regression'],marks:40}], benefits:['NM Statistics Badge','IITM Online course credit'], totalRegistered:3600, maxRegistrations:6000, icon:'📐' },
  { id:33, title:'Competitive Coding Championship – Round 1', shortTitle:'Coding Championship', category:'competitive', difficulty:'Expert', mode:'online', status:'open', conductedBy:'NaanMudhalvan x CodeChef', targetAudience:['All CS/IT/Math Students'], eligibility:'Registered NM platform user', examDate:'Mar 5, 2025', registrationDeadline:'Mar 2, 2025', resultDate:'Mar 6, 2025', duration:180, totalQuestions:8, totalMarks:800, passingMarks:400, negativeMarking:false, languages:['English'], fee:'FREE', domains:['DP','Graph Algorithms','Mathematical Algorithms','Data Structures'], syllabus:[{unit:'Standard',topics:['Arrays','Strings','Sorting','Binary Search'],marks:200},{unit:'Medium',topics:['Graphs','Trees','DP','Greedy'],marks:300},{unit:'Hard',topics:['Advanced DP','Network Flow','Segment Trees'],marks:300}], benefits:['CodeChef Rating Boost','₹1.5 Lakh Prize Pool (Top 50)','Internship Referrals'], totalRegistered:8900, maxRegistrations:15000, icon:'🏆' },
  { id:34, title:'TNPSC Group 4 Mock Exam', shortTitle:'TNPSC Group 4', category:'government', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x TNPSC Coaching Cell', targetAudience:['Tamil Nadu Graduates'], eligibility:'Any degree, Tamil Nadu resident', examDate:'Mar 8, 2025', registrationDeadline:'Mar 3, 2025', resultDate:'Mar 15, 2025', duration:120, totalQuestions:200, totalMarks:300, passingMarks:150, negativeMarking:false, languages:['Tamil','English'], fee:'FREE', domains:['General Tamil','General Studies','Aptitude'], syllabus:[{unit:'Tamil',topics:['Grammar','Literature','Comprehension'],marks:75},{unit:'General Studies',topics:['History','Geography','Science','Polity'],marks:150},{unit:'Aptitude',topics:['Maths','Reasoning'],marks:75}], benefits:['TNPSC readiness rank','Detailed subject-wise analysis'], totalRegistered:22400, maxRegistrations:40000, icon:'📋' },
  { id:35, title:'Generative AI & LLM Fundamentals Exam', shortTitle:'GenAI Fundamentals', category:'certification', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Microsoft AI', targetAudience:['All Students'], eligibility:'Completion of NM GenAI module', examDate:'Rolling – every Saturday', registrationDeadline:'Any time', resultDate:'Immediate on submission', duration:45, totalQuestions:35, totalMarks:70, passingMarks:49, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['LLM Concepts','Prompt Engineering','RAG','Responsible AI'], syllabus:[{unit:'LLM Basics',topics:['Transformers','Tokens','Context Window'],marks:25},{unit:'Prompt Engineering',topics:['Zero-shot','Few-shot','Chain of Thought'],marks:25},{unit:'Applications',topics:['RAG','Agents','Hallucinations','GDPR'],marks:20}], benefits:['Microsoft AI Fundamentals Prep','NM GenAI Badge','LinkedIn Skill verification'], totalRegistered:16800, maxRegistrations:50000, icon:'✨' },
  { id:36, title:'Network Engineering & CCNA Mock Exam', shortTitle:'CCNA Mock', category:'certification', difficulty:'Hard', mode:'online', status:'upcoming', conductedBy:'NaanMudhalvan x Cisco Networking Academy', targetAudience:['B.E ECE/CSE/IT'], eligibility:'Basic networking concepts', examDate:'Apr 15, 2025', registrationDeadline:'Apr 8, 2025', resultDate:'Apr 20, 2025', duration:120, totalQuestions:100, totalMarks:200, passingMarks:130, negativeMarking:true, languages:['English'], fee:'₹299', domains:['Networking Fundamentals','Routing','Switching','Security'], syllabus:[{unit:'Fundamentals',topics:['OSI Model','TCP/IP','Subnetting','VLANs'],marks:70},{unit:'Routing & Switching',topics:['OSPF','EIGRP','STP'],marks:80},{unit:'Security & WAN',topics:['ACLs','NAT','VPN'],marks:50}], benefits:['Cisco NetAcad Badge','CCNA 200-301 preparation report'], totalRegistered:2600, maxRegistrations:5000, icon:'📡' },
  { id:37, title:'Cyber Patriot – Tamil Nadu CTF Competition', shortTitle:'TN CTF', category:'competitive', difficulty:'Expert', mode:'online', status:'open', conductedBy:'NaanMudhalvan x C3iHub IIT Kanpur', targetAudience:['B.Tech/M.Tech CS/IT/ECE'], eligibility:'Basic Linux and networking knowledge', examDate:'Mar 16, 2025', registrationDeadline:'Mar 10, 2025', resultDate:'Mar 17, 2025', duration:240, totalQuestions:20, totalMarks:2000, passingMarks:500, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Web Exploitation','Reverse Engineering','Forensics','Cryptography'], syllabus:[{unit:'Web Security',topics:['SQLi','XSS','SSRF','JWT attacks'],marks:500},{unit:'Rev Engineering',topics:['Binary Analysis','Disassembly','Patching'],marks:500},{unit:'Forensics & Crypto',topics:['File Carving','Memory Forensics','RSA','AES'],marks:1000}], benefits:['C3iHub Certificate','₹2 Lakh CTF Prize Pool (Top 10)','CERT-In Acknowledgement'], totalRegistered:1800, maxRegistrations:3000, icon:'🚩' },
  { id:38, title:'Product Management Case Study Exam', shortTitle:'PM Case Study', category:'skill-assessment', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Chargebee', targetAudience:['MBA/B.Tech Final Year'], eligibility:'Interest in Product Management', examDate:'Mar 20, 2025', registrationDeadline:'Mar 15, 2025', resultDate:'Mar 27, 2025', duration:90, totalQuestions:0, totalMarks:100, passingMarks:60, negativeMarking:false, languages:['English'], fee:'₹199', domains:['Product Strategy','User Research','Metrics','Execution'], syllabus:[{unit:'Strategy',topics:['Prioritisation','PRD','Roadmapping','OKRs'],marks:35},{unit:'User Research',topics:['User Interviews','Jobs-to-be-Done'],marks:30},{unit:'Metrics',topics:['North Star Metric','A/B Testing','Funnels'],marks:35}], benefits:['Chargebee PM Fellowship shortlisting','NM PM Certification'], totalRegistered:2400, maxRegistrations:4000, icon:'📋' },
  { id:39, title:'EV & Green Energy Technology Exam', shortTitle:'EV Tech Exam', category:'technical', difficulty:'Moderate', mode:'online', status:'upcoming', conductedBy:'NaanMudhalvan x Tata Power', targetAudience:['B.E EEE/Mechanical/Automotive'], eligibility:'Basic electrical engineering knowledge', examDate:'Apr 25, 2025', registrationDeadline:'Apr 18, 2025', resultDate:'Apr 30, 2025', duration:75, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:false, languages:['English'], fee:'FREE', domains:['EV Technology','Battery Systems','Charging Standards','Power Electronics'], syllabus:[{unit:'EV Fundamentals',topics:['Motor Types','Battery Chemistry','BMS'],marks:35},{unit:'Charging & Grid',topics:['AC/DC Charging','V2G','Standards: CCS/CHAdeMO'],marks:35},{unit:'Policy & Economics',topics:['FAME Scheme','EVCI Policy'],marks:30}], benefits:['Tata Power Talent Pool','NM EV Technology Badge'], totalRegistered:1600, maxRegistrations:3500, icon:'🔋' },
  { id:40, title:'Big Data & Apache Spark Assessment', shortTitle:'Big Data Spark', category:'technical', difficulty:'Hard', mode:'online', status:'open', conductedBy:'NaanMudhalvan x TCS', targetAudience:['B.Tech/MCA CS/IT'], eligibility:'Knowledge of Python/Java and SQL', examDate:'Mar 26, 2025', registrationDeadline:'Mar 20, 2025', resultDate:'Mar 31, 2025', duration:90, totalQuestions:55, totalMarks:110, passingMarks:70, negativeMarking:false, languages:['English'], fee:'₹249', domains:['Hadoop','Spark','Kafka','Data Lakes'], syllabus:[{unit:'Hadoop Ecosystem',topics:['HDFS','MapReduce','YARN','Hive'],marks:35},{unit:'Apache Spark',topics:['RDDs','DataFrames','Spark SQL'],marks:45},{unit:'Streaming',topics:['Kafka','Spark Streaming','Delta Lake'],marks:30}], benefits:['TCS Big Data Talent Pool','NM Data Engineering Badge'], totalRegistered:2900, maxRegistrations:5000, icon:'⚡' },
  { id:41, title:'Entrepreneurship & Innovation Aptitude Test', shortTitle:'Entrepreneurship Test', category:'aptitude', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x EDII Tamil Nadu', targetAudience:['All Students'], eligibility:'Any student with entrepreneurial interest', examDate:'Feb 16, 2025', registrationDeadline:'Feb 12, 2025', resultDate:'Feb 20, 2025', duration:45, totalQuestions:40, totalMarks:80, passingMarks:48, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['Business Fundamentals','Innovation','Startup Ecosystem','Finance Basics'], syllabus:[{unit:'Business Basics',topics:['Market Research','Business Models'],marks:25},{unit:'Innovation',topics:['Design Thinking','Lean Startup','MVP'],marks:30},{unit:'Finance',topics:['P&L','Cash Flow','Funding Stages'],marks:25}], benefits:['EDII Entrepreneurship Certificate','Startup mentoring shortlist'], totalRegistered:5400, maxRegistrations:10000, icon:'🚀' },
  { id:42, title:'Cloud Security Fundamentals Exam', shortTitle:'Cloud Security', category:'certification', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x ISC2 CC Prep', targetAudience:['CS/IT Students'], eligibility:'Basic networking and cloud knowledge', examDate:'Mar 18, 2025', registrationDeadline:'Mar 12, 2025', resultDate:'Mar 22, 2025', duration:75, totalQuestions:60, totalMarks:120, passingMarks:78, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Cloud Security','IAM','Data Privacy','Compliance'], syllabus:[{unit:'Cloud Security',topics:['Shared Responsibility','Encryption','Key Management'],marks:40},{unit:'Identity & Access',topics:['IAM','MFA','Zero Trust'],marks:40},{unit:'Compliance',topics:['GDPR','ISO 27001','SEBI'],marks:40}], benefits:['ISC2 CC exam prep report','NM Cloud Security Badge'], totalRegistered:2200, maxRegistrations:4000, icon:'🔒' },
  { id:43, title:'Soft Skills & Professional Communication Test', shortTitle:'Soft Skills Test', category:'aptitude', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Infosys Springboard', targetAudience:['All Final Year Students'], eligibility:'Any student', examDate:'Feb 5, 2025', registrationDeadline:'Feb 3, 2025', resultDate:'Feb 7, 2025', duration:45, totalQuestions:40, totalMarks:80, passingMarks:48, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['Communication','Teamwork','Leadership','Time Management'], syllabus:[{unit:'Communication',topics:['Email Etiquette','Presentation','Interview Skills'],marks:30},{unit:'Workplace Skills',topics:['Teamwork','Conflict Resolution','Feedback'],marks:25},{unit:'Leadership',topics:['Decision Making','Goal Setting','Motivation'],marks:25}], benefits:['Infosys Springboard Certificate','NM Employability Score'], totalRegistered:12600, maxRegistrations:25000, icon:'🤝' },
  { id:44, title:'TNPSC Group 2 Prelims Mock', shortTitle:'TNPSC Group 2', category:'government', difficulty:'Hard', mode:'offline', status:'upcoming', conductedBy:'NaanMudhalvan x TNPSC Academy', targetAudience:['Tamil Nadu Graduates'], eligibility:'Any degree, Tamil Nadu resident, Age 18–32', examDate:'Apr 12, 2025', registrationDeadline:'Apr 5, 2025', resultDate:'Apr 20, 2025', duration:180, totalQuestions:200, totalMarks:300, passingMarks:165, negativeMarking:false, languages:['Tamil','English'], fee:'₹99', domains:['General Studies','Tamil Culture','Current Affairs','Aptitude'], syllabus:[{unit:'Polity & History',topics:['Constitution','Governance','Freedom Movement'],marks:80},{unit:'TN Focus',topics:['TN History','Economy','Geography'],marks:80},{unit:'Science & Aptitude',topics:['Physics','Chemistry','Biology','Maths'],marks:140}], benefits:['Detailed rank & percentile','Subject-wise gap analysis'], totalRegistered:31000, maxRegistrations:50000, icon:'📋' },
  { id:45, title:'Mathematical Reasoning & Data Interpretation', shortTitle:'Math & DI', category:'aptitude', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan Campus Placement Cell', targetAudience:['All Final Year Students'], eligibility:'Any UG degree', examDate:'Feb 24, 2025', registrationDeadline:'Feb 20, 2025', resultDate:'Feb 28, 2025', duration:60, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:true, languages:['English'], fee:'FREE', domains:['Arithmetic','Algebra','Data Tables','Charts'], syllabus:[{unit:'Arithmetic',topics:['Percentages','Ratios','Time-Speed-Distance'],marks:35},{unit:'Algebra & Geometry',topics:['Linear Equations','Mensuration'],marks:30},{unit:'Data Interpretation',topics:['Bar Charts','Pie Charts','Tables'],marks:35}], benefits:['NM Aptitude Certificate','Placement readiness scorecard'], totalRegistered:9800, maxRegistrations:18000, icon:'📊' },
  { id:46, title:'Fundamentals of Computer Science Exam', shortTitle:'CS Fundamentals', category:'technical', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x IBM SkillsBuild', targetAudience:['1st & 2nd Year CS/IT Students'], eligibility:'Enrolled in CS/IT/BCA programme', examDate:'Feb 8, 2025', registrationDeadline:'Feb 4, 2025', resultDate:'Feb 12, 2025', duration:60, totalQuestions:50, totalMarks:100, passingMarks:60, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['Computer Architecture','OS Basics','Networking','Programming'], syllabus:[{unit:'Computer Organisation',topics:['CPU','Memory','Number Systems'],marks:30},{unit:'OS & Networking',topics:['Process Management','TCP/IP','DNS'],marks:40},{unit:'Programming',topics:['Flowcharts','Data Types','Loops'],marks:30}], benefits:['IBM SkillsBuild Digital Badge','NM CS Foundations Certificate'], totalRegistered:7200, maxRegistrations:12000, icon:'💻' },
  { id:47, title:'Design Thinking & Innovation Challenge', shortTitle:'Design Thinking', category:'skill-assessment', difficulty:'Easy', mode:'online', status:'open', conductedBy:'NaanMudhalvan x IIM Tiruchirappalli', targetAudience:['All Students'], eligibility:'Any student, no prior experience needed', examDate:'Mar 4, 2025', registrationDeadline:'Feb 28, 2025', resultDate:'Mar 8, 2025', duration:60, totalQuestions:35, totalMarks:70, passingMarks:42, negativeMarking:false, languages:['English','Tamil'], fee:'FREE', domains:['Empathize','Define','Ideate','Prototype','Test'], syllabus:[{unit:'Design Thinking',topics:['Empathy Maps','How Might We','Brainstorming'],marks:30},{unit:'Prototyping',topics:['Paper Prototypes','User Testing','Iteration'],marks:20},{unit:'Innovation Cases',topics:['Social Innovation','Product Innovation'],marks:20}], benefits:['IIM-T Participation Certificate','NM Innovation Badge','IIM Design Workshop shortlist'], totalRegistered:4800, maxRegistrations:8000, icon:'💡' },
  { id:48, title:'Tamil Nadu Judicial Service Aptitude Mock', shortTitle:'TN Judicial Mock', category:'government', difficulty:'Hard', mode:'offline', status:'upcoming', conductedBy:'NaanMudhalvan x TNPSC Law Cell', targetAudience:['Law Graduates (LLB/LLM)'], eligibility:'LLB degree, Tamil Nadu resident', examDate:'May 5, 2025', registrationDeadline:'Apr 20, 2025', resultDate:'May 15, 2025', duration:180, totalQuestions:200, totalMarks:200, passingMarks:110, negativeMarking:false, languages:['Tamil','English'], fee:'₹149', domains:['Constitutional Law','IPC','Civil Procedure','TN Laws'], syllabus:[{unit:'Constitutional Law',topics:['Fundamental Rights','DPSP','Judiciary'],marks:50},{unit:'Criminal Law',topics:['IPC','CrPC','Evidence Act'],marks:75},{unit:'Civil Law',topics:['CPC','Specific Relief Act','Limitation Act'],marks:75}], benefits:['Detailed performance report','TN Judicial Service preparation roadmap'], totalRegistered:1200, maxRegistrations:2500, icon:'⚖️' },
  { id:49, title:'Research Methodology & Academic Writing Exam', shortTitle:'Research Methods', category:'certification', difficulty:'Moderate', mode:'online', status:'open', conductedBy:'NaanMudhalvan x Anna University', targetAudience:['M.Tech/M.Sc/MPhil/PhD Students'], eligibility:'PG or research programme enrolled students', examDate:'Mar 22, 2025', registrationDeadline:'Mar 17, 2025', resultDate:'Mar 28, 2025', duration:90, totalQuestions:60, totalMarks:120, passingMarks:72, negativeMarking:false, languages:['English'], fee:'FREE', domains:['Research Design','Literature Review','Statistical Analysis','Academic Writing'], syllabus:[{unit:'Research Design',topics:['Types of Research','Hypothesis Formation','Sampling'],marks:40},{unit:'Statistical Methods',topics:['Descriptive Stats','Inferential Stats'],marks:40},{unit:'Academic Writing',topics:['Literature Review','Citation','Plagiarism'],marks:40}], benefits:['Anna University Research Certificate','NM Research Scholar Badge'], totalRegistered:2800, maxRegistrations:5000, icon:'🔬' },
  { id:50, title:'NaanMudhalvan Grand Challenge 2025 – Annual Flagship', shortTitle:'NM Grand Challenge 2025', category:'competitive', difficulty:'Expert', mode:'hybrid', status:'open', conductedBy:'Govt. of Tamil Nadu – NaanMudhalvan', targetAudience:['All Tamil Nadu College Students'], eligibility:'Enrolled in any college in Tamil Nadu', examDate:'Apr 20, 2025', registrationDeadline:'Apr 5, 2025', resultDate:'May 1, 2025', duration:240, totalQuestions:120, totalMarks:500, passingMarks:250, negativeMarking:true, languages:['English','Tamil'], fee:'FREE', domains:['Core Engineering','Data Science','AI','Problem Solving','Communication'], syllabus:[{unit:'Technical Aptitude',topics:['CS Fundamentals','Algorithms','System Design'],marks:150},{unit:'AI & Data Skills',topics:['ML Concepts','Data Interpretation','Statistics'],marks:150},{unit:'Communication',topics:['English','Tamil','Case Study Analysis'],marks:200}], benefits:['Chief Minister Trophy for Top 3','₹10 Lakh scholarship pool','Internship placements','NM Grand Champion Badge','National Media Coverage'], totalRegistered:42000, maxRegistrations:100000, icon:'🏆' },
];

// ─── Status metadata ────────────────────────────────────────────
export const STATUS_META: Record<ExamStatus, { label: string; color: string; bg: string }> = {
  'open':             { label: 'Open',             color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  'closing-soon':     { label: 'Closing Soon',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  'closed':           { label: 'Closed',           color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  'upcoming':         { label: 'Upcoming',         color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  'result-declared':  { label: 'Result Declared',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
};
