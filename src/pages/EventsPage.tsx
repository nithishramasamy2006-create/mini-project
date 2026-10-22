import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Calendar, Clock, Users, Trophy, Award,
  Wifi, Building2, Layers, X, Bookmark, Share2, ChevronRight,
  Flame, Star, Filter, Bell, CheckCircle, ExternalLink
} from 'lucide-react';
import { EVENTS, EVENT_TYPES, type Event, type EventType } from '../eventsData';
import { useDebounce } from '../hooks';
import { useNavigate } from 'react-router-dom';
import ApplyModal from '../components/ApplyModal';
import { portalGetAll } from '../portalData';

// Merge static + portal events
function getAllEvents(): Event[] {
  const portal = portalGetAll('event').filter((e: any) => e.status === 'active').map((e: any, i: number): Event => ({
    id:                   80000 + i,
    title:                e.title || 'Untitled Event',
    type:                 (e.type || 'workshop') as EventType,
    banner:               '🎤',
    organizer:            e.organizer || e._author || 'Organizer',
    organizerLogo:        '🏢',
    date:                 e.date || '',
    endDate:              e.endDate || e.date || '',
    time:                 e.time || 'TBD',
    duration:             e.duration || '',
    location:             e.location || 'TBD',
    mode:                 (e.mode || 'online') as 'online' | 'offline' | 'hybrid',
    price:                e.price || 'Free',
    seats:                parseInt(e.seats) || 200,
    seatsLeft:            parseInt(e.seats) || 200,
    registrationDeadline: e.registrationDeadline || e.date || '',
    description:          e.description || '',
    skills:               typeof e.skills === 'string' ? e.skills.split(',').map((s: string) => s.trim()) : (e.skills || []),
    tags:                 typeof e.tags === 'string' ? e.tags.split(',').map((s: string) => s.trim()) : (e.tags || []),
    speakers:             [],
    prize:                e.prize || '',
    certificate:          !!e.certificate,
    featured:             !!e.featured,
    color:                '#f59e0b',
    gradient:             'linear-gradient(135deg,#f59e0b,#d97706)',
    _portal:              true as any,
  }));
  return [...EVENTS, ...portal];
}

// ── Helpers ────────────────────────────────────────────────────
const MODE_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  online:  { icon: <Wifi size={11} />,      label: 'Online',  color: '#10b981' },
  offline: { icon: <Building2 size={11} />, label: 'Offline', color: '#3b82f6' },
  hybrid:  { icon: <Layers size={11} />,    label: 'Hybrid',  color: '#f59e0b' },
};

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today  = new Date();
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

function urgencyLabel(d: string) {
  const days = daysUntil(d);
  if (days < 0)  return { text: 'Registration Closed', color: '#6b7280' };
  if (days === 0) return { text: 'Last Day!', color: '#ef4444' };
  if (days <= 3) return { text: `${days}d left!`, color: '#f97316' };
  if (days <= 7) return { text: `${days}d left`, color: '#f59e0b' };
  return { text: `${days} days left`, color: '#10b981' };
}

