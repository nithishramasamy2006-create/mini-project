import { useState, useMemo, useEffect, useCallback } from 'react';
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

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Static Job Data
// ─────────────────────────────────────────────────────────────
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
    description: "Build OLA driver and rider apps in Swift/SwiftUI for 150M users across 100+ cities. Solve real-time mapping, ride-matching and payment challenges at scale.",
    responsibilities: ['Build new SwiftUI features for rider app', 'Optimize map rendering performance', 'Integrate third-party SDKs (Maps, Payments)', 'Conduct code reviews', 'Write UI tests with XCTest'],
    perks: ['Cab Credits', 'ESOPs', 'Health Cover', 'Mac & iPhone for work', 'Team Retreats'],
    openings: 6, applicants: 253, views: 1020, featured: false, urgent: false, verified: true, rating: 4.1, employees: '5,000+', industry: 'Mobility'
  },
];

const CATEGORIES = ['All', 'Engineering', 'Data & AI', 'Design', 'Product', 'Mobile', 'Cloud', 'Security'];
const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Remote', 'Hybrid', 'Contract'];
const EXPERIENCES = ['All Levels', '0–2 yrs', '1–3 yrs', '1–4 yrs', '2–4 yrs', '2–5 yrs', '3–6 yrs', '5–8 yrs'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending:     { label: 'Under Review',  color: '#f59e0b', bg: '#f59e0b18', icon: '⏳' },
  reviewed:    { label: 'Reviewed',      color: '#3b82f6', bg: '#3b82f618', icon: '👁️' },
  shortlisted: { label: 'Shortlisted',   color: '#8b5cf6', bg: '#8b5cf618', icon: '⭐' },
  interview:   { label: 'Interview',     color: '#06b6d4', bg: '#06b6d418', icon: '📅' },
  hired:       { label: 'Hired 🎉',      color: '#10b981', bg: '#10b98118', icon: '🎉' },
  accepted:    { label: 'Accepted 🎉',   color: '#10b981', bg: '#10b98118', icon: '✅' },
  rejected:    { label: 'Not Selected',  color: '#ef4444', bg: '#ef444418', icon: '❌' },
};

// ─────────────────────────────────────────────────────────────
// Apply Modal — Full Form connected to backend
// ─────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess, token, user }: {
  job: Job; onClose: () => void; onSuccess: (app: ApplicationRecord) => void;
  token: string | null; user: any;
}) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedApp, setSavedApp] = useState<ApplicationRecord | null>(null);

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

  return (
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
                      {i < step ? '✓' : i + 1}
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
                  {[['Application ID', savedApp._id?.slice(-8).toUpperCase()], ['Status', 'Under Review ⏳'], ['Company', job.company], ['Role', job.title]].map(([k, v]) => (
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
                        {job.skills.map(sk => (
                          <span key={sk} style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 11px', borderRadius: 99, background: `${job.color}15`, color: job.color, border: `1px solid ${job.color}30` }}>{sk}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 4 }}>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>← Back</button>
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
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← Back</button>
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
    </div>
  );
}

// Small icon component to avoid import issues
function BookIcon() {
  return <FileText size={13} />;
}

// ─────────────────────────────────────────────────────────────
// My Applications Dashboard Tab
// ─────────────────────────────────────────────────────────────
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
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
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
          { label: 'Total Applied', val: apps.length, color: '#7c3aed', icon: '📋' },
          { label: 'Shortlisted', val: apps.filter(a => a.status === 'shortlisted').length, color: '#8b5cf6', icon: '⭐' },
          { label: 'Interviews', val: apps.filter(a => a.status === 'interview').length, color: '#06b6d4', icon: '📅' },
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
          <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
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
                    { label: 'Resume', val: app.resumeLink ? <a href={app.resumeLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>View Resume →</a> : 'Not provided', icon: <FileText size={11} /> },
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
                          {isActive && !isRejected && '✓'}
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

// ─────────────────────────────────────────────────────────────
// Job Detail Drawer
// ─────────────────────────────────────────────────────────────
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
              {job.urgent && <span style={{ fontSize: 10, fontWeight: 700, background: '#ef444418', color: '#ef4444', padding: '2px 8px', borderRadius: 99 }}>🔥 URGENT</span>}
              {job.featured && <span style={{ fontSize: 10, fontWeight: 700, background: '#f59e0b18', color: '#f59e0b', padding: '2px 8px', borderRadius: 99 }}>⭐ FEATURED</span>}
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
          {[{ icon: <Users size={14} />, val: job.applicants.toLocaleString(), label: 'Applicants' }, { icon: <Eye size={14} />, val: job.views.toLocaleString(), label: 'Views' }, { icon: <Star size={14} />, val: job.rating.toFixed(1), label: 'Rating' }].map((s, i) => (
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
            {job.skills.map(sk => <span key={sk} style={{ fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: `${job.color}15`, color: job.color, border: `1px solid ${job.color}30` }}>{sk}</span>)}
          </div>
        </section>

        <section style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 8 }}>Perks & Benefits</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {job.perks.map(p => <span key={p} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 99, background: 'var(--surface-2)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>✅ {p}</span>)}
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

// ─────────────────────────────────────────────────────────────
// Job Card
// ─────────────────────────────────────────────────────────────
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
                {job.urgent && <span style={{ fontSize: 9.5, fontWeight: 700, background: '#ef444420', color: '#ef4444', padding: '2px 7px', borderRadius: 99 }}>🔥 URGENT</span>}
                {job.featured && <span style={{ fontSize: 9.5, fontWeight: 700, background: '#f59e0b18', color: '#f59e0b', padding: '2px 7px', borderRadius: 99 }}>⭐ Featured</span>}
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
            {job.skills.slice(0, 4).map(sk => (
              <span key={sk} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: `${job.color}12`, color: job.color, border: `1px solid ${job.color}25` }}>{sk}</span>
            ))}
            {job.skills.length > 4 && <span style={{ fontSize: 11, color: 'var(--text-3)', padding: '3px 6px' }}>+{job.skills.length - 4}</span>}
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

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
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

      {/* ── HERO ── */}
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

        {/* ── MAIN TABS ── */}
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

        {/* ── APPLICATIONS PANEL ── */}
        {tab === 'applications' && <MyApplications token={token} />}

        {/* ── JOBS / SAVED PANEL ── */}
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
                  <SlidersHorizontal size={14} /> Filters {showFilters ? '▲' : '▼'}
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
                  <ClipboardList size={12} /> {appliedIds.size} application{appliedIds.size > 1 ? 's' : ''} → Track
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
                <h3 style={{ fontWeight: 800, fontSize: 15.5, color: 'var(--text)', marginBottom: 3 }}>🔔 Get Job Alerts</h3>
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

      {/* ── DRAWER ── */}
      <AnimatePresence>
        {activeJob && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveJob(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 999 }} />
            <JobDrawer job={activeJob} onClose={() => setActiveJob(null)}
              onApply={() => { setApplyJob(activeJob); setActiveJob(null); }}
              saved={savedIds.has(activeJob.id)} onToggleSave={() => toggleSave(activeJob.id)}
              hasApplied={appliedIds.has(activeJob.id)} />
          </>
        )}
      </AnimatePresence>

      {/* ── APPLY MODAL ── */}
      <AnimatePresence>
        {applyJob && (
          <ApplyModal job={applyJob} onClose={() => setApplyJob(null)}
            onSuccess={app => { handleApplySuccess(app); setApplyJob(null); }}
            token={token} user={user} />
        )}
      </AnimatePresence>
    </div>
  );
}
