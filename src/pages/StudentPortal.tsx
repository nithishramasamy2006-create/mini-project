import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BookOpen, Award, User,
  LogOut, TrendingUp, Clock, CheckCircle, XCircle,
  Star, Briefcase, GraduationCap,
  Phone, Mail, School, Calendar, Link2,
  Heart, MessageSquare, HelpCircle, Send, Trash2, Home, Save
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ALL_COURSES } from '../courseData';

type Tab = 'dashboard' | 'applications' | 'courses' | 'certificates' | 'profile' | 'wishlist' | 'reviews' | 'qa';

const STATUS_COLOR: Record<string, string> = {
  pending:'#f59e0b', reviewed:'#3b82f6', shortlisted:'#7c3aed',
  interview:'#06b6d4', hired:'#10b981', rejected:'#ef4444', accepted:'#10b981',
};
const STATUS_ICON: Record<string, string> = {
  pending:'⏳', reviewed:'👁️', shortlisted:'⭐', interview:'🎙️', hired:'✅', accepted:'✅', rejected:'❌',
};

export default function StudentPortal() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab,  setTab]  = useState<Tab>('dashboard');
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Profile edit state
  const [profileForm, setProfileForm] = useState<Record<string, any>>({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg,    setProfileMsg]    = useState('');

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/login'); return; }
    fetch('http://localhost:5000/api/applications/my', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => { if (d.success) setApps(d.applications); }).finally(() => setLoading(false));
  }, [user]);

  // Sync profile form whenever user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        phone:    user.phone    || '',
        college:  user.college  || '',
        year:     user.year     || '',
        branch:   user.branch   || '',
        skills:   (user.skills || []).join(', '),
        linkedIn: user.linkedIn || '',
        github:   user.github   || '',
        resume:   user.resume   || '',
        bio:      (user as any).bio || '',
      });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg('');
    const fields = {
      ...profileForm,
      skills: profileForm.skills ? profileForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };
    const result = await updateUser(fields);
    setProfileMsg(result.message);
    setProfileSaving(false);
    setTimeout(() => setProfileMsg(''), 3000);
  };

  if (!user || user.role !== 'student') return null;

  const pending    = apps.filter(a => a.status === 'pending').length;
  const shortlisted= apps.filter(a => ['shortlisted','interview'].includes(a.status)).length;
  const hired      = apps.filter(a => ['hired','accepted'].includes(a.status)).length;

  const NAV: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id:'dashboard',    label:'My Dashboard',    icon:<Home size={16}/> },
    { id:'profile',      label:'My Profile',      icon:<User size={16}/> },
    { id:'courses',      label:'My Courses',      icon:<BookOpen size={16}/> },
    { id:'wishlist',     label:'Wishlist',        icon:<Heart size={16}/> },
    { id:'reviews',      label:'Reviews',         icon:<Star size={16}/> },
    { id:'qa',           label:'Q & A',           icon:<HelpCircle size={16}/> },
    { id:'applications', label:'Applications',    icon:<FileText size={16}/> },
    { id:'certificates', label:'Certificates',    icon:<Award size={16}/> },
  ];

  // ── Enrolled courses — pulled from ALL_COURSES by ID ──────
  // Course applications that were accepted map to real courseData entries.
  // For demo we pre-pick 3 well-known IDs (101=FullStack, 102=Python, 124=DB)
  const enrolledIds = [
    ...apps.filter(a => a.type === 'course' && ['hired','accepted'].includes(a.status)).map((a: any) => a.itemId),
    101, 102, 104,  // always show these as demo enrolled courses
  ];
  const ENROLLED = [...new Set(enrolledIds)]
    .map(id => ALL_COURSES.find(c => c.id === id))
    .filter(Boolean)
    .slice(0, 6)
    .map((c, i) => ({
      id: c!.id,
      title: c!.title,
      progress: [72, 45, 90, 30, 60, 15][i] ?? 20,
      color: ['#7c3aed','#3b82f6','#10b981','#f59e0b','#06b6d4','#ec4899'][i] ?? '#7c3aed',
      cat: c!.subcategory,
      hours: c!.hours,
      instructor: c!.instructor,
    }));

  return (
    <div style={{ minHeight:'100vh', paddingTop:60, background:'var(--bg)', display:'flex' }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside style={{ width:236, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', background:'var(--surface)', borderRight:'1px solid var(--border)', padding:'20px 10px', display:'flex', flexDirection:'column' }}>
        {/* Student badge */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:14, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.18)', marginBottom:24 }}>
          <div style={{ width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:17,color:'#fff',flexShrink:0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:10.5, color:'#7c3aed', fontWeight:700 }}>STUDENT PORTAL</div>
          </div>
        </div>

        <nav style={{ flex:1 }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 14px', borderRadius:11, marginBottom:3, fontSize:13.5, fontWeight: tab===item.id?700:500, cursor:'pointer', textAlign:'left', border:'none', background: tab===item.id?'rgba(124,58,237,0.12)':'none', color: tab===item.id?'#7c3aed':'var(--text-2)', borderLeft:`3px solid ${tab===item.id?'#7c3aed':'transparent'}`, transition:'all 0.15s' }}>
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ margin:'12px 0', padding:'0 4px' }}>
            <div style={{ height:1, background:'var(--border)' }} />
          </div>
          <Link to="/courses" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:11, marginBottom:3, fontSize:13.5, fontWeight:500, textDecoration:'none', color:'var(--text-2)' }}>
            <GraduationCap size={16}/> Browse Courses
          </Link>
          <Link to="/internships" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:11, marginBottom:3, fontSize:13.5, fontWeight:500, textDecoration:'none', color:'var(--text-2)' }}>
            <Briefcase size={16}/> Find Internships
          </Link>
          <Link to="/certificates" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:11, marginBottom:3, fontSize:13.5, fontWeight:500, textDecoration:'none', color:'var(--text-2)' }}>
            <Award size={16}/> Get Certificate
          </Link>
        </nav>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:12 }}>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'10px 14px', borderRadius:11, fontSize:13, fontWeight:500, cursor:'pointer', border:'none', background:'none', color:'#ef4444', textAlign:'left' }}>
            <LogOut size={15}/> Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════ */}
      <main style={{ flex:1, padding:'28px 32px 60px', minWidth:0 }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ marginBottom:28 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:26, color:'var(--text)', marginBottom:4 }}>
                Hello, {user.name.split(' ')[0]} 👋
              </h1>
              <p style={{ fontSize:13, color:'var(--text-3)' }}>{user.college || 'NaanMudhalvan Student'} · {user.branch || ''} · {user.year || ''}</p>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:14, marginBottom:32 }}>
              {[
                { icon:'📋', label:'Applications',  value:apps.length,   color:'#7c3aed' },
                { icon:'⏳', label:'Pending',       value:pending,        color:'#f59e0b' },
                { icon:'⭐', label:'Shortlisted',   value:shortlisted,    color:'#3b82f6' },
                { icon:'✅', label:'Selected',      value:hired,          color:'#10b981' },
              ].map(({ icon, label, value, color }) => (
                <motion.div key={label} whileHover={{ y:-3 }}
                  style={{ background:'var(--surface)', borderRadius:16, padding:'18px 18px', border:'1px solid var(--border)', borderTop:`3px solid ${color}` }}>
                  <div style={{ fontSize:26, marginBottom:8 }}>{icon}</div>
                  <div className="font-display" style={{ fontSize:28, fontWeight:800, color, lineHeight:1 }}>{value}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)', marginTop:5 }}>{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Enrolled courses progress */}
            <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px 24px', border:'1px solid var(--border)', marginBottom:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <h3 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>📚 Learning Progress</h3>
                <button onClick={()=>setTab('courses')} style={{ fontSize:12, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>View All →</button>
              </div>
              {ENROLLED.map(({ title, progress, color, cat, hours }) => (
                <div key={title} style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text)' }}>{title}</div>
                      <div style={{ fontSize:11, color:'var(--text-3)' }}>{cat} · {hours} hrs</div>
                    </div>
                    <span style={{ fontWeight:800, fontSize:14, color }}>{progress}%</span>
                  </div>
                  <div style={{ height:7, borderRadius:999, background:'var(--border)' }}>
                    <motion.div initial={{ width:0 }} animate={{ width:`${progress}%` }} transition={{ duration:1.2, ease:'easeOut' }}
                      style={{ height:'100%', borderRadius:999, background:`linear-gradient(90deg,${color},${color}99)` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent applications */}
            {apps.length > 0 && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>🕐 Recent Applications</h3>
                  <button onClick={()=>setTab('applications')} style={{ fontSize:12, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>View All →</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {apps.slice(0,4).map((app, i) => (
                    <ApplicationRow key={app._id||i} app={app} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <motion.div key="apps" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>📋 My Applications</h1>
            {apps.length === 0
              ? (
                <div style={{ textAlign:'center', padding:'72px 20px' }}>
                  <div style={{ fontSize:54, marginBottom:16 }}>📋</div>
                  <h3 className="font-display" style={{ fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:8 }}>No applications yet</h3>
                  <p style={{ fontSize:14, color:'var(--text-3)', marginBottom:24 }}>Start applying to internships, projects, and courses.</p>
                  <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                    <Link to="/internships" className="btn btn-primary" style={{ fontSize:13 }}>Browse Internships</Link>
                    <Link to="/courses" className="btn btn-ghost" style={{ fontSize:13 }}>Browse Courses</Link>
                  </div>
                </div>
              )
              : (
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {apps.map((app, i) => (
                    <motion.div key={app._id||i} whileHover={{ x:3 }} transition={{ duration:0.15 }}
                      style={{ background:'var(--surface)', borderRadius:14, padding:'16px 20px', border:'1px solid var(--border)', display:'grid', gridTemplateColumns:'1fr 1fr auto auto', alignItems:'center', gap:16 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:2 }}>{app.itemTitle}</div>
                        <div style={{ fontSize:12, color:'var(--text-3)' }}>{app.itemCompany}</div>
                      </div>
                      <div>
                        <span style={{ padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:700, background:'rgba(124,58,237,0.1)', color:'#a78bfa' }}>{app.type}</span>
                        <div style={{ fontSize:11, color:'var(--text-3)', marginTop:4 }}>Applied {app.createdAt?new Date(app.createdAt).toLocaleDateString('en-IN'):'—'}</div>
                      </div>
                      <span style={{ padding:'5px 14px', borderRadius:999, fontSize:12, fontWeight:700, background:`${STATUS_COLOR[app.status]||'#555'}15`, color:STATUS_COLOR[app.status]||'var(--text-2)' }}>
                        {STATUS_ICON[app.status]} {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )
            }
          </motion.div>
        )}

        {/* ── MY COURSES ── */}
        {tab === 'courses' && (
          <motion.div key="courses" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:22 }}>📚 My Enrolled Courses</h1>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
              {ENROLLED.map(({ id, title, progress, color, cat, hours, instructor }) => (
                <motion.div key={id} whileHover={{ y:-4, boxShadow:`0 12px 32px ${color}22` }}
                  style={{ background:'var(--surface)', borderRadius:18, overflow:'hidden', border:'1px solid var(--border)', transition:'box-shadow 0.2s' }}>
                  <div style={{ height:8, background:`linear-gradient(90deg,${color},${color}66)` }} />
                  <div style={{ padding:'20px' }}>
                    <div style={{ fontSize:10.5, fontWeight:800, color, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>{cat}</div>
                    <div className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:4, lineHeight:1.4 }}>{title}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:12 }}>by {instructor}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:12, color:'var(--text-3)' }}>⏱ {hours} hours</span>
                      <span style={{ fontSize:13, fontWeight:700, color }}>{progress}% complete</span>
                    </div>
                    <div style={{ height:7, borderRadius:999, background:'var(--border)', marginBottom:16 }}>
                      <div style={{ height:'100%', width:`${progress}%`, borderRadius:999, background:`linear-gradient(90deg,${color},${color}99)` }} />
                    </div>
                    <button
                      onClick={() => navigate(`/learn/${id}`)}
                      className="btn btn-primary"
                      style={{ width:'100%', justifyContent:'center', fontSize:13, padding:'9px', background:`linear-gradient(135deg,${color},${color}cc)`, borderRadius:10 }}>
                      ▶ Continue Learning
                    </button>
                  </div>
                </motion.div>
              ))}
              <motion.div whileHover={{ y:-4 }}
                style={{ background:'var(--surface)', borderRadius:18, border:'2px dashed var(--border)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', cursor:'pointer', textAlign:'center' }}
                onClick={() => navigate('/courses')}>
                <div style={{ fontSize:36, marginBottom:12 }}>+</div>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', marginBottom:6 }}>Enroll in More Courses</div>
                <div style={{ fontSize:12, color:'var(--text-3)' }}>Browse 300+ courses →</div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab === 'certificates' && (
          <motion.div key="certs" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:8 }}>🏅 My Certificates</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>Download and share your achievement certificates.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
              {[
                { title:'Full Stack Web Development', issuer:'NaanMudhalvan', date:'Sep 2026', color:'#7c3aed', type:'Course' },
                { title:'TCS Internship Completion',  issuer:'Tata Consultancy Services', date:'Aug 2026', color:'#1a56db', type:'Internship' },
                { title:'Python Fundamentals',        issuer:'NaanMudhalvan', date:'Jul 2026', color:'#3b82f6', type:'Course' },
              ].map(({ title, issuer, date, color, type }) => (
                <motion.div key={title} whileHover={{ y:-4, boxShadow:`0 12px 32px ${color}22` }}
                  style={{ background:'var(--surface)', borderRadius:16, border:`1px solid ${color}25`, overflow:'hidden' }}>
                  <div style={{ height:6, background:`linear-gradient(90deg,${color},${color}66)` }} />
                  <div style={{ padding:'18px' }}>
                    <div style={{ fontSize:10.5, fontWeight:700, color, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>{type} Certificate</div>
                    <div className="font-display" style={{ fontWeight:700, fontSize:14, color:'var(--text)', lineHeight:1.4, marginBottom:6 }}>{title}</div>
                    <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:4 }}>Issued by {issuer}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-3)', marginBottom:16 }}>📅 {date}</div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>navigate('/certificates')} className="btn btn-primary" style={{ flex:1, justifyContent:'center', fontSize:12.5, padding:'8px', background:`linear-gradient(135deg,${color},${color}cc)`, borderRadius:9 }}>
                        Download
                      </button>
                      <button className="btn btn-ghost" style={{ flex:1, justifyContent:'center', fontSize:12.5, padding:'8px', borderRadius:9 }}>
                        Share
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div style={{ marginTop:24 }}>
              <Link to="/certificates" className="btn btn-ghost" style={{ fontSize:13 }}>🏅 Create New Certificate →</Link>
            </div>
          </motion.div>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <motion.div key="prof" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)' }}>👤 My Profile</h1>
              <button className="btn btn-primary" onClick={handleProfileSave} disabled={profileSaving}
                style={{ display:'flex', alignItems:'center', gap:7, fontSize:13.5, padding:'9px 20px' }}>
                <Save size={14} /> {profileSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

            {/* Feedback message */}
            {profileMsg && (
              <div style={{ marginBottom:16, padding:'10px 16px', borderRadius:10, background:profileMsg.includes('successfully')||profileMsg.includes('updated')?'rgba(16,185,129,0.12)':'rgba(239,68,68,0.1)', border:`1px solid ${profileMsg.includes('successfully')||profileMsg.includes('updated')?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`, color:profileMsg.includes('successfully')||profileMsg.includes('updated')?'#34d399':'#fca5a5', fontSize:13 }}>
                {profileMsg}
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20 }}>
              {/* Avatar card */}
              <div style={{ background:'var(--surface)', borderRadius:18, padding:'24px', border:'1px solid var(--border)', textAlign:'center', alignSelf:'start' }}>
                <div style={{ width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:32,color:'#fff',margin:'0 auto 16px' }}>
                  {user.name[0].toUpperCase()}
                </div>
                <div className="font-display" style={{ fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:4 }}>{user.name}</div>
                <div style={{ fontSize:12, color:'var(--accent)', fontWeight:600, marginBottom:16 }}>🎓 Student</div>
                <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:4 }}>{user.email}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:16 }}>
                  {[
                    { label:'Applied',     val:apps.length, color:'#7c3aed' },
                    { label:'Shortlisted', val:shortlisted,  color:'#3b82f6' },
                    { label:'Selected',    val:hired,         color:'#10b981' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign:'center', padding:'10px 6px', borderRadius:10, background:'var(--bg)', border:`1px solid ${color}20` }}>
                      <div className="font-display" style={{ fontSize:20, fontWeight:800, color, marginBottom:2 }}>{val}</div>
                      <div style={{ fontSize:10, color:'var(--text-3)' }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:6 }}>
                  <Link to="/courses"     className="btn btn-ghost btn-sm" style={{ fontSize:12, justifyContent:'center' }}>📚 Browse Courses</Link>
                  <Link to="/internships" className="btn btn-ghost btn-sm" style={{ fontSize:12, justifyContent:'center' }}>💼 Find Internships</Link>
                  <Link to="/certificates"className="btn btn-ghost btn-sm" style={{ fontSize:12, justifyContent:'center' }}>🏅 Certificates</Link>
                </div>
              </div>

              {/* Edit form */}
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {/* Personal Info */}
                <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px', border:'1px solid var(--border)' }}>
                  <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:16 }}>📋 Personal Information</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    {[
                      { label:'Phone Number',    key:'phone',   placeholder:'+91 XXXXXXXXXX' },
                      { label:'College Name',    key:'college', placeholder:'Your college name' },
                      { label:'Branch / Dept',   key:'branch',  placeholder:'e.g. CSE, IT, ECE' },
                      { label:'Year of Study',   key:'year',    placeholder:'e.g. 3rd Year' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', display:'block', marginBottom:5 }}>{label}</label>
                        <input id={`profile-${key}`} className="inp" value={profileForm[key] || ''}
                          onChange={e => setProfileForm((f: any) => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder} style={{ fontSize:13.5 }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Bio */}
                <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px', border:'1px solid var(--border)' }}>
                  <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:16 }}>🧠 Skills & Bio</h3>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', display:'block', marginBottom:5 }}>Skills (comma-separated)</label>
                    <input id="profile-skills" className="inp" value={profileForm.skills || ''}
                      onChange={e => setProfileForm((f: any) => ({ ...f, skills: e.target.value }))}
                      placeholder="e.g. Python, React, Node.js, SQL" style={{ fontSize:13.5 }} />
                    {/* Preview badges */}
                    {profileForm.skills && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                        {profileForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean).map((s: string) => (
                          <span key={s} style={{ padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:600, background:'rgba(124,58,237,0.1)', color:'#a78bfa' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', display:'block', marginBottom:5 }}>Bio / About</label>
                    <textarea id="profile-bio" className="inp" rows={3} value={profileForm.bio || ''}
                      onChange={e => setProfileForm((f: any) => ({ ...f, bio: e.target.value }))}
                      placeholder="Tell companies about yourself…" style={{ resize:'vertical', fontSize:13.5 }} />
                  </div>
                </div>

                {/* Links */}
                <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px', border:'1px solid var(--border)' }}>
                  <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:16 }}>🔗 Links & Resume</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    {[
                      { label:'LinkedIn URL',  key:'linkedIn', placeholder:'https://linkedin.com/in/…' },
                      { label:'GitHub URL',    key:'github',   placeholder:'https://github.com/…' },
                      { label:'Resume URL',    key:'resume',   placeholder:'https://drive.google.com/…' },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key} style={{ gridColumn: key === 'resume' ? '1 / -1' : 'auto' }}>
                        <label style={{ fontSize:11, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', display:'block', marginBottom:5 }}>{label}</label>
                        <input id={`profile-${key}`} className="inp" value={profileForm[key] || ''}
                          onChange={e => setProfileForm((f: any) => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder} style={{ fontSize:13.5 }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}


        {/* ── WISHLIST ── */}
        {tab === 'wishlist' && (
          <motion.div key="wishlist" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:8 }}>❤️ My Wishlist</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>Courses and internships you saved for later.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
              {[
                { title:'Machine Learning A-Z', type:'Course', color:'#7c3aed', company:'NaanMudhalvan', tag:'AI/ML', saved:'2 days ago' },
                { title:'UI/UX Designer Intern', type:'Internship', color:'#3b82f6', company:'Freshworks', tag:'Design', saved:'5 days ago' },
                { title:'React Native Masterclass', type:'Course', color:'#10b981', company:'NaanMudhalvan', tag:'Mobile Dev', saved:'1 week ago' },
                { title:'Backend Engineer Intern', type:'Internship', color:'#f59e0b', company:'Zoho', tag:'Engineering', saved:'2 weeks ago' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y:-4 }}
                  style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', overflow:'hidden' }}>
                  <div style={{ height:5, background:`linear-gradient(90deg,${item.color},${item.color}66)` }} />
                  <div style={{ padding:'18px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <span style={{ padding:'3px 10px', borderRadius:999, fontSize:10.5, fontWeight:700, background:`${item.color}12`, color:item.color, border:`1px solid ${item.color}25` }}>
                        {item.type === 'Course' ? '📚' : '💼'} {item.type}
                      </span>
                      <button style={{ background:'none', border:'none', cursor:'pointer', color:'#ef4444', padding:4 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="font-display" style={{ fontWeight:700, fontSize:14.5, color:'var(--text)', marginBottom:6, lineHeight:1.4 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:4 }}>by {item.company}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)', marginBottom:14 }}>🏷 {item.tag} · Saved {item.saved}</div>
                    <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:12.5, padding:'8px', background:`linear-gradient(135deg,${item.color},${item.color}bb)`, borderRadius:10 }}>
                      {item.type === 'Course' ? 'Enroll Now' : 'Apply Now'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── REVIEWS ── */}
        {tab === 'reviews' && (
          <motion.div key="reviews" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:8 }}>⭐ My Reviews</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>Ratings and feedback you've given to courses and internships.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { title:'Full Stack Web Development', type:'Course', company:'NaanMudhalvan', rating:5, review:'Excellent course! Very practical and industry-aligned. The projects helped me build a strong portfolio.', date:'Sep 2026', color:'#7c3aed' },
                { title:'TCS Internship Program',     type:'Internship', company:'TCS', rating:4, review:'Great learning experience. Mentors were supportive. Could have more hands-on project time.', date:'Aug 2026', color:'#1a56db' },
                { title:'Python for Data Science',    type:'Course', company:'NaanMudhalvan', rating:5, review:'Very well structured. Clear explanations and great exercises. Highly recommended!', date:'Jul 2026', color:'#3b82f6' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x:3 }}
                  style={{ background:'var(--surface)', borderRadius:16, padding:'20px 22px', border:'1px solid var(--border)', borderLeft:`4px solid ${item.color}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div>
                      <div className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:3 }}>{item.title}</div>
                      <div style={{ fontSize:12, color:'var(--text-3)' }}>by {item.company} · {item.type} · {item.date}</div>
                    </div>
                    <div style={{ display:'flex', gap:2 }}>
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={14} fill={j < item.rating ? '#f59e0b' : 'none'} color={j < item.rating ? '#f59e0b' : 'var(--border-2)'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize:13.5, color:'var(--text-2)', lineHeight:1.65, fontStyle:'italic' }}>" {item.review}"</p>
                </motion.div>
              ))}
            </div>

            {/* Write a review CTA */}
            <div style={{ marginTop:28, background:'var(--surface)', borderRadius:18, padding:'22px 24px', border:'1px solid var(--border)' }}>
              <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:12 }}>✍️ Write a New Review</h3>
              <select className="inp" style={{ marginBottom:12 }}>
                <option value="">Select a course or internship…</option>
                <option>Full Stack Web Development</option>
                <option>TCS Internship Program</option>
              </select>
              <div style={{ display:'flex', gap:4, marginBottom:12 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
                    <Star size={22} color="#f59e0b" fill="#f59e0b" />
                  </button>
                ))}
              </div>
              <textarea className="inp" rows={3} placeholder="Share your experience…" style={{ resize:'vertical', marginBottom:12 }} />
              <button className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:7, fontSize:13.5, padding:'10px 20px' }}>
                <Send size={14} /> Submit Review
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Q & A ── */}
        {tab === 'qa' && (
          <motion.div key="qa" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h1 className="font-display" style={{ fontWeight:800, fontSize:24, color:'var(--text)', marginBottom:8 }}>💬 Q &amp; A</h1>
            <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:28 }}>Ask questions and get answers from mentors and the community.</p>

            {/* Ask a question */}
            <div style={{ background:'var(--surface)', borderRadius:18, padding:'22px 24px', border:'1px solid rgba(124,58,237,0.25)', marginBottom:28 }}>
              <h3 className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:12 }}>🙋 Ask a Question</h3>
              <input className="inp" placeholder="What's your question? (e.g. How do I apply for a TCS internship?)" style={{ marginBottom:10 }} />
              <textarea className="inp" rows={3} placeholder="Add more details to your question…" style={{ resize:'vertical', marginBottom:12 }} />
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <select className="inp" style={{ maxWidth:200 }}>
                  <option>General</option>
                  <option>Internship</option>
                  <option>Courses</option>
                  <option>Certificates</option>
                  <option>Technical</option>
                </select>
                <button className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:7, fontSize:13.5, padding:'10px 20px' }}>
                  <Send size={14} /> Post Question
                </button>
              </div>
            </div>

            {/* Questions list */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                {
                  q: 'What skills should I build for a Zoho SaaS internship?',
                  tag:'Internship', author:'Arjun K.', time:'2h ago',
                  answers:[
                    { by:'Mentor · Priya R.', text:'Focus on full-stack web (React + Node), REST APIs, and SQL. Zoho values problem-solving and clean code over frameworks.' },
                    { by:'Student · Meena S.', text:'I went through Zoho internship last year. Practice DSA on LeetCode and build at least 2 projects to showcase.' },
                  ],
                },
                {
                  q: 'How many applications should I send per week to maximize my chances?',
                  tag:'General', author:'Kaviya T.', time:'1d ago',
                  answers:[
                    { by:'Mentor · Raj M.', text:'Quality over quantity. 5 well-crafted applications per week beats 20 generic ones. Customize your cover letter each time.' },
                  ],
                },
                {
                  q: 'Is the NaanMudhalvan certificate recognized by companies in Chennai?',
                  tag:'Certificates', author:'Dinesh P.', time:'3d ago',
                  answers:[
                    { by:'Admin · NM Team', text:'Yes! All NM certificates are government-recognized and accepted by 180+ partner companies in Tamil Nadu and nationally.' },
                  ],
                },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ y:-2 }}
                  style={{ background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)', overflow:'hidden' }}>
                  {/* Question header */}
                  <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <span style={{ padding:'2px 9px', borderRadius:999, fontSize:10.5, fontWeight:700, background:'rgba(124,58,237,0.1)', color:'#a78bfa' }}>{item.tag}</span>
                      <span style={{ fontSize:11, color:'var(--text-3)' }}>{item.author} · {item.time}</span>
                    </div>
                    <div className="font-display" style={{ fontWeight:700, fontSize:14.5, color:'var(--text)', lineHeight:1.45 }}>{item.q}</div>
                  </div>
                  {/* Answers */}
                  <div style={{ padding:'14px 20px', display:'flex', flexDirection:'column', gap:12 }}>
                    {item.answers.map((ans, j) => (
                      <div key={j} style={{ display:'flex', gap:12 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
                          {ans.by[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:11.5, fontWeight:600, color:'var(--accent)', marginBottom:4 }}>{ans.by}</div>
                          <div style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65 }}>{ans.text}</div>
                        </div>
                      </div>
                    ))}
                    {/* Reply box */}
                    <div style={{ display:'flex', gap:10, marginTop:4 }}>
                      <input className="inp" placeholder="Add your answer…" style={{ flex:1, fontSize:13 }} />
                      <button className="btn btn-primary" style={{ padding:'9px 16px', fontSize:13, flexShrink:0 }}>
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}

function ApplicationRow({ app }: { app: any }) {
  return (
    <div style={{ background:'var(--surface)', borderRadius:12, padding:'14px 18px', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:16 }}>
      <div style={{ width:38,height:38,borderRadius:10,background:'rgba(124,58,237,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>
        {app.type==='internship'?'💼':app.type==='course'?'📚':app.type==='project'?'🔧':'🤝'}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:600, fontSize:13.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.itemTitle}</div>
        <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:1 }}>{app.itemCompany||app.type}</div>
      </div>
      <span style={{ padding:'4px 12px', borderRadius:999, fontSize:11.5, fontWeight:700, background:`${STATUS_COLOR[app.status]||'#555'}15`, color:STATUS_COLOR[app.status]||'var(--text-2)', flexShrink:0 }}>
        {STATUS_ICON[app.status]} {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
      </span>
    </div>
  );
}
