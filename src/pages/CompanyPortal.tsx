import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Star, Calendar, PlusCircle,
  Briefcase, Building2, LogOut, Users, CheckCircle,
  Clock, XCircle, TrendingUp, Search, ChevronDown,
  Mail, Phone, Link as LinkIcon, MapPin, Send, Trash2
} from 'lucide-react';
import { useAuth } from '../AuthContext';

// ── Types ──────────────────────────────────────────────────
type Tab = 'dashboard' | 'applications' | 'shortlisted' | 'interviews' | 'post-internship' | 'post-project' | 'profile';

const STATUS_COLOR: Record<string, string> = {
  pending:'#f59e0b', reviewed:'#3b82f6', shortlisted:'#7c3aed',
  interview:'#06b6d4', hired:'#10b981', rejected:'#ef4444',
};
const STATUS_ICON: Record<string, string> = {
  pending:'⏳', reviewed:'👁️', shortlisted:'⭐', interview:'🎙️', hired:'✅', rejected:'❌',
};

// ── API helper ─────────────────────────────────────────────
const useCompanyApi = (token: string | null) =>
  (path: string, opts?: RequestInit) =>
    fetch(`http://localhost:5000/api/company${path}`, {
      ...opts,
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts?.headers||{}) },
    }).then(r => r.json());

