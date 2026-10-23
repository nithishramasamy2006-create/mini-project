// ============================================================
// EVENTS DATA — Full event listings for NaanMudhalvan platform
// ============================================================

export type EventType = 'hackathon' | 'workshop' | 'webinar' | 'bootcamp' | 'career-fair' | 'competition' | 'conference' | 'guest-lecture';
export type EventMode = 'online' | 'offline' | 'hybrid';

export interface Speaker {
  name: string;
  role: string;
  company: string;
  avatar: string; // initials or emoji
}

export interface Event {
  id: number;
  title: string;
  description: string;
  type: EventType;
  category: string;        // domain tag
  organizer: string;
  organizerLogo: string;   // emoji
  date: string;            // "Jan 15, 2025"
  endDate?: string;        // for multi-day events
  time: string;            // "10:00 AM"
  duration: string;        // "3 Hours" / "2 Days"
  mode: EventMode;
  location: string;        // city name or "Online"
  venue?: string;          // specific venue name
  seats: number;
  seatsLeft: number;
  price: string;           // "Free" | "₹299" | "₹499"
  registrationDeadline: string;
  skills: string[];
  speakers: Speaker[];
  prize?: string;          // for hackathons / competitions
  certificate: boolean;
  featured: boolean;
  color: string;
  tags: string[];
  banner?: string;         // emoji used as visual banner
}

// ─── Type metadata ─────────────────────────────────────────────
export const EVENT_TYPES: { id: EventType | 'all'; label: string; icon: string; color: string }[] = [
  { id: 'all',           label: 'All Events',    icon: '🎯', color: '#7c3aed' },
  { id: 'hackathon',     label: 'Hackathons',    icon: '⚡', color: '#f59e0b' },
  { id: 'workshop',      label: 'Workshops',     icon: '🔧', color: '#3b82f6' },
  { id: 'webinar',       label: 'Webinars',      icon: '🎙️', color: '#10b981' },
  { id: 'bootcamp',      label: 'Bootcamps',     icon: '🚀', color: '#ec4899' },
  { id: 'career-fair',   label: 'Career Fairs',  icon: '🏢', color: '#06b6d4' },
  { id: 'competition',   label: 'Competitions',  icon: '🏆', color: '#f97316' },
  { id: 'conference',    label: 'Conferences',   icon: '🎤', color: '#8b5cf6' },
  { id: 'guest-lecture', label: 'Guest Lectures',icon: '📖', color: '#14b8a6' },
];

