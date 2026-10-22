import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, XCircle, Search, ChevronDown, ChevronUp,
  Download, RefreshCw, Mail, Phone, BookOpen, Building2,
  Calendar, FileText, ExternalLink, User
} from 'lucide-react';
import {
  portalAppGetAll, portalAppGetByAuthor,
  portalAppUpdateStatus, portalAppDelete,
  type PortalApplication, type ApplicationStatus,
} from '../portalApplications';

// ── Types ─────────────────────────────────────────────────────────
interface Props {
  authorId?:    string;   // if set → filter to this author's items only
  filterType?:  string;   // 'job' | 'internship' | 'project' | 'event' | 'exam'
  accentColor?: string;
  emptyMessage?: string;
  emptyAction?: { label: string; onClick: () => void };
}

// ── Acceptance action config per type ─────────────────────────────
const ACCEPT_ACTIONS: Record<string, {
  accept: { status: ApplicationStatus; label: string; color: string };
  middle?: { status: ApplicationStatus; label: string; color: string }[];
  reject: { status: ApplicationStatus; label: string; color: string };
}> = {
  job: {
    accept: { status: 'hired',       label: '✅ Accept / Hire',  color: '#10b981' },
    middle: [
      { status: 'shortlisted', label: '⭐ Shortlist',   color: '#7c3aed' },
      { status: 'interview',   label: '📞 Interview',   color: '#06b6d4' },
      { status: 'reviewed',    label: '👁 Mark Reviewed', color: '#3b82f6' },
    ],
    reject: { status: 'rejected',    label: '❌ Reject',         color: '#ef4444' },
  },
  internship: {
    accept: { status: 'hired',       label: '✅ Accept',         color: '#10b981' },
    middle: [
      { status: 'shortlisted', label: '⭐ Shortlist',   color: '#7c3aed' },
      { status: 'interview',   label: '📞 Interview',   color: '#06b6d4' },
      { status: 'reviewed',    label: '👁 Mark Reviewed', color: '#3b82f6' },
    ],
    reject: { status: 'rejected',    label: '❌ Reject',         color: '#ef4444' },
  },
  project: {
    accept: { status: 'shortlisted', label: '✅ Accept',         color: '#10b981' },
    middle: [
      { status: 'reviewed',    label: '👁 Mark Reviewed', color: '#3b82f6' },
    ],
    reject: { status: 'rejected',    label: '❌ Reject',         color: '#ef4444' },
  },
  event: {
    accept: { status: 'confirmed',   label: '✅ Confirm Seat',   color: '#10b981' },
    reject: { status: 'cancelled',   label: '❌ Cancel',         color: '#ef4444' },
  },
  exam: {
    accept: { status: 'confirmed',   label: '✅ Confirm Slot',   color: '#10b981' },
    reject: { status: 'cancelled',   label: '❌ Cancel',         color: '#ef4444' },
  },
};

