import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BookOpen, Award, User, LogOut,
  TrendingUp, Clock, CheckCircle, XCircle, Star, Briefcase,
  Heart, Home, Save, Bell, Trophy, Users, Zap, Calendar,
  MapPin, Globe, ChevronRight, Edit3, Bookmark, GraduationCap,
  Monitor, Building2, Play, Target, Flame, MessageSquare, Layers,
  Download, Lock, Eye, Video, Send, X, Printer, Ticket, QrCode, ExternalLink
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ALL_COURSES } from '../courseData';
import { EXAMS } from '../examData';
import { EVENTS } from '../eventsData';
import { PROJECTS } from '../data';
import { portalGetAll } from '../portalData';
import { getCertificatesForStudent, getAllCertificateTemplates, issueCourseCertificate, type IssuedCertificate } from '../certificateData';
import CertificateRenderer, { CertificateThumbnail, printCertificateWindow } from '../components/CertificateRenderer';
import StudentResumeBuilder from '../components/StudentResumeBuilder';

// ── Types ─────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'projects' | 'courses' | 'internships' | 'events' |
           'exams' | 'jobs' | 'mentors' | 'leaderboard' | 'certificates' | 'resume' | 'profile';

const STATUS_COLOR: Record<string, string> = {
  pending:'#f59e0b', reviewed:'#3b82f6', shortlisted:'#7c3aed',
  interview:'#06b6d4', hired:'#10b981', rejected:'#ef4444', accepted:'#10b981',
};
const STATUS_ICON: Record<string, string> = {
  pending:'⏳', reviewed:'👁️', shortlisted:'⭐', interview:'🎙️', hired:'✅', accepted:'✅', rejected:'❌',
};

