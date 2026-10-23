import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Eye, Edit3, Plus, Trash2, Check,
  Star, Award, Briefcase, GraduationCap, Code, Globe,
  ChevronDown, ChevronUp, Sparkles, RefreshCw, Copy, Zap,
} from 'lucide-react';
import { useAuth } from '../AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────
interface Experience { id: number; role: string; company: string; duration: string; location: string; points: string[]; }
interface Education  { id: number; degree: string; institution: string; year: string; gpa: string; honors: string; }
interface Project    { id: number; name: string; tech: string; link: string; desc: string; }
interface Cert       { id: number; name: string; issuer: string; date: string; }
interface Lang       { id: number; lang: string; level: string; }

interface ResumeData {
  name: string; title: string; email: string; phone: string;
  location: string; linkedin: string; github: string; website: string;
  summary: string; skills: string[];
  experience: Experience[]; education: Education[];
  projects: Project[]; certifications: Cert[]; languages: Lang[];
}

// ── Default data ──────────────────────────────────────────────────────────
const DEFAULT: ResumeData = {
  name: '', title: 'B.Tech Information Technology · NaanMudhalvan Scholar',
  email: '', phone: '', location: 'Tamil Nadu, India',
  linkedin: '', github: '', website: '',
  summary: 'Enthusiastic IT student with hands-on experience in full-stack development and AI projects through the NaanMudhalvan Learning Marketplace. Passionate about building impactful software solutions that solve real-world problems.',
  skills: ['React', 'Node.js', 'Python', 'MongoDB', 'TypeScript', 'REST APIs', 'Git', 'Figma'],
  experience: [{
    id: 1, role: 'Full Stack Developer Intern', company: 'NaanMudhalvan Project',
    duration: 'Jun 2025 – Aug 2025', location: 'Remote',
    points: ['Built a React + Node.js web app serving 500+ users', 'Implemented JWT auth and MongoDB data models', 'Reduced page load time by 40% through code splitting'],
  }],
  education: [{
    id: 1, degree: 'B.Tech Information Technology', institution: 'Bannari Amman Institute of Technology',
    year: '2022 – 2026', gpa: '8.4 CGPA', honors: 'NaanMudhalvan Scholar',
  }],
  projects: [
    { id: 1, name: 'AI Crop Disease Detection', tech: 'Python, TensorFlow, Flask', link: 'github.com/', desc: 'CNN model to classify crop diseases with 92% accuracy; deployed as REST API' },
    { id: 2, name: 'E-Commerce Platform', tech: 'React, Node.js, MongoDB', link: 'github.com/', desc: 'Full-stack marketplace with cart, payments, and admin dashboard' },
  ],
  certifications: [
    { id: 1, name: 'NaanMudhalvan Full Stack Certificate', issuer: 'Govt. of Tamil Nadu', date: 'Aug 2025' },
    { id: 2, name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Mar 2025' },
  ],
  languages: [
    { id: 1, lang: 'Tamil', level: 'Native' },
    { id: 2, lang: 'English', level: 'Proficient' },
  ],
};

// ── ATS Score ─────────────────────────────────────────────────────────────
function atsScore(r: ResumeData) {
  const tips: string[] = []; let score = 0;
  if (r.name.trim())             { score += 10; } else tips.push('Add your full name');
  if (r.email.trim())            { score += 8;  } else tips.push('Add email address');
  if (r.phone.trim())            { score += 5;  } else tips.push('Add phone number');
  if (r.summary.length > 80)     { score += 12; } else tips.push('Write a 2-3 sentence professional summary (>80 chars)');
  if (r.skills.length >= 6)      { score += 15; } else tips.push('Add at least 6 skills');
  if (r.experience.length > 0)   { score += 15; } else tips.push('Add work or project experience');
  if (r.experience.some(e => e.points.length >= 3)) { score += 8; } else tips.push('Use 3+ bullet points per role');
  if (r.education.length > 0)    { score += 10; } else tips.push('Add your education details');
  if (r.projects.length >= 2)    { score += 10; } else tips.push('Showcase at least 2 projects');
  if (r.certifications.length > 0) { score += 7; } else tips.push('Add NM or industry certifications');
  return { score: Math.min(100, score), tips };
}

// ── Small field ───────────────────────────────────────────────────────────
function EF({ label, value, onChange, placeholder, multiline }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="inp" rows={3} style={{ resize: 'vertical', fontSize: 13 }}/>
        : <input className="inp" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ fontSize: 13 }}/>
      }
    </div>
  );
}

