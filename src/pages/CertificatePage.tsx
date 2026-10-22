import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, Star, CheckCircle, Share2, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

// ── Types ──────────────────────────────────────────────────
interface CertTemplate {
  id: string;
  name: string;
  type: 'internship' | 'course' | 'excellence';
  company: string;
  companyDomain: string;
  primaryColor: string;
  accentColor: string;
  bgStyle: string;
  borderStyle: string;
  description: string;
}

// ── All Certificate Templates ──────────────────────────────
const TEMPLATES: CertTemplate[] = [
  // ── INTERNSHIP TEMPLATES ──
  {
    id: 'tcs-intern',
    name: 'TCS Internship Certificate',
    type: 'internship',
    company: 'Tata Consultancy Services',
    companyDomain: 'tcs.com',
    primaryColor: '#1a56db',
    accentColor: '#3b82f6',
    bgStyle: 'linear-gradient(135deg, #0c1445 0%, #1a237e 40%, #0d47a1 100%)',
    borderStyle: '#1a56db',
    description: 'Official internship completion certificate from TCS',
  },
  {
    id: 'zoho-intern',
    name: 'Zoho Internship Certificate',
    type: 'internship',
    company: 'Zoho Corporation',
    companyDomain: 'zoho.com',
    primaryColor: '#e42527',
    accentColor: '#ef4444',
    bgStyle: 'linear-gradient(135deg, #1a0000 0%, #3b0000 40%, #1a0505 100%)',
    borderStyle: '#e42527',
    description: 'Software development internship at Zoho Corp',
  },
  {
    id: 'infosys-intern',
    name: 'Infosys Internship Certificate',
    type: 'internship',
    company: 'Infosys Limited',
    companyDomain: 'infosys.com',
    primaryColor: '#007cc3',
    accentColor: '#0ea5e9',
    bgStyle: 'linear-gradient(135deg, #00111f 0%, #003366 50%, #001f3f 100%)',
    borderStyle: '#007cc3',
    description: 'Technology internship certification from Infosys',
  },
  {
    id: 'freshworks-intern',
    name: 'Freshworks Internship Certificate',
    type: 'internship',
    company: 'Freshworks Inc.',
    companyDomain: 'freshworks.com',
    primaryColor: '#29b5e8',
    accentColor: '#06b6d4',
    bgStyle: 'linear-gradient(135deg, #001a24 0%, #003d52 50%, #002233 100%)',
    borderStyle: '#29b5e8',
    description: 'SaaS product internship at Freshworks',
  },
  {
    id: 'wipro-intern',
    name: 'Wipro Internship Certificate',
    type: 'internship',
    company: 'Wipro Technologies',
    companyDomain: 'wipro.com',
    primaryColor: '#7b2d8b',
    accentColor: '#a855f7',
    bgStyle: 'linear-gradient(135deg, #0d0014 0%, #2d0045 50%, #1a0028 100%)',
    borderStyle: '#7b2d8b',
    description: 'Digital transformation internship at Wipro',
  },
  {
    id: 'google-intern',
    name: 'Google Internship Certificate',
    type: 'internship',
    company: 'Google LLC',
    companyDomain: 'google.com',
    primaryColor: '#4285f4',
    accentColor: '#34a853',
    bgStyle: 'linear-gradient(135deg, #0a0f1a 0%, #1a2744 50%, #0d1628 100%)',
    borderStyle: '#4285f4',
    description: 'Software engineering internship at Google',
  },
  // ── COURSE COMPLETION TEMPLATES ──
  {
    id: 'course-nm-gold',
    name: 'NM Course Certificate — Gold',
    type: 'course',
    company: 'NaanMudhalvan Platform',
    companyDomain: 'naanmudhalvan.tn.gov.in',
    primaryColor: '#f59e0b',
    accentColor: '#fbbf24',
    bgStyle: 'linear-gradient(135deg, #0c0800 0%, #1a1100 40%, #0f0c00 100%)',
    borderStyle: '#f59e0b',
    description: 'Government of Tamil Nadu course completion',
  },
  {
    id: 'course-violet',
    name: 'NM Course Certificate — Violet',
    type: 'course',
    company: 'NaanMudhalvan Platform',
    companyDomain: 'naanmudhalvan.tn.gov.in',
    primaryColor: '#7c3aed',
    accentColor: '#a78bfa',
    bgStyle: 'linear-gradient(135deg, #06000f 0%, #1a0045 50%, #0d0028 100%)',
    borderStyle: '#7c3aed',
    description: 'Advanced skill development certification',
  },
  {
    id: 'course-green',
    name: 'NM Course Certificate — Emerald',
    type: 'course',
    company: 'NaanMudhalvan Platform',
    companyDomain: 'naanmudhalvan.tn.gov.in',
    primaryColor: '#10b981',
    accentColor: '#34d399',
    bgStyle: 'linear-gradient(135deg, #00100a 0%, #003322 50%, #001a12 100%)',
    borderStyle: '#10b981',
    description: 'Industry-ready skills certification',
  },
  // ── EXCELLENCE AWARD ──
  {
    id: 'excellence-navy',
    name: 'Certificate of Excellence',
    type: 'excellence',
    company: 'NaanMudhalvan Platform',
    companyDomain: 'naanmudhalvan.tn.gov.in',
    primaryColor: '#f59e0b',
    accentColor: '#fbbf24',
    bgStyle: 'linear-gradient(135deg, #030b1a 0%, #0a1628 50%, #050d1e 100%)',
    borderStyle: '#f59e0b',
    description: 'Premium certificate for top performers',
  },
];

