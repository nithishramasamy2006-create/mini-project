import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, LogOut, Search,
  ChevronDown, ChevronRight, Trash2, Save
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import ContentManager from '../components/ContentManager';
import { portalGetByAuthor } from '../portalData';

type Tab = 'dashboard' | 'applications' | 'projects' | 'internships' | 'jobs' | 'profile';

const STATUS_COLOR: Record<string,string> = { pending:'#f59e0b', reviewed:'#3b82f6', shortlisted:'#7c3aed', interview:'#06b6d4', hired:'#10b981', rejected:'#ef4444' };
const STATUS_ICON:  Record<string,string> = { pending:'⏳', reviewed:'👁', shortlisted:'★', interview:'♦', hired:'✓', rejected:'✗' };

const companyApi = (token: string|null) => (path: string, opts?: RequestInit) =>
  fetch(`http://localhost:5000/api/company${path}`, {
    ...opts, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts?.headers||{}) },
  }).then(r => r.json()).catch(() => ({ success:false }));

// ── Stat card ─────────────────────────────────────────────────────
function Stat({ icon, label, value, color }: any) {
  return (
    <div style={{ padding:'15px 17px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color, lineHeight:1 }}>{value}</div>
    </div>
  );
}

// ── Expandable application card ───────────────────────────────────
function AppRow({ app, onStatus }: { app:any; onStatus:(id:string,s:string)=>void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden' }}>
      <div style={{ padding:'12px 15px', display:'flex', alignItems:'center', gap:11, cursor:'pointer' }} onClick={() => setOpen(o=>!o)}>
        <div style={{ width:32, height:32, borderRadius:8, background:'rgba(59,130,246,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, color:'#3b82f6', flexShrink:0 }}>
          {(app.userName||'?')[0].toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.userName}</div>
          <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{app.itemTitle || '—'} · {app.userCollege || '—'}</div>
        </div>
        <span style={{ fontSize:10.5, fontWeight:700, padding:'2px 9px', borderRadius:999, background:`${STATUS_COLOR[app.status]||'#888'}15`, color:STATUS_COLOR[app.status]||'#888', flexShrink:0 }}>{STATUS_ICON[app.status]} {app.status}</span>
        <ChevronDown size={13} style={{ color:'var(--text-3)', transform:open?'rotate(180deg)':'none', transition:'0.2s', flexShrink:0 }}/>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
            <div style={{ padding:'13px 15px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:8, marginBottom:12 }}>
                {[['Email', app.userEmail],['Phone', app.userPhone||'—'],['Branch', app.userBranch||'—'],['Applied', new Date(app.createdAt).toLocaleDateString('en-IN')]].map(([l,v]) => (
                  <div key={l} style={{ padding:'7px 10px', borderRadius:8, background:'var(--bg-2)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:9.5, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {app.coverLetter && <div style={{ padding:'9px 12px', borderRadius:8, background:'var(--bg-2)', fontSize:12.5, color:'var(--text-2)', lineHeight:1.55, marginBottom:12 }}>{app.coverLetter}</div>}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {['reviewed','shortlisted','interview','hired','rejected'].map(s => (
                  <button key={s} onClick={() => onStatus(app._id, s)}
                    style={{ fontSize:11, fontWeight:700, padding:'5px 11px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${STATUS_COLOR[s]}`, background:app.status===s?STATUS_COLOR[s]:'transparent', color:app.status===s?'#fff':STATUS_COLOR[s], transition:'all 0.15s' }}>
                    {STATUS_ICON[s]} {s}
                  </button>
                ))}
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
  const call = companyApi(token);

  const [tab,     setTab]   = useState<Tab>('dashboard');
  const [apps,    setApps]  = useState<any[]>([]);
  const [stats,   setStats] = useState({ totalApps:0, pending:0, shortlisted:0, hired:0, interview:0, rejected:0 });
  const [q,       setQ]     = useState('');
  const [statusF, setStatusF]= useState('all');
  const [loading, setLoading]= useState(true);
  const [pf,      setPf]    = useState<Record<string,any>>({});
  const [saving,  setSaving] = useState(false);
  const [savedMsg,setSavedMsg]= useState('');

  // Company identifier for content isolation
  const companyId = (user?.companyName || user?.email || 'company').toLowerCase().replace(/\s+/g, '-');

  // Live counts from localStorage
  const myProjects    = useMemo(() => portalGetByAuthor('project',    companyId).length, [tab]);
  const myInternships = useMemo(() => portalGetByAuthor('internship', companyId).length, [tab]);
  const myJobs        = useMemo(() => portalGetByAuthor('job',        companyId).length, [tab]);

  useEffect(() => {
    if (!user || user.role !== 'company') { navigate('/login'); return; }
    setPf({ companyName: (user as any).companyName||'', industry:(user as any).industry||'', website:(user as any).website||'', location:(user as any).location||'', hrName:(user as any).hrName||'', hrPhone:(user as any).hrPhone||'', bio:(user as any).bio||'' });
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const [d, a] = await Promise.all([call('/dashboard'), call('/applications')]);
    if (d.success) setStats(d.stats);
    if (a.success) setApps(a.applications);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await call(`/applications/${id}/status`, { method:'PATCH', body: JSON.stringify({ status }) });
    if (res.success) setApps(p => p.map(a => a._id===id ? {...a, status} : a));
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await updateUser(pf);
    setSavedMsg(res.message);
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const filtered = useMemo(() => apps.filter(a => {
    if (statusF !== 'all' && a.status !== statusF) return false;
    if (q && !a.userName?.toLowerCase().includes(q.toLowerCase()) && !a.itemTitle?.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [apps, statusF, q]);

  if (!user || user.role !== 'company') return null;

  const NAV: { id:Tab; label:string; icon:string; count?:number }[] = [
    { id:'dashboard',    label:'Dashboard',    icon:'⬛' },
    { id:'applications', label:'Applications', icon:'📋', count:apps.filter(a=>a.status==='pending').length },
    { id:'projects',     label:'My Projects',  icon:'🎯', count:myProjects },
    { id:'internships',  label:'Internships',  icon:'💼', count:myInternships },
    { id:'jobs',         label:'Job Openings', icon:'🏢', count:myJobs },
    { id:'profile',      label:'Company Profile', icon:'⚙️' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{ width:220, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'14px 8px' }}>
        <div style={{ padding:'10px 12px', borderRadius:11, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.18)', marginBottom:18, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:14, flexShrink:0 }}>
            {((user.companyName||user.name||'C')[0]).toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.companyName || user.name}</div>
            <div style={{ fontSize:10, color:'#3b82f6', fontWeight:700 }}>COMPANY PORTAL</div>
          </div>
        </div>

        <nav style={{ flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:tab===n.id?700:500, color:tab===n.id?'#3b82f6':'var(--text-2)', background:tab===n.id?'rgba(59,130,246,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft:tab===n.id?'3px solid #3b82f6':'3px solid transparent', transition:'all 0.15s' }}>
              <span style={{ fontSize:13 }}>{n.icon}</span> {n.label}
              {!!n.count && n.count > 0 && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, background:'rgba(59,130,246,0.15)', color:'#3b82f6', borderRadius:999, padding:'1px 7px' }}>{n.count}</span>}
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

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:4 }}>Company Dashboard</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:24 }}>{user.companyName || user.name}</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12, marginBottom:28 }}>
              <Stat label="Total Applications" value={apps.length || stats.totalApps} color="#7c3aed"/>
              <Stat label="Pending Review"     value={apps.filter(a=>a.status==='pending').length || stats.pending} color="#f59e0b"/>
              <Stat label="Shortlisted"        value={apps.filter(a=>a.status==='shortlisted').length || stats.shortlisted} color="#3b82f6"/>
              <Stat label="In Interview"       value={apps.filter(a=>a.status==='interview').length || stats.interview} color="#06b6d4"/>
              <Stat label="Hired"              value={apps.filter(a=>a.status==='hired').length || stats.hired} color="#10b981"/>
              <Stat label="My Listings"        value={myProjects + myInternships + myJobs} color="#ec4899"/>
            </div>

            <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:12 }}>My Content</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { id:'projects' as Tab,    label:'Projects',    icon:'🎯', count:myProjects,    color:'#7c3aed', desc:'Real projects for students' },
                { id:'internships' as Tab, label:'Internships', icon:'💼', count:myInternships, color:'#3b82f6', desc:'Paid/certificate internships' },
                { id:'jobs' as Tab,        label:'Jobs',        icon:'🏢', count:myJobs,        color:'#10b981', desc:'Full-time job openings' },
              ].map(c => (
                <button key={c.id} onClick={() => setTab(c.id)}
                  style={{ padding:'16px', borderRadius:13, background:'var(--surface)', border:`1px solid ${c.color}25`, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:12, transition:'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor=c.color}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor=`${c.color}25`}>
                  <div style={{ fontSize:28 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{c.label}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{c.count} posted</div>
                  </div>
                  <ChevronRight size={13} style={{ marginLeft:'auto', color:'var(--text-3)' }}/>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Applications</h2>
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applicant or role…" style={{ paddingLeft:34, fontSize:13 }}/>
              </div>
              {['all','pending','reviewed','shortlisted','interview','hired','rejected'].map(s => (
                <button key={s} onClick={() => setStatusF(s)}
                  style={{ fontSize:11.5, fontWeight:700, padding:'6px 11px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${s==='all'?'var(--border)':STATUS_COLOR[s]||'var(--border)'}`, background:statusF===s?(s==='all'?'rgba(59,130,246,0.1)':`${STATUS_COLOR[s]}14`):'transparent', color:statusF===s?(s==='all'?'#3b82f6':STATUS_COLOR[s]):'var(--text-2)', transition:'all 0.15s' }}>
                  {s==='all'?'All':s}
                </button>
              ))}
            </div>
            {loading ? <div style={{ textAlign:'center', padding:60, color:'var(--text-3)' }}>Loading…</div>
              : filtered.length === 0 ? <div style={{ textAlign:'center', padding:60, color:'var(--text-3)', fontSize:14 }}>No applications {statusF!=='all'?`with status "${statusF}"`:''}</div>
              : <div style={{ display:'flex', flexDirection:'column', gap:6 }}>{filtered.map(a => <AppRow key={a._id} app={a} onStatus={updateStatus}/>)}</div>}
          </motion.div>
        )}

        {/* CONTENT MANAGERS — scoped to this company */}
        {tab === 'projects' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>My Projects</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Projects you post appear on the <strong>/projects</strong> page for students to apply</p>
            <ContentManager type="project" author={companyId} accentColor="#7c3aed"/>
          </motion.div>
        )}
        {tab === 'internships' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>My Internships</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Internships appear on the <strong>/internships</strong> page for students</p>
            <ContentManager type="internship" author={companyId} accentColor="#3b82f6"/>
          </motion.div>
        )}
        {tab === 'jobs' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Job Openings</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Jobs appear on the <strong>/jobs</strong> page for students</p>
            <ContentManager type="job" author={companyId} accentColor="#10b981"/>
          </motion.div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Company Profile</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Update your company information</p>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {savedMsg && <span style={{ fontSize:12.5, color:'#10b981', fontWeight:700 }}>✓ {savedMsg}</span>}
                <button onClick={saveProfile} disabled={saving}
                  style={{ padding:'8px 18px', borderRadius:10, background:'#3b82f6', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                  <Save size={13}/> {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { key:'companyName', label:'Company Name',  placeholder:'Official company name' },
                { key:'industry',    label:'Industry',      placeholder:'e.g. EdTech, FinTech, SaaS' },
                { key:'website',     label:'Website URL',   placeholder:'https://company.com' },
                { key:'location',    label:'Headquarters',  placeholder:'City, State' },
                { key:'hrName',      label:'HR Contact Name', placeholder:'Recruiter name' },
                { key:'hrPhone',     label:'HR Phone',       placeholder:'+91 XXXXX XXXXX' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input className="inp" value={pf[f.key]||''} onChange={e=>setPf(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                </div>
              ))}
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>Company Description</label>
                <textarea className="inp" rows={4} value={pf.bio||''} onChange={e=>setPf(p=>({...p,bio:e.target.value}))} placeholder="What does your company do? What are your values?" style={{ fontSize:13, resize:'none' }}/>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
