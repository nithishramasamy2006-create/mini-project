import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Eye, Plus, Trash2, Check,
  Star, Award, Briefcase, GraduationCap, Code, Globe,
  ChevronDown, ChevronUp, Sparkles, RefreshCw, Copy, Printer,
  CheckCircle, Shield, Layers, Layout, Save, Sparkle
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { getCertificatesForStudent } from '../certificateData';

// ── Types ─────────────────────────────────────────────────────────────────
export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  location: string;
  points: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  gpa: string;
  honors: string;
}

export interface Project {
  id: number;
  name: string;
  tech: string;
  link: string;
  desc: string;
}

export interface Cert {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Lang {
  id: number;
  lang: string;
  level: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Cert[];
  languages: Lang[];
}

// ── 8 Rich Templates with Diverse Styles & Layouts ────────────────────────
export interface ResumeTemplate {
  id: string;
  label: string;
  category: 'Modern' | 'Executive' | 'Creative' | 'ATS Minimal' | 'Academic' | 'Tech';
  badge: string;
  color: string;
  accentBg: string;
  headerBg: string;
  headerText: string;
  fontFamily: string;
  headingFont: string;
  layout: 'single' | 'split-left';
  desc: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern-indigo',
    label: 'Modern Indigo',
    category: 'Modern',
    badge: 'Popular',
    color: '#6366f1',
    accentBg: '#eef2ff',
    headerBg: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #6366f1 100%)',
    headerText: '#ffffff',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    layout: 'single',
    desc: 'Vibrant indigo header with pill skill chips and clean timelines',
  },
  {
    id: 'classic-slate',
    label: 'Executive Slate',
    category: 'Executive',
    badge: 'Corporate',
    color: '#0f172a',
    accentBg: '#f1f5f9',
    headerBg: 'linear-gradient(135deg, #020617 0%, #0f172a 60%, #1e293b 100%)',
    headerText: '#ffffff',
    fontFamily: "'Georgia', serif",
    headingFont: "'Arial', sans-serif",
    layout: 'single',
    desc: 'Prestigious corporate dark banner with serif body and refined dividers',
  },
  {
    id: 'creative-emerald',
    label: 'Creative Emerald',
    category: 'Creative',
    badge: 'Trending',
    color: '#059669',
    accentBg: '#ecfdf5',
    headerBg: 'linear-gradient(135deg, #064e3b 0%, #059669 60%, #10b981 100%)',
    headerText: '#ffffff',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    layout: 'single',
    desc: 'Fresh emerald palette with rounded cards and modern typography',
  },
  {
    id: 'tech-cyan',
    label: 'Silicon Valley Tech',
    category: 'Tech',
    badge: 'Developer',
    color: '#0284c7',
    accentBg: '#f0f9ff',
    headerBg: 'linear-gradient(135deg, #082f49 0%, #0369a1 50%, #0ea5e9 100%)',
    headerText: '#ffffff',
    fontFamily: "'Inter', monospace, sans-serif",
    headingFont: "'Inter', sans-serif",
    layout: 'single',
    desc: 'Engineered for full-stack, DevOps, and AI roles with code-styled badges',
  },
  {
    id: 'academic-navy',
    label: 'Academic Gold & Navy',
    category: 'Academic',
    badge: 'Scholar',
    color: '#1e3a8a',
    accentBg: '#fef3c7',
    headerBg: 'linear-gradient(135deg, #172554 0%, #1e3a8a 60%, #2563eb 100%)',
    headerText: '#ffffff',
    fontFamily: "'Georgia', serif",
    headingFont: "'Georgia', serif",
    layout: 'single',
    desc: 'Formal university layout with gold accents for research and master applications',
  },
  {
    id: 'nordic-minimal',
    label: 'Nordic Clean ATS',
    category: 'ATS Minimal',
    badge: '100% ATS',
    color: '#27272a',
    accentBg: '#f4f4f5',
    headerBg: '#ffffff',
    headerText: '#18181b',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    layout: 'single',
    desc: 'Ultra-clean monochrome format engineered for automated scanner parsing',
  },
  {
    id: 'ruby-executive',
    label: 'Ruby Executive',
    category: 'Executive',
    badge: 'Leadership',
    color: '#e11d48',
    accentBg: '#fff1f2',
    headerBg: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)',
    headerText: '#ffffff',
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Georgia', serif",
    layout: 'single',
    desc: 'High-contrast burgundy palette with structured milestone bullets',
  },
  {
    id: 'split-sidebar',
    label: 'Split Sidebar Pro',
    category: 'Modern',
    badge: 'Two-Column',
    color: '#7c3aed',
    accentBg: '#f5f3ff',
    headerBg: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)',
    headerText: '#ffffff',
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
    layout: 'split-left',
    desc: 'Modern dual-column layout with skills & contact on left, experience on right',
  },
];

