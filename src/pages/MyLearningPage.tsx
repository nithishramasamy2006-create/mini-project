import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Play, CheckCircle, Clock, Award, Flame,
  TrendingUp, Star, ChevronRight, BarChart2, Target,
  Zap, Trophy, RotateCcw, Calendar, Download, Share2,
  Lock, Heart, Search, Filter, Printer,
  LayoutDashboard, FolderGit2, Briefcase, FileText, Building2,
  Users, User, LogOut,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ALL_COURSES, type CourseItem } from '../courseData';
import { issueCourseCertificate, getAllCertificateTemplates, type IssuedCertificate } from '../certificateData';
import CertificateRenderer, { printCertificateWindow } from '../components/CertificateRenderer';

// ── localStorage helpers ─────────────────────────────────────────
const LS = {
  get: (k: string, def: any = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── Progress helpers ─────────────────────────────────────────────
function getProgress(courseId: number): number {
  const data = LS.get('nm_course_progress', {});
  return data[courseId] ?? (courseId === 101 ? 100 : 0);
}
function setProgress(courseId: number, pct: number) {
  const data = LS.get('nm_course_progress', {});
  data[courseId] = Math.min(100, Math.max(0, pct));
  LS.set('nm_course_progress', data);
}
function getEnrolled(): number[] {
  const list = LS.get('nm_enrolled_courses', null);
  if (!list || list.length === 0) {
    LS.set('nm_enrolled_courses', [101]);
    return [101];
  }
  return list;
}
function enrollCourse(id: number) {
  const list = getEnrolled();
  if (!list.includes(id)) { list.push(id); LS.set('nm_enrolled_courses', list); }
}
function getStreak(): number { return LS.get('nm_learn_streak', 0); }
function getLastLearnDate(): string { return LS.get('nm_last_learn_date', ''); }
function updateStreak() {
  const today = new Date().toDateString();
  const last = getLastLearnDate();
  if (last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const streak = last === yesterday ? getStreak() + 1 : 1;
  LS.set('nm_learn_streak', streak);
  LS.set('nm_last_learn_date', today);
}

// ── Category colors ──────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  engineering:'#7c3aed', arts:'#ec4899', agriculture:'#10b981',
  medicine:'#ef4444', commerce:'#f59e0b', science:'#3b82f6',
};
const CAT_ICON: Record<string, string> = {
  engineering:'⚙️', arts:'🎨', agriculture:'🌾',
  medicine:'🏥', commerce:'💹', science:'🔬',
};

// ── Level pill ───────────────────────────────────────────────────
function LevelPill({ level }: { level: string }) {
  const c = level==='Beginner'?'#10b981':level==='Intermediate'?'#f59e0b':'#ef4444';
  return <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:999,background:`${c}15`,color:c}}>{level}</span>;
}

// ── Progress ring ────────────────────────────────────────────────
function ProgressRing({ pct, size=48, color='#7c3aed' }: { pct:number; size?:number; color?:string }) {
  const r = (size-6)/2, circ = 2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:'rotate(-90deg)',flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={5}/>
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ*(1-pct/100)}}
        transition={{duration:0.8,ease:'easeOut'}}/>
    </svg>
  );
}

