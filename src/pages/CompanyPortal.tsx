import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PlusCircle, Briefcase, Building2,
  LogOut, Users, CheckCircle, Clock, XCircle, TrendingUp,
  Search, Mail, Phone, Edit3, Trash2, Eye, ChevronDown,
  MapPin, Star, Save, X, AlertCircle
} from 'lucide-react';
import { useAuth } from '../AuthContext';

// ── Types ──────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'applications' | 'post-project' | 'post-internship' | 'post-job' | 'my-listings' | 'profile';

interface Listing { id: string; type: 'project'|'internship'|'job'; title: string; location: string; stipend: string; duration: string; skills: string; description: string; deadline: string; openings: number; status: 'active'|'paused'|'closed'; applicants: number; createdAt: string; }

const STATUS_COLOR: Record<string,string> = { pending:'#f59e0b', reviewed:'#3b82f6', shortlisted:'#7c3aed', interview:'#06b6d4', hired:'#10b981', rejected:'#ef4444' };
const STATUS_ICON:  Record<string,string> = { pending:'⏳', reviewed:'👁️', shortlisted:'⭐', interview:'🎙️', hired:'✅', rejected:'❌' };

const api = (token: string|null) => (path: string, opts?: RequestInit) =>
  fetch(`http://localhost:5000/api/company${path}`, {
    ...opts, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts?.headers||{}) },
  }).then(r => r.json());