// ── Status badge ──────────────────────────────────────────────────
const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  pending:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Pending'     },
  reviewed:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  label: 'Reviewed'    },
  shortlisted: { color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', label: 'Shortlisted' },
  interview:   { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',  label: 'Interview'   },
  hired:       { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Accepted ✓'  },
  rejected:    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Rejected'    },
  registered:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Registered'  },
  confirmed:   { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Confirmed ✓' },
  cancelled:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Cancelled'   },
};

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? { color: '#888', bg: 'rgba(136,136,136,0.1)', label: status };
  return (
    <span style={{ fontSize:11, fontWeight:800, padding:'4px 11px', borderRadius:999, background:m.bg, color:m.color, display:'inline-flex', alignItems:'center', gap:4 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:m.color, display:'inline-block' }}/>
      {m.label}
    </span>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────
function StatsBar({ apps }: { apps: PortalApplication[] }) {
  const stats = [
    { label:'Total',       count:apps.length,                                        color:'#7c3aed' },
    { label:'Pending',     count:apps.filter(a=>a.status==='pending'||a.status==='registered').length, color:'#f59e0b' },
    { label:'Shortlisted', count:apps.filter(a=>a.status==='shortlisted').length,    color:'#7c3aed' },
    { label:'Accepted',    count:apps.filter(a=>a.status==='hired'||a.status==='confirmed').length, color:'#10b981' },
    { label:'Rejected',    count:apps.filter(a=>a.status==='rejected'||a.status==='cancelled').length, color:'#ef4444' },
  ];
  return (
    <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
      {stats.map(s => (
        <div key={s.label} style={{ padding:'10px 16px', borderRadius:11, background:'var(--surface)', border:`1px solid ${s.color}20`, flex:'1 1 80px', minWidth:80 }}>
          <div style={{ fontSize:22, fontWeight:900, color:s.color, lineHeight:1 }}>{s.count}</div>
          <div style={{ fontSize:10.5, fontWeight:700, color:'var(--text-3)', marginTop:2, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Application Card ──────────────────────────────────────────────
function AppCard({
  app, actions, onUpdate, onDelete,
}: {
  app: PortalApplication;
  actions: typeof ACCEPT_ACTIONS[string];
  onUpdate: (id: number, status: ApplicationStatus) => void;
  onDelete: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[app.status] ?? STATUS_META.pending;
  const isAccepted  = app.status === 'hired' || app.status === 'confirmed';
  const isRejected  = app.status === 'rejected' || app.status === 'cancelled';
  const isDone      = isAccepted || isRejected;

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{
        borderRadius:14, background:'var(--surface)',
        border:`1.5px solid ${isAccepted ? 'rgba(16,185,129,0.3)' : isRejected ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
        overflow:'hidden', marginBottom:8,
        boxShadow: isAccepted ? '0 0 0 1px rgba(16,185,129,0.1)' : 'none',
      }}>

      {/* Accepted banner */}
      {isAccepted && (
        <div style={{ padding:'6px 16px', background:'rgba(16,185,129,0.08)', borderBottom:'1px solid rgba(16,185,129,0.15)', display:'flex', alignItems:'center', gap:7 }}>
          <CheckCircle size={13} style={{ color:'#10b981' }}/>
          <span style={{ fontSize:12, fontWeight:700, color:'#10b981' }}>Application Accepted — Student will be notified</span>
        </div>
      )}
      {isRejected && (
        <div style={{ padding:'6px 16px', background:'rgba(239,68,68,0.06)', borderBottom:'1px solid rgba(239,68,68,0.12)', display:'flex', alignItems:'center', gap:7 }}>
          <XCircle size={13} style={{ color:'#ef4444' }}/>
          <span style={{ fontSize:12, fontWeight:700, color:'#ef4444' }}>Application Rejected</span>
        </div>
      )}

      {/* Main row */}
      <div style={{ padding:'13px 16px', display:'flex', alignItems:'flex-start', gap:13 }}>

        {/* Avatar */}
        <div style={{
          width:40, height:40, borderRadius:11, flexShrink:0,
          background:`${meta.color}14`, border:`1.5px solid ${meta.color}30`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontWeight:900, fontSize:15, color:meta.color,
        }}>
          {app.studentName[0]?.toUpperCase() || '?'}
        </div>

        {/* Info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:3 }}>
            <span style={{ fontWeight:800, fontSize:14, color:'var(--text)' }}>{app.studentName}</span>
            <StatusBadge status={app.status}/>
          </div>
          <div style={{ fontSize:12, color:'var(--text-3)', display:'flex', gap:12, flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><Mail size={11}/>{app.studentEmail}</span>
            {app.studentCollege && <span style={{ display:'flex', alignItems:'center', gap:4 }}><Building2 size={11}/>{app.studentCollege}</span>}
            {app.studentBranch  && <span style={{ display:'flex', alignItems:'center', gap:4 }}><BookOpen size={11}/>{app.studentBranch}</span>}
          </div>
          <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:3 }}>
            📋 <strong style={{ color:'var(--text-2)' }}>{app.itemTitle}</strong>
            {app.itemCompany && <> · {app.itemCompany}</>}
            · Applied {new Date(app.appliedAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ padding:'6px 8px', borderRadius:8, background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text-3)', cursor:'pointer', flexShrink:0 }}>
          {expanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>
      </div>

      {/* ── ACTION BUTTONS ── always visible, prominent */}
      <div style={{ padding:'0 16px 14px', display:'flex', gap:7, flexWrap:'wrap', alignItems:'center' }}>

        {/* Accept button */}
        <button
          onClick={() => onUpdate(app.id, actions.accept.status)}
          disabled={app.status === actions.accept.status}
          style={{
            padding:'8px 18px', borderRadius:10, cursor:'pointer', fontWeight:800, fontSize:13,
            border:`2px solid ${actions.accept.color}`,
            background: app.status === actions.accept.status ? actions.accept.color : `${actions.accept.color}10`,
            color: app.status === actions.accept.status ? '#fff' : actions.accept.color,
            display:'flex', alignItems:'center', gap:7, transition:'all 0.18s',
            opacity: isDone && app.status !== actions.accept.status ? 0.5 : 1,
          }}>
          {actions.accept.label}
        </button>

        {/* Middle step buttons */}
        {actions.middle?.map(m => (
          <button key={m.status}
            onClick={() => onUpdate(app.id, m.status)}
            disabled={app.status === m.status}
            style={{
              padding:'7px 14px', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:12.5,
              border:`1.5px solid ${m.color}`,
              background: app.status === m.status ? m.color : 'transparent',
              color: app.status === m.status ? '#fff' : m.color,
              transition:'all 0.18s',
              opacity: isDone ? 0.45 : 1,
            }}>
            {m.label}
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex:1 }}/>

        {/* Reject button */}
        <button
          onClick={() => onUpdate(app.id, actions.reject.status)}
          disabled={app.status === actions.reject.status}
          style={{
            padding:'7px 14px', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:12.5,
            border:`1.5px solid ${actions.reject.color}`,
            background: app.status === actions.reject.status ? actions.reject.color : `${actions.reject.color}08`,
            color: app.status === actions.reject.status ? '#fff' : actions.reject.color,
            transition:'all 0.18s',
            opacity: isDone && app.status !== actions.reject.status ? 0.45 : 1,
          }}>
          {actions.reject.label}
        </button>

        {/* Delete */}
        <button
          onClick={() => { if (confirm('Remove this application record?')) onDelete(app.id); }}
          style={{ padding:'7px 10px', borderRadius:10, background:'transparent', border:'1px solid var(--border)', color:'var(--text-3)', cursor:'pointer', fontSize:11 }}>
          🗑
        </button>
      </div>

      {/* ── EXPANDED DETAIL ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
            <div style={{ padding:'16px' }}>

              {/* Detail grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8, marginBottom:14 }}>
                {[
                  { icon:<User size={11}/>,      label:'Full Name',   val: app.studentName },
                  { icon:<Mail size={11}/>,      label:'Email',       val: app.studentEmail },
                  { icon:<Phone size={11}/>,     label:'Phone',       val: app.studentPhone || '—' },
                  { icon:<Building2 size={11}/>, label:'College',     val: app.studentCollege || '—' },
                  { icon:<BookOpen size={11}/>,  label:'Branch',      val: app.studentBranch || '—' },
                  { icon:<Calendar size={11}/>,  label:'Year',        val: app.studentYear || '—' },
                  { icon:<Calendar size={11}/>,  label:'Applied On',  val: new Date(app.appliedAt).toLocaleDateString('en-IN') },
                  ...(app.updatedAt ? [{ icon:<Calendar size={11}/>, label:'Last Updated', val: new Date(app.updatedAt).toLocaleDateString('en-IN') }] : []),
                ].map(f => (
                  <div key={f.label} style={{ padding:'8px 10px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:9.5, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', display:'flex', alignItems:'center', gap:4, marginBottom:3 }}>
                      {f.icon} {f.label}
                    </div>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text)', wordBreak:'break-all' }}>{f.val}</div>
                  </div>
                ))}
              </div>

              {/* Cover letter */}
              {app.coverLetter && (
                <div style={{ padding:'12px 14px', borderRadius:10, background:'var(--bg)', border:'1px solid var(--border)', marginBottom:10 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6, display:'flex', alignItems:'center', gap:5 }}>
                    <FileText size={11}/> Cover Letter / Motivation
                  </div>
                  <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65, margin:0 }}>{app.coverLetter}</p>
                </div>
              )}

              {/* Resume link */}
              {app.resumeLink && (
                <a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:9, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', color:'#3b82f6', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                  <ExternalLink size={13}/> View Resume / Portfolio
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── CSV Export ────────────────────────────────────────────────────
function exportCSV(apps: PortalApplication[]) {
  const header = 'Name,Email,Phone,College,Branch,Year,Role,Company,Type,Status,Applied';
  const rows = apps.map(a =>
    [a.studentName, a.studentEmail, a.studentPhone, a.studentCollege, a.studentBranch, a.studentYear,
     a.itemTitle, a.itemCompany, a.type, a.status, new Date(a.appliedAt).toLocaleDateString('en-IN')]
      .map(v => `"${(v||'').replace(/"/g,'""')}"`)
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `applications_${Date.now()}.csv`;
  a.click();
}

// ── Main Panel ────────────────────────────────────────────────────
export default function ApplicationAcceptancePanel({
  authorId, filterType, accentColor = '#7c3aed', emptyMessage, emptyAction,
}: Props) {
  const [q,           setQ]          = useState('');
  const [statusF,     setStatusF]    = useState('all');
  const [typeF,       setTypeF]      = useState(filterType || 'all');
  const [tick,        setTick]       = useState(0); // force re-render after update
  const [sortDir,     setSortDir]    = useState<'desc'|'asc'>('desc');

  const reload = () => setTick(t => t+1);

  const all = useMemo(() => {
    return authorId ? portalAppGetByAuthor(authorId) : portalAppGetAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorId, tick]);

  const filtered = useMemo(() => {
    let list = [...all];
    if (typeF !== 'all')   list = list.filter(a => a.type === typeF);
    if (statusF !== 'all') list = list.filter(a => a.status === statusF);
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(a =>
        a.studentName.toLowerCase().includes(ql)  ||
        a.studentEmail.toLowerCase().includes(ql) ||
        a.itemTitle.toLowerCase().includes(ql)    ||
        (a.studentCollege||'').toLowerCase().includes(ql)
      );
    }
    list.sort((a, b) => sortDir === 'desc'
      ? new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      : new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
    );
    return list;
  }, [all, typeF, statusF, q, sortDir]);

  const handleUpdate = (id: number, status: ApplicationStatus) => {
    portalAppUpdateStatus(id, status);
    reload();
  };
  const handleDelete = (id: number) => {
    portalAppDelete(id);
    reload();
  };

  const TYPES = ['all','job','internship','project','event','exam'];
  const STATUSES = ['all','pending','reviewed','shortlisted','interview','hired','rejected','registered','confirmed','cancelled'];

  if (all.length === 0) return (
    <div style={{ textAlign:'center', padding:'64px 24px', borderRadius:16, background:'var(--surface)', border:'1px dashed var(--border)' }}>
      <div style={{ fontSize:56, marginBottom:16 }}>📭</div>
      <h3 style={{ fontWeight:700, fontSize:20, color:'var(--text)', marginBottom:8 }}>
        {emptyMessage || 'No applications yet'}
      </h3>
      <p style={{ fontSize:13.5, color:'var(--text-3)', marginBottom:20 }}>
        Student applications will appear here once students apply
      </p>
      {emptyAction && (
        <button onClick={emptyAction.onClick}
          style={{ padding:'10px 22px', borderRadius:11, background:accentColor, border:'none', color:'#fff', fontWeight:800, fontSize:13.5, cursor:'pointer' }}>
          {emptyAction.label}
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Stats */}
      <StatsBar apps={all}/>

      {/* Toolbar */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:'1 1 200px', minWidth:180 }}>
          <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
          <input className="inp" value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search name, email, college…"
            style={{ paddingLeft:34, fontSize:13 }}/>
        </div>

        <select className="inp" value={typeF} onChange={e => setTypeF(e.target.value)} style={{ fontSize:12.5, width:'auto' }}>
          {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
        </select>

        <select className="inp" value={statusF} onChange={e => setStatusF(e.target.value)} style={{ fontSize:12.5, width:'auto' }}>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : (STATUS_META[s]?.label || s)}</option>)}
        </select>

        <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          style={{ padding:'8px 12px', borderRadius:9, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text-2)', cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', gap:6, fontWeight:600 }}>
          {sortDir === 'desc' ? '↓ Newest' : '↑ Oldest'}
        </button>

        <button onClick={reload}
          style={{ padding:'8px 10px', borderRadius:9, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text-3)', cursor:'pointer' }}>
          <RefreshCw size={13}/>
        </button>

        <button onClick={() => exportCSV(filtered)}
          style={{ padding:'8px 12px', borderRadius:9, background:`${accentColor}10`, border:`1px solid ${accentColor}30`, color:accentColor, fontWeight:700, fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <Download size={12}/> Export CSV
        </button>
      </div>

      {/* Result count */}
      <div style={{ fontSize:12.5, color:'var(--text-3)', fontWeight:600, marginBottom:12 }}>
        Showing {filtered.length} of {all.length} application{all.length!==1?'s':''}
        {q && <> · matching "<strong style={{ color:accentColor }}>{q}</strong>"</>}
      </div>

      {/* Application cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, borderRadius:14, background:'var(--surface)', border:'1px dashed var(--border)', color:'var(--text-3)', fontSize:14 }}>
          No applications match your filters
        </div>
      ) : (
        <AnimatePresence>
          {filtered.map(app => (
            <AppCard
              key={`${app.id}-${app.status}`}
              app={app}
              actions={ACCEPT_ACTIONS[app.type] || ACCEPT_ACTIONS.job}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
