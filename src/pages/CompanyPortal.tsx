import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, ChevronDown, ChevronRight, Trash2, Save,
  Briefcase, Users, TrendingUp, CheckCircle, BarChart2,
  Layers, Calendar, Globe, Building2,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import ContentManager from '../components/ContentManager';
import ApplicationAcceptancePanel from '../components/ApplicationAcceptancePanel';
import AIResumeShortlister from '../components/AIResumeShortlister';
import CertificateIssuer from '../components/CertificateIssuer';
import MentorPortal from '../components/MentorPortal';
import { portalGetByAuthor } from '../portalData';
import {
  portalAppGetByAuthor,
  workflowFor,
  statusColor,
  type PortalApplication,
} from '../portalApplications';

type Tab = 'dashboard' | 'applications' | 'ai-shortlist' | 'mentor-portal' | 'certificates' | 'projects' | 'internships' | 'jobs' | 'events' | 'profile';

const TYPE_ICON: Record<string, string> = { project: '🎯', internship: '💼', job: '🏢', event: '🎪' };

function Stat({ label, value, color, sub, icon }: any) {
  return (
    <div style={{ padding:'18px 20px', borderRadius:16, background:'var(--surface)', border:`1px solid ${color}20`, display:'flex', alignItems:'center', gap:14, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}60)` }} />
      <div style={{ width:46, height:46, borderRadius:13, background:`${color}15`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:26, fontWeight:800, color, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:11.5, color:'var(--text-3)', marginTop:3, fontWeight:600 }}>{label}</div>
        {sub && <div style={{ fontSize:10.5, color, fontWeight:700, marginTop:2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function AppCard({ app, onStatus, onDelete }: { app: PortalApplication; onStatus:(id:number,s:any)=>void; onDelete:(id:number)=>void }) {
  const [open, setOpen] = useState(false);
  const workflow = workflowFor(app.type);
  const sc = statusColor(app.status);
  return (
    <div style={{ borderRadius:14, background:'var(--surface)', border:'1px solid var(--border)', overflow:'hidden', marginBottom:8, transition:'border-color 0.2s' }}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.borderColor=`${sc}40`}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.borderColor='var(--border)'}>
      <div style={{ height:2, background:`linear-gradient(90deg,${sc},${sc}40)` }} />
      <div style={{ padding:'13px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }} onClick={()=>setOpen(o=>!o)}>
        <div style={{ width:38, height:38, borderRadius:11, background:`${sc}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:15, color:sc, flexShrink:0 }}>
          {(app.studentName?.[0] ?? '?').toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.studentName}</div>
          <div style={{ fontSize:11.5, color:'var(--text-3)' }}>{TYPE_ICON[app.type]} {app.itemTitle} · {app.studentCollege||app.studentEmail}</div>
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 11px', borderRadius:999, background:`${sc}15`, color:sc, flexShrink:0 }}>{app.status.charAt(0).toUpperCase()+app.status.slice(1)}</span>
        <span style={{ fontSize:11, color:'var(--text-3)', flexShrink:0, whiteSpace:'nowrap' }}>{new Date(app.appliedAt).toLocaleDateString('en-IN')}</span>
        <ChevronDown size={13} style={{ color:'var(--text-3)', flexShrink:0, transform:open?'rotate(180deg)':'none', transition:'0.2s' }} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} style={{ overflow:'hidden', borderTop:'1px solid var(--border)' }}>
            <div style={{ padding:'16px 18px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8, marginBottom:14 }}>
                {[['Email',app.studentEmail],['Phone',app.studentPhone||'—'],['Branch',app.studentBranch||'—'],['Year',app.studentYear||'—'],['College',app.studentCollege||'—'],['Applied',new Date(app.appliedAt).toLocaleString('en-IN')]].map(([l,v])=>(
                  <div key={l} style={{ padding:'8px 11px', borderRadius:9, background:'var(--bg)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:10, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text)', wordBreak:'break-all' }}>{v}</div>
                  </div>
                ))}
              </div>
              {app.coverLetter && (<div style={{ padding:'10px 13px', borderRadius:10, background:'var(--bg)', border:'1px solid var(--border)', fontSize:13, color:'var(--text-2)', lineHeight:1.6, marginBottom:14 }}><div style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', textTransform:'uppercase', marginBottom:5 }}>Cover Letter</div>{app.coverLetter}</div>)}
              {app.resumeLink && (<div style={{ marginBottom:14 }}><a href={app.resumeLink} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:'#3b82f6', textDecoration:'none', fontWeight:600, display:'inline-flex', alignItems:'center', gap:5 }}>🔗 View Resume / Portfolio</a></div>)}
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
                <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:700, marginRight:4 }}>Update Status:</span>
                {workflow.map(w=>(<button key={w.status} onClick={()=>onStatus(app.id,w.status)} style={{ fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:999, cursor:'pointer', border:`1.5px solid ${w.color}`, background:app.status===w.status?w.color:'transparent', color:app.status===w.status?'#fff':w.color, transition:'all 0.15s' }}>{w.label}</button>))}
                <button onClick={()=>{if(confirm('Delete this application?'))onDelete(app.id);}} style={{ marginLeft:'auto', padding:'5px 11px', borderRadius:999, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#ef4444', cursor:'pointer', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}><Trash2 size={11}/>Delete</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CompanyPortal() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab,setTab]=useState<Tab>('dashboard');
  const [saving,setSaving]=useState(false);
  const [savedMsg,setSavedMsg]=useState('');
  const [pf,setPf]=useState<Record<string,any>>({});

  const companyId = useMemo(()=>((user as any)?.companyName||user?.email||'company').toLowerCase().replace(/\s+/g,'-'),[user]);

  useEffect(()=>{
    if(!user||user.role!=='company'){navigate('/login');return;}
    setPf({ companyName:(user as any).companyName||'', industry:(user as any).industry||'', website:(user as any).website||'', location:(user as any).location||'', hrName:(user as any).hrName||'', hrPhone:(user as any).hrPhone||'', bio:(user as any).bio||'' });
  },[user]);

  const myProjects    = useMemo(()=>portalGetByAuthor('project',companyId).length,[tab,companyId]);
  const myInternships = useMemo(()=>portalGetByAuthor('internship',companyId).length,[tab,companyId]);
  const myJobs        = useMemo(()=>portalGetByAuthor('job',companyId).length,[tab,companyId]);
  const myEvents      = useMemo(()=>portalGetByAuthor('event',companyId).length,[tab,companyId]);
  const apps          = useMemo(()=>portalAppGetByAuthor(companyId),[tab,companyId]);
  const pendingCount  = useMemo(()=>apps.filter(a=>a.status==='pending').length,[apps]);
  const hiredCount    = useMemo(()=>apps.filter(a=>a.status==='hired').length,[apps]);
  const totalContent  = myProjects+myInternships+myJobs+myEvents;

  const saveProfile = async()=>{
    setSaving(true);
    const res = await updateUser(pf);
    setSavedMsg(res.message); setSaving(false);
    setTimeout(()=>setSavedMsg(''),3000);
  };

  if(!user||user.role!=='company') return null;

  const ACCENT='#3b82f6';
  const NAV=[
    {id:'dashboard' as Tab,     label:'Dashboard',       icon:<BarChart2 size={15}/> },
    {id:'applications' as Tab,  label:'Applications',    icon:<Users size={15}/>,     badge:pendingCount},
    {id:'ai-shortlist' as Tab,  label:'AI Shortlister',  icon:<span style={{fontSize:13}}>🤖</span>, badge:apps.filter(a=>a.status==='pending').length > 0 ? '✨' : undefined},
    {id:'mentor-portal' as Tab, label:'Mentor Portal',   icon:<span style={{fontSize:13}}>🎓</span>},
    {id:'certificates' as Tab,  label:'Issue Certificate', icon:<span style={{fontSize:13}}>🏅</span>},
    {id:'jobs' as Tab,          label:'Job Openings',    icon:<Briefcase size={15}/>, badge:myJobs},
    {id:'internships' as Tab,   label:'Internships',     icon:<TrendingUp size={15}/>,badge:myInternships},
    {id:'projects' as Tab,      label:'Projects',        icon:<Layers size={15}/>,    badge:myProjects},
    {id:'events' as Tab,        label:'Events',          icon:<Calendar size={15}/>,  badge:myEvents},
    {id:'profile' as Tab,       label:'Company Profile', icon:<Building2 size={15}/>},
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>
      <aside style={{ width:230, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'14px 10px' }}>
        <div style={{ padding:'12px 14px', borderRadius:13, background:`${ACCENT}10`, border:`1px solid ${ACCENT}25`, marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:`linear-gradient(135deg,${ACCENT},#1d4ed8)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', fontSize:16, flexShrink:0 }}>
            {((user as any).companyName||user.name||'C')[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{(user as any).companyName||user.name}</div>
            <div style={{ fontSize:10, color:ACCENT, fontWeight:700, letterSpacing:'0.06em' }}>COMPANY PORTAL</div>
          </div>
        </div>
        <nav style={{ flex:1 }}>
          {NAV.map(n=>{const active=tab===n.id;return(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?ACCENT:'var(--text-2)', background:active?`${ACCENT}12`:'transparent', border:'none', cursor:'pointer', textAlign:'left', borderLeft:active?`3px solid ${ACCENT}`:'3px solid transparent', transition:'all 0.15s' }}
              onMouseEnter={e=>{if(!active)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';}}
              onMouseLeave={e=>{if(!active)(e.currentTarget as HTMLElement).style.background='transparent';}}>
              <span style={{ color:active?ACCENT:'var(--text-3)' }}>{n.icon}</span>
              <span style={{ flex:1 }}>{n.label}</span>
              {!!n.badge&&n.badge>0&&(<span style={{ fontSize:10, fontWeight:800, borderRadius:999, padding:'1px 7px', background:n.id==='applications'?'rgba(239,68,68,0.15)':`${ACCENT}20`, color:n.id==='applications'?'#ef4444':ACCENT }}>{n.badge}</span>)}
            </button>
          );})}
        </nav>
        <button onClick={()=>{logout();navigate('/');}} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontWeight:500, marginTop:8 }}><LogOut size={14}/>Sign Out</button>
      </aside>

      <main style={{ flex:1, minWidth:0, padding:'28px 32px 60px', overflowY:'auto' }}>

        {tab==='dashboard'&&(
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <div style={{ marginBottom:28 }}>
              <h1 className="font-display" style={{ fontWeight:800, fontSize:26, color:'var(--text)', marginBottom:4 }}>Welcome back! 🏢</h1>
              <p style={{ color:'var(--text-3)', fontSize:13.5 }}>{(user as any).companyName||user.name} — Company Dashboard</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14, marginBottom:32 }}>
              <Stat label="Total Applications" value={apps.length}  color="#7c3aed" icon="📋"/>
              <Stat label="Pending Review"     value={pendingCount} color="#f59e0b" icon="⏳" sub="Needs action"/>
              <Stat label="Shortlisted"        value={apps.filter(a=>a.status==='shortlisted').length} color="#3b82f6" icon="⭐"/>
              <Stat label="Hired"              value={hiredCount}   color="#10b981" icon="✅"/>
              <Stat label="Content Posted"     value={totalContent} color="#ec4899" icon="📁"/>
              <Stat label="Active Jobs"        value={myJobs}       color="#06b6d4" icon="💼"/>
            </div>
            {apps.length>0&&(
              <div style={{ padding:'20px 22px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:24 }}>
                <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:18, display:'flex', alignItems:'center', gap:8 }}><BarChart2 size={16} color={ACCENT}/>Application Pipeline</h3>
                <div style={{ display:'flex', gap:6 }}>
                  {[{s:'pending',label:'Pending',color:'#f59e0b',icon:'⏳'},{s:'reviewed',label:'Reviewed',color:'#3b82f6',icon:'👁️'},{s:'shortlisted',label:'Shortlisted',color:'#7c3aed',icon:'⭐'},{s:'interview',label:'Interview',color:'#06b6d4',icon:'🎙️'},{s:'hired',label:'Hired',color:'#10b981',icon:'✅'}].map((stage,i,arr)=>{
                    const count=apps.filter(a=>a.status===stage.s).length;
                    const pct=apps.length?Math.round(count/apps.length*100):0;
                    return(<div key={stage.s} style={{ flex:1, position:'relative' }}>
                      <div style={{ padding:'14px 10px', borderRadius:12, background:`${stage.color}10`, border:`1px solid ${stage.color}25`, margin:'0 3px', textAlign:'center' }}>
                        <div style={{ fontSize:18, marginBottom:4 }}>{stage.icon}</div>
                        <div style={{ fontSize:22, fontWeight:800, color:stage.color }}>{count}</div>
                        <div style={{ fontSize:10, fontWeight:700, color:'var(--text-3)', marginTop:2 }}>{stage.label}</div>
                        <div style={{ fontSize:9.5, color:stage.color, fontWeight:600, marginTop:2 }}>{pct}%</div>
                      </div>
                      {i<arr.length-1&&<ChevronRight size={12} style={{ position:'absolute', right:-8, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', zIndex:1 }}/>}
                    </div>);
                  })}
                </div>
              </div>
            )}
            <h3 style={{ fontWeight:700, fontSize:15, color:'var(--text)', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}><Layers size={15} color={ACCENT}/>My Listings</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginBottom:28 }}>
              {([{id:'jobs' as Tab,icon:'🏢',label:'Job Openings',count:myJobs,color:'#10b981'},{id:'internships' as Tab,icon:'💼',label:'Internships',count:myInternships,color:'#3b82f6'},{id:'projects' as Tab,icon:'🎯',label:'Projects',count:myProjects,color:'#7c3aed'},{id:'events' as Tab,icon:'🎪',label:'Events',count:myEvents,color:'#f59e0b'}] as const).map(c=>(
                <button key={c.id} onClick={()=>setTab(c.id)} style={{ padding:'18px', borderRadius:14, background:'var(--surface)', border:`1px solid ${c.color}20`, cursor:'pointer', textAlign:'left', display:'flex', gap:14, alignItems:'center', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=c.color;(e.currentTarget as HTMLElement).style.background=`${c.color}08`;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${c.color}20`;(e.currentTarget as HTMLElement).style.background='var(--surface)';}}>
                  <div style={{ height:3, position:'absolute', top:0, left:0, right:0, background:`linear-gradient(90deg,${c.color},${c.color}50)` }}/>
                  <span style={{ fontSize:30 }}>{c.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text)' }}>{c.label}</div>
                    <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>{c.count} posted</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                    <span style={{ fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:999, background:`${c.color}18`, color:c.color }}>{c.count}</span>
                    <ChevronRight size={13} style={{ color:'var(--text-3)' }}/>
                  </div>
                </button>
              ))}
            </div>
            {apps.length===0&&totalContent===0&&(
              <div style={{ padding:'28px', borderRadius:16, background:`${ACCENT}08`, border:`1px solid ${ACCENT}20`, textAlign:'center' }}>
                <div style={{ fontSize:44, marginBottom:12 }}>🚀</div>
                <h3 style={{ fontSize:17, fontWeight:700, color:'var(--text)', marginBottom:8 }}>Start posting to attract students</h3>
                <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:20 }}>Create job openings, internships, or projects to start receiving applications from Tamil Nadu's top students.</p>
                <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={()=>setTab('jobs')} className="btn btn-primary" style={{ fontSize:13 }}>Post a Job →</button>
                  <button onClick={()=>setTab('internships')} className="btn btn-outline" style={{ fontSize:13 }}>Post Internship</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {tab==='applications'&&(
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4,flexWrap:'wrap',gap:10}}>
              <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)' }}>Student Applications</h2>
              <button onClick={()=>setTab('ai-shortlist')} style={{padding:'9px 18px',borderRadius:11,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',color:'#fff',fontWeight:700,fontSize:12.5,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:'0 2px 12px rgba(124,58,237,0.3)'}}>
                🤖 AI Shortlister
              </button>
            </div>
            <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:24 }}>Review, shortlist, interview, and <strong style={{color:'#10b981'}}>accept</strong> or <strong style={{color:'#ef4444'}}>reject</strong> student applications.</p>
            <ApplicationAcceptancePanel authorId={companyId} accentColor={ACCENT} emptyMessage="No applications yet" emptyAction={{label:'Post a Job Opening',onClick:()=>setTab('jobs')}}/>
          </motion.div>
        )}

        {tab==='ai-shortlist'&&(
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <AIResumeShortlister companyId={companyId} accentColor={ACCENT} onSwitchTab={()=>setTab('applications')}/>
          </motion.div>
        )}

        {tab==='mentor-portal'&&(
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <MentorPortal
              companyName={(user as any).companyName||user.name||'Your Company'}
              mentorId={companyId}
              mentorName={user.name||(user as any).companyName||'Mentor'}
            />
          </motion.div>
        )}

        {tab==='certificates'&&(
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <CertificateIssuer issuerName={(user as any).companyName||user.name||'Your Company'} issuerType="company"/>
          </motion.div>
        )}


        {tab==='jobs'&&(<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}><h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Job Openings</h2><p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and delete job listings. Students apply via <strong>/jobs</strong>.</p><ContentManager type="job" author={companyId} accentColor="#10b981"/></motion.div>)}
        {tab==='internships'&&(<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}><h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Internships</h2><p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and delete internship listings. Students apply via <strong>/internships</strong>.</p><ContentManager type="internship" author={companyId} accentColor={ACCENT}/></motion.div>)}
        {tab==='projects'&&(<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}><h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Projects</h2><p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and delete project listings. Students apply via <strong>/projects</strong>.</p><ContentManager type="project" author={companyId} accentColor="#7c3aed"/></motion.div>)}
        {tab==='events'&&(<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}><h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Events</h2><p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>Create, edit, and delete events. Students register via <strong>/events</strong>.</p><ContentManager type="event" author={companyId} accentColor="#f59e0b"/></motion.div>)}

        {tab==='profile'&&(
          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <div>
                <h2 className="font-display" style={{ fontWeight:700, fontSize:22, color:'var(--text)', marginBottom:4 }}>Company Profile</h2>
                <p style={{ fontSize:13, color:'var(--text-3)' }}>Update your company information shown to students</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {savedMsg&&<span style={{ fontSize:12.5, color:'#10b981', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}><CheckCircle size={13}/>{savedMsg}</span>}
                <button onClick={saveProfile} disabled={saving} style={{ padding:'9px 20px', borderRadius:10, background:ACCENT, border:'none', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:7, opacity:saving?0.7:1 }}><Save size={13}/>{saving?'Saving…':'Save Profile'}</button>
              </div>
            </div>
            <div style={{ padding:'24px', borderRadius:16, background:'var(--surface)', border:'1px solid var(--border)' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[{key:'companyName',label:'Company Name',placeholder:'Official company name'},{key:'industry',label:'Industry',placeholder:'e.g. EdTech, FinTech'},{key:'website',label:'Website URL',placeholder:'https://company.com'},{key:'location',label:'Headquarters',placeholder:'City, State'},{key:'hrName',label:'HR Contact Name',placeholder:'Recruiter name'},{key:'hrPhone',label:'HR Phone',placeholder:'+91 XXXXX XXXXX'}].map(f=>(
                  <div key={f.key}>
                    <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>{f.label}</label>
                    <input className="inp" value={pf[f.key]||''} onChange={e=>setPf(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{ fontSize:13 }}/>
                  </div>
                ))}
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontSize:11.5, fontWeight:700, color:'var(--text-2)', display:'block', marginBottom:5 }}>Company Description</label>
                  <textarea className="inp" rows={4} value={pf.bio||''} onChange={e=>setPf(p=>({...p,bio:e.target.value}))} placeholder="What does your company do?" style={{ fontSize:13, resize:'none' }}/>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
