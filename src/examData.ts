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
];

// ─── Status metadata ────────────────────────────────────────────
export const STATUS_META: Record<ExamStatus, { label: string; color: string; bg: string }> = {
  'open':             { label: 'Open',             color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  'closing-soon':     { label: 'Closing Soon',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  'closed':           { label: 'Closed',           color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  'upcoming':         { label: 'Upcoming',         color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
  'result-declared':  { label: 'Result Declared',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
};
