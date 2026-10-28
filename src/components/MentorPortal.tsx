// MentorPortal.tsx — Company-side Mentor Communication Portal
// Features: student roster, Google Meet link per session, real-time-style chat, student picker
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, MessageSquare, Send, Plus, Trash2, CheckCircle,
  Users, Clock, Calendar, Link as LinkIcon,
  ChevronDown, X, Sparkles, UserCheck, Globe,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MentorSession {
  id: string;
  mentorId: string;
  mentorName?: string;
  companyName?: string;
  studentEmail: string;
  studentName: string;
  topic: string;
  meetLink: string;
  scheduledAt: string; // ISO string
  notes: string;
  createdAt: number;
  isOpenToAll?: boolean;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  from: 'mentor' | 'student';
  senderName: string;
  text: string;
  ts: number;
}

// ── LS helpers ─────────────────────────────────────────────────────────────────
const LS_SESSIONS = 'nm_mentor_sessions';
const LS_CHAT     = 'nm_mentor_chat';

export function generateMeetCode(): string {
  const p1 = Math.random().toString(36).substring(2, 5);
  const p2 = Math.random().toString(36).substring(2, 6);
  const p3 = Math.random().toString(36).substring(2, 5);
  return `https://meet.google.com/${p1}-${p2}-${p3}`;
}

function getSessions(mentorId: string, companyName?: string): MentorSession[] {
  try {
    const all: any[] = JSON.parse(localStorage.getItem(LS_SESSIONS) || '[]');
    return all.filter((s: any) =>
      s.mentorId === mentorId ||
      (companyName && s.companyName && s.companyName.trim().toLowerCase() === companyName.trim().toLowerCase())
    );
  } catch { return []; }
}

function saveSessions(mentorId: string, sessions: MentorSession[]) {
  const all: any[] = JSON.parse(localStorage.getItem(LS_SESSIONS) || '[]').filter((s: any) => s.mentorId !== mentorId);
  localStorage.setItem(LS_SESSIONS, JSON.stringify([...all, ...sessions]));
  window.dispatchEvent(new CustomEvent('nm_mentor_sessions_updated'));
  window.dispatchEvent(new Event('storage'));
}

function getChat(sessionId: string): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(LS_CHAT) || '[]').filter((m: ChatMessage) => m.sessionId === sessionId); }
  catch { return []; }
}

function appendChat(msg: ChatMessage) {
  const all: ChatMessage[] = JSON.parse(localStorage.getItem(LS_CHAT) || '[]');
  localStorage.setItem(LS_CHAT, JSON.stringify([...all, msg]));
  window.dispatchEvent(new CustomEvent('nm_mentor_sessions_updated'));
  window.dispatchEvent(new Event('storage'));
}

// ── Chat Box Component ─────────────────────────────────────────────────────────
function ChatBox({ session, mentorName }: { session: MentorSession; mentorName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const refresh = () => setMessages(getChat(session.id));

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 2000);
    return () => clearInterval(iv);
  }, [session.id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sessionId: session.id,
      from: 'mentor',
      senderName: mentorName,
      text: draft.trim(),
      ts: Date.now(),
    };
    appendChat(msg);
    setDraft('');
    refresh();
  };

  const fmt = (ts: number) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 340, background: 'var(--bg)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)' }}>
        <MessageSquare size={14} color="#7c3aed" />
        <span style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text)' }}>Chat with {session.studentName}</span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 12, marginTop: 40 }}>
            No messages yet. Start the conversation! 💬
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', flexDirection: m.from === 'mentor' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.from === 'mentor' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, color: '#fff', flexShrink: 0 }}>
              {m.senderName[0]}
            </div>
            <div style={{ maxWidth: '70%' }}>
              <div style={{ padding: '8px 12px', borderRadius: m.from === 'mentor' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.from === 'mentor' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'var(--surface)', border: m.from === 'student' ? '1px solid var(--border)' : 'none', color: m.from === 'mentor' ? '#fff' : 'var(--text)', fontSize: 13, lineHeight: 1.5 }}>
                {m.text}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, textAlign: m.from === 'mentor' ? 'right' : 'left' }}>{fmt(m.ts)}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
          placeholder="Type a message…"
          style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: 13, color: 'var(--text)', outline: 'none' }}
        />
        <button onClick={send}
          style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Session Card ───────────────────────────────────────────────────────────────