// ── Default student data ──────────────────────────────────────────────────
export const DEFAULT_RESUME: ResumeData = {
  name: 'Nithish Ramasamy',
  title: 'Full Stack Developer & AI Engineer · NaanMudhalvan Scholar',
  email: 'nithish@example.com',
  phone: '+91 98765 43210',
  location: 'Chennai, Tamil Nadu, India',
  linkedin: 'linkedin.com/in/nithish-ramasamy',
  github: 'github.com/nithishramasamy',
  website: 'nithish.dev',
  summary:
    'Dedicated B.Tech IT student with extensive hands-on experience in modern web architecture (React, Node.js, TypeScript) and applied Machine Learning through the NaanMudhalvan Learning Marketplace. Passionate about designing robust, scalable digital platforms and solving industry challenges.',
  skills: [
    'React', 'Node.js', 'TypeScript', 'JavaScript (ES6+)',
    'Python', 'Machine Learning', 'Express.js', 'MongoDB',
    'PostgreSQL', 'Tailwind CSS', 'RESTful APIs', 'Git & GitHub', 'Docker'
  ],
  experience: [
    {
      id: 1,
      role: 'Full Stack Development Intern',
      company: 'NaanMudhalvan Tech Incubator',
      duration: 'Jun 2025 – Aug 2025',
      location: 'Chennai, TN',
      points: [
        'Architected and deployed responsive web modules serving over 2,500 active student users.',
        'Engineered secure JWT authentication and optimized MongoDB aggregation pipelines for 35% faster queries.',
        'Integrated automated certificate verification systems with real-time PDF generation.'
      ],
    },
    {
      id: 2,
      role: 'Frontend Engineering Contributor',
      company: 'Open Source Community Project',
      duration: 'Jan 2025 – May 2025',
      location: 'Remote',
      points: [
        'Contributed 12+ PRs enhancing accessibility (a11y) and keyboard navigation across core dashboards.',
        'Implemented lazy loading and performance profiling that boosted Lighthouse score from 74 to 98.'
      ],
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.Tech Information Technology',
      institution: 'Anna University Affiliated College',
      year: '2022 – 2026',
      gpa: '8.65 CGPA',
      honors: 'First Class with Distinction · NaanMudhalvan Merit Scholar',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'NaanMudhalvan Learning Marketplace',
      tech: 'React, Node.js, Express, MongoDB, YouTube Embed API',
      link: 'github.com/nithish/nm-learning-marketplace',
      desc: 'Full-featured edtech portal with dual-stream interactive video lectures, automated quizzes, and verifiable tamper-proof certificates.',
    },
    {
      id: 2,
      name: 'AI Crop Disease Detection & Advisory',
      tech: 'Python, TensorFlow, Flask, React Native',
      link: 'github.com/nithish/ai-crop-diagnosis',
      desc: 'Deep learning CNN classifier diagnosing 18 crop diseases with 94.2% accuracy, deployed with instant remedial guidance for local farmers.',
    },
  ],
  certifications: [
    {
      id: 1,
      name: 'Full Stack Web Development with React & Node.js',
      issuer: 'NaanMudhalvan Learning Marketplace',
      date: 'Aug 2025',
      credentialId: 'NM-CRS-101-94821',
    },
    {
      id: 2,
      name: 'Machine Learning & Python Specialization',
      issuer: 'Govt. of Tamil Nadu · NaanMudhalvan',
      date: 'May 2025',
      credentialId: 'NM-EVT-77291-TN',
    },
  ],
  languages: [
    { id: 1, lang: 'Tamil', level: 'Native / Bilingual' },
    { id: 2, lang: 'English', level: 'Professional Working Proficiency' },
  ],
};

// ── ATS Score Calculator ──────────────────────────────────────────────────
export function calculateATSScore(r: ResumeData) {
  const tips: string[] = [];
  let score = 0;

  if (r.name.trim()) score += 10; else tips.push('Add your full name');
  if (r.email.trim() && r.email.includes('@')) score += 8; else tips.push('Add a valid professional email');
  if (r.phone.trim()) score += 7; else tips.push('Add contact phone number');
  if (r.summary.length >= 100) score += 15; else tips.push('Expand professional summary (aim for 100+ characters)');
  if (r.skills.length >= 8) score += 15; else tips.push('Add at least 8 relevant technical skills');
  if (r.experience.length >= 1) score += 15; else tips.push('Include at least 1 internship or work experience');
  if (r.experience.some(e => e.points.filter(Boolean).length >= 2)) score += 10; else tips.push('Add achievement bullet points for work experience');
  if (r.education.length >= 1) score += 10; else tips.push('Add your college education and degree');
  if (r.projects.length >= 2) score += 10; else tips.push('Showcase at least 2 key projects with tech stack');

  return { score: Math.min(100, score), tips };
}