// ── Course card ──────────────────────────────────────────────────
function CourseCard({ course, onContinue, onViewCert }: { course: CourseItem & { progress: number }; onContinue: (id:number)=>void; onViewCert: (course: CourseItem)=>void }) {
  const color = CAT_COLOR[course.category] || '#7c3aed';
  const isDone = course.progress >= 100;
  return (
    <motion.div layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
      style={{borderRadius:16,background:'var(--surface)',border:'1px solid var(--border)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
      {/* Thumbnail */}
      <div style={{height:140,background:`linear-gradient(135deg,${color}22,${color}08)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:52,position:'relative'}}>
        {CAT_ICON[course.category]||'📚'}
        {isDone && (
          <div style={{position:'absolute',top:10,right:10,background:'#10b981',borderRadius:999,padding:'3px 10px',display:'flex',alignItems:'center',gap:4}}>
            <CheckCircle size={11} color="#fff"/><span style={{fontSize:10,fontWeight:800,color:'#fff'}}>Completed</span>
          </div>
        )}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:4,background:'var(--border)'}}>
          <motion.div initial={{width:0}} animate={{width:`${course.progress}%`}} transition={{duration:0.6,ease:'easeOut'}}
            style={{height:'100%',background:isDone?'#10b981':color}}/>
        </div>
      </div>
      <div style={{padding:'14px 16px',flex:1,display:'flex',flexDirection:'column',gap:8}}>
        <div style={{fontSize:13.5,fontWeight:700,color:'var(--text)',lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{course.title}</div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
          <LevelPill level={course.level}/>
          <span style={{fontSize:11,color:'var(--text-3)',display:'flex',alignItems:'center',gap:3}}><Clock size={10}/>{course.hours}h</span>
          <span style={{fontSize:11,color:'#f59e0b',display:'flex',alignItems:'center',gap:2}}><Star size={10}/>{course.rating}</span>
        </div>
        <div style={{fontSize:11.5,color:'var(--text-3)',display:'flex',alignItems:'center',gap:4}}>
          <ProgressRing pct={course.progress} size={28} color={isDone?'#10b981':color}/>
          <div>
            <div style={{fontWeight:700,color:isDone?'#10b981':color,fontSize:12}}>{course.progress}% complete</div>
            <div style={{color:'var(--text-3)',fontSize:10.5}}>{isDone?'All lessons done · Certified':course.progress>0?`${Math.round(course.hours*(1-course.progress/100)*10)/10}h remaining`:'Not started'}</div>
          </div>
        </div>
        <div style={{marginTop:'auto',display:'flex',gap:8}}>
          <button onClick={()=>isDone ? onViewCert(course) : onContinue(course.id)}
            style={{flex:1,padding:'9px',borderRadius:10,background:isDone?'linear-gradient(135deg,#10b981,#059669)':color,border:'none',color:'#fff',fontWeight:700,fontSize:12.5,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all 0.18s',boxShadow:isDone?'0 2px 10px rgba(16,185,129,0.3)':'none'}}>
            {isDone?<><Award size={13}/>View Certificate</>:<><Play size={13}/>{course.progress>0?'Continue':'Start'}</>}
          </button>
          {!isDone && (
            <button onClick={()=>onViewCert(course)}
              title="Finish course & earn certificate"
              style={{padding:'9px 10px',borderRadius:10,background:'rgba(124,58,237,0.1)',border:'1px solid rgba(124,58,237,0.3)',color:'var(--accent)',fontWeight:700,fontSize:11.5,cursor:'pointer',whiteSpace:'nowrap'}}>
              ⚡ Cert
            </button>
          )}
          <Link to={`/learn/${course.id}`}
            style={{padding:'9px 12px',borderRadius:10,background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text-3)',fontWeight:600,fontSize:12,textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
            <BarChart2 size={12}/> Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── Quick enroll card ────────────────────────────────────────────
function RecommendCard({ course, onEnroll }: { course: CourseItem; onEnroll: (id:number)=>void }) {
  const color = CAT_COLOR[course.category] || '#7c3aed';
  return (
    <div style={{padding:'14px 16px',borderRadius:14,background:'var(--surface)',border:'1px solid var(--border)',display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:46,height:46,borderRadius:12,background:`${color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{CAT_ICON[course.category]||'📚'}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:13,color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{course.title}</div>
        <div style={{fontSize:11,color:'var(--text-3)',display:'flex',gap:8,marginTop:2}}>
          <span>{course.level}</span><span>·</span><span>{course.hours}h</span><span>·</span>
          <span style={{color:'#f59e0b',display:'flex',alignItems:'center',gap:2}}><Star size={10}/>{course.rating}</span>
        </div>
      </div>
      <button onClick={()=>onEnroll(course.id)}
        style={{padding:'7px 14px',borderRadius:9,background:color,border:'none',color:'#fff',fontWeight:700,fontSize:12,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
        + Enroll
      </button>
    </div>
  );
}

export default function MyLearningPage() {
  const { user: authUser, logout } = useAuth();
  const navigate  = useNavigate();
  const [tick, setTick] = useState(0);
  const [q, setQ] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all'|'in-progress'|'completed'|'not-started'>('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [viewingCert, setViewingCert] = useState<IssuedCertificate | null>(null);

  // Derive persistent student user so all features stay permanently visible
  const user = useMemo(() => {
    if (authUser && authUser.role === 'student') return authUser;
    try {
      const saved = localStorage.getItem('nm_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (!parsed.role || parsed.role === 'student')) return parsed;
      }
    } catch {}
    return {
      _id: 'student-nithish',
      name: 'nithish',
      email: 'nithish@student.edu',
      role: 'student' as const,
      college: 'Anna University',
      branch: 'Computer Science & Engineering',
      year: '3rd Year',
      skills: ['React', 'Node.js', 'Python', 'Tailwind CSS'],
      phone: '+91 98765 43210',
      isActive: true,
      createdAt: new Date().toISOString()
    };
  }, [authUser]);

  const enrolled = useMemo(() => getEnrolled(), [tick]);
  const streak   = useMemo(() => getStreak(), [tick]);

  const enrolledCourses = useMemo(() =>
    ALL_COURSES.filter(c => enrolled.includes(c.id)).map(c => ({ ...c, progress: getProgress(c.id) }))
  , [tick]);

  const inProgress  = enrolledCourses.filter(c => c.progress > 0 && c.progress < 100);
  const completed   = enrolledCourses.filter(c => c.progress >= 100);
  const notStarted  = enrolledCourses.filter(c => c.progress === 0);
  const totalHours  = enrolledCourses.reduce((s, c) => s + c.hours, 0);
  const doneHours   = Math.round(enrolledCourses.reduce((s, c) => s + c.hours * c.progress / 100, 0));

  // Recommendations: not enrolled, highly rated
  const recommendations = useMemo(() =>
    ALL_COURSES.filter(c => !enrolled.includes(c.id)).sort((a,b) => b.rating - a.rating).slice(0, 6)
  , [tick]);

  // Filtered view
  const filtered = useMemo(() => {
    let list = enrolledCourses;
    if (filterCat !== 'all') list = list.filter(c => c.category === filterCat);
    if (filterStatus === 'in-progress') list = list.filter(c => c.progress > 0 && c.progress < 100);
    if (filterStatus === 'completed')   list = list.filter(c => c.progress >= 100);
    if (filterStatus === 'not-started') list = list.filter(c => c.progress === 0);
    if (q) list = list.filter(c => c.title.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [enrolledCourses, filterCat, filterStatus, q]);

  const handleContinue = (id: number) => {
    const p = getProgress(id);
    if (p < 100) {
      // Simulate progress bump of ~10%
      setProgress(id, Math.min(100, p + 10));
      updateStreak();
      setTick(t => t + 1);
    }
    navigate(`/learn/${id}`);
  };

  const handleViewCert = (courseItem: CourseItem) => {
    setProgress(courseItem.id, 100);
    setTick(t => t + 1);
    const cert = issueCourseCertificate({
      studentName: user?.name || 'nithish',
      studentEmail: user?.email,
      courseId: courseItem.id,
      courseTitle: courseItem.title,
      instructor: courseItem.instructor,
    });
    setViewingCert(cert);
  };

  const handleEnroll = (id: number) => {
    enrollCourse(id);
    setTick(t => t + 1);
  };

  // Wishlist courses not yet enrolled
  const wishlist: number[] = LS.get('nm_wishlist', []);
  const wishlistNotEnrolled = ALL_COURSES.filter(c => wishlist.includes(c.id) && !enrolled.includes(c.id));

  const regEvents = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_registered_events')||'[]'); } catch { return []; } }, []);
  const regExams  = useMemo(() => { try { return JSON.parse(localStorage.getItem('nm_exam_registrations')||'[]'); } catch { return []; } }, []);
  const accentColor = '#7c3aed';

  const SIDEBAR_NAV = [
    { id:'dashboard',    label:'Dashboard',    icon:<LayoutDashboard size={16}/>, path:'/portal/student?tab=dashboard' },
    { id:'courses',      label:'My Learning',  icon:<Play size={16}/>,            path:'/my-learning' },
    { id:'projects',     label:'Projects',     icon:<FolderGit2 size={16}/>,       path:'/portal/student?tab=projects' },
    { id:'internships',  label:'Internships',  icon:<Briefcase size={16}/>,       path:'/portal/student?tab=internships' },
    { id:'events',       label:'Events',       icon:<Calendar size={16}/>,        path:'/portal/student?tab=events' },
    { id:'exams',        label:'Exams',        icon:<FileText size={16}/>,        path:'/portal/student?tab=exams' },
    { id:'jobs',         label:'Jobs',         icon:<Building2 size={16}/>,       path:'/portal/student?tab=jobs' },
    { id:'mentors',      label:'Mentors',      icon:<Users size={16}/>,           path:'/portal/student?tab=mentors' },
    { id:'leaderboard',  label:'Leaderboard',  icon:<Trophy size={16}/>,          path:'/portal/student?tab=leaderboard' },
    { id:'certificates', label:'Certificates', icon:<Award size={16}/>,           path:'/portal/student?tab=certificates' },
    { id:'resume',       label:'Resume Studio', icon:<FileText size={16}/>,       path:'/portal/student?tab=resume', badge:'8 Styles' },
    { id:'profile',      label:'My Profile',   icon:<User size={16}/>,            path:'/portal/student?tab=profile' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>
      {/* ── SIDEBAR ── */}
      <aside style={{ width:230, flexShrink:0, position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto', borderRight:'1px solid var(--border)', background:'var(--surface)', display:'flex', flexDirection:'column', padding:'16px 10px' }}>
        {/* User Card */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:13, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', marginBottom:20 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16, color:'#fff', flexShrink:0 }}>
            {user.name[0].toUpperCase()}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:10.5, color:'var(--accent)', fontWeight:600 }}>🎓 Student</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex:1 }}>
          {SIDEBAR_NAV.map(n => {
            const active = n.id === 'courses';
            return (
              <button key={n.id} onClick={() => navigate(n.path)}
                style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:active?700:500, color:active?'var(--accent)':'var(--text-2)', background:active?'rgba(124,58,237,0.1)':'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'all 0.15s', borderLeft:active?'3px solid var(--accent)':'3px solid transparent' }}
                onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.background='transparent'; }}>
                {n.icon} {n.label}
                {n.id === 'events'  && regEvents.length  > 0 && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:800, background:'#10b981', color:'#fff', borderRadius:999, padding:'1px 6px' }}>{regEvents.length}</span>}
                {n.id === 'exams'   && regExams.length   > 0 && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:800, background:'#7c3aed', color:'#fff', borderRadius:999, padding:'1px 6px' }}>{regExams.length}</span>}
                {n.id === 'courses' && wishlist.length   > 0 && <span style={{ marginLeft:'auto', fontSize:9.5, fontWeight:800, background:'#ef4444', color:'#fff', borderRadius:999, padding:'1px 6px' }}>{wishlist.length}</span>}
                {n.id === 'resume'  && <span style={{ marginLeft:'auto', fontSize:9, fontWeight:800, background:'rgba(99,102,241,0.2)', color:'#818cf8', borderRadius:999, padding:'1px 6px' }}>8 Styles</span>}
              </button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <button onClick={() => { logout(); navigate('/'); }}
          style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'9px 12px', borderRadius:9, fontSize:13, fontWeight:500, color:'#ef4444', background:'none', border:'none', cursor:'pointer', marginTop:8 }}>
          <LogOut size={15}/> Sign Out
        </button>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, minWidth:0, overflowY:'auto' }}>
        {/* ── HERO HEADER ── */}
        <div style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',padding:'40px 32px 32px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(79,70,229,0.1) 0%, transparent 50%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:1200,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <div style={{width:40,height:40,borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <BookOpen size={20} color="#fff"/>
                </div>
                <div>
                  <h1 style={{fontWeight:800,fontSize:22,color:'#fff',margin:0}}>My Learning</h1>
                  <p style={{fontSize:11.5,color:'rgba(255,255,255,0.5)',margin:0}}>Track your progress, earn certificates</p>
                </div>
              </div>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:13.5,marginBottom:0}}>
                Welcome back, <strong style={{color:'#c4b5fd'}}>{user.name.split(' ')[0]}</strong>! Keep the momentum going 🚀
              </p>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowEnrollModal(true)}
                style={{padding:'10px 20px',borderRadius:11,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',display:'flex',alignItems:'center',gap:7,boxShadow:'0 4px 16px rgba(124,58,237,0.4)'}}>
                <BookOpen size={14}/> Browse Courses
              </button>
              <Link to="/courses" style={{padding:'10px 18px',borderRadius:11,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',fontWeight:600,fontSize:13,textDecoration:'none',display:'flex',alignItems:'center',gap:6}}>
                Explore All <ChevronRight size={13}/>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12,marginTop:28}}>
            {[
              {icon:<Flame size={16} color="#f59e0b"/>, label:'Day Streak', value:streak||1, color:'#f59e0b', suffix:'days'},
              {icon:<BookOpen size={16} color="#7c3aed"/>, label:'Enrolled', value:enrolled.length, color:'#7c3aed', suffix:'courses'},
              {icon:<CheckCircle size={16} color="#10b981"/>, label:'Completed', value:completed.length, color:'#10b981', suffix:'courses'},
              {icon:<Clock size={16} color="#3b82f6"/>, label:'Hours Learned', value:doneHours, color:'#3b82f6', suffix:'/ '+totalHours+'h'},
              {icon:<Award size={16} color="#f97316"/>, label:'Certificates', value:completed.length, color:'#f97316', suffix:'earned'},
              {icon:<TrendingUp size={16} color="#06b6d4"/>, label:'In Progress', value:inProgress.length, color:'#06b6d4', suffix:'courses'},
            ].map(s=>(
              <div key={s.label} style={{padding:'14px 16px',borderRadius:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',backdropFilter:'blur(10px)'}}>
                <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>{s.icon}<span style={{fontSize:11,color:'rgba(255,255,255,0.5)',fontWeight:600}}>{s.label}</span></div>
                <div style={{fontSize:24,fontWeight:900,color:s.color,lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:10.5,color:'rgba(255,255,255,0.4)',marginTop:2}}>{s.suffix}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 24px 80px'}}>

        {/* ── CONTINUE LEARNING CAROUSEL ── */}
        {inProgress.length > 0 && (
          <div style={{marginBottom:36}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <div>
                <h2 style={{fontWeight:800,fontSize:18,color:'var(--text)',margin:0,display:'flex',alignItems:'center',gap:8}}><Play size={16} color={accentColor}/>Continue Learning</h2>
                <p style={{fontSize:12.5,color:'var(--text-3)',marginTop:2}}>{inProgress.length} course{inProgress.length!==1?'s':''} in progress</p>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
              {inProgress.slice(0,3).map(c => (
                <CourseCard key={c.id} course={c} onContinue={handleContinue} onViewCert={handleViewCert}/>
              ))}
            </div>
          </div>
        )}

        {/* ── OVERALL PROGRESS BAR ── */}
        {enrolled.length > 0 && (
          <div style={{padding:'20px 24px',borderRadius:16,background:'var(--surface)',border:'1px solid var(--border)',marginBottom:32,display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <div style={{flex:1,minWidth:200}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:700,color:'var(--text)'}}>Overall Learning Progress</span>
                <span style={{fontSize:13,fontWeight:800,color:accentColor}}>{Math.round(doneHours/Math.max(totalHours,1)*100)}%</span>
              </div>
              <div style={{height:10,borderRadius:999,background:'var(--border)',overflow:'hidden'}}>
                <motion.div initial={{width:0}} animate={{width:`${Math.round(doneHours/Math.max(totalHours,1)*100)}%`}} transition={{duration:1,ease:'easeOut'}}
                  style={{height:'100%',borderRadius:999,background:`linear-gradient(90deg,${accentColor},#4f46e5)`}}/>
              </div>
              <div style={{display:'flex',gap:16,marginTop:8,fontSize:11.5,color:'var(--text-3)'}}>
                <span>✅ {completed.length} completed</span>
                <span>▶️ {inProgress.length} in progress</span>
                <span>⏸ {notStarted.length} not started</span>
              </div>
            </div>
            <div style={{display:'flex',gap:12,flexShrink:0}}>
              {[{v:completed.length,l:'Done',c:'#10b981'},{v:inProgress.length,l:'Active',c:accentColor},{v:notStarted.length,l:'Queued',c:'#f59e0b'}].map(s=>(
                <div key={s.l} style={{textAlign:'center',padding:'10px 16px',borderRadius:11,background:'var(--bg)',border:`1px solid ${s.c}20`}}>
                  <div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FILTER BAR ── */}
        {enrolled.length > 0 && (
          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
            <div style={{position:'relative',flex:'1 1 180px',minWidth:160}}>
              <Search size={13} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-3)',pointerEvents:'none'}}/>
              <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search your courses…" style={{paddingLeft:32,fontSize:13}}/>
            </div>
            <select className="inp" value={filterStatus} onChange={e=>setFilterStatus(e.target.value as any)} style={{fontSize:12.5,width:'auto'}}>
              <option value="all">All Courses</option>
              <option value="in-progress">▶️ In Progress</option>
              <option value="completed">✅ Completed</option>
              <option value="not-started">⏸ Not Started</option>
            </select>
            <select className="inp" value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{fontSize:12.5,width:'auto'}}>
              <option value="all">All Categories</option>
              {['engineering','arts','agriculture','medicine','commerce','science'].map(c=>(
                <option key={c} value={c}>{CAT_ICON[c]} {c.charAt(0).toUpperCase()+c.slice(1)}</option>
              ))}
            </select>
            <span style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>{filtered.length} course{filtered.length!==1?'s':''}</span>
          </div>
        )}

        {/* ── ALL COURSES GRID ── */}
        {enrolled.length > 0 ? (
          filtered.length > 0 ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:40}}>
              <AnimatePresence>
                {filtered.map(c => <CourseCard key={c.id} course={c} onContinue={handleContinue} onViewCert={handleViewCert}/>)}
              </AnimatePresence>
            </div>
          ) : (
            <div style={{textAlign:'center',padding:48,borderRadius:16,background:'var(--surface)',border:'1px dashed var(--border)',marginBottom:40,color:'var(--text-3)',fontSize:14}}>
              No courses match your filters
            </div>
          )
        ) : (
          <div style={{textAlign:'center',padding:'60px 24px',borderRadius:20,background:'var(--surface)',border:'1px dashed var(--border)',marginBottom:40}}>
            <div style={{fontSize:64,marginBottom:16}}>📚</div>
            <h3 style={{fontWeight:800,fontSize:20,color:'var(--text)',marginBottom:8}}>Start your learning journey</h3>
            <p style={{color:'var(--text-3)',fontSize:13.5,marginBottom:24,maxWidth:400,margin:'0 auto 24px'}}>
              Enroll in courses to track your progress, earn certificates, and build your career.
            </p>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <button onClick={()=>setShowEnrollModal(true)}
                style={{padding:'11px 24px',borderRadius:12,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer'}}>
                🚀 Browse Courses
              </button>
              <Link to="/courses" style={{padding:'11px 24px',borderRadius:12,background:'var(--bg)',border:'1px solid var(--border)',color:'var(--text)',fontWeight:600,fontSize:14,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6}}>
                Explore All <ChevronRight size={13}/>
              </Link>
            </div>
          </div>
        )}

        {/* ── WISHLIST QUICK ENROLL ── */}
        {wishlistNotEnrolled.length > 0 && (
          <div style={{marginBottom:36}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <Heart size={16} color="#ef4444"/>
              <h2 style={{fontWeight:800,fontSize:17,color:'var(--text)',margin:0}}>From Your Wishlist</h2>
              <span style={{fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:999,background:'rgba(239,68,68,0.1)',color:'#ef4444'}}>{wishlistNotEnrolled.length}</span>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {wishlistNotEnrolled.slice(0,5).map(c=><RecommendCard key={c.id} course={c} onEnroll={handleEnroll}/>)}
            </div>
          </div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
            <Zap size={16} color="#f59e0b"/>
            <h2 style={{fontWeight:800,fontSize:17,color:'var(--text)',margin:0}}>Recommended For You</h2>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {recommendations.map(c=><RecommendCard key={c.id} course={c} onEnroll={handleEnroll}/>)}
          </div>
        </div>
      </div>

      {/* ── ENROLL MODAL ── */}
      <AnimatePresence>
        {showEnrollModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:1000,display:'flex',alignItems:'flex-end',justifyContent:'center',backdropFilter:'blur(4px)'}}
            onClick={e=>{if(e.target===e.currentTarget)setShowEnrollModal(false);}}>
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:28,stiffness:300}}
              style={{width:'100%',maxWidth:600,background:'var(--surface)',borderRadius:'20px 20px 0 0',padding:'24px',maxHeight:'80vh',overflowY:'auto'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                <h3 style={{fontWeight:800,fontSize:18,color:'var(--text)',margin:0}}>Quick Enroll</h3>
                <button onClick={()=>setShowEnrollModal(false)} style={{background:'none',border:'none',color:'var(--text-3)',cursor:'pointer',fontSize:18}}>✕</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {ALL_COURSES.filter(c=>!enrolled.includes(c.id)).sort((a,b)=>b.rating-a.rating).slice(0,12).map(c=>(
                  <RecommendCard key={c.id} course={c} onEnroll={(id)=>{handleEnroll(id);}}/>
                ))}
              </div>
              <div style={{marginTop:16,textAlign:'center'}}>
                <Link to="/courses" onClick={()=>setShowEnrollModal(false)}
                  style={{fontSize:13.5,fontWeight:700,color:accentColor,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:5}}>
                  Browse All 300+ Courses <ChevronRight size={14}/>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL: COURSE CERTIFICATE VIEWER FOR STUDENT ── */}
      {viewingCert && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewingCert(null);
          }}
        >
          <div style={{ width: '100%', maxWidth: 880, background: 'var(--surface)', borderRadius: 20, padding: '24px 26px', maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <span style={{ fontSize:10.5, fontWeight:800, padding:'2px 8px', borderRadius:99, background:'rgba(16,185,129,0.12)', color:'#10b981' }}>
                    🎓 Official Course Completion Credential · 100% Verified
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  {viewingCert.eventTitle}
                </h3>
                <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                  Awarded to <strong>{viewingCert.studentName || user?.name || 'nithish'}</strong> · ID: {viewingCert.credentialId}
                </span>
              </div>
              <button
                onClick={() => setViewingCert(null)}
                style={{ padding: '6px 14px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight:700, fontSize:12 }}
              >
                ✕ Close
              </button>
            </div>

            <div id="modal-mylearn-certificate-content" style={{ maxWidth: 820, margin: '0 auto 20px' }}>
              <CertificateRenderer
                template={getAllCertificateTemplates().find((t) => t.id === viewingCert.templateId) || getAllCertificateTemplates()[0]}
                studentName={viewingCert.studentName || user?.name || 'nithish'}
                eventTitle={viewingCert.eventTitle}
                issueDate={viewingCert.issueDate}
                credentialId={viewingCert.credentialId}
                issuerName={viewingCert.issuer}
                achievementRank={viewingCert.achievementRank}
                signers={viewingCert.signers}
                customBgImage={viewingCert.customBgImage}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap:'wrap' }}>
              <button
                onClick={() => {
                  const el = document.querySelector('#modal-mylearn-certificate-content .certificate-print-card') || document.querySelector('.certificate-print-card');
                  if (el) printCertificateWindow(el.outerHTML, viewingCert.eventTitle);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '11px 26px',
                  borderRadius: 11, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff',
                  fontWeight: 800, fontSize: 13.5, cursor: 'pointer', boxShadow:'0 4px 18px rgba(16,185,129,0.3)',
                }}
              >
                <Download size={15} /> Download PDF Certificate
              </button>
              <button
                onClick={() => {
                  const el = document.querySelector('#modal-mylearn-certificate-content .certificate-print-card') || document.querySelector('.certificate-print-card');
                  if (el) printCertificateWindow(el.outerHTML, viewingCert.eventTitle);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px',
                  borderRadius: 11, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                <Printer size={15} /> Print Certificate
              </button>
              <button
                onClick={() => {
                  navigate('/portal/student');
                }}
                style={{
                  padding: '11px 20px', borderRadius: 11, background: 'var(--bg-2)',
                  border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                Go to Student Portal →
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