function SessionCard({ session, mentorName, onDelete, onUpdate }: {
  session: MentorSession; mentorName: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MentorSession>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState(false);
  const [editing, setEditing] = useState(false);
  const [meetLink, setMeetLink] = useState(session.meetLink);
  const [notes, setNotes] = useState(session.notes);
  const studentMsg = getChat(session.id).filter(m => m.from === 'student').length;

  const save = () => {
    onUpdate(session.id, { meetLink, notes });
    setEditing(false);
  };

  const d = new Date(session.scheduledAt);
  const dateStr = isNaN(d.getTime()) ? session.scheduledAt : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div style={{ borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 12 }}>
      {/* Top bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)' }} />

      {/* Header row */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: session.isOpenToAll ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>
          {session.isOpenToAll ? <Globe size={20} /> : (session.studentName?.[0] || 'S')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{session.studentName}</span>
            {session.isOpenToAll && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                🌐 Open to All Students
              </span>
            )}
            {session.studentEmail && !session.isOpenToAll && (
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>({session.studentEmail})</span>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
            <strong>{session.topic}</strong> · {dateStr || 'Flexible Timing'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {studentMsg > 0 && (
            <div style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 10.5, fontWeight: 800 }}>
              {studentMsg} msg
            </div>
          )}
          {session.meetLink ? (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
              Meet Ready ✓
            </span>
          ) : (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>
              Link Pending
            </span>
          )}
          <ChevronDown size={14} color="var(--text-3)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {session.meetLink ? (
                  <a href={session.meetLink} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', boxShadow: '0 3px 12px rgba(16,185,129,0.35)' }}>
                    <Video size={14} /> Join Google Meet
                  </a>
                ) : (
                  <div style={{ padding: '9px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 12, fontWeight: 600 }}>
                    ⚠ No Meet link added yet
                  </div>
                )}
                <button onClick={() => { setChat(c => !c); setEditing(false); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, background: chat ? 'rgba(124,58,237,0.15)' : 'var(--bg)', border: `1px solid ${chat ? '#7c3aed' : 'var(--border)'}`, color: chat ? '#7c3aed' : 'var(--text)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>
                  <MessageSquare size={13} /> {chat ? 'Hide Chat' : 'Open Chat'}
                  {studentMsg > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, padding: '0 5px', fontSize: 10, fontWeight: 800 }}>{studentMsg}</span>}
                </button>
                <button onClick={() => { setEditing(e => !e); setChat(false); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 10, background: editing ? 'rgba(245,158,11,0.12)' : 'var(--bg)', border: `1px solid ${editing ? '#f59e0b' : 'var(--border)'}`, color: editing ? '#f59e0b' : 'var(--text)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>
                  <LinkIcon size={13} /> {editing ? 'Cancel' : 'Edit Session'}
                </button>
                <button onClick={() => { if (confirm('Delete this session?')) onDelete(session.id); }}
                  style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '9px 12px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                  <Trash2 size={12} />
                </button>
              </div>

              {/* Edit form */}
              {editing && (
                <div style={{ background: 'var(--bg)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>✏️ Edit Session Details</div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)' }}>Google Meet Link</span>
                      <button type="button" onClick={() => setMeetLink(generateMeetCode())}
                        style={{ background: 'none', border: 'none', color: '#10b981', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Sparkles size={11} /> Auto-Generate Link
                      </button>
                    </div>
                    <input value={meetLink} onChange={e => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>Session Notes</div>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                      placeholder="Topics to cover, resources, homework…"
                      style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={save}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 9, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                    <CheckCircle size={13} /> Save Changes
                  </button>
                </div>
              )}

              {/* Notes display */}
              {!editing && session.notes && (
                <div style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  📝 <strong>Notes:</strong> {session.notes}
                </div>
              )}

              {/* Chat box */}
              {chat && <ChatBox session={session} mentorName={mentorName} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Create Session Modal ────────────────────────────────────────────────────────
interface CreateSessionModalProps {
  mentorId: string;
  mentorName: string;
  companyName: string;
  onClose: () => void;
  onCreated: () => void;
}

function CreateSessionModal({ mentorId, mentorName, companyName, onClose, onCreated }: CreateSessionModalProps) {
  const [form, setForm] = useState({
    studentName: '',
    studentEmail: '',
    topic: '',
    meetLink: generateMeetCode(), // pre-fill with ready-to-use Google Meet link
    scheduledAt: '',
    notes: '',
    isOpenToAll: false,
  });
  const [err, setErr] = useState('');
  const [candidates, setCandidates] = useState<{ name: string; email: string }[]>([]);

  // Collect potential students from applications & localStorage
  useEffect(() => {
    try {
      const apps = JSON.parse(localStorage.getItem('portal_applications') || '[]');
      const list: { name: string; email: string }[] = [];
      const seen = new Set<string>();

      // Current logged in student if applicable
      const curUser = JSON.parse(localStorage.getItem('nm_user') || '{}');
      if (curUser?.name && curUser?.email && curUser.role === 'student') {
        list.push({ name: curUser.name, email: curUser.email });
        seen.add(curUser.email.toLowerCase());
      }

      for (const a of apps) {
        if (a.studentName && a.studentEmail && !seen.has(a.studentEmail.toLowerCase())) {
          seen.add(a.studentEmail.toLowerCase());
          list.push({ name: a.studentName, email: a.studentEmail });
        }
      }
      setCandidates(list.slice(0, 8));
    } catch {}
  }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const selectStudent = (name: string, email: string) => {
    setForm(f => ({
      ...f,
      studentName: name,
      studentEmail: email,
      isOpenToAll: false,
    }));
  };

  const selectOpenSession = () => {
    setForm(f => ({
      ...f,
      studentName: 'All Students',
      studentEmail: 'all',
      isOpenToAll: true,
    }));
  };

  const submit = () => {
    if (!form.studentName.trim() || !form.topic.trim()) {
      setErr('Student name (or "All Students") and session topic are required.');
      return;
    }
    const all: any[] = JSON.parse(localStorage.getItem(LS_SESSIONS) || '[]');
    const isAll = form.isOpenToAll ||
      form.studentName.toLowerCase().includes('all') ||
      form.studentEmail.toLowerCase() === 'all';

    const newSession: MentorSession = {
      id: Date.now().toString(),
      mentorId,
      mentorName: mentorName || 'Industry Mentor',
      companyName: companyName || 'Company',
      studentName: form.studentName.trim(),
      studentEmail: form.studentEmail.trim(),
      topic: form.topic.trim(),
      meetLink: form.meetLink.trim(),
      scheduledAt: form.scheduledAt || new Date(Date.now() + 3600000).toISOString(),
      notes: form.notes.trim(),
      createdAt: Date.now(),
      isOpenToAll: isAll,
    };

    localStorage.setItem(LS_SESSIONS, JSON.stringify([...all, newSession]));
    window.dispatchEvent(new CustomEvent('nm_mentor_sessions_updated'));
    window.dispatchEvent(new Event('storage'));
    onCreated();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        style={{ width: '100%', maxWidth: 520, background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 26, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={18} /></button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={18} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', margin: 0 }}>Schedule Mentor Session</h3>
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: 0 }}>
              {companyName} · Live session will appear in the Student Portal under the Mentors tab
            </p>
          </div>
        </div>

        {/* Quick Student Selector */}
        <div style={{ marginBottom: 16, padding: '10px 12px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserCheck size={12} color="#3b82f6" /> Quick Select Attendee:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button type="button" onClick={selectOpenSession}
              style={{ padding: '4px 10px', borderRadius: 8, border: form.isOpenToAll ? '1.5px solid #10b981' : '1px solid var(--border)', background: form.isOpenToAll ? 'rgba(16,185,129,0.15)' : 'var(--surface)', color: form.isOpenToAll ? '#10b981' : 'var(--text)', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              🌐 All Students (Open Session)
            </button>
            {candidates.map(c => {
              const active = form.studentEmail.toLowerCase() === c.email.toLowerCase();
              return (
                <button key={c.email} type="button" onClick={() => selectStudent(c.name, c.email)}
                  style={{ padding: '4px 9px', borderRadius: 8, border: active ? '1.5px solid #3b82f6' : '1px solid var(--border)', background: active ? 'rgba(59,130,246,0.15)' : 'var(--surface)', color: active ? '#3b82f6' : 'var(--text)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  👤 {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>Student Name *</div>
              <input value={form.studentName} onChange={e => set('studentName', e.target.value)} placeholder="e.g. Nithish or All Students"
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>Student Email (Optional)</div>
              <input value={form.studentEmail} onChange={e => set('studentEmail', e.target.value)} placeholder="student@example.com"
                style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>Session Topic *</div>
            <input value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="e.g. Full-Stack Architecture Review, Career Q&A"
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 11px', fontSize: 13, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>Scheduled Date &amp; Time</div>
            <input type="datetime-local" value={form.scheduledAt} onChange={e => set('scheduledAt', e.target.value)}
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)' }}>Google Meet Video Call Link</span>
              <button type="button" onClick={() => set('meetLink', generateMeetCode())}
                style={{ background: 'none', border: 'none', color: '#10b981', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={11} /> Auto-Generate Link
              </button>
            </div>
            <input value={form.meetLink} onChange={e => set('meetLink', e.target.value)} placeholder="https://meet.google.com/xxx-yyyy-zzz"
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', marginBottom: 4 }}>Session Notes &amp; Agenda</div>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Topics to cover, links to study material…"
              style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, color: 'var(--text)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        {err && <div style={{ marginTop: 10, fontSize: 12, color: '#ef4444' }}>⚠ {err}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button onClick={submit}
            style={{ flex: 1, padding: '11px', borderRadius: 11, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}>
            Schedule &amp; Publish Meeting
          </button>
          <button onClick={onClose}
            style={{ padding: '11px 20px', borderRadius: 11, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main MentorPortal Component ────────────────────────────────────────────────
interface MentorPortalProps {
  companyName: string;
  mentorId: string;
  mentorName: string;
}

export default function MentorPortal({ companyName, mentorId, mentorName }: MentorPortalProps) {
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming'>('all');

  const reload = () => setSessions(getSessions(mentorId, companyName));

  useEffect(() => {
    reload();
    const onUpdated = () => reload();
    window.addEventListener('nm_mentor_sessions_updated', onUpdated);
    window.addEventListener('storage', onUpdated);
    const iv = setInterval(reload, 2000);
    return () => {
      window.removeEventListener('nm_mentor_sessions_updated', onUpdated);
      window.removeEventListener('storage', onUpdated);
      clearInterval(iv);
    };
  }, [mentorId, companyName]);

  const handleDelete = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(mentorId, updated);
    setSessions(updated);
  };

  const handleUpdate = (id: string, updates: Partial<MentorSession>) => {
    const updated = sessions.map(s => s.id === id ? { ...s, ...updates } : s);
    saveSessions(mentorId, updated);
    setSessions(updated);
  };

  const displayed = filter === 'all' ? sessions
    : filter === 'active' ? sessions.filter(s => s.meetLink)
    : sessions.filter(s => new Date(s.scheduledAt) > new Date());

  const totalMsgs = sessions.reduce((acc, s) => acc + getChat(s.id).filter(m => m.from === 'student').length, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', margin: 0 }}>Mentor Communication Portal</h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: 0 }}>{companyName} · Schedule sessions, share Google Meet links, and chat with students</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', boxShadow: '0 4px 18px rgba(59,130,246,0.4)' }}>
          <Plus size={15} /> New Session
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { icon: <Users size={16} />, label: 'Total Sessions', val: sessions.length, color: '#7c3aed' },
          { icon: <Video size={16} />, label: 'With Meet Link', val: sessions.filter(s => s.meetLink).length, color: '#10b981' },
          { icon: <MessageSquare size={16} />, label: 'Student Messages', val: totalMsgs, color: '#f59e0b' },
          { icon: <Clock size={16} />, label: 'Upcoming', val: sessions.filter(s => new Date(s.scheduledAt) > new Date()).length, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${s.color},${s.color}60)` }} />
            <div style={{ color: s.color, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Google Meet info banner */}
      <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Video size={16} color="#10b981" />
        <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text)' }}>Google Meet Live Sync:</strong> Any meeting scheduled here is broadcasted live to the Student Portal (Mentors Tab). Students can immediately click <strong>"Join Google Meet"</strong> to enter the call.
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 18 }}>
        {(['all', 'active', 'upcoming'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: filter === f ? '#3b82f6' : 'var(--surface)', color: filter === f ? '#fff' : 'var(--text-3)', transition: 'all 0.18s', textTransform: 'capitalize' }}>
            {f === 'all' ? `All (${sessions.length})` : f === 'active' ? `With Meet (${sessions.filter(s => s.meetLink).length})` : `Upcoming (${sessions.filter(s => new Date(s.scheduledAt) > new Date()).length})`}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 24px', borderRadius: 20, background: 'var(--surface)', border: '1px dashed var(--border)' }}>
          <div style={{ fontSize: 52, marginBottom: 14 }}>🎓</div>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>No sessions yet</h3>
          <p style={{ color: 'var(--text-3)', fontSize: 13, maxWidth: 380, margin: '0 auto 20px' }}>
            Create your first mentoring session. Add a Google Meet link so students can join the video call directly from their portal.
          </p>
          <button onClick={() => setShowCreate(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 11, background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            <Plus size={14} /> Schedule First Session
          </button>
        </div>
      ) : (
        <div>
          {displayed.map(s => (
            <SessionCard key={s.id} session={s} mentorName={mentorName} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateSessionModal
            mentorId={mentorId}
            mentorName={mentorName}
            companyName={companyName}
            onClose={() => setShowCreate(false)}
            onCreated={reload}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
