import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Search, ChevronDown, ChevronRight, Trash2, Save,
  Plus, Briefcase, Users, TrendingUp, Bell, CheckCircle, X
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import ContentManager from '../components/ContentManager';
import { portalGetByAuthor, portalGetAll } from '../portalData';
import {
  portalAppGetByAuthor, portalAppUpdateStatus, portalAppDelete,
  workflowFor, statusColor, type PortalApplication
} from '../portalApplications';

type Tab = 'dashboard' | 'applications' | 'projects' | 'internships' | 'jobs' | 'events' | 'profile';

const TYPE_ICON: Record<string, string> = { project:'🎯', internship:'💼', job:'🏢', event:'🎪' };

// ── Stat card ─────────────────────────────────────────────────────
function Stat({ label, value, color, sub }: any) {
  return (
    <div style={{ padding:'15px 17px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-3)', marginTop:4 }}>{sub}</div>}
    </div>
  );
}

// ── Application card with workflow ────────────────────────────────
function AppCard({ app, onStatus, onDelete }: { app: PortalApplication; onStatus:(id:number,s:any)=>void; onDelete:(id:number)=>void }) {
  const [open, setOpen] = useState(false);
  const workflow = workflowFor(app.type);
  const sc = statusColor(app.status);

  return (
    <div style={{ borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', marginBottom:7 }}>
      {/* Summary row */}
      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }} onClick={() => setOpen(o=>!o)}>
        <div style={{ width:36, height:36, borderRadius:10, background:`${sc}14`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:sc, flexShrink:0 }}>
          {app.studentName[0]?.toUpperCase() || '?'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {app.studentName}
          </div>
          <div style={{ fontSize:12, color:'var(--text-3)' }}>
            {TYPE_ICON[app.type]} {app.itemTitle} · {app.studentCollege || app.studentEmail}
          </div>
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:`${sc}15`, color:sc, flexShrink:0 }}>
          {app.status.charAt(0).toUpperCase()+app.status.slice(1)}
        </span>
        <span style={{ fontSize:11, color:'var(--text-3)', flexShrink:0 }}>
          {new Date(app.appliedAt).toLocaleDateString('en-IN')}
        </span>
        <ChevronDown size={13} style={{ color:'var(--text-3)', transform:open?'rotate(180deg)':'none', transition:'0.2s', flexShrink:0 }} />
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
            <div style={{ padding:'14px 16px' }}>
              {/* Student info grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8, marginBottom:14 }}>
                {[
                  ['Email',   app.studentEmail],
                  ['Phone',   app.studentPhone  || '—'],
                  ['Branch',  app.studentBranch || '—'],
                  ['Year',    app.studentYear   || '—'],
                  ['College', app.studentCollege|| '—'],
                  ['Applied', new Date(app.appliedAt).toLocaleString('en-IN')],
                ].map(([l,v]) => (
                  <div key={l} style={{ padding:'8px 11px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:10, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text)', wordBreak:'break-all' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Cover letter */}
              {app.coverLetter && (
                <div style={{ padding:'10px 13px', borderRadius:10, background:'var(--bg)', border:'1px solid var(--border)', fontSize:13, color:'var(--text-2)', lineHeight:1.6, marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', marginBottom:5 }}>Cover Letter</div>
                  {app.coverLetter}
                </div>
              )}

              {/* Resume link */}
              {app.resumeLink && (
                <div style={{ marginBottom:14 }}>
                  <a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:13, color:'#3b82f6', textDecoration:'none', fontWeight:600, display:'inline-flex', alignItems:'center', gap:5 }}>
                    🔗 View Resume / Portfolio
                  </a>
                </div>
              )}

              {/* Workflow status buttons */}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:700, marginRight:4 }}>Update Status:</span>
                {workflow.map(w => (
                  <button key={w.status} onClick={() => onStatus(app.id, w.status)}
                    style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${w.color}`, background:app.status===w.status?w.color:'transparent', color:app.status===w.status?'#fff':w.color, transition:'all 0.15s' }}>
                    {w.label}
                  </button>
                ))}
                <button onClick={() => { if(confirm('Delete this application?')) onDelete(app.id); }}
                  style={{ marginLeft:'auto', padding:'5px 10px', borderRadius:999, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                  <Trash2 size={12} style={{ display:'inline', marginRight:4 }}/>Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CompanyPortal() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]     = useState<Tab>('dashboard');
  const [apps,     setApps]    = useState<PortalApplication[]>([]);
  const [q,        setQ]       = useState('');
  const [typeF,    setTypeF]   = useState('all');
  const [statusF,  setStatusF] = useState('all');
  const [saving,   setSaving]  = useState(false);
  const [savedMsg, setSavedMsg]= useState('');
  const [pf,       setPf]      = useState<Record<string,any>>({});

  const companyId = ((user as any)?.companyName || user?.email || 'company').toLowerCase().replace(/\s+/g,'-');

  const loadApps = useCallback(() => {
    setApps(portalAppGetByAuthor(companyId));
  }, [companyId]);

  useEffect(() => {
    if (!user || user.role !== 'company') { navigate('/login'); return; }
    setPf({
      companyName: (user as any).companyName || '',
      industry:    (user as any).industry    || '',
      website:     (user as any).website     || '',
      location:    (user as any).location    || '',
      hrName:      (user as any).hrName      || '',
      hrPhone:     (user as any).hrPhone     || '',
      bio:         (user as any).bio         || '',
    });
    loadApps();
  }, [user]);

  // Live content counts
  const myProjects    = useMemo(() => portalGetByAuthor('project',    companyId).length, [tab]);
  const myInternships = useMemo(() => portalGetByAuthor('internship', companyId).length, [tab]);
  const myJobs        = useMemo(() => portalGetByAuthor('job',        companyId).length, [tab]);
  const myEvents      = useMemo(() => portalGetByAuthor('event',      companyId).length, [tab]);

  const filtered = useMemo(() => {
    let list = [...apps];
    if (typeF   !== 'all') list = list.filter(a => a.type   === typeF);
    if (statusF !== 'all') list = list.filter(a => a.status === statusF);
    if (q) {
      const ql = q.toLowerCase();
      list = list.filter(a =>
        a.studentName.toLowerCase().includes(ql) ||
        a.itemTitle.toLowerCase().includes(ql)   ||
        a.studentEmail.toLowerCase().includes(ql)
      );
    }
    return list;
  }, [apps, typeF, statusF, q]);

  const updateStatus = (id: number, status: any) => {
    portalAppUpdateStatus(id, status);
    loadApps();
  };
  const deleteApp = (id: number) => {
    portalAppDelete(id);
    loadApps();
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await updateUser(pf);
    setSavedMsg(res.message);
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  if (!user || user.role !== 'company') return null;

  const pendingCount = apps.filter(a => a.status === 'pending').length;
  const hiredCount   = apps.filter(a => a.status === 'hired').length;
  const totalContent = myProjects + myInternships + myJobs + myEvents;

  const NAV: { id:Tab; label:string; icon:string; badge?:number }[] = [
    { id:'dashboard',    label:'Dashboard',    icon:'⬛' },
    { id:'applications', label:'Applications', icon:'📋', badge:pendingCount },
    { id:'jobs',         label:'Job Openings', icon:'🏢', badge:myJobs },
    { id:'internships',  label:'Internships',  icon:'💼', badge:myInternships },
    { id:'projects',     label:'Projects',     icon:'🎯', badge:myProjects },
    { id:'events',       label:'Events',       icon:'🎪', badge:myEvents },
    { id:'profile',      label:'Company Profile', icon:'⚙️' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{ width:224, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'14px 8px' }}>
        <div style={{ padding:'10px 12px', borderRadius:11, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.18)', marginBottom:18, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:15, flexShrink:0 }}>
            {((user as any).companyName||user.name||'C')[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(user as any).companyName||user.name}</div>
            <div style={{ fontSize:10, color:'#3b82f6', fontWeight:700 }}>COMPANY PORTAL</div>
          </div>
        </div>

        <nav style={{ flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setTab(n.id); if(n.id==='applications') loadApps(); }}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:tab===n.id?700:500, color:tab===n.id?'#3b82f6':'var(--text-2)', background:tab===n.id?'rgba(59,130,246,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft:tab===n.id?'3px solid #3b82f6':'3px solid transparent', transition:'all 0.15s' }}>
              <span style={{ fontSize:13 }}>{n.icon}</span>
              <span style={{ flex:1 }}>{n.label}</span>
              {!!n.badge && n.badge > 0 && (
                <span style={{ fontSize:10, fontWeight:800, background:n.id==='applications'?'rgba(239,68,68,0.15)':'rgba(59,130,246,0.15)', color:n.id==='applications'?'#ef4444':'#3b82f6', borderRadius:999, padding:'1px 7px' }}>{n.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={() => { logout(); navigate('/'); }}
          style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontWeight:500 }}>
          <LogOut size={14}/> Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, minWidth:0, padding:'26px 30px 60px', overflowY:'auto' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:4 }}>
              Company Dashboard
            </h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:24 }}>{(user as any).companyName||user.name}</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12, marginBottom:28 }}>
              <Stat label="Total Applications" value={apps.length}      color="#7c3aed" />
              <Stat label="Pending Review"     value={pendingCount}     color="#f59e0b" sub="Needs action" />
              <Stat label="Shortlisted"        value={apps.filter(a=>a.status==='shortlisted').length} color="#3b82f6" />
              <Stat label="Hired"              value={hiredCount}       color="#10b981" />
              <Stat label="Content Posted"     value={totalContent}     color="#ec4899" />
              <Stat label="Active Jobs"        value={myJobs}           color="#06b6d4" />
            </div>

            {/* Application pipeline visual */}
            {apps.length > 0 && (
              <div style={{ padding:'18px 20px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
                <h3 style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:16 }}>📊 Application Pipeline</h3>
                <div style={{ display:'flex', gap:0, alignItems:'stretch' }}>
                  {[
                    { s:'pending',     label:'Pending',     color:'#f59e0b' },
                    { s:'reviewed',    label:'Reviewed',    color:'#3b82f6' },
                    { s:'shortlisted', label:'Shortlisted', color:'#7c3aed' },
                    { s:'interview',   label:'Interview',   color:'#06b6d4' },
                    { s:'hired',       label:'Hired',       color:'#10b981' },
                  ].map((stage, i, arr) => {
                    const count = apps.filter(a=>a.status===stage.s).length;
                    return (
                      <div key={stage.s} style={{ flex:1, position:'relative' }}>
                        <div style={{ padding:'12px 10px', borderRadius:10, background:`${stage.color}10`, border:`1px solid ${stage.color}25`, margin:'0 3px', textAlign:'center' }}>
                          <div style={{ fontSize:20, fontWeight:800, color:stage.color }}>{count}</div>
                          <div style={{ fontSize:10.5, fontWeight:700, color:'var(--text-3)', marginTop:2 }}>{stage.label}</div>
                        </div>
                        {i < arr.length-1 && (
                          <ChevronRight size={13} style={{ position:'absolute', right:-7, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', zIndex:1 }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content quick-access */}
            <h3 style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:12 }}>📁 My Listings</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {([
                { id:'jobs' as Tab,        icon:'🏢', label:'Job Openings', count:myJobs,        color:'#10b981', desc:'Manage job listings' },
                { id:'internships' as Tab, icon:'💼', label:'Internships',  count:myInternships, color:'#3b82f6', desc:'Manage internship posts' },
                { id:'projects' as Tab,    icon:'🎯', label:'Projects',     count:myProjects,    color:'#7c3aed', desc:'Manage project listings' },
                { id:'events' as Tab,      icon:'🎪', label:'Events',       count:myEvents,      color:'#f59e0b', desc:'Manage events' },
              ] as const).map(c => (
                <button key={c.id} onClick={() => setTab(c.id)}
                  style={{ padding:'16px', borderRadius:13, background:'var(--surface)', border:`1px solid ${c.color}20`, cursor:'pointer', textAlign:'left', display:'flex', gap:14, alignItems:'center', transition:'border-color 0.2s' }}
                  onMouseEnter={e=>(e.currentTarget as any).style.borderColor=c.color}
                  onMouseLeave={e=>(e.currentTarget as any).style.borderColor=`${c.color}20`}>
                  <span style={{ fontSize:28 }}>{c.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{c.label}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{c.count} posted</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, background:`${c.color}15`, color:c.color }}>{c.count}</span>
                    <ChevronRight size={12} style={{ color:'var(--text-3)' }}/>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Applications</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>All applications to your job, internship, project, and event listings</p>
              </div>
              <button onClick={loadApps} style={{ padding:'8px 14px', borderRadius:10, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', color:'#3b82f6', fontSize:12.5, fontWeight:700, cursor:'pointer' }}>
                🔄 Refresh
              </button>
            </div>

            {/* Filters */}
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applicant, role…" style={{ paddingLeft:34, fontSize:13 }}/>
              </div>
              <select className="inp" value={typeF} onChange={e=>setTypeF(e.target.value)} style={{ fontSize:12.5, width:'auto' }}>
                <option value="all">All Types</option>
                {['job','internship','project','event'].map(t=><option key={t} value={t}>{TYPE_ICON[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
              <select className="inp" value={statusF} onChange={e=>setStatusF(e.target.value)} style={{ fontSize:12.5, width:'auto' }}>
                <option value="all">All Status</option>
                {['pending','reviewed','shortlisted','interview','hired','rejected','registered','confirmed','cancelled'].map(s=>(
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>

            {apps.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-3)' }}>
                <div style={{ fontSize:52, marginBottom:14 }}>📭</div>
                <h3 style={{ fontWeight:700, fontSize:18, color:'var(--text)', marginBottom:8 }}>No applications yet</h3>
                <p style={{ fontSize:14 }}>Post jobs, internships, or projects so students can apply</p>
                <button onClick={() => setTab('jobs')} style={{ marginTop:16, padding:'10px 20px', borderRadius:10, background:'#3b82f6', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  Post a Job Opening
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:48, color:'var(--text-3)', fontSize:14 }}>No applications match your filters</div>
            ) : (
              filtered.map(a => (
                <AppCard key={a.id} app={a} onStatus={updateStatus} onDelete={deleteApp} />
              ))
            )}
          </motion.div>
        )}

        {/* ── CONTENT MANAGERS ── */}
        {tab === 'jobs' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Job Openings</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
              Students can apply from <strong>/jobs</strong> page — applications appear in your Applications tab
            </p>
            <ContentManager type="job" author={companyId} accentColor="#10b981" onDataChange={loadApps}/>
          </motion.div>
        )}
        {tab === 'internships' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Internships</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
              Students can apply from <strong>/internships</strong> page — applications appear here
            </p>
            <ContentManager type="internship" author={companyId} accentColor="#3b82f6" onDataChange={loadApps}/>
          </motion.div>
        )}
        {tab === 'projects' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Projects</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
              Students can apply from <strong>/projects</strong> page — applications appear here
            </p>
            <ContentManager type="project" author={companyId} accentColor="#7c3aed" onDataChange={loadApps}/>
          </motion.div>
        )}
        {tab === 'events' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Events</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
              Students can register from <strong>/events</strong> page — registrations appear in Applications
            </p>
            <ContentManager type="event" author={companyId} accentColor="#f59e0b" onDataChange={loadApps}/>
          </motion.div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Company Profile</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Update your company information</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {savedMsg && <span style={{ fontSize:12.5, color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={13}/>{savedMsg}</span>}
                <button onClick={saveProfile} disabled={saving}
                  style={{ padding:'9px 18px', borderRadius:10, background:'#3b82f6', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                  <Save size={13}/> {saving?'Saving…':'Save'}
                </button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { key:'companyName', label:'Company Name',    placeholder:'Official name' },
                { key:'industry',    label:'Industry',        placeholder:'e.g. EdTech, FinTech' },
                { key:'website',     label:'Website URL',     placeholder:'https://company.com' },
                { key:'location',    label:'Headquarters',    placeholder:'City, State' },
                { key:'hrName',      label:'HR Contact Name', placeholder:'Recruiter name' },
                { key:'hrPhone',     label:'HR Phone',        placeholder:'+91 XXXXX XXXXX' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input className="inp" value={pf[f.key]||''} onChange={e=>setPf(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                </div>
              ))}
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>Company Description</label>
                <textarea className="inp" rows={4} value={pf.bio||''} onChange={e=>setPf(p=>({...p,bio:e.target.value}))} placeholder="What does your company do?" style={{ fontSize:13, resize:'none' }}/>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
