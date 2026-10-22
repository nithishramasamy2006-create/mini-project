import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, Building2, LogOut,
  Search, Download, Edit3, Save, CheckCircle, BarChart3,
  BookOpen, Award, Bell, Settings, PlusCircle, Trash2,
  FileText, Globe, Phone, Mail, MapPin, Star
} from 'lucide-react';
import { useAuth } from '../AuthContext';

type Tab = 'dashboard' | 'students' | 'placements' | 'companies' | 'courses' | 'announcements' | 'profile' | 'settings';

// ── Mock students ─────────────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: ['Arun Kumar','Priya Selvi','Karthik Raja','Divya Lakshmi','Siva Prasad','Meena Kumari',
         'Vijay Anand','Deepa Devi','Ravi Shankar','Anitha Krishnan','Muthu Pandian','Saranya Devi',
         'Tamil Selvan','Kavitha Nair','Bala Krishna','Nandini Raj'][i % 16] + ` ${i + 1}`,
  branch: ['CSE','IT','ECE','EEE','MECH','CIVIL'][i % 6],
  year: ['3rd Year','4th Year','2nd Year','PG 1st Year'][i % 4],
  cgpa: parseFloat((6.5 + Math.random() * 3.5).toFixed(1)),
  placed: i % 3 !== 0,
  company: ['TCS','Infosys','Zoho','Freshworks','Wipro','HCL','Cognizant','BYJU\'S','Amazon','Flipkart'][i % 10],
  stipend: ['₹18,000','₹20,000','₹25,000','₹15,000','₹30,000','₹22,000'][i % 6],
  skills: ['React,Python,SQL','Java,Spring,MySQL','Python,ML,TF','Angular,Node,MongoDB','C++,DSA,System Design'][i % 5].split(','),
  email: `student${i + 1}@college.edu`,
  phone: `+91 ${9800000000 + i}`,
  registeredAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
}));

