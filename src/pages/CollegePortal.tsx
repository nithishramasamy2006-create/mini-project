import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, Building2, LogOut,
  Search, Download, Save, Bell, Settings, CheckCircle, Trash2
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import ContentManager from '../components/ContentManager';
import ApplicationAcceptancePanel from '../components/ApplicationAcceptancePanel';
import CertificateIssuer from '../components/CertificateIssuer';
import { portalGetByAuthor } from '../portalData';
import { portalAppGetByAuthor } from '../portalApplications';

type Tab = 'dashboard' | 'students' | 'placements' | 'companies' | 'events' | 'exams' | 'registrations' | 'announcements' | 'certificates' | 'profile' | 'settings';

// ── Mock students ─────────────────────────────────────────────────
const MOCK_STUDENTS = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: ['Arun Kumar','Priya Selvi','Karthik Raja','Divya Lakshmi','Siva Prasad','Meena Kumari','Vijay Anand','Deepa Devi','Ravi Shankar','Anitha Krishnan','Muthu Pandian','Saranya Devi','Tamil Selvan','Kavitha Nair','Bala Krishna','Nandini Raj'][i % 16] + ` ${i + 1}`,
  branch: ['CSE','IT','ECE','EEE','MECH','CIVIL'][i % 6],
  year:   ['3rd Year','4th Year','2nd Year','PG 1st Year'][i % 4],
  cgpa:   parseFloat((6.5 + Math.random() * 3.5).toFixed(1)),
  placed: i % 3 !== 0,
  company:['TCS','Infosys','Zoho','Freshworks','Wipro','HCL','Cognizant','Amazon','Flipkart','Razorpay'][i % 10],
  stipend:['₹18,000','₹20,000','₹25,000','₹15,000','₹30,000','₹22,000'][i % 6],
  email:  `student${i + 1}@college.edu`,
}));

const COMPANIES = [
  { name:'TCS',        hired:6, color:'#1a56db', pkg:'₹7–9 LPA' },
  { name:'Zoho',       hired:5, color:'#e42527', pkg:'₹8–12 LPA' },
  { name:'Infosys',    hired:4, color:'#007cc3', pkg:'₹6–8 LPA' },
  { name:'Freshworks', hired:4, color:'#29b5e8', pkg:'₹10–15 LPA' },
  { name:'Amazon',     hired:3, color:'#ff9900', pkg:'₹18–28 LPA' },
  { name:'Wipro',      hired:3, color:'#7b2d8b', pkg:'₹7–10 LPA' },
];