// ── Print Helper ──────────────────────────────────────────────────────────
export function printResumeWindow(htmlContent: string, resumeName: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${resumeName} — Resume</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            color: #1e293b;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          @media print {
            body { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          setTimeout(() => { window.print(); }, 400);
        </script>
      </body>
    </html>
  `);
  win.document.close();
}

// ── Resume Preview Component ──────────────────────────────────────────────
export function ResumeDocumentPreview({
  r,
  templateId,
}: {
  r: ResumeData;
  templateId: string;
}) {
  const tmpl = RESUME_TEMPLATES.find(t => t.id === templateId) || RESUME_TEMPLATES[0];
  const accent = tmpl.color;

  const isMinimal = tmpl.id === 'nordic-minimal';
  const isSplit = tmpl.layout === 'split-left';

  // Section header component
  const SectionHeading = ({ title, icon }: { title: string; icon?: string }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        borderBottom: isMinimal ? '1px solid #18181b' : `2px solid ${accent}`,
        paddingBottom: 4,
        marginBottom: 8,
        marginTop: 12,
      }}
    >
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      <span
        style={{
          fontSize: 10,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: isMinimal ? '#18181b' : accent,
          fontFamily: tmpl.headingFont,
        }}
      >
        {title}
      </span>
    </div>
  );

  if (isSplit) {
    return (
      <div
        id="resume-print-card"
        style={{
          background: '#ffffff',
          color: '#1e293b',
          fontFamily: tmpl.fontFamily,
          fontSize: 10.5,
          lineHeight: 1.55,
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          minHeight: 842,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* Left Sidebar */}
        <div
          style={{
            background: '#0f172a',
            color: '#f8fafc',
            padding: '24px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Avatar / Initials */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                margin: '0 auto 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 900,
                color: '#fff',
                border: '3px solid rgba(255,255,255,0.2)',
              }}
            >
              {(r.name || 'N').charAt(0)}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              {r.name || 'Your Name'}
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{r.title}</div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', marginBottom: 8 }}>
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 9.5, color: '#cbd5e1' }}>
              {r.email && <div>✉ {r.email}</div>}
              {r.phone && <div>📞 {r.phone}</div>}
              {r.location && <div>📍 {r.location}</div>}
              {r.linkedin && <div>🔗 {r.linkedin}</div>}
              {r.github && <div>⌨ {r.github}</div>}
              {r.website && <div>🌐 {r.website}</div>}
            </div>
          </div>

          {/* Skills */}
          {r.skills.length > 0 && (
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', marginBottom: 8 }}>
                Technical Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {r.skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 8.5,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.08)',
                      color: '#e2e8f0',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education in sidebar */}
          {r.education.length > 0 && (
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', marginBottom: 8 }}>
                Education
              </div>
              {r.education.map(e => (
                <div key={e.id} style={{ marginBottom: 8, fontSize: 9.5 }}>
                  <strong style={{ color: '#fff', display: 'block' }}>{e.degree}</strong>
                  <div style={{ color: '#94a3b8' }}>{e.institution}</div>
                  <div style={{ color: '#64748b', fontSize: 9 }}>{e.year} · {e.gpa}</div>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {r.languages.length > 0 && (
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', marginBottom: 8 }}>
                Languages
              </div>
              {r.languages.map(l => (
                <div key={l.id} style={{ fontSize: 9.5, color: '#cbd5e1', marginBottom: 2 }}>
                  {l.lang} <span style={{ color: '#94a3b8', fontSize: 8.5 }}>({l.level})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Main Column */}
        <div style={{ padding: '24px 26px', background: '#ffffff' }}>
          {/* Summary */}
          {r.summary && (
            <div>
              <SectionHeading title="Executive Summary" />
              <p style={{ fontSize: 10, color: '#334155', margin: 0, lineHeight: 1.65 }}>
                {r.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {r.experience.length > 0 && (
            <div>
              <SectionHeading title="Professional Experience" icon="💼" />
              {r.experience.map(e => (
                <div key={e.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <strong style={{ fontSize: 11, color: '#0f172a' }}>{e.role}</strong>
                    <span style={{ fontSize: 9.5, color: '#64748b' }}>{e.duration}</span>
                  </div>
                  <div style={{ fontSize: 10, color: accent, fontWeight: 600, marginBottom: 4 }}>
                    {e.company}{e.location ? ` · ${e.location}` : ''}
                  </div>
                  <ul style={{ margin: '3px 0 0 16px', padding: 0 }}>
                    {e.points.filter(Boolean).map((p, i) => (
                      <li key={i} style={{ fontSize: 9.5, color: '#334155', marginBottom: 2.5 }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {r.projects.length > 0 && (
            <div>
              <SectionHeading title="Featured Projects" icon="🚀" />
              {r.projects.map(p => (
                <div key={p.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <strong style={{ fontSize: 10.5, color: '#0f172a' }}>{p.name}</strong>
                    {p.link && <span style={{ fontSize: 9, color: accent }}>{p.link}</span>}
                  </div>
                  {p.tech && <div style={{ fontSize: 9, color: '#64748b', fontStyle: 'italic', marginBottom: 2 }}>{p.tech}</div>}
                  {p.desc && <div style={{ fontSize: 9.5, color: '#334155' }}>{p.desc}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {r.certifications.length > 0 && (
            <div>
              <SectionHeading title="Verified Credentials" icon="🏅" />
              {r.certifications.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, flexWrap: 'wrap', gap: 4, fontSize: 9.5 }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                  <span style={{ color: '#64748b' }}>{c.issuer} {c.date ? `· ${c.date}` : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Standard Single Column Layout
  return (
    <div
      id="resume-print-card"
      style={{
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: tmpl.fontFamily,
        fontSize: 10.5,
        lineHeight: 1.55,
        minHeight: 842,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          background: tmpl.headerBg,
          padding: isMinimal ? '20px 24px 12px' : '22px 26px',
          color: tmpl.headerText,
          borderBottom: isMinimal ? '2px solid #18181b' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                fontFamily: tmpl.headingFont,
                color: isMinimal ? '#18181b' : '#ffffff',
              }}
            >
              {r.name || 'Your Name'}
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                opacity: isMinimal ? 0.75 : 0.88,
                marginTop: 3,
                color: isMinimal ? '#52525b' : '#ffffff',
              }}
            >
              {r.title}
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 6,
              background: isMinimal ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.14)',
              fontSize: 9.5,
              fontWeight: 700,
              color: isMinimal ? '#18181b' : '#ffffff',
            }}
          >
            <Shield size={11} /> Verified NM Profile
          </div>
        </div>

        {/* Contact Strip */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 10,
            flexWrap: 'wrap',
            fontSize: 9.5,
            opacity: isMinimal ? 0.85 : 0.92,
            color: isMinimal ? '#27272a' : '#ffffff',
          }}
        >
          {r.email && <span>✉ {r.email}</span>}
          {r.phone && <span>📞 {r.phone}</span>}
          {r.location && <span>📍 {r.location}</span>}
          {r.linkedin && <span>🔗 {r.linkedin}</span>}
          {r.github && <span>⌨ {r.github}</span>}
          {r.website && <span>🌐 {r.website}</span>}
        </div>
      </div>

      {/* Main Body */}
      <div style={{ padding: '16px 26px 24px' }}>
        {/* Professional Summary */}
        {r.summary && (
          <div>
            <SectionHeading title="Professional Summary" icon="★" />
            <p style={{ fontSize: 10, color: '#374151', margin: 0, lineHeight: 1.65 }}>
              {r.summary}
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {r.skills.length > 0 && (
          <div>
            <SectionHeading title="Technical & Core Skills" icon="⚙" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {r.skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: isMinimal ? 3 : 99,
                    background: isMinimal ? '#f4f4f5' : `${accent}14`,
                    color: isMinimal ? '#18181b' : accent,
                    border: `1px solid ${isMinimal ? '#e4e4e7' : `${accent}30`}`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work / Internship Experience */}
        {r.experience.length > 0 && (
          <div>
            <SectionHeading title="Work & Internship Experience" icon="💼" />
            {r.experience.map(e => (
              <div key={e.id} style={{ marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <strong style={{ fontSize: 11, color: '#0f172a' }}>{e.role}</strong>
                  <span style={{ fontSize: 9.5, color: '#64748b' }}>{e.duration}</span>
                </div>
                <div style={{ fontSize: 10, color: accent, fontWeight: 600, marginBottom: 3 }}>
                  {e.company}{e.location ? ` · ${e.location}` : ''}
                </div>
                <ul style={{ margin: '3px 0 0 16px', padding: 0 }}>
                  {e.points.filter(Boolean).map((p, i) => (
                    <li key={i} style={{ fontSize: 10, color: '#374151', marginBottom: 2 }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Key Projects */}
        {r.projects.length > 0 && (
          <div>
            <SectionHeading title="Key Engineering Projects" icon="🚀" />
            {r.projects.map(p => (
              <div key={p.id} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <strong style={{ fontSize: 10.5, color: '#0f172a' }}>{p.name}</strong>
                  {p.link && <span style={{ fontSize: 9.5, color: accent }}>{p.link}</span>}
                </div>
                {p.tech && <div style={{ fontSize: 9, color: '#64748b', fontStyle: 'italic', marginBottom: 2 }}>{p.tech}</div>}
                {p.desc && <div style={{ fontSize: 10, color: '#374151' }}>{p.desc}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {r.education.length > 0 && (
          <div>
            <SectionHeading title="Academic Education" icon="🎓" />
            {r.education.map(e => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <strong style={{ fontSize: 10.5, color: '#0f172a' }}>{e.degree}</strong>
                  <span style={{ fontSize: 9.5, color: '#64748b' }}>{e.year}</span>
                </div>
                <div style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{e.institution}</div>
                {(e.gpa || e.honors) && (
                  <div style={{ fontSize: 9.5, color: '#64748b' }}>
                    {e.gpa}{e.honors ? ` · ${e.honors}` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {r.certifications.length > 0 && (
          <div>
            <SectionHeading title="Verified Certifications & Credentials" icon="🏅" />
            {r.certifications.map(c => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 4,
                  flexWrap: 'wrap',
                  gap: 4,
                  fontSize: 10,
                }}
              >
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                <span style={{ fontSize: 9, color: '#64748b' }}>
                  {c.issuer}{c.date ? ` · ${c.date}` : ''}
                  {c.credentialId ? ` (${c.credentialId})` : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {r.languages.length > 0 && (
          <div>
            <SectionHeading title="Languages" icon="🗣" />
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {r.languages.map(l => (
                <span key={l.id} style={{ fontSize: 10, color: '#374151' }}>
                  <strong>{l.lang}</strong> ({l.level})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Accordion helper ──────────────────────────────────────────────────────
function AccordionSection({
  title,
  icon,
  active,
  toggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  active: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 10, borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--surface)' }}>
      <button
        onClick={toggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 16px', background: active ? 'rgba(124,58,237,0.06)' : 'none',
          border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
          color: 'var(--text)', textAlign: 'left',
        }}
      >
        <span style={{ color: '#7c3aed' }}>{icon}</span>
        {title}
        <span style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>
          {active ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Student Resume Builder Component ─────────────────────────────────
export default function StudentResumeBuilder({
  initialStudentName,
  embeddedInPortal = true,
}: {
  initialStudentName?: string;
  embeddedInPortal?: boolean;
}) {
  const { user } = useAuth();
  const studentName = initialStudentName || user?.name || 'Nithish Ramasamy';

  // Read saved resume from localStorage or fallback to default
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(`nm_resume_${studentName.toLowerCase().replace(/\s+/g, '_')}`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {
      ...DEFAULT_RESUME,
      name: user?.name || studentName,
      email: user?.email || DEFAULT_RESUME.email,
    };
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-indigo');
  const [activeSection, setActiveSection] = useState<string | null>('basics');
  const [skillInput, setSkillInput] = useState('');
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const printAreaRef = useRef<HTMLDivElement>(null);
  const { score, tips } = useMemo(() => calculateATSScore(resume), [resume]);

  // Sync certifications earned in system
  useEffect(() => {
    try {
      const earned = getCertificatesForStudent(studentName);
      if (earned && earned.length > 0) {
        setResume(prev => {
          const existingIds = new Set(prev.certifications.map(c => c.name));
          const newCerts = earned
            .filter(e => !existingIds.has(e.eventTitle))
            .map((e, idx) => ({
              id: Date.now() + idx,
              name: e.eventTitle,
              issuer: e.issuer,
              date: e.issueDate,
              credentialId: e.credentialId,
            }));
          if (newCerts.length > 0) {
            return {
              ...prev,
              certifications: [...prev.certifications, ...newCerts],
            };
          }
          return prev;
        });
      }
    } catch { /* ignore */ }
  }, [studentName]);

  // Save to localStorage
  const handleSave = () => {
    try {
      localStorage.setItem(`nm_resume_${studentName.toLowerCase().replace(/\s+/g, '_')}`, JSON.stringify(resume));
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch { /* ignore */ }
  };

  // 1-Click Print & PDF
  const handleDownloadPDF = () => {
    const el = document.getElementById('resume-print-card');
    if (!el) return;
    printResumeWindow(el.outerHTML, resume.name || 'Resume');
  };

  // AI Autofill from student profile
  const handleAutofill = () => {
    setResume(prev => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
      phone: (user as any)?.phone || prev.phone,
      title: `${(user as any)?.branch || 'IT'} Student · NaanMudhalvan Scholar`,
      summary: `Motivated ${(user as any)?.branch || 'Information Technology'} student at ${(user as any)?.college || 'Bannari Amman Institute of Technology'} with demonstrated project expertise through NaanMudhalvan. Passionate about software development, algorithms, and real-world impact.`,
      skills: Array.from(new Set([...prev.skills, 'React', 'JavaScript', 'Node.js', 'Python', 'Git', 'SQL', 'Problem Solving'])),
    }));
    handleSave();
  };

  // Helper updates
  const updField = (k: keyof ResumeData, v: any) => setResume(prev => ({ ...prev, [k]: v }));
  const toggleSec = (id: string) => setActiveSection(s => s === id ? null : id);

  // Skill management
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !resume.skills.includes(s)) {
      updField('skills', [...resume.skills, s]);
      setSkillInput('');
    }
  };
  const removeSkill = (s: string) => updField('skills', resume.skills.filter(x => x !== s));

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return RESUME_TEMPLATES;
    return RESUME_TEMPLATES.filter(t => t.category.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [categoryFilter]);

  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ width: '100%' }}>
      {/* Top Banner / Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
          padding: '20px 22px',
          borderRadius: 18,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.06) 100%)',
          border: '1px solid rgba(124,58,237,0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>📄</span>
            <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', margin: 0 }}>
              AI Resume Studio &amp; Template Gallery
            </h2>
            <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 99, background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>
              8 ATS Templates
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: 0 }}>
            Choose from corporate, tech, academic, and creative resume templates · Live ATS scoring · 1-click PDF export
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleAutofill}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 15px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Sparkles size={14} color="#a78bfa" /> AI Autofill
          </button>
          <button
            onClick={handleSave}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10,
              background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
              fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Save size={14} /> {saveToast ? 'Saved!' : 'Save Resume'}
          </button>
          <button
            onClick={() => setFullPreviewOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10,
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa',
              fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
            }}
          >
            <Eye size={14} /> Full View
          </button>
          <button
            onClick={handleDownloadPDF}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
            }}
          >
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* ── TEMPLATE SELECTION GALLERY ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layout size={16} color="#7c3aed" />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)' }}>
              Select Resume Design Template
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['all', 'Modern', 'Executive', 'Tech', 'Academic', 'ATS Minimal'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  border: categoryFilter === cat ? '1px solid #7c3aed' : '1px solid var(--border)',
                  background: categoryFilter === cat ? 'rgba(124,58,237,0.15)' : 'var(--bg-2)',
                  color: categoryFilter === cat ? '#a78bfa' : 'var(--text-3)',
                }}
              >
                {cat === 'all' ? 'All (8)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: 12,
          }}
        >
          {filteredTemplates.map(tmpl => {
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                style={{
                  borderRadius: 14,
                  border: isSelected ? '2px solid #7c3aed' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(124,58,237,0.06)' : 'var(--surface)',
                  padding: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                  boxShadow: isSelected ? '0 4px 18px rgba(124,58,237,0.2)' : 'none',
                }}
              >
                {/* Header Preview Strip */}
                <div
                  style={{
                    height: 48,
                    borderRadius: 8,
                    background: tmpl.headerBg,
                    border: '1px solid rgba(0,0,0,0.1)',
                    marginBottom: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ width: '40%', height: 4, borderRadius: 2, background: tmpl.headerText, opacity: 0.8 }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ width: '25%', height: 3, borderRadius: 2, background: tmpl.headerText, opacity: 0.5 }} />
                    <div style={{ width: '20%', height: 3, borderRadius: 2, background: tmpl.headerText, opacity: 0.5 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)' }}>
                    {tmpl.label}
                  </div>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 99,
                      background: `${tmpl.color}18`,
                      color: tmpl.color,
                    }}
                  >
                    {tmpl.badge}
                  </span>
                </div>

                <p style={{ fontSize: 11, color: 'var(--text-3)', margin: 0, lineHeight: 1.4 }}>
                  {tmpl.desc}
                </p>

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 10,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN WORKSPACE GRID: EDITOR (LEFT) + LIVE SCALED PREVIEW (RIGHT) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)',
          gap: 22,
          alignItems: 'start',
        }}
      >
        {/* ── LEFT: ACCORDION EDITORS ── */}
        <div>
          {/* ATS Score Meter Card */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 14,
              background: 'var(--surface)',
              border: `1.5px solid ${scoreColor}30`,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `${scoreColor}14`,
                border: `3px solid ${scoreColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 8.5, color: 'var(--text-3)' }}>ATS</span>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>
                  {score >= 80 ? 'ATS Score: Outstanding' : score >= 60 ? 'ATS Score: Good' : 'ATS Score: Action Recommended'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor }}>
                  ({score}% Optimized)
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                {tips.length === 0
                  ? 'All core sections, skills, and metrics meet top corporate hiring standards.'
                  : `Next recommendation: ${tips[0]}`}
              </div>
            </div>
          </div>

          {/* 1. Basic Info */}
          <AccordionSection
            title="Personal & Contact Information"
            icon={<FileText size={16} />}
            active={activeSection === 'basics'}
            toggle={() => toggleSec('basics')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Full Name</label>
                <input className="inp" value={resume.name} onChange={e => updField('name', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Professional Title / Headline</label>
                <input className="inp" value={resume.title} onChange={e => updField('title', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Email Address</label>
                <input className="inp" value={resume.email} onChange={e => updField('email', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Phone Number</label>
                <input className="inp" value={resume.phone} onChange={e => updField('phone', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Location</label>
                <input className="inp" value={resume.location} onChange={e => updField('location', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>LinkedIn URL</label>
                <input className="inp" value={resume.linkedin} onChange={e => updField('linkedin', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>GitHub URL</label>
                <input className="inp" value={resume.github} onChange={e => updField('github', e.target.value)} style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>Portfolio / Website</label>
                <input className="inp" value={resume.website} onChange={e => updField('website', e.target.value)} style={{ fontSize: 13 }} />
              </div>
            </div>
          </AccordionSection>

          {/* 2. Professional Summary */}
          <AccordionSection
            title="Professional Summary"
            icon={<Sparkles size={16} />}
            active={activeSection === 'summary'}
            toggle={() => toggleSec('summary')}
          >
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
              Brief Profile Pitch (2–3 impact sentences)
            </label>
            <textarea
              className="inp"
              rows={4}
              value={resume.summary}
              onChange={e => updField('summary', e.target.value)}
              style={{ fontSize: 13, resize: 'vertical', lineHeight: 1.6 }}
            />
          </AccordionSection>

          {/* 3. Skills */}
          <AccordionSection
            title="Technical & Core Skills"
            icon={<Code size={16} />}
            active={activeSection === 'skills'}
            toggle={() => toggleSec('skills')}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                className="inp"
                placeholder="Add skill (e.g. Next.js, Docker, PyTorch)..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                style={{ fontSize: 13 }}
              />
              <button
                onClick={addSkill}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: 13 }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {resume.skills.map((s, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                    borderRadius: 99, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
                    color: '#a78bfa', fontSize: 12, fontWeight: 600,
                  }}
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 11 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </AccordionSection>

          {/* 4. Experience */}
          <AccordionSection
            title="Experience & Internships"
            icon={<Briefcase size={16} />}
            active={activeSection === 'exp'}
            toggle={() => toggleSec('exp')}
          >
            {resume.experience.map(e => (
              <div key={e.id} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-2)', marginBottom: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Role Entry</span>
                  <button
                    onClick={() => updField('experience', resume.experience.filter(x => x.id !== e.id))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    className="inp"
                    placeholder="Role Title (e.g. Frontend Developer Intern)"
                    value={e.role}
                    onChange={evt => updField('experience', resume.experience.map(x => x.id === e.id ? { ...x, role: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="Company / Organization"
                    value={e.company}
                    onChange={evt => updField('experience', resume.experience.map(x => x.id === e.id ? { ...x, company: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="Duration (e.g. Jun 2025 – Aug 2025)"
                    value={e.duration}
                    onChange={evt => updField('experience', resume.experience.map(x => x.id === e.id ? { ...x, duration: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="Location (e.g. Chennai, TN / Remote)"
                    value={e.location}
                    onChange={evt => updField('experience', resume.experience.map(x => x.id === e.id ? { ...x, location: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                    Achievement Bullet Points (1 per line)
                  </label>
                  <textarea
                    className="inp"
                    rows={3}
                    placeholder="Built responsive modules...&#10;Optimized database queries by 35%..."
                    value={e.points.join('\n')}
                    onChange={evt => updField('experience', resume.experience.map(x => x.id === e.id ? { ...x, points: evt.target.value.split('\n') } : x))}
                    style={{ fontSize: 12, resize: 'vertical' }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => updField('experience', [...resume.experience, { id: Date.now(), role: '', company: '', duration: '', location: '', points: [''] }])}
              style={{
                width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)',
                background: 'none', color: 'var(--text-3)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Plus size={14} /> Add Work / Internship Experience
            </button>
          </AccordionSection>

          {/* 5. Projects */}
          <AccordionSection
            title="Key Engineering Projects"
            icon={<GraduationCap size={16} />}
            active={activeSection === 'projects'}
            toggle={() => toggleSec('projects')}
          >
            {resume.projects.map(p => (
              <div key={p.id} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-2)', marginBottom: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Project Details</span>
                  <button
                    onClick={() => updField('projects', resume.projects.filter(x => x.id !== p.id))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    className="inp"
                    placeholder="Project Name"
                    value={p.name}
                    onChange={evt => updField('projects', resume.projects.map(x => x.id === p.id ? { ...x, name: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="Repo or Demo Link"
                    value={p.link}
                    onChange={evt => updField('projects', resume.projects.map(x => x.id === p.id ? { ...x, link: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <input
                    className="inp"
                    placeholder="Tech Stack Used (e.g. React, Node.js, MongoDB)"
                    value={p.tech}
                    onChange={evt => updField('projects', resume.projects.map(x => x.id === p.id ? { ...x, tech: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>
                <textarea
                  className="inp"
                  rows={2}
                  placeholder="One or two sentences describing impact and metrics..."
                  value={p.desc}
                  onChange={evt => updField('projects', resume.projects.map(x => x.id === p.id ? { ...x, desc: evt.target.value } : x))}
                  style={{ fontSize: 12, resize: 'vertical' }}
                />
              </div>
            ))}
            <button
              onClick={() => updField('projects', [...resume.projects, { id: Date.now(), name: '', tech: '', link: '', desc: '' }])}
              style={{
                width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)',
                background: 'none', color: 'var(--text-3)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Plus size={14} /> Add Engineering Project
            </button>
          </AccordionSection>

          {/* 6. Education */}
          <AccordionSection
            title="Academic Education"
            icon={<GraduationCap size={16} />}
            active={activeSection === 'edu'}
            toggle={() => toggleSec('edu')}
          >
            {resume.education.map(e => (
              <div key={e.id} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-2)', marginBottom: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Education</span>
                  <button
                    onClick={() => updField('education', resume.education.filter(x => x.id !== e.id))}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <input
                    className="inp"
                    placeholder="Degree (e.g. B.Tech IT)"
                    value={e.degree}
                    onChange={evt => updField('education', resume.education.map(x => x.id === e.id ? { ...x, degree: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="College / Institution Name"
                    value={e.institution}
                    onChange={evt => updField('education', resume.education.map(x => x.id === e.id ? { ...x, institution: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="Year (e.g. 2022 – 2026)"
                    value={e.year}
                    onChange={evt => updField('education', resume.education.map(x => x.id === e.id ? { ...x, year: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                  <input
                    className="inp"
                    placeholder="GPA / Marks (e.g. 8.65 CGPA)"
                    value={e.gpa}
                    onChange={evt => updField('education', resume.education.map(x => x.id === e.id ? { ...x, gpa: evt.target.value } : x))}
                    style={{ fontSize: 12.5 }}
                  />
                </div>
                <input
                  className="inp"
                  placeholder="Honors / Awards (e.g. NaanMudhalvan Scholar)"
                  value={e.honors}
                  onChange={evt => updField('education', resume.education.map(x => x.id === e.id ? { ...x, honors: evt.target.value } : x))}
                  style={{ fontSize: 12.5 }}
                />
              </div>
            ))}
            <button
              onClick={() => updField('education', [...resume.education, { id: Date.now(), degree: '', institution: '', year: '', gpa: '', honors: '' }])}
              style={{
                width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)',
                background: 'none', color: 'var(--text-3)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Plus size={14} /> Add Degree / College
            </button>
          </AccordionSection>

          {/* 7. Certifications */}
          <AccordionSection
            title="Certifications & Credentials"
            icon={<Award size={16} />}
            active={activeSection === 'certs'}
            toggle={() => toggleSec('certs')}
          >
            {resume.certifications.map(c => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 100px auto', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                <input
                  className="inp"
                  placeholder="Certificate Name"
                  value={c.name}
                  onChange={evt => updField('certifications', resume.certifications.map(x => x.id === c.id ? { ...x, name: evt.target.value } : x))}
                  style={{ fontSize: 12 }}
                />
                <input
                  className="inp"
                  placeholder="Issuing Body"
                  value={c.issuer}
                  onChange={evt => updField('certifications', resume.certifications.map(x => x.id === c.id ? { ...x, issuer: evt.target.value } : x))}
                  style={{ fontSize: 12 }}
                />
                <input
                  className="inp"
                  placeholder="Date"
                  value={c.date}
                  onChange={evt => updField('certifications', resume.certifications.map(x => x.id === c.id ? { ...x, date: evt.target.value } : x))}
                  style={{ fontSize: 12 }}
                />
                <button
                  onClick={() => updField('certifications', resume.certifications.filter(x => x.id !== c.id))}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button
              onClick={() => updField('certifications', [...resume.certifications, { id: Date.now(), name: '', issuer: '', date: '' }])}
              style={{
                width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)',
                background: 'none', color: 'var(--text-3)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Plus size={14} /> Add Certification
            </button>
          </AccordionSection>
        </div>

        {/* ── RIGHT: LIVE SCALED PREVIEW PANEL ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              padding: '8px 12px',
              borderRadius: 12,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>
                Live Preview
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
                ({RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.label})
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setFullPreviewOpen(true)}
                style={{
                  padding: '5px 10px', borderRadius: 8, background: 'var(--bg-2)',
                  border: '1px solid var(--border)', color: 'var(--text)', fontSize: 11.5,
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Eye size={12} /> Fullscreen
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{
                  padding: '5px 12px', borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  border: 'none', color: '#fff', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Download size={12} /> PDF
              </button>
            </div>
          </div>

          {/* Scaled Preview Wrapper */}
          <div
            style={{
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto',
              borderRadius: 14,
              border: '1px solid var(--border)',
              background: '#52525b',
              padding: 12,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                transform: 'scale(0.68)',
                transformOrigin: 'top center',
                width: 760,
                marginBottom: -240,
              }}
            >
              <div ref={printAreaRef}>
                <ResumeDocumentPreview r={resume} templateId={selectedTemplate} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FULLSCREEN PREVIEW MODAL ── */}
      <AnimatePresence>
        {fullPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.88)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '24px 20px',
              overflowY: 'auto',
              backdropFilter: 'blur(10px)',
            }}
            onClick={e => { if (e.target === e.currentTarget) setFullPreviewOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              style={{ width: '100%', maxWidth: 840 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                  padding: '12px 18px',
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                    {resume.name} · Resume Preview
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
                    Template: {RESUME_TEMPLATES.find(t => t.id === selectedTemplate)?.label} · A4 Print Ready
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleDownloadPDF}
                    style={{
                      padding: '9px 22px', borderRadius: 10, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                      border: 'none', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                    }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  <button
                    onClick={() => setFullPreviewOpen(false)}
                    style={{
                      padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 6, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
                <ResumeDocumentPreview r={resume} templateId={selectedTemplate} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
