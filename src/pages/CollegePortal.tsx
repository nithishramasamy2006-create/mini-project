import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, BookOpen, Building2, School, LogOut, Award, BarChart3, Download, Search } from 'lucide-react';
import { useAuth } from '../AuthContext';

type Tab = 'dashboard' | 'students' | 'placements' | 'companies' | 'profile';

// Mock student data (would come from DB in production)
const MOCK_STUDENTS = Array.from({ length: 24 }, (_, i) => ({
  id: i+1,
  name: ['Arun Kumar', 'Priya Selvi', 'Karthik Raja', 'Divya Lakshmi', 'Siva Prasad', 'Meena Kumari',
         'Vijay Anand', 'Deepa Devi', 'Ravi Shankar', 'Anitha Krishnan', 'Muthu Pandian', 'Saranya Devi'][i%12] + ` ${i+1}`,
  branch: ['CSE','IT','ECE','EEE','MECH','CIVIL'][i%6],
  year: ['3rd Year','4th Year','2nd Year','PG 1st Year'][i%4],
  cgpa: (6.5 + Math.random()*3.5).toFixed(1),
  placed: Math.random() > 0.45,
  company: ['TCS','Infosys','Zoho','Freshworks','Wipro','HCL','Cognizant','BYJU\'S'][i%8],
  stipend: ['₹18,000','₹20,000','₹25,000','₹15,000','₹30,000'][i%5],
  skills: ['React, Python, SQL', 'Java, Spring, MySQL', 'Python, ML, TensorFlow', 'Angular, Node, MongoDB'][i%4].split(', '),
}));