// ─── Events Data ────────────────────────────────────────────────
export const EVENTS: Event[] = [
  {
    id: 1,
    title: 'NM HackFest 2025 — AI for Social Good',
    description: 'Tamil Nadu\'s biggest 48-hour AI hackathon. Build solutions in healthcare, agriculture, and education using ML & GenAI. ₹5 Lakh prize pool. Open to all TN college students.',
    type: 'hackathon',
    category: 'AI & ML',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    date: 'Feb 14, 2025',
    endDate: 'Feb 16, 2025',
    time: '9:00 AM',
    duration: '48 Hours',
    mode: 'offline',
    location: 'Chennai',
    venue: 'IIT Madras Research Park, Taramani',
    seats: 500,
    seatsLeft: 87,
    price: 'Free',
    registrationDeadline: 'Feb 5, 2025',
    skills: ['Python', 'TensorFlow', 'GenAI', 'React', 'Node.js'],
    speakers: [
      { name: 'Dr. Karthik Raman', role: 'AI Research Lead', company: 'Google DeepMind', avatar: 'KR' },
      { name: 'Priya Nair', role: 'CTO', company: 'Zoho Corp', avatar: 'PN' },
    ],
    prize: '₹5,00,000 Prize Pool',
    certificate: true,
    featured: true,
    color: '#f59e0b',
    tags: ['AI', 'Hackathon', 'Social Good', 'TN Exclusive'],
    banner: '⚡',
  },
  {
    id: 2,
    title: 'Full Stack Web Dev Bootcamp — React & Node.js',
    description: 'Intensive 5-day bootcamp covering React 19, Node.js, MongoDB, REST APIs, deployment on AWS, and CI/CD pipelines. Hands-on projects every day. Certificate on completion.',
    type: 'bootcamp',
    category: 'Full Stack',
    organizer: 'Zoho Corporation',
    organizerLogo: '🔷',
    date: 'Jan 20, 2025',
    endDate: 'Jan 24, 2025',
    time: '10:00 AM',
    duration: '5 Days',
    mode: 'hybrid',
    location: 'Chennai',
    venue: 'Zoho HQ, Estancia IT Park',
    seats: 120,
    seatsLeft: 23,
    price: 'Free',
    registrationDeadline: 'Jan 15, 2025',
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    speakers: [
      { name: 'Anand Ravi', role: 'Principal Engineer', company: 'Zoho Corp', avatar: 'AR' },
      { name: 'Meena Krishnan', role: 'DevOps Lead', company: 'Zoho Corp', avatar: 'MK' },
    ],
    certificate: true,
    featured: true,
    color: '#3b82f6',
    tags: ['Full Stack', 'React', 'Node.js', 'Bootcamp'],
    banner: '🚀',
  },
  {
    id: 3,
    title: 'Cracking Product-Based Company Interviews',
    description: 'Live webinar with engineers from Google, Amazon & Freshworks. Learn DSA strategies, system design patterns, and resume tips that actually work for FAANG-level interviews.',
    type: 'webinar',
    category: 'Career',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    date: 'Jan 18, 2025',
    time: '7:00 PM',
    duration: '2 Hours',
    mode: 'online',
    location: 'Online',
    seats: 5000,
    seatsLeft: 2143,
    price: 'Free',
    registrationDeadline: 'Jan 17, 2025',
    skills: ['DSA', 'System Design', 'Problem Solving', 'Resume Writing'],
    speakers: [
      { name: 'Rahul Kumar', role: 'Software Engineer', company: 'Google', avatar: 'RK' },
      { name: 'Sindhu Pillai', role: 'SDE-II', company: 'Amazon', avatar: 'SP' },
      { name: 'Vijay Anand', role: 'Tech Lead', company: 'Freshworks', avatar: 'VA' },
    ],
    certificate: true,
    featured: false,
    color: '#10b981',
    tags: ['Career', 'Interview Prep', 'FAANG', 'DSA'],
    banner: '🎙️',
  },
  {
    id: 4,
    title: 'NM Career Fair 2025 — 200+ Companies Hiring',
    description: 'Tamil Nadu\'s largest student career fair. Walk-in interviews with 200+ top companies including TCS, Infosys, Cognizant, Freshworks, Zoho and many more. Bring your resume!',
    type: 'career-fair',
    category: 'Career',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    date: 'Feb 28, 2025',
    time: '9:00 AM',
    duration: 'Full Day',
    mode: 'offline',
    location: 'Coimbatore',
    venue: 'SNS College of Technology, Saravanampatti',
    seats: 10000,
    seatsLeft: 4280,
    price: 'Free',
    registrationDeadline: 'Feb 20, 2025',
    skills: ['Any Domain', 'All Branches', '2023-2026 Batch'],
    speakers: [],
    certificate: false,
    featured: true,
    color: '#06b6d4',
    tags: ['Career Fair', 'Job', 'Walk-In', 'TCS', 'Infosys', 'Zoho'],
    banner: '🏢',
  },
  {
    id: 5,
    title: 'Cybersecurity Workshop — Ethical Hacking & Pen Testing',
    description: 'Learn penetration testing, network security, and vulnerability assessment using Kali Linux. Hands-on CTF challenge at the end. Certificate from EC-Council partnered trainer.',
    type: 'workshop',
    category: 'Cybersecurity',
    organizer: 'CyberArmour India',
    organizerLogo: '🔐',
    date: 'Jan 25, 2025',
    time: '10:00 AM',
    duration: '8 Hours',
    mode: 'offline',
    location: 'Madurai',
    venue: 'Thiagarajar College of Engineering',
    seats: 60,
    seatsLeft: 12,
    price: '₹299',
    registrationDeadline: 'Jan 22, 2025',
    skills: ['Kali Linux', 'Ethical Hacking', 'Network Security', 'Wireshark'],
    speakers: [
      { name: 'Arjun Sharma', role: 'CEH Certified Trainer', company: 'CyberArmour', avatar: 'AS' },
    ],
    certificate: true,
    featured: false,
    color: '#ec4899',
    tags: ['Cybersecurity', 'Ethical Hacking', 'CTF', 'Workshop'],
    banner: '🔐',
  },
  {
    id: 6,
    title: 'Smart India Hackathon — State Qualifier Round',
    description: 'Official SIH state-level qualifier for Tamil Nadu teams. Problem statements from Government of India ministries. Teams of 6. Registration via NaanMudhalvan portal.',
    type: 'hackathon',
    category: 'Government',
    organizer: 'AICTE',
    organizerLogo: '🇮🇳',
    date: 'Feb 1, 2025',
    endDate: 'Feb 2, 2025',
    time: '8:00 AM',
    duration: '36 Hours',
    mode: 'offline',
    location: 'Multiple Venues',
    venue: 'Anna University + 12 Nodal Centres',
    seats: 2000,
    seatsLeft: 340,
    price: 'Free',
    registrationDeadline: 'Jan 20, 2025',
    skills: ['Any Tech Stack', 'Problem Solving', 'Innovation', 'Teamwork'],
    speakers: [],
    prize: '₹1,00,000 per team (Finals)',
    certificate: true,
    featured: true,
    color: '#f97316',
    tags: ['SIH', 'Government', 'Hackathon', 'National Level'],
    banner: '🏆',
  },
  {
    id: 7,
    title: 'Data Science with Python — Workshop Series (4 Sessions)',
    description: 'Four weekend sessions covering Pandas, NumPy, Matplotlib, Scikit-Learn, and real-world ML projects. Beginner-friendly. Free dataset access included.',
    type: 'workshop',
    category: 'Data Science',
    organizer: 'DataMinds Academy',
    organizerLogo: '📊',
    date: 'Jan 11, 2025',
    endDate: 'Feb 1, 2025',
    time: '2:00 PM',
    duration: '4 Weekends',
    mode: 'online',
    location: 'Online',
    seats: 300,
    seatsLeft: 78,
    price: 'Free',
    registrationDeadline: 'Jan 9, 2025',
    skills: ['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib', 'Jupyter'],
    speakers: [
      { name: 'Dr. Lavanya Subramanian', role: 'Data Scientist', company: 'Mu Sigma', avatar: 'LS' },
    ],
    certificate: true,
    featured: false,
    color: '#f59e0b',
    tags: ['Data Science', 'Python', 'ML', 'Beginner Friendly'],
    banner: '📊',
  },
  {
    id: 8,
    title: 'TechTalks 2025 — Future of AI in India',
    description: 'Annual technology conference featuring keynotes from IIT professors, startup founders, and industry CXOs. Panel discussions on GenAI, deep tech, and India\'s tech ecosystem.',
    type: 'conference',
    category: 'AI & ML',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    date: 'Mar 8, 2025',
    time: '9:30 AM',
    duration: '1 Day',
    mode: 'hybrid',
    location: 'Chennai',
    venue: 'Chennai Trade Centre, Nandambakkam',
    seats: 1500,
    seatsLeft: 620,
    price: '₹199',
    registrationDeadline: 'Mar 1, 2025',
    skills: ['AI', 'GenAI', 'Networking', 'Tech Policy'],
    speakers: [
      { name: 'Prof. Balaraman Ravindran', role: 'IIT Madras', company: 'AI4Bharat', avatar: 'BR' },
      { name: 'Girish Mathrubootham', role: 'Founder & CEO', company: 'Freshworks', avatar: 'GM' },
      { name: 'Roshni Nadar', role: 'Chairperson', company: 'HCL Technologies', avatar: 'RN' },
    ],
    certificate: true,
    featured: true,
    color: '#8b5cf6',
    tags: ['Conference', 'AI', 'Tech', 'Keynote', 'Networking'],
    banner: '🎤',
  },
  {
    id: 9,
    title: 'UI/UX Design Fundamentals — Figma Workshop',
    description: 'Learn Figma from scratch to advanced. Cover design thinking, wireframing, prototyping, and design systems. Build a complete portfolio project by the end.',
    type: 'workshop',
    category: 'UI/UX Design',
    organizer: 'DesignHub India',
    organizerLogo: '🎨',
    date: 'Jan 26, 2025',
    time: '11:00 AM',
    duration: '6 Hours',
    mode: 'online',
    location: 'Online',
    seats: 200,
    seatsLeft: 56,
    price: 'Free',
    registrationDeadline: 'Jan 24, 2025',
    skills: ['Figma', 'Design Thinking', 'Wireframing', 'Prototyping', 'UI Design'],
    speakers: [
      { name: 'Sneha Reddy', role: 'Senior UX Designer', company: 'Adobe', avatar: 'SR' },
    ],
    certificate: true,
    featured: false,
    color: '#f472b6',
    tags: ['UI/UX', 'Figma', 'Design', 'Portfolio'],
    banner: '🎨',
  },
  {
    id: 10,
    title: 'Guest Lecture — Building Scalable SaaS Products',
    description: 'Sridhar Vembu (Zoho CEO) shares lessons learned from building Zoho into a $1B+ company without VC funding. Q&A session with student entrepreneurs.',
    type: 'guest-lecture',
    category: 'Entrepreneurship',
    organizer: 'NaanMudhalvan',
    organizerLogo: '⚡',
    date: 'Jan 30, 2025',
    time: '6:00 PM',
    duration: '90 Minutes',
    mode: 'online',
    location: 'Online',
    seats: 10000,
    seatsLeft: 6872,
    price: 'Free',
    registrationDeadline: 'Jan 29, 2025',
    skills: ['Entrepreneurship', 'Product Management', 'SaaS', 'Leadership'],
    speakers: [
      { name: 'Sridhar Vembu', role: 'Founder & CEO', company: 'Zoho Corporation', avatar: 'SV' },
    ],
    certificate: false,
    featured: true,
    color: '#14b8a6',
    tags: ['Guest Lecture', 'SaaS', 'Entrepreneurship', 'Zoho'],
    banner: '📖',
  },
  {
    id: 11,
    title: 'Code Wars Tamil Nadu — Competitive Programming',
    description: 'Inter-college competitive programming contest. 4-hour timed challenge with 8 algorithmic problems. Rating-based prizes. Hosted on CodeChef platform.',
    type: 'competition',
    category: 'Competitive Programming',
    organizer: 'CodeChef TN Chapter',
    organizerLogo: '👨‍💻',
    date: 'Feb 8, 2025',
    time: '10:00 AM',
    duration: '4 Hours',
    mode: 'online',
    location: 'Online',
    seats: 2000,
    seatsLeft: 743,
    price: 'Free',
    registrationDeadline: 'Feb 6, 2025',
    skills: ['DSA', 'C++', 'Java', 'Python', 'Algorithms'],
    speakers: [],
    prize: '₹50,000 Total Prize',
    certificate: true,
    featured: false,
    color: '#f97316',
    tags: ['Competitive Programming', 'CodeChef', 'DSA', 'Contest'],
    banner: '🏆',
  },
  {
    id: 12,
    title: 'Cloud Computing & DevOps Bootcamp — AWS + Docker',
    description: 'Hands-on 3-day bootcamp on AWS services, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code with Terraform. Includes AWS exam voucher worth ₹2000.',
    type: 'bootcamp',
    category: 'Cloud & DevOps',
    organizer: 'AWS Educate India',
    organizerLogo: '☁️',
    date: 'Feb 20, 2025',
    endDate: 'Feb 22, 2025',
    time: '9:00 AM',
    duration: '3 Days',
    mode: 'online',
    location: 'Online',
    seats: 250,
    seatsLeft: 101,
    price: '₹499',
    registrationDeadline: 'Feb 15, 2025',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    speakers: [
      { name: 'Mithun Krishnan', role: 'AWS Solutions Architect', company: 'Amazon Web Services', avatar: 'MK' },
    ],
    certificate: true,
    featured: false,
    color: '#f59e0b',
    tags: ['Cloud', 'AWS', 'DevOps', 'Kubernetes'],
    banner: '☁️',
  },
  { id:13, title:'Tamil Nadu GenAI Summit 2025', type:'Conference', category:'ai', mode:'Offline', date:'Mar 8, 2025', time:'9:00 AM', duration:'1 Day', location:'Chennai Trade Centre', organizer:'NASSCOM Tamil Nadu', participants:1200, maxParticipants:1500, price:'₹799', registrationDeadline:'Mar 1, 2025', skills:['GenAI','LLMs','Prompt Engineering','AI Strategy'], speakers:[{name:'Krithika Srinivasan',role:'VP AI',company:'Freshworks',avatar:'KS'},{name:'Anand Rajaraman',role:'Co-founder',company:'Kosmix',avatar:'AR'}], certificate:true, featured:true, color:'#7c3aed', tags:['GenAI','AI','Tamil Nadu','Summit'], banner:'🤖' },
  { id:14, title:'IoT Hackathon – Smart Cities', type:'Hackathon', category:'iot', mode:'Offline', date:'Feb 22, 2025', time:'8:00 AM', duration:'36 Hours', location:'IIT Madras Research Park', organizer:'L&T Smart Cities', participants:420, maxParticipants:500, price:'FREE', registrationDeadline:'Feb 18, 2025', skills:['IoT','Raspberry Pi','MQTT','Edge Computing'], speakers:[{name:'Balamurugan S.',role:'Smart City Lead',company:'L&T Technology',avatar:'BS'}], certificate:true, featured:false, color:'#06b6d4', tags:['IoT','Hackathon','SmartCity','Hardware'], banner:'🏙️' },
  { id:15, title:'Cybersecurity & Ethical Hacking Bootcamp', type:'Workshop', category:'cyber', mode:'Online', date:'Feb 10, 2025', time:'10:00 AM', duration:'3 Days', location:'Online (Zoom)', organizer:'HCL TechBee', participants:680, maxParticipants:800, price:'FREE', registrationDeadline:'Feb 7, 2025', skills:['Kali Linux','Metasploit','OWASP','Burp Suite'], speakers:[{name:'Senthil Nathan',role:'Cybersecurity Principal',company:'HCL Technologies',avatar:'SN'}], certificate:true, featured:false, color:'#ec4899', tags:['Cybersecurity','EthicalHacking','Bootcamp','FREE'], banner:'🔐' },
  { id:16, title:'Data Science Conclave – Chennai', type:'Conference', category:'data', mode:'Offline', date:'Mar 15, 2025', time:'9:30 AM', duration:'1 Day', location:'Hilton Chennai', organizer:'Analytics Vidhya', participants:890, maxParticipants:1000, price:'₹999', registrationDeadline:'Mar 10, 2025', skills:['Python','ML','Deep Learning','Data Engineering'], speakers:[{name:'Kunal Jain',role:'CEO',company:'Analytics Vidhya',avatar:'KJ'},{name:'Deepa Mani',role:'Head DS',company:'TCS',avatar:'DM'}], certificate:true, featured:true, color:'#3b82f6', tags:['DataScience','ML','Conference','Analytics'], banner:'📊' },
  { id:17, title:'Flutter & Mobile Dev Workshop', type:'Workshop', category:'fullstack', mode:'Online', date:'Jan 28, 2025', time:'11:00 AM', duration:'1 Day', location:'Online (YouTube Live)', organizer:'Google Developer Groups Chennai', participants:2100, maxParticipants:5000, price:'FREE', registrationDeadline:'Jan 26, 2025', skills:['Flutter','Dart','Firebase','REST APIs'], speakers:[{name:'Roshini Balaji',role:'Flutter Dev Lead',company:'Nykaa',avatar:'RB'}], certificate:true, featured:false, color:'#06b6d4', tags:['Flutter','Mobile','Google','FREE'], banner:'📱' },
  { id:18, title:'Blockchain & Web3 Developer Day', type:'Meetup', category:'fullstack', mode:'Offline', date:'Feb 5, 2025', time:'6:00 PM', duration:'3 Hours', location:'MFAC Auditorium, Coimbatore', organizer:'Web3 Tamil Nadu', participants:280, maxParticipants:400, price:'FREE', registrationDeadline:'Feb 3, 2025', skills:['Solidity','Web3.js','Ethereum','NFTs'], speakers:[{name:'Kavitha Sundaram',role:'Blockchain Lead',company:'Infosys Blockchain',avatar:'KS'}], certificate:false, featured:false, color:'#f59e0b', tags:['Blockchain','Web3','Solidity','Meetup'], banner:'⛓️' },
  { id:19, title:'NLP & Conversational AI Summit', type:'Conference', category:'ai', mode:'Online', date:'Feb 28, 2025', time:'10:00 AM', duration:'1 Day', location:'Online (Hopin)', organizer:'IIT Madras & Sarvam AI', participants:1560, maxParticipants:3000, price:'FREE', registrationDeadline:'Feb 25, 2025', skills:['NLP','Transformers','HuggingFace','Tamil NLP'], speakers:[{name:'Mitesh Khapra',role:'Professor',company:'IIT Madras',avatar:'MK'},{name:'Vivek Raghunathan',role:'CTO',company:'Sarvam AI',avatar:'VR'}], certificate:true, featured:true, color:'#7c3aed', tags:['NLP','Indic AI','Transformers','FREE'], banner:'🗣️' },
  { id:20, title:'DevFest Chennai 2025', type:'Conference', category:'fullstack', mode:'Offline', date:'Mar 1, 2025', time:'9:00 AM', duration:'1 Day', location:'IIT Madras, OAT Ground', organizer:'GDG Chennai', participants:1800, maxParticipants:2000, price:'FREE', registrationDeadline:'Feb 22, 2025', skills:['Android','Flutter','Firebase','Cloud'], speakers:[{name:'Deepti Chopra',role:'Developer Advocate',company:'Google India',avatar:'DC'},{name:'Karthick Selvan',role:'Android GDE',company:'Zoho',avatar:'KS'}], certificate:true, featured:true, color:'#ea4335', tags:['Google','Android','DevFest','FREE'], banner:'🎉' },
  { id:21, title:'Startup & Product Management Workshop', type:'Workshop', category:'design', mode:'Online', date:'Feb 15, 2025', time:'2:00 PM', duration:'4 Hours', location:'Online (Zoom)', organizer:'Chargebee School of SaaS', participants:640, maxParticipants:1000, price:'₹299', registrationDeadline:'Feb 13, 2025', skills:['Product Strategy','PRD Writing','Roadmapping','SaaS Metrics'], speakers:[{name:'Karthick Suresh',role:'Group PM',company:'Chargebee',avatar:'KS'}], certificate:true, featured:false, color:'#10b981', tags:['ProductManagement','SaaS','Startup','Workshop'], banner:'📋' },
  { id:22, title:'Open Source Contribution Sprint', type:'Hackathon', category:'fullstack', mode:'Online', date:'Feb 8, 2025', time:'10:00 AM', duration:'48 Hours', location:'Online (Discord)', organizer:'FOSS United Tamil Nadu', participants:980, maxParticipants:2000, price:'FREE', registrationDeadline:'Feb 5, 2025', skills:['Git','Open Source','Python','JavaScript'], speakers:[{name:'Abhas Abhinav',role:'Open Source Evangelist',company:'DeepRoot Linux',avatar:'AA'}], certificate:true, featured:false, color:'#10b981', tags:['OpenSource','FOSS','Hackathon','GitHub'], banner:'🐙' },
  { id:23, title:'DSA & Competitive Programming Contest', type:'Competition', category:'fullstack', mode:'Online', date:'Mar 5, 2025', time:'10:00 AM', duration:'3 Hours', location:'Online (CodeChef)', organizer:'TCS CodeVita', participants:12400, maxParticipants:50000, price:'FREE', registrationDeadline:'Mar 1, 2025', skills:['Data Structures','Algorithms','Python','C++'], speakers:[{name:'Sangeeta Gupta',role:'Campus Hiring Lead',company:'TCS',avatar:'SG'}], certificate:true, featured:false, color:'#3b82f6', tags:['DSA','CompetitiveProgramming','CodeVita','FREE'], banner:'🏆' },
  { id:24, title:'AgriTech Innovation Challenge', type:'Hackathon', category:'ai', mode:'Offline', date:'Mar 20, 2025', time:'9:00 AM', duration:'24 Hours', location:'TNAU Campus, Coimbatore', organizer:'TNAU & iHub', participants:350, maxParticipants:500, price:'FREE', registrationDeadline:'Mar 15, 2025', skills:['Python','IoT','Machine Learning','Remote Sensing'], speakers:[{name:'Dr. Murugan P.',role:'Agricultural Scientist',company:'TNAU',avatar:'MP'}], certificate:true, featured:false, color:'#10b981', tags:['AgriTech','IoT','AI','Hackathon'], banner:'🌾' },
  { id:25, title:'Microsoft Azure AI Certification Bootcamp', type:'Workshop', category:'cloud', mode:'Online', date:'Feb 18, 2025', time:'9:00 AM', duration:'2 Days', location:'Online (Teams)', organizer:'Microsoft Learn India', participants:2200, maxParticipants:5000, price:'FREE', registrationDeadline:'Feb 15, 2025', skills:['Azure','Cognitive Services','AI Builder','Power Platform'], speakers:[{name:'Priya Gopalakrishnan',role:'Cloud Solution Architect',company:'Microsoft India',avatar:'PG'}], certificate:true, featured:false, color:'#0078d4', tags:['Azure','Microsoft','Certification','FREE'], banner:'🪟' },
  { id:26, title:'UI/UX Design Jam – Figma', type:'Workshop', category:'design', mode:'Online', date:'Feb 3, 2025', time:'3:00 PM', duration:'5 Hours', location:'Online (Figma Community)', organizer:'Razorpay Design', participants:1800, maxParticipants:3000, price:'FREE', registrationDeadline:'Feb 1, 2025', skills:['Figma','UI Design','Prototyping','Design Systems'], speakers:[{name:'Divya Rajan',role:'Product Design Lead',company:'Razorpay',avatar:'DR'}], certificate:false, featured:false, color:'#f43f5e', tags:['Figma','UIDesign','Workshop','FREE'], banner:'🎨' },
  { id:27, title:'FinTech & Payments Hackathon', type:'Hackathon', category:'fullstack', mode:'Offline', date:'Mar 12, 2025', time:'9:00 AM', duration:'30 Hours', location:'HDFC Bank Mumbai HQ', organizer:'HDFC Bank & Fintech Chennai', participants:560, maxParticipants:600, price:'FREE', registrationDeadline:'Mar 8, 2025', skills:['UPI','Payment APIs','Security','React'], speakers:[{name:'Ramesh Balasubramanian',role:'Enterprise Architect',company:'HDFC Bank',avatar:'RB'}], certificate:true, featured:true, color:'#3b82f6', tags:['FinTech','Payments','Hackathon','UPI'], banner:'💳' },
  { id:28, title:'Robotics & Embedded Systems Workshop', type:'Workshop', category:'iot', mode:'Offline', date:'Feb 22, 2025', time:'10:00 AM', duration:'1 Day', location:'PSG Tech, Coimbatore', organizer:'ISTE Tamil Nadu', participants:320, maxParticipants:400, price:'₹399', registrationDeadline:'Feb 18, 2025', skills:['Arduino','Raspberry Pi','ROS','Python'], speakers:[{name:'Bharath Kumar',role:'Industry 4.0 Lead',company:'TVS Motor',avatar:'BK'}], certificate:true, featured:false, color:'#f59e0b', tags:['Robotics','IoT','Embedded','Hardware'], banner:'🤖' },
  { id:29, title:'Women in Tech – Tamil Nadu Conclave', type:'Conference', category:'ai', mode:'Offline', date:'Mar 8, 2025', time:'10:00 AM', duration:'1 Day', location:'Lalit Ashok, Bangalore', organizer:'WiT India Chapter', participants:620, maxParticipants:800, price:'FREE', registrationDeadline:'Mar 4, 2025', skills:['Leadership','Tech Careers','AI','Diversity'], speakers:[{name:'Anitha Krishnamurthy',role:'VP Product',company:'BYJU\'S',avatar:'AK'},{name:'Priyanka Suresh',role:'AI Lead',company:'MicroStrategy',avatar:'PS'}], certificate:true, featured:true, color:'#ec4899', tags:['WomenInTech','Diversity','Leadership','FREE'], banner:'👩‍💻' },
  { id:30, title:'Docker & Kubernetes Hands-On Lab', type:'Workshop', category:'cloud', mode:'Online', date:'Jan 30, 2025', time:'10:00 AM', duration:'4 Hours', location:'Online (YouTube Live)', organizer:'CNCF Chennai', participants:3200, maxParticipants:10000, price:'FREE', registrationDeadline:'Jan 28, 2025', skills:['Docker','Kubernetes','Helm','ArgoCD'], speakers:[{name:'Arjun Ramachandran',role:'Platform Engineer',company:'Freshworks',avatar:'AR'}], certificate:false, featured:false, color:'#06b6d4', tags:['Kubernetes','Docker','CNCF','FREE'], banner:'☸️' },
  { id:31, title:'EV & Clean Tech Innovation Hackathon', type:'Hackathon', category:'iot', mode:'Offline', date:'Mar 25, 2025', time:'8:00 AM', duration:'24 Hours', location:'Tata Power EV Campus, Chennai', organizer:'Tata Power & TANGEDCO', participants:280, maxParticipants:400, price:'FREE', registrationDeadline:'Mar 20, 2025', skills:['Battery Management','IoT','Python','Optimization'], speakers:[{name:'Gautam Prabhu',role:'EV Analytics Lead',company:'Tata Power',avatar:'GP'}], certificate:true, featured:false, color:'#10b981', tags:['EV','CleanTech','Hackathon','Sustainability'], banner:'🔋' },
  { id:32, title:'React Advanced Patterns & Performance', type:'Workshop', category:'fullstack', mode:'Online', date:'Feb 10, 2025', time:'2:00 PM', duration:'4 Hours', location:'Online (Zoom)', organizer:'Zoho Engineering Blog', participants:1420, maxParticipants:2000, price:'FREE', registrationDeadline:'Feb 8, 2025', skills:['React','Performance','Memoization','Advanced Hooks'], speakers:[{name:'Priya Venkatesh',role:'Sr. Frontend Engineer',company:'Zoho',avatar:'PV'}], certificate:false, featured:false, color:'#3b82f6', tags:['React','Performance','Frontend','FREE'], banner:'⚛️' },
  { id:33, title:'Space Tech & ISRO Innovation Day', type:'Conference', category:'ai', mode:'Offline', date:'Mar 19, 2025', time:'9:00 AM', duration:'1 Day', location:'ISRO SAC, Bangalore', organizer:'ISRO & Space India', participants:600, maxParticipants:800, price:'₹299', registrationDeadline:'Mar 14, 2025', skills:['Satellite Data','Remote Sensing','GIS','Python'], speakers:[{name:'Dr. Priya Lakshmi',role:'Earth Observation Scientist',company:'ISRO',avatar:'PL'},{name:'Naveen Subramanian',role:'Drone Engineer',company:'Garuda Robotics',avatar:'NS'}], certificate:true, featured:true, color:'#06b6d4', tags:['SpaceTech','ISRO','GIS','Innovation'], banner:'🚀' },
  { id:34, title:'Cyber Threat Intelligence Masterclass', type:'Workshop', category:'cyber', mode:'Online', date:'Feb 26, 2025', time:'7:00 PM', duration:'2 Hours', location:'Online (Zoom)', organizer:'EC-Council India', participants:880, maxParticipants:1200, price:'₹199', registrationDeadline:'Feb 24, 2025', skills:['Threat Intel','OSINT','Dark Web Monitoring','MITRE ATT&CK'], speakers:[{name:'Kiran Reddy',role:'Cloud Security Engineer',company:'Palo Alto Networks',avatar:'KR'}], certificate:true, featured:false, color:'#ec4899', tags:['CyberSecurity','ThreatIntel','Masterclass','OSINT'], banner:'🕵️' },
  { id:35, title:'Machine Learning Engineer Career Fair', type:'Meetup', category:'ai', mode:'Online', date:'Mar 2, 2025', time:'4:00 PM', duration:'3 Hours', location:'Online (Unstop)', organizer:'Unstop & NASSCOM', participants:3400, maxParticipants:10000, price:'FREE', registrationDeadline:'Feb 28, 2025', skills:['ML','Python','System Design','Interviews'], speakers:[{name:'Vikram Nair',role:'ML Platform Lead',company:'Razorpay',avatar:'VN'}], certificate:false, featured:false, color:'#7c3aed', tags:['Career','ML','Hiring','FREE'], banner:'💼' },
  { id:36, title:'System Design Masterclass for SDE-2+', type:'Workshop', category:'fullstack', mode:'Online', date:'Mar 8, 2025', time:'10:00 AM', duration:'5 Hours', location:'Online (Zoom)', organizer:'Scaler & InterviewBit', participants:5200, maxParticipants:8000, price:'FREE', registrationDeadline:'Mar 6, 2025', skills:['System Design','Distributed Systems','Database Sharding','Load Balancing'], speakers:[{name:'Anand Krishnamurthy',role:'Principal Engineer',company:'LinkedIn India',avatar:'AK'}], certificate:false, featured:false, color:'#3b82f6', tags:['SystemDesign','SDE','InterviewPrep','FREE'], banner:'🏛️' },
  { id:37, title:'NAAN Mudhalvan AI Workshop – Tamil Schools', type:'Workshop', category:'ai', mode:'Offline', date:'Mar 22, 2025', time:'9:30 AM', duration:'1 Day', location:'Anna University, Chennai', organizer:'Govt. of Tamil Nadu (NAAN Mudhalvan)', participants:800, maxParticipants:1000, price:'FREE', registrationDeadline:'Mar 18, 2025', skills:['Python Basics','AI Concepts','Scratch','Data Literacy'], speakers:[{name:'Dr. Ramesh Kumar',role:'Professor',company:'IIT Madras',avatar:'RK'}], certificate:true, featured:true, color:'#10b981', tags:['NaanMudhalvan','GovTech','AI','Tamil'], banner:'🏛️' },
  { id:38, title:'LLM Fine-Tuning & RAG Workshop', type:'Workshop', category:'ai', mode:'Online', date:'Feb 20, 2025', time:'2:00 PM', duration:'4 Hours', location:'Online (Zoom)', organizer:'Weights & Biases India', participants:1680, maxParticipants:3000, price:'₹299', registrationDeadline:'Feb 18, 2025', skills:['LLM','LoRA','RAG','LangChain'], speakers:[{name:'Aravind Srinivasan',role:'ML Engineer',company:'Weights & Biases',avatar:'AS'}], certificate:true, featured:false, color:'#7c3aed', tags:['LLM','GenAI','RAG','Fine-tuning'], banner:'🧬' },
  { id:39, title:'SaaS Product Demo Day – Zoho Partner Summit', type:'Conference', category:'fullstack', mode:'Offline', date:'Mar 28, 2025', time:'9:00 AM', duration:'1 Day', location:'Zoho Campus, Chennai', organizer:'Zoho Corporation', participants:500, maxParticipants:600, price:'FREE (Invite-only)', registrationDeadline:'Mar 20, 2025', skills:['SaaS','API Integration','Zoho CRM','No-Code'], speakers:[{name:'Sridhar Vembu',role:'CEO',company:'Zoho Corporation',avatar:'SV'}], certificate:false, featured:true, color:'#e42527', tags:['SaaS','Zoho','PartnerSummit','B2B'], banner:'🟧' },
  { id:40, title:'Google Cloud Next – Chennai Chapter', type:'Conference', category:'cloud', mode:'Offline', date:'Mar 14, 2025', time:'9:00 AM', duration:'1 Day', location:'St. Regis Hotel, Chennai', organizer:'GDG Cloud Chennai', participants:720, maxParticipants:800, price:'₹499', registrationDeadline:'Mar 8, 2025', skills:['GCP','Vertex AI','Cloud Run','BigQuery'], speakers:[{name:'Arun Prabhu',role:'Cloud Architect',company:'Google Cloud',avatar:'AP'},{name:'Lavanya Murugesh',role:'Data Engineer',company:'Publicis Sapient',avatar:'LM'}], certificate:true, featured:false, color:'#4285f4', tags:['GoogleCloud','GCP','Conference','VertexAI'], banner:'🌩️' },
  { id:41, title:'Startup Pitch Night – Chennai Edition', type:'Meetup', category:'design', mode:'Offline', date:'Feb 20, 2025', time:'6:30 PM', duration:'3 Hours', location:'NASSCOM 10,000 Startups Hub, Chennai', organizer:'TiE Chennai & NASSCOM', participants:200, maxParticipants:300, price:'FREE', registrationDeadline:'Feb 18, 2025', skills:['Startup Pitching','VC Funding','MVP Building','Product-Market Fit'], speakers:[{name:'Karthick Murugan',role:'Partner',company:'Kalaari Capital',avatar:'KM'}], certificate:false, featured:false, color:'#f59e0b', tags:['Startup','Pitch','VC','Networking'], banner:'🚀' },
  { id:42, title:'Quantum Computing Workshop – IBM Q', type:'Workshop', category:'data', mode:'Online', date:'Mar 10, 2025', time:'11:00 AM', duration:'3 Hours', location:'Online (Zoom)', organizer:'IBM Research India', participants:780, maxParticipants:1000, price:'FREE', registrationDeadline:'Mar 8, 2025', skills:['Qiskit','Quantum Circuits','Qubit Computing','Linear Algebra'], speakers:[{name:'Dr. Chandran Pillai',role:'Research Scientist',company:'IBM Quantum',avatar:'CP'}], certificate:true, featured:false, color:'#3b82f6', tags:['Quantum','IBM','Qiskit','Research'], banner:'⚛️' },
  { id:43, title:'Tamil Nadu Frontend Developer Summit', type:'Conference', category:'fullstack', mode:'Offline', date:'Mar 29, 2025', time:'9:30 AM', duration:'1 Day', location:'JW Marriott, Chennai', organizer:'JS Tamil Nadu', participants:650, maxParticipants:800, price:'₹699', registrationDeadline:'Mar 22, 2025', skills:['React','Vue','TypeScript','CSS','Performance'], speakers:[{name:'Priya Venkatesh',role:'Frontend Lead',company:'Zoho',avatar:'PV'},{name:'Arun Chandrasekaran',role:'React GDE',company:'ThoughtWorks',avatar:'AC'}], certificate:true, featured:false, color:'#3b82f6', tags:['Frontend','JavaScript','React','Conference'], banner:'⚛️' },
  { id:44, title:'HealthTech Innovation Hackathon', type:'Hackathon', category:'ai', mode:'Offline', date:'Mar 21, 2025', time:'9:00 AM', duration:'24 Hours', location:'Apollo Hospitals Campus, Chennai', organizer:'Apollo Hospitals & IIT Madras', participants:380, maxParticipants:500, price:'FREE', registrationDeadline:'Mar 16, 2025', skills:['DICOM','Python','ML','HL7 FHIR'], speakers:[{name:'Dr. Sureshkumar M.',role:'Chief Medical Data Officer',company:'Apollo Hospitals',avatar:'SM'}], certificate:true, featured:false, color:'#10b981', tags:['HealthTech','Hackathon','Medical AI','Apollo'], banner:'🏥' },
  { id:45, title:'Database Day – PostgreSQL & Modern SQL', type:'Workshop', category:'data', mode:'Online', date:'Feb 12, 2025', time:'10:00 AM', duration:'3 Hours', location:'Online (YouTube Live)', organizer:'EDB & Freshworks', participants:2400, maxParticipants:5000, price:'FREE', registrationDeadline:'Feb 10, 2025', skills:['PostgreSQL','Query Optimization','Partitioning','Extensions'], speakers:[{name:'Arun Prabhu',role:'DB Architect',company:'Freshworks',avatar:'AP'}], certificate:false, featured:false, color:'#3b82f6', tags:['PostgreSQL','Database','SQL','FREE'], banner:'🗃️' },
  { id:46, title:'Open Source AI Models – Hugging Face Day', type:'Workshop', category:'ai', mode:'Online', date:'Mar 6, 2025', time:'3:00 PM', duration:'3 Hours', location:'Online (Hugging Face Spaces)', organizer:'Hugging Face India Community', participants:3800, maxParticipants:10000, price:'FREE', registrationDeadline:'Mar 4, 2025', skills:['HuggingFace','Transformers','Gradio','Fine-Tuning'], speakers:[{name:'Tanmay Bakshi',role:'AI Developer Advocate',company:'Hugging Face',avatar:'TB'}], certificate:false, featured:false, color:'#f59e0b', tags:['HuggingFace','OpenSource','AI','FREE'], banner:'🤗' },
  { id:47, title:'Coimbatore Tech Meetup – Startup Edition', type:'Meetup', category:'fullstack', mode:'Offline', date:'Feb 8, 2025', time:'5:30 PM', duration:'2.5 Hours', location:'TIDEL Park, Coimbatore', organizer:'Startup Coimbatore', participants:160, maxParticipants:250, price:'FREE', registrationDeadline:'Feb 6, 2025', skills:['Startup Ecosystem','Networking','Tech Trends','Funding'], speakers:[{name:'Prabu Shanmugam',role:'Founder & CEO',company:'TextileTech',avatar:'PS'}], certificate:false, featured:false, color:'#ec4899', tags:['Startup','Coimbatore','Networking','FREE'], banner:'🌆' },
  { id:48, title:'Python for Data Science – NAAN Mudhalvan', type:'Workshop', category:'data', mode:'Offline', date:'Mar 27, 2025', time:'9:00 AM', duration:'1 Day', location:'Thiagarajar College of Engg, Madurai', organizer:'NAAN Mudhalvan Skill Hub', participants:500, maxParticipants:600, price:'FREE', registrationDeadline:'Mar 22, 2025', skills:['Python','NumPy','Pandas','Matplotlib'], speakers:[{name:'Arun Prabhu',role:'Data Science Trainer',company:'Freshworks',avatar:'AP'}], certificate:true, featured:false, color:'#10b981', tags:['Python','DataScience','NaanMudhalvan','FREE'], banner:'🐍' },
  { id:49, title:'Cloud Security & Zero Trust Summit', type:'Conference', category:'cyber', mode:'Online', date:'Mar 17, 2025', time:'10:00 AM', duration:'1 Day', location:'Online (Airmeet)', organizer:'ISACA Tamil Nadu', participants:1200, maxParticipants:2000, price:'₹599', registrationDeadline:'Mar 12, 2025', skills:['Zero Trust','Cloud Security','IAM','Threat Modeling'], speakers:[{name:'Senthil Nathan',role:'Cybersecurity Principal',company:'HCL',avatar:'SN'},{name:'Vijay Sekaran',role:'CISO',company:'Zoho',avatar:'VS'}], certificate:true, featured:false, color:'#ec4899', tags:['CloudSecurity','ZeroTrust','ISACA','Summit'], banner:'🛡️' },
  { id:50, title:'AI for Social Good – NGO Hackathon', type:'Hackathon', category:'ai', mode:'Hybrid', date:'Apr 5, 2025', time:'9:00 AM', duration:'24 Hours', location:'British Council Chennai + Online', organizer:'Societal Thinking & NASSCOM Foundation', participants:450, maxParticipants:600, price:'FREE', registrationDeadline:'Mar 30, 2025', skills:['Python','ML','NLP','Data Visualization'], speakers:[{name:'Dr. Nirmala Suresh',role:'AI Researcher',company:'Vandrevala Foundation',avatar:'NS'}], certificate:true, featured:true, color:'#7c3aed', tags:['AIForGood','SocialImpact','NGO','Hackathon'], banner:'🌍' },
];