const TYPE_TABS = [
  { id: 'all',         label: 'All',              icon: '🏅' },
  { id: 'internship',  label: 'Internship',        icon: '💼' },
  { id: 'course',      label: 'Course Completion', icon: '📚' },
  { id: 'excellence',  label: 'Excellence Award',  icon: '⭐' },
];

// ── CERTIFICATE RENDERER ───────────────────────────────────
function CertificateCard({
  template,
  studentName,
  courseName,
  date,
  credentialId,
}: {
  template: CertTemplate;
  studentName: string;
  courseName: string;
  date: string;
  credentialId: string;
}) {
  const logoUrl = `https://logo.clearbit.com/${template.companyDomain}`;
  const [logoErr, setLogoErr] = useState(false);
  const p = template.primaryColor;
  const a = template.accentColor;

  return (
    <div style={{
      width: '100%', aspectRatio: '1.414 / 1',
      background: template.bgStyle,
      borderRadius: 16, overflow: 'hidden',
      position: 'relative', fontFamily: 'Georgia, serif',
    }}>
      {/* ── Outer decorative border ── */}
      <div style={{ position: 'absolute', inset: 12, border: `2px solid ${p}40`, borderRadius: 10, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 18, border: `1px solid ${p}20`, borderRadius: 7, pointerEvents: 'none' }} />

      {/* ── Corner ornaments ── */}
      {[
        { top: 12, left: 12, rotate: '0deg' },
        { top: 12, right: 12, rotate: '90deg' },
        { bottom: 12, right: 12, rotate: '180deg' },
        { bottom: 12, left: 12, rotate: '270deg' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', width: 48, height: 48,
          ...pos as any,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: `rotate(${pos.rotate})` }}>
            <path d="M2 2 L2 18 L6 18 L6 6 L18 6 L18 2 Z" fill={`${p}70`} />
            <path d="M2 2 L2 8 L8 2 Z" fill={p} opacity="0.9" />
            <circle cx="20" cy="20" r="2" fill={`${a}60`} />
          </svg>
        </div>
      ))}

      {/* ── Top accent line ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${p}, ${a}, ${p}, transparent)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${p}, ${a}, ${p}, transparent)` }} />

      {/* ── Content ── */}
      <div style={{ position: 'absolute', inset: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
            {!logoErr ? (
              <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 3 }}>
                <img src={logoUrl} alt={template.company} width={28} height={28} style={{ objectFit: 'contain' }} onError={() => setLogoErr(true)} />
              </div>
            ) : (
              <div style={{ width: 36, height: 36, background: `${p}20`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} color={p} />
              </div>
            )}
            <span style={{ fontSize: 11, color: `${p}cc`, fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {template.company}
            </span>
          </div>

          {/* Title */}
          <div style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: `${a}99`, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
            {template.type === 'internship' ? 'This certifies that' : template.type === 'course' ? 'Certificate of Completion' : 'Certificate of Excellence'}
          </div>
          {template.type === 'internship' && (
            <div style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${p}80`, fontFamily: 'Inter, sans-serif' }}>
              Internship Completion Certificate
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${p}50, transparent)`, margin: '8px auto', width: '70%' }} />
        </div>

        {/* Student Name */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${a}80`, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
            Proudly Awarded To
          </div>
          <div style={{
            fontSize: 'clamp(18px, 4vw, 28px)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: `0 0 20px ${p}60`,
          }}>
            {studentName || 'Student Name'}
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${a}60, transparent)`, margin: '6px auto', width: '50%' }} />
        </div>

        {/* Course/Role */}
        <div style={{ textAlign: 'center', padding: '0 8%' }}>
          {template.type === 'internship' ? (
            <>
              <div style={{ fontSize: 6.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: `${p}80`, fontFamily: 'Inter, sans-serif', marginBottom: 3 }}>
                For successfully completing the internship program in
              </div>
              <div style={{ fontSize: 'clamp(11px, 2.5vw, 16px)', fontWeight: 600, color: a, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                {courseName || 'Software Development'}
              </div>
            </>
          ) : template.type === 'course' ? (
            <>
              <div style={{ fontSize: 6.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: `${p}80`, fontFamily: 'Inter, sans-serif', marginBottom: 3 }}>
                For successfully completing
              </div>
              <div style={{ fontSize: 'clamp(11px, 2.5vw, 16px)', fontWeight: 600, color: a, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                {courseName || 'Course Title'}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 6.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: `${p}80`, fontFamily: 'Inter, sans-serif', marginBottom: 3 }}>
                In recognition of outstanding excellence in
              </div>
              <div style={{ fontSize: 'clamp(11px, 2.5vw, 16px)', fontWeight: 600, color: a, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                {courseName || 'Academic Achievement'}
              </div>
            </>
          )}
          <div style={{ fontSize: 6.5, color: `${p}70`, marginTop: 4, fontFamily: 'Inter, sans-serif' }}>
            This certificate recognises outstanding dedication and skill demonstrated throughout the programme.
          </div>
        </div>

        {/* Footer — Seal + Signatures + Date */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          {/* Sig 1 */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ height: 1, background: `${p}50`, marginBottom: 3, width: '80%', margin: '0 auto 3px' }} />
            <div style={{ fontSize: 6.5, color: `${p}aa`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Programme Director</div>
          </div>

          {/* Seal */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: `2.5px solid ${p}`,
              background: `radial-gradient(circle, ${p}20, transparent)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 16px ${p}50`,
              margin: '0 auto 3px',
            }}>
              <Award size={22} color={p} />
            </div>
            <div style={{ fontSize: 6, color: `${a}90`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.06em' }}>OFFICIAL SEAL</div>
          </div>

          {/* Sig 2 + Date */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ height: 1, background: `${p}50`, marginBottom: 3, width: '80%', margin: '0 auto 3px' }} />
            <div style={{ fontSize: 6.5, color: `${p}aa`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Issue Date: {date || 'Oct 2026'}</div>
          </div>
        </div>

        {/* Credential ID */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 6, color: `${p}60`, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
            Credential ID: {credentialId || 'NM-2026-XXXX-YYYY'}
          </div>
        </div>
      </div>

      {/* Watermark background pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(45deg, ${p} 0, ${p} 1px, transparent 0, transparent 50%)`,
        backgroundSize: '14px 14px',
      }} />
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────
export default function CertificatePage() {
  const { user } = useAuth();
  const [typeFilter, setTypeFilter] = useState('all');
  const [selected,   setSelected]   = useState<CertTemplate>(TEMPLATES[0]);
  const [studentName, setStudentName] = useState(user?.name || 'Your Name');
  const [courseName,  setCourseName]  = useState('Full Stack Web Development with React & Node.js');
  const [issueDate,   setIssueDate]   = useState('October 2026');
  const [credId,      setCredId]      = useState(`NM-${new Date().getFullYear()}-${Math.floor(Math.random()*9000+1000)}-${Math.floor(Math.random()*9000+1000)}`);
  const certRef = useRef<HTMLDivElement>(null);

  const filtered = typeFilter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.type === typeFilter);

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win || !certRef.current) return;
    win.document.write(`
      <html><head>
        <title>Certificate — ${studentName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          * { margin:0; padding:0; box-sizing:border-box; }
          body { background:#000; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; }
          .cert { width:900px; }
          @media print { body { background:#000; } .cert { width:100%; } }
        </style>
      </head><body>
        <div class="cert">${certRef.current.innerHTML}</div>
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
  };

  return (
    <div className="page" style={{ minHeight: '100vh', paddingTop: 60, paddingBottom: 80, background: 'var(--bg)' }}>

      {/* ── Banner ── */}
      <div style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)', borderBottom: '1px solid var(--border)', padding: '40px 0 32px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#f59e0b', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
            🏅 Premium Certificate Templates
          </div>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(26px,5vw,52px)', color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12 }}>
            Your <span className="g-gold">Certificates</span> of Achievement
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 560, margin: '0 auto' }}>
            Personalise and download premium certificates for your internships and course completions. Accepted by 180+ partner companies.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28, alignItems: 'start' }}>

          {/* ── LEFT: Controls + Template List ── */}
          <div>
            {/* Personalise */}
            <div className="glass-heavy" style={{ borderRadius: 18, padding: '22px 20px', marginBottom: 20 }}>
              <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 16 }}>✏️ Personalise</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your Name</label>
                  <input id="cert-name" className="inp" value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="Enter your full name" style={{ fontSize: 13.5 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Course / Internship</label>
                  <input id="cert-course" className="inp" value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    placeholder="Course or internship title" style={{ fontSize: 13.5 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Issue Date</label>
                    <input id="cert-date" className="inp" value={issueDate}
                      onChange={e => setIssueDate(e.target.value)}
                      placeholder="Month YYYY" style={{ fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Credential ID</label>
                    <input id="cert-cred" className="inp" value={credId}
                      onChange={e => setCredId(e.target.value)}
                      placeholder="NM-2026-XXXX" style={{ fontSize: 11 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Type filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {TYPE_TABS.map(t => (
                <button key={t.id} onClick={() => setTypeFilter(t.id)}
                  style={{
                    padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: `1.5px solid ${typeFilter === t.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: typeFilter === t.id ? 'rgba(124,58,237,0.12)' : 'var(--surface)',
                    color: typeFilter === t.id ? 'var(--accent)' : 'var(--text-2)',
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Template list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(tmpl => (
                <motion.button key={tmpl.id} onClick={() => setSelected(tmpl)}
                  whileHover={{ x: 3 }} transition={{ duration: 0.15 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                    padding: '11px 14px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                    border: `1.5px solid ${selected.id === tmpl.id ? tmpl.primaryColor + '60' : 'var(--border)'}`,
                    background: selected.id === tmpl.id ? `${tmpl.primaryColor}08` : 'var(--surface)',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}>
                  {/* Mini preview */}
                  <div style={{ width: 44, height: 30, borderRadius: 6, background: tmpl.bgStyle, flexShrink: 0, border: `1px solid ${tmpl.primaryColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={14} color={tmpl.primaryColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tmpl.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 2 }}>{tmpl.type.charAt(0).toUpperCase() + tmpl.type.slice(1)}</div>
                  </div>
                  {selected.id === tmpl.id && (
                    <CheckCircle size={14} color={tmpl.primaryColor} />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Preview + Actions ── */}
          <div>
            {/* Action bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={handlePrint}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Printer size={14} /> Print / Save PDF
              </button>
              <button className="btn btn-ghost btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Share2 size={14} /> Share
              </button>
              <button className="btn btn-primary" onClick={handlePrint}
                style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, padding: '9px 18px' }}>
                <Download size={14} /> Download Certificate
              </button>
            </div>

            {/* Certificate preview */}
            <AnimatePresence mode="wait">
              <motion.div key={selected.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                ref={certRef}
                style={{ borderRadius: 18, overflow: 'hidden', boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${selected.primaryColor}20` }}>
                <CertificateCard
                  template={selected}
                  studentName={studentName}
                  courseName={courseName}
                  date={issueDate}
                  credentialId={credId}
                />
              </motion.div>
            </AnimatePresence>

            {/* Info strip */}
            <div className="glass" style={{ borderRadius: 14, padding: '14px 18px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${selected.primaryColor}15`, border: `1px solid ${selected.primaryColor}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={18} color={selected.primaryColor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{selected.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{selected.description} · Verified by {selected.company}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .g-gold {
          background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (max-width: 900px) {
          .cert-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
