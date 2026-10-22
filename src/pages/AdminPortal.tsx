import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, School, ShieldCheck, Search, ToggleLeft, ToggleRight, Trash2, LogOut, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '../AuthContext';

const ROLE_COLOR: Record<string, string> = { student:'#7c3aed', company:'#3b82f6', college:'#10b981', admin:'#f59e0b' };
const ROLE_ICON:  Record<string, string> = { student:'🎓', company:'🏢', college:'🏫', admin:'🛡️' };

export default function AdminPortal() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [tab,    setTab]    = useState<'dashboard'|'users'|'applications'>('dashboard');
  const [users,  setUsers]  = useState<any[]>([]);
  const [apps,   setApps]   = useState<any[]>([]);
  const [stats,  setStats]  = useState({ students:0, companies:0, colleges:0, admins:0, totalApplications:0, totalUsers:0 });
  const [roleFilter, setRoleFilter] = useState('all');
  const [q,      setQ]      = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchDashboard();
  }, [user]);

  const api = (path: string, opts?: RequestInit) =>
    fetch(`http://localhost:5000/api/admin${path}`, {
      ...opts,
      headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts?.headers||{}) },
    }).then(r => r.json());

  const fetchDashboard = async () => {
    setLoading(true);
    const [dash, usersData, appsData] = await Promise.all([
      api('/dashboard'), api('/users?limit=50'), api('/applications?limit=50'),
    ]);
    if (dash.success)      setStats(dash.stats);
    if (usersData.success) setUsers(usersData.users);
    if (appsData.success)  setApps(appsData.applications);
    setLoading(false);
  };

  const toggleUser = async (id: string) => {
    const res = await api(`/users/${id}/toggle`, { method: 'PATCH' });
    if (res.success) setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.isActive } : u));
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Permanently delete this user?')) return;
    const res = await api(`/users/${id}`, { method: 'DELETE' });
    if (res.success) setUsers(prev => prev.filter(u => u._id !== id));
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (q && !u.name?.toLowerCase().includes(q.toLowerCase()) && !u.email?.toLowerCase().includes(q.toLowerCase()) && !u.companyName?.toLowerCase().includes(q.toLowerCase()) && !u.collegeName?.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  if (!user || user.role !== 'admin') return null;

  const StatCard = ({ icon, label, value, color, sub }: any) => (
    <motion.div whileHover={{ y: -3 }} className="glass-heavy"
      style={{ borderRadius: 16, padding: '18px 20px', borderTop: `3px solid ${color}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {icon}
        </div>
        <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:600 }}>{label}</span>
      </div>
      <div className="font-display" style={{ fontSize:28, fontWeight:800, color:'var(--text)' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'var(--text-3)', marginTop:4 }}>{sub}</div>}
    </motion.div>
  );

  return (
    <div style={{ minHeight:'100vh', paddingTop:60, background:'var(--bg)', display:'flex' }}>
      {/* Sidebar */}
      <aside style={{ width:220, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', background:'var(--surface)', borderRight:'1px solid var(--border)', padding:'22px 12px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', marginBottom:22 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <ShieldCheck size={18} color="#fff" />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:10, color:'#f59e0b', fontWeight:600 }}>Admin Portal</div>
          </div>
        </div>

        {[
          { id:'dashboard',    label:'Overview',     icon:'📊' },
          { id:'users',        label:'Manage Users', icon:'👥' },
          { id:'applications', label:'Applications', icon:'📋' },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id as any)}
            style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 13px', borderRadius:10, marginBottom:4, fontSize:13.5, fontWeight:tab===item.id?700:500, cursor:'pointer', textAlign:'left', border:'none', background:tab===item.id?'rgba(245,158,11,0.1)':'none', color:tab===item.id?'#f59e0b':'var(--text-2)', borderLeft:`3px solid ${tab===item.id?'#f59e0b':'transparent'}` }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}

        {/* Role filter badges */}
        {tab === 'users' && (
          <div style={{ marginTop:16, padding:'0 4px' }}>
            <p style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8, paddingLeft:8 }}>Filter by Role</p>
            {['all','student','company','college','admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 12px', borderRadius:8, marginBottom:3, fontSize:12.5, fontWeight:roleFilter===r?700:500, cursor:'pointer', border:'none', background:roleFilter===r?`${ROLE_COLOR[r]||'#7c3aed'}12`:'none', color:roleFilter===r?(ROLE_COLOR[r]||'#7c3aed'):'var(--text-2)' }}>
                {r === 'all' ? '🌐' : ROLE_ICON[r]} {r.charAt(0).toUpperCase()+r.slice(1)}
                <span style={{ marginLeft:'auto', fontSize:10.5, fontWeight:700, padding:'1px 6px', borderRadius:999, background:'var(--border)', color:'var(--text-3)' }}>
                  {r==='all' ? stats.totalUsers : (stats as any)[r+'s'] || 0}
                </span>
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop:'auto', borderTop:'1px solid var(--border)', paddingTop:14 }}>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 13px', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer', border:'none', background:'none', color:'#ef4444', textAlign:'left' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, padding:'28px 32px', minWidth:0 }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:6 }}>Platform Overview 🛡️</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>NaanMudhalvan Marketplace — Admin Control Panel</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(170px, 1fr))', gap:16, marginBottom:32 }}>
              <StatCard icon={<Users size={18} color="#7c3aed" />}     label="Students"          value={stats.students}          color="#7c3aed" />
              <StatCard icon={<Building2 size={18} color="#3b82f6" />} label="Companies"         value={stats.companies}         color="#3b82f6" />
              <StatCard icon={<School size={18} color="#10b981" />}    label="Colleges"          value={stats.colleges}          color="#10b981" />
              <StatCard icon={<ShieldCheck size={18} color="#f59e0b"/>}label="Admins"            value={stats.admins}            color="#f59e0b" />
              <StatCard icon={<FileText size={18} color="#06b6d4" />}  label="Total Applications"value={stats.totalApplications} color="#06b6d4" sub="All time" />
            </div>

            <h2 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:14 }}>Recently Registered Users</h2>
            <UserTable users={users.slice(0, 10)} onToggle={toggleUser} onDelete={deleteUser} />
          </>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)' }}>
                Manage Users <span style={{ fontSize:14, fontWeight:500, color:'var(--text-3)' }}>({filteredUsers.length})</span>
              </h1>
              <div style={{ position:'relative' }}>
                <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users…" style={{ paddingLeft:36, fontSize:13, width:220 }} />
              </div>
            </div>
            <UserTable users={filteredUsers} onToggle={toggleUser} onDelete={deleteUser} />
          </>
        )}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>All Applications</h1>
            <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--border)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'10px 16px', background:'var(--surface)', fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border)' }}>
                <span>Applicant</span><span>Role</span><span>Type</span><span>Date</span><span>Status</span>
              </div>
              {apps.map((app, i) => (
                <div key={app._id||i} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'11px 16px', borderBottom:'1px solid var(--border)', background:i%2===0?'var(--surface)':'var(--bg)', fontSize:13, alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:600, color:'var(--text)' }}>{app.userName||'User'}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', marginTop:1 }}>{app.userEmail||'—'}</div>
                  </div>
                  <div style={{ color:'var(--text-2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.itemTitle||'—'}</div>
                  <span style={{ padding:'3px 8px', borderRadius:999, fontSize:10.5, fontWeight:700, background:'rgba(124,58,237,0.1)', color:'#a78bfa', width:'fit-content' }}>{app.type}</span>
                  <span style={{ color:'var(--text-3)', fontSize:11.5 }}>{app.createdAt?new Date(app.createdAt).toLocaleDateString('en-IN'):'—'}</span>
                  <span style={{ padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700, background:'rgba(16,185,129,0.1)', color:'#34d399', width:'fit-content' }}>{app.status}</span>
                </div>
              ))}
              {apps.length===0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text-3)', fontSize:13 }}>No applications yet.</div>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function UserTable({ users, onToggle, onDelete }: { users:any[]; onToggle:(id:string)=>void; onDelete:(id:string)=>void }) {
  if (!users.length) return <div style={{ textAlign:'center', padding:'40px', color:'var(--text-3)', fontSize:13 }}>No users found.</div>;
  return (
    <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--border)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1.5fr 1fr 1fr 100px', padding:'10px 16px', background:'var(--surface)', fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.06em', borderBottom:'1px solid var(--border)' }}>
        <span>Name</span><span>Email</span><span>Details</span><span>Role</span><span>Status</span><span>Actions</span>
      </div>
      {users.map((u, i) => (
        <div key={u._id||i} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1.5fr 1fr 1fr 100px', padding:'11px 16px', borderBottom:'1px solid var(--border)', background:i%2===0?'var(--surface)':'var(--bg)', fontSize:13, alignItems:'center' }}>
          <div style={{ fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {ROLE_ICON[u.role]} {u.name}
          </div>
          <div style={{ color:'var(--text-3)', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</div>
          <div style={{ color:'var(--text-2)', fontSize:11.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {u.role==='student'  && `${u.college||'—'} · ${u.year||''}`}
            {u.role==='company'  && `${u.companyName||'—'} · ${u.industry||''}`}
            {u.role==='college'  && `${u.collegeName||'—'} · ${u.district||''}`}
            {u.role==='admin'    && `Level: ${u.adminLevel||'moderator'}`}
          </div>
          <span style={{ padding:'3px 8px', borderRadius:999, fontSize:10.5, fontWeight:700, background:`${ROLE_COLOR[u.role]||'#7c3aed'}15`, color:ROLE_COLOR[u.role]||'#7c3aed', width:'fit-content' }}>
            {u.role}
          </span>
          <span style={{ padding:'3px 8px', borderRadius:999, fontSize:10.5, fontWeight:700, background:u.isActive!==false?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color:u.isActive!==false?'#34d399':'#fca5a5', width:'fit-content' }}>
            {u.isActive!==false?'Active':'Inactive'}
          </span>
          <div style={{ display:'flex', gap:6 }}>
            <button title={u.isActive!==false?'Deactivate':'Activate'} onClick={()=>onToggle(u._id)}
              style={{ background:'none', border:'none', cursor:'pointer', color:u.isActive!==false?'#10b981':'#f59e0b', padding:4, borderRadius:6 }}>
              {u.isActive!==false?<ToggleRight size={18}/>:<ToggleLeft size={18}/>}
            </button>
            {u.role !== 'admin' && (
              <button title="Delete" onClick={()=>onDelete(u._id)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:4, borderRadius:6 }}>
                <Trash2 size={15}/>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
