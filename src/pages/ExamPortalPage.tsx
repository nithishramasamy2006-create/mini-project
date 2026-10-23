import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, MapPin, Calendar, Clock, Users, Award, BookOpen,
  Monitor, Building2, Layers, ChevronDown, ChevronRight, ChevronLeft,
  CheckCircle, Flame, Filter, FileText, Download, Bell, Globe,
  Shield, Zap, AlertCircle, Info, Share2, Copy, MessageCircle,
  Link, CheckCheck
} from 'lucide-react';
import {
  EXAMS, EXAM_CATEGORIES, TN_CENTERS, STATUS_META,
  type Exam, type ExamCategory, type ExamMode, type ExamCenter
} from '../examData';
import { useDebounce } from '../hooks';
import { portalGetAll } from '../portalData';

// Merge static + portal-created exams
function getAllExams(): Exam[] {
  const portal = portalGetAll('exam').filter((e: any) => e.status === 'active').map((e: any, i: number): Exam => ({
    id:                   70000 + i,
    title:                e.title || 'Untitled Exam',
    shortTitle:           e.shortTitle || e.title?.split(' ').slice(0,3).join(' ') || '',
    category:             (e.category || 'skill-assessment') as ExamCategory,
    organizer:            e.organizer || 'NaanMudhalvan',
    organizerLogo:        'NM',
    mode:                 (e.mode || 'online') as ExamMode,
    difficulty:           e.difficulty || 'Moderate',
    examDate:             e.examDate || '',
    examTime:             e.examTime || '10:00 AM',
    duration:             e.duration || '120 Minutes',
    price:                e.price || 'Free',
    registrationDeadline: e.registrationDeadline || '',
    admitCardDate:        e.admitCardDate || '',
    resultDate:           e.resultDate || '',
    totalQuestions:       parseInt(e.totalQuestions) || 100,
    totalMarks:           parseInt(e.totalMarks) || 100,
    negativeMarking:      parseFloat(e.negativeMarking) || 0,
    languages:            typeof e.languages === 'string' ? e.languages.split(',').map((s: string) => s.trim()) : ['English'],
    description:          e.description || '',
    syllabus:             [],
    eligibility: {
      branches:  typeof e.eligibilityBranches === 'string' ? e.eligibilityBranches.split(',').map((s: string) => s.trim()) : ['All Branches'],
      years:     typeof e.eligibilityYears === 'string' ? e.eligibilityYears.split(',').map((s: string) => s.trim()) : ['All Years'],
      cgpa:      0,
    },
    benefits:     typeof e.benefits === 'string' ? e.benefits.split(',').map((s: string) => s.trim()) : [],
    totalSeats:   10000,
    registered:   0,
    color:        '#8b5cf6',
    gradient:     'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    _portal:      true as any,
  }));
  return [...EXAMS, ...portal];
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function daysUntil(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}
function pct(reg: number, max: number) { return Math.min(Math.round((reg / max) * 100), 100); }

const MODE_META: Record<ExamMode, { icon: React.ReactNode; label: string; color: string }> = {
  online:  { icon: <Monitor size={12} />,   label: 'Online',  color: '#10b981' },
  offline: { icon: <Building2 size={12} />, label: 'Offline', color: '#3b82f6' },
  hybrid:  { icon: <Layers size={12} />,    label: 'Hybrid',  color: '#f59e0b' },
};

const DIFF_COLOR: Record<string, string> = {
  Easy: '#10b981', Moderate: '#3b82f6', Hard: '#f97316', Expert: '#ef4444'
};

// â”€â”€ Center Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CenterCard({ center, selected, onSelect }: { center: ExamCenter; selected: boolean; onSelect: (id: string) => void }) {
  const fill = pct(center.totalSeats - center.seatsAvailable, center.totalSeats);
  return (
    <div onClick={() => onSelect(center.id)}
      style={{
        borderRadius: 14, border: `2px solid ${selected ? '#7c3aed' : 'var(--border)'}`,
        background: selected ? 'rgba(124,58,237,0.06)' : 'var(--surface)',
        padding: '14px 16px', cursor: 'pointer', transition: 'all 0.18s',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)', marginBottom: 2 }}>{center.city}</div>
          <div style={{ fontSize: 11.5, color: 'var(--accent)', fontWeight: 600 }}>{center.venue}</div>
        </div>
        {selected && <CheckCircle size={18} color="#7c3aed" />}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 4 }}>
        <MapPin size={10} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{center.address}</span>
      </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>📍 {center.landmark} · 📞 {center.phone}</div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Seats available</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: (center.seatsAvailable ?? 0) < 50 ? '#ef4444' : '#10b981' }}>
            {(center.seatsAvailable ?? 0).toLocaleString()} / {(center.totalSeats ?? 0).toLocaleString()}
          </span>
        </div>
        <div style={{ height: 4, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${fill}%`, borderRadius: 999, background: fill > 80 ? '#ef4444' : fill > 60 ? '#f59e0b' : '#7c3aed', transition: 'width 0.4s' }} />
        </div>
      </div>
      <a href={center.mapLink} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        style={{ fontSize: 10.5, color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
        <Globe size={10} /> View on Map ↗
      </a>
    </div>
  );
}

// â”€â”€ Registration Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ExamRegModal({ exam, onClose }: { exam: Exam; onClose: () => void }) {
  type Step = 'details' | 'center' | 'form' | 'review' | 'success';
  const [step,           setStep]    = useState<Step>(exam.mode === 'offline' ? 'details' : 'details');
  const [selectedCenter, setCenter]  = useState<string>('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', college: '', branch: '', year: '', cgpa: '', aadhaar: '',
  });
  const [loading, setLoading] = useState(false);
  const [regNo,   setRegNo]   = useState('');
  const [showShare, setShowShare] = useState(false);
  const [copied,    setCopied]    = useState(false);

  // ── Share helpers ────────────────────────────────────────────
  const shareText = () =>
    `🎓 I just registered for ${exam.title} on NaanMudhalvan!\n` +
    `📋 Reg No: ${regNo}\n` +
    `📅 Exam Date: ${exam.examDate}  ⏰ ${exam.examTime}\n` +
    `Register now: ${window.location.href}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${exam.title} — Admit Card`,
          text: shareText(),
          url: window.location.href,
        });
      } catch {/* user cancelled */}
    }
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(shareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = () =>
    `https://wa.me/?text=${encodeURIComponent(shareText())}`;

  const twitterUrl = () =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `🎓 Just registered for ${exam.title} on @NaanMudhalvan!\n📋 Reg: ${regNo}  📅 ${exam.examDate}\n`
    )}&url=${encodeURIComponent(window.location.href)}`;

  // â”€â”€ Admit Card PDF Generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const downloadAdmitCard = () => {
    const center = exam.centers?.find(c => c.id === selectedCenter);
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Admit Card ”” ${exam.shortTitle}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Arial', sans-serif; background:#f0f4f8; display:flex; justify-content:center; padding:24px; }
    .card { width:780px; background:#fff; border:2px solid #1a1a2e; border-radius:4px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.15); }

    /* HEADER */
    .header { background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%); padding:20px 28px; display:flex; align-items:center; gap:18px; }
    .logo-box { width:58px; height:58px; background:#7c3aed; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; }
    .header-text { flex:1; }
    .header-text h1 { color:#fff; font-size:18px; font-weight:800; letter-spacing:-0.01em; }
    .header-text p { color:#a78bfa; font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; margin-top:3px; }
    .header-right { text-align:right; }
    .header-right .tag { background:rgba(124,58,237,0.3); color:#c4b5fd; font-size:10px; font-weight:800; padding:3px 12px; border-radius:999px; letter-spacing:0.08em; text-transform:uppercase; }
    .header-right .govt { color:#94a3b8; font-size:10px; margin-top:6px; }

    /* ADMIT CARD TITLE BAR */
    .title-bar { background:#7c3aed; padding:8px 28px; text-align:center; }
    .title-bar h2 { color:#fff; font-size:15px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; }

    /* EXAM INFO BANNER */
    .exam-banner { background:#f8f7ff; border-bottom:1px solid #e5e7eb; padding:14px 28px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
    .exam-banner .exam-name { font-size:14px; font-weight:700; color:#1a1a2e; flex:1; line-height:1.3; }
    .exam-banner .reg-badge { background:#7c3aed; color:#fff; font-size:11px; font-weight:800; padding:5px 16px; border-radius:6px; white-space:nowrap; }

    /* BODY */
    .body { padding:20px 28px; }

    /* SECTION TITLE */
    .section-title { font-size:10px; font-weight:800; color:#7c3aed; text-transform:uppercase; letter-spacing:0.1em; border-bottom:2px solid #7c3aed; padding-bottom:4px; margin-bottom:12px; margin-top:20px; }
    .section-title:first-child { margin-top:0; }

    /* INFO GRID */
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; border:1px solid #e5e7eb; border-radius:6px; overflow:hidden; margin-bottom:4px; }
    .info-cell { padding:9px 14px; border-right:1px solid #e5e7eb; border-bottom:1px solid #e5e7eb; }
    .info-cell:nth-child(even) { border-right:none; }
    .info-cell:nth-last-child(-n+2) { border-bottom:none; }
    .info-cell .lbl { font-size:9.5px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:3px; }
    .info-cell .val { font-size:13px; font-weight:700; color:#111827; }

    /* EXAM SCHEDULE */
    .schedule-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:4px; }
    .schedule-box { border:1px solid #e5e7eb; border-radius:8px; padding:10px 12px; text-align:center; background:#fafafa; }
    .schedule-box .icon { font-size:20px; margin-bottom:4px; }
    .schedule-box .lbl { font-size:9px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:3px; }
    .schedule-box .val { font-size:11.5px; font-weight:800; color:#111827; line-height:1.3; }

    /* CENTER */
    .center-box { border:1px solid #dbeafe; border-radius:8px; background:#eff6ff; padding:14px 18px; margin-bottom:4px; }
    .center-box .city { font-size:16px; font-weight:800; color:#1d4ed8; margin-bottom:2px; }
    .center-box .venue { font-size:13px; font-weight:700; color:#1e3a8a; margin-bottom:4px; }
    .center-box .addr { font-size:11.5px; color:#374151; line-height:1.5; }
    .center-box .landmark { font-size:11px; color:#6b7280; margin-top:4px; }

    /* EXAM PATTERN */
    .pattern-table { width:100%; border-collapse:collapse; font-size:12px; }
    .pattern-table th { background:#f3f0ff; color:#7c3aed; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; padding:7px 12px; text-align:left; border:1px solid #e5e7eb; }
    .pattern-table td { padding:7px 12px; border:1px solid #e5e7eb; color:#374151; font-weight:600; }
    .pattern-table tr:nth-child(even) td { background:#fafafa; }

    /* INSTRUCTIONS */
    .instructions { background:#fff8f0; border:1px solid #fed7aa; border-radius:8px; padding:14px 16px; }
    .instructions h4 { color:#c2410c; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.07em; margin-bottom:8px; }
    .instructions ol { padding-left:18px; }
    .instructions li { font-size:11.5px; color:#374151; margin-bottom:5px; line-height:1.4; }

    /* FOOTER */
    .footer { background:#1a1a2e; padding:12px 28px; display:flex; align-items:center; justify-content:space-between; margin-top:20px; }
    .footer .left { color:#94a3b8; font-size:10px; }
    .footer .stamp { border:2px solid #7c3aed; padding:4px 14px; border-radius:4px; color:#a78bfa; font-size:10px; font-weight:800; letter-spacing:0.1em; }

    /* WATERMARK */
    .watermark { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-35deg); font-size:72px; font-weight:900; color:rgba(124,58,237,0.04); pointer-events:none; white-space:nowrap; letter-spacing:0.1em; }

    @media print {
      body { background:#fff; padding:0; }
      .card { box-shadow:none; border:1px solid #000; }
      .watermark { color:rgba(0,0,0,0.04); }
    }
  </style>
</head>
<body>
<div class="watermark">NaanMudhalvan</div>
<div class="card">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-box">⚡</div>
    <div class="header-text">
      <h1>NaanMudhalvan</h1>
      <p>Learning Marketplace ”” Tamil Nadu</p>
    </div>
    <div class="header-right">
      <div class="tag">Hall Ticket</div>
      <div class="govt" style="margin-top:6px;">Govt. of Tamil Nadu Initiative</div>
      <div class="govt">Issued: ${new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</div>
    </div>
  </div>

  <!-- TITLE BAR -->
  <div class="title-bar"><h2>Admit Card / Hall Ticket</h2></div>

  <!-- EXAM BANNER -->
  <div class="exam-banner">
    <div class="exam-name">${exam.title}</div>
    <div class="reg-badge">Reg. No: ${regNo}</div>
  </div>

  <div class="body">

    <!-- CANDIDATE DETAILS -->
    <div class="section-title">Candidate Details</div>
    <div class="info-grid">
      <div class="info-cell"><div class="lbl">Full Name</div><div class="val">${form.name}</div></div>
      <div class="info-cell"><div class="lbl">Email Address</div><div class="val">${form.email}</div></div>
      <div class="info-cell"><div class="lbl">Mobile Number</div><div class="val">${form.phone}</div></div>
      <div class="info-cell"><div class="lbl">Aadhaar (Last 4)</div><div class="val">XXXX-XXXX-XX${form.aadhaar || 'XXXX'}</div></div>
      <div class="info-cell"><div class="lbl">College / Institution</div><div class="val">${form.college}</div></div>
      <div class="info-cell"><div class="lbl">Branch / Department</div><div class="val">${form.branch}</div></div>
      <div class="info-cell"><div class="lbl">Year of Study</div><div class="val">${form.year}</div></div>
      <div class="info-cell"><div class="lbl">CGPA</div><div class="val">${form.cgpa || 'Not Provided'}</div></div>
    </div>

    <!-- EXAM SCHEDULE -->
    <div class="section-title" style="margin-top:18px;">Exam Schedule</div>
    <div class="schedule-grid">
      <div class="schedule-box"><div class="icon">📅</div><div class="lbl">Exam Date</div><div class="val">${exam.examDate}</div></div>
      <div class="schedule-box"><div class="icon">⏰</div><div class="lbl">Exam Time</div><div class="val">${exam.examTime}</div></div>
      <div class="schedule-box"><div class="icon">⏱ï¸</div><div class="lbl">Duration</div><div class="val">${exam.duration}</div></div>
      <div class="schedule-box"><div class="icon">ðŸ…</div><div class="lbl">Admit Card Date</div><div class="val">${exam.admitCardDate}</div></div>
    </div>

    <!-- EXAM CENTER -->
    ${center ? `
    <div class="section-title" style="margin-top:18px;">Exam Center</div>
    <div class="center-box">
      <div class="city">📍 ${center.city}, Tamil Nadu</div>
      <div class="venue">${center.venue}</div>
      <div class="addr">${center.address} &nbsp;&bull;&nbsp; PIN: ${center.pincode}</div>
      <div class="landmark">Landmark: ${center.landmark} &nbsp;&bull;&nbsp; 📞 ${center.phone}</div>
    </div>` : `
    <div class="section-title" style="margin-top:18px;">Exam Mode</div>
    <div class="center-box" style="background:#f0fdf4;border-color:#bbf7d0;">
      <div class="city" style="color:#15803d;">🌐 Online Exam</div>
      <div class="venue" style="color:#166534;">Login via NaanMudhalvan Exam Portal</div>
      <div class="addr">https://exam.naanmudhalvan.tn.gov.in</div>
      <div class="landmark">Ensure stable internet. Use Chrome/Edge browser. No VPN.</div>
    </div>`}

    <!-- EXAM PATTERN -->
    <div class="section-title" style="margin-top:18px;">Exam Pattern</div>
    <table class="pattern-table">
      <thead><tr><th>Section</th><th>Questions</th><th>Marks</th></tr></thead>
      <tbody>
        ${(exam.pattern?.sections ?? [{name:'General',questions:exam.totalQuestions??100,marks:exam.totalMarks??100}]).map(s => `<tr><td>${s.name}</td><td>${s.questions}</td><td>${s.marks}</td></tr>`).join('')}
        <tr><td style="font-weight:800;color:#111;">Total</td><td style="font-weight:800;">${exam.pattern?.totalQuestions ?? exam.totalQuestions ?? 100}</td><td style="font-weight:800;">${exam.pattern?.totalMarks ?? exam.totalMarks ?? 100}</td></tr>
      </tbody>
    </table>
    <p style="font-size:11px;color:#6b7280;margin-top:6px;">Negative Marking: ${(exam.pattern?.negativeMarking ?? 0) > 0 ? `âˆ’${exam.pattern?.negativeMarking} mark per wrong answer` : 'No negative marking'} &nbsp;|&nbsp; Language: ${(exam.languages ?? ['English']).join(', ')}</p>

    <!-- INSTRUCTIONS -->
    <div class="section-title" style="margin-top:18px;">Important Instructions</div>
    <div class="instructions">
      <h4>⚠️ Read Carefully Before the Exam</h4>
      <ol>
        <li>Carry this Admit Card along with a valid Government Photo ID (Aadhaar Card / College ID) to the exam center.</li>
        <li>Report to the exam center at least <strong>30 minutes before</strong> the scheduled exam time.</li>
        <li>Mobile phones, smartwatches, earphones, and electronic devices are strictly prohibited inside the exam hall.</li>
        <li>Use only blue or black ballpoint pen for OMR sheet (offline exams). Do not use pencil or correction fluid.</li>
        <li>Candidates arriving after the exam starts will NOT be permitted to enter the hall.</li>
        <li>This admit card is system-generated and does not require a physical signature or stamp.</li>
        <li>For online exams: ensure stable internet, use latest Chrome/Edge, no extensions active, and complete a mock test 24 hours before.</li>
        <li>Result will be declared on: <strong>${exam.resultDate}</strong>. Check the NaanMudhalvan portal for results.</li>
      </ol>
    </div>

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="left">
      <div style="color:#e2e8f0;font-weight:700;margin-bottom:2px;">NaanMudhalvan Exam Cell</div>
      <div>exam@naanmudhalvan.tn.gov.in &nbsp;|&nbsp; 1800-425-5555 (Toll Free)</div>
    </div>
    <div class="stamp">VERIFIED ✓</div>
  </div>

</div>
<script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (win) { win.document.write(html); win.document.close(); }
  };
  const steps = exam.mode === 'offline'
    ? ['details', 'center', 'form', 'review', 'success']
    : ['details', 'form', 'review', 'success'];
  const stepIdx = steps.indexOf(step);
  const totalSteps = steps.length - 1; // exclude success

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const rn = `NM${exam.id}${Date.now().toString().slice(-6)}`;
    setRegNo(rn);
    // persist
    const saved = JSON.parse(localStorage.getItem('nm_exam_registrations') || '[]');
    saved.push({ examId: exam.id, regNo: rn, center: selectedCenter, form, date: new Date().toISOString() });
    localStorage.setItem('nm_exam_registrations', JSON.stringify(saved));
    setLoading(false);
    setStep('success');
  };

  const STEPS_LABELS: Record<string, string> = {
    details: 'Exam Info', center: 'Choose Center', form: 'Personal Details', review: 'Review',
  };

  const centerObj = exam.centers?.find(c => c.id === selectedCenter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        style={{ width: '100%', maxWidth: 620, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 22, overflow: 'hidden', maxHeight: '94vh', display: 'flex', flexDirection: 'column' }}>

        {/* â”€â”€ Fixed Header â”€â”€ */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', background: `linear-gradient(135deg,${exam.color}14,transparent)`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: step !== 'success' ? 16 : 0 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 7, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: exam.color, background: `${exam.color}18`, padding: '2px 9px', borderRadius: 999, textTransform: 'uppercase' }}>
                  {exam.icon} {exam.shortTitle}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 999, background: `${(MODE_META[exam.mode] ?? MODE_META['online']).color}15`, color: (MODE_META[exam.mode] ?? MODE_META['online']).color }}>
                  {(MODE_META[exam.mode] ?? MODE_META['online']).icon} {(MODE_META[exam.mode] ?? MODE_META['online']).label}
                </span>
              </div>
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1.3 }}>{exam.title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 7, color: 'var(--text-2)', flexShrink: 0 }}>
              <X size={15} />
            </button>
          </div>

          {/* Step indicator */}
          {step !== 'success' && (
            <div style={{ display: 'flex', gap: 4 }}>
              {steps.filter(s => s !== 'success').map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 3, borderRadius: 999, background: i <= stepIdx ? exam.color : 'var(--border)', transition: 'background 0.3s' }} />
                  <div style={{ fontSize: 9.5, color: i <= stepIdx ? exam.color : 'var(--text-3)', fontWeight: i <= stepIdx ? 700 : 400, marginTop: 4, textAlign: 'center' }}>
                    {STEPS_LABELS[s]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* â”€â”€ Scrollable Body â”€â”€ */}
        <div style={{ overflowY: 'auto', flex: 1 }}>

          {/* STEP: details */}
          {step === 'details' && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
                {[
                  { icon: <Calendar size={13} />, label: 'Exam Date',   val: exam.examDate },
                  { icon: <Clock size={13} />,    label: 'Exam Time',   val: exam.examTime },
                  { icon: <FileText size={13} />, label: 'Duration',    val: exam.duration },
                  { icon: <Users size={13} />,    label: 'Questions',   val: `${exam.pattern?.totalQuestions ?? exam.totalQuestions ?? 100} Qs · ${exam.pattern?.totalMarks ?? exam.totalMarks ?? 100} Marks` },
                  { icon: <Shield size={13} />,   label: 'Negative Marking', val: (exam.pattern?.negativeMarking ?? exam.negativeMarking ?? 0) > 0 ? `âˆ’${exam.pattern?.negativeMarking ?? exam.negativeMarking} per wrong` : 'No negative marking' },
                  { icon: <Award size={13} />,    label: 'Certificate', val: exam.certificateOnPass ? 'On passing' : 'Participation only' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '10px 13px', borderRadius: 11, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: exam.color, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text)' }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Exam Sections</p>
              <div style={{ marginBottom: 18 }}>
                {(exam.pattern?.sections ?? [{ name: 'General', questions: exam.totalQuestions ?? 100, marks: exam.totalMarks ?? 100 }]).map(sec => (
                  <div key={sec.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{sec.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)' }}>{sec.questions} Qs · {sec.marks} Marks</span>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Eligibility</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {[...exam.eligibility.branches, ...exam.eligibility.years, ...(exam.eligibility.others || [])].map(e => (
                  <span key={e} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: `${exam.color}14`, color: exam.color, border: `1px solid ${exam.color}30` }}>{e}</span>
                ))}
                {exam.eligibility.minCGPA && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>Min CGPA {exam.eligibility.minCGPA}</span>
                )}
              </div>

              <button className="btn btn-primary" onClick={() => setStep(exam.mode === 'offline' ? 'center' : 'form')}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14, fontWeight: 700, marginTop: 16, background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)`, borderColor: exam.color }}>
                Continue → {exam.mode === 'offline' ? 'Choose Exam Center' : 'Personal Details'}
              </button>
            </div>
          )}

          {/* STEP: center selection (offline/hybrid) */}
          {step === 'center' && exam.centers && (
            <div style={{ padding: '20px 24px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 18 }}>
                Select your preferred exam center. Seats are allocated on first-come, first-served basis.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 18 }}>
                {exam.centers.map(c => (
                  <CenterCard key={c.id} center={c} selected={selectedCenter === c.id} onSelect={setCenter} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep('details')} style={{ flex: 1, justifyContent: 'center' }}>â† Back</button>
                <button className="btn btn-primary" disabled={!selectedCenter} onClick={() => setStep('form')}
                  style={{ flex: 2, justifyContent: 'center', background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)`, borderColor: exam.color, opacity: !selectedCenter ? 0.5 : 1 }}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP: form */}
          {step === 'form' && (
            <div style={{ padding: '20px 24px' }}>
              {exam.mode !== 'online' && centerObj && (
                <div style={{ padding: '10px 14px', borderRadius: 11, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building2 size={14} color="#7c3aed" />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{centerObj.city} ”” {centerObj.venue}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{centerObj.address}</div>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { key: 'name',    label: 'Full Name *',   placeholder: 'As per Aadhaar' },
                  { key: 'email',   label: 'Email *',        placeholder: 'you@college.edu', type: 'email' },
                  { key: 'phone',   label: 'Mobile *',       placeholder: '+91 XXXXX XXXXX', type: 'tel' },
                  { key: 'aadhaar', label: 'Aadhaar (Last 4 digits) *', placeholder: 'XXXX', type: 'number', maxLength: 4 },
                  { key: 'college', label: 'College *',      placeholder: 'Full college name' },
                  { key: 'branch',  label: 'Branch *',       placeholder: 'e.g. CSE, IT' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <input className="inp" required type={(f as any).type || 'text'}
                      maxLength={(f as any).maxLength}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Year *</label>
                  <select className="inp" required value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} style={{ fontSize: 13 }}>
                    <option value="">Select Year</option>
                    {exam.eligibility.years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>CGPA {exam.eligibility.minCGPA ? `(Min: ${exam.eligibility.minCGPA}) *` : '(Optional)'}</label>
                  <input className="inp" type="number" step="0.01" min="0" max="10"
                    value={form.cgpa} onChange={e => setForm(p => ({ ...p, cgpa: e.target.value }))}
                    placeholder="e.g. 8.4" style={{ fontSize: 13 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep(exam.mode === 'offline' ? 'center' : 'details')} style={{ flex: 1, justifyContent: 'center' }}>â† Back</button>
                <button className="btn btn-primary"
                  disabled={!form.name || !form.email || !form.phone || !form.college || !form.branch || !form.year}
                  onClick={() => setStep('review')}
                  style={{ flex: 2, justifyContent: 'center', background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)`, borderColor: exam.color, opacity: (!form.name || !form.email || !form.phone || !form.college || !form.branch || !form.year) ? 0.5 : 1 }}>
                  Review Application →
                </button>
              </div>
            </div>
          )}

          {/* STEP: review */}
          {step === 'review' && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--bg-2)', border: '1px solid var(--border)', marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Candidate Details</p>
                {[
                  ['Name',    form.name],
                  ['Email',   form.email],
                  ['Phone',   form.phone],
                  ['College', form.college],
                  ['Branch',  form.branch],
                  ['Year',    form.year],
                  ['CGPA',    form.cgpa || '””'],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>{label}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{val}</span>
                  </div>
                ))}
                {centerObj && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>Exam Center</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)' }}>{centerObj.city} ”” {centerObj.venue}</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 11, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  Admit card will be released on <strong>{exam.admitCardDate}</strong>. Please carry a valid government ID (Aadhaar/College ID) to the exam center.
                </div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 11, background: 'var(--bg-2)', border: '1px solid var(--border)', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Registration Fee</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: exam.price === 'Free' ? '#10b981' : 'var(--accent)' }}>{exam.price}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" onClick={() => setStep('form')} style={{ flex: 1, justifyContent: 'center' }}>â† Edit</button>
                <button className="btn btn-primary" disabled={loading} onClick={handleSubmit}
                  style={{ flex: 2, justifyContent: 'center', fontSize: 14, fontWeight: 700, padding: '13px', background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)`, borderColor: exam.color }}>
                  {loading ? '⏳ Registering…' : `✓ Confirm Registration ”” ${exam.price}`}
                </button>
              </div>
            </div>
          )}

          {/* STEP: success */}
          {step === 'success' && (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 20 }}>
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: `${exam.color}18`, border: `2px solid ${exam.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', fontSize: 40 }}>
                  ✅
                </div>
              </motion.div>
              <h3 className="font-display" style={{ fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 8 }}>Registration Confirmed!</h3>
              <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 999, background: `${exam.color}15`, border: `1px solid ${exam.color}30`, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: exam.color }}>Reg. No: {regNo}</span>
              </div>
              <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 6, lineHeight: 1.7 }}>
                A confirmation has been sent to <strong>{form.email}</strong>
              </p>
              {centerObj && (
                <div style={{ padding: '12px 18px', borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)', marginBottom: 20, textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>📍 Your Exam Center</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 600 }}>{centerObj.venue}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{centerObj.address}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{centerObj.landmark}</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
                {[
                  { icon: '📅', label: 'Exam Date',  val: exam.examDate },
                  { icon: '⏰', label: 'Exam Time',  val: exam.examTime },
                  { icon: '🎟ï¸', label: 'Admit Card', val: exam.admitCardDate },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text)' }}>{item.val}</div>
                  </div>
                ))}
              </div>
              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <button onClick={onClose} className="btn btn-ghost" style={{ padding: '10px 20px' }}>Close</button>
                <button className="btn btn-primary"
                  style={{ padding: '10px 20px', background: `linear-gradient(135deg, ${exam.color}, ${exam.color}cc)`, borderColor: exam.color }}
                  onClick={downloadAdmitCard}>
                  <Download size={14} /> Download Admit Card
                </button>

                {/* Share button + dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowShare(s => !s)}
                    style={{ padding: '10px 20px', borderRadius: 11, background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 12px rgba(16,185,129,0.3)' }}>
                    <Share2 size={15} /> Share Ticket
                  </button>

                  <AnimatePresence>
                    {showShare && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          position: 'absolute', bottom: '110%', right: 0, zIndex: 999,
                          background: 'var(--surface)', border: '1px solid var(--border)',
                          borderRadius: 16, padding: 14, minWidth: 240,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                        }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Share Your Ticket</div>

                        {/* Native share (mobile) */}
                        {'share' in navigator && (
                          <button onClick={handleNativeShare}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: `${exam.color}12`, border: `1px solid ${exam.color}25`, color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 7 }}>
                            <Share2 size={15} style={{ color: exam.color }} />
                            Share via Device
                          </button>
                        )}

                        {/* WhatsApp */}
                        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'none', marginBottom: 7 }}>
                          <MessageCircle size={15} style={{ color: '#25d366' }} />
                          Share on WhatsApp
                        </a>

                        {/* Twitter */}
                        <a href={twitterUrl()} target="_blank" rel="noopener noreferrer"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(29,161,242,0.1)', border: '1px solid rgba(29,161,242,0.25)', color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'none', marginBottom: 7 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="#1da1f2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.846l4.25 5.619 5.898-5.619Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          Post on Twitter / X
                        </a>

                        {/* Copy text */}
                        <button onClick={handleCopyText}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 7 }}>
                          <Copy size={15} style={{ color: '#f59e0b' }} />
                          {copied ? 'Copied! ✅' : 'Copy Share Text'}
                        </button>

                        {/* Copy link */}
                        <button onClick={handleCopyLink}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                          <Link size={15} style={{ color: '#7c3aed' }} />
                          {copied ? <><CheckCheck size={13} style={{color:'#10b981'}}/>Copied!</> : 'Copy Page Link'}
                        </button>

                        {/* Close dropdown */}
                        <button onClick={() => setShowShare(false)}
                          style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4 }}>
                          <X size={13} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ExamPortalPage() {
  const [cat,      setCat]      = useState<ExamCategory | 'all'>('all');
  const [modeF,    setModeF]    = useState<ExamMode | 'all'>('all');
  const [priceF,   setPriceF]   = useState<'all' | 'free' | 'paid'>('all');
  const [q,        setQ]        = useState('');
  const dQ = useDebounce(q, 180);
  const [selected, setSelected] = useState<Exam | null>(null);
  const [expandSyllabus, setExpandSyllabus] = useState<number | null>(null);
  const [registered] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('nm_exam_registrations') || '[]').map((r: any) => r.examId); }
    catch { return []; }
  });

  const allExams = useMemo(() => getAllExams(), []);

  const filtered = useMemo(() => allExams.filter(e => {
    if (cat   !== 'all' && e.category !== cat)   return false;
    if (modeF !== 'all' && e.mode    !== modeF)  return false;
    if (priceF === 'free' && e.price !== 'Free')  return false;
    if (priceF === 'paid' && e.price === 'Free')  return false;
    if (dQ) {
      const q2 = dQ.toLowerCase();
      return e.title.toLowerCase().includes(q2) || e.organizer.toLowerCase().includes(q2) ||
        (e.tags||[]).some((t:string) => t.toLowerCase().includes(q2)) || e.category.toLowerCase().includes(q2);
    }
    return true;
  }), [allExams, cat, modeF, priceF, dQ]);

  const stats = [
    { label: 'Total Exams',     val: allExams.length,                              icon: '📋', color: '#7c3aed' },
    { label: 'Online',          val: allExams.filter(e=>e.mode==='online').length,  icon: '🌐', color: '#10b981' },
    { label: 'Offline Centers', val: TN_CENTERS.length,                            icon: '📍', color: '#3b82f6' },
    { label: 'Free Exams',      val: allExams.filter(e=>e.price==='Free').length,   icon: '🄓', color: '#f59e0b' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 60 }}>

      {/* ╔╔╔ HERO ╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔ */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '52px 24px 44px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(59,130,246,0.07) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 700, height: 350, background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', padding: '4px 14px', borderRadius: 999, marginBottom: 18, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <FileText size={12} /> Online & Offline Exam Portal
          </span>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.15 }}>
            Register for <span style={{ background: 'linear-gradient(135deg,#3b82f6,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Certification Exams</span><br />
            & Skill Assessments
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Government-certified skill tests, placement aptitude exams, and technical assessments available at <strong style={{ color: 'var(--text)' }}>10+ centers</strong> across Tamil Nadu and online.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
            <input className="inp" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search exams, skills, categories…"
              style={{ paddingLeft: 46, paddingRight: q ? 40 : 16, fontSize: 14.5, height: 52, borderRadius: 14 }} />
            {q && <button onClick={() => setQ('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}><X size={15} /></button>}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 36, marginTop: 36, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 2 }}>{s.icon}</div>
              <div className="font-display" style={{ fontWeight: 800, fontSize: 26, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ╔╔╔ EXAM CENTERS MAP STRIP ╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔ */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          {[...TN_CENTERS, ...TN_CENTERS].map((c, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 999, background: 'var(--bg-2)', border: '1px solid var(--border)', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 600, color: 'var(--text-2)', flexShrink: 0 }}>
              <MapPin size={11} color="#3b82f6" /> {c.city} ”” {c.venue}
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1340, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ╔╔╔ FILTERS ╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔ */}
        <div style={{ marginBottom: 28 }}>
          {/* Category */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 12, paddingBottom: 4 }}>
            {EXAM_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id as typeof cat)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, whiteSpace: 'nowrap', cursor: 'pointer', fontSize: 13, fontWeight: 600, border: `1.5px solid ${cat === c.id ? c.color : 'var(--border)'}`, background: cat === c.id ? `${c.color}15` : 'var(--surface)', color: cat === c.id ? c.color : 'var(--text-2)', transition: 'all 0.18s' }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Mode + Price */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'online', 'offline', 'hybrid'] as const).map(m => (
                <button key={m} onClick={() => setModeF(m)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600, border: `1.5px solid ${modeF === m ? 'var(--accent)' : 'var(--border)'}`, background: modeF === m ? 'rgba(124,58,237,0.1)' : 'var(--surface)', color: modeF === m ? 'var(--accent)' : 'var(--text-2)', transition: 'all 0.18s' }}>
                  {m === 'all' ? '🌐 All Modes' : m === 'online' ? <><Monitor size={12} /> Online</> : m === 'offline' ? <><Building2 size={12} /> Offline</> : <><Layers size={12} /> Hybrid</>}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              {(['all', 'free', 'paid'] as const).map(p => (
                <button key={p} onClick={() => setPriceF(p)}
                  style={{ padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600, border: `1.5px solid ${priceF === p ? 'var(--accent)' : 'var(--border)'}`, background: priceF === p ? 'rgba(124,58,237,0.1)' : 'var(--surface)', color: priceF === p ? 'var(--accent)' : 'var(--text-2)', transition: 'all 0.18s' }}>
                  {p === 'all' ? 'All Prices' : p === 'free' ? '🄓 Free' : 'ðŸ’³ Paid'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>{filtered.length}</span> exam{filtered.length !== 1 ? 's' : ''} available
          {dQ && <span> · matching "<strong style={{ color: 'var(--accent)' }}>{dQ}</strong>"</span>}
        </p>

        {/* ╔╔╔ EXAM CARDS GRID ╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔ */}
        <AnimatePresence mode="sync">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No exams found</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: 20 }}>Try different filters or search terms</p>
              <button onClick={() => { setCat('all'); setModeF('all'); setPriceF('all'); setQ(''); }} className="btn btn-primary btn-sm">Clear Filters</button>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 22 }}>
              {filtered.map((exam, i) => {
                const status   = STATUS_META[exam.status] ?? STATUS_META['open'];
                const modeMeta = MODE_META[exam.mode] ?? MODE_META['online'];
                const deadline = daysUntil(exam.registrationDeadline);
                const fillPct  = pct(exam.totalRegistered ?? 0, exam.maxRegistrations ?? 1000);
                const isReg    = registered.includes(exam.id);
                const expanded = expandSyllabus === exam.id;
                const examColor = (typeof exam.color === 'string' && exam.color.length > 0) ? exam.color : '#7c3aed';

                return (
                  <motion.article key={exam.id}
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.36, delay: Math.min(i * 0.05, 0.24), ease: [0.22,1,0.36,1] }}
                    style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                    whileHover={{ y: -3, boxShadow: `0 10px 36px rgba(0,0,0,0.12)` }}>

                    {/* Color top bar */}
                    <div style={{ height: 5, background: `linear-gradient(90deg, ${examColor}, ${examColor}80)` }} />

                    <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                      {/* Row 1: icon + badges */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${examColor}18`, border: `1px solid ${examColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          {exam.icon}
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 999, background: modeMeta.color + '18', color: modeMeta.color }}>
                            {modeMeta.icon} {modeMeta.label}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 999, background: status.bg, color: status.color }}>
                            {status.label}
                          </span>
                          {exam.featured && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 9px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>â­ Featured</span>}
                        </div>
                      </div>

                      {/* Organizer + Title */}
                      <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 5, fontWeight: 500 }}>{exam.organizerLogo} {exam.organizer}</div>
                      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', lineHeight: 1.35, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {exam.title}
                      </h3>

                      {/* Info grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {[
                          { icon: <Calendar size={11} />, label: 'Exam Date', val: exam.examDate },
                          { icon: <Clock size={11} />,    label: 'Duration',  val: exam.duration },
                          { icon: <FileText size={11} />, label: 'Questions', val: `${exam.pattern?.totalQuestions ?? exam.totalQuestions ?? 100} Qs · ${exam.pattern?.totalMarks ?? exam.totalMarks ?? 100}M` },
                          { icon: <Globe size={11} />,    label: 'Language',  val: exam.languages.join(', ') },
                        ].map((it, idx) => (
                          <div key={idx} style={{ padding: '8px 10px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: examColor, marginBottom: 3 }}>{it.icon}</div>
                            <div style={{ fontSize: 9.5, color: 'var(--text-3)', marginBottom: 1 }}>{it.label}</div>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text)' }}>{it.val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Difficulty + Negative marking */}
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: DIFF_COLOR[exam.difficulty] + '18', color: DIFF_COLOR[exam.difficulty] }}>
                          {exam.difficulty}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: (exam.pattern?.negativeMarking ?? 0) > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: (exam.pattern?.negativeMarking ?? 0) > 0 ? '#ef4444' : '#10b981' }}>
                          {(exam.pattern?.negativeMarking ?? 0) > 0 ? `⚠️ −${exam.pattern?.negativeMarking} Negative` : '✅ No Negative'}
                        </span>
                        {exam.certificateOnPass && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>🏅 Certificate</span>}
                      </div>

                      {/* Offline centers preview */}
                      {exam.centers && exam.centers.length > 0 && (
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                          {exam.centers.slice(0, 5).map(c => (
                            <span key={c.id} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <MapPin size={9} />{c.city}
                            </span>
                          ))}
                          {exam.centers.length > 5 && <span style={{ fontSize: 10, color: 'var(--text-3)', padding: '2px 4px' }}>+{exam.centers.length - 5} more</span>}
                        </div>
                      )}

                      {/* Syllabus toggle */}
                      <button onClick={() => setExpandSyllabus(expanded ? null : exam.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 0', fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: expanded ? 10 : 14 }}>
                        <BookOpen size={13} /> View Syllabus {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', marginBottom: 14 }}>
                            {(exam.syllabus ?? []).map(unit => (
                              <div key={unit.unit} style={{ marginBottom: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{unit.unit}</span>
                                  <span style={{ fontSize: 10.5, fontWeight: 700, color: examColor }}>{unit.marks}M</span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {unit.topics.map(t => (
                                    <span key={t} style={{ fontSize: 10, color: 'var(--text-3)', background: 'var(--border)', padding: '2px 7px', borderRadius: 999 }}>{t}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Registration progress */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{(exam.totalRegistered ?? 0).toLocaleString()} registered</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: fillPct > 80 ? '#ef4444' : 'var(--text-3)' }}>{fillPct}% full</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${fillPct}%`, borderRadius: 999, background: fillPct > 80 ? '#ef4444' : fillPct > 60 ? '#f59e0b' : examColor, transition: 'width 0.5s' }} />
                        </div>
                      </div>

                      {/* Footer: deadline + price + CTA */}
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 1 }}>Reg. closes</div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: deadline <= 3 ? '#ef4444' : deadline <= 7 ? '#f59e0b' : '#10b981' }}>
                            {deadline < 0 ? 'Closed' : deadline === 0 ? 'Last Day!' : `${deadline}d left ”” ${exam.registrationDeadline}`}
                          </div>
                        </div>
                        {isReg ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontWeight: 700, fontSize: 12 }}>
                            <CheckCircle size={13} /> Registered
                          </div>
                        ) : (
                          <button className="btn btn-primary"
                            onClick={() => setSelected(exam)}
                            disabled={exam.status === 'closed'}
                            style={{ padding: '9px 18px', fontSize: 13, fontWeight: 700, background: `linear-gradient(135deg, ${examColor}, ${examColor}cc)`, borderColor: examColor, opacity: exam.status === 'closed' ? 0.5 : 1, cursor: exam.status === 'closed' ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                            {exam.price === 'Free' ? '🄓 Register' : `Register · ${exam.price}`}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ╔╔╔ REGISTRATION MODAL ╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔╔ */}
      <AnimatePresence>
        {selected && <ExamRegModal exam={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
