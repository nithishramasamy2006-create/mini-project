import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '../hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Award, Star, Clock, Users, TrendingUp, MapPin, Flame, Bookmark } from 'lucide-react';
import { PROJECTS, CATEGORIES } from '../data';
import ApplyModal from '../components/ApplyModal';

const DIFFS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const SORTS = [{ val:'newest', label:'Most Recent' },{ val:'stipend', label:'Highest Stipend' },{ val:'rating', label:'Top Rated' }];
const DIFF_COLOR: Record<string,string> = { Beginner:'#10b981', Intermediate:'#3b82f6', Advanced:'#ec4899', Expert:'#f59e0b' };

export default function ProjectsPage() {
  const [q, setQ]       = useState('');
  const dQ               = useDebounce(q, 180); // debounced query — used for filtering
  const [cat, setCat]   = useState('all');
  const [diff, setDiff] = useState('All Levels');
  const [sort, setSort] = useState('newest');
  const [ppo, setPpo]   = useState(false);
  const [applyItem, setApplyItem] = useState<typeof PROJECTS[0] | null>(null);
  const openApply  = useCallback((p: typeof PROJECTS[0]) => setApplyItem(p), []);
  const closeApply = useCallback(() => setApplyItem(null), []);

  const filtered = useMemo(() => {
    let list = PROJECTS.filter(p => {
      if (dQ && !p.title.toLowerCase().includes(dQ.toLowerCase()) && !p.company.toLowerCase().includes(dQ.toLowerCase()) && !p.skills.some(s => s.toLowerCase().includes(dQ.toLowerCase()))) return false;
      if (cat !== 'all' && p.category !== cat) return false;
      if (diff !== 'All Levels' && p.difficulty !== diff) return false;
      if (ppo && !p.ppo) return false;
      return true;
    });
    if (sort === 'stipend') list = [...list].sort((a,b) => parseInt(b.stipend.replace(/\D/g,'')) - parseInt(a.stipend.replace(/\D/g,'')));
    if (sort === 'rating') list = [...list].sort((a,b) => b.rating - a.rating);
    return list;
  }, [dQ, cat, diff, sort, ppo]);

  return (
    <div className="page" style={{ minHeight:'100vh', paddingTop:60 }}>

      {/* ── PAGE BANNER ── */}
      <div className="banner mesh-bg" style={{ background:'linear-gradient(180deg,rgba(12,20,40,0.6) 0%,transparent 100%)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(124,58,237,0.1), transparent)' }} />
        <div className="container banner-inner">
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <span className="chip chip-violet" style={{ marginBottom:14, display:'inline-flex' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa', animation:'pulse 2s ease-in-out infinite' }} />
                {PROJECTS.length} Live Projects
              </span>
              <h1 className="font-display" style={{ fontWeight:700, fontSize:'clamp(30px,5vw,54px)', color:'#e8edf5', letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:10 }}>
                Find Your Perfect<br /><span className="g-violet">Micro-Project</span>
              </h1>
              <p style={{ color:'var(--text-2)', fontSize:15, maxWidth:520 }}>
                Real industry projects from 180+ companies. Build. Learn. Earn. Get certified.
              </p>
            </div>
            {/* Quick stats */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[{ v:'₹25K', l:'Max Stipend' },{ v:'16 wks', l:'Max Duration' },{ v:'94%', l:'Completion' }].map(s=>(
                <div key={s.l} className="glass" style={{ padding:'12px 18px', borderRadius:14, textAlign:'center', minWidth:80 }}>
                  <div className="font-display" style={{ fontWeight:700, fontSize:18, color:'#e8edf5' }}>{s.v}</div>
                  <div style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:28, paddingBottom:64 }}>
        <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>

          {/* ── SIDEBAR ── */}
          <aside style={{ width:234, flexShrink:0, position:'sticky', top:76, maxHeight:'calc(100vh - 96px)', overflowY:'auto', scrollbarWidth:'thin' }} id="proj-sidebar">
            <div className="glass-heavy" style={{ borderRadius:18, padding:18 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                <span className="font-display" style={{ fontWeight:700, color:'var(--text)', fontSize:13, display:'flex', alignItems:'center', gap:7 }}>
                  <SlidersHorizontal size={14} color="#a78bfa" /> Filters
                </span>
                {(cat!=='all'||diff!=='All Levels'||ppo) && (
                  <button onClick={()=>{setCat('all');setDiff('All Levels');setPpo(false);}}
                    style={{ fontSize:11, color:'#fca5a5', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
                    <X size={10} /> Clear
                  </button>
                )}
              </div>

              <p style={{ fontSize:10, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Domain</p>
              <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:22 }}>
                {CATEGORIES.map(c=>(
                  <button key={c.id} onClick={()=>setCat(c.id)}
                    className={`s-item${cat===c.id?' on':''}`}>
                    <span style={{ fontSize:15 }}>{c.icon}</span>
                    <span style={{ flex:1, textAlign:'left', fontSize:12.5 }}>{c.label}</span>
                    {cat===c.id && <span style={{ width:5, height:5, borderRadius:'50%', background:'#a78bfa', flexShrink:0 }} />}
                  </button>
                ))}
              </div>

              <p style={{ fontSize:10, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Difficulty</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:22 }}>
                {DIFFS.map(d=>(
                  <button key={d} onClick={()=>setDiff(d)}
                    style={{ padding:'5px 11px', borderRadius:8, fontSize:11, fontWeight:600, cursor:'pointer', transition:'all .18s',
                      background: diff===d ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.04)',
                      border: diff===d ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      color: diff===d ? '#c4b5fd' : 'var(--text-3)' }}>
                    {d}
                  </button>
                ))}
              </div>

              <p style={{ fontSize:10, color:'var(--text-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Perks</p>
              <div className="toggle-wrap" onClick={()=>setPpo(!ppo)}>
                <div className={`toggle-track${ppo?' on':''}`}><div className="toggle-thumb" /></div>
                <span style={{ fontSize:12.5, color:'var(--text-2)', fontWeight:500 }}>PPO Eligible Only</span>
              </div>
            </div>
          </aside>

          {/* ── MAIN ── */}
          <div style={{ flex:1, minWidth:0 }}>
            {/* Search + Sort + Cat pills */}
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                <div style={{ position:'relative', flex:'1 1 260px' }}>
                  <Search size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
                  <input className="inp" value={q} onChange={e=>setQ(e.target.value)}
                    placeholder="Search projects, skills, companies…" style={{ paddingLeft:40 }} />
                  {q && <button onClick={()=>setQ('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer' }}><X size={13} color="var(--text-3)" /></button>}
                </div>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <select value={sort} onChange={e=>setSort(e.target.value)} className="inp" style={{ minWidth:155, paddingRight:36 }}>
                    {SORTS.map(s=><option key={s.val} value={s.val}>{s.label}</option>)}
                  </select>
                  <ChevronDown size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
                </div>
              </div>

              {/* Category pills */}
              <div style={{ display:'flex', gap:7, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
                {CATEGORIES.map(c=>(
                  <button key={c.id} onClick={()=>setCat(c.id)} className={`pill${cat===c.id?' on':''}`}
                    style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:14 }}>{c.icon}</span>{c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result count */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <p style={{ fontSize:13, color:'var(--text-3)' }}>
                <span style={{ color:'var(--text)', fontWeight:700 }}>{filtered.length}</span> projects found
              </p>
              {ppo && <span className="badge b-green" style={{ display:'flex', alignItems:'center', gap:4 }}><Award size={9}/> PPO Only</span>}
            </div>

            {/* Grid */}
              <AnimatePresence>
                {filtered.length>0 ? (
                  <motion.div key="grid" initial={{ opacity:0 }} animate={{ opacity:1 }}
                    style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:18 }}>
                    {filtered.map((p,i)=>(
                      <motion.article key={p.id}
                        initial={{ opacity:0, y:20 }}
                        whileInView={{ opacity:1, y:0 }}
                        viewport={{ once:true, margin:'-40px' }}
                        transition={{ duration:0.38, delay:Math.min(i*0.03, 0.24), ease:[0.22,1,0.36,1] }}
                      className="card-base"
                      style={{ display:'flex', flexDirection:'column', padding:0, overflow:'hidden' }}>

                      {/* Color accent top */}
                      <div style={{ height:2.5, background:`linear-gradient(90deg,${p.color},${p.color}50,transparent)` }} />

                      <div style={{ padding:'20px 20px 20px', display:'flex', flexDirection:'column', flex:1 }}>
                        {/* Company */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                            <div style={{ width:42, height:42, borderRadius:12, background:`${p.color}12`, border:`1px solid ${p.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, flexShrink:0 }}>{p.companyLogo}</div>
                            <div>
                              <div style={{ fontWeight:600, fontSize:13, color:'var(--text)', lineHeight:1.2 }}>{p.company}</div>
                              <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3 }}>
                                <MapPin size={9} color="var(--text-3)" />
                                <span style={{ fontSize:10.5, color:'var(--text-3)' }}>{p.location}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                            {p.featured && <span className="badge b-amber" style={{ display:'flex', alignItems:'center', gap:3, fontSize:9.5 }}><Flame size={8}/>Hot</span>}
                            {p.ppo && <span className="badge b-green" style={{ fontSize:9.5 }}>PPO</span>}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-display" style={{ fontWeight:700, fontSize:15.5, color:'var(--text)', lineHeight:1.3, marginBottom:9, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                          {p.title}
                        </h3>

                        {/* Desc */}
                        <p style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.65, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                          {p.description}
                        </p>

                        {/* Skills */}
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:15 }}>
                          {p.skills.slice(0,3).map(s=>(
                            <span key={s} style={{ padding:'2.5px 9px', borderRadius:999, fontSize:10, fontWeight:600, background:`${p.color}10`, color:p.color, border:`1px solid ${p.color}20` }}>{s}</span>
                          ))}
                          {p.skills.length>3 && <span className="badge b-violet" style={{ fontSize:9.5 }}>+{p.skills.length-3}</span>}
                        </div>

                        {/* Divider */}
                        <div className="divider-h" style={{ marginBottom:14 }} />

                        {/* Metrics */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14, textAlign:'center' }}>
                          <div>
                            <div className="font-mono" style={{ fontWeight:700, fontSize:13, color:'#c4b5fd', letterSpacing:'-0.02em' }}>{p.stipend}</div>
                            <div style={{ fontSize:9.5, color:'var(--text-3)', marginTop:2 }}>Stipend</div>
                          </div>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3 }}>
                              <Clock size={10} color="var(--text-3)" />
                              <span style={{ fontWeight:600, fontSize:12.5, color:'var(--text)' }}>{p.duration}</span>
                            </div>
                            <div style={{ fontSize:9.5, color:'var(--text-3)', marginTop:2 }}>Duration</div>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ padding:'2.5px 9px', borderRadius:999, fontSize:10, fontWeight:700, background:`${DIFF_COLOR[p.difficulty]||'#3b82f6'}15`, color:DIFF_COLOR[p.difficulty]||'#3b82f6', border:`1px solid ${DIFF_COLOR[p.difficulty]||'#3b82f6'}25` }}>{p.difficulty}</span>
                          </div>
                        </div>

                        {/* Rating + enrolled */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                            <div style={{ display:'flex', gap:2 }}>
                              {[...Array(5)].map((_,j)=><Star key={j} size={10} fill={j<Math.round(p.rating)?'#f59e0b':'none'} color={j<Math.round(p.rating)?'#f59e0b':'#2d3d55'} />)}
                            </div>
                            <span style={{ fontWeight:700, fontSize:11.5, color:'var(--text)' }}>{p.rating}</span>
                            <span style={{ fontSize:10.5, color:'var(--text-3)' }}>({p.reviews})</span>
                          </div>
                          <span style={{ fontSize:11, color:'var(--text-3)', display:'flex', alignItems:'center', gap:4 }}><Users size={10} />{p.enrolled}</span>
                        </div>

                        {/* Mentor */}
                        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 11px', borderRadius:11, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)', marginBottom:14 }}>
                          <div style={{ width:26, height:26, borderRadius:'50%', background:`linear-gradient(135deg,${p.color},${p.color}70)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9.5, fontWeight:800, color:'#fff', flexShrink:0 }}>
                            {p.mentor.split(' ').map(w=>w[0]).join('').slice(0,2)}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:11.5, fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.mentor}</div>
                            <div style={{ fontSize:10, color:'var(--text-3)' }}>{p.mentorRole}</div>
                          </div>
                        </div>

                        {/* Spots + deadline */}
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:6, height:6, borderRadius:'50%', background:p.spots<=2?'#ef4444':'#10b981', animation:p.spots<=2?'pulse 1.3s ease-in-out infinite':'none' }} />
                            <span style={{ fontSize:11.5, fontWeight:600, color:p.spots<=2?'#fca5a5':'#6ee7b7' }}>{p.spots} spot{p.spots!==1?'s':''} left</span>
                          </div>
                          <span style={{ fontSize:10.5, color:'var(--text-3)' }}>Due {p.deadline}</span>
                        </div>

                        {/* CTA */}
                        <div style={{ display:'flex', gap:7, marginTop:'auto' }}>
                          <button
                            className="btn btn-primary"
                          onClick={() => openApply(p)}
                            style={{ flex:1, fontSize:12.5, padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                            <TrendingUp size={13} /> Apply Now
                          </button>
                          <button className="btn btn-ghost btn-icon" style={{ flexShrink:0 }}><Bookmark size={14} /></button>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className="glass-heavy" style={{ borderRadius:20, padding:'64px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
                  <h3 className="font-display" style={{ fontWeight:700, color:'var(--text)', fontSize:20, marginBottom:8 }}>No projects match</h3>
                  <p style={{ color:'var(--text-2)', marginBottom:20 }}>Try adjusting your filters or search query</p>
                  <button onClick={()=>{setQ('');setCat('all');setDiff('All Levels');setPpo(false);}} className="btn btn-primary btn-sm">Reset All Filters</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { #proj-sidebar { display: none !important; } }
      `}</style>

      {/* Always mounted — avoids re-mount flicker on open */}
      <ApplyModal
        open={!!applyItem}
        onClose={closeApply}
        type="project"
        itemId={applyItem?.id ?? 0}
        itemTitle={applyItem?.title ?? ''}
        itemCompany={applyItem?.company ?? ''}
        color={applyItem?.color}
      />
    </div>
  );
}