// ── Register Modal ──────────────────────────────────────────────
function RegisterModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ name: '', email: '', college: '', branch: '', year: '', phone: '', motivation: '' });
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nm_registered_events') || '[]')); }
    catch { return new Set(); }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const next = new Set(registered).add(event.id);
    localStorage.setItem('nm_registered_events', JSON.stringify([...next]));
    setRegistered(next);
    setLoading(false);
    setStep('success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        style={{ width: '100%', maxWidth: 520, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 22, overflow: 'hidden', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--border)', background: `linear-gradient(135deg, ${event.color}18, transparent)`, position: 'sticky', top: 0, backdropFilter: 'blur(10px)', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: event.color, textTransform: 'uppercase', letterSpacing: '0.1em', background: `${event.color}18`, padding: '2px 9px', borderRadius: 999 }}>
                  {EVENT_TYPES.find(t => t.id === event.type)?.icon} {event.type.replace('-', ' ')}
                </span>
              </div>
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', lineHeight: 1.3 }}>{event.title}</h2>
            </div>
            <button onClick={onClose} style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 7, color: 'var(--text-2)', flexShrink: 0 }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {step === 'success' ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${event.color}20`, border: `2px solid ${event.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
                ✅
              </div>
            </motion.div>
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>You're Registered!</h3>
            <p style={{ color: 'var(--text-2)', fontSize: 13.5, marginBottom: 6 }}>A confirmation has been sent to <strong>{form.email}</strong></p>
            <p style={{ color: 'var(--text-3)', fontSize: 12.5, marginBottom: 28 }}>📅 {event.date} · ⏰ {event.time} · {event.mode === 'online' ? '🌐 Online' : `📍 ${event.venue || event.location}`}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={onClose} className="btn btn-primary" style={{ padding: '10px 24px' }}>Done</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '22px 24px' }}>
            {/* Event quick info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20, padding: '12px 14px', borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              {[
                { icon: <Calendar size={12} />, text: event.date },
                { icon: <Clock size={12} />,    text: event.time },
                { icon: <MapPin size={12} />,   text: event.location },
                { icon: <Users size={12} />,    text: `${event.seatsLeft} seats left` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-3)' }}>
                  <span style={{ color: event.color }}>{item.icon}</span>{item.text}
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Registration Details</p>

            {/* Form fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Full Name *</label>
                <input className="inp" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Email *</label>
                <input className="inp" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@college.edu" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>College *</label>
                <input className="inp" required value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))} placeholder="College name" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Branch *</label>
                <input className="inp" required value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} placeholder="e.g. CSE, IT, ECE" style={{ fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Year *</label>
                <select className="inp" required value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} style={{ fontSize: 13 }}>
                  <option value="">Select Year</option>
                  <option>1st Year</option><option>2nd Year</option>
                  <option>3rd Year</option><option>4th Year</option><option>Alumni</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Phone *</label>
                <input className="inp" type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" style={{ fontSize: 13 }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>Why do you want to attend? <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
              <textarea className="inp" rows={3} value={form.motivation} onChange={e => setForm(f => ({ ...f, motivation: e.target.value }))}
                placeholder="Tell us briefly..." style={{ fontSize: 13, resize: 'none' }} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14, fontWeight: 700,
                background: loading ? 'var(--border)' : `linear-gradient(135deg, ${event.color}, ${event.color}cc)`,
                borderColor: event.color }}>
              {loading ? '⏳ Registering…' : `Register — ${event.price}`}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────────
export default function EventsPage() {
  const navigate = useNavigate();
  const [type,        setType]       = useState<EventType | 'all'>('all');
  const [mode,        setMode]       = useState<'all' | 'online' | 'offline' | 'hybrid'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [q,           setQ]          = useState('');
  const dQ = useDebounce(q, 180);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [savedEvents, setSavedEvents] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nm_saved_events') || '[]')); }
    catch { return new Set(); }
  });
  const [registered, setRegistered] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nm_registered_events') || '[]')); }
    catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('nm_saved_events', JSON.stringify([...savedEvents]));
  }, [savedEvents]);

  const toggleSave = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedEvents(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const filtered = useMemo(() => {
    return getAllEvents().filter(ev => {
      if (type !== 'all' && ev.type !== type) return false;
      if (mode !== 'all' && ev.mode !== mode) return false;

      if (priceFilter === 'free' && ev.price !== 'Free') return false;
      if (priceFilter === 'paid' && ev.price === 'Free') return false;
      if (dQ) {
        const q2 = dQ.toLowerCase();
        const match = ev.title.toLowerCase().includes(q2) ||
          ev.organizer.toLowerCase().includes(q2) ||
          ev.category.toLowerCase().includes(q2) ||
          ev.tags.some(t => t.toLowerCase().includes(q2)) ||
          ev.skills.some(s => s.toLowerCase().includes(q2)) ||
          ev.location.toLowerCase().includes(q2);
        if (!match) return false;
      }
      return true;
    });
  }, [type, mode, priceFilter, dQ]);

  const featured = EVENTS.filter(e => e.featured);
  const stats = [
    { label: 'Total Events',    value: EVENTS.length,                       icon: '🎯' },
    { label: 'Free Events',     value: EVENTS.filter(e=>e.price==='Free').length, icon: '🆓' },
    { label: 'Online Events',   value: EVENTS.filter(e=>e.mode==='online').length, icon: '🌐' },
    { label: 'Total Prize Pool',value: '₹6.5 Lakh+',                        icon: '🏆' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 60 }}>

      {/* ═══ HERO ═══════════════════════════════════════════════ */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '56px 24px 48px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(124,58,237,0.08) 0%, transparent 100%)', borderBottom: '1px solid var(--border)' }}>
        {/* bg glow */}
        <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--accent)', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', padding: '4px 14px', borderRadius: 999, marginBottom: 18, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            <Flame size={12} /> Live Events & Opportunities
          </span>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 46px)', color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.15 }}>
            Hackathons, Workshops &<br />
            <span style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Events</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-2)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Discover and register for hackathons, workshops, webinars and career fairs tailored for Tamil Nadu students.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
            <input
              className="inp"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search events, skills, organizers…"
              style={{ paddingLeft: 46, paddingRight: q ? 40 : 16, fontSize: 14.5, height: 50, borderRadius: 14 }}
            />
            {q && (
              <button onClick={() => setQ('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                <X size={15} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 36, flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
              <div className="font-display" style={{ fontWeight: 800, fontSize: 22, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: 1340, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ═══ FEATURED EVENTS ════════════════════════════════════ */}
        {!dQ && type === 'all' && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Flame size={18} color="#f59e0b" />
              <h2 className="font-display" style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>Featured Events</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {featured.map((ev, i) => (
                <motion.div key={ev.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: i * 0.06 }}
                  onClick={() => setSelectedEvent(ev)}
                  style={{ position: 'relative', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', border: `1px solid ${ev.color}30`, background: `linear-gradient(135deg, ${ev.color}12, var(--surface) 60%)`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                  whileHover={{ y: -4, boxShadow: `0 12px 40px ${ev.color}30` }}>
                  {/* Top banner */}
                  <div style={{ padding: '20px 20px 16px', background: `linear-gradient(135deg, ${ev.color}22, transparent)`, borderBottom: `1px solid ${ev.color}20` }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontSize: 40 }}>{ev.banner}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {ev.featured && <span style={{ fontSize: 9, fontWeight: 800, color: '#f59e0b', background: 'rgba(245,158,11,0.15)', padding: '2px 8px', borderRadius: 999, letterSpacing: '0.08em' }}>⭐ FEATURED</span>}
                        <span style={{ fontSize: 9, fontWeight: 800, color: ev.color, background: `${ev.color}18`, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {EVENT_TYPES.find(t => t.id === ev.type)?.icon} {ev.type.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1.35, marginTop: 10 }}>{ev.title}</h3>
                  </div>
                  <div style={{ padding: '14px 20px 18px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                      {[
                        { icon: <Calendar size={11} />, text: ev.date },
                        { icon: <Clock size={11} />,    text: ev.duration },
                        { icon: <MapPin size={11} />,   text: ev.location },
                        { icon: <Users size={11} />,    text: `${ev.seatsLeft} left` },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-3)' }}>
                          <span style={{ color: ev.color }}>{item.icon}</span>{item.text}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: ev.price === 'Free' ? '#10b981' : 'var(--accent)' }}>{ev.price}</span>
                        {ev.prize && <span style={{ fontSize: 10.5, color: '#f59e0b', fontWeight: 700 }}>🏆 {ev.prize}</span>}
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={e => { e.stopPropagation(); setSelectedEvent(ev); }}
                        style={{ fontSize: 12, padding: '6px 16px', background: `linear-gradient(135deg, ${ev.color}, ${ev.color}cc)`, borderColor: ev.color }}>
                        Register →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ FILTERS ═══════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24, alignItems: 'center' }}>
          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
            {EVENT_TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id as typeof type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                  borderRadius: 999, whiteSpace: 'nowrap', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                  border: `1.5px solid ${type === t.id ? t.color : 'var(--border)'}`,
                  background: type === t.id ? `${t.color}15` : 'var(--surface)',
                  color: type === t.id ? t.color : 'var(--text-2)', transition: 'all 0.18s',
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {/* Mode filter */}
            {(['all','online','offline','hybrid'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{
                  padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`,
                  background: mode === m ? 'rgba(124,58,237,0.1)' : 'var(--surface)',
                  color: mode === m ? 'var(--accent)' : 'var(--text-2)', transition: 'all 0.18s',
                }}>
                {m === 'all' ? '🌍 All' : m === 'online' ? '🌐 Online' : m === 'offline' ? '📍 Offline' : '🔀 Hybrid'}
              </button>
            ))}
            {/* Price filter */}
            {(['all','free','paid'] as const).map(p => (
              <button key={p} onClick={() => setPriceFilter(p)}
                style={{
                  padding: '7px 13px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${priceFilter === p ? 'var(--accent)' : 'var(--border)'}`,
                  background: priceFilter === p ? 'rgba(124,58,237,0.1)' : 'var(--surface)',
                  color: priceFilter === p ? 'var(--accent)' : 'var(--text-2)', transition: 'all 0.18s',
                }}>
                {p === 'all' ? 'All Prices' : p === 'free' ? '🆓 Free' : '💳 Paid'}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''} found
            {dQ && <span> · matching "<strong style={{ color: 'var(--accent)' }}>{dQ}</strong>"</span>}
          </p>
          {(type !== 'all' || mode !== 'all' || priceFilter !== 'all' || dQ) && (
            <button onClick={() => { setType('all'); setMode('all'); setPriceFilter('all'); setQ(''); }}
              className="btn btn-ghost btn-sm" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <X size={12} /> Clear Filters
            </button>
          )}
        </div>

        {/* ═══ EVENT GRID ═════════════════════════════════════════ */}
        <AnimatePresence mode="sync">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No events found</h3>
              <p style={{ color: 'var(--text-2)', marginBottom: 20 }}>Try different filters or search terms</p>
              <button onClick={() => { setType('all'); setMode('all'); setPriceFilter('all'); setQ(''); }}
                className="btn btn-primary btn-sm">Clear All Filters</button>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {filtered.map((ev, i) => {
                const urgency   = urgencyLabel(ev.registrationDeadline);
                const modeMeta  = MODE_META[ev.mode];
                const isReg     = registered.has(ev.id);
                const isSaved   = savedEvents.has(ev.id);
                const spotsPercent = Math.round(((ev.seats - ev.seatsLeft) / ev.seats) * 100);

                return (
                  <motion.article key={ev.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.24), ease: [0.22,1,0.36,1] }}
                    onClick={() => setSelectedEvent(ev)}
                    style={{ background: 'var(--surface)', border: `1px solid var(--border)`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    whileHover={{ y: -3, boxShadow: `0 8px 32px rgba(0,0,0,0.12)` }}>

                    {/* Colour stripe top */}
                    <div style={{ height: 4, background: `linear-gradient(90deg, ${ev.color}, ${ev.color}80)` }} />

                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Row 1: type + mode + save */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: ev.color, background: `${ev.color}18`, padding: '2px 9px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {EVENT_TYPES.find(t => t.id === ev.type)?.icon} {ev.type.replace('-', ' ')}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 999, background: `${modeMeta.color}15`, color: modeMeta.color }}>
                            {modeMeta.icon} {modeMeta.label}
                          </span>
                        </div>
                        <button onClick={e => toggleSave(ev.id, e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? '#7c3aed' : 'var(--text-3)', padding: 4, transition: 'color 0.15s' }}>
                          <Bookmark size={15} fill={isSaved ? '#7c3aed' : 'none'} />
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="font-display" style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.35, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ev.title}
                      </h3>

                      {/* Organizer */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                        <span style={{ fontSize: 16 }}>{ev.organizerLogo}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>{ev.organizer}</span>
                        {ev.certificate && <span style={{ marginLeft: 'auto', fontSize: 9.5, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', padding: '2px 7px', borderRadius: 999 }}>🏅 Cert</span>}
                      </div>

                      {/* Info grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 14 }}>
                        {[
                          { icon: <Calendar size={11} />, text: `${ev.date}${ev.endDate ? ` – ${ev.endDate}` : ''}` },
                          { icon: <Clock size={11} />,    text: `${ev.time} · ${ev.duration}` },
                          { icon: <MapPin size={11} />,   text: ev.location },
                          { icon: <Users size={11} />,    text: `${ev.seatsLeft.toLocaleString()} seats left` },
                        ].map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-3)', overflow: 'hidden' }}>
                            <span style={{ color: ev.color, flexShrink: 0 }}>{item.icon}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Skills tags */}
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                        {ev.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', background: 'var(--bg-2)', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--border)' }}>{s}</span>
                        ))}
                        {ev.skills.length > 3 && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>+{ev.skills.length - 3}</span>}
                      </div>

                      {/* Prize */}
                      {ev.prize && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 12 }}>
                          <Trophy size={12} color="#f59e0b" />
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#f59e0b' }}>{ev.prize}</span>
                        </div>
                      )}

                      {/* Seats progress bar */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Seats filled</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: spotsPercent > 80 ? '#ef4444' : 'var(--text-3)' }}>{spotsPercent}%</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${spotsPercent}%`, borderRadius: 999, background: spotsPercent > 80 ? '#ef4444' : spotsPercent > 60 ? '#f59e0b' : ev.color, transition: 'width 0.4s' }} />
                        </div>
                      </div>

                      {/* Footer: deadline + price + CTA */}
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 1 }}>Reg. deadline</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: urgency.color }}>{urgency.text}</div>
                        </div>
                        {isReg ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981', fontWeight: 700, fontSize: 12 }}>
                            <CheckCircle size={13} /> Registered
                          </div>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={e => { e.stopPropagation(); setSelectedEvent(ev); }}
                            style={{ fontSize: 12.5, padding: '8px 16px', background: `linear-gradient(135deg, ${ev.color}, ${ev.color}cc)`, borderColor: ev.color }}>
                            {ev.price === 'Free' ? 'Register Free' : `Register · ${ev.price}`}
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

      {/* ═══ EVENT DETAIL DRAWER ════════════════════════════════ */}
      <AnimatePresence>
        {selectedEvent && (
          <RegisterModal event={selectedEvent} onClose={() => { setSelectedEvent(null); setRegistered(new Set(JSON.parse(localStorage.getItem('nm_registered_events') || '[]'))); }} />
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 640px) {
          .events-filter-row { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
