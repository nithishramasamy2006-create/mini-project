import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BookOpen, Award, User, LogOut,
  TrendingUp, Clock, CheckCircle, XCircle, Star, Briefcase,
  Heart, Home, Save, Bell, Trophy, Users, Zap, Calendar,
  MapPin, Globe, ChevronRight, Edit3, Bookmark, GraduationCap,
  Monitor, Building2, Play, Target, Flame, MessageSquare, Layers,
  Download, Lock, Eye, Video, Send, X
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ALL_COURSES } from '../courseData';
import { EXAMS } from '../examData';
import { EVENTS } from '../eventsData';
import { PROJECTS } from '../data';

// ── Types ─────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'projects' | 'courses' | 'internships' | 'events' |
           'exams' | 'jobs' | 'mentors' | 'leaderboard' | 'certificates' | 'profile';

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
// Reads sessions from 'nm_mentor_sessions' — written by MentorPortal (company side)
// Both run on same origin (localhost:8080) so localStorage is shared.
// Uses storage event for instant cross-tab sync + polling as fallback.
function MentorStudentView({ studentName, studentEmail }: { studentName: string; studentEmail: string }) {
  const [sessions,    setSessions]    = useState<any[]>([]);
  const [chatOpen,    setChatOpen]    = useState<string | null>(null);
  const [messages,    setMessages]    = useState<any[]>([]);
  const [draft,       setDraft]       = useState('');
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const endRef = useRef<HTMLDivElement>(null);

  // ── Read ALL sessions from localStorage ──────────────────────────
  const readSessions = () => {
    try {
      const raw = localStorage.getItem('nm_mentor_sessions');
      if (!raw) { setSessions([]); return; }
      const all: any[] = JSON.parse(raw);
      // Show sessions for this student. Fallback: show ALL (same-browser demo)
      const forMe = all.filter(s =>
        (s.studentEmail && studentEmail && s.studentEmail.trim().toLowerCase() === studentEmail.trim().toLowerCase()) ||
        (s.studentName  && studentName  && s.studentName.trim().toLowerCase()  === studentName.trim().toLowerCase())
      );
      const toShow = forMe.length > 0 ? forMe : all; // show all if no match
      toShow.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setSessions(toShow);
    } catch (e) { setSessions([]); }
  };

  // ── Read chat for open session ────────────────────────────────────
  const readChat = (sid: string) => {
    try {
      const all: any[] = JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]');
      setMessages(all.filter(m => m.sessionId === sid));
    } catch { setMessages([]); }
  };

  // ── Setup: poll + storage event (cross-tab instant sync) ──────────
  useEffect(() => {
    readSessions();
    // Polling — catches same-tab writes
    const iv = setInterval(() => { readSessions(); if (chatOpen) readChat(chatOpen); }, 1500);
    // Storage event — catches writes from OTHER tabs/windows instantly
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nm_mentor_sessions') readSessions();
      if (e.key === 'nm_mentor_chat' && chatOpen) readChat(chatOpen);
    };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(iv); window.removeEventListener('storage', onStorage); };
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

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:22, color:'var(--text)', margin:0 }}>My Mentor Sessions</h2>
          <p style={{ fontSize:12.5, color:'var(--text-3)', margin:'4px 0 0' }}>
            Live sessions assigned by your mentor — join Google Meet or chat directly
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* Session count badge */}
          <div style={{ padding:'6px 12px', borderRadius:10, background: sessions.length > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', border:`1px solid ${sessions.length > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`, fontSize:12, color: sessions.length > 0 ? '#10b981' : 'var(--text-3)', fontWeight:700 }}>
            {sessions.length > 0 ? `✅ ${sessions.length} session${sessions.length > 1 ? 's' : ''}` : '⏳ No sessions yet'}
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

      {/* ── How it works info ── */}
      <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.2)', marginBottom:20, display:'flex', gap:12, alignItems:'flex-start' }}>
        <Video size={16} color="#3b82f6" style={{ marginTop:2, flexShrink:0 }} />
        <div style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.7 }}>
          <strong style={{ color:'var(--text)' }}>How it works:</strong>{' '}
          Your company mentor goes to <strong>Company Portal → 🎓 Mentor Portal</strong> tab, creates a session with a Google Meet link.
          It will appear here automatically. Click <strong style={{ color:'#10b981' }}>Join Google Meet</strong> to enter the video call.
          <span style={{ display:'block', fontSize:11, color:'var(--text-3)', marginTop:3 }}>
            Last synced: {new Date(lastRefresh).toLocaleTimeString()} · Auto-refreshes every 1.5s
          </span>
        </div>
      </div>

      {sessions.length === 0 ? (
        /* ── Empty State ── */
        <div>
          <div style={{ textAlign:'center', padding:'50px 24px', borderRadius:20, background:'var(--surface)', border:'2px dashed var(--border)', marginBottom:16 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎓</div>
            <h3 style={{ fontWeight:800, fontSize:20, color:'var(--text)', marginBottom:8 }}>No Sessions Assigned Yet</h3>
            <p style={{ color:'var(--text-3)', fontSize:13.5, maxWidth:420, margin:'0 auto 20px', lineHeight:1.7 }}>
              Ask your company mentor to go to their <strong>Company Portal → Mentor Portal</strong> tab, click{' '}
              <strong>"New Session"</strong>, and add your name along with a Google Meet link. It will appear here instantly.
            </p>
            <button onClick={() => { readSessions(); setLastRefresh(Date.now()); }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:11, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:12, boxShadow:'0 4px 14px rgba(59,130,246,0.35)' }}>
              🔄 Check for new sessions
            </button>
            {/* Storage debug */}
            <details style={{ textAlign:'left', maxWidth:500, margin:'12px auto 0' }}>
              <summary style={{ fontSize:11, color:'var(--text-3)', cursor:'pointer' }}>🔧 Debug: view raw localStorage data</summary>
              <pre style={{ marginTop:8, padding:'10px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)', fontSize:10.5, color:'var(--text-3)', maxHeight:140, overflowY:'auto', whiteSpace:'pre-wrap', wordBreak:'break-all', textAlign:'left' }}>
                nm_mentor_sessions: {localStorage.getItem('nm_mentor_sessions') || '(empty)'}
              </pre>
            </details>
          </div>
        </div>
      ) : (
        /* ── Session Cards ── */
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {sessions.map(s => {
            const newMsgs    = countMentorMsgs(s.id);
            const isChatOpen = chatOpen === s.id;

            return (
              <div key={s.id} style={{ borderRadius:18, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 4px 24px rgba(0,0,0,0.07)' }}>
                {/* Top accent bar */}
                <div style={{ height:4, background:'linear-gradient(90deg,#3b82f6,#7c3aed,#10b981)' }} />

                <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>

                  {/* ── Session Info Row ── */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:50, height:50, borderRadius:14, background:'linear-gradient(135deg,#3b82f6,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                      🎓
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:17, color:'var(--text)', marginBottom:6 }}>{s.topic || 'Mentor Session'}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                        {s.studentName && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-3)' }}>
                            👤 <span style={{ color:'var(--text-2)', fontWeight:600 }}>{s.studentName}</span>
                          </span>
                        )}
                        {s.scheduledAt && fmtDate(s.scheduledAt) && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-3)' }}>
                            📅 <span style={{ color:'var(--text-2)' }}>{fmtDate(s.scheduledAt)}</span>
                          </span>
                        )}
                        {s.studentEmail && (
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-3)' }}>
                            ✉ <span style={{ color:'var(--text-2)' }}>{s.studentEmail}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Status badge */}
                    <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end', flexShrink:0 }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background: s.meetLink ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.1)', color: s.meetLink ? '#10b981' : '#f59e0b', border:`1px solid ${s.meetLink ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                        {s.meetLink ? '✓ Meet Ready' : '⏳ Meet Pending'}
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
                      style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:14, background:'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.05))', border:'2px solid rgba(16,185,129,0.35)', textDecoration:'none' }}
                      onMouseEnter={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1))'; e.currentTarget.style.borderColor='rgba(16,185,129,0.6)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.05))'; e.currentTarget.style.borderColor='rgba(16,185,129,0.35)'; }}>
                      {/* Google Meet icon */}
                      <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(16,185,129,0.4)' }}>
                        <Video size={22} color="#fff" />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:800, fontSize:15, color:'#10b981', marginBottom:3 }}>Join Google Meet</div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {s.meetLink}
                        </div>
                      </div>
                      <div style={{ padding:'10px 20px', borderRadius:11, background:'linear-gradient(135deg,#10b981,#059669)', color:'#fff', fontWeight:800, fontSize:13.5, flexShrink:0, boxShadow:'0 3px 12px rgba(16,185,129,0.4)', whiteSpace:'nowrap' }}>
                        Join Now →
                      </div>
                    </a>
                  ) : (
                    <div style={{ padding:'14px 16px', borderRadius:13, background:'rgba(245,158,11,0.06)', border:'1px dashed rgba(245,158,11,0.35)', display:'flex', alignItems:'center', gap:12 }}>
                      <span style={{ fontSize:24 }}>⏳</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:'#f59e0b', marginBottom:2 }}>Google Meet link not added yet</div>
                        <div style={{ fontSize:12, color:'var(--text-3)' }}>Your mentor will update the session with a Meet link soon. Send a message below to request it.</div>
                      </div>
                    </div>
                  )}

                  {/* ── Session Notes ── */}
                  {s.notes && (
                    <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(124,58,237,0.06)', border:'1px solid rgba(124,58,237,0.18)', display:'flex', gap:10 }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>📝</span>
                      <div>
                        <div style={{ fontSize:10.5, fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>Mentor's Notes</div>
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



  // ── Load chat for active session ───────────────────────────────────
  const reloadChat = (sessionId: string) => {
    try {
      const all: any[] = JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]');
      setMessages(all.filter(m => m.sessionId === sessionId));
    } catch { setMessages([]); }
  };

  useEffect(() => {
    reload();
    const iv = setInterval(reload, 2500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    reloadChat(chatOpen);
    const iv = setInterval(() => reloadChat(chatOpen), 2000);
    return () => clearInterval(iv);
  }, [chatOpen]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Send student message ───────────────────────────────────────────
  const sendMsg = () => {
    if (!draft.trim() || !chatOpen) return;
    const msg = { id: Date.now().toString(), sessionId: chatOpen, from: 'student', senderName: studentName || 'Student', text: draft.trim(), ts: Date.now() };
    const all: any[] = JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]');
    localStorage.setItem('nm_mentor_chat', JSON.stringify([...all, msg]));
    setDraft('');
    reloadChat(chatOpen);
  };

  const fmt     = (ts: number)  => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const fmtDate = (str: string) => { const d = new Date(str); return isNaN(d.getTime()) ? str : d.toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }); };

  const getMentorMsgs = (sid: string) => {
    try { return JSON.parse(localStorage.getItem('nm_mentor_chat') || '[]').filter((m: any) => m.sessionId === sid && m.from === 'mentor').length; }
    catch { return 0; }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:22, color:'var(--text)', margin:0 }}>My Mentor Sessions</h2>
          <p style={{ fontSize:12.5, color:'var(--text-3)', margin:'4px 0 0' }}>
            Sessions assigned by your company / college mentor — join Google Meet or message directly
          </p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ padding:'8px 14px', borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', fontSize:12, color:'#10b981', fontWeight:600 }}>
            {allSessions.length} session{allSessions.length !== 1 ? 's' : ''} assigned
          </div>
          <Link to="/mentors" style={{ padding:'8px 14px', borderRadius:10, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', fontSize:12, fontWeight:600, textDecoration:'none' }}>
            Browse Public Mentors →
          </Link>
        </div>
      </div>

      {/* How it works banner */}
      <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.18)', marginBottom:22, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <Video size={16} color="#3b82f6" />
        <div style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.6, flex:1 }}>
          <strong style={{ color:'var(--text)' }}>How it works:</strong> Your company mentor creates sessions in their portal and adds a Google Meet link.
          The session appears here automatically — click <strong>Join Google Meet</strong> to enter the video call.
        </div>
      </div>

      {allSessions.length === 0 ? (
        /* ── Empty state ── */
        <div style={{ textAlign:'center', padding:'56px 24px', borderRadius:20, background:'var(--surface)', border:'1px dashed var(--border)' }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎓</div>
          <h3 style={{ fontWeight:800, fontSize:20, color:'var(--text)', marginBottom:8 }}>No sessions assigned yet</h3>
          <p style={{ color:'var(--text-3)', fontSize:13.5, maxWidth:400, margin:'0 auto 24px', lineHeight:1.7 }}>
            Your mentor will create a session in the <strong>Company Portal → Mentor Portal</strong> tab and add a Google Meet link. It will appear here instantly.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/mentors" className="btn btn-primary" style={{ display:'inline-flex', textDecoration:'none', alignItems:'center', gap:7 }}>
              Browse Public Mentors
            </Link>
          </div>
          {/* Debug helper — shows what's stored */}
          <details style={{ marginTop:28, textAlign:'left', maxWidth:500, margin:'28px auto 0' }}>
            <summary style={{ fontSize:11, color:'var(--text-3)', cursor:'pointer', userSelect:'none' }}>🔧 Debug: check stored sessions</summary>
            <pre style={{ marginTop:8, padding:'10px 12px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)', fontSize:10.5, color:'var(--text-3)', overflowX:'auto', maxHeight:160, whiteSpace:'pre-wrap', wordBreak:'break-all' }}>
              {localStorage.getItem('nm_mentor_sessions') || '(none)'}
            </pre>
          </details>
        </div>
      ) : (
        /* ── Sessions grid ── */
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {allSessions.map(s => {
            const newMsgs = getMentorMsgs(s.id);
            const isChatOpen = chatOpen === s.id;

            return (
              <div key={s.id} style={{ borderRadius:18, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', boxShadow:'0 2px 20px rgba(0,0,0,0.08)' }}>
                {/* Colour stripe */}
                <div style={{ height:4, background:'linear-gradient(90deg,#3b82f6,#7c3aed,#10b981)' }} />

                <div style={{ padding:'20px 22px' }}>
                  {/* ── Row 1: Avatar + info + badges ── */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
                    <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#fff', flexShrink:0 }}>
                      🎓
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:16, color:'var(--text)', marginBottom:4 }}>{s.topic || 'Mentor Session'}</div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontSize:11.5, color:'var(--text-3)' }}>
                          👤 Student: <strong style={{ color:'var(--text-2)' }}>{s.studentName || studentName}</strong>
                        </span>
                        {s.scheduledAt && (
                          <span style={{ fontSize:11.5, color:'var(--text-3)' }}>
                            📅 {fmtDate(s.scheduledAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-end' }}>
                      {s.meetLink ? (
                        <span style={{ fontSize:10.5, fontWeight:700, padding:'3px 10px', borderRadius:999, background:'rgba(16,185,129,0.12)', color:'#10b981', border:'1px solid rgba(16,185,129,0.25)' }}>
                          ✓ Meet Link Ready
                        </span>
                      ) : (
                        <span style={{ fontSize:10.5, fontWeight:700, padding:'3px 10px', borderRadius:999, background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.25)' }}>
                          ⏳ Meet Link Pending
                        </span>
                      )}
                      {newMsgs > 0 && (
                        <span style={{ fontSize:10, fontWeight:800, padding:'2px 8px', borderRadius:999, background:'rgba(239,68,68,0.15)', color:'#ef4444' }}>
                          🔴 {newMsgs} new message{newMsgs > 1 ? 's' : ''} from mentor
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ── Google Meet CTA ── */}
                  {s.meetLink ? (
                    <a href={s.meetLink} target="_blank" rel="noopener noreferrer"
                      style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderRadius:14, background:'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))', border:'2px solid rgba(16,185,129,0.3)', textDecoration:'none', marginBottom:12, transition:'all 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.12))')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))')}>
                      <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(16,185,129,0.4)' }}>
                        <Video size={20} color="#fff" />
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:800, fontSize:14.5, color:'#10b981', marginBottom:2 }}>Join Google Meet</div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)', fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:320 }}>{s.meetLink}</div>
                      </div>
                      <div style={{ padding:'8px 16px', borderRadius:10, background:'#10b981', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>
                        Join →
                      </div>
                    </a>
                  ) : (
                    <div style={{ padding:'14px 18px', borderRadius:13, background:'rgba(245,158,11,0.06)', border:'1px dashed rgba(245,158,11,0.3)', marginBottom:12, display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ fontSize:22 }}>⏳</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:'#f59e0b', marginBottom:2 }}>Google Meet link not added yet</div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)' }}>Your mentor will add the meeting link soon — check back or send a message below.</div>
                      </div>
                    </div>
                  )}

                  {/* ── Notes ── */}
                  {s.notes && (
                    <div style={{ padding:'10px 14px', borderRadius:11, background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.18)', marginBottom:12, display:'flex', gap:10 }}>
                      <span style={{ fontSize:16, flexShrink:0 }}>📝</span>
                      <div>
                        <div style={{ fontSize:11, fontWeight:700, color:'#f59e0b', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.05em' }}>Session Notes from Mentor</div>
                        <div style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.6 }}>{s.notes}</div>
                      </div>
                    </div>
                  )}

                  {/* ── Chat toggle ── */}
                  <button onClick={() => { setChatOpen(isChatOpen ? null : s.id); if (!isChatOpen) reloadChat(s.id); }}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', borderRadius:11, border:`1px solid ${isChatOpen ? '#7c3aed' : 'var(--border)'}`, background: isChatOpen ? 'rgba(124,58,237,0.1)' : 'var(--bg)', color: isChatOpen ? '#7c3aed' : 'var(--text-2)', fontWeight:700, fontSize:12.5, cursor:'pointer', width:'100%', justifyContent:'center' }}>
                    <MessageSquare size={13} />
                    {isChatOpen ? 'Close Chat' : 'Chat with Mentor'}
                    {newMsgs > 0 && !isChatOpen && <span style={{ marginLeft:4, padding:'1px 7px', borderRadius:999, background:'#ef4444', color:'#fff', fontSize:10, fontWeight:800 }}>{newMsgs}</span>}
                  </button>

                  {/* ── Inline Chat ── */}
                  {isChatOpen && (
                    <div style={{ marginTop:14, borderRadius:13, border:'1px solid rgba(124,58,237,0.25)', overflow:'hidden', background:'var(--bg)' }}>
                      {/* Chat header */}
                      <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8, background:'rgba(124,58,237,0.06)' }}>
                        <MessageSquare size={13} color="#7c3aed" />
                        <span style={{ fontWeight:700, fontSize:12, color:'var(--text)' }}>Conversation with your mentor</span>
                        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, fontSize:10.5, color:'#10b981' }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981' }} /> Live · syncs automatically
                        </div>
                      </div>

                      {/* Messages */}
                      <div style={{ height:260, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
                        {messages.length === 0 && (
                          <div style={{ textAlign:'center', color:'var(--text-3)', fontSize:12, marginTop:36, lineHeight:1.7 }}>
                            No messages yet.<br />Start the conversation or wait for your mentor to message you first 💬
                          </div>
                        )}
                        {messages.map(m => (
                          <div key={m.id} style={{ display:'flex', flexDirection: m.from === 'student' ? 'row-reverse' : 'row', gap:8, alignItems:'flex-end' }}>
                            <div style={{ width:28, height:28, borderRadius:'50%', background: m.from === 'student' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11, color:'#fff', flexShrink:0 }}>
                              {m.senderName?.[0] || '?'}
                            </div>
                            <div style={{ maxWidth:'72%' }}>
                              <div style={{ fontSize:10, color:'var(--text-3)', marginBottom:3, textAlign: m.from === 'student' ? 'right' : 'left', fontWeight:600 }}>
                                {m.senderName} · {fmt(m.ts)}
                              </div>
                              <div style={{ padding:'9px 13px', borderRadius: m.from === 'student' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.from === 'student' ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'var(--surface)', border: m.from === 'mentor' ? '1px solid var(--border)' : 'none', color: m.from === 'student' ? '#fff' : 'var(--text)', fontSize:13, lineHeight:1.5 }}>
                                {m.text}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={endRef} />
                      </div>

                      {/* Input row */}
                      <div style={{ padding:'10px 12px', borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
                        <input value={draft} onChange={e => setDraft(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMsg())}
                          placeholder="Type a message to your mentor… (Enter to send)"
                          style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'9px 13px', fontSize:13, color:'var(--text)', outline:'none' }} />
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

  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab,  setTab]  = useState<Tab>('dashboard');
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile edit
  const [pf, setPf] = useState<Record<string,any>>({});
  const [saving,  setSaving]  = useState(false);
  const [savedMsg,setSavedMsg]= useState('');

  // localStorage data
  const wishlist   = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_wishlist')||'[]') as number[]; } catch { return []; } }, []);
  const savedProj  = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_saved_projects')||'[]') as number[]; } catch { return []; } }, []);
  const regEvents  = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_registered_events')||'[]') as number[]; } catch { return []; } }, []);
  const regExams   = useMemo(() => { try { return (JSON.parse(localStorage.getItem('nm_exam_registrations')||'[]') as any[]).map((r:any) => r.examId); } catch { return []; } }, []);

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/login'); return; }
    fetch('http://localhost:5000/api/applications/my', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => { if (d.success) setApps(d.applications); }).finally(() => setLoading(false));
  }, [user]);

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

  if (!user || user.role !== 'student') return null;

  const pending  = apps.filter(a => a.status === 'pending').length;
  const accepted = apps.filter(a => ['hired','accepted'].includes(a.status)).length;
  const shortlisted = apps.filter(a => ['shortlisted','interview'].includes(a.status)).length;
  const savedCourses  = ALL_COURSES.filter(c => wishlist.includes(c.id));
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
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
                {savedCourses.map((c:any) => (
                  <div key={c.id} style={{ borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden' }}>
                    <div style={{ height:120, background:'linear-gradient(135deg,#1e1b4b,#0f172a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>📚</div>
                    <div style={{ padding:'12px 14px' }}>
                      <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{c.title}</div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:11.5, color:'var(--text-3)' }}>⏱ {c.hours}h · {c.level}</span>
                        <Link to={`/learn/${c.id}`} style={{ fontSize:12, fontWeight:700, color:'var(--accent)', textDecoration:'none' }}>▶ Start</Link>
                      </div>
                    </div>
                  </div>
                ))}
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
                <p style={{ fontSize:12, fontWeight:700, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>✅ Your Registered Events</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                  {EVENTS.filter(e => regEvents.includes(e.id)).map(e => (
                    <div key={e.id} style={{ padding:'14px 18px', borderRadius:13, background:'var(--surface)', border:`1px solid ${e.color}30`, display:'flex', alignItems:'center', gap:14 }}>
                      <span style={{ fontSize:28 }}>{e.banner}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)' }}>{e.title}</div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{e.date} · {e.time} · {e.location}</div>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:999, background:'rgba(16,185,129,0.1)', color:'#10b981' }}>Registered ✓</span>
                    </div>
                  ))}
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
                  {EXAMS.filter(e => regExams.includes(e.id)).map(e => (
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
              {EXAMS.slice(0,4).map(e => (
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
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap', gap:12 }}>
              <div>
                <h1 className="font-display" style={{ fontWeight:800, fontSize:22, color:'var(--text)', marginBottom:4 }}>My Certificates</h1>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Certificates issued to you by Companies &amp; Colleges</p>
              </div>
              <div style={{ padding:'8px 14px', borderRadius:10, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#a78bfa' }}>
                <Lock size={13}/> View-only · Issued by your Company / College
              </div>
            </div>

            {/* Info banner */}
            <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.12)', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
              <Eye size={15} color="#7c3aed"/>
              <div style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.6 }}>
                <strong style={{ color:'var(--text)' }}>Certificates are issued by Companies and Colleges only.</strong>
                {' '}Once issued, they appear here for you to view and download. You cannot create or edit certificates yourself.
              </div>
            </div>

            {/* Sample certs — replace with real API data when backend is ready */}
            {(() => {
              const ISSUED = [
                { id:'c1', courseName:'Full Stack Web Development', issuer:'NaanMudhalvan', issuerType:'college', date:'October 2026', credentialId:'NM-2026-FSW-A4B2', type:'course', color:'#7c3aed' },
                { id:'c2', courseName:'React.js Internship Program', issuer:'Zoho Corporation', issuerType:'company', date:'September 2026', credentialId:'NM-2026-INT-C7D1', type:'internship', color:'#e42527' },
                { id:'c3', courseName:'Excellence in Artificial Intelligence', issuer:'NaanMudhalvan', issuerType:'college', date:'August 2026', credentialId:'NM-2026-EXC-E8F3', type:'excellence', color:'#f59e0b' },
              ];
              const typeColors: Record<string,string> = { internship:'#3b82f6', course:'#7c3aed', excellence:'#f59e0b' };
              const typeIcon: Record<string,string> = { internship:'💼', course:'📖', excellence:'🏆' };
              return (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                  {ISSUED.map(cert => (
                    <div key={cert.id} style={{ borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', position:'relative' }}>
                      {/* Colour bar */}
                      <div style={{ height:4, background:`linear-gradient(90deg,${cert.color},${cert.color}60)` }}/>
                      {/* Preview banner */}
                      <div style={{ padding:'16px 16px 10px', background:`${cert.color}08`, borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:48, height:48, borderRadius:13, background:`${cert.color}15`, border:`1px solid ${cert.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                          {typeIcon[cert.type]}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', lineHeight:1.3, marginBottom:3, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{cert.courseName}</div>
                          <div style={{ fontSize:11, color:'var(--text-3)' }}>Issued by <strong style={{ color:'var(--text-2)' }}>{cert.issuer}</strong></div>
                        </div>
                      </div>
                      {/* Details */}
                      <div style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 9px', borderRadius:999, background:`${typeColors[cert.type]}15`, color:typeColors[cert.type], textTransform:'capitalize' }}>{cert.type}</span>
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 9px', borderRadius:999, background:'rgba(16,185,129,0.1)', color:'#10b981' }}>✓ Verified</span>
                        </div>
                        <div style={{ fontSize:11.5, color:'var(--text-3)', marginBottom:3 }}>Date: {cert.date}</div>
                        <div style={{ fontSize:10.5, color:'var(--text-3)', fontFamily:'monospace', marginBottom:12 }}>ID: {cert.credentialId}</div>
                        <div style={{ display:'flex', gap:8 }}>
                          <button
                            onClick={() => {
                              const win = window.open('', '_blank');
                              if (!win) return;
                              win.document.write(`<html><head><title>${cert.courseName}</title><style>body{margin:20px;font-family:sans-serif;background:#030712;color:#fff;}</style></head><body><h2>${cert.courseName}</h2><p>Awarded to: <strong>${user?.name||'Student'}</strong></p><p>Issued by: ${cert.issuer}</p><p>Date: ${cert.date}</p><p>Credential ID: ${cert.credentialId}</p></body></html>`);
                              win.document.close(); setTimeout(()=>{win.print();},400);
                            }}
                            style={{ flex:1, padding:'8px', borderRadius:9, background:`linear-gradient(135deg,${cert.color},${cert.color}90)`, border:'none', color:'#fff', fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                            <Download size={12}/> Download
                          </button>
                          <button
                            onClick={() => navigator.clipboard.writeText(cert.credentialId)}
                            style={{ padding:'8px 14px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text-2)', fontWeight:600, fontSize:12, cursor:'pointer' }}>
                            Copy ID
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
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

      </main>
    </div>
  );
}