const COMPANIES = [
  { name:'TCS',        hired: 6, color:'#1a56db', package:'₹7–9 LPA' },
  { name:'Zoho',       hired: 5, color:'#e42527', package:'₹8–12 LPA' },
  { name:'Infosys',    hired: 4, color:'#007cc3', package:'₹6–8 LPA' },
  { name:'Freshworks', hired: 4, color:'#29b5e8', package:'₹10–15 LPA' },
  { name:'Amazon',     hired: 3, color:'#ff9900', package:'₹18–28 LPA' },
  { name:'Wipro',      hired: 3, color:'#7b2d8b', package:'₹7–10 LPA' },
  { name:'HCL',        hired: 2, color:'#00539b', package:'₹6–9 LPA' },
  { name:'Cognizant',  hired: 2, color:'#0033a0', package:'₹6–8 LPA' },
];

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }: any) {
  return (
    <div style={{ padding:'18px 20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:46, height:46, borderRadius:13, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:24, fontWeight:800, color:'var(--text)', lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:10.5, color, fontWeight:600, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function CollegePortal() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab,     setTab]     = useState<Tab>('dashboard');
  const [q,       setQ]       = useState('');
  const [branchF, setBranchF] = useState('all');
  const [yearF,   setYearF]   = useState('all');
  const [placedF, setPlacedF] = useState('all');
  const [saving,  setSaving]  = useState(false);
  const [savedMsg,setSavedMsg]= useState('');
  const [newAnn,  setNewAnn]  = useState('');
  const [annMsg,  setAnnMsg]  = useState('');

  // Profile form
  const [pf, setPf] = useState<Record<string,any>>({});

  useEffect(() => {
    if (!user || user.role !== 'college') { navigate('/login'); return; }
    setPf({
      collegeName: (user as any).collegeName || '',
      affiliation: (user as any).affiliation || '',
      district:    (user as any).district    || '',
      naac:        (user as any).naac        || '',
      tpoName:     (user as any).tpoName     || '',
      tpoPhone:    (user as any).tpoPhone    || '',
      tpoEmail:    user.email || '',
      website:     (user as any).website     || '',
      address:     (user as any).address     || '',
    });
  }, [user]);

  if (!user || user.role !== 'college') return null;

  // ── Computed stats ───────────────────────────────────────────────
  const placed    = MOCK_STUDENTS.filter(s => s.placed).length;
  const notPlaced = MOCK_STUDENTS.length - placed;
  const placePct  = Math.round((placed / MOCK_STUDENTS.length) * 100);
  const avgCgpa   = (MOCK_STUDENTS.reduce((s, a) => s + a.cgpa, 0) / MOCK_STUDENTS.length).toFixed(1);
  const highPackage = '₹30 LPA';

  const filteredStudents = useMemo(() => MOCK_STUDENTS.filter(s => {
    if (branchF !== 'all' && s.branch !== branchF) return false;
    if (yearF   !== 'all' && s.year   !== yearF)   return false;
    if (placedF === 'placed'    && !s.placed)       return false;
    if (placedF === 'notplaced' &&  s.placed)       return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) &&
             !s.branch.toLowerCase().includes(q.toLowerCase()) &&
             !s.company.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, branchF, yearF, placedF]);

  const saveProfile = async () => {
    setSaving(true);
    const res = await updateUser(pf);
    setSavedMsg(res.message);
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const exportCSV = () => {
    const rows = ['Name,Branch,Year,CGPA,Placed,Company,Stipend',
      ...filteredStudents.map(s => `${s.name},${s.branch},${s.year},${s.cgpa},${s.placed?'Yes':'No'},${s.placed?s.company:'—'},${s.placed?s.stipend:'—'}`)
    ].join('\n');
    const blob = new Blob([rows], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'placement_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── NAV ──────────────────────────────────────────────────────────
  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:'dashboard',     label:'Dashboard',       icon:<LayoutDashboard size={16}/> },
    { id:'students',      label:'Students',        icon:<Users size={16}/> },
    { id:'placements',    label:'Placement Report',icon:<TrendingUp size={16}/> },
    { id:'companies',     label:'Company Connect', icon:<Building2 size={16}/> },
    { id:'courses',       label:'Course Analytics',icon:<BookOpen size={16}/> },
    { id:'announcements', label:'Announcements',   icon:<Bell size={16}/> },
    { id:'profile',       label:'College Profile', icon:<Award size={16}/> },
    { id:'settings',      label:'Settings',        icon:<Settings size={16}/> },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>
      {/* SIDEBAR */}
      <aside style={{ width:230, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'16px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:13, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.18)', marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#10b981,#059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🏫</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(user as any).collegeName || user.name}</div>
            <div style={{ fontSize:10.5, color:'#10b981', fontWeight:600 }}>TPO Portal</div>
          </div>
        </div>
        <nav style={{ flex:1 }}>
          {NAV.map(n => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?'#10b981':'var(--text-2)', background:active?'rgba(16,185,129,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?'3px solid #10b981':'3px solid transparent' }}>
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

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ marginBottom:24 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:4 }}>College Dashboard 🏫</h1>
              <p style={{ color:'var(--text-3)', fontSize:13 }}>{(user as any).collegeName || 'Your College'} · Training & Placement Office</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:32 }}>
              <StatCard icon="👥" label="Total Students"    value={MOCK_STUDENTS.length}   color="#7c3aed" />
              <StatCard icon="✅" label="Placed"            value={placed}                 color="#10b981" sub={`${placePct}% placement`} />
              <StatCard icon="🕐" label="Yet to Place"      value={notPlaced}              color="#f59e0b" />
              <StatCard icon="📊" label="Average CGPA"      value={avgCgpa}                color="#3b82f6" />
              <StatCard icon="🏢" label="Partner Companies" value={COMPANIES.length}       color="#06b6d4" />
              <StatCard icon="💰" label="Highest Package"   value={highPackage}            color="#ec4899" />
            </div>

            {/* Placement bar chart */}
            <div style={{ padding:'20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:16 }}>📊 Branch-wise Placement</h3>
              {['CSE','IT','ECE','EEE','MECH','CIVIL'].map(branch => {
                const total  = MOCK_STUDENTS.filter(s => s.branch === branch).length;
                const pld    = MOCK_STUDENTS.filter(s => s.branch === branch && s.placed).length;
                const pct    = total ? Math.round((pld/total)*100) : 0;
                return (
                  <div key={branch} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:12.5, fontWeight:600, color:'var(--text-2)' }}>{branch}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:pct>=75?'#10b981':pct>=50?'#f59e0b':'#ef4444' }}>{pld}/{total} ({pct}%)</span>
                    </div>
                    <div style={{ height:8, borderRadius:999, background:'var(--border)', overflow:'hidden' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7, ease:'easeOut' }}
                        style={{ height:'100%', borderRadius:999, background:pct>=75?'linear-gradient(90deg,#10b981,#34d399)':pct>=50?'linear-gradient(90deg,#f59e0b,#fbbf24)':'linear-gradient(90deg,#ef4444,#f87171)' }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top companies */}
            <div style={{ padding:'20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:16 }}>🏆 Top Recruiting Companies</h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
                {COMPANIES.slice(0,6).map(c => (
                  <div key={c.name} style={{ padding:'12px 14px', borderRadius:12, background:`${c.color}10`, border:`1px solid ${c.color}20`, textAlign:'center' }}>
                    <div style={{ fontWeight:800, fontSize:14, color:c.color, marginBottom:4 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-2)', marginBottom:2 }}>{c.hired} students</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{c.package}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STUDENTS ── */}
        {tab === 'students' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Students ({filteredStudents.length})</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Manage and monitor all enrolled students</p>
              </div>
              <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                <Download size={14}/> Export CSV
              </button>
            </div>

            {/* Filters */}
            <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search student, branch, company…" style={{ paddingLeft:36, fontSize:13 }}/>
              </div>
              <select className="inp" value={branchF} onChange={e=>setBranchF(e.target.value)} style={{ fontSize:13, width:'auto' }}>
                <option value="all">All Branches</option>
                {['CSE','IT','ECE','EEE','MECH','CIVIL'].map(b=><option key={b} value={b}>{b}</option>)}
              </select>
              <select className="inp" value={yearF} onChange={e=>setYearF(e.target.value)} style={{ fontSize:13, width:'auto' }}>
                <option value="all">All Years</option>
                {['2nd Year','3rd Year','4th Year','PG 1st Year'].map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <select className="inp" value={placedF} onChange={e=>setPlacedF(e.target.value)} style={{ fontSize:13, width:'auto' }}>
                <option value="all">All Status</option>
                <option value="placed">Placed</option>
                <option value="notplaced">Not Placed</option>
              </select>
            </div>

            {/* Student Table */}
            <div style={{ borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'var(--bg-2)' }}>
                      {['Student','Branch','Year','CGPA','Status','Company','Stipend'].map(h => (
                        <th key={h} style={{ padding:'11px 14px', textAlign:'left', fontSize:11, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s, i) => (
                      <tr key={s.id} style={{ background:i%2===0?'transparent':'rgba(255,255,255,0.01)', transition:'background 0.15s' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.04)'}
                        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?'transparent':'rgba(255,255,255,0.01)'}>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{s.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-3)' }}>{s.email}</div>
                        </td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', fontSize:12.5, fontWeight:600, color:'var(--text-2)' }}>{s.branch}</td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', fontSize:12, color:'var(--text-3)' }}>{s.year}</td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)' }}>
                          <span style={{ fontSize:12.5, fontWeight:700, color:s.cgpa>=8?'#10b981':s.cgpa>=6.5?'#f59e0b':'#ef4444' }}>{s.cgpa}</span>
                        </td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)' }}>
                          <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:999, background:s.placed?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.1)', color:s.placed?'#10b981':'#ef4444' }}>
                            {s.placed ? '✅ Placed' : '⏳ Seeking'}
                          </span>
                        </td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', fontSize:12.5, color:'var(--text-2)', fontWeight:600 }}>{s.placed ? s.company : '—'}</td>
                        <td style={{ padding:'10px 14px', borderBottom:'1px solid var(--border)', fontSize:12.5, color:s.placed?'#10b981':'var(--text-3)', fontWeight:s.placed?700:400 }}>{s.placed ? s.stipend : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── PLACEMENTS ── */}
        {tab === 'placements' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Placement Report</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Full placement statistics for NAAC/NBA reporting</p>
              </div>
              <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                <Download size={14}/> Download Report
              </button>
            </div>

            {/* Summary */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:12, marginBottom:24 }}>
              {[
                { icon:'👥', label:'Total Students',     val:MOCK_STUDENTS.length,  color:'#7c3aed' },
                { icon:'✅', label:'Placed',             val:`${placed} (${placePct}%)`, color:'#10b981' },
                { icon:'🕐', label:'Not Yet Placed',     val:notPlaced,             color:'#f59e0b' },
                { icon:'📊', label:'Avg CGPA',           val:avgCgpa,               color:'#3b82f6' },
                { icon:'💰', label:'Avg Stipend',        val:'₹21,500',             color:'#ec4899' },
                { icon:'🏆', label:'Highest Package',    val:'₹30 LPA',             color:'#06b6d4' },
              ].map(s => (
                <div key={s.label} style={{ padding:'14px 16px', borderRadius:14, background:'var(--surface)', border:`1px solid ${s.color}25`, textAlign:'center' }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color, marginBottom:2 }}>{s.val}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Branch-wise table */}
            <div style={{ borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', marginBottom:24 }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:14, color:'var(--text)' }}>Branch-wise Breakdown</div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-2)' }}>
                    {['Branch','Total','Placed','Not Placed','%','Avg CGPA','Top Recruiter'].map(h => (
                      <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['CSE','IT','ECE','EEE','MECH','CIVIL'].map(branch => {
                    const all  = MOCK_STUDENTS.filter(s => s.branch === branch);
                    const pld  = all.filter(s => s.placed);
                    const pct  = all.length ? Math.round((pld.length/all.length)*100) : 0;
                    const avg  = all.length ? (all.reduce((s,a)=>s+a.cgpa,0)/all.length).toFixed(1) : '—';
                    const top  = pld[0]?.company || '—';
                    return (
                      <tr key={branch} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'10px 14px', fontWeight:700, color:'var(--text)', fontSize:13 }}>{branch}</td>
                        <td style={{ padding:'10px 14px', color:'var(--text-2)', fontSize:12.5 }}>{all.length}</td>
                        <td style={{ padding:'10px 14px', color:'#10b981', fontWeight:700, fontSize:12.5 }}>{pld.length}</td>
                        <td style={{ padding:'10px 14px', color:'#ef4444', fontSize:12.5 }}>{all.length - pld.length}</td>
                        <td style={{ padding:'10px 14px' }}>
                          <span style={{ fontSize:11.5, fontWeight:700, padding:'2px 9px', borderRadius:999, background:pct>=75?'rgba(16,185,129,0.1)':pct>=50?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.1)', color:pct>=75?'#10b981':pct>=50?'#f59e0b':'#ef4444' }}>{pct}%</span>
                        </td>
                        <td style={{ padding:'10px 14px', color:'var(--text-2)', fontSize:12.5 }}>{avg}</td>
                        <td style={{ padding:'10px 14px', color:'var(--text-2)', fontSize:12.5 }}>{top}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── COMPANIES ── */}
        {tab === 'companies' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Company Connect</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14, marginBottom:24 }}>
              {COMPANIES.map(c => (
                <div key={c.name} style={{ padding:'18px 18px', borderRadius:14, background:'var(--surface)', border:`1px solid ${c.color}25` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{ width:42, height:42, borderRadius:11, background:`${c.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:c.color }}>{c.name[0]}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{c.package}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--text-2)' }}>{c.hired} students hired</span>
                    <div style={{ height:8, width:80, borderRadius:999, background:'var(--border)', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.min((c.hired/6)*100,100)}%`, background:c.color, borderRadius:999 }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:'20px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:14 }}>📩 Invite a New Company</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Company Name</label>
                  <input className="inp" placeholder="e.g. Zoho Corp" style={{ fontSize:13 }}/>
                </div>
                <div>
                  <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>HR Email</label>
                  <input className="inp" type="email" placeholder="hr@company.com" style={{ fontSize:13 }}/>
                </div>
              </div>
              <button style={{ padding:'9px 20px', borderRadius:10, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                📨 Send Invitation
              </button>
            </div>
          </motion.div>
        )}

        {/* ── COURSES ── */}
        {tab === 'courses' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Course Analytics</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12, marginBottom:24 }}>
              {[{cat:'Web Dev',enrolled:312,completed:248,color:'#3b82f6'},{cat:'AI / ML',enrolled:287,completed:195,color:'#7c3aed'},{cat:'Data Science',enrolled:224,completed:167,color:'#f59e0b'},{cat:'Cybersecurity',enrolled:156,completed:98,color:'#ef4444'},{cat:'Cloud & DevOps',enrolled:134,completed:89,color:'#10b981'},{cat:'Mobile Dev',enrolled:98,completed:61,color:'#ec4899'}].map(c => (
                <div key={c.cat} style={{ padding:'16px', borderRadius:14, background:'var(--surface)', border:`1px solid ${c.color}25` }}>
                  <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:10 }}>{c.cat}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11.5, color:'var(--text-3)' }}>Enrolled</span>
                    <span style={{ fontSize:12.5, fontWeight:700, color:c.color }}>{c.enrolled}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11.5, color:'var(--text-3)' }}>Completed</span>
                    <span style={{ fontSize:12.5, fontWeight:700, color:'#10b981' }}>{c.completed}</span>
                  </div>
                  <div style={{ height:5, borderRadius:999, background:'var(--border)', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${Math.round((c.completed/c.enrolled)*100)}%`, background:c.color, borderRadius:999 }}/>
                  </div>
                  <div style={{ fontSize:10, color:'var(--text-3)', marginTop:4, textAlign:'right' }}>{Math.round((c.completed/c.enrolled)*100)}% completion</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ANNOUNCEMENTS ── */}
        {tab === 'announcements' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Announcements</h2>
            <div style={{ padding:'20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:8 }}>New Announcement for Students</label>
              <textarea className="inp" rows={4} value={newAnn} onChange={e=>setNewAnn(e.target.value)} placeholder="Write a campus announcement…" style={{ fontSize:13, resize:'none', marginBottom:12 }}/>
              {annMsg && <div style={{ padding:'10px 14px', borderRadius:9, background:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:13, fontWeight:600, marginBottom:12 }}>{annMsg}</div>}
              <button onClick={() => {
                if (!newAnn.trim()) return;
                const saved = JSON.parse(localStorage.getItem('nm_college_announcements')||'[]');
                saved.push({ msg:newAnn, date:new Date().toISOString(), college:(user as any).collegeName||'College' });
                localStorage.setItem('nm_college_announcements', JSON.stringify(saved));
                setNewAnn(''); setAnnMsg('✅ Announcement sent to all students');
                setTimeout(()=>setAnnMsg(''), 3000);
              }} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                <Bell size={14}/> Publish Announcement
              </button>
            </div>
            {(() => {
              const saved = JSON.parse(localStorage.getItem('nm_college_announcements')||'[]');
              if (!saved.length) return null;
              return saved.reverse().map((a:any, i:number) => (
                <div key={i} style={{ padding:'14px 18px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:10 }}>
                  <div style={{ fontSize:13.5, color:'var(--text)', marginBottom:5 }}>{a.msg}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)' }}>{a.college} · {new Date(a.date).toLocaleString('en-IN')}</div>
                </div>
              ));
            })()}
          </motion.div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>College Profile</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Update your institution details</p>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {savedMsg && <span style={{ fontSize:12.5, color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={14}/>{savedMsg}</span>}
                <button onClick={saveProfile} disabled={saving} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:10, background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  <Save size={14}/> {saving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { key:'collegeName',  label:'College Name',          placeholder:'Full official name' },
                { key:'affiliation',  label:'Affiliation / University',placeholder:'e.g. Anna University' },
                { key:'district',     label:'District',              placeholder:'e.g. Coimbatore' },
                { key:'naac',         label:'NAAC Grade',            placeholder:'e.g. A+' },
                { key:'website',      label:'College Website',       placeholder:'https://college.ac.in' },
                { key:'address',      label:'Address',               placeholder:'Full address' },
                { key:'tpoName',      label:'TPO Name',              placeholder:'Placement officer name' },
                { key:'tpoPhone',     label:'TPO Phone',             placeholder:'+91 XXXXX XXXXX' },
                { key:'tpoEmail',     label:'TPO Email',             placeholder:'tpo@college.ac.in' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input className="inp" value={pf[f.key]||''} onChange={e=>setPf(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Settings</h2>
            {[
              { label:'Show college in public directory',      desc:'Allow students and companies to find your college',  val:true },
              { label:'Email on new student registration',      desc:'Get notified when a new student joins via your link', val:true },
              { label:'Allow company direct contact',          desc:'Companies can email TPO directly from portal',        val:false },
              { label:'Show placement stats publicly',         desc:'Visible on college public profile page',             val:true },
            ].map(s => (
              <div key={s.label} style={{ padding:'16px 20px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)' }}>{s.desc}</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:999, background:s.val?'#10b981':'var(--border)', position:'relative', cursor:'pointer', flexShrink:0, transition:'background 0.3s' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:s.val?22:3, transition:'left 0.3s' }}/>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </main>
    </div>
  );
}
