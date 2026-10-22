import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, LogOut, Search,
  Eye, EyeOff, Trash2, Bell, Settings, Database,
  Shield, ChevronRight, TrendingUp
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import ContentManager from '../components/ContentManager';
import ApplicationAcceptancePanel from '../components/ApplicationAcceptancePanel';
import { portalGetAll } from '../portalData';

// ── Types ─────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'users' | 'applications' | 'portal-apps'
         | 'exams' | 'events' | 'courses'
         | 'projects' | 'internships' | 'jobs'
         | 'announcements' | 'settings';

const ROLE_COLOR: Record<string,string> = { student:'#7c3aed', company:'#3b82f6', college:'#10b981', admin:'#f59e0b' };
const ROLE_ICON:  Record<string,string> = { student:'S', company:'C', college:'U', admin:'A' };
const STATUS_COLOR: Record<string,string> = { pending:'#f59e0b', reviewed:'#3b82f6', shortlisted:'#7c3aed', interview:'#06b6d4', hired:'#10b981', rejected:'#ef4444', accepted:'#10b981' };

const adminApi = (token: string|null) => (path: string, opts?: RequestInit) =>
  fetch(`http://localhost:5000/api/admin${path}`, {
    ...opts, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts?.headers||{}) },
  }).then(r => r.json()).catch(() => ({ success: false }));

// ── Sidebar item ──────────────────────────────────────────────────
function NavItem({ id, label, icon, active, onClick, color='#f59e0b' }: any) {
  return (
    <button onClick={onClick}
      style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?color:'var(--text-2)', background:active?`${color}12`:'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft:active?`3px solid ${color}`:'3px solid transparent', transition:'all 0.15s' }}
      onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }}
      onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.background='transparent'; }}>
      {icon} {label}
    </button>
  );
}