function Stat({ icon, label, value, color }: any) {
  return (
    <div style={{ padding:'15px 17px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color, lineHeight:1, marginBottom:3 }}>{value}</div>
      <div style={{ fontSize:18, opacity:0.6 }}>{icon}</div>
    </div>
  );
}

export default function CollegePortal() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab,      setTab]     = useState<Tab>('dashboard');
  const [q,        setQ]       = useState('');
  const [branchF,  setBranchF] = useState('all');
  const [yearF,    setYearF]   = useState('all');
  const [placedF,  setPlacedF] = useState('all');
  const [saving,   setSaving]  = useState(false);
  const [savedMsg, setSavedMsg]= useState('');
  const [newAnn,   setNewAnn]  = useState('');
  const [annMsg,   setAnnMsg]  = useState('');
  const [pf,       setPf]      = useState<Record<string,any>>({});

  // College identifier for content scoping
  const collegeId = ((user as any)?.collegeName || user?.email || 'college').toLowerCase().replace(/\s+/g,'_');
  const myEvents  = useMemo(() => portalGetByAuthor('event', collegeId).length, [tab]);
  const myExams   = useMemo(() => portalGetByAuthor('exam', collegeId).length, [tab]);

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
    });
  }, [user]);

  if (!user || user.role !== 'college') return null;

  const placed    = MOCK_STUDENTS.filter(s => s.placed).length;
  const notPlaced = MOCK_STUDENTS.length - placed;
  const placePct  = Math.round((placed / MOCK_STUDENTS.length) * 100);
  const avgCgpa   = (MOCK_STUDENTS.reduce((s, a) => s + a.cgpa, 0) / MOCK_STUDENTS.length).toFixed(1);

  const filtered = useMemo(() => MOCK_STUDENTS.filter(s => {
    if (branchF !== 'all' && s.branch !== branchF) return false;
    if (yearF   !== 'all' && s.year   !== yearF)   return false;
    if (placedF === 'placed'    && !s.placed)       return false;
    if (placedF === 'notplaced' &&  s.placed)       return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.branch.toLowerCase().includes(q.toLowerCase()) && !s.company.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, branchF, yearF, placedF]);

  const exportCSV = () => {
    const rows = ['Name,Branch,Year,CGPA,Placed,Company,Stipend',
      ...filtered.map(s => `${s.name},${s.branch},${s.year},${s.cgpa},${s.placed?'Yes':'No'},${s.placed?s.company:'—'},${s.placed?s.stipend:'—'}`)
    ].join('\n');
    const blob = new Blob([rows], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href:url, download:'student_report.csv' });
    a.click(); URL.revokeObjectURL(url);
  };

  const saveProfile = async () => {
    setSaving(true);
    const res = await updateUser(pf);
    setSavedMsg(res.message);
    setSaving(false);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const eventRegistrations = portalAppGetByAuthor(collegeId);

  const NAV: { id:Tab; label:string; icon:string; count?:number }[] = [
    { id:'dashboard',     label:'Dashboard',         icon:'⬛' },
    { id:'students',      label:'Students',          icon:'👥', count:filtered.length },
    { id:'placements',    label:'Placement Report',  icon:'📊' },
    { id:'companies',     label:'Company Connect',   icon:'🏢' },
    { id:'events',        label:'College Events',    icon:'🎪', count:myEvents },
    { id:'exams',         label:'College Exams',     icon:'📝', count:myExams },
    { id:'registrations', label:'Registrations',     icon:'📋', count:eventRegistrations.filter(r=>r.status==='registered').length },
    { id:'announcements', label:'Announcements',     icon:'📣' },
    { id:'certificates',  label:'Issue Certificate', icon:'🏅' },
    { id:'profile',       label:'College Profile',   icon:'🏫' },
    { id:'settings',      label:'Settings',          icon:'⚙️' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>

      {/* SIDEBAR */}
      <aside style={{ width:224, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'14px 8px' }}>
        <div style={{ padding:'10px 12px', borderRadius:11, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.18)', marginBottom:18, display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:14, flexShrink:0 }}>
            {((user as any).collegeName||user.name||'U')[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(user as any).collegeName || user.name}</div>
            <div style={{ fontSize:10, color:'#10b981', fontWeight:700 }}>TPO PORTAL</div>
          </div>
        </div>

        <nav style={{ flex:1 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:tab===n.id?700:500, color:tab===n.id?'#10b981':'var(--text-2)', background:tab===n.id?'rgba(16,185,129,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft:tab===n.id?'3px solid #10b981':'3px solid transparent', transition:'all 0.15s' }}>
              <span style={{ fontSize:13 }}>{n.icon}</span> {n.label}
              {!!n.count && n.count > 0 && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, background:'rgba(16,185,129,0.15)', color:'#10b981', borderRadius:999, padding:'1px 7px' }}>{n.count}</span>}
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
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:4 }}>College Dashboard</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:24 }}>{(user as any).collegeName || 'Your College'} · Training & Placement Office</p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:12, marginBottom:28 }}>
              <Stat icon="👥" label="Total Students"    value={MOCK_STUDENTS.length} color="#7c3aed"/>
              <Stat icon="✓"  label="Placed"            value={`${placed} (${placePct}%)`} color="#10b981"/>
              <Stat icon="○"  label="Not Yet Placed"    value={notPlaced} color="#f59e0b"/>
              <Stat icon="∑"  label="Average CGPA"      value={avgCgpa} color="#3b82f6"/>
              <Stat icon="🏢" label="Partner Companies" value={COMPANIES.length} color="#06b6d4"/>
              <Stat icon="🎪" label="College Events"    value={myEvents} color="#ec4899"/>
              <Stat icon="📝" label="College Exams"     value={myExams} color="#8b5cf6"/>
            </div>

            {/* Branch-wise placement bars */}
            <div style={{ padding:'18px 20px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
              <h3 style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:16 }}>Branch-wise Placement Rate</h3>
              {['CSE','IT','ECE','EEE','MECH','CIVIL'].map(branch => {
                const all = MOCK_STUDENTS.filter(s => s.branch === branch);
                const pld = all.filter(s => s.placed);
                const pct = all.length ? Math.round((pld.length/all.length)*100) : 0;
                return (
                  <div key={branch} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:12.5, fontWeight:600, color:'var(--text-2)' }}>{branch}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:pct>=75?'#10b981':pct>=50?'#f59e0b':'#ef4444' }}>{pld.length}/{all.length} · {pct}%</span>
                    </div>
                    <div style={{ height:7, borderRadius:999, background:'var(--border)' }}>
                      <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, ease:'easeOut' }}
                        style={{ height:'100%', borderRadius:999, background:pct>=75?'#10b981':pct>=50?'#f59e0b':'#ef4444' }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STUDENTS */}
        {tab === 'students' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Students ({filtered.length})</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Monitor all enrolled students</p>
              </div>
              <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 15px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                <Download size={13}/> Export CSV
              </button>
            </div>

            <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, branch, company…" style={{ paddingLeft:34, fontSize:13 }}/>
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

            <div style={{ borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-2)' }}>
                    {['Student','Branch','Year','CGPA','Status','Company','Stipend'].map(h => (
                      <th key={h} style={{ padding:'10px 13px', textAlign:'left', fontSize:10.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom:'1px solid var(--border)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(16,185,129,0.03)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=''}>
                      <td style={{ padding:'10px 13px' }}>
                        <div style={{ fontWeight:700, fontSize:13, color:'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-3)' }}>{s.email}</div>
                      </td>
                      <td style={{ padding:'10px 13px', fontSize:12.5, fontWeight:600, color:'var(--text-2)' }}>{s.branch}</td>
                      <td style={{ padding:'10px 13px', fontSize:12, color:'var(--text-3)' }}>{s.year}</td>
                      <td style={{ padding:'10px 13px' }}>
                        <span style={{ fontSize:12.5, fontWeight:700, color:s.cgpa>=8?'#10b981':s.cgpa>=6.5?'#f59e0b':'#ef4444' }}>{s.cgpa}</span>
                      </td>
                      <td style={{ padding:'10px 13px' }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999, background:s.placed?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.08)', color:s.placed?'#10b981':'#ef4444' }}>
                          {s.placed ? '✓ Placed' : '○ Seeking'}
                        </span>
                      </td>
                      <td style={{ padding:'10px 13px', fontSize:12.5, color:'var(--text-2)', fontWeight:600 }}>{s.placed ? s.company : '—'}</td>
                      <td style={{ padding:'10px 13px', fontSize:12.5, color:s.placed?'#10b981':'var(--text-3)', fontWeight:s.placed?700:400 }}>{s.placed ? s.stipend : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PLACEMENTS */}
        {tab === 'placements' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Placement Report</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>NAAC / NBA statistics</p>
              </div>
              <button onClick={exportCSV} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 15px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                <Download size={13}/> Download Report
              </button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10, marginBottom:24 }}>
              {[{l:'Total',v:MOCK_STUDENTS.length,c:'#7c3aed'},{l:'Placed',v:`${placed} (${placePct}%)`,c:'#10b981'},{l:'Not Placed',v:notPlaced,c:'#f59e0b'},{l:'Avg CGPA',v:avgCgpa,c:'#3b82f6'},{l:'Highest Pkg',v:'₹30 LPA',c:'#ec4899'},{l:'Avg Stipend',v:'₹21,500',c:'#06b6d4'}].map(s => (
                <div key={s.l} style={{ padding:'13px 15px', borderRadius:12, background:'var(--surface)', border:`1px solid ${s.c}20`, textAlign:'center' }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:11, color:'var(--text-3)', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden' }}>
              <div style={{ padding:'13px 16px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:14, color:'var(--text)' }}>Branch-wise Breakdown</div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--bg-2)' }}>
                    {['Branch','Total','Placed','Not Placed','Rate','Avg CGPA','Top Recruiter'].map(h => (
                      <th key={h} style={{ padding:'9px 13px', textAlign:'left', fontSize:10.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['CSE','IT','ECE','EEE','MECH','CIVIL'].map(br => {
                    const all = MOCK_STUDENTS.filter(s=>s.branch===br);
                    const pld = all.filter(s=>s.placed);
                    const pct = all.length?Math.round((pld.length/all.length)*100):0;
                    const avg = all.length?(all.reduce((s,a)=>s+a.cgpa,0)/all.length).toFixed(1):'—';
                    return (
                      <tr key={br} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'10px 13px', fontWeight:700, color:'var(--text)', fontSize:13 }}>{br}</td>
                        <td style={{ padding:'10px 13px', color:'var(--text-2)', fontSize:12.5 }}>{all.length}</td>
                        <td style={{ padding:'10px 13px', color:'#10b981', fontWeight:700, fontSize:12.5 }}>{pld.length}</td>
                        <td style={{ padding:'10px 13px', color:'#ef4444', fontSize:12.5 }}>{all.length-pld.length}</td>
                        <td style={{ padding:'10px 13px' }}>
                          <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:999, background:pct>=75?'rgba(16,185,129,0.1)':pct>=50?'rgba(245,158,11,0.1)':'rgba(239,68,68,0.08)', color:pct>=75?'#10b981':pct>=50?'#f59e0b':'#ef4444' }}>{pct}%</span>
                        </td>
                        <td style={{ padding:'10px 13px', color:'var(--text-2)', fontSize:12.5 }}>{avg}</td>
                        <td style={{ padding:'10px 13px', color:'var(--text-2)', fontSize:12.5 }}>{pld[0]?.company||'—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* COMPANIES */}
        {tab === 'companies' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Company Connect</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
              {COMPANIES.map(c => (
                <div key={c.name} style={{ padding:'13px 16px', borderRadius:12, background:'var(--surface)', border:`1px solid ${c.color}20`, display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`${c.color}14`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, color:c.color, flexShrink:0 }}>{c.name[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{c.name}</div>
                    <div style={{ fontSize:12, color:'var(--text-3)' }}>Package: {c.pkg}</div>
                  </div>
                  <span style={{ fontSize:12.5, fontWeight:700, color:c.color }}>{c.hired} students hired</span>
                  <div style={{ width:80, height:7, borderRadius:999, background:'var(--border)' }}>
                    <div style={{ height:'100%', width:`${Math.min((c.hired/6)*100,100)}%`, background:c.color, borderRadius:999 }}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding:'18px 20px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)' }}>
              <h3 style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:14 }}>Invite a Company</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>Company Name</label>
                  <input className="inp" placeholder="e.g. Zoho Corp" style={{ fontSize:13 }}/>
                </div>
                <div>
                  <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>HR Email</label>
                  <input className="inp" type="email" placeholder="hr@company.com" style={{ fontSize:13 }}/>
                </div>
              </div>
              <button style={{ padding:'9px 18px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                Send Invitation
              </button>
            </div>
          </motion.div>
        )}

        {/* COLLEGE EVENTS — Creator & Editor */}
        {tab === 'events' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>College Events — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
              Create, edit, and delete college events. Students register via <strong>/events</strong> — registrations appear in your <strong>Registrations</strong> tab.
            </p>
            <ContentManager type="event" author={collegeId} accentColor="#10b981" />
          </motion.div>
        )}

        {/* COLLEGE EXAMS — Creator & Editor */}
        {tab === 'exams' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>College Exams & Assessments — Creator & Editor</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
              Create, schedule, edit, and publish campus tests, semester assessments, and certification exams. Students register via <strong>/exams</strong> — registrations appear in your <strong>Registrations</strong> tab.
            </p>
            <ContentManager type="exam" author={collegeId} accentColor="#8b5cf6" />
          </motion.div>
        )}

        {/* EVENT & EXAM REGISTRATIONS */}
        {tab === 'registrations' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Event & Exam Registrations</h2>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:24 }}>
              <strong style={{ color:'#10b981' }}>Confirm</strong> or <strong style={{ color:'#ef4444' }}>cancel</strong> student registrations for your college events and exams
            </p>
            <ApplicationAcceptancePanel
              authorId={collegeId}
              accentColor="#8b5cf6"
              emptyMessage="No registrations yet"
              emptyAction={{ label:'Create an Exam or Event', onClick:() => setTab('exams') }}
            />
          </motion.div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === 'announcements' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Announcements</h2>
            <div style={{ padding:'18px 20px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:20 }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:8 }}>New Announcement for Students</label>
              <textarea className="inp" rows={4} value={newAnn} onChange={e=>setNewAnn(e.target.value)} placeholder="Write a campus announcement…" style={{ fontSize:13, resize:'none', marginBottom:12 }}/>
              {annMsg && <div style={{ padding:'8px 12px', borderRadius:8, background:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:13, fontWeight:600, marginBottom:12 }}>{annMsg}</div>}
              <button onClick={() => {
                if (!newAnn.trim()) return;
                const all = JSON.parse(localStorage.getItem('nm_college_announcements')||'[]');
                all.unshift({ msg:newAnn, date:new Date().toISOString(), college:(user as any).collegeName||'College' });
                localStorage.setItem('nm_college_announcements', JSON.stringify(all));
                setNewAnn(''); setAnnMsg('✅ Announcement published');
                setTimeout(()=>setAnnMsg(''), 3000);
              }} style={{ padding:'9px 18px', borderRadius:10, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', color:'#10b981', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                <Bell size={13}/> Publish
              </button>
            </div>
            {(() => {
              const all = JSON.parse(localStorage.getItem('nm_college_announcements')||'[]');
              if (!all.length) return <div style={{ textAlign:'center', padding:40, color:'var(--text-3)', fontSize:13 }}>No announcements yet</div>;
              return all.map((a:any, i:number) => (
                <div key={i} style={{ padding:'12px 15px', borderRadius:11, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:7, display:'flex', gap:11 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, color:'var(--text)', marginBottom:4 }}>{a.msg}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{a.college} · {new Date(a.date).toLocaleString('en-IN')}</div>
                  </div>
                  <button onClick={() => {
                    const updated = all.filter((_:any, j:number) => j!==i);
                    localStorage.setItem('nm_college_announcements', JSON.stringify(updated));
                    setAnnMsg('');
                  }} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', padding:'4px' }}><Trash2 size={13}/></button>
                </div>
              ));
            })()}
          </motion.div>
        )}

        {/* ISSUE CERTIFICATE */}
        {tab === 'certificates' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <CertificateIssuer
              issuerName={(user as any).collegeName || user.name || 'Your College'}
              issuerType="college"
            />
          </motion.div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>College Profile</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Update institution and TPO details</p>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {savedMsg && <span style={{ fontSize:12.5, color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={13}/>{savedMsg}</span>}
                <button onClick={saveProfile} disabled={saving}
                  style={{ padding:'8px 18px', borderRadius:10, background:'#10b981', border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                  <Save size={13}/> {saving?'Saving…':'Save Profile'}
                </button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                { key:'collegeName',  label:'College Name',           placeholder:'Official college name' },
                { key:'affiliation',  label:'Affiliation / University', placeholder:'e.g. Anna University' },
                { key:'district',     label:'District',               placeholder:'e.g. Coimbatore' },
                { key:'naac',         label:'NAAC Grade',             placeholder:'e.g. A+' },
                { key:'website',      label:'Website',                placeholder:'https://college.ac.in' },
                { key:'tpoName',      label:'TPO Name',               placeholder:'Placement officer name' },
                { key:'tpoPhone',     label:'TPO Phone',              placeholder:'+91 XXXXX XXXXX' },
                { key:'tpoEmail',     label:'TPO Email',              placeholder:'tpo@college.ac.in' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                  <input className="inp" value={pf[f.key]||''} onChange={e=>setPf(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Settings</h2>
            {[
              { label:'Show in public college directory',    desc:'Allow students/companies to discover your college', on:true },
              { label:'Email on new student registration',  desc:'Notify TPO when a student registers via college link', on:true },
              { label:'Allow company direct contact',       desc:'Companies can email TPO directly from portal', on:false },
              { label:'Show placement stats publicly',      desc:'Visible on public college profile', on:true },
              { label:'Student data export for companies',  desc:'Allow companies to download shortlisted student data', on:false },
            ].map((s, i) => (
              <div key={i} style={{ padding:'14px 18px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)' }}>{s.desc}</div>
                </div>
                <div style={{ width:42, height:23, borderRadius:999, background:s.on?'#10b981':'var(--border)', position:'relative', cursor:'pointer', flexShrink:0 }}>
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
