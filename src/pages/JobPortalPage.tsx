import { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, Briefcase, DollarSign, Bookmark,
  BookmarkCheck, ChevronDown, X, Building2, Users, TrendingUp,
  Star, Globe, Send, CheckCircle, Bell, SlidersHorizontal,
  ArrowRight, Eye, Share2, FileText, AlertCircle, Loader2,
  LayoutDashboard, Calendar, Phone, Mail, GraduationCap,
  Link as LinkIcon, ClipboardList, Filter
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { BASE } from '../api';
import { portalGetAll } from '../portalData';
import PortalApplyModal from '../components/PortalApplyModal';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface Job {
  id: number; title: string; company: string; logo: string; color: string;
  location: string; type: 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid' | 'Contract';
  experience: string; salary: string; posted: string; deadline: string;
  category: string; skills: string[]; description: string;
  responsibilities: string[]; perks: string[]; openings: number;
  applicants: number; views: number; featured: boolean; urgent: boolean;
  verified: boolean; rating: number; employees: string; industry: string;
}

interface ApplicationRecord {
  _id: string; itemId: number; itemTitle: string; itemCompany: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'hired' | 'rejected' | 'accepted';
  createdAt: string; resumeLink: string; coverLetter: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Static Job Data
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const JOBS: Job[] = [
  {
    id: 101, title: 'Software Engineer – Full Stack', company: 'Zoho Corp', logo: '🟧', color: '#e42527',
    location: 'Chennai, TN', type: 'Full-time', experience: '0–2 yrs', salary: '₹6–10 LPA',
    posted: '2h ago', deadline: 'Dec 15, 2026', category: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    description: "Join Zoho's product engineering team building world-class SaaS products used by 80M+ users. Design, develop and ship features end-to-end in an agile environment with passionate engineers.",
    responsibilities: ['Build scalable web features in React & Node.js', 'Collaborate with product & design teams', 'Write unit and integration tests', 'Review code & mentor juniors', 'Participate in sprint planning and retrospectives'],
    perks: ['Health Insurance', 'WFH Flexibility', 'Free Meals', 'ESOPs', 'L&D Budget', 'Paternity Leave'],
    openings: 12, applicants: 347, views: 1820, featured: true, urgent: false, verified: true, rating: 4.6, employees: '15,000+', industry: 'SaaS'
  },
  {
    id: 102, title: 'Data Scientist', company: 'Freshworks', logo: '🌀', color: '#29b5e8',
    location: 'Chennai / Remote', type: 'Hybrid', experience: '1–3 yrs', salary: '₹10–18 LPA',
    posted: '5h ago', deadline: 'Nov 30, 2026', category: 'Data & AI',
    skills: ['Python', 'ML', 'Spark', 'SQL', 'TensorFlow'],
    description: "Work on ML models that power Freshworks AI features across CRM, helpdesk and sales products. Own the full ML lifecycle from data exploration to production deployment.",
    responsibilities: ['Build and optimise ML models', 'Collaborate with engineers on deployment', 'A/B test model improvements', 'Create data pipelines with Spark', 'Present insights to stakeholders'],
    perks: ['ESOPs', 'Remote Friendly', 'Annual Bonus', 'Health Cover', 'Learning Credits', 'Conference Tickets'],
    openings: 5, applicants: 219, views: 980, featured: true, urgent: true, verified: true, rating: 4.5, employees: '5,000+', industry: 'SaaS'
  },
  {
    id: 103, title: 'UI/UX Designer', company: 'Razorpay', logo: '⚡', color: '#3395ff',
    location: 'Bangalore / Remote', type: 'Remote', experience: '1–4 yrs', salary: '₹8–15 LPA',
    posted: '1d ago', deadline: 'Dec 1, 2026', category: 'Design',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    description: "Design intuitive payment experiences for 8M+ businesses. Own end-to-end design for our dashboard, checkout SDK and developer tools.",
    responsibilities: ['Create high-fidelity prototypes in Figma', 'Conduct user research & usability tests', 'Maintain and evolve our design system', 'Work closely with product managers', 'Drive design critiques'],
    perks: ['Remote-first', 'MacBook Pro', 'Health & Dental', 'Team Retreats', 'ESOPs'],
    openings: 3, applicants: 178, views: 720, featured: false, urgent: false, verified: true, rating: 4.4, employees: '3,500+', industry: 'FinTech'
  },
  {
    id: 104, title: 'DevOps Engineer', company: 'TCS', logo: '🔵', color: '#1a56db',
    location: 'Chennai, TN', type: 'Full-time', experience: '2–5 yrs', salary: '₹7–12 LPA',
    posted: '2d ago', deadline: 'Jan 10, 2027', category: 'Engineering',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Docker'],
    description: "Join TCS Digital Centre of Excellence to build world-class DevOps pipelines for Fortune 500 clients. Lead cloud migration and infrastructure automation projects.",
    responsibilities: ['Design and maintain CI/CD pipelines', 'Manage AWS/Azure infrastructure', 'Automate deployments with Terraform', 'Ensure 99.9% system reliability', 'Document infrastructure runbooks'],
    perks: ['PF & Gratuity', 'Health Cover', 'On-site Opportunities', 'Training Certifications', 'Annual Increment'],
    openings: 25, applicants: 562, views: 2200, featured: false, urgent: true, verified: true, rating: 4.2, employees: '600,000+', industry: 'IT Services'
  },
  {
    id: 105, title: 'Product Manager', company: 'CRED', logo: '⚫', color: '#d4af37',
    location: 'Bangalore', type: 'Full-time', experience: '3–6 yrs', salary: '₹20–35 LPA',
    posted: '3d ago', deadline: 'Nov 25, 2026', category: 'Product',
    skills: ['Product Strategy', 'SQL', 'User Research', 'Roadmapping', 'Jira'],
    description: "Own product strategy for CRED's rewards platform used by 12M+ creditworthy members. Drive 0-to-1 features with cross-functional teams.",
    responsibilities: ['Define product vision and quarterly roadmap', 'Work with engineering, design, data teams', 'Analyze user behavior and drive decisions', 'Launch and iterate on features', 'Manage stakeholder expectations'],
    perks: ['High ESOPs', 'Premium Health Cover', 'Unlimited PTO', 'MacBook', 'Gym Membership', 'Team Off-sites'],
    openings: 2, applicants: 489, views: 3100, featured: true, urgent: false, verified: true, rating: 4.7, employees: '1,500+', industry: 'FinTech'
  },
  {
    id: 106, title: 'Backend Engineer – Go', company: 'Swiggy', logo: '🟠', color: '#fc8019',
    location: 'Bangalore / Hybrid', type: 'Hybrid', experience: '2–5 yrs', salary: '₹15–28 LPA',
    posted: '4d ago', deadline: 'Dec 20, 2026', category: 'Engineering',
    skills: ['Go', 'gRPC', 'Kafka', 'Redis', 'MySQL'],
    description: "Build backend systems powering 3M+ daily orders at Swiggy. Join Platform Engineering working on distributed systems at India-scale.",
    responsibilities: ['Design high-throughput microservices in Go', 'Architect event-driven systems with Kafka', 'Optimize for sub-100ms API latency', 'Mentor junior engineers', 'Drive technical design reviews'],
    perks: ['Food Credits', 'ESOPs', 'Health Cover', 'L&D Budget', 'WFH 3 Days', 'Annual Bonus'],
    openings: 8, applicants: 302, views: 1540, featured: false, urgent: false, verified: true, rating: 4.3, employees: '7,000+', industry: 'FoodTech'
  },
  {
    id: 107, title: 'Android Developer', company: 'PhonePe', logo: '💜', color: '#5f259f',
    location: 'Bangalore', type: 'Full-time', experience: '1–3 yrs', salary: '₹10–20 LPA',
    posted: '5d ago', deadline: 'Dec 5, 2026', category: 'Mobile',
    skills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'MVVM', 'REST APIs'],
    description: "Build features for India's #1 UPI app used by 500M users. Work on performance, reliability and delightful payment experiences.",
    responsibilities: ['Build new Android features with Jetpack Compose', 'Optimise app startup and memory', 'Collaborate with backend and QA teams', 'Write unit and UI tests', 'Analyse crash reports and fix bugs'],
    perks: ['ESOPs', 'Relocation Allowance', 'Health Cover', 'Annual Bonus', 'Gym Membership'],
    openings: 10, applicants: 415, views: 1890, featured: true, urgent: true, verified: true, rating: 4.5, employees: '4,000+', industry: 'FinTech'
  },
  {
    id: 108, title: 'Cloud Solutions Architect', company: 'Infosys', logo: '🔷', color: '#007cc3',
    location: 'Hyderabad / Remote', type: 'Hybrid', experience: '5–8 yrs', salary: '₹18–30 LPA',
    posted: '1w ago', deadline: 'Jan 15, 2027', category: 'Cloud',
    skills: ['AWS', 'Azure', 'GCP', 'Microservices', 'Security'],
    description: "Lead cloud transformation for global enterprise clients across banking, retail and healthcare sectors.",
    responsibilities: ['Design multi-cloud architectures', 'Lead client workshops and PoCs', 'Ensure security & compliance standards', 'Guide delivery teams on best practices', 'Estimate cloud cost and capacity'],
    perks: ['Global Mobility', 'Health Cover', 'Variable Pay', 'Professional Certifications', 'PF'],
    openings: 15, applicants: 234, views: 890, featured: false, urgent: false, verified: true, rating: 4.1, employees: '350,000+', industry: 'IT Consulting'
  },
  {
    id: 109, title: 'Cybersecurity Analyst', company: 'HCL Tech', logo: '🔹', color: '#00539b',
    location: 'Chennai, TN', type: 'Full-time', experience: '1–4 yrs', salary: '₹6–14 LPA',
    posted: '1w ago', deadline: 'Dec 28, 2026', category: 'Security',
    skills: ['SIEM', 'Penetration Testing', 'Network Security', 'Python', 'Splunk'],
    description: "Protect HCL and client systems. Work in our 24x7 SOC conducting penetration testing, vulnerability assessments and incident response.",
    responsibilities: ['Monitor and respond to security incidents', 'Conduct vulnerability assessments', 'Build SIEM detection rules', 'Prepare security reports', 'Train non-technical staff on security hygiene'],
    perks: ['Security Certifications', 'Health Cover', 'Night Allowance', 'Shift Flexibility', 'Annual Bonus'],
    openings: 20, applicants: 187, views: 760, featured: false, urgent: true, verified: true, rating: 4.2, employees: '225,000+', industry: 'Technology'
  },
  {
    id: 110, title: 'ML Engineer – NLP', company: 'Meesho', logo: '🟣', color: '#9c27b0',
    location: 'Bangalore / Remote', type: 'Remote', experience: '2–5 yrs', salary: '₹18–32 LPA',
    posted: '2w ago', deadline: 'Nov 28, 2026', category: 'Data & AI',
    skills: ['Python', 'HuggingFace', 'LLMs', 'PyTorch', 'MLflow'],
    description: "Build NLP systems powering product discovery and search for 150M+ users. Work with LLMs, fine-tuning and multilingual models.",
    responsibilities: ['Fine-tune LLMs for e-commerce use-cases', 'Build multilingual NLP pipelines', 'Deploy models with MLflow & BentoML', 'Partner with product for AI features', 'Monitor model quality in production'],
    perks: ['Remote-first', 'ESOPs', 'High L&D Budget', 'Health Cover', 'Annual Conference Tickets'],
    openings: 4, applicants: 298, views: 1230, featured: true, urgent: false, verified: true, rating: 4.4, employees: '3,000+', industry: 'E-Commerce'
  },
  {
    id: 111, title: 'QA Automation Engineer', company: 'Wipro', logo: '🟤', color: '#341c6c',
    location: 'Pune', type: 'Full-time', experience: '1–3 yrs', salary: '₹5–9 LPA',
    posted: '3d ago', deadline: 'Jan 5, 2027', category: 'Engineering',
    skills: ['Selenium', 'Cypress', 'Java', 'TestNG', 'API Testing'],
    description: "Build robust automation test suites for Wipro's banking and insurance clients. Agile team with daily CI/CD runs.",
    responsibilities: ['Build Selenium/Cypress automation frameworks', 'Write API and performance test cases', 'Integrate tests into CI/CD pipelines', 'Track and report defects', 'Maintain test documentation'],
    perks: ['PF & Gratuity', 'Health Cover', 'Skill Certifications', 'On-site Opportunities'],
    openings: 30, applicants: 421, views: 1670, featured: false, urgent: false, verified: true, rating: 4.0, employees: '250,000+', industry: 'IT Services'
  },
  {
    id: 112, title: 'iOS Developer', company: 'OLA', logo: '🟢', color: '#1ab394',
    location: 'Bangalore / Hybrid', type: 'Hybrid', experience: '2–4 yrs', salary: '₹12–22 LPA',
    posted: '6d ago', deadline: 'Dec 10, 2026', category: 'Mobile',
    skills: ['Swift', 'SwiftUI', 'Core Data', 'MapKit', 'REST APIs'],
    description: "Build OLA driver and rider apps in Swift/SwiftUI for 150M users across 100+ cities.",
    responsibilities: ['Build new SwiftUI features for rider app', 'Optimize map rendering performance', 'Integrate third-party SDKs (Maps, Payments)', 'Conduct code reviews', 'Write UI tests with XCTest'],
    perks: ['Cab Credits', 'ESOPs', 'Health Cover', 'Mac & iPhone for work', 'Team Retreats'],
    openings: 6, applicants: 253, views: 1020, featured: false, urgent: false, verified: true, rating: 4.1, employees: '5,000+', industry: 'Mobility'
  },
  { id:113, title:'Machine Learning Engineer', company:'Sarvam AI', logo:'🤖', color:'#7c3aed', location:'Bangalore (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹18–30 LPA', posted:'1d ago', deadline:'Jan 5, 2027', category:'Data & AI', skills:['Python','PyTorch','HuggingFace','CUDA','MLOps'], description:'Build state-of-the-art Indic language models for Tamil, Telugu, Hindi speech and text at Sarvam AI — one of India\'s leading AI startups.', responsibilities:['Train and fine-tune LLMs on Indic data','Optimize inference speed for production','Build data pipelines for 100+ language datasets','Collaborate with research team on novel architectures','Deploy models via FastAPI + Docker'], perks:['ESOP','Unlimited PTO','Research Budget','GPU Cluster Access','Conference Sponsorship'], openings:4, applicants:412, views:2100, featured:true, urgent:true, verified:true, rating:4.8, employees:'100–500', industry:'AI' },
  { id:114, title:'Platform Engineer – Cloud Infrastructure', company:'Zepto', logo:'⚡', color:'#7c3aed', location:'Mumbai (On-site)', type:'Full-time', experience:'2–5 yrs', salary:'₹20–35 LPA', posted:'3h ago', deadline:'Jan 20, 2027', category:'Cloud', skills:['Kubernetes','Terraform','AWS','Go','Prometheus'], description:'Build and scale cloud platform powering 10-minute grocery delivery for 5M+ customers across 25 Indian cities.', responsibilities:['Design Kubernetes-native platforms','Build internal developer tools','Implement FinOps cost optimization','24/7 on-call rotation','Mentor junior engineers'], perks:['ESOPs','Health Cover','Meal Credits','WFH Flexibility','L&D Budget'], openings:5, applicants:289, views:1450, featured:true, urgent:false, verified:true, rating:4.4, employees:'2,000+', industry:'Quick Commerce' },
  { id:115, title:'Security Engineer', company:'Cred', logo:'💜', color:'#7c3aed', location:'Bangalore (Hybrid)', type:'Hybrid', experience:'2–5 yrs', salary:'₹18–32 LPA', posted:'2d ago', deadline:'Dec 20, 2026', category:'Security', skills:['AppSec','Pentest','AWS Security','Python','OWASP'], description:'Protect Cred\'s platform handling ₹1L Cr+ in credit card payments by building security infrastructure and running red team exercises.', responsibilities:['Conduct penetration testing','Build SAST/DAST pipelines','Threat model new features','Run security training','Manage bug bounty program'], perks:['Top-tier Health Insurance','ESOPs','Unlimited Leaves','Premium Office','Annual Retreat'], openings:3, applicants:198, views:980, featured:false, urgent:false, verified:true, rating:4.6, employees:'1,000+', industry:'FinTech' },
  { id:116, title:'Android Developer', company:'Meesho', logo:'🛍️', color:'#f43f5e', location:'Bangalore (Hybrid)', type:'Hybrid', experience:'1–4 yrs', salary:'₹12–24 LPA', posted:'4d ago', deadline:'Jan 15, 2027', category:'Mobile', skills:['Kotlin','Jetpack Compose','Coroutines','Retrofit','Room'], description:'Build shopping features for 140M+ Meesho users — India\'s largest social commerce platform serving tier 2 and 3 cities.', responsibilities:['Ship new Kotlin features','Optimize app startup time','Implement offline-first patterns','Write unit and UI tests','Conduct code reviews'], perks:['ESOPs','Remote Friendly','Health Cover','Learning Budget','Free Lunch'], openings:8, applicants:341, views:1680, featured:false, urgent:false, verified:true, rating:4.3, employees:'5,000+', industry:'E-Commerce' },
  { id:117, title:'Data Scientist – Pricing', company:'IndiGo Airlines', logo:'✈️', color:'#3b82f6', location:'Gurgaon (Hybrid)', type:'Hybrid', experience:'2–5 yrs', salary:'₹16–28 LPA', posted:'1d ago', deadline:'Jan 10, 2027', category:'Data & AI', skills:['Python','Revenue Management','SQL','XGBoost','Tableau'], description:'Build dynamic pricing models that optimise seat revenue across 1,800+ daily IndiGo flights using demand forecasting and competitor analysis.', responsibilities:['Build fare optimization ML models','Analyze booking and yield data','A/B test pricing strategies','Present insights to revenue management team','Monitor model performance in production'], perks:['Discounted Flights','Health Cover','Flexible Hours','Annual Bonus','Cafeteria'], openings:3, applicants:176, views:890, featured:false, urgent:false, verified:true, rating:4.2, employees:'30,000+', industry:'Aviation' },
  { id:118, title:'Full Stack Engineer – Platform', company:'Chargebee', logo:'💼', color:'#7c3aed', location:'Chennai (Remote)', type:'Remote', experience:'2–5 yrs', salary:'₹18–30 LPA', posted:'5d ago', deadline:'Jan 25, 2027', category:'Engineering', skills:['React','Node.js','PostgreSQL','Kafka','TypeScript'], description:'Build subscription billing platform used by 6,500+ SaaS companies globally from the Chennai engineering hub.', responsibilities:['Develop billing and subscription features','Build high-availability payment APIs','Optimize database queries','Write integration tests','Contribute to platform architecture'], perks:['100% Remote','ESOPs','Home Office Budget','Health Cover','International Conference Tickets'], openings:6, applicants:267, views:1320, featured:false, urgent:false, verified:true, rating:4.5, employees:'1,000+', industry:'SaaS' },
  { id:119, title:'ML Infrastructure Engineer', company:'PhonePe', logo:'💙', color:'#5522cc', location:'Bangalore (On-site)', type:'Full-time', experience:'3–6 yrs', salary:'₹25–45 LPA', posted:'6h ago', deadline:'Feb 1, 2027', category:'Data & AI', skills:['Kubeflow','Spark','Python','MLflow','Airflow'], description:'Build the ML platform powering fraud detection, risk scoring and recommendation systems for 500M+ PhonePe users.', responsibilities:['Design ML feature store','Build model serving infrastructure','Optimize training pipelines','Implement experiment tracking','Mentor data scientists on MLOps'], perks:['ESOPs','Performance Bonus','Health Cover','Meal Card','Learning Stipend'], openings:4, applicants:388, views:1920, featured:true, urgent:false, verified:true, rating:4.6, employees:'5,000+', industry:'FinTech' },
  { id:120, title:'React Native Engineer', company:'CRED', logo:'💜', color:'#7c3aed', location:'Bangalore (On-site)', type:'Full-time', experience:'2–5 yrs', salary:'₹20–38 LPA', posted:'2d ago', deadline:'Dec 28, 2026', category:'Mobile', skills:['React Native','TypeScript','Reanimated','Native Modules','Performance'], description:'Build premium mobile experiences for CRED\'s 12M+ creditworthy members using cutting-edge React Native animations and design.', responsibilities:['Build delightful animations with Reanimated 3','Optimize JS bridge performance','Write native modules in Swift/Kotlin','Implement design system components','Own feature development end-to-end'], perks:['Premium Health Cover','ESOP','Annual Bonus','Gadget Budget','Team Trips'], openings:4, applicants:312, views:1560, featured:true, urgent:false, verified:true, rating:4.7, employees:'1,000+', industry:'FinTech' },
  { id:121, title:'DevOps Engineer', company:'Freshworks', logo:'🌀', color:'#29b5e8', location:'Chennai (Remote)', type:'Remote', experience:'2–4 yrs', salary:'₹14–24 LPA', posted:'3d ago', deadline:'Jan 18, 2027', category:'Cloud', skills:['Kubernetes','Terraform','Jenkins','AWS','Ansible'], description:'Maintain DevOps infrastructure supporting 60,000+ businesses using Freshworks CRM, helpdesk and IT products.', responsibilities:['Manage CI/CD pipelines','Provision infrastructure with Terraform','Monitor system health with Datadog','Automate deployments with Ansible','Reduce MTTR through runbook improvements'], perks:['Remote First','Health Cover','ESOPs','Learning Credits','Conference Tickets'], openings:7, applicants:234, views:1180, featured:false, urgent:false, verified:true, rating:4.5, employees:'5,000+', industry:'SaaS' },
  { id:122, title:'Product Manager – Growth', company:'Swiggy', logo:'🧡', color:'#fc8019', location:'Bangalore (On-site)', type:'Full-time', experience:'3–6 yrs', salary:'₹30–50 LPA', posted:'1d ago', deadline:'Jan 22, 2027', category:'Product', skills:['Product Strategy','SQL','A/B Testing','User Research','Roadmapping'], description:'Lead growth product initiatives for Swiggy\'s 90M+ user base — owning key funnels from discovery to order completion.', responsibilities:['Define and own growth KPIs','Run A/B experiments at scale','Work with data science on ML-driven personalisation','Lead cross-functional teams','Present growth reviews to leadership'], perks:['ESOPs','Swiggy Credits','Health Cover','Annual Bonus','Flexible Hours'], openings:2, applicants:521, views:2640, featured:true, urgent:false, verified:true, rating:4.5, employees:'5,000+', industry:'FoodTech' },
  { id:123, title:'Backend Engineer – Payments', company:'Juspay', logo:'💳', color:'#7c3aed', location:'Bangalore (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹12–22 LPA', posted:'4d ago', deadline:'Dec 30, 2026', category:'Engineering', skills:['Haskell','Java','PostgreSQL','Redis','Kafka'], description:'Build ultra-low-latency payment orchestration systems at Juspay — processing 50M+ daily transactions for NPCI, Amazon and Jio.', responsibilities:['Build payment routing and reconciliation systems','Optimize critical path latency','Implement idempotency and retry logic','Write property-based tests','Participate in production on-call'], perks:['Health Cover','ESOPs','Flexible Hours','Meal Card','Annual Bonus'], openings:5, applicants:278, views:1390, featured:false, urgent:true, verified:true, rating:4.4, employees:'500–1,000', industry:'FinTech' },
  { id:124, title:'Embedded Software Engineer', company:'Ather Energy', logo:'⚡', color:'#10b981', location:'Bangalore (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹10–18 LPA', posted:'5d ago', deadline:'Jan 8, 2027', category:'Engineering', skills:['C','RTOS','CAN Bus','Python','OBD2'], description:'Develop firmware for Ather 450X and 450 Apex electric scooters — powering connected vehicle features for 500,000+ Ather owners.', responsibilities:['Implement RTOS features in C','Develop OTA update framework','Write CAN stack modules','Debug hardware-software issues','Write test coverage for critical paths'], perks:['EV Test Rides','ESOPs','Health Cover','Meal Card','Learning Budget'], openings:6, applicants:189, views:945, featured:false, urgent:false, verified:true, rating:4.3, employees:'2,000+', industry:'EV' },
  { id:125, title:'Site Reliability Engineer', company:'Google India', logo:'🔴', color:'#ea4335', location:'Hyderabad (On-site)', type:'Full-time', experience:'2–5 yrs', salary:'₹40–80 LPA', posted:'1d ago', deadline:'Jan 30, 2027', category:'Cloud', skills:['Go','Python','Kubernetes','SLOs','Distributed Systems'], description:'Ensure reliability of Google Cloud products used by millions globally from the Hyderabad SRE team.', responsibilities:['Own SLOs and error budgets','Automate toil with Go/Python','Design for failure and chaos engineering','Incident management and post-mortems','Mentor junior engineers'], perks:['World-class Benefits','RSUs','Gym & Wellness','Catered Meals','Education Budget'], openings:3, applicants:728, views:3640, featured:true, urgent:false, verified:true, rating:4.9, employees:'100,000+', industry:'Technology' },
  { id:126, title:'NLP Research Scientist', company:'AI4Bharat (IIT Madras)', logo:'🎓', color:'#7c3aed', location:'Chennai (Hybrid)', type:'Full-time', experience:'0–2 yrs', salary:'₹12–22 LPA', posted:'2d ago', deadline:'Jan 15, 2027', category:'Data & AI', skills:['PyTorch','Transformers','Indic NLP','Research Writing','Python'], description:'Conduct cutting-edge research on Indic language models for Tamil, Hindi, Telugu and 20+ Indian languages at IIT Madras.', responsibilities:['Train multilingual language models','Publish at top AI conferences (ACL, EMNLP)','Build benchmark datasets for Indic languages','Collaborate with NPCI and govt partners','Mentor PhD students'], perks:['Research Stipend','Conference Funding','GPU Access','Campus Accommodation','Academic Collaboration'], openings:5, applicants:312, views:1560, featured:true, urgent:false, verified:true, rating:4.8, employees:'100–500', industry:'Research' },
  { id:127, title:'UX Researcher', company:'Microsoft India', logo:'🫟', color:'#0078d4', location:'Hyderabad (Hybrid)', type:'Hybrid', experience:'2–5 yrs', salary:'₹18–32 LPA', posted:'3d ago', deadline:'Jan 12, 2027', category:'Design', skills:['User Research','Usability Testing','Survey Design','Figma','Data Analysis'], description:'Conduct user research for Microsoft 365 and Azure products used by 1B+ users worldwide from the Hyderabad product studio.', responsibilities:['Plan and execute generative and evaluative studies','Conduct usability testing','Synthesize insights for product teams','Advocate for accessibility','Collaborate with global research teams'], perks:['RSUs','Comprehensive Health Cover','Annual Bonus','Gym Subsidy','Education Reimbursement'], openings:3, applicants:287, views:1435, featured:false, urgent:false, verified:true, rating:4.7, employees:'50,000+', industry:'Technology' },
  { id:128, title:'Blockchain Engineer', company:'Polygon Labs India', logo:'🔷', color:'#8247e5', location:'Bangalore (Remote)', type:'Remote', experience:'2–4 yrs', salary:'₹20–38 LPA', posted:'2d ago', deadline:'Jan 5, 2027', category:'Engineering', skills:['Solidity','Rust','EVM','ZK Proofs','TypeScript'], description:'Build the next generation of Polygon\'s zkEVM, PoS and CDK infrastructure scaling Ethereum for 1B+ users.', responsibilities:['Develop and audit Solidity smart contracts','Implement ZK proof systems','Build bridging and cross-chain protocols','Review community protocol proposals','Write technical documentation'], perks:['Crypto Compensation Option','Remote First','Conference Sponsorship','Hackathon Budget','Learning Stipend'], openings:4, applicants:356, views:1780, featured:false, urgent:false, verified:true, rating:4.6, employees:'500–1,000', industry:'Web3' },
  { id:129, title:'Software Engineer – Observability', company:'Flipkart', logo:'🛑', color:'#f59e0b', location:'Bangalore (On-site)', type:'Full-time', experience:'2–5 yrs', salary:'₹20–38 LPA', posted:'4d ago', deadline:'Dec 25, 2026', category:'Engineering', skills:['Golang','Prometheus','Grafana','OpenTelemetry','Kafka'], description:'Build observability infrastructure collecting 10TB+ of metrics and logs per day across Flipkart\'s e-commerce platform.', responsibilities:['Build telemetry collection pipelines','Design metric aggregation systems','Implement distributed tracing','Create self-service dashboarding tools','Improve alerting fidelity'], perks:['ESOPs','Health Cover','Free Meals','Learning Budget','Annual Bonus'], openings:5, applicants:298, views:1490, featured:false, urgent:false, verified:true, rating:4.4, employees:'30,000+', industry:'E-Commerce' },
  { id:130, title:'Computer Vision Engineer', company:'ideaForge Technology', logo:'🚁', color:'#06b6d4', location:'Mumbai (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹10–20 LPA', posted:'3d ago', deadline:'Jan 20, 2027', category:'Data & AI', skills:['Python','OpenCV','YOLO','TensorFlow','C++'], description:'Build computer vision systems for indigenous defence and civilian UAVs — detect objects, track targets and enable autonomous navigation.', responsibilities:['Develop real-time object detection for drones','Optimize models for edge deployment','Integrate CV pipelines with flight controller','Test systems in field conditions','Document algorithms for DRDO review'], perks:['Health Cover','ESOPs','Meal Card','Annual Bonus','Patriotic Mission'], openings:4, applicants:156, views:780, featured:false, urgent:false, verified:true, rating:4.3, employees:'500–1,000', industry:'Defence Tech' },
  { id:131, title:'Product Designer – Consumer Apps', company:'Zepto', logo:'⚡', color:'#7c3aed', location:'Mumbai (On-site)', type:'Full-time', experience:'2–4 yrs', salary:'₹18–30 LPA', posted:'1d ago', deadline:'Jan 18, 2027', category:'Design', skills:['Figma','Motion Design','User Research','Prototyping','Design Systems'], description:'Design intuitive and delightful experiences for Zepto\'s 10-minute grocery delivery app used by 5M+ urban shoppers daily.', responsibilities:['Own end-to-end design for checkout and discovery','Build and maintain Zepto design system','Conduct user interviews and usability tests','Create motion and micro-interaction specs','Collaborate closely with engineering'], perks:['ESOPs','Zepto Credits','Health Cover','Premium Workspace','Flexible Hours'], openings:3, applicants:234, views:1170, featured:false, urgent:false, verified:true, rating:4.5, employees:'2,000+', industry:'Quick Commerce' },
  { id:132, title:'Quantitative Analyst', company:'Goldman Sachs India', logo:'🏦', color:'#3b82f6', location:'Bangalore (On-site)', type:'Full-time', experience:'0–2 yrs', salary:'₹25–45 LPA', posted:'1d ago', deadline:'Jan 28, 2027', category:'Data & AI', skills:['Python','Statistics','C++','Derivatives Pricing','Stochastic Calculus'], description:'Build quantitative models for derivatives pricing, risk and trade execution at Goldman Sachs Bangalore engineering hub.', responsibilities:['Develop pricing models for complex derivatives','Backtest trading strategies','Implement real-time risk calculators','Collaborate with global quant teams','Write production-quality C++ code'], perks:['Competitive Salary','Annual Bonus','RSUs','Premium Health Cover','International Mobility'], openings:5, applicants:612, views:3060, featured:true, urgent:false, verified:true, rating:4.7, employees:'50,000+', industry:'Investment Banking' },
  { id:133, title:'Generative AI Engineer', company:'Adobe India', logo:'🎨', color:'#f43f5e', location:'Noida (Hybrid)', type:'Hybrid', experience:'2–5 yrs', salary:'₹25–45 LPA', posted:'2d ago', deadline:'Feb 5, 2027', category:'Data & AI', skills:['Python','Diffusion Models','LLM','PyTorch','CUDA'], description:'Build next-generation AI features for Adobe Firefly, Photoshop and Creative Cloud AI powering 30M+ creative professionals.', responsibilities:['Train image and video generation models','Build ControlNet fine-tuning pipelines','Optimize inference for consumer hardware','Collaborate with product and research teams','File patents on novel architectures'], perks:['RSUs','Premium Health','Education Reimbursement','Creative Software Suite','International Projects'], openings:4, applicants:489, views:2445, featured:true, urgent:true, verified:true, rating:4.7, employees:'30,000+', industry:'Creative Software' },
  { id:134, title:'Engineering Manager – Backend', company:'Groww', logo:'💚', color:'#10b981', location:'Bangalore (On-site)', type:'Full-time', experience:'5–8 yrs', salary:'₹45–70 LPA', posted:'3d ago', deadline:'Jan 10, 2027', category:'Engineering', skills:['Java','System Design','Team Leadership','Microservices','PostgreSQL'], description:'Lead the backend engineering team building trading and investment infrastructure for 10M+ Groww investors.', responsibilities:['Manage and grow a team of 8–12 engineers','Drive architecture decisions','Own reliability and scalability','Recruit top engineering talent','Partner with product and data teams'], perks:['ESOPs','Generous Compensation','Health Cover','WFH Flexibility','Annual Offsite'], openings:2, applicants:287, views:1435, featured:false, urgent:false, verified:true, rating:4.6, employees:'2,000+', industry:'FinTech' },
  { id:135, title:'Staff Software Engineer – Infrastructure', company:'Dunzo', logo:'🏃', color:'#10b981', location:'Bangalore (Remote)', type:'Remote', experience:'5–8 yrs', salary:'₹35–60 LPA', posted:'5d ago', deadline:'Dec 22, 2026', category:'Cloud', skills:['Go','Kubernetes','Kafka','CockroachDB','Terraform'], description:'Architect and build distributed systems enabling Dunzo\'s hyper-local delivery network across 7 Indian cities.', responsibilities:['Define distributed systems architecture','Lead platform engineering team','Drive technical roadmap','Own production reliability','Mentor senior engineers'], perks:['Remote First','ESOPs','Learning Budget','Health Cover','Quarterly Team Meetups'], openings:2, applicants:198, views:990, featured:false, urgent:false, verified:true, rating:4.2, employees:'1,000+', industry:'Quick Commerce' },
  { id:136, title:'Data Analyst – Marketing', company:'Nykaa', logo:'💄', category:'Data & AI', color:'#e91e8c', location:'Mumbai (Hybrid)', type:'Hybrid', experience:'0–2 yrs', salary:'₹6–12 LPA', posted:'2d ago', deadline:'Jan 5, 2027', skills:['SQL','Python','Google Analytics','Meta Ads','Excel'], description:'Analyze marketing performance and customer acquisition data for Nykaa — India\'s leading beauty and fashion platform with 30M+ users.', responsibilities:['Build marketing attribution models','Create campaign performance dashboards','Run cohort analysis on customer LTV','Track influencer ROI metrics','Present weekly insights to CMO'], perks:['Nykaa Product Allowance','Health Cover','WFH Flexibility','Performance Bonus','Annual Retreat'], openings:5, applicants:198, views:990, featured:false, urgent:false, verified:true, rating:4.2, employees:'5,000+', industry:'Retail' },
  { id:137, title:'Compiler Engineer', company:'Texas Instruments India', logo:'🔴', color:'#ef4444', location:'Bangalore (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹12–22 LPA', posted:'4d ago', deadline:'Jan 25, 2027', category:'Engineering', skills:['C++','LLVM','Compiler Optimizations','Assembly','DSP'], description:'Work on TI\'s industry-leading C/C++ compiler toolchain for MSP430 and C2000 microcontroller families powering billions of embedded devices.', responsibilities:['Implement compiler backend optimizations','Port LLVM passes for TI DSPs','Debug codegen issues from customer reports','Write regression test suites','Publish internal technical notes'], perks:['Health Cover','ESOPs','Global Mobility','Patents Incentive','Learning Budget'], openings:3, applicants:145, views:725, featured:false, urgent:false, verified:true, rating:4.4, employees:'30,000+', industry:'Semiconductors' },
  { id:138, title:'Product Manager – B2B SaaS', company:'Zoho Corporation', logo:'🟧', color:'#e42527', location:'Chennai (On-site)', type:'Full-time', experience:'3–6 yrs', salary:'₹20–38 LPA', posted:'1d ago', deadline:'Jan 20, 2027', category:'Product', skills:['Product Strategy','User Research','SQL','PRD Writing','B2B SaaS'], description:'Own product roadmap for one of Zoho\'s 55+ SaaS products used by 80M+ users worldwide — a rare opportunity to lead an entire product.', responsibilities:['Define product vision and roadmap','Work with customers to gather requirements','Partner with engineering on delivery','Track activation and retention metrics','Represent product at Zoholics conference'], perks:['ESOPs','Free Meals on Campus','Health Cover','Annual Bonus','Family Medical Cover'], openings:4, applicants:356, views:1780, featured:false, urgent:false, verified:true, rating:4.5, employees:'15,000+', industry:'SaaS' },
  { id:139, title:'Infrastructure Security Engineer', company:'Paytm', logo:'💙', color:'#00b9f1', location:'Noida (On-site)', type:'Full-time', experience:'2–5 yrs', salary:'₹16–28 LPA', posted:'3d ago', deadline:'Jan 12, 2027', category:'Security', skills:['AWS Security','IAM','WAF','Python','Vulnerability Management'], description:'Secure Paytm\'s cloud infrastructure handling 300M wallet transactions and ₹1Cr+ daily settlements.', responsibilities:['Harden AWS IAM and VPC configurations','Run quarterly vulnerability assessments','Build security automation in Python','Manage WAF and DDoS protection','Conduct security reviews for new services'], perks:['ESOPs','Health Cover','Meal Card','Learning Budget','Annual Bonus'], openings:4, applicants:212, views:1060, featured:false, urgent:false, verified:true, rating:4.1, employees:'10,000+', industry:'FinTech' },
  { id:140, title:'Software Engineer – Recommendations', company:'Amazon India', logo:'📦', color:'#ff9900', location:'Bangalore (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹25–45 LPA', posted:'6h ago', deadline:'Feb 5, 2027', category:'Engineering', skills:['Java','Python','Distributed Systems','ML','AWS'], description:'Build recommendation systems surfacing the right products to 300M+ Amazon India customers and powering billions of ₹ in annual GMV.', responsibilities:['Design scalable recommendation services in Java','Run A/B tests on ranking algorithms','Build ML features and data pipelines','Review designs and code','Drive operational excellence'], perks:['RSUs','Signing Bonus','Premium Health','Meal Card','World-class Tech'], openings:6, applicants:824, views:4120, featured:true, urgent:true, verified:true, rating:4.6, employees:'100,000+', industry:'E-Commerce' },
  { id:141, title:'Technical Program Manager', company:'Infosys', logo:'🔵', color:'#007cc3', location:'Pune (Hybrid)', type:'Hybrid', experience:'3–6 yrs', salary:'₹18–30 LPA', posted:'2d ago', deadline:'Jan 8, 2027', category:'Product', skills:['Program Management','Agile','JIRA','Stakeholder Management','Technical Background'], description:'Drive delivery of large-scale digital transformation programs for Fortune 500 clients from Infosys Pune campus.', responsibilities:['Manage cross-functional delivery teams','Track milestones and resolve dependencies','Run Agile ceremonies','Manage client expectations','Drive escalation resolution'], perks:['Health Cover','Annual Bonus','Learning Certifications','Onsite Opportunities','Employee Wellness'], openings:10, applicants:298, views:1490, featured:false, urgent:false, verified:true, rating:4.2, employees:'300,000+', industry:'IT Services' },
  { id:142, title:'Cloud Solutions Architect', company:'AWS India (Amazon)', logo:'☁️', color:'#ff9900', location:'Mumbai (Hybrid)', type:'Hybrid', experience:'5–8 yrs', salary:'₹40–70 LPA', posted:'1d ago', deadline:'Feb 10, 2027', category:'Cloud', skills:['AWS','Solution Architecture','Cloud Migration','Customer Presentations','Well-Architected'], description:'Help strategic AWS customers architect and migrate workloads to cloud — working with CTO-level stakeholders across BFSI, healthcare and retail.', responsibilities:['Design cloud architectures for enterprise customers','Run AWS Well-Architected Reviews','Lead proof-of-concept workshops','Create technical proposals','Mentor customer engineering teams'], perks:['RSUs','Annual Bonus','Premium Health','Education Reimbursement','Global Customer Exposure'], openings:4, applicants:456, views:2280, featured:true, urgent:false, verified:true, rating:4.8, employees:'100,000+', industry:'Cloud' },
  { id:143, title:'Game Developer (Unity)', company:'Nazara Technologies', logo:'🎮', color:'#7c3aed', location:'Mumbai (Hybrid)', type:'Hybrid', experience:'1–4 yrs', salary:'₹8–18 LPA', posted:'4d ago', deadline:'Jan 15, 2027', category:'Engineering', skills:['Unity','C#','Shader Graph','Physics','Multiplayer Networking'], description:'Build mobile games for Nazara\'s portfolio including Cricket, World Cricket Championship and Kiddopia reaching 100M+ gamers.', responsibilities:['Develop gameplay mechanics in Unity','Optimize draw calls and memory usage','Implement multiplayer using Photon','Build shaders with Shader Graph','Debug platform-specific issues'], perks:['Game Credits','Health Cover','Flexible Hours','Annual Bonus','Game Jams'], openings:5, applicants:267, views:1335, featured:false, urgent:false, verified:true, rating:4.2, employees:'1,000+', industry:'Gaming' },
  { id:144, title:'Climate & Sustainability Analyst', company:'Mahindra Group', logo:'🚗', color:'#c41e3a', location:'Mumbai (Hybrid)', type:'Hybrid', experience:'1–3 yrs', salary:'₹8–16 LPA', posted:'3d ago', deadline:'Jan 22, 2027', category:'Data & AI', skills:['Python','ESG Reporting','Carbon Accounting','Tableau','Sustainability Frameworks'], description:'Track and report Mahindra Group ESG metrics across 260+ subsidiaries and drive decarbonization initiatives.', responsibilities:['Collect scope 1/2/3 emission data','Build GHG inventory models','Prepare CDP and BRSR reports','Analyze supply chain sustainability risk','Support green bond issuance'], perks:['Health Cover','EV Discount','Annual Bonus','WFH Flexibility','Purpose-Driven Work'], openings:3, applicants:134, views:670, featured:false, urgent:false, verified:true, rating:4.4, employees:'100,000+', industry:'Conglomerate' },
  { id:145, title:'Network Engineer', company:'Airtel India', logo:'📡', color:'#e40000', location:'Gurgaon (On-site)', type:'Full-time', experience:'2–4 yrs', salary:'₹10–18 LPA', posted:'5d ago', deadline:'Jan 10, 2027', category:'Engineering', skills:['BGP','MPLS','Python','Network Automation','Cisco IOS'], description:'Design and operate Airtel\'s 5G and fiber backbone network serving 350M+ subscribers across India.', responsibilities:['Configure and optimise BGP routing','Automate network provisioning with Python','Troubleshoot P1 network incidents','Plan capacity for 5G rollout','Document network topology changes'], perks:['Airtel SIM Benefits','Health Cover','Annual Bonus','Learning Budget','Housing Allowance'], openings:8, applicants:189, views:945, featured:false, urgent:false, verified:true, rating:4.1, employees:'30,000+', industry:'Telecom' },
  { id:146, title:'Space Mission Software Engineer', company:'Skyroot Aerospace', logo:'🚀', color:'#7c3aed', location:'Hyderabad (On-site)', type:'Full-time', experience:'1–3 yrs', salary:'₹10–20 LPA', posted:'2d ago', deadline:'Jan 28, 2027', category:'Engineering', skills:['C','Python','RTOS','GNC','MATLAB/Simulink'], description:'Write flight software for Vikram series launch vehicles — India\'s first privately-built commercial rockets.', responsibilities:['Develop flight software in C on RTOS','Implement GNC algorithms','Write HIL test frameworks','Perform code reviews for safety-critical software','Prepare for ISRO certification'], perks:['ESOPs','Health Cover','Patriotic Mission','Annual Bonus','Flat Hierarchy'], openings:5, applicants:312, views:1560, featured:true, urgent:false, verified:true, rating:4.7, employees:'500–1,000', industry:'Space Tech' },
  { id:147, title:'Senior Data Engineer', company:'Razorpay', logo:'⚡', color:'#3395ff', location:'Bangalore (On-site)', type:'Full-time', experience:'3–6 yrs', salary:'₹25–42 LPA', posted:'1d ago', deadline:'Feb 1, 2027', category:'Data & AI', skills:['Spark','dbt','Airflow','Python','Snowflake'], description:'Build Razorpay\'s data platform processing ₹15L Cr in annual payment volume — enabling real-time analytics for merchants and risk teams.', responsibilities:['Design and maintain data warehouse','Build ELT pipelines with dbt','Optimize Spark job performance','Implement data quality monitoring','Enable self-service analytics'], perks:['ESOPs','Annual Bonus','Health Cover','Remote Friendly','Learning Stipend'], openings:4, applicants:345, views:1725, featured:false, urgent:false, verified:true, rating:4.6, employees:'3,000+', industry:'FinTech' },
  { id:148, title:'UI Engineer – Design System', company:'Hotstar (Disney+)', logo:'🎬', color:'#0ea5e9', location:'Mumbai (Remote)', type:'Remote', experience:'2–4 yrs', salary:'₹16–28 LPA', posted:'3d ago', deadline:'Jan 5, 2027', category:'Engineering', skills:['React','TypeScript','CSS-in-JS','Accessibility','Storybook'], description:'Build and maintain the Star Design System powering Hotstar\'s streaming UI across Web, TV, Android and iOS.', responsibilities:['Implement accessible UI components','Write Storybook documentation','Enforce design token consistency','Drive adoption across product teams','Maintain npm package releases'], perks:['Remote First','Disney+ Subscription','Health Cover','Learning Budget','ESOPs'], openings:4, applicants:234, views:1170, featured:false, urgent:false, verified:true, rating:4.5, employees:'3,000+', industry:'Streaming' },
  { id:149, title:'Bioinformatics Engineer', company:'Strand Life Sciences', logo:'🧬', color:'#10b981', location:'Bangalore (Hybrid)', type:'Hybrid', experience:'1–3 yrs', salary:'₹8–16 LPA', posted:'4d ago', deadline:'Jan 15, 2027', category:'Engineering', skills:['Python','GATK','Nextflow','AWS','Bioinformatics Pipelines'], description:'Build cloud-based genomics pipelines enabling precision oncology diagnosis for cancer patients across 50+ hospitals.', responsibilities:['Develop NGS analysis pipelines in Nextflow','Deploy and scale pipelines on AWS Batch','Validate pipeline accuracy against gold standards','Integrate with laboratory information systems','Document pipeline methodology'], perks:['Health Cover','Annual Bonus','Learning Stipend','Flexible Hours','Meaningful Mission'], openings:3, applicants:134, views:670, featured:false, urgent:false, verified:true, rating:4.5, employees:'100–500', industry:'HealthTech' },
  { id:150, title:'AI Product Manager', company:'BYJU\'s', logo:'📚', color:'#00a3e0', location:'Bangalore (Hybrid)', type:'Hybrid', experience:'3–6 yrs', salary:'₹25–42 LPA', posted:'2d ago', deadline:'Jan 20, 2027', category:'Product', skills:['AI Product Strategy','NLP','A/B Testing','EdTech','Data Analysis'], description:'Lead AI product strategy for BYJU\'s adaptive learning engine personalising lessons for 150M+ students across India and global markets.', responsibilities:['Define AI feature roadmap for personalised learning','Work with ML teams on recommendation models','Conduct student learning research','A/B test content and pacing algorithms','Present AI impact metrics to leadership'], perks:['ESOPs','Health Cover','Learning Credits','WFH Flexibility','Annual Bonus'], openings:2, applicants:389, views:1945, featured:false, urgent:false, verified:true, rating:4.1, employees:'30,000+', industry:'EdTech' },
];

const CATEGORIES = ['All', 'Engineering', 'Data & AI', 'Design', 'Product', 'Mobile', 'Cloud', 'Security'];
const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Remote', 'Hybrid', 'Contract'];
const EXPERIENCES = ['All Levels', '0–2 yrs', '1–3 yrs', '1–4 yrs', '2–4 yrs', '2–5 yrs', '3–6 yrs', '5–8 yrs'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending:     { label: 'Under Review',  color: '#f59e0b', bg: '#f59e0b18', icon: 'â³' },
  reviewed:    { label: 'Reviewed',      color: '#3b82f6', bg: '#3b82f618', icon: 'ðŸ‘ï¸' },
  shortlisted: { label: 'Shortlisted',   color: '#8b5cf6', bg: '#8b5cf618', icon: 'â­' },
  interview:   { label: 'Interview',     color: '#06b6d4', bg: '#06b6d418', icon: 'ðŸ“…' },
  hired:       { label: 'Hired 🎉',      color: '#10b981', bg: '#10b98118', icon: '🎉' },
  accepted:    { label: 'Accepted 🎉',   color: '#10b981', bg: '#10b98118', icon: 'âœ…' },
  rejected:    { label: 'Not Selected',  color: '#ef4444', bg: '#ef444418', icon: 'âŒ' },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Apply Modal — Full Form connected to backend
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ApplyModal({ job, onClose, onSuccess, token, user }: {
  job: Job; onClose: () => void; onSuccess: (app: ApplicationRecord) => void;
  token: string | null; user: any;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedApp, setSavedApp] = useState<ApplicationRecord | null>(null);

  // Lock body scroll while job apply modal is open
  useEffect(() => {
    const sb = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${sb}px`);
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  const [form, setForm] = useState({
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
    userCollege: user?.college || '',
    userBranch: user?.branch || '',
    resumeLink: '',
    coverLetter: '',
  });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const canNext0 = form.userName && form.userEmail && form.userPhone;
  const canNext1 = form.userCollege && form.userBranch && form.resumeLink;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError('Please log in to apply.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: 'job',
          itemId: job.id,
          itemTitle: job.title,
          itemCompany: job.company,
          ...form,
          skills: job.skills,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Submission failed. Please try again.'); return; }
      setSavedApp(data.application);
      setSubmitted(true);
      onSuccess(data.application);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Personal Info', 'Education & Resume', 'Cover Letter'];

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)', padding: 16 }}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
        style={{ background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 24, width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>

        {/* Header strip */}
        <div style={{ padding: '22px 28px 16px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1, borderRadius: '24px 24px 0 0' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'var(--surface-2)', border: 'none', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'var(--text-2)' }}><X size={15} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: `${job.color}18`, border: `1.5px solid ${job.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{job.logo}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{job.title}</div>
              <div style={{ fontSize: 12.5, color: job.color, fontWeight: 600 }}>{job.company} · {job.location}</div>
            </div>
          </div>

          {!submitted && (
            <>
              {/* Step dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 6 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: i < step ? job.color : i === step ? job.color : 'var(--surface-2)', border: `2px solid ${i <= step ? job.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: i <= step ? '#fff' : 'var(--text-3)', transition: 'all 0.3s', flexShrink: 0 }}>
                      {i < step ? 'âœ“' : i + 1}
                    </div>
                    {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? job.color : 'var(--border)', transition: 'background 0.3s', margin: '0 4px' }} />}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ fontSize: 10.5, color: i === step ? 'var(--text)' : 'var(--text-3)', fontWeight: i === step ? 700 : 400, flex: 1, textAlign: i === 0 ? 'left' : i === steps.length - 1 ? 'right' : 'center' }}>{s}</div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '22px 28px 28px', flex: 1 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220 }}>
                <div style={{ width: 82, height: 82, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <CheckCircle size={42} color="#fff" />
                </div>
              </motion.div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Application Submitted! 🎉</h3>
              <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 6 }}>
                Your application for <strong style={{ color: 'var(--text)' }}>{job.title}</strong> at <strong style={{ color: job.color }}>{job.company}</strong> has been received.
              </p>
              <p style={{ color: 'var(--text-3)', fontSize: 13, marginBottom: 24 }}>You can track its status in the <strong style={{ color: 'var(--accent-light)' }}>My Applications</strong> tab below.</p>

              {savedApp && (
                <div style={{ background: '#10b98112', border: '1px solid #10b98130', borderRadius: 14, padding: '14px 18px', textAlign: 'left', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 8 }}>Application Details</div>
                  {[['Application ID', savedApp._id?.slice(-8).toUpperCase()], ['Status', 'Under Review â³'], ['Company', job.company], ['Role', job.title]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderBottom: '1px solid #10b98118' }}>
                      <span style={{ color: 'var(--text-3)' }}>{k}</span>
                      <span style={{ color: 'var(--text)', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>Personal Information</h4>
                      <p style={{ fontSize: 12.5, color: 'var(--text-3)' }}>This will be shared with {job.company} for their review.</p>
                    </div>
                    {[
                      { label: 'Full Name *', key: 'userName', type: 'text', placeholder: 'Arun Kumar', icon: <Users size={13} /> },
                      { label: 'Email Address *', key: 'userEmail', type: 'email', placeholder: 'arun@email.com', icon: <Mail size={13} /> },
                      { label: 'Phone Number *', key: 'userPhone', type: 'tel', placeholder: '+91 98765 43210', icon: <Phone size={13} /> },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>{f.icon}</span>
                          <input type={f.type} className="inp" placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                            onChange={e => update(f.key, e.target.value)} required style={{ paddingLeft: 36, width: '100%' }} />
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-primary" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}
                      onClick={() => { if (canNext0) setStep(1); }}>
                      Next Step <ArrowRight size={14} />
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>Education & Resume</h4>
                      <p style={{ fontSize: 12.5, color: 'var(--text-3)' }}>Share your academic background and portfolio.</p>
                    </div>
                    {[
                      { label: 'College / University *', key: 'userCollege', placeholder: 'Anna University, Chennai', icon: <GraduationCap size={13} /> },
                      { label: 'Branch / Specialization *', key: 'userBranch', placeholder: 'B.Tech – Computer Science & Engineering', icon: <BookIcon /> },
                      { label: 'Resume / Portfolio Link *', key: 'resumeLink', placeholder: 'drive.google.com/… or github.com/…', icon: <LinkIcon size={13} /> },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>{f.icon}</span>
                          <input type="text" className="inp" placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                            onChange={e => update(f.key, e.target.value)} required style={{ paddingLeft: 36, width: '100%' }} />
                        </div>
                      </div>
                    ))}

                    {/* Skills preview */}
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}>Skills Being Highlighted</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(job.skills ?? []).map(sk => (
                          <span key={sk} style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 11px', borderRadius: 99, background: `${job.color}15`, color: job.color, border: `1px solid ${job.color}30` }}>{sk}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 4 }}>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>â† Back</button>
                      <button type="button" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                        onClick={() => { if (canNext1) setStep(2); }}>
                        Next Step <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>Cover Letter</h4>
                      <p style={{ fontSize: 12.5, color: 'var(--text-3)' }}>Tell {job.company} why you are the perfect fit. <span style={{ color: 'var(--text-3)' }}>(optional but recommended)</span></p>
                    </div>
                    <div>
                      <textarea className="inp" rows={8}
                        placeholder={`Dear ${job.company} Hiring Team,\n\nI am excited to apply for the ${job.title} role…\n\nMy key strengths include [mention relevant skills]…\n\nI look forward to contributing to your team.\n\nThank you,\n${form.userName}`}
                        value={form.coverLetter} onChange={e => update('coverLetter', e.target.value)}
                        style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: 13, lineHeight: 1.7, minHeight: 200 }} />
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, textAlign: 'right' }}>{form.coverLetter.length} / 2000 chars</div>
                    </div>

                    {/* Summary card */}
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 10 }}>Application Summary</div>
                      {[
                        ['Applicant', form.userName],
                        ['Email', form.userEmail],
                        ['College', form.userCollege],
                        ['Branch', form.userBranch],
                        ['Applying to', `${job.title} @ ${job.company}`],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0', color: 'var(--text-2)' }}>
                          <span style={{ color: 'var(--text-3)' }}>{k}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text)', maxWidth: 220, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                        </div>
                      ))}
                    </div>

                    {error && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#ef444418', border: '1px solid #ef444430', borderRadius: 10, fontSize: 13, color: '#ef4444' }}>
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 4 }}>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>â† Back</button>
                      <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180, justifyContent: 'center' }} disabled={submitting}>
                        {submitting ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Send size={14} /> Submit Application</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// Small icon component to avoid import issues
function BookIcon() {
  return <FileText size={13} />;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// My Applications Dashboard Tab
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MyApplications({ token }: { token: string | null }) {
  const [apps, setApps] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/applications/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setApps((data.applications || []).filter((a: ApplicationRecord) => a.itemId >= 101));
      else setError(data.message || 'Failed to load applications');
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  if (!token) return (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>ðŸ”</div>
      <h3 style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>Sign in to track applications</h3>
      <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Login or register to apply for jobs and track your application status.</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
        <a href="/login" className="btn btn-ghost btn-sm">Sign In</a>
        <a href="/register" className="btn btn-primary btn-sm">Register Free</a>
      </div>
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Total Applied', val: apps.length, color: '#7c3aed', icon: 'ðŸ“‹' },
          { label: 'Shortlisted', val: apps.filter(a => a.status === 'shortlisted').length, color: '#8b5cf6', icon: 'â­' },
          { label: 'Interviews', val: apps.filter(a => a.status === 'interview').length, color: '#06b6d4', icon: 'ðŸ“…' },
          { label: 'Offers', val: apps.filter(a => ['hired', 'accepted'].includes(a.status)).length, color: '#10b981', icon: '🎉' },
        ].map(s => (
          <div key={s.label} style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
        {['all', 'pending', 'shortlisted', 'interview', 'hired', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s', border: `1.5px solid ${filter === s ? '#7c3aed' : 'var(--border)'}`, background: filter === s ? 'rgba(124,58,237,0.12)' : 'var(--surface)', color: filter === s ? 'var(--accent-light)' : 'var(--text-3)' }}>
            {s === 'all' ? `All (${apps.length})` : STATUS_CONFIG[s]?.icon + ' ' + STATUS_CONFIG[s]?.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>
          <AlertCircle size={32} style={{ marginBottom: 12 }} />
          <p>{error}</p>
          <button className="btn btn-ghost btn-sm" onClick={load} style={{ marginTop: 12 }}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>ðŸ“­</div>
          <h3 style={{ fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>{filter === 'all' ? 'No applications yet' : `No ${STATUS_CONFIG[filter]?.label} applications`}</h3>
          <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Browse the jobs above and hit "Apply Now" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((app, i) => {
            const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
            const matchedJob = JOBS.find(j => j.id === app.itemId);
            return (
              <motion.div key={app._id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 16, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: st.color, borderRadius: '16px 0 0 16px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: matchedJob ? `${matchedJob.color}18` : 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {matchedJob?.logo || '💼'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>{app.itemTitle}</div>
                      <div style={{ fontSize: 12.5, color: matchedJob?.color || 'var(--accent)', fontWeight: 600 }}>{app.itemCompany}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 99, background: st.bg, color: st.color, border: `1px solid ${st.color}33`, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {st.icon} {st.label}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
                  {[
                    { label: 'Applied on', val: new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: <Calendar size={11} /> },
                    { label: 'Resume', val: app.resumeLink ? <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>View Resume â†’</a> : 'Not provided', icon: <FileText size={11} /> },
                    { label: 'App ID', val: `#${app._id?.slice(-8).toUpperCase()}`, icon: <ClipboardList size={11} /> },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-2)' }}>
                      <span style={{ color: 'var(--text-3)' }}>{item.icon}</span>
                      <span style={{ color: 'var(--text-3)' }}>{item.label}:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{item.val}</span>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 0 }}>
                  {['pending', 'reviewed', 'shortlisted', 'interview', 'hired'].map((s, idx, arr) => {
                    const statuses = ['pending', 'reviewed', 'shortlisted', 'interview', 'hired'];
                    const currentIdx = statuses.indexOf(app.status);
                    const isActive = idx <= currentIdx && app.status !== 'rejected';
                    const isRejected = app.status === 'rejected';
                    return (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', flex: idx < arr.length - 1 ? '1 1 auto' : 'none' }}>
                        <div title={STATUS_CONFIG[s]?.label} style={{ width: 20, height: 20, borderRadius: '50%', background: isRejected && idx === currentIdx ? '#ef4444' : isActive ? st.color : 'var(--surface-2)', border: `2px solid ${isActive ? st.color : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, transition: 'all 0.3s', cursor: 'default' }}>
                          {isActive && !isRejected && 'âœ“'}
                        </div>
                        {idx < arr.length - 1 && <div style={{ flex: 1, height: 2, background: isActive && idx < currentIdx ? st.color : 'var(--border)', transition: 'background 0.3s', minWidth: 8 }} />}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {['Applied', 'Reviewed', 'Shortlisted', 'Interview', 'Hired'].map((s, idx) => (
                    <div key={s} style={{ fontSize: 9, color: 'var(--text-3)', textAlign: idx === 0 ? 'left' : idx === 4 ? 'right' : 'center', flex: idx < 4 ? 1 : 'none' }}>{s}</div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Job Detail Drawer
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function JobDrawer({ job, onClose, onApply, saved, onToggleSave, hasApplied }: {
  job: Job; onClose: () => void; onApply: () => void; saved: boolean; onToggleSave: () => void; hasApplied: boolean;
}) {
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 520, background: 'var(--surface)', borderLeft: '1px solid var(--border-2)', zIndex: 1000, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <button onClick={onClose} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
            <X size={14} /> Close
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onToggleSave} style={{ background: saved ? `${job.color}18` : 'var(--surface-2)', border: `1px solid ${saved ? job.color + '55' : 'var(--border)'}`, borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: saved ? job.color : 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, transition: 'all 0.2s' }}>
              {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />} {saved ? 'Saved' : 'Save'}
            </button>
            <button style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: 'var(--text-2)' }}><Share2 size={14} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `${job.color}18`, border: `2px solid ${job.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{job.logo}</div>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{job.title}</h2>
              {job.urgent && <span style={{ fontSize: 10, fontWeight: 700, background: '#ef444418', color: '#ef4444', padding: '2px 8px', borderRadius: 99 }}>ðŸ”¥ URGENT</span>}
              {job.featured && <span style={{ fontSize: 10, fontWeight: 700, background: '#f59e0b18', color: '#f59e0b', padding: '2px 8px', borderRadius: 99 }}>â­ FEATURED</span>}
            </div>
            <p style={{ fontSize: 13.5, color: job.color, fontWeight: 700, marginBottom: 5 }}>{job.company}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: 12, color: 'var(--text-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{job.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} />{job.type}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{job.experience}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontWeight: 600 }}><DollarSign size={11} />{job.salary}</span>
            </div>
          </div>
        </div>

        {hasApplied ? (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px', background: '#10b98114', border: '1px solid #10b98130', borderRadius: 12, color: '#10b981', fontWeight: 700, fontSize: 13.5 }}>
            <CheckCircle size={16} /> Application Already Submitted — Track status below
          </div>
        ) : (
          <button onClick={onApply} className="btn btn-primary" style={{ width: '100%', marginTop: 14, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Send size={15} /> Apply Now — {job.openings} opening{job.openings > 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div style={{ padding: 22, flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 22 }}>
          {[{ icon: <Users size={14} />, val: (job.applicants ?? 0).toLocaleString(), label: 'Applicants' }, { icon: <Eye size={14} />, val: (job.views ?? 0).toLocaleString(), label: 'Views' }, { icon: <Star size={14} />, val: (job.rating ?? 0).toFixed(1), label: 'Rating' }].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface-2)', borderRadius: 12, padding: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ color: job.color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>About this role</h4>
          <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.75 }}>{job.description}</p>
        </section>

        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>Responsibilities</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {job.responsibilities.map((r, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: job.color, flexShrink: 0, marginTop: 6 }} />{r}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>Skills Required</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(job.skills ?? []).map(sk => <span key={sk} style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: `${job.color}15`, color: job.color, border: `1px solid ${job.color}30` }}>{sk}</span>)}
          </div>
        </section>

        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>Perks & Benefits</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {(job.perks ?? []).map(p => <span key={p} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 99, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>âœ… {p}</span>)}
          </div>
        </section>

        <div style={{ background: `${job.color}08`, border: `1px solid ${job.color}22`, borderRadius: 14, padding: '16px 18px' }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>About {job.company}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[{ icon: <Building2 size={12} />, label: 'Industry', val: job.industry }, { icon: <Users size={12} />, label: 'Employees', val: job.employees }, { icon: <Star size={12} />, label: 'Rating', val: `${job.rating}/5` }, { icon: <Globe size={12} />, label: 'Deadline', val: job.deadline }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: job.color }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{item.label}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Job Card
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function JobCard({ job, onClick, saved, onToggleSave, index, hasApplied }: {
  job: Job; onClick: () => void; saved: boolean; onToggleSave: (e: React.MouseEvent) => void; index: number; hasApplied: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.37, delay: index * 0.04 }}
      onClick={onClick}
      style={{ background: 'var(--surface)', border: `1.5px solid ${hasApplied ? job.color + '40' : 'var(--border)'}`, borderRadius: 18, padding: '18px 20px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease' }}
      whileHover={{ y: -3, boxShadow: `0 14px 40px ${job.color}18`, borderColor: `${job.color}44` }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg,${job.color},${job.color}44)`, borderRadius: '18px 0 0 18px' }} />

      {hasApplied && (
        <div style={{ position: 'absolute', top: 12, right: 52, background: '#10b98118', border: '1px solid #10b98130', borderRadius: 99, padding: '2px 10px', fontSize: 10.5, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle size={9} /> Applied
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: `${job.color}15`, border: `1.5px solid ${job.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{job.logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                <h3 style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--text)' }}>{job.title}</h3>
                {job.urgent && <span style={{ fontSize: 9.5, fontWeight: 700, background: '#ef444420', color: '#ef4444', padding: '2px 7px', borderRadius: 99 }}>ðŸ”¥ URGENT</span>}
                {job.featured && <span style={{ fontSize: 9.5, fontWeight: 700, background: '#f59e0b18', color: '#f59e0b', padding: '2px 7px', borderRadius: 99 }}>â­ Featured</span>}
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: job.color }}>{job.company}</p>
            </div>
            <button onClick={onToggleSave} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: saved ? job.color : 'var(--text-3)', flexShrink: 0, transition: 'color 0.2s', padding: 4 }}>
              {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 14px', fontSize: 12, color: 'var(--text-2)', marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{job.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} />{job.type}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{job.experience}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontWeight: 600 }}><DollarSign size={11} />{job.salary}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {(job.skills ?? []).slice(0, 4).map(sk => (
              <span key={sk} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: `${job.color}12`, color: job.color, border: `1px solid ${job.color}25` }}>{sk}</span>
            ))}
            {(job.skills ?? []).length > 4 && <span style={{ fontSize: 11, color: 'var(--text-3)', padding: '3px 6px' }}>+{(job.skills ?? []).length - 4}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--text-3)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Users size={11} />{job.applicants} applied</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={11} />{job.views}</span>
              <span>{job.posted}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View Details <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Main Page
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function JobPortalPage() {
  const { user, token } = useAuth();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [jobType, setJobType] = useState('All Types');
  const [exp, setExp] = useState('All Levels');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [portalApplyJob, setPortalApplyJob] = useState<Job | null>(null);
  const [tab, setTab] = useState<'jobs' | 'saved' | 'applications'>('jobs');
  const [showFilters, setShowFilters] = useState(false);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  // Load applied IDs from backend
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/applications/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const ids = new Set<number>((data.applications || []).filter((a: any) => a.itemId >= 101).map((a: any) => a.itemId as number));
        setAppliedIds(ids);
      })
      .catch(() => {});
  }, [token]);

  const toggleSave = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const filtered = useMemo(() => {
    const portalJobs = portalGetAll('job').filter((j: any) => j.status === 'active').map((j: any, idx: number): Job => ({
      id: 60000 + idx, title: j.title || 'Job Opening', company: j.company || j._author || 'Company',
      logo: j.company?.[0] || 'J', color: '#10b981', location: j.location || 'TBD',
      type: (j.type || 'Full-time') as Job['type'], experience: j.experience || 'Freshers OK',
      salary: j.salary || 'Negotiable', posted: 'Recently', deadline: j.deadline || '',
      category: 'Engineering', skills: typeof j.skills==='string' ? j.skills.split(',').map((s:string)=>s.trim()) : (j.skills||[]),
      description: j.description || '', responsibilities: [], perks: [],
      openings: parseInt(j.openings)||1, applicants: 0, views: 0,
      featured: false, urgent: false, verified: false, rating: 4.5,
      employees: '', industry: '',
    }));
    let list = [...JOBS, ...portalJobs];
    if (tab === 'saved') list = list.filter(j => savedIds.has(j.id));
    if (q) list = list.filter(j =>
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      j.company.toLowerCase().includes(q.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(q.toLowerCase()))
    );
    if (category !== 'All') list = list.filter(j => j.category === category);
    if (jobType !== 'All Types') list = list.filter(j => j.type === jobType);
    if (exp !== 'All Levels') list = list.filter(j => j.experience === exp);
    return list;
  }, [q, category, jobType, exp, tab, savedIds]);


  const handleApplySuccess = (app: ApplicationRecord) => {
    setAppliedIds(prev => new Set([...prev, app.itemId]));
  };

  return (
    <div className="page" style={{ minHeight: '100vh', paddingTop: 60 }}>

      {/* â”€â”€ HERO â”€â”€ */}
      <div className="banner" style={{ background: 'linear-gradient(180deg,rgba(6,10,20,0.95) 0%,transparent 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 20% 50%,rgba(124,58,237,0.13),transparent)' }} />
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <div className="container banner-inner">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="chip chip-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Briefcase size={12} /> NM Job Portal
            </span>
            <h1 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,5vw,52px)', letterSpacing: '-0.03em', lineHeight: 1.06, marginBottom: 10 }}>
              Find Your Dream Job<br /><span className="grad-text">in Tamil Nadu & Beyond</span>
            </h1>
            <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 560, marginBottom: 28 }}>
              2,400+ verified openings from 180+ companies. Apply directly, track your application status in real-time, and land your dream role.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { icon: '💼', val: '2,400+', label: 'Active Jobs', color: '#7c3aed' },
                { icon: '🏢', val: '180+', label: 'Companies', color: '#3b82f6' },
                { icon: '🎯', val: '94%', label: 'Placement Rate', color: '#10b981' },
                { icon: '💰', val: '₹8.4 LPA', label: 'Avg Package', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 14 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div className="font-display" style={{ fontWeight: 800, fontSize: 14, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>

        {/* â”€â”€ MAIN TABS â”€â”€ */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 5, marginBottom: 24, width: 'fit-content' }}>
          {[
            { id: 'jobs', label: 'Browse Jobs', icon: <Search size={14} /> },
            { id: 'saved', label: `Saved (${savedIds.size})`, icon: <Bookmark size={14} /> },
            { id: 'applications', label: 'My Applications', icon: <LayoutDashboard size={14} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: tab === t.id ? 'var(--accent)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text-2)' }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* â”€â”€ APPLICATIONS PANEL â”€â”€ */}
        {tab === 'applications' && <MyApplications token={token} />}

        {/* â”€â”€ JOBS / SAVED PANEL â”€â”€ */}
        {(tab === 'jobs' || tab === 'saved') && (
          <>
            {/* Search & filters */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1 1 280px' }}>
                  <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                  <input className="inp" value={q} onChange={e => setQ(e.target.value)} placeholder="Search jobs, companies, skills…" style={{ paddingLeft: 40, width: '100%' }} />
                </div>
                <button onClick={() => setShowFilters(p => !p)}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 18px', height: 44, borderRadius: 12, border: `1.5px solid ${showFilters ? 'var(--accent)' : 'var(--border)'}`, background: showFilters ? 'rgba(124,58,237,0.1)' : 'var(--surface)', color: showFilters ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}>
                  <SlidersHorizontal size={14} /> Filters {showFilters ? 'â–²' : 'â–¼'}
                </button>
              </div>

              {/* Category pills */}
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    style={{ padding: '6px 15px', borderRadius: 99, border: `1.5px solid ${category === c ? 'var(--accent)' : 'var(--border)'}`, background: category === c ? 'rgba(124,58,237,0.12)' : 'var(--surface)', color: category === c ? 'var(--accent-light)' : 'var(--text-2)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, transition: 'all 0.18s' }}>
                    {c}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
                      {[{ label: 'Job Type', val: jobType, setter: setJobType, opts: JOB_TYPES }, { label: 'Experience', val: exp, setter: setExp, opts: EXPERIENCES }].map(f => (
                        <div key={f.label} style={{ position: 'relative', flex: '1 1 160px' }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                          <select className="inp" value={f.val} onChange={e => f.setter(e.target.value)} style={{ width: '100%', paddingRight: 30 }}>
                            {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                          <ChevronDown size={12} style={{ position: 'absolute', right: 10, bottom: 13, color: 'var(--text-3)', pointerEvents: 'none' }} />
                        </div>
                      ))}
                      <button onClick={() => { setJobType('All Types'); setExp('All Levels'); setCategory('All'); setQ(''); }}
                        style={{ alignSelf: 'flex-end', padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 10, background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Filter size={12} style={{ display: 'inline', marginRight: 5 }} />Reset
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}><span style={{ color: 'var(--text)', fontWeight: 700 }}>{filtered.length}</span> jobs found</p>
              {appliedIds.size > 0 && (
                <button onClick={() => setTab('applications')} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent-light)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 99, padding: '4px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ClipboardList size={12} /> {appliedIds.size} application{appliedIds.size > 1 ? 's' : ''} â†’ Track
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>{tab === 'saved' ? 'No saved jobs yet' : 'No jobs match your filters'}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-3)' }}>{tab === 'saved' ? 'Bookmark jobs to find them here.' : 'Try adjusting your search or filters.'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {filtered.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i}
                    onClick={() => setActiveJob(job)}
                    saved={savedIds.has(job.id)} onToggleSave={e => toggleSave(job.id, e)}
                    hasApplied={appliedIds.has(job.id)} />
                ))}
              </div>
            )}

            {/* Alert banner */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              style={{ marginTop: 44, background: 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(79,70,229,0.07))', border: '1px solid rgba(124,58,237,0.22)', borderRadius: 20, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bell size={22} color="#fff" /></div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <h3 style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--text)', marginBottom: 3 }}>ðŸ”” Get Job Alerts</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Be first to know about new jobs matching your profile.</p>
              </div>
              {alertSent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontWeight: 700, fontSize: 14 }}><CheckCircle size={18} /> Subscribed!</div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <input className="inp" placeholder="Your email…" value={alertEmail} onChange={e => setAlertEmail(e.target.value)} style={{ minWidth: 200 }} />
                  <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={() => alertEmail && setAlertSent(true)}>Subscribe</button>
                </div>
              )}
            </motion.div>

            {/* Trending skills */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} style={{ marginTop: 36 }}>
              <h3 style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="var(--accent)" /> Trending Skills in Tamil Nadu
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                {[{ skill: 'React', count: 342, color: '#61dafb' }, { skill: 'TypeScript', count: 312, color: '#3178c6' }, { skill: 'Python', count: 289, color: '#3776ab' }, { skill: 'AWS', count: 267, color: '#ff9900' }, { skill: 'Node.js', count: 234, color: '#68a063' }, { skill: 'Machine Learning', count: 198, color: '#f59e0b' }, { skill: 'Kubernetes', count: 176, color: '#326ce5' }, { skill: 'Go', count: 143, color: '#00add8' }, { skill: 'Terraform', count: 112, color: '#623ce4' }, { skill: 'Figma', count: 129, color: '#f24e1e' }, { skill: 'Kotlin', count: 98, color: '#7f52ff' }, { skill: 'Swift', count: 87, color: '#f05138' }].map(s => (
                  <button key={s.skill} onClick={() => { setQ(s.skill); setTab('jobs'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 10, border: `1.5px solid ${s.color}30`, background: `${s.color}10`, cursor: 'pointer', transition: 'border-color 0.18s' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: s.color }}>{s.skill}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 99 }}>{s.count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* â”€â”€ DRAWER â”€â”€ */}
      <AnimatePresence>
        {activeJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveJob(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
            <JobDrawer job={activeJob} onClose={() => setActiveJob(null)}
              onApply={() => {
                if ((activeJob as any)._portal) { setPortalApplyJob(activeJob); setActiveJob(null); }
                else { setApplyJob(activeJob); setActiveJob(null); }
              }}
              saved={savedIds.has(activeJob.id)} onToggleSave={() => toggleSave(activeJob.id)}
              hasApplied={appliedIds.has(activeJob.id)} />
          </>
        )}
      </AnimatePresence>

      {/* Standard job apply modal */}
      <AnimatePresence>
        {applyJob && (
          <ApplyModal job={applyJob} onClose={() => setApplyJob(null)}
            onSuccess={app => { handleApplySuccess(app); setApplyJob(null); }}
            token={token} user={user} />
        )}
      </AnimatePresence>

      {/* Portal job apply modal â†’ saves to localStorage */}
      <PortalApplyModal
        open={!!portalApplyJob}
        onClose={() => setPortalApplyJob(null)}
        onSuccess={() => setAppliedIds(prev => new Set([...prev, portalApplyJob?.id ?? 0]))}
        type="job"
        itemId={portalApplyJob?.id ?? 0}
        itemTitle={portalApplyJob?.title ?? ''}
        itemCompany={portalApplyJob?.company ?? ''}
        itemAuthor={(portalApplyJob as any)?._author || portalApplyJob?.company || 'admin'}
        color="#10b981"
      />
    </div>
  );
}

