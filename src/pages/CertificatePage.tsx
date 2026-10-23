import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, Star, CheckCircle, Share2, Printer, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../AuthContext';

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
  style: 'royal' | 'neon' | 'gold' | 'minimal' | 'dark' | 'holographic';
}

const TEMPLATES: CertTemplate[] = [
  // ── INTERNSHIP ──
  {
    id: 'tcs-royal', name: 'TCS – Royal Blue', type: 'internship',
    company: 'Tata Consultancy Services', companyDomain: 'tcs.com',
    primaryColor: '#1a56db', accentColor: '#60a5fa',
    bgStyle: 'linear-gradient(135deg, #020818 0%, #0a1628 50%, #071230 100%)',
    borderStyle: '#1a56db', description: 'Internship completion – TCS', style: 'royal',
  },
  {
    id: 'zoho-neon', name: 'Zoho – Neon Crimson', type: 'internship',
    company: 'Zoho Corporation', companyDomain: 'zoho.com',
    primaryColor: '#e42527', accentColor: '#fb7185',
    bgStyle: 'linear-gradient(135deg, #0d0005 0%, #1e0010 50%, #0a0003 100%)',
    borderStyle: '#e42527', description: 'Software development internship – Zoho', style: 'neon',
  },
  {
    id: 'freshworks-holographic', name: 'Freshworks – Holographic', type: 'internship',
    company: 'Freshworks Inc.', companyDomain: 'freshworks.com',
    primaryColor: '#29b5e8', accentColor: '#a78bfa',
    bgStyle: 'linear-gradient(135deg, #020b18 0%, #06101f 40%, #08051a 100%)',
    borderStyle: '#29b5e8', description: 'Engineering internship – Freshworks', style: 'holographic',
  },
  {
    id: 'razorpay-dark', name: 'Razorpay – Midnight', type: 'internship',
    company: 'Razorpay', companyDomain: 'razorpay.com',
    primaryColor: '#3395ff', accentColor: '#6ee7b7',
    bgStyle: 'linear-gradient(135deg, #040d1a 0%, #071422 60%, #030c17 100%)',
    borderStyle: '#3395ff', description: 'Fintech internship – Razorpay', style: 'dark',
  },
  {
    id: 'google-gold', name: 'Google – Prestige Gold', type: 'internship',
    company: 'Google India', companyDomain: 'google.com',
    primaryColor: '#f59e0b', accentColor: '#fde68a',
    bgStyle: 'linear-gradient(135deg, #0d0800 0%, #1a1000 50%, #0a0700 100%)',
    borderStyle: '#f59e0b', description: 'Software engineering internship – Google', style: 'gold',
  },
  // ── COURSE ──
  {
    id: 'nm-course-royal', name: 'NM – Royal Purple', type: 'course',
    company: 'Naan Mudhalvan', companyDomain: 'naanmudhalvan.tn.gov.in',
    primaryColor: '#7c3aed', accentColor: '#c4b5fd',
    bgStyle: 'linear-gradient(135deg, #060312 0%, #0e0620 50%, #070114 100%)',
    borderStyle: '#7c3aed', description: 'Course completion – NaanMudhalvan', style: 'royal',
  },
  {
    id: 'infosys-course-minimal', name: 'Infosys – Minimal', type: 'course',
    company: 'Infosys Limited', companyDomain: 'infosys.com',
    primaryColor: '#007cc3', accentColor: '#38bdf8',
    bgStyle: 'linear-gradient(135deg, #020d1a 0%, #04162b 50%, #020d1a 100%)',
    borderStyle: '#007cc3', description: 'Technology course – Infosys', style: 'minimal',
  },
  {
    id: 'zoho-course-neon', name: 'Zoho – Emerald Neon', type: 'course',
    company: 'Zoho Corporation', companyDomain: 'zoho.com',
    primaryColor: '#10b981', accentColor: '#6ee7b7',
    bgStyle: 'linear-gradient(135deg, #010d08 0%, #031a10 50%, #010d08 100%)',
    borderStyle: '#10b981', description: 'Development course – Zoho', style: 'neon',
  },
  // ── EXCELLENCE ──
  {
    id: 'nm-excellence-gold', name: 'NM – Excellence Gold', type: 'excellence',
    company: 'Naan Mudhalvan', companyDomain: 'naanmudhalvan.tn.gov.in',
    primaryColor: '#f59e0b', accentColor: '#fbbf24',
    bgStyle: 'linear-gradient(135deg, #0d0800 0%, #1c1000 60%, #0d0800 100%)',
    borderStyle: '#f59e0b', description: 'Excellence award – NaanMudhalvan', style: 'gold',
  },
  {
    id: 'tamilnadu-gov', name: 'TN Govt – Official', type: 'excellence',
    company: 'Government of Tamil Nadu', companyDomain: 'tn.gov.in',
    primaryColor: '#e67e22', accentColor: '#f0a500',
    bgStyle: 'linear-gradient(135deg, #0d0600 0%, #1c0d00 60%, #0d0600 100%)',
    borderStyle: '#e67e22', description: 'Government excellence recognition', style: 'gold',
  },
];

