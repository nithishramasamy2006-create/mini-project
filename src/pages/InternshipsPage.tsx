import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDebounce } from '../hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, Users, Bookmark, BookmarkCheck, Star,
  ChevronDown, Bell, BellOff, Settings, X, ChevronRight,
  MessageCircle, Send, ThumbsUp, Filter, Trash2, CheckCircle
} from 'lucide-react';
import { INTERNSHIPS, CATEGORIES } from '../data';
import ApplyModal from '../components/ApplyModal';
import PortalApplyModal from '../components/PortalApplyModal';
import { portalGetAll } from '../portalData';

const TYPES = ['All Types', 'Paid', 'Certificate'];
const LS_SAVED    = 'nm_saved_internships';
const LS_NOTIF    = 'nm_intern_notif';
const LS_QA       = 'nm_intern_qa';
const LS_SETTINGS = 'nm_intern_settings';

/* ── helpers ── */
const safeColor = (c: any) => (typeof c === 'string' && c.length > 0) ? c : '#7c3aed';
const safeLogo  = (i: any) => i?.logo || i?.companyLogo || '🏢';

function getAllInternships() {
  const portal = portalGetAll('internship')
    .filter((i: any) => i.status === 'active')
    .map((i: any, idx: number) => ({
      id: 80000 + idx,
      title:       i.title       || 'Untitled Internship',
      company:     i.company     || i._author || 'Company',
      logo:        i.logo        || '🏢',
      category:    i.category    || 'fullstack',
      type:        i.type        || 'Paid',
      duration:    i.duration    || 'Flexible',
      stipend:     i.stipend     || 'Negotiable',
      location:    i.location    || 'Remote',
      openings:    parseInt(i.openings) || 2,
      skills:      Array.isArray(i.skills) ? i.skills : typeof i.skills === 'string' ? i.skills.split(',').map((s: string) => s.trim()) : [],
      description: i.description || '',
      deadline:    i.deadline    || '',
      color:       safeColor(i.color),
      ppo:         !!i.ppo,
      featured:    !!i.featured,
      rating:      4.5,
      reviews:     Math.floor(Math.random() * 80) + 20,
      _portal:     true,
    }));
  return [...INTERNSHIPS, ...portal];
}

/* ── Toast Notification ── */
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'info' | 'remove'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const bg = type === 'success' ? '#10b981' : type === 'remove' ? '#ef4444' : '#3b82f6';
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 28, right: 24, zIndex: 9999,
        background: bg, color: '#fff', borderRadius: 14,
        padding: '13px 20px', fontSize: 13.5, fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: `0 8px 32px ${bg}55`, maxWidth: 340,
      }}>
      {type === 'success' ? <CheckCircle size={16} /> : type === 'remove' ? <Trash2 size={16} /> : <Bell size={16} />}
      {msg}
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 2 }}>
        <X size={14} />
      </button>
    </motion.div>
  );
}

/* ── Star Rating Display ── */
function StarRow({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={11} fill={s <= Math.round(rating) ? '#fbbf24' : 'none'} color={s <= Math.round(rating) ? '#fbbf24' : '#6b7280'} />
      ))}
      <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 2 }}>{rating.toFixed(1)} ({reviews})</span>
    </div>
  );
}

