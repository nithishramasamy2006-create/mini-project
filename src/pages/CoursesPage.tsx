import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, User, BookOpen, Heart, Star, MessageSquare,
  HelpCircle, LogOut, Bell, Settings, Search, ChevronDown,
  Users, Award, Play, ArrowRight, Filter, X
} from 'lucide-react';
import { ALL_COURSES, COURSE_CATEGORIES, IMG_POOL, type CourseItem } from '../courseData';
import { useAuth } from '../AuthContext';

// ── Image URL builder ─────────────────────────────────────
const imgUrl = (c: CourseItem) =>
  `https://images.unsplash.com/${c.imageId}?w=480&q=75&auto=format&fit=crop`;

const LEVEL_COLOR: Record<string, string> = {
  Beginner: '#10b981', Intermediate: '#3b82f6', Advanced: '#ec4899',
};

const SORT_OPTIONS = ['Latest', 'Top Rated', 'Most Students'];
const SUBCATS: Record<string, string[]> = {
  engineering: ['All Subcategories','Computer Science','Artificial Intelligence','Cloud Computing','Cybersecurity','Electronics','Mechanical','Civil','Chemical','Electrical'],
  arts:        ['All Subcategories','Fine Arts','Literature','Music','Performing Arts','Film Studies','Visual Arts','History','Philosophy','Media','Linguistics'],
  agriculture: ['All Subcategories','Crop Science','Soil Science','Horticulture','Animal Science','Fisheries','Food Technology','Organic Farming','Agribusiness','Agricultural Technology'],
  medicine:    ['All Subcategories','Basic Sciences','Nursing','Pharmacology','Public Health','Traditional Medicine','Lab Technology','Allied Health','Nutrition','Health Management','Radiology'],
  commerce:    ['All Subcategories','Accounting','Taxation','Marketing','Finance','E-Commerce','HR Management','Management','Entrepreneurship','Banking','Business Law','Operations'],
  science:     ['All Subcategories','Physics','Chemistry','Mathematics','Biology','Biotechnology','Environmental Science','Competitive Exams','General Science'],
};