// ── Normalize all events ──────────────────────────────────────────
// Events 13-50 use legacy field names (participants/maxParticipants,
// capitalized type/mode, 'FREE' price). This normalizes the entire
// EVENTS array in-place so EventsPage always sees a consistent shape.
const _TYPE_MAP: Record<string, EventType> = {
  hackathon: 'hackathon', workshop: 'workshop', webinar: 'webinar',
  bootcamp:  'bootcamp',  'career-fair': 'career-fair', meetup: 'workshop',
  competition: 'competition', conference: 'conference', 'guest-lecture': 'guest-lecture',
  seminar: 'webinar', summit: 'conference', talk: 'guest-lecture',
};
const _VALID_MODES = new Set(['online', 'offline', 'hybrid']);

function _coerce(raw: any): Event {
  const typeKey = String(raw.type || 'workshop').toLowerCase().replace(/\s+/g, '-');
  const modeKey = String(raw.mode || 'online').toLowerCase();
  const seats     = Number(raw.seats     ?? raw.maxParticipants ?? 200) || 200;
  const seatsLeft = raw.seatsLeft != null
    ? Number(raw.seatsLeft)
    : raw.maxParticipants != null
      ? Math.max(0, Number(raw.maxParticipants) - Number(raw.participants || 0))
      : seats;
  const priceRaw  = String(raw.price || 'Free');
  const price     = priceRaw === 'FREE' ? 'Free' : priceRaw;
  return {
    ...raw,
    type:                 (_TYPE_MAP[typeKey] ?? 'workshop') as EventType,
    mode:                 (_VALID_MODES.has(modeKey) ? modeKey : 'online') as 'online' | 'offline' | 'hybrid',
    seats,
    seatsLeft,
    price,
    category:             raw.category             || 'General',
    organizer:            raw.organizer            || 'Organizer',
    organizerLogo:        raw.organizerLogo        || '🎪',
    date:                 raw.date                 || '',
    endDate:              raw.endDate,
    time:                 raw.time                 || 'TBD',
    duration:             raw.duration             || '',
    location:             raw.location             || 'TBD',
    registrationDeadline: raw.registrationDeadline || raw.date || '',
    skills:               Array.isArray(raw.skills)   ? raw.skills   : typeof raw.skills   === 'string' ? raw.skills.split(',').map((s: string) => s.trim())   : [],
    tags:                 Array.isArray(raw.tags)     ? raw.tags     : typeof raw.tags     === 'string' ? raw.tags.split(',').map((s: string) => s.trim())     : [],
    speakers:             Array.isArray(raw.speakers) ? raw.speakers : [],
    prize:                raw.prize || '',
    certificate:          !!raw.certificate,
    featured:             !!raw.featured,
    color:                (typeof raw.color === 'string' && raw.color.length > 0) ? raw.color : '#7c3aed',
    gradient:             raw.gradient || `linear-gradient(135deg,${raw.color || '#7c3aed'},${raw.color || '#4f46e5'})`,
    banner:               raw.banner || '🎪',
  };
}

// Apply normalization to all events
for (let _i = 0; _i < EVENTS.length; _i++) {
  (EVENTS as any)[_i] = _coerce(EVENTS[_i]);
}
