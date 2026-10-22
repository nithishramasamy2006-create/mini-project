import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, Search, Trash2, LogOut,
  BarChart3, FileText, PlusCircle, Edit3, Eye, EyeOff, Save,
  CheckCircle, XCircle, AlertTriangle, Bell, Settings, Database,
  Building2, School, GraduationCap, Star, TrendingUp, Globe
} from 'lucide-react';
import { useAuth } from '../AuthContext';

type Tab = 'dashboard' | 'users' | 'applications' | 'content' | 'create-exam' | 'create-event' | 'create-course' | 'announcements' | 'settings';

const ROLE_COLOR: Record<string,string> = { student:'#7c3aed', company:'#3b82f6', college:'#10b981', admin:'#f59e0b' };
const ROLE_ICON:  Record<string,string> = { student:'🎓', company:'🏢', college:'🏫', admin:'🛡️' };

const api = (token: string|null) => (path: string, opts?: RequestInit) =>
  fetch(`http://localhost:5000/api/admin${path}`, {
    ...opts, headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}`, ...(opts?.headers||{}) },
  }).then(r => r.json());

// ── Reusable Form Field ────────────────────────────────────────────
const Field = ({ label, type='text', value, onChange, placeholder, required=false }: any) => (
  <div>
    <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>{label}{required&&<span style={{color:'#ef4444'}}> *</span>}</label>
    {type === 'textarea'
      ? <textarea className="inp" rows={4} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ fontSize:13, resize:'vertical' }}/>
      : <input className="inp" type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ fontSize:13 }}/>
    }
  </div>
);

// ── Create Exam Form ───────────────────────────────────────────────
function CreateExamForm({ onSuccess }: { onSuccess: ()=>void }) {
  const [f, setF] = useState({ title:'', shortTitle:'', category:'skill-assessment', mode:'online', organizer:'NaanMudhalvan', examDate:'', examTime:'', duration:'', price:'Free', difficulty:'Moderate', registrationDeadline:'', admitCardDate:'', resultDate:'', totalQuestions:'', totalMarks:'', negativeMarking:'0', languages:'English', description:'', eligibilityBranches:'', eligibilityYears:'', benefits:'' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!f.title || !f.examDate) { setMsg('Title and exam date are required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const saved = JSON.parse(localStorage.getItem('nm_admin_exams')||'[]');
    saved.push({ ...f, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('nm_admin_exams', JSON.stringify(saved));
    setMsg('✅ Exam created and saved!');
    setLoading(false);
    setTimeout(() => { setMsg(''); onSuccess(); }, 2000);
  };

  return (
    <div>
      <h2 className="font-display" style={{ fontWeight:700, fontSize:20, color:'var(--text)', marginBottom:6 }}>📝 Create New Exam</h2>
      <p style={{ fontSize:12.5, color:'var(--text-3)', marginBottom:24 }}>Add a new exam to the portal — it will appear on the Exams page immediately</p>
      {msg && <div style={{ padding:'10px 14px', borderRadius:9, background:msg.startsWith('✅')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color:msg.startsWith('✅')?'#10b981':'#ef4444', fontSize:13, fontWeight:600, marginBottom:16 }}>{msg}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}><Field label="Exam Title" required value={f.title} onChange={(v:string)=>setF(p=>({...p,title:v}))} placeholder="e.g. NM Skill Assessment — AI/ML 2025"/></div>
        <Field label="Short Title" value={f.shortTitle} onChange={(v:string)=>setF(p=>({...p,shortTitle:v}))} placeholder="e.g. NM-SAT AI/ML"/>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Category</label>
          <select className="inp" value={f.category} onChange={e=>setF(p=>({...p,category:e.target.value}))} style={{ fontSize:13 }}>
            {['skill-assessment','aptitude','technical','certification','government','competitive','language'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Mode</label>
          <select className="inp" value={f.mode} onChange={e=>setF(p=>({...p,mode:e.target.value}))} style={{ fontSize:13 }}>
            {['online','offline','hybrid'].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <Field label="Organizer" value={f.organizer} onChange={(v:string)=>setF(p=>({...p,organizer:v}))} placeholder="e.g. NaanMudhalvan"/>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Difficulty</label>
          <select className="inp" value={f.difficulty} onChange={e=>setF(p=>({...p,difficulty:e.target.value}))} style={{ fontSize:13 }}>
            {['Easy','Moderate','Hard','Expert'].map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <Field label="Exam Date" required type="date" value={f.examDate} onChange={(v:string)=>setF(p=>({...p,examDate:v}))} placeholder=""/>
        <Field label="Exam Time" value={f.examTime} onChange={(v:string)=>setF(p=>({...p,examTime:v}))} placeholder="e.g. 10:00 AM – 12:00 PM"/>
        <Field label="Duration" value={f.duration} onChange={(v:string)=>setF(p=>({...p,duration:v}))} placeholder="e.g. 120 Minutes"/>
        <Field label="Registration Deadline" type="date" value={f.registrationDeadline} onChange={(v:string)=>setF(p=>({...p,registrationDeadline:v}))} placeholder=""/>
        <Field label="Admit Card Date" type="date" value={f.admitCardDate} onChange={(v:string)=>setF(p=>({...p,admitCardDate:v}))} placeholder=""/>
        <Field label="Result Date" type="date" value={f.resultDate} onChange={(v:string)=>setF(p=>({...p,resultDate:v}))} placeholder=""/>
        <Field label="Total Questions" type="number" value={f.totalQuestions} onChange={(v:string)=>setF(p=>({...p,totalQuestions:v}))} placeholder="e.g. 100"/>
        <Field label="Total Marks" type="number" value={f.totalMarks} onChange={(v:string)=>setF(p=>({...p,totalMarks:v}))} placeholder="e.g. 100"/>
        <Field label="Negative Marking" value={f.negativeMarking} onChange={(v:string)=>setF(p=>({...p,negativeMarking:v}))} placeholder="0 or 0.25"/>
        <Field label="Price" value={f.price} onChange={(v:string)=>setF(p=>({...p,price:v}))} placeholder="Free or ₹199"/>
        <Field label="Languages" value={f.languages} onChange={(v:string)=>setF(p=>({...p,languages:v}))} placeholder="English, Tamil"/>
        <Field label="Eligible Branches (comma sep)" value={f.eligibilityBranches} onChange={(v:string)=>setF(p=>({...p,eligibilityBranches:v}))} placeholder="CSE, IT, ECE"/>
        <Field label="Eligible Years (comma sep)" value={f.eligibilityYears} onChange={(v:string)=>setF(p=>({...p,eligibilityYears:v}))} placeholder="2nd Year, 3rd Year, 4th Year"/>
        <div style={{ gridColumn:'1/-1' }}><Field label="Description" type="textarea" value={f.description} onChange={(v:string)=>setF(p=>({...p,description:v}))} placeholder="Describe the exam…"/></div>
        <div style={{ gridColumn:'1/-1' }}><Field label="Benefits (comma sep)" value={f.benefits} onChange={(v:string)=>setF(p=>({...p,benefits:v}))} placeholder="NM Badge, Priority project access, LinkedIn credential"/></div>
      </div>
      <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ marginTop:20, fontSize:14, fontWeight:700, padding:'12px 28px' }}>
        {loading ? '⏳ Creating…' : '✅ Create Exam'}
      </button>
    </div>
  );
}

// ── Create Event Form ──────────────────────────────────────────────
function CreateEventForm({ onSuccess }: { onSuccess: ()=>void }) {
  const [f, setF] = useState({ title:'', type:'hackathon', mode:'online', organizer:'', date:'', endDate:'', time:'', duration:'', location:'', price:'Free', seats:'', prize:'', registrationDeadline:'', description:'', skills:'', tags:'', featured:false });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!f.title || !f.date) { setMsg('Title and date are required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const saved = JSON.parse(localStorage.getItem('nm_admin_events')||'[]');
    saved.push({ ...f, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('nm_admin_events', JSON.stringify(saved));
    setMsg('✅ Event created successfully!');
    setLoading(false);
    setTimeout(() => { setMsg(''); onSuccess(); }, 2000);
  };

  return (
    <div>
      <h2 className="font-display" style={{ fontWeight:700, fontSize:20, color:'var(--text)', marginBottom:6 }}>🎯 Create New Event</h2>
      <p style={{ fontSize:12.5, color:'var(--text-3)', marginBottom:24 }}>Add a hackathon, workshop, webinar, or any event to the Events page</p>
      {msg && <div style={{ padding:'10px 14px', borderRadius:9, background:msg.startsWith('✅')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color:msg.startsWith('✅')?'#10b981':'#ef4444', fontSize:13, fontWeight:600, marginBottom:16 }}>{msg}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}><Field label="Event Title" required value={f.title} onChange={(v:string)=>setF(p=>({...p,title:v}))} placeholder="e.g. NM Hackathon 2025 — Build for Tamil Nadu"/></div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Event Type</label>
          <select className="inp" value={f.type} onChange={e=>setF(p=>({...p,type:e.target.value}))} style={{ fontSize:13 }}>
            {['hackathon','workshop','webinar','bootcamp','career-fair','competition','conference','guest-lecture'].map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Mode</label>
          <select className="inp" value={f.mode} onChange={e=>setF(p=>({...p,mode:e.target.value}))} style={{ fontSize:13 }}>
            {['online','offline','hybrid'].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <Field label="Organizer" value={f.organizer} onChange={(v:string)=>setF(p=>({...p,organizer:v}))} placeholder="Company or org name"/>
        <Field label="Event Date" required type="date" value={f.date} onChange={(v:string)=>setF(p=>({...p,date:v}))} placeholder=""/>
        <Field label="End Date" type="date" value={f.endDate} onChange={(v:string)=>setF(p=>({...p,endDate:v}))} placeholder=""/>
        <Field label="Time" value={f.time} onChange={(v:string)=>setF(p=>({...p,time:v}))} placeholder="e.g. 9:00 AM"/>
        <Field label="Duration" value={f.duration} onChange={(v:string)=>setF(p=>({...p,duration:v}))} placeholder="e.g. 2 Days / 3 Hours"/>
        <Field label="Location / Platform" value={f.location} onChange={(v:string)=>setF(p=>({...p,location:v}))} placeholder="Chennai / Zoom / Google Meet"/>
        <Field label="Price" value={f.price} onChange={(v:string)=>setF(p=>({...p,price:v}))} placeholder="Free or ₹299"/>
        <Field label="Total Seats" type="number" value={f.seats} onChange={(v:string)=>setF(p=>({...p,seats:v}))} placeholder="e.g. 500"/>
        <Field label="Prize / Reward" value={f.prize} onChange={(v:string)=>setF(p=>({...p,prize:v}))} placeholder="₹1 Lakh / Internship offer"/>
        <Field label="Registration Deadline" type="date" value={f.registrationDeadline} onChange={(v:string)=>setF(p=>({...p,registrationDeadline:v}))} placeholder=""/>
        <Field label="Skills (comma sep)" value={f.skills} onChange={(v:string)=>setF(p=>({...p,skills:v}))} placeholder="Python, React, Design"/>
        <div style={{ gridColumn:'1/-1' }}><Field label="Description" type="textarea" value={f.description} onChange={(v:string)=>setF(p=>({...p,description:v}))} placeholder="Describe the event…"/></div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--text-2)' }}>
            <input type="checkbox" checked={f.featured} onChange={e=>setF(p=>({...p,featured:e.target.checked}))} style={{ width:16, height:16 }}/>
            Feature this event (show in hero carousel)
          </label>
        </div>
      </div>
      <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ marginTop:20, fontSize:14, fontWeight:700, padding:'12px 28px', background:'linear-gradient(135deg,#f59e0b,#d97706)', borderColor:'#f59e0b' }}>
        {loading ? '⏳ Creating…' : '🎯 Create Event'}
      </button>
    </div>
  );
}

// ── Create Course Form ─────────────────────────────────────────────
function CreateCourseForm({ onSuccess }: { onSuccess: ()=>void }) {
  const [f, setF] = useState({ title:'', category:'web-dev', level:'Beginner', instructor:'', duration:'', hours:'', price:'Free', rating:'4.5', description:'', skills:'', language:'English', certificate:true });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!f.title || !f.instructor) { setMsg('Title and instructor are required.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const saved = JSON.parse(localStorage.getItem('nm_admin_courses')||'[]');
    saved.push({ ...f, id: Date.now(), createdAt: new Date().toISOString() });
    localStorage.setItem('nm_admin_courses', JSON.stringify(saved));
    setMsg('✅ Course created successfully!');
    setLoading(false);
    setTimeout(() => { setMsg(''); onSuccess(); }, 2000);
  };

  return (
    <div>
      <h2 className="font-display" style={{ fontWeight:700, fontSize:20, color:'var(--text)', marginBottom:6 }}>📚 Create New Course</h2>
      <p style={{ fontSize:12.5, color:'var(--text-3)', marginBottom:24 }}>Add a new course to the NaanMudhalvan course library</p>
      {msg && <div style={{ padding:'10px 14px', borderRadius:9, background:msg.startsWith('✅')?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.1)', color:msg.startsWith('✅')?'#10b981':'#ef4444', fontSize:13, fontWeight:600, marginBottom:16 }}>{msg}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div style={{ gridColumn:'1/-1' }}><Field label="Course Title" required value={f.title} onChange={(v:string)=>setF(p=>({...p,title:v}))} placeholder="e.g. Complete Python Bootcamp — From Beginner to Expert"/></div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Category</label>
          <select className="inp" value={f.category} onChange={e=>setF(p=>({...p,category:e.target.value}))} style={{ fontSize:13 }}>
            {['web-dev','data-science','ai-ml','mobile','devops','cybersecurity','design','blockchain'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:11.5, fontWeight:600, color:'var(--text-2)', display:'block', marginBottom:5 }}>Level</label>
          <select className="inp" value={f.level} onChange={e=>setF(p=>({...p,level:e.target.value}))} style={{ fontSize:13 }}>
            {['Beginner','Intermediate','Advanced','Expert'].map(l=><option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <Field label="Instructor Name" required value={f.instructor} onChange={(v:string)=>setF(p=>({...p,instructor:v}))} placeholder="e.g. Dr. Anand Kumar"/>
        <Field label="Duration" value={f.duration} onChange={(v:string)=>setF(p=>({...p,duration:v}))} placeholder="e.g. 8 Weeks"/>
        <Field label="Total Hours" type="number" value={f.hours} onChange={(v:string)=>setF(p=>({...p,hours:v}))} placeholder="e.g. 40"/>
        <Field label="Price" value={f.price} onChange={(v:string)=>setF(p=>({...p,price:v}))} placeholder="Free or ₹999"/>
        <Field label="Rating (1–5)" type="number" value={f.rating} onChange={(v:string)=>setF(p=>({...p,rating:v}))} placeholder="e.g. 4.7"/>
        <Field label="Language" value={f.language} onChange={(v:string)=>setF(p=>({...p,language:v}))} placeholder="English, Tamil"/>
        <Field label="Skills Covered (comma sep)" value={f.skills} onChange={(v:string)=>setF(p=>({...p,skills:v}))} placeholder="Python, Data Analysis, Visualization"/>
        <div style={{ gridColumn:'1/-1' }}><Field label="Description" type="textarea" value={f.description} onChange={(v:string)=>setF(p=>({...p,description:v}))} placeholder="Describe the course content…"/></div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, fontWeight:600, color:'var(--text-2)' }}>
            <input type="checkbox" checked={f.certificate} onChange={e=>setF(p=>({...p,certificate:e.target.checked}))} style={{ width:16, height:16 }}/>
            Award certificate on completion
          </label>
        </div>
      </div>
      <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ marginTop:20, fontSize:14, fontWeight:700, padding:'12px 28px', background:'linear-gradient(135deg,#10b981,#059669)', borderColor:'#10b981' }}>
        {loading ? '⏳ Creating…' : '📚 Create Course'}
      </button>
    </div>
  );
}

export default function AdminPortal() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const callApi  = api(token);

  const [tab,   setTab]   = useState<Tab>('dashboard');
  const [users, setUsers] = useState<any[]>([]);
  const [apps,  setApps]  = useState<any[]>([]);
  const [stats, setStats] = useState({ students:0, companies:0, colleges:0, admins:0, totalApplications:0, totalUsers:0 });
  const [roleF, setRoleF] = useState('all');
  const [q,     setQ]     = useState('');
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const [annMsg, setAnnMsg] = useState('');

  // Counts from admin-created content
  const adminExams   = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_admin_exams')||'[]'); } catch { return []; } }, [tab]);
  const adminEvents  = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_admin_events')||'[]'); } catch { return []; } }, [tab]);
  const adminCourses = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_admin_courses')||'[]'); } catch { return []; } }, [tab]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    const [dash, usersData, appsData] = await Promise.all([
      callApi('/dashboard').catch(()=>({success:false})),
      callApi('/users?limit=50').catch(()=>({success:false})),
      callApi('/applications?limit=50').catch(()=>({success:false})),
    ]);
    if (dash.success)      setStats(dash.stats);
    if (usersData.success) setUsers(usersData.users);
    if (appsData.success)  setApps(appsData.applications);
    setLoading(false);
  };

  const toggleUser = async (id: string) => {
    const res = await callApi(`/users/${id}/toggle`, { method:'PATCH' }).catch(()=>({success:false}));
    if (res.success) setUsers(prev => prev.map(u => u._id===id ? {...u, isActive:res.isActive} : u));
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Permanently delete this user?')) return;
    const res = await callApi(`/users/${id}`, { method:'DELETE' }).catch(()=>({success:false}));
    if (res.success) setUsers(prev => prev.filter(u => u._id!==id));
  };

  const filteredUsers = useMemo(() => users.filter(u => {
    if (roleF!=='all' && u.role!==roleF) return false;
    if (q && !u.name?.toLowerCase().includes(q.toLowerCase()) && !u.email?.toLowerCase().includes(q.toLowerCase()) &&
        !u.companyName?.toLowerCase().includes(q.toLowerCase()) && !u.collegeName?.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [users, roleF, q]);

  if (!user || user.role !== 'admin') return null;

  const NAV: {id:Tab;label:string;icon:React.ReactNode;group?:string}[] = [
    { id:'dashboard',      label:'Dashboard',       icon:<LayoutDashboard size={16}/> },
    { id:'users',          label:'User Management', icon:<Users size={16}/> },
    { id:'applications',   label:'Applications',    icon:<FileText size={16}/> },
    { id:'content',        label:'Content Library', icon:<Database size={16}/> },
    { id:'create-exam',    label:'Create Exam',     icon:<PlusCircle size={16}/> },
    { id:'create-event',   label:'Create Event',    icon:<PlusCircle size={16}/> },
    { id:'create-course',  label:'Create Course',   icon:<PlusCircle size={16}/> },
    { id:'announcements',  label:'Announcements',   icon:<Bell size={16}/> },
    { id:'settings',       label:'Settings',        icon:<Settings size={16}/> },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>
      {/* SIDEBAR */}
      <aside style={{ width:230, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'16px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:13, background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.2)', marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'#fff', flexShrink:0 }}>🛡️</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:10.5, color:'#f59e0b', fontWeight:600 }}>Admin • Full Access</div>
          </div>
        </div>

        {/* Section labels */}
        <div style={{ fontSize:9.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'0 12px', marginBottom:6 }}>Management</div>
        {NAV.slice(0,4).map(n => {
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?'#f59e0b':'var(--text-2)', background:active?'rgba(245,158,11,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?'3px solid #f59e0b':'3px solid transparent' }}>
              {n.icon} {n.label}
            </button>
          );
        })}

        <div style={{ fontSize:9.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 12px 6px', marginTop:4 }}>Create Content</div>
        {NAV.slice(4,7).map(n => {
          const active = tab === n.id;
          const colors: Record<string,string> = { 'create-exam':'#7c3aed', 'create-event':'#f59e0b', 'create-course':'#10b981' };
          const c = colors[n.id]||'var(--accent)';
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?c:'var(--text-2)', background:active?`${c}12`:'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?`3px solid ${c}`:'3px solid transparent' }}>
              {n.icon} {n.label}
            </button>
          );
        })}

        <div style={{ fontSize:9.5, fontWeight:800, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'12px 12px 6px', marginTop:4 }}>Other</div>
        {NAV.slice(7).map(n => {
          const active = tab === n.id;
          return (
            <button key={n.id} onClick={() => setTab(n.id)}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?'#f59e0b':'var(--text-2)', background:active?'rgba(245,158,11,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?'3px solid #f59e0b':'3px solid transparent' }}>
              {n.icon} {n.label}
            </button>
          );
        })}

        <button onClick={() => { logout(); navigate('/'); }}
          style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, fontWeight:500, color:'#ef4444', background:'none', border:'none', cursor:'pointer', marginTop:'auto', paddingTop:8 }}>
          <LogOut size={15}/> Sign Out
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, minWidth:0, padding:'28px 32px 60px', overflowY:'auto' }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <div style={{ marginBottom:24 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:26, color:'var(--text)', marginBottom:4 }}>Admin Dashboard 🛡️</h1>
              <p style={{ color:'var(--text-3)', fontSize:13.5 }}>Platform-wide overview — full control</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14, marginBottom:32 }}>
              {[
                { icon:ROLE_ICON.student,  label:'Students',     val:stats.students,  color:ROLE_COLOR.student },
                { icon:ROLE_ICON.company,  label:'Companies',    val:stats.companies, color:ROLE_COLOR.company },
                { icon:ROLE_ICON.college,  label:'Colleges',     val:stats.colleges,  color:ROLE_COLOR.college },
                { icon:'📋', label:'Total Applications', val:stats.totalApplications, color:'#06b6d4' },
                { icon:'📝', label:'Exams Created',  val:adminExams.length,   color:'#7c3aed' },
                { icon:'🎯', label:'Events Created',  val:adminEvents.length,  color:'#f59e0b' },
                { icon:'📚', label:'Courses Created', val:adminCourses.length, color:'#10b981' },
                { icon:ROLE_ICON.admin, label:'Admins', val:stats.admins, color:ROLE_COLOR.admin },
              ].map(s => (
                <div key={s.label} style={{ padding:'16px 18px', borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{s.icon}</div>
                  <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Create */}
            <h3 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:14 }}>Quick Create</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[{id:'create-exam' as Tab,label:'Create Exam',icon:'📝',color:'#7c3aed'},{id:'create-event' as Tab,label:'Create Event',icon:'🎯',color:'#f59e0b'},{id:'create-course' as Tab,label:'Create Course',icon:'📚',color:'#10b981'}].map(q => (
                <button key={q.id} onClick={() => setTab(q.id)}
                  style={{ padding:'18px', borderRadius:14, background:'var(--surface)', border:`1px solid ${q.color}25`, cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=q.color; (e.currentTarget as HTMLElement).style.background=`${q.color}08`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=`${q.color}25`; (e.currentTarget as HTMLElement).style.background='var(--surface)'; }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>{q.icon}</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{q.label}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:2 }}>Click to create →</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* USER MANAGEMENT */}
        {tab === 'users' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>User Management</h2>
            <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={14} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users by name or email…" style={{ paddingLeft:36, fontSize:13 }}/>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {['all','student','company','college','admin'].map(r => (
                  <button key={r} onClick={() => setRoleF(r)}
                    style={{ fontSize:11.5, fontWeight:700, padding:'7px 12px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${r==='all'?'var(--border)':(ROLE_COLOR[r]||'var(--border)')}`, background:roleF===r?(r==='all'?'rgba(124,58,237,0.1)':`${ROLE_COLOR[r]}18`):'transparent', color:roleF===r?(r==='all'?'var(--accent)':ROLE_COLOR[r]):'var(--text-2)', transition:'all 0.15s' }}>
                    {r==='all'?'All Roles':`${ROLE_ICON[r]||''} ${r.charAt(0).toUpperCase()+r.slice(1)}`}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div style={{ textAlign:'center', padding:60, color:'var(--text-3)' }}>Loading users…</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {filteredUsers.length === 0 ? (
                  <div style={{ textAlign:'center', padding:60 }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>👥</div>
                    <div style={{ fontSize:15, fontWeight:600, color:'var(--text-2)' }}>No users found</div>
                  </div>
                ) : filteredUsers.map(u => (
                  <div key={u._id} style={{ padding:'12px 16px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:`${ROLE_COLOR[u.role]||'#888'}18`, border:`1px solid ${ROLE_COLOR[u.role]||'#888'}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                      {ROLE_ICON[u.role]||'👤'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>
                        {u.name || u.companyName || u.collegeName}
                        <span style={{ fontSize:9.5, fontWeight:700, padding:'1px 7px', borderRadius:999, background:`${ROLE_COLOR[u.role]}18`, color:ROLE_COLOR[u.role] }}>{u.role}</span>
                        {!u.isActive && <span style={{ fontSize:9.5, fontWeight:700, padding:'1px 7px', borderRadius:999, background:'rgba(239,68,68,0.1)', color:'#ef4444' }}>Inactive</span>}
                      </div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{u.email}</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => toggleUser(u._id)} title={u.isActive?'Deactivate':'Activate'}
                        style={{ padding:'6px 10px', borderRadius:8, background:u.isActive?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)', border:'none', color:u.isActive?'#ef4444':'#10b981', cursor:'pointer', fontSize:12, fontWeight:700 }}>
                        {u.isActive ? <EyeOff size={13}/> : <Eye size={13}/>}
                      </button>
                      <button onClick={() => deleteUser(u._id)} title="Delete"
                        style={{ padding:'6px 10px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'none', color:'#ef4444', cursor:'pointer' }}>
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
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>All Applications</h2>
            {loading ? (
              <div style={{ textAlign:'center', padding:60, color:'var(--text-3)' }}>Loading…</div>
            ) : apps.length === 0 ? (
              <div style={{ textAlign:'center', padding:60 }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--text-2)' }}>No applications yet</div>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {apps.map(a => (
                  <div key={a._id} style={{ padding:'12px 16px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)' }}>{a.userName}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{a.itemTitle} · {a.itemCompany}</div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:`rgba(124,58,237,0.1)`, color:'var(--accent)' }}>{a.type}</span>
                    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:999, background:`${STATUS_COLOR[a.status]||'#888'}18`, color:STATUS_COLOR[a.status]||'#888' }}>{a.status}</span>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* CONTENT LIBRARY */}
        {tab === 'content' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Content Library</h2>
            {[{ title:'Admin Created Exams', items:adminExams, key:'nm_admin_exams', icon:'📝', color:'#7c3aed', createTab:'create-exam' as Tab },
              { title:'Admin Created Events', items:adminEvents, key:'nm_admin_events', icon:'🎯', color:'#f59e0b', createTab:'create-event' as Tab },
              { title:'Admin Created Courses', items:adminCourses, key:'nm_admin_courses', icon:'📚', color:'#10b981', createTab:'create-course' as Tab }
            ].map(section => (
              <div key={section.title} style={{ marginBottom:32 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <h3 style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>{section.icon} {section.title} ({section.items.length})</h3>
                  <button onClick={() => setTab(section.createTab)} style={{ fontSize:12, fontWeight:700, color:section.color, background:`${section.color}12`, border:`1px solid ${section.color}25`, padding:'5px 12px', borderRadius:999, cursor:'pointer' }}>
                    + Add New
                  </button>
                </div>
                {section.items.length === 0 ? (
                  <div style={{ padding:'20px', borderRadius:12, background:'var(--surface)', border:'1px solid var(--border)', textAlign:'center', color:'var(--text-3)', fontSize:13 }}>
                    No {section.title.toLowerCase()} yet. <button onClick={() => setTab(section.createTab)} style={{ color:section.color, background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Create one →</button>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {section.items.map((item: any) => (
                      <div key={item.id} style={{ padding:'12px 16px', borderRadius:12, background:'var(--surface)', border:`1px solid ${section.color}20`, display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)' }}>{item.title}</div>
                          <div style={{ fontSize:11.5, color:'var(--text-3)' }}>Created {new Date(item.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                        <button onClick={() => {
                          const saved = JSON.parse(localStorage.getItem(section.key)||'[]').filter((i:any)=>i.id!==item.id);
                          localStorage.setItem(section.key, JSON.stringify(saved));
                          loadAll();
                        }} style={{ padding:'6px 8px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'none', color:'#ef4444', cursor:'pointer' }}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* CREATE FORMS */}
        {tab === 'create-exam' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <CreateExamForm onSuccess={() => setTab('content')}/>
          </motion.div>
        )}
        {tab === 'create-event' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <CreateEventForm onSuccess={() => setTab('content')}/>
          </motion.div>
        )}
        {tab === 'create-course' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <CreateCourseForm onSuccess={() => setTab('content')}/>
          </motion.div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab === 'announcements' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Platform Announcements</h2>
            <div style={{ padding:'20px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)' }}>
              <label style={{ fontSize:12.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:8 }}>New Announcement</label>
              <textarea className="inp" rows={4} value={announcement} onChange={e=>setAnnouncement(e.target.value)} placeholder="Write an announcement for all students…" style={{ fontSize:13, resize:'none', marginBottom:12 }}/>
              {annMsg && <div style={{ padding:'10px 14px', borderRadius:9, background:'rgba(16,185,129,0.1)', color:'#10b981', fontSize:13, fontWeight:600, marginBottom:12 }}>{annMsg}</div>}
              <button className="btn btn-primary" onClick={() => {
                if (!announcement.trim()) return;
                const saved = JSON.parse(localStorage.getItem('nm_announcements')||'[]');
                saved.push({ msg:announcement, date: new Date().toISOString() });
                localStorage.setItem('nm_announcements', JSON.stringify(saved));
                setAnnouncement('');
                setAnnMsg('✅ Announcement published to all users');
                setTimeout(()=>setAnnMsg(''),3000);
              }} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13 }}>
                <Bell size={14}/> Publish Announcement
              </button>
              {(() => {
                const saved = JSON.parse(localStorage.getItem('nm_announcements')||'[]');
                if (saved.length === 0) return null;
                return (
                  <div style={{ marginTop:24 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>Past Announcements</p>
                    {saved.reverse().map((a:any, i:number) => (
                      <div key={i} style={{ padding:'10px 14px', borderRadius:10, background:'var(--bg-2)', border:'1px solid var(--border)', marginBottom:8 }}>
                        <div style={{ fontSize:13, color:'var(--text)', marginBottom:4 }}>{a.msg}</div>
                        <div style={{ fontSize:10.5, color:'var(--text-3)' }}>{new Date(a.date).toLocaleString('en-IN')}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
            <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:20 }}>Platform Settings</h2>
            {[{ title:'Registration', desc:'Allow new student/company/college registrations', val:true },
              { title:'Maintenance Mode', desc:'Show maintenance page to all non-admin users', val:false },
              { title:'Email Notifications', desc:'Send automated emails on application updates', val:true },
              { title:'Leaderboard Visibility', desc:'Make leaderboard visible to all users', val:true },
              { title:'Certificate Verification', desc:'Enable public certificate verification page', val:true },
            ].map(s => (
              <div key={s.title} style={{ padding:'16px 20px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:10, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>{s.title}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)' }}>{s.desc}</div>
                </div>
                <div style={{ width:44, height:24, borderRadius:999, background:s.val?'#7c3aed':'var(--border)', position:'relative', cursor:'pointer', flexShrink:0, transition:'background 0.3s' }}>
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