export default function CoursesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeCat, setActiveCat]   = useState('all');
  const [subcat,    setSubcat]      = useState('All Subcategories');
  const [q,         setQ]           = useState('');
  const [sortBy,    setSortBy]      = useState('Latest');
  const [imgErr,    setImgErr]      = useState<Record<number, boolean>>({});
  const [wishlist,  setWishlist]    = useState<Set<number>>(new Set());

  const toggleWishlist = (id: number) =>
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });


  const filtered = useMemo(() => {
    let list = ALL_COURSES.filter(c => {
      if (activeCat !== 'all' && c.category !== activeCat) return false;
      if (subcat !== 'All Subcategories' && c.subcategory !== subcat) return false;
      if (q && !c.title.toLowerCase().includes(q.toLowerCase()) &&
               !c.instructor.toLowerCase().includes(q.toLowerCase()) &&
               !c.subcategory.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sortBy === 'Top Rated')    list = [...list].sort((a,b) => b.rating - a.rating);
    if (sortBy === 'Most Students') list = [...list].sort((a,b) => b.students - a.students);
    return list;
  }, [activeCat, subcat, q, sortBy]);

  const activeCatObj = COURSE_CATEGORIES.find(c => c.id === activeCat)!;
  const subcatList   = activeCat === 'all' ? [] : (SUBCATS[activeCat] || []);

  const StarRow = ({ rating }: { rating: number }) => (
    <span style={{ display:'flex', alignItems:'center', gap:3 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11}
          fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.round(rating) ? '#f59e0b' : 'var(--text-3)'}
          strokeWidth={1.5} />
      ))}
      <span style={{ fontSize:12, fontWeight:600, color:'var(--text-2)', marginLeft:2 }}>{rating}</span>
    </span>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', paddingTop:60, background:'var(--bg)' }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside id="course-sidebar" style={{
        width:228, flexShrink:0, position:'sticky', top:60,
        height:'calc(100vh - 60px)', overflowY:'auto',
        borderRight:'1px solid var(--border)', background:'var(--surface)',
        display:'flex', flexDirection:'column', padding:'18px 10px',
      }}>
        {/* User card */}
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:'#fff', flexShrink:0 }}>
              {user.name[0].toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:12.5, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
              <div style={{ fontSize:10, color:'var(--text-3)' }}>Student</div>
            </div>
          </div>
        )}
        {!user && (
          <div style={{ marginBottom:20 }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:13, padding:'10px' }}>
              Sign In
            </button>
          </div>
        )}

        <p style={{ fontSize:9.5, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0 10px', marginBottom:8 }}>Main Page</p>
        <nav style={{ marginBottom:22 }}>
          {[
            { label:'Home',        to:'/',          Icon: Home },
            { label:'My Profile',  to:'#profile',   Icon: User },
            { label:'Courses',     to:'/courses',   Icon: BookOpen },
            { label:'Wishlist',    to:'#wishlist',  Icon: Heart },
            { label:'Reviews',     to:'#reviews',   Icon: Star },
            { label:'Q & A',       to:'#qa',        Icon: MessageSquare },
          ].map(({ label, to, Icon }) => (
            <NavLink key={label} to={to} end={to==='/'} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:9, padding:'8px 12px', borderRadius:9, marginBottom:2,
              fontSize:13, fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              background: isActive ? 'rgba(124,58,237,0.1)' : 'transparent',
              textDecoration:'none', transition:'all 0.15s',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            })}>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>

        <p style={{ fontSize:9.5, fontWeight:700, color:'var(--text-3)', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0 10px', marginBottom:8 }}>Account</p>
        <nav style={{ flex:1 }}>
          {[
            { label:'Notifications', Icon: Bell },
            { label:'Settings',      Icon: Settings },
          ].map(({ label, Icon }) => (
            <button key={label} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:500, color:'var(--text-2)', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='var(--border)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='none'}>
              <Icon size={15} /> {label}
            </button>
          ))}
          {user && (
            <button onClick={() => { logout(); navigate('/'); }}
              style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 12px', borderRadius:9, marginBottom:2, fontSize:13, fontWeight:500, color:'#ef4444', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(239,68,68,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='none'}>
              <LogOut size={15} /> Logout
            </button>
          )}
        </nav>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, marginTop:'auto' }}>
          <button style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px', borderRadius:9, background:'none', border:'none', cursor:'pointer', fontSize:13, color:'var(--text-2)', fontWeight:500 }}>
            <HelpCircle size={14} /> Help Center <ArrowRight size={11} style={{ marginLeft:'auto' }} />
          </button>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════ */}
      <main style={{ flex:1, minWidth:0, padding:'24px 28px 60px', overflowY:'auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <div>
            <h1 className="font-display" style={{ fontWeight:700, fontSize:26, color:'var(--text)', letterSpacing:'-0.03em', marginBottom:2 }}>
              {activeCatObj.icon} {activeCatObj.label}
            </h1>
            <p style={{ fontSize:12.5, color:'var(--text-3)' }}>
              {filtered.length} courses available
              {q && <span> · matching "<strong style={{ color:'var(--accent)' }}>{q}</strong>"</span>}
            </p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {q && (
              <button onClick={() => setQ('')} className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:5 }}>
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', marginBottom:20, paddingBottom:4 }}>
          {COURSE_CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCat(cat.id); setSubcat('All Subcategories'); }}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'8px 16px',
                borderRadius:999, whiteSpace:'nowrap', cursor:'pointer', fontSize:13, fontWeight:600,
                border:`1.5px solid ${activeCat===cat.id ? cat.color : 'var(--border)'}`,
                background: activeCat===cat.id ? `${cat.color}15` : 'var(--surface)',
                color: activeCat===cat.id ? cat.color : 'var(--text-2)',
                transition:'all 0.2s',
              }}>
              <span>{cat.icon}</span>
              {cat.label}
              <span style={{ fontSize:10.5, fontWeight:700, padding:'1px 7px', borderRadius:999, background: activeCat===cat.id ? `${cat.color}22` : 'var(--border)', color: activeCat===cat.id ? cat.color : 'var(--text-3)' }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Search + Sort + Subcat row ── */}
        <div style={{ display:'flex', gap:10, marginBottom:22, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1 1 240px', minWidth:180 }}>
            <Search size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
            <input id="course-search" className="inp" value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search courses, instructors…" style={{ paddingLeft:40, fontSize:13.5 }} />
          </div>
          {subcatList.length > 0 && (
            <div style={{ position:'relative', flexShrink:0 }}>
              <select className="inp" value={subcat} onChange={e => setSubcat(e.target.value)}
                style={{ paddingRight:34, paddingLeft:12, fontSize:13, minWidth:180 }}>
                {subcatList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={13} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
            </div>
          )}
          <div style={{ position:'relative', flexShrink:0 }}>
            <select className="inp" value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ paddingRight:34, paddingLeft:12, fontSize:13, minWidth:138 }}>
              {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown size={13} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
          </div>
        </div>

        {/* ── Course Grid ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'60px 20px' }}>
              <div style={{ fontSize:56, marginBottom:14 }}>📚</div>
              <h3 className="font-display" style={{ fontSize:20, fontWeight:700, color:'var(--text)', marginBottom:8 }}>No courses found</h3>
              <p style={{ color:'var(--text-2)', marginBottom:20 }}>Try adjusting search or category</p>
              <button onClick={() => { setQ(''); setSubcat('All Subcategories'); }} className="btn btn-primary btn-sm">Clear Filters</button>
            </motion.div>
          ) : (
            <motion.div key={activeCat+subcat+sortBy}
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.3 }}
              style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(268px,1fr))', gap:20 }}>
              {filtered.map((course, i) => (
                <motion.div key={course.id}
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.35, delay:Math.min(i,12)*0.04, ease:[0.22,1,0.36,1] }}
                  style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', cursor:'pointer', transition:'box-shadow 0.22s, border-color 0.22s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow='0 8px 28px rgba(0,0,0,0.12)'; el.style.borderColor='rgba(124,58,237,0.25)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow='none'; el.style.borderColor='var(--border)'; }}>

                  {/* ── Thumbnail ── */}
                  <div style={{ position:'relative', height:172, overflow:'hidden', background: course.id % 6 === 0 ? '#0f172a' : '#1e1b4b' }}>
                    {!imgErr[course.id] ? (
                      <img
                        src={imgUrl(course)}
                        alt={course.title}
                        loading="lazy"
                        onError={() => setImgErr(prev => ({ ...prev, [course.id]: true }))}
                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                      />
                    ) : (
                      // Fallback gradient with icon
                      <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg, ${COURSE_CATEGORIES.find(c=>c.id===course.category)?.color}33, #0f172a)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56 }}>
                        {COURSE_CATEGORIES.find(c=>c.id===course.category)?.icon}
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="play-overlay" style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0.4)'; const pb = (e.currentTarget as HTMLElement).querySelector('.pb') as HTMLElement; if(pb) pb.style.opacity='1'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(0,0,0,0)'; const pb = (e.currentTarget as HTMLElement).querySelector('.pb') as HTMLElement; if(pb) pb.style.opacity='0'; }}>
                      <div className="pb" style={{ width:46, height:46, borderRadius:'50%', background:'rgba(124,58,237,0.92)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s' }}>
                        <Play size={20} color="#fff" fill="#fff" />
                      </div>
                    </div>
                    {/* NM badge */}
                    {course.naan_certified && (
                      <div style={{ position:'absolute', top:9, right:9, display:'flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, fontSize:10, fontWeight:700, color:'#fff', background:'rgba(124,58,237,0.9)', backdropFilter:'blur(6px)' }}>
                        <Award size={9} /> NM Certified
                      </div>
                    )}
                  </div>

                  {/* ── Card body ── */}
                  <div style={{ padding:'14px 16px 16px' }}>
                    {/* Category label + Stars */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
                      <span style={{ fontSize:10, fontWeight:800, color: COURSE_CATEGORIES.find(c=>c.id===course.category)?.color, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                        {course.subcategory}
                      </span>
                      <StarRow rating={course.rating} />
                    </div>

                    {/* Title — NO instructor box */}
                    <h3 className="font-display" style={{ fontWeight:700, fontSize:14, color:'var(--text)', lineHeight:1.4, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:38 }}>
                      {course.title}
                    </h3>

                    {/* Divider */}
                    <div style={{ height:1, background:'var(--border)', marginBottom:12 }} />

                    {/* Students + Price */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13 }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-3)' }}>
                        <Users size={12} />
                        {course.students.toLocaleString()} students
                      </span>
                      <span style={{ fontWeight:800, fontSize:16, color:'var(--accent)' }}>
                        {course.price}
                      </span>
                    </div>

                    {/* Level chip */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13 }}>
                      <span style={{ fontSize:10.5, fontWeight:700, color: LEVEL_COLOR[course.level], background:`${LEVEL_COLOR[course.level]}15`, padding:'3px 9px', borderRadius:999 }}>
                        {course.level}
                      </span>
                      <span style={{ fontSize:11, color:'var(--text-3)' }}>⏱ {course.hours}h</span>
                    </div>

                    {/* Wishlist + Start Learning */}
                    <div style={{ display:'flex', gap:8 }}>
                      <button
                        onClick={() => toggleWishlist(course.id)}
                        title={wishlist.has(course.id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
                        style={{
                          flexShrink:0, padding:'9px 12px', borderRadius:10, cursor:'pointer',
                          border:`1.5px solid ${wishlist.has(course.id) ? '#ef4444' : 'var(--border)'}`,
                          background: wishlist.has(course.id) ? 'rgba(239,68,68,0.08)' : 'var(--bg-2)',
                          color: wishlist.has(course.id) ? '#ef4444' : 'var(--text-3)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          transition:'all 0.15s',
                        }}>
                        <Heart size={15} fill={wishlist.has(course.id) ? '#ef4444' : 'none'} />
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/learn/${course.id}`)}
                        style={{ flex:1, justifyContent:'center', padding:'9px', fontSize:13.5, borderRadius:10 }}>
                        ▶ Start Learning
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>


      <style>{`
        @media (max-width: 768px) {
          #course-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