// ── Sidebar Nav ───────────────────────────────────────────────────
const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id:'dashboard',    label:'Dashboard',    icon:<LayoutDashboard size={16}/> },
  { id:'courses',      label:'My Learning',  icon:<Play size={16}/> },
  { id:'projects',     label:'Projects',     icon:<Target size={16}/> },
  { id:'internships',  label:'Internships',  icon:<Briefcase size={16}/> },
  { id:'events',       label:'Events',       icon:<Calendar size={16}/> },
  { id:'exams',        label:'Exams',        icon:<FileText size={16}/> },
  { id:'jobs',         label:'Jobs',         icon:<Building2 size={16}/> },
  { id:'mentors',      label:'Mentors',      icon:<Users size={16}/> },
  { id:'leaderboard',  label:'Leaderboard',  icon:<Trophy size={16}/> },
  { id:'certificates', label:'Certificates', icon:<Award size={16}/> },
  { id:'resume',       label:'Resume Studio', icon:<FileText size={16}/>, badge:'8 Designs' },
  { id:'profile',      label:'My Profile',   icon:<User size={16}/> },
];

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }: any) {
  return (
    <div style={{ padding:'18px 20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:46, height:46, borderRadius:13, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <span style={{ color, fontSize:22 }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize:22, fontWeight:800, color:'var(--text)', lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:10.5, color:color, fontWeight:600, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────
function SectionHeader({ title, sub, action, link }: any) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
      <div>
        <h2 className="font-display" style={{ fontWeight:700, fontSize:20, color:'var(--text)', marginBottom:2 }}>{title}</h2>
        {sub && <p style={{ fontSize:12.5, color:'var(--text-3)' }}>{sub}</p>}
      </div>
      {link && <Link to={link} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>{action} <ChevronRight size={13}/></Link>}
    </div>
  );
}

// ── Mentor Student View ───────────────────────────────────────────
// ── Mentor Student View ───────────────────────────────────────────
// Reads sessions from 'nm_mentor_sessions' — written by MentorPortal (company side)
// Supports instant cross-tab sync via storage events + custom events + polling.
function MentorStudentView({ studentName, studentEmail }: { studentName: string; studentEmail: string }) {
  const [sessions,      setSessions]      = useState<any[]>([]);
  const [sessionFilter, setSessionFilter] = useState<'mine' | 'all'>('mine');
  const [chatOpen,      setChatOpen]      = useState<string | null>(null);
  const [messages,      setMessages]      = useState<any[]>([]);
  const [draft,         setDraft]         = useState('');
  const [lastRefresh,   setLastRefresh]   = useState(Date.now());
  const endRef = useRef<HTMLDivElement>(null);

  // ── Matching logic ────────────────────────────────────────────────
  const isSessionForStudent = (s: any) => {
    if (s.isOpenToAll) return true;
    const sName  = (s.studentName || '').toLowerCase().trim();
    const sMail  = (s.studentEmail || '').toLowerCase().trim();
    const myName = (studentName || '').toLowerCase().trim();
    const myMail = (studentEmail || '').toLowerCase().trim();

    // Broadcast / open session keywords
    if (sName === 'all' || sName === 'all students' || sName === 'everyone' || sMail === 'all' || (!sMail && !sName)) {
      return true;
    }

    // Exact email match
    if (sMail && myMail && sMail === myMail) return true;

    // Exact name match
    if (sName && myName && sName === myName) return true;

    // Substring or first-name match (e.g. "Nithish" matches "Nithish Ramasamy")
    if (sName && myName) {
      if (sName.includes(myName) || myName.includes(sName)) return true;
      const sFirst  = sName.split(/\s+/)[0];
      const myFirst = myName.split(/\s+/)[0];
      if (sFirst && myFirst && sFirst.length >= 3 && sFirst === myFirst) return true;
    }

    return false;
  };

  // ── Read ALL sessions from localStorage ──────────────────────────
  const readSessions = () => {
    try {
      const raw = localStorage.getItem('nm_mentor_sessions');
      if (!raw) { setSessions([]); return; }
      const all: any[] = JSON.parse(raw);
      all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setSessions(all);
    } catch (e) { setSessions([]); }
  };

  // ── Read chat for open session ────────────────────────────────────
  const readChat = (sid: string) => {
    try {
      const all: any[] = JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]');
      setMessages(all.filter(m => m.sessionId === sid));
    } catch { setMessages([]); }
  };

  // ── Setup: poll + storage event + custom event sync ──────────────
  useEffect(() => {
    readSessions();
    const handleSync = () => {
      readSessions();
      if (chatOpen) readChat(chatOpen);
    };

    window.addEventListener('nm_mentor_sessions_updated', handleSync);
    window.addEventListener('storage', handleSync);
    const iv = setInterval(handleSync, 1200);

    return () => {
      window.removeEventListener('nm_mentor_sessions_updated', handleSync);
      window.removeEventListener('storage', handleSync);
      clearInterval(iv);
    };
  }, [chatOpen]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Send student → mentor message ─────────────────────────────────
  const sendMsg = () => {
    if (!draft.trim() || !chatOpen) return;
    const msg = {
      id: Date.now().toString(), sessionId: chatOpen,
      from: 'student', senderName: studentName || 'Student',
      text: draft.trim(), ts: Date.now(),
    };
    const all: any[] = JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]');
    localStorage.setItem('nm_mentor_chat', JSON.stringify([...all, msg]));
    window.dispatchEvent(new CustomEvent('nm_mentor_sessions_updated'));
    window.dispatchEvent(new Event('storage'));
    setDraft('');
    readChat(chatOpen);
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const fmtTime = (ts: number)  => new Date(ts).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const fmtDate = (str: string) => { const d = new Date(str); return isNaN(d.getTime()) ? '' : d.toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }); };
  const countMentorMsgs = (sid: string) => {
    try { return JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]').filter((m: any) => m.sessionId === sid && m.from === 'mentor').length; }
    catch { return 0; }
  };

  const mySessions = sessions.filter(isSessionForStudent);
  // Auto fallback to all if no direct session matches, ensuring students always see newly created meetings
  const toShow = sessionFilter === 'mine' ? (mySessions.length > 0 ? mySessions : sessions) : sessions;
  const isFallbackToAll = sessionFilter === 'mine' && mySessions.length === 0 && sessions.length > 0;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:22, color:'var(--text)', margin:0 }}>My Mentor Sessions &amp; Meetings</h2>
          <p style={{ fontSize:12.5, color:'var(--text-3)', margin:'4px 0 0' }}>
            Live meetings scheduled by company mentors — join Google Meet or chat directly
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          {/* Session count badge */}
          <div style={{ padding:'6px 12px', borderRadius:10, background: sessions.length > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', border:`1px solid ${sessions.length > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`, fontSize:12, color: sessions.length > 0 ? '#10b981' : 'var(--text-3)', fontWeight:700 }}>
            {sessions.length > 0 ? `✅ ${sessions.length} meeting${sessions.length > 1 ? 's' : ''} available` : '⏳ No sessions yet'}
          </div>
          {/* Manual refresh */}
          <button onClick={() => { readSessions(); setLastRefresh(Date.now()); }}
            style={{ padding:'6px 14px', borderRadius:10, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text-2)', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
            🔄 Refresh
          </button>
          <Link to="/mentors" style={{ padding:'6px 14px', borderRadius:10, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', fontSize:12, fontWeight:600, textDecoration:'none' }}>
            Browse Mentors →
          </Link>
        </div>
      </div>

      {/* ── Filter Tabs: Assigned to Me vs All Sessions ── */}
      {sessions.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', gap:8, background:'var(--surface)', padding:4, borderRadius:12, border:'1px solid var(--border)' }}>
            <button
              onClick={() => setSessionFilter('mine')}
              style={{
                padding:'7px 16px', borderRadius:9, border:'none', cursor:'pointer', fontSize:12.5, fontWeight:700,
                background: sessionFilter === 'mine' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'transparent',
                color: sessionFilter === 'mine' ? '#fff' : 'var(--text-3)',
                transition:'all 0.18s', display:'flex', alignItems:'center', gap:6
              }}>
              🎯 Assigned to Me ({mySessions.length})
            </button>
            <button
              onClick={() => setSessionFilter('all')}
              style={{
                padding:'7px 16px', borderRadius:9, border:'none', cursor:'pointer', fontSize:12.5, fontWeight:700,
                background: sessionFilter === 'all' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'transparent',
                color: sessionFilter === 'all' ? '#fff' : 'var(--text-3)',
                transition:'all 0.18s', display:'flex', alignItems:'center', gap:6
              }}>
              🌐 All Mentor Meetings ({sessions.length})
            </button>
          </div>

          <span style={{ fontSize:11.5, color:'var(--text-3)' }}>
            ⚡ Live Synced: {new Date(lastRefresh).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* ── Auto-fallback notice if name matching fell back to all ── */}
      {isFallbackToAll && (
        <div style={{ padding:'10px 14px', borderRadius:12, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)', marginBottom:16, display:'flex', alignItems:'center', gap:10, fontSize:12.5, color:'var(--text-2)' }}>
          <span style={{ fontSize:16 }}>💡</span>
          <div>
            Showing <strong>all {sessions.length} mentor sessions</strong> scheduled by companies (including open webinars &amp; recent meetings).
          </div>
        </div>
      )}

      {/* ── How it works info ── */}
      <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.2)', marginBottom:20, display:'flex', gap:12, alignItems:'flex-start' }}>
        <Video size={16} color="#10b981" style={{ marginTop:2, flexShrink:0 }} />
        <div style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.7 }}>
          <strong style={{ color:'var(--text)' }}>Real-Time Meeting Integration:</strong>{' '}
          When a mentor schedules a session in <strong>Company Portal → 🎓 Mentor Portal</strong>, it syncs here automatically in real time.
          Click <strong style={{ color:'#10b981' }}>Join Google Meet</strong> to start or enter your video conference.
        </div>
      </div>

      {sessions.length === 0 ? (
        /* ── Empty State ── */
        <div>
          <div style={{ textAlign:'center', padding:'50px 24px', borderRadius:20, background:'var(--surface)', border:'2px dashed var(--border)', marginBottom:16 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎓</div>
            <h3 style={{ fontWeight:800, fontSize:20, color:'var(--text)', marginBottom:8 }}>No Meetings Scheduled Yet</h3>
            <p style={{ color:'var(--text-3)', fontSize:13.5, maxWidth:440, margin:'0 auto 20px', lineHeight:1.7 }}>
              When your company mentor creates a session in <strong>Company Portal → Mentor Portal</strong> with your name or as an open session, it will show up here instantly with a Google Meet link.
            </p>
            <button onClick={() => { readSessions(); setLastRefresh(Date.now()); }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:11, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:12, boxShadow:'0 4px 14px rgba(59,130,246,0.35)' }}>
              🔄 Check for new sessions
            </button>
            {/* Storage debug */}
            <details style={{ textAlign:'left', maxWidth:520, margin:'12px auto 0' }}>
              <summary style={{ fontSize:11, color:'var(--text-3)', cursor:'pointer' }}>🔧 Diagnostic: check localStorage data</summary>
              <pre style={{ marginTop:8, padding:'10px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)', fontSize:10.5, color:'var(--text-3)', maxHeight:140, overflowY:'auto', whiteSpace:'pre-wrap', wordBreak:'break-all', textAlign:'left' }}>
                nm_mentor_sessions: {localStorage.getItem('nm_mentor_sessions') || '(empty)'}
              </pre>
            </details>
          </div>
        </div>
      ) : (
        /* ── Session Cards ── */
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {toShow.map(s => {
            const newMsgs     = countMentorMsgs(s.id);
            const isChatOpen  = chatOpen === s.id;
            const isMine      = isSessionForStudent(s);

            return (
              <div key={s.id} style={{ borderRadius:18, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,0.07)' }}>
                {/* Top accent bar */}
                <div style={{ height:4, background: s.meetLink ? 'linear-gradient(90deg,#10b981,#059669,#3b82f6)' : 'linear-gradient(90deg,#3b82f6,#7c3aed)' }} />

                <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>

                  {/* ── Session Info Row ── */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:50, height:50, borderRadius:14, background: s.isOpenToAll ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                      {s.isOpenToAll ? '🌐' : '🎓'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                        <div style={{ fontWeight:800, fontSize:17, color:'var(--text)' }}>{s.topic || 'Mentor Session'}</div>
                        {isMine ? (
                          <span style={{ fontSize:10.5, fontWeight:800, padding:'2px 9px', borderRadius:999, background:'rgba(59,130,246,0.12)', color:'#3b82f6', border:'1px solid rgba(59,130,246,0.25)' }}>
                            🎯 For You
                          </span>
                        ) : (
                          <span style={{ fontSize:10.5, fontWeight:800, padding:'2px 9px', borderRadius:999, background:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)' }}>
                            🌐 Open Session
                          </span>
                        )}
                      </div>

                      <div style={{ display:'flex', flexWrap:'wrap', gap:12, fontSize:12, color:'var(--text-3)' }}>
                        {(s.companyName || s.mentorName) && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                            🏢 <strong style={{ color:'var(--text-2)' }}>{s.companyName || 'Company'}</strong>
                            {s.mentorName && <span>· Mentor: <strong style={{ color:'var(--text-2)' }}>{s.mentorName}</strong></span>}
                          </span>
                        )}
                        {s.studentName && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                            👤 <span style={{ color:'var(--text-2)', fontWeight:600 }}>{s.studentName}</span>
                          </span>
                        )}
                        {s.scheduledAt && fmtDate(s.scheduledAt) && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                            📅 <span style={{ color:'var(--text-2)' }}>{fmtDate(s.scheduledAt)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end', flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background: s.meetLink ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.1)', color: s.meetLink ? '#10b981' : '#f59e0b', border:`1px solid ${s.meetLink ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                        {s.meetLink ? '✓ Google Meet Ready' : '⏳ Meet Pending'}
                      </span>
                      {newMsgs > 0 && (
                        <span style={{ fontSize:10, fontWeight:800, padding:'2px 9px', borderRadius:999, background:'rgba(239,68,68,0.12)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.25)' }}>
                          🔴 {newMsgs} new from mentor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Google Meet Join Button ── */}
                  {s.meetLink ? (
                    <a href={s.meetLink} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:14, background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))', border:'2px solid rgba(16,185,129,0.4)', textDecoration:'none', transition:'all 0.2s', boxShadow:'0 4px 16px rgba(16,185,129,0.12)' }}
                      onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(16,185,129,0.22),rgba(5,150,105,0.12))'; e.currentTarget.style.borderColor='rgba(16,185,129,0.7)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))'; e.currentTarget.style.borderColor='rgba(16,185,129,0.4)'; }}>
                      {/* Google Meet icon */}
                      <div style={{ width:46, height:46, borderRadius:12, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(16,185,129,0.4)' }}>
                        <Video size={24} color="#fff" />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:800, fontSize:15.5, color:'#10b981', marginBottom:3, display:'flex', alignItems:'center', gap:6 }}>
                          Join Google Meet <span style={{ fontSize:11, padding:'1px 7px', borderRadius:999, background:'rgba(16,185,129,0.2)', color:'#10b981' }}>Live Link</span>
                        </div>
                        <div style={{ fontSize:12, color:'var(--text-3)', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {s.meetLink}
                        </div>
                      </div>
                      <div style={{ padding:'10px 22px', borderRadius:11, background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0, boxShadow:'0 3px 12px rgba(16,185,129,0.45)', whiteSpace:'nowrap' }}>
                        Join Video Call →
                      </div>
                    </a>
                  ) : (
                    <div style={{ padding:'14px 16px', borderRadius:13, background:'rgba(245,158,11,0.06)', border:'1px dashed rgba(245,158,11,0.35)', display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontSize:24 }}>⏳</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:'#f59e0b', marginBottom:2 }}>Google Meet link pending</div>
                        <div style={{ fontSize:12, color:'var(--text-3)' }}>Your mentor will add the video call link shortly. Send a message in the chat below to notify them.</div>
                      </div>
                    </div>
                  )}

                  {/* ── Session Notes ── */}
                  {s.notes && (
                    <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.18)', display:'flex', gap:10 }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>📝</span>
                      <div>
                        <div style={{ fontSize:10.5, fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>Mentor's Notes &amp; Agenda</div>
                        <div style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65 }}>{s.notes}</div>
                      </div>
                    </div>
                  )}

                  {/* ── Chat toggle button ── */}
                  <button
                    onClick={() => { const next = isChatOpen ? null : s.id; setChatOpen(next); if (next) readChat(next); }}
                    style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:12, border:`1.5px solid ${isChatOpen ? '#7c3aed' : 'var(--border)'}`, background: isChatOpen ? 'rgba(124,58,237,0.1)' : 'var(--bg)', color: isChatOpen ? '#7c3aed' : 'var(--text-2)', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.18s' }}>
                    <MessageSquare size={14} />
                    {isChatOpen ? '▲ Close Chat' : '💬 Chat with Mentor'}
                    {newMsgs > 0 && !isChatOpen && (
                      <span style={{ padding:'1px 8px', borderRadius:999, background:'#ef4444', color:'#fff', fontSize:10.5, fontWeight:800 }}>
                        {newMsgs} new
                      </span>
                    )}
                  </button>

                  {/* ── Inline Chat Panel ── */}
                  {isChatOpen && (
                    <div style={{ borderRadius:14, border:'1.5px solid rgba(124,58,237,0.25)', overflow:'hidden', background:'var(--bg)' }}>
                      {/* Chat header */}
                      <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8, background:'rgba(124,58,237,0.06)' }}>
                        <MessageSquare size={13} color="#7c3aed" />
                        <span style={{ fontWeight:700, fontSize:12.5, color:'var(--text)' }}>Chat · {s.topic}</span>
                        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#10b981', fontWeight:600 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981' }} />
                          Live sync
                        </div>
                      </div>

                      {/* Messages */}
                      <div style={{ height:260, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
                        {messages.length === 0 && (
                          <div style={{ textAlign:'center', color:'var(--text-3)', fontSize:12.5, marginTop:40, lineHeight:1.8 }}>
                            No messages yet 💬<br />
                            <span style={{ fontSize:11 }}>Say hello to your mentor!</span>
                          </div>
                        )}
                        {messages.map(m => (
                          <div key={m.id} style={{ display:'flex', flexDirection: m.from === 'student' ? 'row-reverse' : 'row', gap:8, alignItems:'flex-end' }}>
                            <div style={{ width:28, height:28, borderRadius:'50%', background: m.from === 'student' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11, color:'#fff', flexShrink:0 }}>
                              {m.senderName?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div style={{ maxWidth:'72%' }}>
                              <div style={{ fontSize:10, color:'var(--text-3)', marginBottom:3, textAlign: m.from === 'student' ? 'right' : 'left', fontWeight:600 }}>
                                {m.senderName} · {fmtTime(m.ts)}
                              </div>
                              <div style={{ padding:'9px 13px', borderRadius: m.from === 'student' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.from === 'student' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'var(--surface)', border: m.from === 'mentor' ? '1px solid var(--border)' : 'none', color: m.from === 'student' ? '#fff' : 'var(--text)', fontSize:13, lineHeight:1.55 }}>
                                {m.text}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={endRef} />
                      </div>

                      {/* Input */}
                      <div style={{ padding:'10px 12px', borderTop:'1px solid var(--border)', display:'flex', gap:8, background:'var(--surface)' }}>
                        <input
                          value={draft}
                          onChange={e => setDraft(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMsg())}
                          placeholder="Message your mentor… (Enter to send)"
                          style={{ flex:1, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:'9px 13px', fontSize:13, color:'var(--text)', outline:'none' }}
                        />
                        <button onClick={sendMsg}
                          style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 3px 12px rgba(124,58,237,0.4)' }}>
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



export default function StudentPortal() {

  const { user: authUser, token, logout, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get('tab') as Tab | null;
  const [tab,  setTab]  = useState<Tab>(urlTab || 'dashboard');
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (urlTab && urlTab !== tab) {
      setTab(urlTab);
    }
  }, [urlTab]);

  // Derive persistent student user so all features stay permanently visible
  const user = useMemo(() => {
    if (authUser && authUser.role === 'student') return authUser;
    try {
      const saved = localStorage.getItem('nm_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (!parsed.role || parsed.role === 'student')) return parsed;
      }
    } catch {}
    return {
      _id: 'student-nithish',
      name: 'nithish',
      email: 'nithish@student.edu',
      role: 'student' as const,
      college: 'Anna University',
      branch: 'Computer Science & Engineering',
      year: '3rd Year',
      skills: ['React', 'Node.js', 'Python', 'Tailwind CSS'],
      phone: '+91 98765 43210',
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }, [authUser]);

  // Profile edit
  const [pf, setPf] = useState<Record<string,any>>({});
  const [viewingCert, setViewingCert] = useState<IssuedCertificate | null>(null);
  const [viewingPass, setViewingPass] = useState<any | null>(null);
  const [issuedCertsTrigger, setIssuedCertsTrigger] = useState(0);
  const [saving,  setSaving]  = useState(false);
  const [savedMsg,setSavedMsg]= useState('');

  // Real-time synchronization for mentor-issued certificates
  useEffect(() => {
    const handleStorage = () => setIssuedCertsTrigger(t => t + 1);
    window.addEventListener('nm_cert_storage_updated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('nm_cert_storage_updated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const studentDisplayName = user?.name || 'nithish';
  const myCertificates = useMemo(() => {
    return getCertificatesForStudent(user?.email || studentDisplayName, studentDisplayName);
  }, [user, studentDisplayName, issuedCertsTrigger]);

  // localStorage data
  const wishlist   = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_wishlist')||'[]') as number[]; } catch { return []; } }, []);
  const savedProj  = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_saved_projects')||'[]') as number[]; } catch { return []; } }, []);
  const regEvents  = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_registered_events')||'[]') as number[]; } catch { return []; } }, [issuedCertsTrigger]);
  const regExams   = useMemo(() => { try { return (JSON.parse(localStorage.getItem('nm_exam_registrations')||'[]') as any[]).map((r:any) => r.examId); } catch { return []; } }, []);

  const allAvailableEvents = useMemo(() => {
    const portalEvents = portalGetAll('event').map((e: any, i: number) => ({
      id: e.id || 80000 + i,
      title: e.title || 'Untitled Event',
      organizer: e.organizer || 'Organizer',
      organizerType: e.organizerType || (String(e.organizer || '').toLowerCase().includes('college') ? 'college' : 'company'),
      mentorName: e.mentorName || `${e.organizer || 'Corporate'} Lead Mentor`,
      mentorRole: e.mentorRole || 'Lead Evaluator & Coordinator',
      date: e.date || 'TBD',
      time: e.time || 'TBD',
      location: e.location || 'Online',
      banner: e.banner || '🎪',
      type: e.type || 'workshop',
      price: e.price || 'Free',
      color: e.color || '#f59e0b',
    }));
    return [...EVENTS, ...portalEvents];
  }, []);

  const allAvailableExams = useMemo(() => {
    const portalExams = portalGetAll('exam').map((e: any, i: number) => ({
      id: e.id ? Number(e.id) : (70000 + i),
      title: e.title || 'Untitled Exam',
      shortTitle: e.shortTitle || e.title?.split(' ').slice(0, 3).join(' ') || 'Exam',
      category: e.category || 'skill-assessment',
      organizer: e.organizer || 'College',
      mode: e.mode || 'online',
      difficulty: e.difficulty || 'Moderate',
      examDate: e.examDate || '',
      examTime: e.examTime || '10:00 AM',
      duration: e.duration || '120 Minutes',
      price: e.price || 'Free',
      color: '#8b5cf6',
      icon: '📝',
    }));
    return [...EXAMS, ...portalExams];
  }, []);

  useEffect(() => {
    // Only redirect if explicitly signed in as a non-student role (e.g. company/college)
    if (authUser && authUser.role && authUser.role !== 'student') {
      navigate('/login');
      return;
    }
    if (token) {
      fetch('http://localhost:5000/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(d => { if (d.success) setApps(d.applications); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [authUser, token]);

  useEffect(() => {
    if (user) setPf({
      phone: user.phone||'', college: user.college||'', year: user.year||'',
      branch: user.branch||'', skills: (user.skills||[]).join(', '),
      linkedIn: user.linkedIn||'', github: user.github||'', resume: user.resume||'',
      bio: (user as any).bio||'', cgpa: (user as any).cgpa||'',
    });
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    const res = await updateUser({ ...pf, skills: pf.skills.split(',').map((s:string) => s.trim()).filter(Boolean) });
    setSavedMsg(res.message); setSaving(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const pending  = apps.filter(a => a.status === 'pending').length;
  const accepted = apps.filter(a => ['hired','accepted'].includes(a.status)).length;
  const shortlisted = apps.filter(a => a.status === 'shortlisted').length;
  const enrolledCoursesIds = useMemo(() => {
    try {
      const e = JSON.parse(localStorage.getItem('nm_enrolled_courses') || '[]');
      return e.length > 0 ? e : [101];
    } catch {
      return [101];
    }
  }, []);
  const savedCourses  = ALL_COURSES.filter(c => wishlist.includes(c.id) || enrolledCoursesIds.includes(c.id));
  const savedProjects = PROJECTS.filter(p => savedProj.includes(p.id));

  // ── SIDEBAR ───────────────────────────────────────────────────
  const Sidebar = () => (
    <aside style={{ width:230, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'16px 10px' }}>
      {/* Avatar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:13, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', marginBottom:20 }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, color:'#fff', flexShrink:0 }}>
          {user.name[0].toUpperCase()}
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
          <div style={{ fontSize:10.5, color:'var(--accent)', fontWeight:600 }}>🎓 Student</div>
        </div>
      </div>

      <nav style={{ flex:1 }}>
        {NAV_ITEMS.map(n => {
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?'var(--accent)':'var(--text-2)', background:active?'rgba(124,58,237,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?'3px solid var(--accent)':'3px solid transparent' }}
              onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.background='transparent'; }}>
              {n.icon} {n.label}
              {n.id === 'events'  && regEvents.length  > 0 && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:800, background:'#10b981', color:'#fff', borderRadius:999, padding:'1px 6px' }}>{regEvents.length}</span>}
              {n.id === 'exams'   && regExams.length   > 0 && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:800, background:'#7c3aed', color:'#fff', borderRadius:999, padding:'1px 6px' }}>{regExams.length}</span>}
              {n.id === 'courses' && wishlist.length   > 0 && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:800, background:'#ef4444', color:'#fff', borderRadius:999, padding:'1px 6px' }}>{wishlist.length}</span>}
              {n.id === 'resume'  && <span style={{ marginLeft:'auto', fontSize:9, fontWeight:800, background:'rgba(99,102,241,0.2)', color:'#818cf8', borderRadius:999, padding:'1px 6px' }}>8 Styles</span>}
            </button>
          );
        })}
      </nav>

      <button onClick={() => { logout(); navigate('/'); }}
        style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, fontWeight:500, color:'#ef4444', background:'none', border:'none', cursor:'pointer', marginTop:8 }}>
        <LogOut size={15}/> Sign Out
      </button>
    </aside>
  );

  // ── CONTENT ────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex:1, minWidth:0, padding:'28px 32px 60px', overflowY:'auto' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ marginBottom:28 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:26, color:'var(--text)', marginBottom:4 }}>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p style={{ color:'var(--text-3)', fontSize:13.5 }}>Here's your learning overview for today</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:32 }}>
              <StatCard icon="📋" label="Applications"  value={apps.length}    color="#7c3aed" sub={`${pending} pending`} />
              <StatCard icon="✅" label="Accepted"      value={accepted}       color="#10b981" sub={`${shortlisted} shortlisted`} />
              <StatCard icon="❤️" label="Saved Courses" value={savedCourses.length} color="#ef4444" sub="in wishlist" />
              <StatCard icon="🔖" label="Saved Projects"value={savedProjects.length} color="#3b82f6" sub="bookmarked" />
              <StatCard icon="🎯" label="Reg. Events"  value={regEvents.length}  color="#f59e0b" sub="registered" />
              <StatCard icon="📝" label="Reg. Exams"   value={regExams.length}   color="#8b5cf6" sub="enrolled" />
            </div>

            {/* Quick Access Tiles */}
            <SectionHeader title="Quick Access" sub="Jump to any section" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:32 }}>
              {[
                { label:'Resume Studio',   icon:'📄', color:'#6366f1', id:'resume' as Tab },
                { label:'Certificates',    icon:'🏅', color:'#eab308', id:'certificates' as Tab },
                { label:'Browse Projects', icon:'🎯', color:'#7c3aed', id:'projects' as Tab },
                { label:'My Courses',      icon:'📚', color:'#3b82f6', id:'courses' as Tab },
                { label:'Find Internship', icon:'💼', color:'#10b981', id:'internships' as Tab },
                { label:'Events',          icon:'🎪', color:'#f59e0b', id:'events' as Tab },
                { label:'Take Exam',       icon:'📝', color:'#8b5cf6', id:'exams' as Tab },
                { label:'Find Jobs',       icon:'🏢', color:'#06b6d4', id:'jobs' as Tab },
                { label:'Find Mentor',     icon:'👨‍🏫', color:'#ec4899', id:'mentors' as Tab },
                { label:'Leaderboard',     icon:'🏆', color:'#f97316', id:'leaderboard' as Tab },
              ].map(q => (
                <button key={q.id} onClick={() => setTab(q.id)}
                  style={{ padding:'16px 14px', borderRadius:14, background:'var(--surface)', border:`1px solid ${q.color}25`, cursor:'pointer', textAlign:'center', transition:'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=q.color; (e.currentTarget as HTMLElement).style.background=`${q.color}10`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=`${q.color}25`; (e.currentTarget as HTMLElement).style.background='var(--surface)'; }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{q.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>{q.label}</div>
                </button>
              ))}
            </div>

            {/* Recent Applications */}
            {apps.length > 0 && (
              <>
                <SectionHeader title="Recent Applications" sub={`${apps.length} total`} action="View All" />
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {apps.slice(0,5).map((a: any) => (
                    <div key={a._id} style={{ padding:'14px 18px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:14 }}>
                      <div style={{ fontSize:22 }}>{STATUS_ICON[a.status]||'📄'}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.itemTitle}</div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{a.itemCompany} · {new Date(a.createdAt).toLocaleDateString('en-IN')}</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:`${STATUS_COLOR[a.status]||'#888'}18`, color:STATUS_COLOR[a.status]||'#888' }}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ── PROJECTS ── */}
        {tab === 'projects' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="Projects" sub={`${savedProjects.length} bookmarked · Browse all on projects page`} action="Browse All Projects" link="/projects" />
            {savedProjects.length > 0 && (
              <>
                <p style={{ fontSize:12.5, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>🔖 Your Bookmarks</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
                  {savedProjects.map(p => (
                    <div key={p.id} style={{ padding:'16px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                        <span style={{ fontSize:24 }}>{p.companyLogo}</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', lineHeight:1.35 }}>{p.title}</div>
                          <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{p.company}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
                        {p.skills.slice(0,3).map(s => <span key={s} style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, background:'rgba(124,58,237,0.1)', color:'var(--accent)' }}>{s}</span>)}
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:12, color:'#10b981', fontWeight:700 }}>{p.stipend}</span>
                        <Link to="/projects" style={{ fontSize:12, color:'var(--accent)', fontWeight:700, textDecoration:'none' }}>Apply →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ textAlign:'center', padding:'40px 20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🎯</div>
              <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:8 }}>Discover Real Projects</h3>
              <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:20 }}>2,400+ industry projects waiting for you</p>
              <Link to="/projects" className="btn btn-primary" style={{ display:'inline-flex' }}>Browse All Projects →</Link>
            </div>
          </motion.div>
        )}

        {/* ── COURSES ── */}
        {tab === 'courses' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="My Learning" sub={`${savedCourses.length} saved · track progress & earn certificates`} action="Open My Learning" link="/my-learning" />
            {/* Quick stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:24 }}>
              {[{icon:'📚',label:'Saved',val:savedCourses.length,color:'#7c3aed'},{icon:'🏆',label:'Certificates',val:0,color:'#f59e0b'},{icon:'🔥',label:'Day Streak',val:1,color:'#ef4444'},{icon:'⏱',label:'Hours',val:savedCourses.reduce((s:number,c:any)=>s+c.hours,0),color:'#3b82f6'}].map((s:any)=>(
                <div key={s.label} style={{ padding:'14px 16px', borderRadius:13, background:'var(--surface)', border:`1px solid ${s.color}20`, display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:24 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:20, fontWeight:900, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', fontWeight:600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            {savedCourses.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                {savedCourses.map((c:any) => {
                  const progressData = (() => {
                    try {
                      const p = JSON.parse(localStorage.getItem('nm_course_progress') || '{}');
                      return p[c.id] ?? (c.id === 101 ? 100 : 0);
                    } catch {
                      return c.id === 101 ? 100 : 0;
                    }
                  })();
                  const isDone = progressData >= 100;

                  return (
                    <div key={c.id} style={{ borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 4px 18px rgba(0,0,0,0.06)' }}>
                      <div style={{ height:120, background:'linear-gradient(135deg,#1e1b4b,#0f172a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, position:'relative' }}>
                        📚
                        {isDone && (
                          <div style={{ position:'absolute', top:10, right:10, background:'#10b981', color:'#fff', padding:'3px 9px', borderRadius:99, fontSize:10.5, fontWeight:800, display:'flex', alignItems:'center', gap:4, boxShadow:'0 2px 8px rgba(16,185,129,0.35)' }}>
                            <CheckCircle size={11} /> 100% Completed
                          </div>
                        )}
                      </div>
                      <div style={{ padding:'14px 16px', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                        <div>
                          <div style={{ fontWeight:800, fontSize:13.5, color:'var(--text)', marginBottom:4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.35 }}>
                            {c.title}
                          </div>
                          <div style={{ fontSize:11.5, color:'var(--text-3)', marginBottom:8 }}>
                            ⏱ {c.hours}h · {c.level} · {c.instructor || 'Lead Instructor'}
                          </div>
                          {isDone ? (
                            <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10.5, fontWeight:800, padding:'3px 9px', borderRadius:99, background:'rgba(16,185,129,0.12)', color:'#10b981', marginBottom:12 }}>
                              🎓 Verified Certificate Ready
                            </span>
                          ) : (
                            <span style={{ display:'inline-block', fontSize:10.5, fontWeight:600, color:'var(--text-3)', marginBottom:12 }}>
                              In Progress · {progressData}% completed
                            </span>
                          )}
                        </div>

                        <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
                          <Link to={`/learn/${c.id}`} style={{ flex:1, padding:'8px 10px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', fontSize:12, fontWeight:700, textDecoration:'none', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                            <Play size={12}/> {isDone ? 'Review' : 'Continue'}
                          </Link>
                          {isDone ? (
                            <button
                              onClick={() => {
                                const cert = issueCourseCertificate({
                                  studentName: user?.name || 'nithish',
                                  studentEmail: user?.email,
                                  courseId: c.id,
                                  courseTitle: c.title,
                                  instructor: c.instructor,
                                });
                                setViewingCert(cert);
                              }}
                              style={{ flex:1.3, padding:'8px 10px', borderRadius:9, background:'linear-gradient(135deg,#10b981,#059669)', border:'none', color:'#fff', fontSize:12, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, boxShadow:'0 3px 12px rgba(16,185,129,0.3)' }}
                            >
                              <Award size={13}/> View Cert
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const cert = issueCourseCertificate({
                                  studentName: user?.name || 'nithish',
                                  studentEmail: user?.email,
                                  courseId: c.id,
                                  courseTitle: c.title,
                                  instructor: c.instructor,
                                });
                                setViewingCert(cert);
                              }}
                              style={{ flex:1.3, padding:'8px 10px', borderRadius:9, background:'rgba(124,58,237,0.12)', border:'1px solid rgba(124,58,237,0.3)', color:'var(--accent)', fontSize:11.5, fontWeight:700, cursor:'pointer' }}
                            >
                              ⚡ Finish &amp; Cert
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'60px 20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📚</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:8 }}>No saved courses yet</h3>
                <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:20 }}>Click the ♡ heart on courses to save them here</p>
                <Link to="/courses" className="btn btn-primary" style={{ display:'inline-flex' }}>Browse 200+ Courses →</Link>
              </div>
            )}
            <div style={{ marginTop:24, textAlign:'center' }}>
              <Link to="/my-learning"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:13, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', fontWeight:700, fontSize:14, textDecoration:'none', boxShadow:'0 4px 16px rgba(124,58,237,0.3)' }}>
                🎓 Open Full Learning Dashboard <ChevronRight size={14}/>
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── INTERNSHIPS ── */}
        {tab === 'internships' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="Internships" sub="Paid & certificate internships" action="Browse All" link="/internships" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
              {[{title:'ML Research Intern',company:'DRDO',stipend:'₹15,000/mo',duration:'6 Months',mode:'Hybrid',color:'#7c3aed'},{title:'Frontend Developer Intern',company:'Zoho',stipend:'₹18,000/mo',duration:'3 Months',mode:'Remote',color:'#3b82f6'},{title:'Data Analyst Intern',company:'Freshworks',stipend:'₹20,000/mo',duration:'6 Months',mode:'On-site',color:'#10b981'},{title:'Cloud DevOps Intern',company:'AWS India',stipend:'₹25,000/mo',duration:'4 Months',mode:'Remote',color:'#f59e0b'}].map(i => (
                <div key={i.title} style={{ padding:'16px', borderRadius:14, background:'var(--surface)', border:`1px solid ${i.color}25` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${i.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:i.color, fontSize:14 }}>{i.company[0]}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{i.title}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{i.company}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    <span style={{ fontSize:10.5, padding:'2px 8px', borderRadius:999, background:`${i.color}14`, color:i.color, fontWeight:700 }}>{i.mode}</span>
                    <span style={{ fontSize:10.5, padding:'2px 8px', borderRadius:999, background:'var(--bg-2)', color:'var(--text-3)', fontWeight:600 }}>{i.duration}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:800, color:'#10b981', fontSize:14 }}>{i.stipend}</span>
                    <Link to="/internships" style={{ fontSize:12, fontWeight:700, color:i.color, textDecoration:'none' }}>Apply →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center' }}><Link to="/internships" className="btn btn-primary" style={{ display:'inline-flex' }}>View All Internships →</Link></div>
          </motion.div>
        )}

        {/* ── EVENTS ── */}
        {tab === 'events' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="Events" sub={`${regEvents.length} registered`} action="Browse All Events" link="/events" />
            {regEvents.length > 0 && (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>
                    🎟️ Your Registered Events &amp; Attendance Status
                  </p>
                  <span style={{ fontSize:11.5, color:'var(--text-3)' }}>
                    Certificates are awarded by Company &amp; College mentors upon completion
                  </span>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:28 }}>
                  {allAvailableEvents.filter(e => regEvents.includes(e.id)).map(e => {
                    const matchingCert = myCertificates.find(c =>
                      (c.eventId && String(c.eventId) === String(e.id)) ||
                      c.eventTitle?.toLowerCase().trim() === e.title?.toLowerCase().trim()
                    );
                    const isCompleted = !!matchingCert;

                    return (
                      <div key={e.id} style={{
                        padding:'18px 20px', borderRadius:16, background:'var(--surface)',
                        border: isCompleted ? '1px solid rgba(16,185,129,0.35)' : `1px solid ${e.color}35`,
                        display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
                        boxShadow: isCompleted ? '0 4px 20px rgba(16,185,129,0.06)' : 'none'
                      }}>
                        <div style={{
                          width:50, height:50, borderRadius:14,
                          background: isCompleted ? 'rgba(16,185,129,0.12)' : `${e.color}15`,
                          border: isCompleted ? '1px solid rgba(16,185,129,0.25)' : `1px solid ${e.color}30`,
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0
                        }}>
                          {isCompleted ? '🎓' : (e.banner || '🎪')}
                        </div>

                        <div style={{ flex:1, minWidth:260 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                            <div style={{ fontWeight:800, fontSize:15, color:'var(--text)' }}>{e.title}</div>
                            {isCompleted ? (
                              <span style={{ fontSize:10.5, fontWeight:800, padding:'3px 10px', borderRadius:999, background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)' }}>
                                ✓ Completed &amp; Certified
                              </span>
                            ) : (
                              <span style={{ fontSize:10.5, fontWeight:700, padding:'3px 10px', borderRadius:999, background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)' }}>
                                ⏳ Registered · Pending Completion
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:6 }}>
                            📅 {e.date} · ⏱ {e.time} · 📍 {e.location} · {e.organizerType === 'college' ? '🏛️ College Event: ' : '🏢 Company Event: '}
                            <strong style={{ color:'var(--text-2)' }}>{e.organizer}</strong>
                            {e.mentorName && <span style={{ marginLeft:6 }}>· Lead Mentor: <strong>{e.mentorName}</strong></span>}
                          </div>

                          {isCompleted ? (
                            <div style={{ fontSize:11.5, color:'#10b981', display:'flex', alignItems:'center', gap:6, fontWeight:600 }}>
                              <CheckCircle size={13} />
                              Certificate issued by <strong>{matchingCert?.issuer}</strong> ({matchingCert?.issuerType === 'company' ? '🏢 Company Mentor' : '🏛️ College Faculty'})
                              <span style={{ color:'var(--text-3)', fontFamily:'monospace', marginLeft:6 }}>ID: {matchingCert?.credentialId}</span>
                            </div>
                          ) : (
                            <div style={{ fontSize:11.5, color:'var(--text-3)', fontStyle:'italic' }}>
                              💡 Official certificate will be issued by {e.organizer} ({e.organizerType === 'college' ? 'college faculty' : 'company mentor'}) after attendance verification and session completion.
                            </div>
                          )}
                        </div>

                        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                          {isCompleted ? (
                            <button
                              onClick={() => setViewingCert(matchingCert!)}
                              style={{
                                display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px',
                                borderRadius:10, background:'linear-gradient(135deg,#10b981,#059669)',
                                color:'#fff', border:'none', fontWeight:700, fontSize:12.5, cursor:'pointer',
                                boxShadow:'0 3px 12px rgba(16,185,129,0.35)'
                              }}>
                              <Award size={14} /> View Certificate
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const savedPasses = JSON.parse(localStorage.getItem('nm_event_registration_passes') || '[]');
                                const found = savedPasses.find((p: any) => p.eventId === e.id);
                                const passId = found?.passId || `PASS-${e.id}-${(user?.name || 'STUDENT').slice(0,3).toUpperCase()}`;
                                setViewingPass({
                                  passId,
                                  eventTitle: e.title,
                                  organizer: e.organizer,
                                  organizerType: found?.organizerType || e.organizerType || 'company',
                                  mentorName: found?.mentorName || e.mentorName,
                                  mentorRole: found?.mentorRole || e.mentorRole,
                                  studentName: user?.name || 'Student Participant',
                                  studentEmail: user?.email || 'student@college.edu',
                                  date: e.date,
                                  time: e.time,
                                  location: e.location,
                                  mode: (e as any).mode || 'Online',
                                });
                              }}
                              style={{
                                display:'inline-flex', alignItems:'center', gap:6, padding:'9px 16px',
                                borderRadius:10, background:'var(--bg-2)', border:'1px solid var(--border)',
                                color:'var(--text)', fontWeight:700, fontSize:12.5, cursor:'pointer'
                              }}>
                              <Ticket size={14} color="#f59e0b" /> View Event Pass
                            </button>
                          )}

                          <Link
                            to="/events"
                            style={{
                              display:'inline-flex', alignItems:'center', gap:4, padding:'9px 14px',
                              borderRadius:10, background:'transparent', border:'1px solid var(--border)',
                              color:'var(--text-3)', fontWeight:600, fontSize:12, textDecoration:'none'
                            }}>
                            Details <ChevronRight size={12}/>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
              {EVENTS.slice(0,4).map(e => (
                <div key={e.id} style={{ borderRadius:14, background:'var(--surface)', border:`1px solid ${e.color}25`, overflow:'hidden' }}>
                  <div style={{ height:5, background:`linear-gradient(90deg,${e.color},${e.color}80)` }}/>
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                      <span style={{ fontSize:9.5, fontWeight:800, color:e.color, background:`${e.color}15`, padding:'2px 8px', borderRadius:999, textTransform:'uppercase' }}>{e.type}</span>
                      {e.price === 'Free' && <span style={{ fontSize:9.5, fontWeight:800, color:'#10b981', background:'rgba(16,185,129,0.1)', padding:'2px 8px', borderRadius:999 }}>Free</span>}
                    </div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', marginBottom:8, lineHeight:1.35, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{e.title}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-3)', marginBottom:12 }}>📅 {e.date} · 📍 {e.location}</div>
                    <Link to="/events" style={{ fontSize:12.5, fontWeight:700, color:e.color, textDecoration:'none' }}>Register →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center' }}><Link to="/events" className="btn btn-primary" style={{ display:'inline-flex' }}>Browse All Events →</Link></div>
          </motion.div>
        )}

        {/* ── EXAMS ── */}
        {tab === 'exams' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="Exams & Assessments" sub={`${regExams.length} enrolled`} action="Browse All Exams" link="/exams" />
            {regExams.length > 0 && (
              <>
                <p style={{ fontSize:12, fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>📝 Your Enrolled Exams</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                  {allAvailableExams.filter(e => regExams.includes(e.id)).map(e => (
                    <div key={e.id} style={{ padding:'14px 18px', borderRadius:13, background:'var(--surface)', border:`1px solid ${e.color}30`, display:'flex', alignItems:'center', gap:14 }}>
                      <span style={{ fontSize:28 }}>{e.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)' }}>{e.shortTitle}</div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{e.examDate} · {e.examTime} · {e.duration}</div>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:999, background:`${e.color}14`, color:e.color }}>Enrolled ✓</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
              {allAvailableExams.slice(0,4).map(e => (
                <div key={e.id} style={{ borderRadius:14, background:'var(--surface)', border:`1px solid ${e.color}25`, overflow:'hidden' }}>
                  <div style={{ height:4, background:`linear-gradient(90deg,${e.color},${e.color}80)` }}/>
                  <div style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:6, marginBottom:8 }}>
                      <span style={{ fontSize:9.5, fontWeight:800, color:e.color, background:`${e.color}15`, padding:'2px 8px', borderRadius:999, textTransform:'uppercase' }}>{e.category}</span>
                      <span style={{ fontSize:9.5, fontWeight:700, color:e.price==='Free'?'#10b981':'var(--accent)', background:e.price==='Free'?'rgba(16,185,129,0.1)':'rgba(124,58,237,0.1)', padding:'2px 8px', borderRadius:999 }}>{e.price}</span>
                    </div>
                    <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{e.title}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-3)', marginBottom:12 }}>📅 {e.examDate} · ⏱ {e.duration}</div>
                    <Link to="/exams" style={{ fontSize:12.5, fontWeight:700, color:e.color, textDecoration:'none' }}>Register →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center' }}><Link to="/exams" className="btn btn-primary" style={{ display:'inline-flex' }}>Browse All Exams →</Link></div>
          </motion.div>
        )}

        {/* ── JOBS ── */}
        {tab === 'jobs' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="Job Board" sub="Full-time opportunities" action="Browse All Jobs" link="/jobs" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14, marginBottom:24 }}>
              {[{title:'Software Engineer',company:'Zoho Corp',location:'Chennai',salary:'₹8–12 LPA',type:'Full-time',color:'#7c3aed'},{title:'Data Scientist',company:'Freshworks',location:'Hyderabad',salary:'₹12–18 LPA',type:'Full-time',color:'#3b82f6'},{title:'DevOps Engineer',company:'HCL Tech',location:'Bengaluru',salary:'₹10–15 LPA',type:'Full-time',color:'#10b981'},{title:'Product Manager',company:'BYJU\'S',location:'Remote',salary:'₹15–22 LPA',type:'Full-time',color:'#f59e0b'}].map(j => (
                <div key={j.title} style={{ padding:'16px', borderRadius:14, background:'var(--surface)', border:`1px solid ${j.color}25` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`${j.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:j.color, fontSize:15 }}>{j.company[0]}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{j.title}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{j.company}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    <span style={{ fontSize:10.5, padding:'2px 8px', borderRadius:999, background:'var(--bg-2)', color:'var(--text-3)', fontWeight:600 }}>📍 {j.location}</span>
                    <span style={{ fontSize:10.5, padding:'2px 8px', borderRadius:999, background:`${j.color}14`, color:j.color, fontWeight:700 }}>{j.type}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontWeight:800, color:'#10b981', fontSize:14 }}>{j.salary}</span>
                    <Link to="/jobs" style={{ fontSize:12, fontWeight:700, color:j.color, textDecoration:'none' }}>Apply →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center' }}><Link to="/jobs" className="btn btn-primary" style={{ display:'inline-flex' }}>Browse All Jobs →</Link></div>
          </motion.div>
        )}

        {/* ── MENTORS ── */}
        {tab === 'mentors' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <MentorStudentView studentName={user.name} studentEmail={user.email} />
          </motion.div>
        )}


        {/* ── LEADERBOARD ── */}
        {tab === 'leaderboard' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <SectionHeader title="Leaderboard" sub="Top students by XP score" action="Full Leaderboard" link="/leaderboard" />
            <div style={{ padding:'20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
              <div style={{ textAlign:'center', marginBottom:20 }}>
                <div style={{ fontSize:48, marginBottom:8 }}>🏆</div>
                <div style={{ fontSize:22, fontWeight:800, color:'var(--text)', marginBottom:4 }}>{user.name}</div>
                <div style={{ fontSize:13, color:'var(--text-3)' }}>Keep completing projects & courses to climb the ranks!</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                {[{label:'XP Points',val:'1,240',icon:'⚡',color:'#f59e0b'},{label:'Projects Done',val:apps.filter(a=>a.status==='accepted').length.toString()||'0',icon:'✅',color:'#10b981'},{label:'Courses Done',val:'3',icon:'📚',color:'#7c3aed'}].map(s => (
                  <div key={s.label} style={{ textAlign:'center', padding:'14px', borderRadius:12, background:`${s.color}10`, border:`1px solid ${s.color}25` }}>
                    <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign:'center' }}><Link to="/leaderboard" className="btn btn-primary" style={{ display:'inline-flex' }}>View Full Leaderboard →</Link></div>
          </motion.div>
        )}

        {/* ── CERTIFICATES VIEWER ── */}
        {tab === 'certificates' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:12 }}>
              <div>
                <h1 className="font-display" style={{ fontWeight:800, fontSize:22, color:'var(--text)', marginBottom:4 }}>My Certificates &amp; Credentials</h1>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Event Participation, Achievement, Internship, and Exam certificates</p>
              </div>
              <div style={{ padding:'8px 14px', borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#10b981' }}>
                <CheckCircle size={14}/> Verified Credentials · Real-Time Issued
              </div>
            </div>

            {/* Info banner */}
            <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.15)', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
              <Award size={16} color="#7c3aed"/>
              <div style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>Certificates are issued by Colleges, Companies, and Event Mentors.</strong>
                {' '}When you participate in hackathons, workshops, or win competitions, certificates are awarded directly to your profile.
              </div>
            </div>

            {/* Real Issued Certificates */}
            {(() => {
              const myCerts = myCertificates;
              const allTpls = getAllCertificateTemplates();
              const tagColors: Record<string, string> = {
                participation: '#0284c7', achievement: '#f59e0b', appreciation: '#7c3aed',
                completion: '#10b981', offer: '#3b82f6', merit: '#6366f1'
              };

              if (myCerts.length === 0) {
                return (
                  <div style={{ textAlign:'center', padding:50, borderRadius:16, background:'var(--surface)', border:'1px dashed var(--border)' }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>🏅</div>
                    <div style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:6 }}>No certificates issued yet</div>
                    <div style={{ fontSize:13, color:'var(--text-3)' }}>Participate in college and company events to earn verified certificates.</div>
                  </div>
                );
              }

              return (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:20 }}>
                  {myCerts.map(cert => {
                    const tpl = allTpls.find(t => t.id === cert.templateId) || allTpls[0];
                    const tagCol = tagColors[cert.subType] || '#7c3aed';

                    return (
                      <div key={cert.id} style={{ borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 6px 20px rgba(0,0,0,0.1)' }}>
                        {/* Mini preview scaled proportionately without text cutoff */}
                        <div
                          onClick={() => setViewingCert(cert)}
                          style={{ padding: 12, background: '#080b12', display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <CertificateThumbnail
                            template={tpl}
                            studentName={cert.studentName || studentDisplayName}
                            eventTitle={cert.eventTitle}
                            issueDate={cert.issueDate}
                            credentialId={cert.credentialId}
                            issuerName={cert.issuer}
                            achievementRank={cert.achievementRank}
                            signers={cert.signers}
                            customBgImage={cert.customBgImage}
                          />
                        </div>

                        {/* Card body */}
                        <div style={{ padding:'16px', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                              <span style={{ fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:99, background:`${tagCol}15`, color:tagCol, textTransform:'uppercase' }}>
                                {cert.subType}
                              </span>
                              {cert.achievementRank && (
                                <span style={{ fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:99, background:'rgba(245,158,11,0.15)', color:'#f59e0b' }}>
                                  🏆 {cert.achievementRank}
                                </span>
                              )}
                              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:'rgba(16,185,129,0.1)', color:'#10b981', marginLeft:'auto' }}>
                                ✓ Verified
                              </span>
                            </div>

                            <div style={{ fontWeight:800, fontSize:14, color:'var(--text)', marginBottom:4, lineHeight:1.3 }}>
                              {cert.eventTitle}
                            </div>
                            <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:4 }}>
                              Issued by <strong style={{ color:'var(--text-2)' }}>{cert.issuer}</strong> · {cert.issueDate}
                            </div>
                            <div style={{ fontSize:10.5, color:'var(--text-3)', fontFamily:'monospace', marginBottom:14 }}>
                              Credential ID: {cert.credentialId}
                            </div>
                          </div>

                          <div style={{ display:'flex', gap:8 }}>
                            <button
                              onClick={() => setViewingCert(cert)}
                              style={{ flex:1, padding:'8.5px', borderRadius:9, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', border:'none', color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, boxShadow:'0 2px 10px rgba(124,58,237,0.3)' }}>
                              <Eye size={13}/> View &amp; Download
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(cert.credentialId);
                                alert(`Copied Credential ID: ${cert.credentialId}`);
                              }}
                              style={{ padding:'8.5px 14px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text-2)', fontWeight:600, fontSize:12, cursor:'pointer' }}>
                              Copy ID
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* ── RESUME STUDIO ── */}
        {tab === 'resume' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <StudentResumeBuilder initialStudentName={user?.name || 'nithish'} embeddedInPortal={true} />
          </motion.div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <h1 className="font-display" style={{ fontWeight:800, fontSize:22, color:'var(--text)', marginBottom:4 }}>My Profile</h1>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Update your personal and academic information</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {savedMsg && <span style={{ fontSize:12.5, color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={14}/> {savedMsg}</span>}
                <button onClick={saveProfile} disabled={saving} className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:7, fontSize:13 }}>
                  <Save size={14}/> {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { key:'phone',    label:'Phone Number',   placeholder:'+91 XXXXX XXXXX', type:'tel' },
                { key:'college',  label:'College Name',   placeholder:'Your college' },
                { key:'branch',   label:'Branch',         placeholder:'e.g. CSE, IT' },
                { key:'year',     label:'Year of Study',  placeholder:'e.g. 3rd Year' },
                { key:'cgpa',     label:'CGPA',           placeholder:'e.g. 8.5', type:'number' },
                { key:'linkedIn', label:'LinkedIn URL',   placeholder:'linkedin.com/in/you' },
                { key:'github',   label:'GitHub URL',     placeholder:'github.com/you' },
                { key:'resume',   label:'Resume URL',     placeholder:'drive.google.com/...' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input className="inp" type={(f as any).type||'text'} value={pf[f.key]||''} onChange={e => setPf(p => ({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                </div>
              ))}
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Skills (comma separated)</label>
                <input className="inp" value={pf.skills||''} onChange={e => setPf(p=>({...p,skills:e.target.value}))} placeholder="React, Python, SQL, Node.js" style={{ fontSize:13 }}/>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Bio</label>
                <textarea className="inp" rows={3} value={pf.bio||''} onChange={e => setPf(p=>({...p,bio:e.target.value}))} placeholder="Tell us about yourself…" style={{ fontSize:13, resize:'none' }}/>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── MODAL: HIGH-RES CERTIFICATE VIEWER FOR STUDENT (VIEW & DOWNLOAD ONLY) ── */}
        {viewingCert && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20, backdropFilter: 'blur(8px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setViewingCert(null);
            }}
          >
            <div style={{ width: '100%', maxWidth: 880, background: 'var(--surface)', borderRadius: 20, padding: '24px 26px', maxHeight: '95vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <span style={{ fontSize:10.5, fontWeight:800, padding:'2px 8px', borderRadius:99, background:'rgba(16,185,129,0.12)', color:'#10b981' }}>
                      🔒 Student Viewer Access · Official Credential
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    {viewingCert.eventTitle}
                  </h3>
                  <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                    Awarded to <strong>{viewingCert.studentName || user?.name || 'nithish'}</strong> · ID: {viewingCert.credentialId}
                  </span>
                </div>
                <button
                  onClick={() => setViewingCert(null)}
                  style={{ padding: '6px 14px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight:700, fontSize:12 }}
                >
                  ✕ Close
                </button>
              </div>

              <div id="modal-certificate-content" style={{ maxWidth: 820, margin: '0 auto 20px' }}>
                <CertificateRenderer
                  template={getAllCertificateTemplates().find((t) => t.id === viewingCert.templateId) || getAllCertificateTemplates()[0]}
                  studentName={viewingCert.studentName || user?.name || 'nithish'}
                  eventTitle={viewingCert.eventTitle}
                  issueDate={viewingCert.issueDate}
                  credentialId={viewingCert.credentialId}
                  issuerName={viewingCert.issuer}
                  achievementRank={viewingCert.achievementRank}
                  signers={viewingCert.signers}
                  customBgImage={viewingCert.customBgImage}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap:'wrap' }}>
                <button
                  onClick={() => {
                    const el = document.querySelector('#modal-certificate-content .certificate-print-card') || document.querySelector('.certificate-print-card');
                    if (el) printCertificateWindow(el.outerHTML, viewingCert.eventTitle);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '11px 26px',
                    borderRadius: 11, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', color: '#fff',
                    fontWeight: 800, fontSize: 13.5, cursor: 'pointer', boxShadow:'0 4px 18px rgba(124,58,237,0.4)',
                  }}
                >
                  <Download size={15} /> Download PDF Certificate
                </button>
                <button
                  onClick={() => {
                    const el = document.querySelector('#modal-certificate-content .certificate-print-card') || document.querySelector('.certificate-print-card');
                    if (el) printCertificateWindow(el.outerHTML, viewingCert.eventTitle);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px',
                    borderRadius: 11, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  <Printer size={15} /> Print Certificate
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(viewingCert.credentialId);
                    alert(`Copied Credential ID: ${viewingCert.credentialId}`);
                  }}
                  style={{
                    padding: '11px 20px', borderRadius: 11, background: 'var(--bg-2)',
                    border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Copy Credential ID
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: EVENT REGISTRATION PASS (TICKET & ADMIT CARD) ── */}
        {viewingPass && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
              zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20, backdropFilter: 'blur(8px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setViewingPass(null);
            }}
          >
            <div style={{ width: '100%', maxWidth: 640, background: 'var(--surface)', borderRadius: 20, padding: '24px 26px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ticket size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                      Official Digital Event Pass
                    </h3>
                    <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      Confirmed registration · Pass ID: {viewingPass.passId}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingPass(null)}
                  style={{ padding: '6px 14px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
                >
                  ✕ Close
                </button>
              </div>

              {/* Ticket Card Content */}
              <div id="student-portal-ticket-pass" style={{
                padding: '24px', borderRadius: 16, background: '#0b0f19',
                border: '2px dashed rgba(59,130,246,0.5)', color: '#fff', marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 14, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#60a5fa' }}>
                      Verified Registration Pass
                    </span>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', marginTop: 2 }}>{viewingPass.eventTitle}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {viewingPass.organizerType === 'company' ? '🏢 Company Event · ' : viewingPass.organizerType === 'college' ? '🏛️ College Event · ' : ''}
                      Organized by <strong>{viewingPass.organizer}</strong>
                    </div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: 11, fontWeight: 800, border: '1px solid rgba(16,185,129,0.3)' }}>
                    ✓ Confirmed
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>Attendee</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{viewingPass.studentName}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{viewingPass.studentEmail}</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>Pass Code</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>{viewingPass.passId}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Single Entry Token</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>Date &amp; Time</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{viewingPass.date}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{viewingPass.time}</div>
                  </div>
                  <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>Organizer &amp; Venue</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{viewingPass.organizer}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{viewingPass.location || viewingPass.mode}</div>
                  </div>
                </div>

                {/* Official Certificate Policy notice */}
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', fontSize: 12, color: '#fde68a', lineHeight: 1.5 }}>
                  <strong>📜 Certificate Issuance Policy:</strong> Certificates are not issued at registration. Your verified Certificate of Completion / Participation / Achievement will be issued by the <strong>{viewingPass.organizer}</strong> mentor directly to your Student Portal after the event upon attendance verification.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={() => {
                    const el = document.getElementById('student-portal-ticket-pass');
                    if (el) {
                      const w = window.open('', '_blank', 'width=700,height=800');
                      if (w) {
                        w.document.write(`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <title>Event Pass - ${viewingPass.eventTitle}</title>
                              <style>
                                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #fff; padding: 40px; margin: 0; display: flex; justify-content: center; }
                                @media print { body { background: #fff; color: #000; padding: 0; } }
                              </style>
                            </head>
                            <body>
                              ${el.outerHTML}
                              <script>window.onload = function() { window.print(); };</script>
                            </body>
                          </html>
                        `);
                        w.document.close();
                      }
                    }
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px',
                    borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff',
                    fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.35)'
                  }}
                >
                  <Printer size={15} /> Print Event Pass
                </button>
                <button
                  onClick={() => setViewingPass(null)}
                  style={{ padding: '10px 18px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