// ── Template defs ─────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'modern',  label: 'Modern',  color: '#7c3aed', bg: 'linear-gradient(135deg,#4c1d95,#6d28d9,#7c3aed)', desc: 'Purple gradient header' },
  { id: 'classic', label: 'Classic', color: '#1e293b', bg: 'linear-gradient(135deg,#0f172a,#1e293b,#334155)', desc: 'Professional dark header' },
  { id: 'teal',    label: 'Teal',    color: '#0d9488', bg: 'linear-gradient(135deg,#134e4a,#0f766e,#0d9488)', desc: 'Teal accent design' },
];

// ── Resume Preview ─────────────────────────────────────────────────────────
function ResumePreview({ r, template }: { r: ResumeData; template: string }) {
  const tmpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];
  const accent = tmpl.color;

  const Sec = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, borderBottom: `2px solid ${accent}`, paddingBottom: 4, marginBottom: 8 }}>
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1e293b' }}>{title}</span>
      </div>
      {children}
    </div>
  );

  return (
    <div id="resume-print-area" style={{ background: '#fff', color: '#1e293b', fontFamily: 'Georgia, serif', fontSize: 11, lineHeight: 1.55 }}>
      {/* Header */}
      <div style={{ background: tmpl.bg, padding: '20px 24px', color: '#fff' }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', fontFamily: 'Arial, sans-serif' }}>{r.name || 'Your Name'}</div>
        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2, fontFamily: 'Arial, sans-serif' }}>{r.title}</div>
        <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap', fontSize: 10, fontFamily: 'Arial, sans-serif', opacity: 0.88 }}>
          {r.email    && <span>✉ {r.email}</span>}
          {r.phone    && <span>📞 {r.phone}</span>}
          {r.location && <span>📍 {r.location}</span>}
          {r.linkedin && <span>🔗 {r.linkedin}</span>}
          {r.github   && <span>⌨ {r.github}</span>}
          {r.website  && <span>🌐 {r.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 24px 20px' }}>
        {r.summary && (
          <Sec title="Professional Summary" icon="★">
            <p style={{ fontSize: 10.5, color: '#374151', margin: 0, lineHeight: 1.65 }}>{r.summary}</p>
          </Sec>
        )}

        {r.skills.length > 0 && (
          <Sec title="Technical Skills" icon="⚙">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {r.skills.map((s, i) => (
                <span key={i} style={{ fontSize: 9.5, fontFamily: 'Arial, sans-serif', fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: `${accent}12`, color: accent, border: `1px solid ${accent}30` }}>{s}</span>
              ))}
            </div>
          </Sec>
        )}

        {r.experience.length > 0 && (
          <Sec title="Experience" icon="💼">
            {r.experience.map(e => (
              <div key={e.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <strong style={{ fontSize: 11, fontFamily: 'Arial, sans-serif' }}>{e.role}</strong>
                  <span style={{ fontSize: 9.5, color: '#6b7280', fontFamily: 'Arial, sans-serif' }}>{e.duration}</span>
                </div>
                <div style={{ fontSize: 10, color: accent, fontFamily: 'Arial, sans-serif', marginBottom: 4 }}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                <ul style={{ margin: '3px 0 0 14px', padding: 0 }}>
                  {e.points.filter(Boolean).map((p, i) => <li key={i} style={{ fontSize: 10.5, color: '#374151', marginBottom: 2 }}>{p}</li>)}
                </ul>
              </div>
            ))}
          </Sec>
        )}

        {r.projects.length > 0 && (
          <Sec title="Projects" icon="🚀">
            {r.projects.map(p => (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <strong style={{ fontSize: 11, fontFamily: 'Arial, sans-serif' }}>{p.name}</strong>
                  {p.link && <span style={{ fontSize: 9.5, color: accent, fontFamily: 'Arial, sans-serif' }}>{p.link}</span>}
                </div>
                {p.tech && <div style={{ fontSize: 9.5, color: '#6b7280', fontFamily: 'Arial, sans-serif', marginBottom: 2 }}>{p.tech}</div>}
                {p.desc && <div style={{ fontSize: 10.5, color: '#374151' }}>{p.desc}</div>}
              </div>
            ))}
          </Sec>
        )}

        {r.education.length > 0 && (
          <Sec title="Education" icon="🎓">
            {r.education.map(e => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <strong style={{ fontSize: 11, fontFamily: 'Arial, sans-serif' }}>{e.degree}</strong>
                  <span style={{ fontSize: 9.5, color: '#6b7280', fontFamily: 'Arial, sans-serif' }}>{e.year}</span>
                </div>
                <div style={{ fontSize: 10, color: accent, fontFamily: 'Arial, sans-serif' }}>{e.institution}</div>
                {(e.gpa || e.honors) && <div style={{ fontSize: 9.5, color: '#6b7280', fontFamily: 'Arial, sans-serif' }}>{e.gpa}{e.honors ? ` · ${e.honors}` : ''}</div>}
              </div>
            ))}
          </Sec>
        )}

        {r.certifications.length > 0 && (
          <Sec title="Certifications" icon="🏅">
            {r.certifications.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 }}>
                <span style={{ fontSize: 10.5, fontFamily: 'Arial, sans-serif', fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 9.5, color: '#6b7280', fontFamily: 'Arial, sans-serif' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
              </div>
            ))}
          </Sec>
        )}

        {r.languages.length > 0 && (
          <Sec title="Languages" icon="🗣">
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {r.languages.map(l => (
                <span key={l.id} style={{ fontSize: 10.5, fontFamily: 'Arial, sans-serif' }}><strong>{l.lang}</strong> ({l.level})</span>
              ))}
            </div>
          </Sec>
        )}
      </div>
    </div>
  );
}