// ── Certificate Render ──────────────────────────────────────────────────────
function CertificateCard({ template, studentName, courseName, date, credentialId }: {
  template: CertTemplate; studentName: string; courseName: string; date: string; credentialId: string;
}) {
  const [logoErr, setLogoErr] = useState(false);
  const p = template.primaryColor;
  const a = template.accentColor;
  const logoUrl = `https://logo.clearbit.com/${template.companyDomain}`;

  const renderStyleElements = () => {
    switch (template.style) {
      case 'holographic':
        return (
          <>
            {/* Holographic shimmer overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
              background: 'linear-gradient(135deg, #ff0080 0%, #7928ca 20%, #0070f3 40%, #00dfd8 60%, #ff0080 80%, #7928ca 100%)',
              backgroundSize: '400% 400%',
            }} />
            {/* Grid lines */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
              backgroundImage: `linear-gradient(${p}40 1px, transparent 1px), linear-gradient(90deg, ${p}40 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
          </>
        );
      case 'neon':
        return (
          <>
            {/* Neon glow rays */}
            <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '120%', height: '60%', background: `radial-gradient(ellipse, ${p}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '40%', background: `radial-gradient(ellipse, ${a}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
            {/* Scanlines */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)' }} />
          </>
        );
      case 'gold':
        return (
          <>
            {/* Gold shimmer */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
              backgroundImage: `repeating-linear-gradient(45deg, ${p} 0, ${p} 1px, transparent 0, transparent 12px)` }} />
            {/* Corner flourishes */}
            {[[0,0,'0 0'], [0,1,'0 0'], [1,0,'0 0'], [1,1,'0 0']].map((_, qi) => (
              <div key={qi} style={{
                position: 'absolute', width: 60, height: 60, pointerEvents: 'none',
                top: qi < 2 ? 12 : 'auto', bottom: qi >= 2 ? 12 : 'auto',
                left: qi % 2 === 0 ? 12 : 'auto', right: qi % 2 === 1 ? 12 : 'auto',
                border: `2px solid ${p}50`, borderRadius: 4,
              }} />
            ))}
          </>
        );
      case 'royal':
        return (
          <>
            {/* Royal center radial */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '80%', height: '80%', background: `radial-gradient(ellipse, ${p}0a 0%, transparent 70%)`, pointerEvents: 'none' }} />
            {/* Ornate corners */}
            {[0,1,2,3].map(qi => (
              <svg key={qi} style={{
                position: 'absolute', width: 70, height: 70, pointerEvents: 'none',
                top: qi < 2 ? 8 : 'auto', bottom: qi >= 2 ? 8 : 'auto',
                left: qi % 2 === 0 ? 8 : 'auto', right: qi % 2 === 1 ? 8 : 'auto',
                transform: `rotate(${qi*90}deg)`, opacity: 0.6,
              }} viewBox="0 0 70 70">
                <path d="M4,4 L28,4 M4,4 L4,28" stroke={p} strokeWidth="1.5" fill="none"/>
                <path d="M4,4 L12,4 L12,12 L4,12 Z" fill={`${p}30`}/>
                <circle cx="4" cy="4" r="2.5" fill={a}/>
              </svg>
            ))}
          </>
        );
      case 'minimal':
        return (
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, transform: 'translateX(-50%)', background: `linear-gradient(180deg, transparent, ${p}30, transparent)`, pointerEvents: 'none' }} />
        );
      case 'dark':
      default:
        return (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
            backgroundImage: `repeating-linear-gradient(60deg, ${p} 0, ${p} 1px, transparent 0, transparent 18px)` }} />
        );
    }
  };

  return (
    <div style={{
      width: '100%', aspectRatio: '1.414 / 1', position: 'relative', overflow: 'hidden',
      borderRadius: 16, background: template.bgStyle,
      border: `1.5px solid ${p}50`,
      boxShadow: `0 0 60px ${p}30, 0 24px 80px rgba(0,0,0,0.7), inset 0 0 60px rgba(0,0,0,0.4)`,
    }}>
      {renderStyleElements()}

      {/* Outer border frame */}
      <div style={{ position: 'absolute', inset: 14, border: `1px solid ${p}35`, borderRadius: 10, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 18, border: `0.5px solid ${p}18`, borderRadius: 8, pointerEvents: 'none' }} />

      {/* Top & Bottom accent bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, transparent 0%, ${p} 30%, ${a} 50%, ${p} 70%, transparent 100%)` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg, transparent 0%, ${p} 30%, ${a} 50%, ${p} 70%, transparent 100%)` }} />

      {/* Content */}
      <div style={{ position: 'absolute', inset: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            {!logoErr ? (
              <div style={{ width: 32, height: 32, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 3, boxShadow: `0 0 10px ${p}50` }}>
                <img src={logoUrl} alt={template.company} width={26} height={26} style={{ objectFit: 'contain' }} onError={() => setLogoErr(true)} />
              </div>
            ) : (
              <div style={{ width: 32, height: 32, background: `${p}20`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${p}40` }}>
                <Award size={16} color={p} />
              </div>
            )}
            <span style={{ fontSize: 10, color: `${p}cc`, fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {template.company}
            </span>
          </div>

          {/* Certificate type label */}
          <div style={{
            display: 'inline-block', fontSize: 7.5, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 700,
            background: `linear-gradient(90deg, ${p}, ${a})`,
            padding: '4px 16px', borderRadius: 99, marginBottom: 8,
            boxShadow: `0 0 16px ${p}60`,
          }}>
            {template.type === 'internship' ? '✦ Certificate of Internship ✦' :
             template.type === 'course'     ? '✦ Certificate of Completion ✦' :
                                              '✦ Certificate of Excellence ✦'}
          </div>

          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${p}60, ${a}60, ${p}60, transparent)`, width: '80%', margin: '6px auto' }} />
        </div>

        {/* Student Name */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 7, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${a}90`, fontFamily: 'Inter, sans-serif', marginBottom: 5 }}>
            Proudly Awarded To
          </div>
          <div style={{
            fontSize: 'clamp(20px, 4.5vw, 32px)', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: 'Georgia, serif',
            textShadow: `0 0 30px ${p}80, 0 2px 0 rgba(0,0,0,0.5)`,
          }}>
            {studentName || 'Student Name'}
          </div>
          <div style={{ height: 1.5, background: `linear-gradient(90deg, transparent, ${a}80, transparent)`, width: '60%', margin: '8px auto' }} />
        </div>

        {/* Course / Role */}
        <div style={{ textAlign: 'center', padding: '0 10%' }}>
          <div style={{ fontSize: 6.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${p}80`, fontFamily: 'Inter, sans-serif', marginBottom: 4 }}>
            {template.type === 'internship' ? 'For Successfully Completing the Internship Program in' :
             template.type === 'course'     ? 'For Successfully Completing' :
                                              'In Recognition of Outstanding Excellence in'}
          </div>
          <div style={{ fontSize: 'clamp(12px, 2.8vw, 17px)', fontWeight: 700, color: a, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
            {courseName || 'Software Development'}
          </div>
          <div style={{ fontSize: 6.5, color: `${p}70`, marginTop: 5, fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
            This certificate recognises outstanding dedication, skill, and perseverance demonstrated throughout the programme.
          </div>
        </div>

        {/* Footer */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          {/* Sig 1 */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: `${a}cc`, marginBottom: 3, fontStyle: 'italic' }}>Authorised</div>
            <div style={{ height: 1, background: `${p}50`, width: '80%', margin: '0 auto 3px' }} />
            <div style={{ fontSize: 6, color: `${p}aa`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Programme Director</div>
          </div>

          {/* Central Seal */}
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              border: `2.5px solid ${p}`,
              background: `radial-gradient(circle, ${p}25 0%, transparent 70%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${p}60, inset 0 0 14px ${p}20`,
              margin: '0 auto 4px',
            }}>
              <Award size={24} color={p} />
            </div>
            <div style={{ fontSize: 5.5, color: `${a}90`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Official Seal</div>
          </div>

          {/* Sig 2 + Date */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: `${a}cc`, marginBottom: 3, fontStyle: 'italic' }}>Certified</div>
            <div style={{ height: 1, background: `${p}50`, width: '80%', margin: '0 auto 3px' }} />
            <div style={{ fontSize: 6, color: `${p}aa`, fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Date: {date || 'Oct 2026'}
            </div>
          </div>
        </div>

        {/* Credential ID */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 5.5, color: `${p}60`, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em' }}>
            Credential ID: {credentialId || 'NM-2026-XXXX-YYYY'} · Verify at naanmudhalvan.tn.gov.in
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function CertificatePage() {
  const { user } = useAuth();
  const [typeFilter,   setTypeFilter]   = useState<'all'|'internship'|'course'|'excellence'>('all');
  const [selected,     setSelected]     = useState<CertTemplate>(TEMPLATES[0]);
  const [studentName,  setStudentName]  = useState(user?.name || 'Your Name');
  const [courseName,   setCourseName]   = useState('Full Stack Web Development with React & Node.js');
  const [date,         setDate]         = useState(new Date().toLocaleDateString('en-IN',{month:'long', year:'numeric'}));
  const [credentialId, setCredentialId] = useState(`NM-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`);
  const [copied,       setCopied]       = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = typeFilter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.type === typeFilter);

  const handlePrint = useCallback(() => {
    if (!printRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<html><head><title>Certificate</title><style>body{margin:0;padding:0;background:#000;}@page{margin:0;size:A4 landscape;}</style></head><body>${printRef.current.outerHTML}</body></html>`);
    win.document.close();
    win.print();
  }, []);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  }, []);

  const STYLE_BADGES: Record<string, { label: string; color: string }> = {
    royal:        { label: '👑 Royal',        color: '#7c3aed' },
    neon:         { label: '⚡ Neon',          color: '#e42527' },
    gold:         { label: '🥇 Gold',          color: '#f59e0b' },
    minimal:      { label: '◾ Minimal',        color: '#6b7280' },
    dark:         { label: '🌑 Dark',          color: '#1e293b' },
    holographic:  { label: '✨ Holographic',   color: '#29b5e8' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 64 }}>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(180deg,rgba(124,58,237,0.08) 0%,transparent 100%)', borderBottom: '1px solid var(--border)', padding: '48px 24px 36px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', padding: '5px 16px', borderRadius: 99, marginBottom: 18, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <Sparkles size={13} /> Premium Certificate Templates
        </div>
        <h1 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(28px,5vw,44px)', color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12 }}>
          Personalise Your <span style={{ background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Certificate</span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>
          10 premium templates across internship, course, and excellence categories. Personalise and download instantly.
        </p>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '36px 24px 80px', display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32 }}>

        {/* ── Left Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Type filter */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['all','internship','course','excellence'] as const).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                style={{
                  flex: 1, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                  background: typeFilter === t ? '#7c3aed' : 'var(--bg-2)',
                  color: typeFilter === t ? '#fff' : 'var(--text-3)',
                  textTransform: 'capitalize', transition: 'all 0.2s',
                }}>
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
            {filtered.map(tpl => {
              const badge = STYLE_BADGES[tpl.style];
              return (
                <button key={tpl.id} onClick={() => setSelected(tpl)}
                  style={{
                    padding: '10px 12px', borderRadius: 12, border: `2px solid ${selected.id === tpl.id ? tpl.primaryColor : 'var(--border)'}`,
                    background: selected.id === tpl.id ? `${tpl.primaryColor}12` : 'var(--bg-2)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
                    boxShadow: selected.id === tpl.id ? `0 0 14px ${tpl.primaryColor}30` : 'none',
                  }}>
                  <div style={{ width: '100%', height: 44, borderRadius: 8, background: tpl.bgStyle, border: `1px solid ${tpl.primaryColor}40`, marginBottom: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={18} color={tpl.primaryColor} />
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text)', marginBottom: 3, lineHeight: 1.3 }}>{tpl.name}</div>
                  <div style={{ fontSize: 9.5, color: badge.color, fontWeight: 600 }}>{badge.label}</div>
                </button>
              );
            })}
          </div>

          {/* Personalise form */}
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>✏️ Personalise</div>
            {[
              { label: 'Student Name', val: studentName, set: setStudentName, ph: 'Your full name' },
              { label: 'Course / Role', val: courseName, set: setCourseName, ph: 'Course or internship title' },
              { label: 'Date', val: date, set: setDate, ph: 'Month Year' },
              { label: 'Credential ID', val: credentialId, set: setCredentialId, ph: 'NM-2026-XXXX' },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>{f.label}</div>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
              <Download size={15} /> Download / Print Certificate
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handlePrint}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>
                <Printer size={14} /> Print
              </button>
              <button onClick={handleShare}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, background: copied ? 'rgba(16,185,129,0.1)' : 'var(--bg-2)', border: `1px solid ${copied ? '#10b981' : 'var(--border)'}`, color: copied ? '#10b981' : 'var(--text)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer', transition: 'all 0.2s' }}>
                {copied ? <CheckCircle size={14} /> : <Share2 size={14} />}
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Certificate Preview ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>{selected.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>{selected.description}</div>
            </div>
            <div style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: `${STYLE_BADGES[selected.style].color}20`,
              color: STYLE_BADGES[selected.style].color,
              border: `1px solid ${STYLE_BADGES[selected.style].color}40`,
            }}>
              {STYLE_BADGES[selected.style].label}
            </div>
          </div>

          <div ref={printRef} style={{ width: '100%', maxWidth: 860, margin: '0 auto' }}>
            <CertificateCard
              template={selected} studentName={studentName}
              courseName={courseName} date={date} credentialId={credentialId}
            />
          </div>

          {/* Template carousel nav */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {TEMPLATES.map(tpl => (
              <button key={tpl.id} onClick={() => setSelected(tpl)}
                style={{
                  width: 10, height: 10, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: selected.id === tpl.id ? tpl.primaryColor : 'var(--border)',
                  transition: 'all 0.2s', transform: selected.id === tpl.id ? 'scale(1.4)' : 'scale(1)',
                }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