/* ── Q&A Panel ── */
function QAPanel({ internshipId, company }: { internshipId: number; company: string }) {
  const key = `${LS_QA}_${internshipId}`;
  const [qas, setQas] = useState<Array<{ q: string; a?: string; likes: number; ts: number }>>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');

  const save = (updated: typeof qas) => { setQas(updated); localStorage.setItem(key, JSON.stringify(updated)); };

  const submit = () => {
    if (!input.trim()) return;
    save([...qas, { q: input.trim(), likes: 0, ts: Date.now() }]);
    setInput('');
  };

  return (
    <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        <MessageCircle size={13} color="#7c3aed" /> Q&amp;A — Ask about this role at {company}
      </div>
      {qas.length === 0 && (
        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 10 }}>No questions yet. Be the first to ask!</div>
      )}
      {qas.map((qa, i) => (
        <div key={i} style={{ marginBottom: 10, padding: '10px 12px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>❓ {qa.q}</div>
          {qa.a ? (
            <div style={{ fontSize: 11.5, color: '#10b981', marginTop: 4 }}>💬 {qa.a}</div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Awaiting answer from company…</div>
          )}
          <button onClick={() => { const n = [...qas]; n[i].likes++; save(n); }}
            style={{ marginTop: 6, fontSize: 11, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ThumbsUp size={10} /> {qa.likes} helpful
          </button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 7, marginTop: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Type your question…"
          style={{ flex: 1, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 9, padding: '7px 12px', fontSize: 12, color: 'var(--text)', outline: 'none' }} />
        <button onClick={submit} style={{ background: '#7c3aed', border: 'none', borderRadius: 9, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Send size={13} color="#fff" />
        </button>
      </div>
    </div>
  );
}

/* ── Settings Drawer ── */
function SettingsDrawer({ open, onClose, savedIds, onClearSaved }: {
  open: boolean; onClose: () => void;
  savedIds: number[]; onClearSaved: () => void;
}) {
  const [notifOn, setNotifOn] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_NOTIF) || 'true'); } catch { return true; }
  });
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_SETTINGS) || '{}'); } catch { return {}; }
  });

  const toggleNotif = () => {
    const v = !notifOn;
    setNotifOn(v);
    localStorage.setItem(LS_NOTIF, JSON.stringify(v));
  };

  const saveSettings = (key: string, val: any) => {
    const s = { ...settings, [key]: val };
    setSettings(s);
    localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 8000, backdropFilter: 'blur(4px)' }} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, zIndex: 8001,
              background: 'var(--bg)', borderLeft: '1px solid var(--border)',
              padding: '28px 24px', overflowY: 'auto',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Settings size={18} color="#7c3aed" /> Internship Settings
              </div>
              <button onClick={onClose} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: 'var(--text-3)' }}>
                <X size={16} />
              </button>
            </div>

            {/* Notifications */}
            <Section title="🔔 Notifications">
              <ToggleRow label="New internship alerts" desc="Get notified when new internships are posted" value={notifOn} onChange={toggleNotif} />
              <ToggleRow label="Deadline reminders" desc="Alert 3 days before application closes" value={settings.deadlineAlert ?? true} onChange={v => saveSettings('deadlineAlert', v)} />
              <ToggleRow label="Application status updates" desc="Know when your application is reviewed" value={settings.statusAlert ?? true} onChange={v => saveSettings('statusAlert', v)} />
            </Section>

            {/* Saved */}
            <Section title={`🔖 Saved Internships (${savedIds.length})`}>
              {savedIds.length === 0
                ? <div style={{ fontSize: 12.5, color: 'var(--text-3)', padding: '8px 0' }}>No saved internships yet. Click 🔖 Save on any card.</div>
                : (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>{savedIds.length} internship{savedIds.length !== 1 ? 's' : ''} saved</div>
                    <button onClick={onClearSaved} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9, padding: '8px 14px', cursor: 'pointer', fontWeight: 700 }}>
                      <Trash2 size={13} /> Clear All Saved
                    </button>
                  </>
                )}
            </Section>

            {/* Display Settings */}
            <Section title="⚙️ Display Preferences">
              <ToggleRow label="Show ratings" desc="Display star ratings on internship cards" value={settings.showRatings ?? true} onChange={v => saveSettings('showRatings', v)} />
              <ToggleRow label="Show Q&A section" desc="Enable Q&A on internship cards" value={settings.showQA ?? true} onChange={v => saveSettings('showQA', v)} />
              <ToggleRow label="Show description" desc="Display job description preview" value={settings.showDesc ?? true} onChange={v => saveSettings('showDesc', v)} />
            </Section>

            {/* Profile / Alert Settings */}
            <Section title="📋 My Profile for Applications">
              {[
                { label: 'Preferred Location', key: 'prefLocation', placeholder: 'Chennai, Remote, Hybrid…' },
                { label: 'Preferred Stipend (min ₹)', key: 'minStipend', placeholder: '10000' },
                { label: 'Skills / Interests', key: 'skills', placeholder: 'React, Python, ML…' },
                { label: 'College / University', key: 'college', placeholder: 'Your college name' },
                { label: 'Degree & Branch', key: 'degree', placeholder: 'B.Tech – CSE' },
                { label: 'CGPA', key: 'cgpa', placeholder: '8.5' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>{f.label}</div>
                  <input
                    defaultValue={settings[f.key] || ''}
                    onChange={e => saveSettings(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', fontSize: 12.5, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </Section>

            <div style={{ marginTop: 8, padding: '12px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
              ℹ️ Settings are saved locally in your browser and auto-fill your applications.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text)', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ background: 'var(--bg-2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
          background: value ? '#7c3aed' : 'var(--border)', position: 'relative',
          transition: 'background 0.2s', flexShrink: 0, marginLeft: 16,
        }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function InternshipsPage() {
  const [q, setQ]     = useState('');
  const dQ             = useDebounce(q, 180);
  const [cat, setCat] = useState('all');
  const [type, setType] = useState('All Types');

  const [applyItem,       setApplyItem]       = useState<typeof INTERNSHIPS[0] | null>(null);
  const [portalApplyItem, setPortalApplyItem] = useState<any | null>(null);
  const openApply  = useCallback((i: any) => { if ((i as any)._portal) setPortalApplyItem(i); else setApplyItem(i); }, []);
  const closeApply = useCallback(() => { setApplyItem(null); setPortalApplyItem(null); }, []);

  // Saved internships (bookmark)
  const [saved, setSaved] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_SAVED) || '[]'); } catch { return []; }
  });

  // Toast notification
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'remove' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'info' | 'remove') => setToast({ msg, type });

  // Settings drawer
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Expanded Q&A
  const [expandedQA, setExpandedQA] = useState<number | null>(null);

  // Settings state
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_SETTINGS) || '{}'); } catch { return {}; }
  });

  // Refresh settings when drawer closes
  useEffect(() => {
    if (!settingsOpen) {
      try { setSettings(JSON.parse(localStorage.getItem(LS_SETTINGS) || '{}')); } catch {}
    }
  }, [settingsOpen]);

  // Toggle save
  const toggleSave = (id: number, title: string) => {
    const notifOn = JSON.parse(localStorage.getItem(LS_NOTIF) || 'true');
    setSaved(prev => {
      const isSaved = prev.includes(id);
      const next = isSaved ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(LS_SAVED, JSON.stringify(next));
      if (notifOn) showToast(isSaved ? `Removed "${title}"` : `✅ Saved "${title}"`, isSaved ? 'remove' : 'success');
      return next;
    });
  };

  const clearSaved = () => {
    setSaved([]);
    localStorage.setItem(LS_SAVED, '[]');
    showToast('All saved internships cleared', 'info');
  };

  const filtered = useMemo(() => getAllInternships().filter(i => {
    if (dQ && !i.title.toLowerCase().includes(dQ.toLowerCase()) && !(i.company || '').toLowerCase().includes(dQ.toLowerCase())) return false;
    if (cat !== 'all' && (i as any).category !== cat) return false;
    if (type !== 'All Types' && i.type !== type) return false;
    return true;
  }), [dQ, cat, type]);

  return (
    <div className="page" style={{ minHeight: '100vh', paddingTop: 60 }}>

      {/* ── BANNER ── */}
      <div className="banner" style={{ background: 'linear-gradient(180deg,rgba(6,10,20,0.9) 0%,transparent 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 100% at 30% 50%,rgba(37,99,235,0.09),transparent)' }} />
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: .35 }} />
        <div className="container banner-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="chip chip-blue" style={{ display: 'inline-flex', marginBottom: 14 }}>💼 Industry Internships</span>
            {/* Settings button */}
            <button onClick={() => setSettingsOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: 'var(--text)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Settings size={14} color="#7c3aed" />
              Settings
              {saved.length > 0 && (
                <span style={{ background: '#7c3aed', color: '#fff', borderRadius: 99, padding: '1px 7px', fontSize: 10, fontWeight: 800 }}>{saved.length}</span>
              )}
            </button>
          </div>

          <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(30px,5vw,54px)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 10 }}>
            NM-Approved<br /><span className="g-blue">Internships</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 620, marginBottom: 28 }}>
            Paid and certificate internships from 200+ companies exclusively for Tamil Nadu college students through the Naan Mudhalvan programme.
          </p>

          {/* KPI row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { icon: '💼', val: '840+',    label: 'Active Internships', color: '#7c3aed' },
              { icon: '💰', val: '₹15K avg', label: 'Monthly Stipend',   color: '#10b981' },
              { icon: '🏢', val: '200+',    label: 'Partner Companies',  color: '#3b82f6' },
              { icon: '🏆', val: '72%',     label: 'Pre-Placement Rate', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>{s.val}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 1 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input className="inp" value={q} onChange={e => setQ(e.target.value)} placeholder="Search internships, companies…" style={{ paddingLeft: 40 }} />
          </div>
          {[
            { val: cat,  setter: setCat,  opts: CATEGORIES.map(c => ({ v: c.id, l: c.label })) },
            { val: type, setter: setType, opts: TYPES.map(t => ({ v: t, l: t })) },
          ].map((sel, i) => (
            <div key={i} style={{ position: 'relative', flexShrink: 0 }}>
              <select value={sel.val} onChange={e => sel.setter(e.target.value)} className="inp" style={{ minWidth: 152, paddingRight: 36 }}>
                {sel.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
            </div>
          ))}
          {/* Saved filter */}
          {saved.length > 0 && (
            <button onClick={() => { /* filter to saved – future */ }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', borderRadius: 10, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#7c3aed', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
              <BookmarkCheck size={13} /> {saved.length} Saved
            </button>
          )}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
          <span style={{ color: 'var(--text)', fontWeight: 700 }}>{filtered.length}</span> internships found
        </p>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map((item, i) => {
            const color    = safeColor((item as any).color);
            const logo     = safeLogo(item);
            const skills   = Array.isArray((item as any).skills) ? (item as any).skills as string[] : [];
            const ppo      = !!(item as any).ppo;
            const featured = !!(item as any).featured;
            const isSaved  = saved.includes(item.id);
            const rating   = (item as any).rating ?? 4.5;
            const reviews  = (item as any).reviews ?? 30;
            const qaOpen   = expandedQA === item.id;

            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: Math.min(i * 0.03, 0.21) }}
                className="job-card"
                style={{ '--accent-color': color, flexDirection: 'column' } as React.CSSProperties}>

                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  {/* Left bar */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: color, borderRadius: '12px 0 0 12px', opacity: 0.8 }} />

                  {/* Logo */}
                  <div style={{ width: 54, height: 54, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                    {logo}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>{item.title}</h3>
                      {ppo      && <span className="badge b-amber" style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Star size={8} fill="#fde68a" />PPO Eligible</span>}
                      {featured && <span className="badge b-violet">Featured</span>}
                      {isSaved  && <span style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', background: 'rgba(124,58,237,0.1)', padding: '2px 8px', borderRadius: 99 }}>🔖 Saved</span>}
                    </div>

                    <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }} className="g-blue">{item.company}</p>

                    {/* Star rating */}
                    {(settings.showRatings !== false) && <div style={{ marginBottom: 8 }}><StarRow rating={rating} reviews={reviews} /></div>}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} />{item.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} />{item.duration}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6ee7b7', fontWeight: 700 }}>💰 {item.stipend}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={12} />{item.openings} openings</span>
                      {item.deadline && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fca5a5' }}>
                          📅 {item.deadline}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {skills.map(sk => <span key={sk} className="badge b-blue">{sk}</span>)}
                      <span className={`badge ${item.type === 'Paid' ? 'b-green' : 'b-cyan'}`}>{item.type}</span>
                    </div>

                    {(settings.showDesc !== false) && item.description && (
                      <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 580 }}>{item.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-primary" onClick={() => openApply(item)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      Apply Now
                    </button>

                    {/* Working Save button */}
                    <button
                      onClick={() => toggleSave(item.id, item.title)}
                      className="btn btn-ghost btn-sm"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        color: isSaved ? '#7c3aed' : 'var(--text-2)',
                        background: isSaved ? 'rgba(124,58,237,0.1)' : 'transparent',
                        border: isSaved ? '1px solid rgba(124,58,237,0.3)' : '1px solid var(--border)',
                        transition: 'all 0.2s',
                      }}>
                      {isSaved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                      {isSaved ? 'Saved' : 'Save'}
                    </button>

                    {/* Q&A toggle */}
                    {(settings.showQA !== false) && (
                      <button
                        onClick={() => setExpandedQA(qaOpen ? null : item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5 }}>
                        <MessageCircle size={12} />
                        Q&amp;A
                        <ChevronRight size={11} style={{ transform: qaOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Q&A expanded */}
                <AnimatePresence>
                  {qaOpen && (settings.showQA !== false) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}>
                      <QAPanel internshipId={item.id} company={item.company} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Apply Modals */}
      <ApplyModal
        open={!!applyItem} onClose={closeApply} type="internship"
        itemId={applyItem?.id ?? 0} itemTitle={applyItem?.title ?? ''}
        itemCompany={applyItem?.company ?? ''} color={safeColor((applyItem as any)?.color)}
      />
      <PortalApplyModal
        open={!!portalApplyItem} onClose={closeApply} type="internship"
        itemId={portalApplyItem?.id ?? 0} itemTitle={portalApplyItem?.title ?? ''}
        itemCompany={portalApplyItem?.company ?? ''}
        itemAuthor={portalApplyItem?._author || portalApplyItem?.company || 'admin'}
        color="#3b82f6"
      />

      {/* Settings Drawer */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        savedIds={saved}
        onClearSaved={clearSaved}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.msg} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