// ── Accordion section ─────────────────────────────────────────────────────
let _uid = 200;
const uid = () => ++_uid;

function Accordion({ id, title, icon, active, toggle, children }:
  { id: string; title: string; icon: React.ReactNode; active: boolean; toggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8, borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <button onClick={toggle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: active ? 'rgba(124,58,237,0.06)' : 'var(--surface)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--text)', textAlign: 'left' }}>
        <span style={{ color: '#7c3aed' }}>{icon}</span>
        {title}
        <span style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>{active ? <ChevronUp size={15}/> : <ChevronDown size={15}/>}</span>
      </button>
      <AnimatePresence>
        {active && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: 16 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const [r, setR] = useState<ResumeData>(() => ({
    ...DEFAULT,
    name:     user?.name  || '',
    email:    user?.email || '',
    phone:    (user as any)?.phone || '',
    linkedin: user ? `linkedin.com/in/${(user.name || 'student').toLowerCase().replace(/\s+/g, '-')}` : '',
    github:   user ? `github.com/${(user.name || 'student').toLowerCase().replace(/\s+/g, '')}` : '',
  }));
  const [template,  setTemplate]  = useState('modern');
  const [section,   setSection]   = useState<string | null>('basics');
  const [skillIn,   setSkillIn]   = useState('');
  const [preview,   setPreview]   = useState(false);
  const [copied,    setCopied]    = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const { score, tips } = useMemo(() => atsScore(r), [r]);

  const upd = (key: keyof ResumeData, val: any) => setR(prev => ({ ...prev, [key]: val }));
  const sec = (id: string) => section === id ? setSection(null) : setSection(id);

  // Skills
  const addSkill = () => { const s = skillIn.trim(); if (s && !r.skills.includes(s)) { upd('skills', [...r.skills, s]); setSkillIn(''); } };
  const rmSkill  = (s: string) => upd('skills', r.skills.filter(x => x !== s));

  // Exp
  const addExp = () => upd('experience', [...r.experience, { id: uid(), role: '', company: '', duration: '', location: '', points: ['', '', ''] }]);
  const updExp = (id: number, k: string, v: any) => upd('experience', r.experience.map(e => e.id === id ? { ...e, [k]: v } : e));
  const rmExp  = (id: number) => upd('experience', r.experience.filter(e => e.id !== id));

  // Projects
  const addProj = () => upd('projects', [...r.projects, { id: uid(), name: '', tech: '', link: '', desc: '' }]);
  const updProj = (id: number, k: string, v: any) => upd('projects', r.projects.map(p => p.id === id ? { ...p, [k]: v } : p));
  const rmProj  = (id: number) => upd('projects', r.projects.filter(p => p.id !== id));

  // Education
  const addEdu = () => upd('education', [...r.education, { id: uid(), degree: '', institution: '', year: '', gpa: '', honors: '' }]);
  const updEdu = (id: number, k: string, v: any) => upd('education', r.education.map(e => e.id === id ? { ...e, [k]: v } : e));
  const rmEdu  = (id: number) => upd('education', r.education.filter(e => e.id !== id));

  // Certs
  const addCert = () => upd('certifications', [...r.certifications, { id: uid(), name: '', issuer: '', date: '' }]);
  const updCert = (id: number, k: string, v: any) => upd('certifications', r.certifications.map(c => c.id === id ? { ...c, [k]: v } : c));
  const rmCert  = (id: number) => upd('certifications', r.certifications.filter(c => c.id !== id));

  // AI Autofill
  const autofill = () => {
    if (!user) return;
    setR(prev => ({
      ...prev,
      name:    user.name  || prev.name,
      email:   user.email || prev.email,
      phone:   (user as any).phone || prev.phone,
      summary: `Motivated ${(user as any).branch || 'IT'} student at ${(user as any).college || 'BIT'} with strong project experience through NaanMudhalvan. Skilled in full-stack development and passionate about building impactful solutions.`,
      skills:  [...new Set([...prev.skills, ...((user as any).skills || [])])],
    }));
  };

  // Print
  const printPDF = () => {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>${r.name || 'Resume'}</title><style>body{margin:0;padding:20px;font-family:Georgia,serif;}@media print{@page{margin:12mm;}}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close(); win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  // Copy summary
  const copySummary = async () => {
    await navigator.clipboard.writeText(r.summary);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const sc = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444';
  const sLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work';
  const circ = 2 * Math.PI * 30;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 60, background: 'var(--bg)' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', padding: '36px 24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 15% 50%,rgba(124,58,237,0.18) 0%,transparent 60%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="#fff"/>
              </div>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', margin: 0 }}>AI Resume Builder</h1>
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', margin: 0 }}>ATS-optimized · Live preview · PDF export</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {user && (
              <button onClick={autofill} style={{ padding: '10px 18px', borderRadius: 11, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Sparkles size={14}/> AI Autofill
              </button>
            )}
            <button onClick={() => setPreview(true)} style={{ padding: '10px 18px', borderRadius: 11, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Eye size={14}/> Preview
            </button>
            <button onClick={printPDF} style={{ padding: '10px 20px', borderRadius: 11, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(124,58,237,0.45)' }}>
              <Download size={14}/> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 80px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 22, alignItems: 'start' }}>

        {/* ── Editor ── */}
        <div>
          {/* ATS Score */}
          <div style={{ padding: '20px 22px', borderRadius: 16, background: 'var(--surface)', border: `1.5px solid ${sc}30`, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
              <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={36} cy={36} r={30} fill="none" stroke="var(--border)" strokeWidth={7}/>
                <motion.circle cx={36} cy={36} r={30} fill="none" stroke={sc} strokeWidth={7}
                  strokeLinecap="round" strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - score / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: sc, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-3)' }}>/100</div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>ATS Score: <span style={{ color: sc }}>{sLabel}</span></div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>Higher score = better recruiter visibility</div>
              {tips.slice(0, 2).map((t, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Zap size={11} color="#f59e0b"/> {t}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.06em' }}>Tips left</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f59e0b' }}>{tips.length}</div>
            </div>
          </div>

          {/* Template selector */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Template Style</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 13, border: `2px solid ${template === t.id ? t.color : 'var(--border)'}`, background: template === t.id ? `${t.color}10` : 'var(--surface)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: t.bg, margin: '0 auto 6px', boxShadow: template === t.id ? `0 3px 12px ${t.color}50` : 'none' }}/>
                  <div style={{ fontSize: 12, fontWeight: 700, color: template === t.id ? t.color : 'var(--text)' }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* BASICS */}
          <Accordion id="basics" title="Basic Information" icon={<Edit3 size={15}/>} active={section === 'basics'} toggle={() => sec('basics')}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <EF label="Full Name *"        value={r.name}     onChange={v => upd('name', v)}     placeholder="Nithish Ramasamy"/>
              <EF label="Professional Title" value={r.title}    onChange={v => upd('title', v)}    placeholder="B.Tech IT · NaanMudhalvan Scholar"/>
              <EF label="Email *"            value={r.email}    onChange={v => upd('email', v)}    placeholder="you@email.com"/>
              <EF label="Phone"              value={r.phone}    onChange={v => upd('phone', v)}    placeholder="+91 98765 43210"/>
              <EF label="Location"           value={r.location} onChange={v => upd('location', v)} placeholder="Chennai, Tamil Nadu"/>
              <EF label="LinkedIn URL"       value={r.linkedin} onChange={v => upd('linkedin', v)} placeholder="linkedin.com/in/name"/>
              <EF label="GitHub URL"         value={r.github}   onChange={v => upd('github', v)}   placeholder="github.com/username"/>
              <EF label="Portfolio / Website" value={r.website} onChange={v => upd('website', v)} placeholder="yourportfolio.dev"/>
            </div>
          </Accordion>

          {/* SUMMARY */}
          <Accordion id="summary" title="Professional Summary" icon={<Star size={15}/>} active={section === 'summary'} toggle={() => sec('summary')}>
            <EF label="Summary *" value={r.summary} onChange={v => upd('summary', v)} multiline placeholder="2-3 sentences about background, skills, and career goals…"/>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button onClick={copySummary} style={{ padding: '7px 14px', borderRadius: 9, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                {copied ? <><Check size={12} color="#10b981"/> Copied!</> : <><Copy size={12}/> Copy Text</>}
              </button>
              <button onClick={() => upd('summary', DEFAULT.summary)}
                style={{ padding: '7px 14px', borderRadius: 9, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#7c3aed', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={12}/> Use Template
              </button>
            </div>
          </Accordion>

          {/* SKILLS */}
          <Accordion id="skills" title="Technical Skills" icon={<Code size={15}/>} active={section === 'skills'} toggle={() => sec('skills')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
              {r.skills.map(s => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: 'rgba(124,58,237,0.1)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.2)' }}>
                  {s}
                  <button onClick={() => rmSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', padding: 0, lineHeight: 1 }}><Trash2 size={10}/></button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="inp" value={skillIn} onChange={e => setSkillIn(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Type skill + press Enter…" style={{ fontSize: 13, flex: 1 }}/>
              <button onClick={addSkill} style={{ padding: '0 16px', borderRadius: 10, background: '#7c3aed', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={14}/> Add
              </button>
            </div>
          </Accordion>

          {/* EXPERIENCE */}
          <Accordion id="experience" title="Experience" icon={<Briefcase size={15}/>} active={section === 'experience'} toggle={() => sec('experience')}>
            {r.experience.map((e, ei) => (
              <div key={e.id} style={{ padding: 14, borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>Role #{ei + 1}</span>
                  <button onClick={() => rmExp(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14}/></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <EF label="Job Title"  value={e.role}     onChange={v => updExp(e.id,'role',v)}     placeholder="Software Developer Intern"/>
                  <EF label="Company"    value={e.company}  onChange={v => updExp(e.id,'company',v)}  placeholder="Zoho Corp"/>
                  <EF label="Duration"   value={e.duration} onChange={v => updExp(e.id,'duration',v)} placeholder="Jun 2025 – Aug 2025"/>
                  <EF label="Location"   value={e.location} onChange={v => updExp(e.id,'location',v)} placeholder="Chennai / Remote"/>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Bullet Points (start with action verb)</div>
                  {e.points.map((pt, pi) => (
                    <input key={pi} className="inp" value={pt} style={{ fontSize: 12.5, marginBottom: 6 }}
                      onChange={ev => { const pts = [...e.points]; pts[pi] = ev.target.value; updExp(e.id,'points',pts); }}
                      placeholder={`• ${['Built','Developed','Led','Deployed','Improved','Designed'][pi % 6]}…`}/>
                  ))}
                  <button onClick={() => updExp(e.id,'points',[...e.points,''])}
                    style={{ fontSize: 12, color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Plus size={12}/> Add bullet
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addExp} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'none', color: 'var(--text-3)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={14}/> Add Experience
            </button>
          </Accordion>

          {/* PROJECTS */}
          <Accordion id="projects" title="Projects" icon={<Globe size={15}/>} active={section === 'projects'} toggle={() => sec('projects')}>
            {r.projects.map((p, pi) => (
              <div key={p.id} style={{ padding: 14, borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>Project #{pi + 1}</span>
                  <button onClick={() => rmProj(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14}/></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <EF label="Project Name" value={p.name} onChange={v => updProj(p.id,'name',v)} placeholder="E-Commerce Platform"/>
                  <EF label="Tech Stack"   value={p.tech} onChange={v => updProj(p.id,'tech',v)} placeholder="React, Node.js, MongoDB"/>
                  <EF label="Link (GitHub / Live)" value={p.link} onChange={v => updProj(p.id,'link',v)} placeholder="github.com/user/repo"/>
                </div>
                <EF label="Description (impact, role, metrics)" value={p.desc} onChange={v => updProj(p.id,'desc',v)} multiline placeholder="What it does, your role, and measurable outcomes…"/>
              </div>
            ))}
            <button onClick={addProj} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'none', color: 'var(--text-3)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={14}/> Add Project
            </button>
          </Accordion>

          {/* EDUCATION */}
          <Accordion id="education" title="Education" icon={<GraduationCap size={15}/>} active={section === 'education'} toggle={() => sec('education')}>
            {r.education.map((e, ei) => (
              <div key={e.id} style={{ padding: 14, borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>Education #{ei + 1}</span>
                  <button onClick={() => rmEdu(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14}/></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <EF label="Degree / Course"  value={e.degree}      onChange={v => updEdu(e.id,'degree',v)}      placeholder="B.Tech Information Technology"/>
                  <EF label="Institution"       value={e.institution} onChange={v => updEdu(e.id,'institution',v)} placeholder="Anna University"/>
                  <EF label="Year"              value={e.year}        onChange={v => updEdu(e.id,'year',v)}        placeholder="2022 – 2026"/>
                  <EF label="CGPA / Percentage" value={e.gpa}         onChange={v => updEdu(e.id,'gpa',v)}         placeholder="8.9 CGPA"/>
                  <EF label="Honors / Awards"   value={e.honors}      onChange={v => updEdu(e.id,'honors',v)}      placeholder="NaanMudhalvan Scholar"/>
                </div>
              </div>
            ))}
            <button onClick={addEdu} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'none', color: 'var(--text-3)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={14}/> Add Education
            </button>
          </Accordion>

          {/* CERTIFICATIONS */}
          <Accordion id="certs" title="Certifications" icon={<Award size={15}/>} active={section === 'certs'} toggle={() => sec('certs')}>
            {r.certifications.map((c, ci) => (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px auto', gap: 8, alignItems: 'end', marginBottom: 10 }}>
                <EF label={ci === 0 ? 'Certificate Name' : ''} value={c.name}   onChange={v => updCert(c.id,'name',v)}   placeholder="AWS Cloud Practitioner"/>
                <EF label={ci === 0 ? 'Issuer' : ''}           value={c.issuer} onChange={v => updCert(c.id,'issuer',v)} placeholder="Amazon Web Services"/>
                <EF label={ci === 0 ? 'Date' : ''}             value={c.date}   onChange={v => updCert(c.id,'date',v)}   placeholder="Mar 2025"/>
                <button onClick={() => rmCert(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', paddingBottom: ci === 0 ? 0 : 0 }}><Trash2 size={13}/></button>
              </div>
            ))}
            <button onClick={addCert} style={{ width: '100%', padding: 10, borderRadius: 10, border: '1.5px dashed var(--border)', background: 'none', color: 'var(--text-3)', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Plus size={14}/> Add Certification
            </button>
          </Accordion>
        </div>

        {/* ── Live Preview ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Live Preview</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPreview(true)} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Eye size={12}/> Full Screen
              </button>
              <button onClick={printPDF} style={{ padding: '6px 14px', borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Download size={12}/> PDF
              </button>
            </div>
          </div>
          <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', borderRadius: 12, border: '1px solid var(--border)', background: '#fff' }}>
            <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center', width: '133%', marginLeft: '-16.5%' }}>
              <div ref={printRef}><ResumePreview r={r} template={template}/></div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 2000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 20px', overflowY: 'auto', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) setPreview(false); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              style={{ width: '100%', maxWidth: 800 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Resume Preview — {r.name || 'Your Resume'}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={printPDF} style={{ padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Download size={14}/> Download PDF
                  </button>
                  <button onClick={() => setPreview(false)} style={{ padding: '9px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>
              </div>
              <ResumePreview r={r} template={template}/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