// ── Stat box ──────────────────────────────────────────────────────
function Stat({ icon, label, value, color }: any) {
  return (
    <div style={{ padding:'16px 18px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)' }}>
      <div style={{ fontSize:22, marginBottom:6, width:36, height:36, borderRadius:10, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center', color }}>{icon}</div>
      <div style={{ fontSize:24, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:4 }}>{label}</div>
    </div>
  );
}

export default function AdminPortal() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const call = adminApi(token);

  const [tab,   setTab]   = useState<Tab>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [apps,  setApps]  = useState<any[]>([]);
  const [stats, setStats] = useState({ students:0, companies:0, colleges:0, admins:0, totalApplications:0, totalUsers:0 });
  const [roleF, setRoleF] = useState('all');
  const [q,     setQ]     = useState('');
  const [loading, setLoading] = useState(true);
  const [ann,   setAnn]   = useState('');
  const [annMsg,setAnnMsg]= useState('');

  // Count portal-created content
  const pExams   = useMemo(() => portalGetAll('exam').length,       [tab]);
  const pEvents  = useMemo(() => portalGetAll('event').length,      [tab]);
  const pCourses = useMemo(() => portalGetAll('course').length,     [tab]);
  const pProjects= useMemo(() => portalGetAll('project').length,    [tab]);
  const pInterns = useMemo(() => portalGetAll('internship').length, [tab]);
  const pJobs    = useMemo(() => portalGetAll('job').length,        [tab]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const [d, u, a] = await Promise.all([call('/dashboard'), call('/users?limit=100'), call('/applications?limit=100')]);
    if (d.success) setStats(d.stats);
    if (u.success) setUsers(u.users);
    if (a.success) setApps(a.applications);
    setLoading(false);
  };

  const toggleUser = async (id: string) => {
    const res = await call(`/users/${id}/toggle`, { method:'PATCH' });
    if (res.success) setUsers(p => p.map(u => u._id===id ? {...u, isActive:res.isActive} : u));
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Permanently delete this user?')) return;
    const res = await call(`/users/${id}`, { method:'DELETE' });
    if (res.success) setUsers(p => p.filter(u => u._id!==id));
  };

  const filteredUsers = useMemo(() => users.filter(u => {
    if (roleF !== 'all' && u.role !== roleF) return false;
    const search = q.toLowerCase();
    if (q && !u.name?.toLowerCase().includes(search) && !u.email?.toLowerCase().includes(search)
          && !u.companyName?.toLowerCase().includes(search) && !u.collegeName?.toLowerCase().includes(search)) return false;
    return true;
  }), [users, roleF, q]);

  if (!user || user.role !== 'admin') return null;

  // ── NAV groups ─────────────────────────────────────────────────
  const MANAGE_NAV: { id:Tab; label:string; icon:string }[] = [
    { id:'dashboard',    label:'Dashboard',           icon:'⬛' },
    { id:'users',        label:'User Management',     icon:'👥' },
    { id:'applications', label:'API Applications',    icon:'📋' },
    { id:'portal-apps',  label:'Portal Applications', icon:'📨' },
  ];
  const CONTENT_NAV: { id:Tab; label:string; icon:string; count:number }[] = [
    { id:'exams',       label:'Exams',       icon:'📝', count:pExams    },
    { id:'events',      label:'Events',      icon:'🎪', count:pEvents   },
    { id:'courses',     label:'Courses',     icon:'📚', count:pCourses  },
    { id:'projects',    label:'Projects',    icon:'🎯', count:pProjects },
    { id:'internships', label:'Internships', icon:'💼', count:pInterns  },
    { id:'jobs',        label:'Jobs',        icon:'🏢', count:pJobs     },
  ];
  const OTHER_NAV: { id:Tab; label:string; icon:string }[] = [
    { id:'announcements', label:'Announcements', icon:'📣' },
    { id:'settings',      label:'Settings',      icon:'⚙️' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:224, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'14px 8px' }}>
        {/* Identity */}
        <div style={{ padding:'10px 12px', borderRadius:11, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.18)', marginBottom:18, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'#f59e0b', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:14, flexShrink:0 }}>
            {(user.name||'A')[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:10, color:'#f59e0b', fontWeight:700 }}>ADMIN • FULL ACCESS</div>
          </div>
        </div>

        <div style={{ fontSize:9.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 10px', marginBottom:5 }}>Management</div>
        {MANAGE_NAV.map(n => <NavItem key={n.id} id={n.id} label={n.label} icon={<span style={{ fontSize:13 }}>{n.icon}</span>} active={tab===n.id} onClick={() => setTab(n.id)}/>)}

        <div style={{ fontSize:9.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 10px 5px' }}>Content Creation</div>
        {CONTENT_NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:tab===n.id?700:500, color:tab===n.id?'#f59e0b':'var(--text-2)', background:tab===n.id?'rgba(245,158,11,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft:tab===n.id?'3px solid #f59e0b':'3px solid transparent', transition:'all 0.15s' }}>
            <span style={{ fontSize:13 }}>{n.icon}</span> {n.label}
            {n.count > 0 && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, background:'rgba(245,158,11,0.2)', color:'#f59e0b', borderRadius:999, padding:'1px 7px' }}>{n.count}</span>}
          </button>
        ))}

        <div style={{ fontSize:9.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 10px 5px' }}>System</div>
        {OTHER_NAV.map(n => <NavItem key={n.id} id={n.id} label={n.label} icon={<span style={{ fontSize:13 }}>{n.icon}</span>} active={tab===n.id} onClick={() => setTab(n.id)}/>)}

        <button onClick={() => { logout(); navigate('/'); }}
          style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', marginTop:'auto', fontWeight:500 }}>
          <LogOut size={14}/> Sign Out
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, minWidth:0, padding:'26px 30px 60px', overflowY:'auto' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:4 }}>Admin Dashboard</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:24 }}>Platform-wide control centre</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12, marginBottom:28 }}>
              <Stat icon={<Shield size={18}/>} label="Students"     value={stats.students}  color="#7c3aed" />
              <Stat icon={<Database size={18}/>} label="Companies"  value={stats.companies} color="#3b82f6" />
              <Stat icon={<TrendingUp size={18}/>} label="Colleges" value={stats.colleges}  color="#10b981" />
              <Stat icon={<FileText size={18}/>} label="Total Apps" value={stats.totalApplications} color="#06b6d4" />
              <Stat icon={<span style={{ fontWeight:800, fontSize:14 }}>Ex</span>} label="Exams Created"   value={pExams}    color="#8b5cf6" />
              <Stat icon={<span style={{ fontWeight:800, fontSize:14 }}>Ev</span>} label="Events Created"  value={pEvents}   color="#f59e0b" />
              <Stat icon={<span style={{ fontWeight:800, fontSize:14 }}>Co</span>} label="Courses Created" value={pCourses}  color="#10b981" />
              <Stat icon={<span style={{ fontWeight:800, fontSize:14 }}>Pr</span>} label="Projects Added"  value={pProjects} color="#ec4899" />
            </div>

            {/* Quick access */}
            <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:14 }}>Content Management</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {CONTENT_NAV.map(n => (
                <button key={n.id} onClick={() => setTab(n.id)}
                  style={{ padding:'16px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:20, marginBottom:5 }}>{n.icon}</div>
                    <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{n.label}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{n.count} item{n.count!==1?'s':''}</div>
                  </div>
                  <ChevronRight size={14} style={{ color:'var(--text-3)' }}/>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* USER MANAGEMENT */}
        {tab === 'users' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>User Management</h2>
            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, email…" style={{ paddingLeft:34, fontSize:13 }}/>
              </div>
              {['all','student','company','college','admin'].map(r => (
                <button key={r} onClick={() => setRoleF(r)}
                  style={{ fontSize:11.5, fontWeight:700, padding:'7px 13px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${r==='all'?'var(--border)':ROLE_COLOR[r]||'var(--border)'}`, background:roleF===r?(r==='all'?'rgba(124,58,237,0.1)':`${ROLE_COLOR[r]}14`):'transparent', color:roleF===r?(r==='all'?'var(--accent)':ROLE_COLOR[r]):'var(--text-2)', transition:'all 0.15s' }}>
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase()+r.slice(1)}
                </button>
              ))}
            </div>

            {loading ? <div style={{ textAlign:'center', padding:60, color:'var(--text-3)' }}>Loading users…</div> : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {filteredUsers.length === 0 ? (
                  <div style={{ textAlign:'center', padding:48, color:'var(--text-3)', fontSize:14 }}>No users found</div>
                ) : filteredUsers.map(u => (
                  <div key={u._id} style={{ padding:'11px 15px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
                    {/* Role letter */}
                    <div style={{ width:34, height:34, borderRadius:9, background:`${ROLE_COLOR[u.role]||'#888'}14`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, color:ROLE_COLOR[u.role]||'#888', flexShrink:0, border:`1px solid ${ROLE_COLOR[u.role]||'#888'}25` }}>
                      {ROLE_ICON[u.role] || '?'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', display:'flex', alignItems:'center', gap:7 }}>
                        {u.name || u.companyName || u.collegeName}
                        <span style={{ fontSize:9.5, fontWeight:700, padding:'1px 7px', borderRadius:999, background:`${ROLE_COLOR[u.role]}14`, color:ROLE_COLOR[u.role] }}>{u.role}</span>
                        {!u.isActive && <span style={{ fontSize:9.5, fontWeight:700, padding:'1px 7px', borderRadius:999, background:'rgba(239,68,68,0.1)', color:'#ef4444' }}>Inactive</span>}
                      </div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{u.email}{u.college?` · ${u.college}`:u.collegeName?` · ${u.collegeName}`:''}</div>
                    </div>
                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                      <button onClick={() => toggleUser(u._id)} title={u.isActive?'Deactivate':'Activate'}
                        style={{ padding:'6px 10px', borderRadius:8, background:u.isActive?'rgba(239,68,68,0.08)':'rgba(16,185,129,0.08)', border:`1px solid ${u.isActive?'rgba(239,68,68,0.2)':'rgba(16,185,129,0.2)'}`, color:u.isActive?'#ef4444':'#10b981', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:11.5, fontWeight:700 }}>
                        {u.isActive ? <><EyeOff size={12}/> Pause</> : <><Eye size={12}/> Activate</>}
                      </button>
                      <button onClick={() => deleteUser(u._id)} title="Delete"
                        style={{ padding:'6px 8px', borderRadius:8, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer' }}>
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* APPLICATIONS */}
        {tab === 'applications' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>All Applications</h2>
            {loading ? <div style={{ textAlign:'center', padding:60, color:'var(--text-3)' }}>Loading…</div> : apps.length === 0 ? (
              <div style={{ textAlign:'center', padding:60, color:'var(--text-3)', fontSize:14 }}>No applications yet</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {apps.map(a => (
                  <div key={a._id} style={{ padding:'11px 15px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:'var(--accent)', flexShrink:0 }}>
                      {(a.userName||'?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)' }}>{a.userName}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{a.itemTitle} · {a.itemCompany || '—'}</div>
                    </div>
                    <span style={{ fontSize:10.5, fontWeight:700, padding:'2px 8px', borderRadius:999, background:'rgba(124,58,237,0.1)', color:'var(--accent)' }}>{a.type}</span>
                    <span style={{ fontSize:10.5, fontWeight:700, padding:'2px 8px', borderRadius:999, background:`${STATUS_COLOR[a.status]||'#888'}15`, color:STATUS_COLOR[a.status]||'#888' }}>{a.status}</span>
                    <span style={{ fontSize:11, color:'var(--text-3)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* CONTENT MANAGERS */}
        {tab === 'exams' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Exam Management — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and publish exams. They appear on the <strong>/exams</strong> page for students to register.</p>
            <ContentManager type="exam" accentColor="#8b5cf6"/>
          </motion.div>
        )}
        {tab === 'events' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Event Management — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and publish events. They appear on the <strong>/events</strong> page for students to register.</p>
            <ContentManager type="event" accentColor="#f59e0b"/>
          </motion.div>
        )}
        {tab === 'courses' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Course Management — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and publish courses. They appear on the <strong>/courses</strong> page for students to enroll.</p>
            <ContentManager type="course" accentColor="#06b6d4"/>
          </motion.div>
        )}
        {tab === 'projects' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Project Management — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and publish projects. Students apply via <strong>/projects</strong> — applications appear in <strong>Portal Applications</strong>.</p>
            <ContentManager type="project" accentColor="#7c3aed"/>
          </motion.div>
        )}
        {tab === 'internships' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Internship Management — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and publish internships. Students apply via <strong>/internships</strong> — applications appear in <strong>Portal Applications</strong>.</p>
            <ContentManager type="internship" accentColor="#3b82f6"/>
          </motion.div>
        )}
        {tab === 'jobs' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Job Management — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and publish job listings. Students apply via <strong>/jobs</strong> — applications appear in <strong>Portal Applications</strong>.</p>
            <ContentManager type="job" accentColor="#10b981"/>
          </motion.div>
        )}

        {/* PORTAL APPLICATIONS */}
        {tab === 'portal-apps' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Portal Applications</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:24 }}>
              Platform-wide view — <strong style={{ color:'#10b981' }}>accept</strong> or <strong style={{ color:'#ef4444' }}>reject</strong> all student applications across company &amp; college portals
            </p>
            <ApplicationAcceptancePanel
              accentColor="#f59e0b"
              emptyMessage="No portal applications yet"
            />
          </motion.div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === 'announcements' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Platform Announcements</h2>
            <div style={{ padding:'20px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:8 }}>New Announcement</label>
              <textarea className="inp" rows={4} value={ann} onChange={e=>setAnn(e.target.value)} placeholder="Write a platform-wide announcement for all users…" style={{ fontSize:13, resize:'none', marginBottom:12 }}/>
              {annMsg && <div style={{ padding:'9px 13px', borderRadius:8, background:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:13, fontWeight:600, marginBottom:12 }}>{annMsg}</div>}
              <button onClick={() => {
                if (!ann.trim()) return;
                const all = JSON.parse(localStorage.getItem('nm_announcements')||'[]');
                all.unshift({ msg:ann, date:new Date().toISOString(), by:'Admin' });
                localStorage.setItem('nm_announcements', JSON.stringify(all));
                setAnn(''); setAnnMsg('✅ Published to all users');
                setTimeout(()=>setAnnMsg(''), 3000);
              }} style={{ padding:'9px 20px', borderRadius:10, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', color:'#f59e0b', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                <Bell size={14}/> Publish
              </button>
            </div>
            {(() => {
              const all = JSON.parse(localStorage.getItem('nm_announcements')||'[]');
              if (!all.length) return <div style={{ textAlign:'center', padding:40, color:'var(--text-3)', fontSize:13 }}>No announcements yet</div>;
              return all.map((a:any, i:number) => (
                <div key={i} style={{ padding:'13px 16px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:8, display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ fontSize:16, flexShrink:0 }}>📣</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, color:'var(--text)', marginBottom:4 }}>{a.msg}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>by {a.by} · {new Date(a.date).toLocaleString('en-IN')}</div>
                  </div>
                  <button onClick={() => {
                    const updated = all.filter((_:any, j:number) => j!==i);
                    localStorage.setItem('nm_announcements', JSON.stringify(updated));
                    load();
                  }} style={{ padding:'5px', background:'none', border:'none', color:'#ef4444', cursor:'pointer' }}><Trash2 size={13}/></button>
                </div>
              ));
            })()}
          </motion.div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Platform Settings</h2>
            {[
              { label:'Open Registrations',   desc:'Allow new users to register on the platform', on:true },
              { label:'Maintenance Mode',      desc:'Show maintenance page to all non-admin users', on:false },
              { label:'Email Notifications',   desc:'Send automated emails on application updates', on:true },
              { label:'Public Leaderboard',    desc:'Make leaderboard visible to all users', on:true },
              { label:'Certificate Verification', desc:'Enable public certificate verification', on:true },
              { label:'Student Data Export',   desc:'Allow colleges to export student CSV data', on:true },
            ].map((s, i) => (
              <div key={i} style={{ padding:'15px 18px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)' }}>{s.desc}</div>
                </div>
                <div style={{ width:42, height:23, borderRadius:999, background:s.on?'#f59e0b':'var(--border)', position:'relative', cursor:'pointer', flexShrink:0, transition:'background 0.3s' }}>
                  <div style={{ width:17, height:17, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:s.on?21:3, transition:'left 0.3s' }}/>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </main>
    </div>
  );
}