export default function CollegePortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [q,   setQ]   = useState('');

  useEffect(() => {
    if (!user || user.role !== 'college') { navigate('/login'); return; }
  }, [user]);

  if (!user || user.role !== 'college') return null;

  const placed     = MOCK_STUDENTS.filter(s => s.placed).length;
  const notPlaced  = MOCK_STUDENTS.length - placed;
  const placePct   = Math.round((placed / MOCK_STUDENTS.length) * 100);
  const avgCgpa    = (MOCK_STUDENTS.reduce((s,a) => s + parseFloat(a.cgpa), 0) / MOCK_STUDENTS.length).toFixed(1);
  const filteredSt = MOCK_STUDENTS.filter(s =>
    !q || s.name.toLowerCase().includes(q.toLowerCase()) ||
    s.branch.toLowerCase().includes(q.toLowerCase()) ||
    s.company.toLowerCase().includes(q.toLowerCase())
  );

  const COMPANIES = [
    { name:'TCS',       hired:6, color:'#1a56db' },
    { name:'Zoho',      hired:4, color:'#e42527' },
    { name:'Infosys',   hired:3, color:'#007cc3' },
    { name:'Freshworks',hired:3, color:'#29b5e8' },
    { name:'Wipro',     hired:2, color:'#7b2d8b' },
    { name:'Cognizant', hired:2, color:'#0033a0' },
    { name:'HCL',       hired:2, color:'#00539b' },
    { name:'BYJU\'S',   hired:2, color:'#00a3e0' },
  ];

  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:'dashboard',  label:'Dashboard',        icon:<LayoutDashboard size={16}/> },
    { id:'students',   label:'Students',         icon:<Users size={16}/> },
    { id:'placements', label:'Placement Report', icon:<TrendingUp size={16}/> },
    { id:'companies',  label:'Company Connect',  icon:<Building2 size={16}/> },
    { id:'profile',    label:'College Profile',  icon:<School size={16}/> },
  ];

  const StatCard = ({ icon, value, label, color, sub }: any) => (
    <motion.div whileHover={{ y:-3 }}
      style={{ background:'var(--surface)', borderRadius:16, padding:'20px', border:'1px solid var(--border)', borderTop:`3px solid ${color}` }}>
      <div style={{ width:40,height:40,borderRadius:12,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:12 }}>{icon}</div>
      <div className="font-display" style={{ fontSize:32, fontWeight:800, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--text-3)', marginTop:6 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:`${color}`, fontWeight:700, marginTop:4 }}>{sub}</div>}
    </motion.div>
  );

  return (
    <div style={{ minHeight:'100vh', paddingTop:60, background:'var(--bg)', display:'flex' }}>

      {/* Sidebar */}
      <aside style={{ width:236, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', background:'var(--surface)', borderRight:'1px solid var(--border)', padding:'20px 10px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:14, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.18)', marginBottom:24 }}>
          <div style={{ width:40,height:40,borderRadius:11,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <School size={19} color="#fff" />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.collegeName||user.name}</div>
            <div style={{ fontSize:10.5, color:'#10b981', fontWeight:700 }}>COLLEGE PORTAL</div>
          </div>
        </div>

        <nav style={{ flex:1 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', borderRadius:11, marginBottom:3, fontSize:13.5, fontWeight:tab===item.id?700:500, cursor:'pointer', textAlign:'left', border:'none', background:tab===item.id?'rgba(16,185,129,0.12)':'none', color:tab===item.id?'#10b981':'var(--text-2)', borderLeft:`3px solid ${tab===item.id?'#10b981':'transparent'}`, transition:'all 0.15s' }}>
              {item.icon} {item.label}
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

      {/* Main */}
      <main style={{ flex:1, padding:'28px 32px 60px', minWidth:0 }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:26, color:'var(--text)', marginBottom:4 }}>
              Welcome, {user.collegeName||user.name} 🏫
            </h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>{user.affiliation||'NaanMudhalvan Partner College'} · {user.district||'Tamil Nadu'}</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:16, marginBottom:32 }}>
              <StatCard icon={<Users size={18} color="#7c3aed"/>}      value={MOCK_STUDENTS.length} label="Total Students"    color="#7c3aed" />
              <StatCard icon={<Award size={18} color="#10b981"/>}      value={placed}               label="Placed Students"  color="#10b981" sub={`${placePct}% Placement`} />
              <StatCard icon={<TrendingUp size={18} color="#3b82f6"/>} value={avgCgpa}              label="Average CGPA"     color="#3b82f6" />
              <StatCard icon={<Building2 size={18} color="#f59e0b"/>}  value={COMPANIES.length}     label="Hiring Companies" color="#f59e0b" />
            </div>

            {/* Branch-wise placement */}
            <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px 24px', border:'1px solid var(--border)', marginBottom:24 }}>
              <h3 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:18 }}>📊 Branch-wise Placement Rate</h3>
              {['CSE','IT','ECE','EEE','MECH','CIVIL'].map((branch, i) => {
                const branchSt = MOCK_STUDENTS.filter(s => s.branch === branch);
                const bPlaced  = branchSt.filter(s => s.placed).length;
                const bPct     = branchSt.length ? Math.round((bPlaced/branchSt.length)*100) : 0;
                const color    = ['#7c3aed','#3b82f6','#06b6d4','#10b981','#f59e0b','#ec4899'][i];
                return (
                  <div key={branch} style={{ marginBottom:13 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>{branch}</span>
                      <span style={{ fontSize:13, fontWeight:700, color }}>{bPct}% · {bPlaced}/{branchSt.length}</span>
                    </div>
                    <div style={{ height:7, borderRadius:999, background:'var(--border)' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${bPct}%` }} transition={{ duration:1, ease:'easeOut', delay:i*0.1 }}
                        style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}99)` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Company breakdown */}
            <h2 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:14 }}>🏢 Top Hiring Companies</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12 }}>
              {COMPANIES.slice(0,6).map(({ name, hired, color }) => (
                <div key={name} style={{ background:'var(--surface)', borderRadius:12, padding:'14px', border:`1px solid ${color}25`, textAlign:'center' }}>
                  <div className="font-display" style={{ fontSize:22, fontWeight:800, color, marginBottom:4 }}>{hired}</div>
                  <div style={{ fontSize:12, color:'var(--text-2)', fontWeight:600 }}>{name}</div>
                  <div style={{ fontSize:10.5, color:'var(--text-3)', marginTop:2 }}>students hired</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STUDENTS */}
        {tab === 'students' && (
          <motion.div key="students" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <div>
                <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:2 }}>👥 Student List</h1>
                <p style={{ fontSize:12.5, color:'var(--text-3)' }}>{filteredSt.length} students</p>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ position:'relative' }}>
                  <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
                  <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search students…" style={{ paddingLeft:34, fontSize:13, width:200 }} />
                </div>
                <button className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                  <Download size={13}/> Export
                </button>
              </div>
            </div>
            <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--border)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', padding:'10px 16px', background:'var(--surface)', fontSize:10.5, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid var(--border)' }}>
                <span>Name</span><span>Branch</span><span>Year</span><span>CGPA</span><span>Status</span><span>Company</span>
              </div>
              {filteredSt.map((s, i) => (
                <div key={s.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', padding:'11px 16px', borderBottom:'1px solid var(--border)', background:i%2===0?'var(--surface)':'var(--bg)', fontSize:13, alignItems:'center' }}>
                  <div style={{ fontWeight:600, color:'var(--text)' }}>{s.name}</div>
                  <span style={{ padding:'2px 8px', borderRadius:999, fontSize:10.5, fontWeight:700, background:'rgba(124,58,237,0.1)', color:'#a78bfa', width:'fit-content' }}>{s.branch}</span>
                  <span style={{ fontSize:12, color:'var(--text-3)' }}>{s.year}</span>
                  <span style={{ fontWeight:700, color: parseFloat(s.cgpa)>=8?'#10b981':parseFloat(s.cgpa)>=6.5?'#f59e0b':'#ef4444' }}>{s.cgpa}</span>
                  <span style={{ padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:s.placed?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.08)', color:s.placed?'#34d399':'#fca5a5', width:'fit-content' }}>
                    {s.placed?'✅ Placed':'⏳ Pending'}
                  </span>
                  <span style={{ fontSize:12, color:'var(--text-2)' }}>{s.placed?s.company:'—'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PLACEMENT REPORT */}
        {tab === 'placements' && (
          <motion.div key="place" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)' }}>📈 Placement Report 2026</h1>
              <button className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:7, fontSize:13 }}>
                <Download size={14}/> Export PDF
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Pie summary */}
              <div style={{ background:'var(--surface)', borderRadius:18, padding:'24px', border:'1px solid var(--border)' }}>
                <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:20 }}>📊 Placement Overview</h3>
                <div style={{ display:'flex', gap:24, alignItems:'center', marginBottom:20 }}>
                  <div style={{ width:120, height:120, borderRadius:'50%', background:`conic-gradient(#10b981 0deg ${placePct*3.6}deg, var(--border) ${placePct*3.6}deg)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', flexShrink:0 }}>
                    <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--surface)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <div className="font-display" style={{ fontSize:20, fontWeight:800, color:'#10b981' }}>{placePct}%</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'#10b981' }} />
                      <span style={{ fontSize:13, color:'var(--text-2)' }}>Placed: <strong style={{ color:'var(--text)' }}>{placed}</strong></span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--border)' }} />
                      <span style={{ fontSize:13, color:'var(--text-2)' }}>Not placed: <strong style={{ color:'var(--text)' }}>{notPlaced}</strong></span>
                    </div>
                    <div style={{ fontSize:12, color:'var(--text-3)', marginTop:8 }}>Total: {MOCK_STUDENTS.length} students</div>
                  </div>
                </div>
                {[
                  { label:'Highest Package',  val:'₹18 LPA',  color:'#10b981' },
                  { label:'Average Package',  val:'₹5.2 LPA', color:'#3b82f6' },
                  { label:'Companies Visited',val:'8',         color:'#7c3aed' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid var(--border)' }}>
                    <span style={{ fontSize:13, color:'var(--text-3)' }}>{label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Company-wise */}
              <div style={{ background:'var(--surface)', borderRadius:18, padding:'24px', border:'1px solid var(--border)' }}>
                <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:18 }}>🏢 Company-wise Hiring</h3>
                {COMPANIES.map(({ name, hired, color }) => (
                  <div key={name} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>{name}</span>
                      <span style={{ fontSize:13, fontWeight:700, color }}>{hired} students</span>
                    </div>
                    <div style={{ height:6, borderRadius:999, background:'var(--border)' }}>
                      <div style={{ height:'100%', width:`${(hired/8)*100}%`, borderRadius:999, background:`linear-gradient(90deg,${color},${color}99)` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* COMPANY CONNECT */}
        {tab === 'companies' && (
          <motion.div key="comp" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>🏢 Company Connect</h1>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
              {COMPANIES.map(({ name, hired, color }) => (
                <motion.div key={name} whileHover={{ y:-3, boxShadow:`0 8px 28px ${color}22` }}
                  style={{ background:'var(--surface)', borderRadius:16, padding:'20px', border:`1px solid ${color}25`, transition:'box-shadow 0.2s' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                    <div style={{ width:44,height:44,borderRadius:12,background:`${color}15`,border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0 }}>
                      <img src={`https://logo.clearbit.com/${name.toLowerCase().replace("'s",'').replace(' ','')}.com`} alt={name} width={28} height={28} style={{ objectFit:'contain' }} onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{name}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>Active Partner</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderTop:'1px solid var(--border)' }}>
                    <span style={{ fontSize:12, color:'var(--text-3)' }}>Students Hired</span>
                    <span className="font-display" style={{ fontSize:16, fontWeight:800, color }}>{hired}</span>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:10, fontSize:12.5 }}>
                    Contact HR →
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COLLEGE PROFILE */}
        {tab === 'profile' && (
          <motion.div key="prof" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>🏫 College Profile</h1>
            <div style={{ background:'var(--surface)', borderRadius:18, padding:'28px', border:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:28, paddingBottom:20, borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:72,height:72,borderRadius:18,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,flexShrink:0 }}>🏫</div>
                <div>
                  <div className="font-display" style={{ fontWeight:800, fontSize:22, color:'var(--text)', marginBottom:4 }}>{user.collegeName||user.name}</div>
                  <div style={{ fontSize:13, color:'#10b981', fontWeight:600 }}>{user.affiliation||'Anna University'} · NAAC {user.naac||'A+'}</div>
                  <div style={{ fontSize:12.5, color:'var(--text-3)', marginTop:2 }}>{user.district||'Tamil Nadu'}</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[
                  { label:'Affiliation',   val:user.affiliation||'—' },
                  { label:'District',      val:user.district||'—' },
                  { label:'NAAC Grade',    val:user.naac||'—' },
                  { label:'Total Students',val:MOCK_STUDENTS.length+'  enrolled' },
                  { label:'TPO Name',      val:user.tpoName||'—' },
                  { label:'TPO Phone',     val:user.tpoPhone||'—' },
                  { label:'Email',         val:user.email },
                  { label:'Placement %',   val:`${placePct}%` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ padding:'12px 16px', borderRadius:12, background:'var(--bg)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:5 }}>{label}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{val}</div>
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