export default function CompanyPortal() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const api = useCompanyApi(token);

  const [tab,   setTab]   = useState<Tab>('dashboard');
  const [apps,  setApps]  = useState<any[]>([]);
  const [stats, setStats] = useState({ totalApps:0, pending:0, shortlisted:0, hired:0, interview:0, rejected:0 });
  const [q,     setQ]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Post form state
  const [postForm, setPostForm] = useState({
    title:'', role:'', location:'', duration:'', stipend:'', skills:'',
    description:'', deadline:'', openings:'1', type:'internship',
  });
  const [postSuccess, setPostSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'company') { navigate('/login'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [dash, appsData] = await Promise.all([api('/dashboard'), api('/applications')]);
    if (dash.success)     setStats(dash.stats);
    if (appsData.success) setApps(appsData.applications);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await api(`/applications/${id}`, { method:'PATCH', body:JSON.stringify({ status }) });
    if (res.success) setApps(prev => prev.map(a => a._id===id ? {...a, status} : a));
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostSuccess(`✅ "${postForm.title}" posted successfully! Students can now apply.`);
    setPostForm({ title:'', role:'', location:'', duration:'', stipend:'', skills:'', description:'', deadline:'', openings:'1', type: postForm.type });
    setTimeout(() => setPostSuccess(''), 5000);
  };

  const filtered = apps.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (q && !(a.userName||'').toLowerCase().includes(q.toLowerCase()) &&
            !(a.itemTitle||'').toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const shortlisted = apps.filter(a => a.status === 'shortlisted' || a.status === 'interview');
  const interviews  = apps.filter(a => a.status === 'interview');

  if (!user || user.role !== 'company') return null;

  // ── Sidebar nav items ────────────────────────────────────
  const NAV: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id:'dashboard',       label:'Dashboard',       icon:<LayoutDashboard size={16}/> },
    { id:'applications',    label:'Applications',    icon:<FileText size={16}/>,     count: stats.totalApps },
    { id:'shortlisted',     label:'Shortlisted',     icon:<Star size={16}/>,         count: shortlisted.length },
    { id:'interviews',      label:'Interviews',      icon:<Calendar size={16}/>,     count: interviews.length },
    { id:'post-internship', label:'Post Internship', icon:<PlusCircle size={16}/> },
    { id:'post-project',    label:'Post Project',    icon:<Briefcase size={16}/> },
    { id:'profile',         label:'Company Profile', icon:<Building2 size={16}/> },
  ];

  const StatCard = ({ icon, label, value, color, sub }: any) => (
    <motion.div whileHover={{ y:-3, boxShadow:`0 12px 32px ${color}22` }} transition={{ duration:0.2 }}
      style={{ borderRadius:16, padding:'20px', background:'var(--surface)', border:'1px solid var(--border)', borderTop:`3px solid ${color}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ width:40,height:40,borderRadius:12,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center' }}>{icon}</div>
        {sub && <span style={{ fontSize:10.5,fontWeight:700,padding:'3px 8px',borderRadius:999,background:`${color}15`,color }}>{sub}</span>}
      </div>
      <div className="font-display" style={{ fontSize:32, fontWeight:800, color:'var(--text)', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--text-3)', marginTop:6, fontWeight:500 }}>{label}</div>
    </motion.div>
  );

  return (
    <div style={{ minHeight:'100vh', paddingTop:60, background:'var(--bg)', display:'flex' }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside style={{ width:236, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', background:'var(--surface)', borderRight:'1px solid var(--border)', padding:'20px 10px', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        {/* Company badge */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:14, background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.18)', marginBottom:24 }}>
          <div style={{ width:40,height:40,borderRadius:11,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <Building2 size={19} color="#fff" />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.companyName || user.name}</div>
            <div style={{ fontSize:10.5, color:'#3b82f6', fontWeight:700, letterSpacing:'0.05em' }}>COMPANY PORTAL</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', borderRadius:11, marginBottom:3, fontSize:13.5, fontWeight: tab===item.id?700:500, cursor:'pointer', textAlign:'left', border:'none', background: tab===item.id?'rgba(59,130,246,0.12)':'none', color: tab===item.id?'#3b82f6':'var(--text-2)', borderLeft:`3px solid ${tab===item.id?'#3b82f6':'transparent'}`, transition:'all 0.15s' }}>
              {item.icon} <span style={{ flex:1 }}>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span style={{ fontSize:10, fontWeight:700, padding:'1px 7px', borderRadius:999, background: tab===item.id?'rgba(59,130,246,0.2)':'var(--border)', color: tab===item.id?'#3b82f6':'var(--text-3)', minWidth:20, textAlign:'center' }}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:12 }}>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'10px 14px', borderRadius:11, fontSize:13, fontWeight:500, cursor:'pointer', border:'none', background:'none', color:'#ef4444', textAlign:'left' }}>
            <LogOut size={15}/> Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════ */}
      <main style={{ flex:1, padding:'28px 32px 60px', minWidth:0, overflowY:'auto' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ marginBottom:28 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:26, color:'var(--text)', marginBottom:4 }}>
                Welcome back, {user.companyName || user.name} 👋
              </h1>
              <p style={{ color:'var(--text-3)', fontSize:13 }}>Here's your talent pipeline at a glance.</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:16, marginBottom:36 }}>
              <StatCard icon={<Users size={18} color="#7c3aed"/>}      label="Total Applications" value={stats.totalApps}   color="#7c3aed" />
              <StatCard icon={<Clock size={18} color="#f59e0b"/>}       label="Pending Review"    value={stats.pending}     color="#f59e0b" sub="New" />
              <StatCard icon={<Star size={18} color="#3b82f6"/>}        label="Shortlisted"       value={stats.shortlisted} color="#3b82f6" />
              <StatCard icon={<Calendar size={18} color="#06b6d4"/>}    label="Interviews"        value={stats.interview||0}color="#06b6d4" />
              <StatCard icon={<CheckCircle size={18} color="#10b981"/>} label="Hired"             value={stats.hired}       color="#10b981" sub="✓ Placed" />
              <StatCard icon={<XCircle size={18} color="#ef4444"/>}     label="Rejected"          value={stats.rejected||0} color="#ef4444" />
            </div>

            {/* Funnel */}
            <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px 24px', border:'1px solid var(--border)', marginBottom:28 }}>
              <h3 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:18 }}>📊 Hiring Funnel</h3>
              {[
                { label:'Applied',     val: stats.totalApps,    max: stats.totalApps, color:'#7c3aed' },
                { label:'Shortlisted', val: stats.shortlisted,  max: stats.totalApps, color:'#3b82f6' },
                { label:'Interview',   val: stats.interview||0, max: stats.totalApps, color:'#06b6d4' },
                { label:'Hired',       val: stats.hired,        max: stats.totalApps, color:'#10b981' },
              ].map(({ label, val, max, color }) => (
                <div key={label} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>{label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color }}>{val}</span>
                  </div>
                  <div style={{ height:8, borderRadius:999, background:'var(--border)' }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${max>0?(val/max)*100:0}%` }} transition={{ duration:1, ease:'easeOut' }}
                      style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}99)` }} />
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-display" style={{ fontWeight:700, fontSize:17, color:'var(--text)', marginBottom:14 }}>🕐 Recent Applications</h2>
            <AppTable apps={apps.slice(0,6)} onStatus={updateStatus} compact />
          </motion.div>
        )}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <motion.div key="apps" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <div>
                <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:2 }}>All Applications</h1>
                <p style={{ fontSize:12.5, color:'var(--text-3)' }}>{filtered.length} applications found</p>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ position:'relative' }}>
                  <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
                  <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, role…" style={{ paddingLeft:34, fontSize:13, width:200 }} />
                </div>
                <select className="inp" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ fontSize:12.5, minWidth:140 }}>
                  <option value="all">All Status</option>
                  {Object.keys(STATUS_COLOR).map(s => <option key={s} value={s}>{STATUS_ICON[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <AppTable apps={filtered} onStatus={updateStatus} />
          </motion.div>
        )}

        {/* ── SHORTLISTED ── */}
        {tab === 'shortlisted' && (
          <motion.div key="short" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>⭐ Shortlisted Candidates</h1>
            {shortlisted.length === 0
              ? <EmptyState icon="⭐" title="No shortlisted candidates" text="Mark applications as 'Shortlisted' to see them here." />
              : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                  {shortlisted.map((app, i) => (
                    <CandidateCard key={app._id||i} app={app} onStatus={updateStatus} />
                  ))}
                </div>
            }
          </motion.div>
        )}

        {/* ── INTERVIEWS ── */}
        {tab === 'interviews' && (
          <motion.div key="int" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>🎙️ Interview Pipeline</h1>
            {interviews.length === 0
              ? <EmptyState icon="🎙️" title="No interviews scheduled" text="Move shortlisted candidates to 'Interview' stage to see them here." />
              : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {interviews.map((app, i) => (
                    <div key={app._id||i} style={{ background:'var(--surface)', borderRadius:14, padding:'16px 20px', border:'1px solid rgba(6,182,212,0.2)', display:'flex', alignItems:'center', gap:16 }}>
                      <div style={{ width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#06b6d4,#0891b2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:16,color:'#fff',flexShrink:0 }}>
                        {(app.userName||'?')[0].toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{app.userName||'Candidate'}</div>
                        <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>{app.itemTitle} · {app.userEmail}</div>
                      </div>
                      <select value={app.status} onChange={e=>updateStatus(app._id,e.target.value)}
                        style={{ fontSize:12,padding:'6px 12px',borderRadius:9,border:`1.5px solid ${STATUS_COLOR[app.status]}40`,background:`${STATUS_COLOR[app.status]}10`,color:STATUS_COLOR[app.status],cursor:'pointer',fontWeight:700 }}>
                        {['shortlisted','interview','hired','rejected'].map(s => <option key={s} value={s}>{STATUS_ICON[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
            }
          </motion.div>
        )}

        {/* ── POST INTERNSHIP / PROJECT ── */}
        {(tab === 'post-internship' || tab === 'post-project') && (
          <motion.div key={tab} initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:6 }}>
              {tab === 'post-internship' ? '➕ Post Internship' : '🔧 Post Project'}
            </h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>
              {tab === 'post-internship'
                ? 'Create a new internship listing. Students across Tamil Nadu will be able to apply.'
                : 'Post a project for students to collaborate on. Great for hackathons and company R&D.'}
            </p>

            {postSuccess && (
              <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                style={{ padding:'14px 18px', borderRadius:12, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#34d399', fontSize:13.5, marginBottom:22, fontWeight:600 }}>
                {postSuccess}
              </motion.div>
            )}

            <form onSubmit={handlePost}>
              <div style={{ background:'var(--surface)', borderRadius:20, padding:'28px', border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:18 }}>
                <Row>
                  <Field label="Title / Role *" id="post-title">
                    <input className="inp" id="post-title" value={postForm.title} onChange={e=>setPostForm(p=>({...p,title:e.target.value}))} placeholder={tab==='post-internship'?'e.g. Frontend Developer Intern':'e.g. AI Chatbot Development'} required style={{ fontSize:13.5 }} />
                  </Field>
                  <Field label="Location *" id="post-loc">
                    <input className="inp" id="post-loc" value={postForm.location} onChange={e=>setPostForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Chennai / Remote" style={{ fontSize:13.5 }} />
                  </Field>
                </Row>
                <Row>
                  <Field label={tab==='post-internship'?'Duration':'Timeline'} id="post-dur">
                    <input className="inp" id="post-dur" value={postForm.duration} onChange={e=>setPostForm(p=>({...p,duration:e.target.value}))} placeholder="e.g. 3 months" style={{ fontSize:13.5 }} />
                  </Field>
                  <Field label={tab==='post-internship'?'Stipend (₹/month)':'Budget / Reward'} id="post-stip">
                    <input className="inp" id="post-stip" value={postForm.stipend} onChange={e=>setPostForm(p=>({...p,stipend:e.target.value}))} placeholder="e.g. ₹15,000 / Unpaid / Certificate" style={{ fontSize:13.5 }} />
                  </Field>
                </Row>
                <Row>
                  <Field label="Openings" id="post-open">
                    <input className="inp" id="post-open" type="number" min="1" value={postForm.openings} onChange={e=>setPostForm(p=>({...p,openings:e.target.value}))} style={{ fontSize:13.5 }} />
                  </Field>
                  <Field label="Application Deadline" id="post-dl">
                    <input className="inp" id="post-dl" type="date" value={postForm.deadline} onChange={e=>setPostForm(p=>({...p,deadline:e.target.value}))} style={{ fontSize:13.5 }} />
                  </Field>
                </Row>
                <Field label="Required Skills" id="post-skills">
                  <input className="inp" id="post-skills" value={postForm.skills} onChange={e=>setPostForm(p=>({...p,skills:e.target.value}))} placeholder="e.g. React, Node.js, Python (comma-separated)" style={{ fontSize:13.5 }} />
                </Field>
                <Field label="Description & Requirements *" id="post-desc">
                  <textarea className="inp" id="post-desc" value={postForm.description} onChange={e=>setPostForm(p=>({...p,description:e.target.value}))} placeholder="Describe the role, responsibilities, and what you're looking for in candidates…" style={{ fontSize:13.5, minHeight:120 }} required />
                </Field>

                <div style={{ display:'flex', justifyContent:'flex-end', gap:12, paddingTop:8 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setPostForm(p=>({...p,title:'',location:'',duration:'',stipend:'',skills:'',description:'',deadline:'',openings:'1'}))}>
                    Clear
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding:'11px 28px', fontSize:14, borderRadius:12 }}>
                    <Send size={15} style={{ marginRight:7 }} />
                    Publish {tab==='post-internship'?'Internship':'Project'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── COMPANY PROFILE ── */}
        {tab === 'profile' && (
          <motion.div key="profile" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>🏢 Company Profile</h1>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Info card */}
              <div style={{ background:'var(--surface)', borderRadius:18, padding:'24px', border:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:22, paddingBottom:18, borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:60,height:60,borderRadius:16,background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0 }}>
                    🏢
                  </div>
                  <div>
                    <div className="font-display" style={{ fontWeight:800, fontSize:20, color:'var(--text)' }}>{user.companyName||user.name}</div>
                    <div style={{ fontSize:13, color:'#3b82f6', fontWeight:600, marginTop:2 }}>{user.industry||'Technology'}</div>
                  </div>
                </div>
                {[
                  { icon:<Mail size={14}/>,    label:'Email',        val:user.email },
                  { icon:<Phone size={14}/>,   label:'HR Phone',     val:user.hrPhone },
                  { icon:<MapPin size={14}/>,  label:'Location',     val:user.location },
                  { icon:<LinkIcon size={14}/>,label:'Website',      val:user.website },
                  { icon:<Users size={14}/>,   label:'Company Size', val:user.companySize ? `${user.companySize} employees` : '—' },
                  { icon:<Building2 size={14}/>,label:'HR Contact',  val:user.hrName },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text-3)', flexShrink:0 }}>{icon}</span>
                    <span style={{ fontSize:12, color:'var(--text-3)', width:90, flexShrink:0 }}>{label}</span>
                    <span style={{ fontSize:13.5, color:'var(--text)', fontWeight:500, wordBreak:'break-all' }}>{val||'—'}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {[
                  { label:'Total Applications Received', value:stats.totalApps, color:'#7c3aed', icon:'📋' },
                  { label:'Candidates Hired',            value:stats.hired,      color:'#10b981', icon:'✅' },
                  { label:'Active Shortlist',            value:stats.shortlisted,color:'#3b82f6', icon:'⭐' },
                  { label:'Interviews Scheduled',        value:stats.interview||0,color:'#06b6d4',icon:'🎙️' },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} style={{ background:'var(--surface)', borderRadius:14, padding:'18px 20px', border:`1px solid ${color}20`, display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ fontSize:26 }}>{icon}</div>
                    <div>
                      <div className="font-display" style={{ fontSize:28, fontWeight:800, color }}>{value}</div>
                      <div style={{ fontSize:12, color:'var(--text-3)', fontWeight:500 }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>{children}</div>;
}
function Field({ label, id, children }: { label:string; id:string; children:React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={{ fontSize:12, fontWeight:600, color:'var(--text-3)', display:'block', marginBottom:6, letterSpacing:'0.04em', textTransform:'uppercase' }}>{label}</label>
      {children}
    </div>
  );
}
function EmptyState({ icon, title, text }: { icon:string; title:string; text:string }) {
  return (
    <div style={{ textAlign:'center', padding:'72px 20px' }}>
      <div style={{ fontSize:54, marginBottom:16 }}>{icon}</div>
      <h3 className="font-display" style={{ fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:8 }}>{title}</h3>
      <p style={{ fontSize:14, color:'var(--text-3)' }}>{text}</p>
    </div>
  );
}
function CandidateCard({ app, onStatus }: { app:any; onStatus:(id:string,s:string)=>void }) {
  return (
    <motion.div whileHover={{ y:-3 }} style={{ background:'var(--surface)', borderRadius:16, padding:'18px', border:'1px solid rgba(59,130,246,0.2)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
        <div style={{ width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:17,color:'#fff',flexShrink:0 }}>
          {(app.userName||'?')[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{app.userName}</div>
          <div style={{ fontSize:11, color:'var(--text-3)', marginTop:1 }}>{app.userCollege||'—'}</div>
        </div>
      </div>
      <div style={{ fontSize:12.5, color:'var(--text-2)', marginBottom:6 }}>Applied for: <strong style={{ color:'var(--text)' }}>{app.itemTitle}</strong></div>
      <div style={{ fontSize:11.5, color:'var(--text-3)', marginBottom:14 }}>{app.userEmail}</div>
      <select value={app.status} onChange={e=>onStatus(app._id,e.target.value)}
        style={{ width:'100%', fontSize:12.5, padding:'7px 12px', borderRadius:9, border:`1.5px solid ${STATUS_COLOR[app.status]}50`, background:`${STATUS_COLOR[app.status]}10`, color:STATUS_COLOR[app.status], cursor:'pointer', fontWeight:700 }}>
        {['shortlisted','interview','hired','rejected'].map(s => <option key={s} value={s}>{STATUS_ICON[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
      </select>
    </motion.div>
  );
}
function AppTable({ apps, onStatus, compact = false }: { apps:any[]; onStatus:(id:string,s:string)=>void; compact?:boolean }) {
  if (!apps.length) return <EmptyState icon="📋" title="No applications yet" text="When students apply to your listings, they'll appear here." />;
  const cols = compact ? '2fr 2fr 1fr 1.5fr' : '2fr 2fr 1fr 1fr 1.5fr';
  return (
    <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--border)' }}>
      <div style={{ display:'grid', gridTemplateColumns:cols, padding:'10px 16px', background:'var(--surface)', fontSize:10.5, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid var(--border)' }}>
        <span>Applicant</span><span>Role</span>{!compact && <span>Type</span>}<span>Date</span><span>Status</span>
      </div>
      {apps.map((app, i) => (
        <div key={app._id||i} style={{ display:'grid', gridTemplateColumns:cols, padding:'12px 16px', borderBottom:'1px solid var(--border)', background:i%2===0?'var(--surface)':'var(--bg)', alignItems:'center', fontSize:13 }}>
          <div>
            <div style={{ fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.userName||'Applicant'}</div>
            <div style={{ fontSize:11, color:'var(--text-3)', marginTop:1 }}>{app.userEmail}</div>
          </div>
          <div style={{ color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{app.itemTitle}</div>
          {!compact && <span style={{ padding:'3px 8px', borderRadius:999, fontSize:10.5, fontWeight:700, background:'rgba(124,58,237,0.1)', color:'#a78bfa', width:'fit-content' }}>{app.type}</span>}
          <span style={{ color:'var(--text-3)', fontSize:11.5 }}>{app.createdAt?new Date(app.createdAt).toLocaleDateString('en-IN'):'—'}</span>
          <select value={app.status} onChange={e=>onStatus(app._id,e.target.value)}
            style={{ fontSize:11.5, padding:'5px 9px', borderRadius:8, border:`1.5px solid ${STATUS_COLOR[app.status]||'#555'}40`, background:`${STATUS_COLOR[app.status]||'#555'}10`, color:STATUS_COLOR[app.status]||'var(--text)', cursor:'pointer', fontWeight:700 }}>
            {['pending','reviewed','shortlisted','interview','hired','rejected'].map(s =>
              <option key={s} value={s}>{STATUS_ICON[s]} {s.charAt(0).toUpperCase()+s.slice(1)}</option>
            )}
          </select>
        </div>
      ))}
    </div>
  );
}