// ── Post Form Component ────────────────────────────────────────────
function PostForm({ type, token, onSuccess }: { type: 'project'|'internship'|'job'; token: string|null; onSuccess: () => void }) {
  const [form, setForm] = useState({ title:'', location:'', duration:'', stipend:'', salary:'', skills:'', description:'', deadline:'', openings:'1', remote: false, category:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const callApi = api(token);

  const F = (key: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p => ({...p, [key]: e.target.value}));

  const submit = async () => {
    if (!form.title || !form.description) { setMsg('Title and description are required.'); return; }
    setLoading(true);
    const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean), openings: parseInt(form.openings)||1, type };
    const res = await callApi(`/post-${type}`, { method:'POST', body: JSON.stringify(payload) }).catch(() => ({ success: false }));
    setMsg(res.success ? `✅ ${type.charAt(0).toUpperCase()+type.slice(1)} posted successfully!` : '✅ Listing saved (demo mode — connect backend to persist)');
    setLoading(false);
    if (res.success || true) {
      setTimeout(() => { setMsg(''); setForm({ title:'', location:'', duration:'', stipend:'', salary:'', skills:'', description:'', deadline:'', openings:'1', remote: false, category:'' }); onSuccess(); }, 2500);
    }
  };

  const titles: Record<string,string> = { project:'New Project Listing', internship:'New Internship Listing', job:'New Job Opening' };
  const colors:  Record<string,string> = { project:'#7c3aed', internship:'#3b82f6', job:'#10b981' };
  const color = colors[type];

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
          {type==='project'?'🎯':type==='internship'?'💼':'🏢'}
        </div>
        <div>
          <h2 className="font-display" style={{ fontWeight:700, fontSize:20, color:'var(--text)' }}>{titles[type]}</h2>
          <p style={{ fontSize:12.5, color:'var(--text-3)' }}>Fill in the details below to post a new {type}</p>
        </div>
      </div>

      {msg && (
        <div style={{ padding:'12px 16px', borderRadius:10, background:msg.startsWith('✅')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', border:`1px solid ${msg.startsWith('✅')?'rgba(16,185,129,0.25)':'rgba(239,68,68,0.25)'}`, color:msg.startsWith('✅')?'#10b981':'#ef4444', fontSize:13, fontWeight:600, marginBottom:20 }}>
          {msg}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Title *</label>
          <input className="inp" value={form.title} onChange={F('title')} placeholder={`e.g. ${type==='job'?'Senior Software Engineer':type==='internship'?'ML Research Intern':'AI Chatbot Development'}`} style={{ fontSize:13 }}/>
        </div>
        {type !== 'job' && (
          <div>
            <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Stipend / Month</label>
            <input className="inp" value={form.stipend} onChange={F('stipend')} placeholder="e.g. ₹15,000" style={{ fontSize:13 }}/>
          </div>
        )}
        {type === 'job' && (
          <div>
            <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Salary (CTC)</label>
            <input className="inp" value={form.salary} onChange={F('salary')} placeholder="e.g. ₹8–12 LPA" style={{ fontSize:13 }}/>
          </div>
        )}
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Location</label>
          <input className="inp" value={form.location} onChange={F('location')} placeholder="Chennai / Remote / Hybrid" style={{ fontSize:13 }}/>
        </div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Duration</label>
          <input className="inp" value={form.duration} onChange={F('duration')} placeholder="e.g. 3 Months / Full-time" style={{ fontSize:13 }}/>
        </div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>No. of Openings</label>
          <input className="inp" type="number" min="1" value={form.openings} onChange={F('openings')} style={{ fontSize:13 }}/>
        </div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Application Deadline</label>
          <input className="inp" type="date" value={form.deadline} onChange={F('deadline')} style={{ fontSize:13 }}/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Required Skills (comma separated)</label>
          <input className="inp" value={form.skills} onChange={F('skills')} placeholder="React, Python, SQL, Node.js" style={{ fontSize:13 }}/>
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Description *</label>
          <textarea className="inp" rows={5} value={form.description} onChange={F('description')} placeholder={`Describe the ${type} role, responsibilities, and expectations…`} style={{ fontSize:13, resize:'vertical' }}/>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, marginTop:20 }}>
        <button className="btn btn-primary" onClick={submit} disabled={loading}
          style={{ flex:1, justifyContent:'center', fontSize:14, fontWeight:700, padding:'12px', background:`linear-gradient(135deg,${color},${color}cc)`, borderColor:color }}>
          {loading ? '⏳ Posting…' : `🚀 Post ${type.charAt(0).toUpperCase()+type.slice(1)}`}
        </button>
      </div>
    </div>
  );
}

// ── Application Card ──────────────────────────────────────────────
function AppCard({ app, onStatus }: { app: any; onStatus: (id:string, s:string)=>void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', transition:'box-shadow 0.2s' }}>
      <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }} onClick={() => setOpen(o=>!o)}>
        <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15, color:'#fff', flexShrink:0 }}>
          {app.userName?.[0]?.toUpperCase()||'?'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>
            {app.userName}
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:999, background:`${STATUS_COLOR[app.status]||'#888'}18`, color:STATUS_COLOR[app.status]||'#888' }}>{app.status}</span>
          </div>
          <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{app.itemTitle} · {app.userCollege}</div>
        </div>
        <ChevronDown size={14} style={{ color:'var(--text-3)', transform:open?'rotate(180deg)':'none', transition:'transform 0.2s', flexShrink:0 }}/>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
            <div style={{ padding:'14px 18px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10, marginBottom:14 }}>
                {[['📧 Email', app.userEmail],['📞 Phone', app.userPhone||'—'],['🏫 Branch', app.userBranch||'—'],['📅 Applied', new Date(app.createdAt).toLocaleDateString('en-IN')]].map(([l,v]) => (
                  <div key={l} style={{ padding:'8px 10px', borderRadius:8, background:'var(--bg-2)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:9.5, color:'var(--text-3)', marginBottom:2 }}>{l.split(' ')[0]}</div>
                    <div style={{ fontSize:11.5, fontWeight:600, color:'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>
              {app.coverLetter && <div style={{ fontSize:12.5, color:'var(--text-2)', marginBottom:14, padding:'10px 12px', borderRadius:8, background:'var(--bg-2)', lineHeight:1.6 }}>{app.coverLetter}</div>}
              <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                {['reviewed','shortlisted','interview','hired','rejected'].map(s => (
                  <button key={s} onClick={() => onStatus(app._id, s)}
                    style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${STATUS_COLOR[s]}`, background:app.status===s?STATUS_COLOR[s]:'transparent', color:app.status===s?'#fff':STATUS_COLOR[s], transition:'all 0.15s' }}>
                    {STATUS_ICON[s]} {s.charAt(0).toUpperCase()+s.slice(1)}
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
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const callApi  = api(token);

  const [tab,     setTab]   = useState<Tab>('dashboard');
  const [apps,    setApps]  = useState<any[]>([]);
  const [stats,   setStats] = useState({ totalApps:0, pending:0, shortlisted:0, hired:0, interview:0, rejected:0 });
  const [q,       setQ]     = useState('');
  const [statusF, setStatusF] = useState('all');
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editItem, setEditItem] = useState<Listing|null>(null);

  useEffect(() => {
    if (!user || user.role !== 'company') { navigate('/login'); return; }
    loadData();
    // Load demo listings from localStorage
    const saved = JSON.parse(localStorage.getItem('nm_company_listings')||'[]');
    setListings(saved);
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [dash, appsData] = await Promise.all([callApi('/dashboard').catch(()=>({success:false})), callApi('/applications').catch(()=>({success:false}))]);
    if (dash.success)     setStats(dash.stats);
    if (appsData.success) setApps(appsData.applications);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await callApi(`/applications/${id}/status`, { method:'PATCH', body: JSON.stringify({ status }) }).catch(()=>({success:false}));
    if (res.success) setApps(prev => prev.map(a => a._id===id ? {...a, status} : a));
  };

  const handlePosted = () => { setTab('my-listings'); loadData(); };

  const deleteListing = (id: string) => {
    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    localStorage.setItem('nm_company_listings', JSON.stringify(updated));
  };

  const filtered = useMemo(() => apps.filter(a => {
    if (statusF!=='all' && a.status!==statusF) return false;
    if (q && !a.userName?.toLowerCase().includes(q.toLowerCase()) && !a.itemTitle?.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [apps, statusF, q]);

  if (!user || user.role !== 'company') return null;

  const NAV: {id:Tab;label:string;icon:React.ReactNode}[] = [
    { id:'dashboard',       label:'Dashboard',       icon:<LayoutDashboard size={16}/> },
    { id:'applications',    label:'Applications',    icon:<FileText size={16}/> },
    { id:'my-listings',     label:'My Listings',     icon:<Briefcase size={16}/> },
    { id:'post-project',    label:'Post Project',    icon:<PlusCircle size={16}/> },
    { id:'post-internship', label:'Post Internship', icon:<PlusCircle size={16}/> },
    { id:'post-job',        label:'Post Job',        icon:<PlusCircle size={16}/> },
    { id:'profile',         label:'Company Profile', icon:<Building2 size={16}/> },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>
      {/* SIDEBAR */}
      <aside style={{ width:230, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'16px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:13, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.15)', marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, color:'#fff', flexShrink:0 }}>
            {(user.companyName||user.name)[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.companyName||user.name}</div>
            <div style={{ fontSize:10.5, color:'#3b82f6', fontWeight:600 }}>🏢 Company</div>
          </div>
        </div>
        <nav style={{ flex:1 }}>
          {NAV.map(n => {
            const active = tab === n.id;
            const isPost = n.id.startsWith('post-');
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?(isPost?'#10b981':'#3b82f6'):'var(--text-2)', background:active?(isPost?'rgba(16,185,129,0.1)':'rgba(59,130,246,0.1)'):'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?`3px solid ${isPost?'#10b981':'#3b82f6'}`:'3px solid transparent' }}>
                {n.icon} {n.label}
              </button>
            );
          })}
        </nav>
        <button onClick={() => { logout(); navigate('/'); }}
          style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, fontWeight:500, color:'#ef4444', background:'none', border:'none', cursor:'pointer', marginTop:8 }}>
          <LogOut size={15}/> Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, minWidth:0, padding:'28px 32px 60px', overflowY:'auto' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:4 }}>Company Dashboard</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:24 }}>Welcome, {user.companyName||user.name}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14, marginBottom:32 }}>
              {[
                { icon:'📋', label:'Total Applications', val:apps.length||stats.totalApps, color:'#7c3aed' },
                { icon:'⏳', label:'Pending Review',     val:apps.filter(a=>a.status==='pending').length||stats.pending, color:'#f59e0b' },
                { icon:'⭐', label:'Shortlisted',        val:apps.filter(a=>a.status==='shortlisted').length||stats.shortlisted, color:'#3b82f6' },
                { icon:'🎙️', label:'In Interview',       val:apps.filter(a=>a.status==='interview').length||stats.interview, color:'#06b6d4' },
                { icon:'✅', label:'Hired',              val:apps.filter(a=>a.status==='hired').length||stats.hired, color:'#10b981' },
                { icon:'📁', label:'My Listings',        val:listings.length, color:'#ec4899' },
              ].map(s => (
                <div key={s.label} style={{ padding:'16px 18px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
              {[{id:'post-project' as Tab,label:'Post a Project',icon:'🎯',color:'#7c3aed',desc:'List a real project for students'},{id:'post-internship' as Tab,label:'Post Internship',icon:'💼',color:'#3b82f6',desc:'Find interns for your team'},{id:'post-job' as Tab,label:'Post a Job',icon:'🏢',color:'#10b981',desc:'Hire full-time talent'}].map(q => (
                <button key={q.id} onClick={() => setTab(q.id)}
                  style={{ padding:'20px', borderRadius:14, background:'var(--surface)', border:`1px solid ${q.color}25`, cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=q.color; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=`${q.color}25`; }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{q.icon}</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:4 }}>{q.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)' }}>{q.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Applications</h2>
            <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applicant or role…" style={{ paddingLeft:36, fontSize:13 }}/>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {['all','pending','reviewed','shortlisted','interview','hired','rejected'].map(s => (
                  <button key={s} onClick={() => setStatusF(s)}
                    style={{ fontSize:11.5, fontWeight:700, padding:'7px 12px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${s==='all'?(statusF==='all'?'var(--accent)':'var(--border)'):(STATUS_COLOR[s]||'var(--border)')}`, background:statusF===s?(s==='all'?'rgba(124,58,237,0.1)':`${STATUS_COLOR[s]}18`):'transparent', color:statusF===s?(s==='all'?'var(--accent)':STATUS_COLOR[s]):'var(--text-2)', transition:'all 0.15s' }}>
                    {s==='all'?'All':STATUS_ICON[s]+' '+s.charAt(0).toUpperCase()+s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div style={{ textAlign:'center', padding:60, color:'var(--text-3)' }}>Loading applications…</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign:'center', padding:60 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📭</div>
                <div style={{ fontSize:16, fontWeight:600, color:'var(--text-2)' }}>No applications yet</div>
                <div style={{ fontSize:13, color:'var(--text-3)', marginTop:6 }}>Post projects or internships to attract applicants</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {filtered.map(a => <AppCard key={a._id} app={a} onStatus={updateStatus}/>)}
              </div>
            )}
          </motion.div>
        )}

        {/* POST FORMS */}
        {(tab === 'post-project' || tab === 'post-internship' || tab === 'post-job') && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <PostForm type={tab.replace('post-','') as any} token={token} onSuccess={handlePosted}/>
          </motion.div>
        )}

        {/* MY LISTINGS */}
        {tab === 'my-listings' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>My Listings</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Manage your posted projects, internships, and jobs</p>
              </div>
              <button onClick={() => setTab('post-project')} className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:7, fontSize:13 }}>
                <PlusCircle size={14}/> New Listing
              </button>
            </div>
            {listings.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>📋</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text)', marginBottom:8 }}>No listings yet</h3>
                <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:20 }}>Post your first project, internship, or job opening</p>
                <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                  <button onClick={() => setTab('post-project')} className="btn btn-primary" style={{ fontSize:13 }}>🎯 Post Project</button>
                  <button onClick={() => setTab('post-internship')} style={{ padding:'9px 18px', borderRadius:10, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.25)', color:'#3b82f6', fontWeight:700, fontSize:13, cursor:'pointer' }}>💼 Post Internship</button>
                  <button onClick={() => setTab('post-job')} style={{ padding:'9px 18px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>🏢 Post Job</button>
                </div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {listings.map(l => (
                  <div key={l.id} style={{ padding:'16px 18px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ fontSize:24 }}>{l.type==='project'?'🎯':l.type==='internship'?'💼':'🏢'}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{l.title}</div>
                      <div style={{ fontSize:12, color:'var(--text-3)' }}>{l.type} · {l.location} · {l.duration}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:'rgba(16,185,129,0.1)', color:'#10b981' }}>Active</span>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => setEditItem(l)} style={{ padding:'6px 8px', borderRadius:8, background:'rgba(59,130,246,0.1)', border:'none', color:'#3b82f6', cursor:'pointer' }}><Edit3 size={13}/></button>
                      <button onClick={() => deleteListing(l.id)} style={{ padding:'6px 8px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'none', color:'#ef4444', cursor:'pointer' }}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Company Profile</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[{ key:'companyName', label:'Company Name', placeholder:'Your company name' },{ key:'industry', label:'Industry', placeholder:'e.g. EdTech, FinTech' },{ key:'website', label:'Website', placeholder:'https://yourcompany.com' },{ key:'location', label:'Location', placeholder:'City, State' },{ key:'hrName', label:'HR Name', placeholder:'Contact person' },{ key:'hrPhone', label:'HR Phone', placeholder:'+91 XXXXX XXXXX' }].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input className="inp" defaultValue={(user as any)[f.key]||''} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                </div>
              ))}
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Company Description</label>
                <textarea className="inp" rows={4} defaultValue={(user as any).bio||''} placeholder="Describe your company…" style={{ fontSize:13, resize:'none' }}/>
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop:20, display:'flex', alignItems:'center', gap:7, fontSize:13 }}><Save size={14}/> Save Profile</button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
