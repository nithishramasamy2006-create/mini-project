import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { projects, categories, skills } from '../data';
import ProjectCard from './ProjectCard';

const SORTS = [
  { val: 'latest', label: 'Latest First' },
  { val: 'stipend', label: 'Highest Stipend' },
  { val: 'rating', label: 'Top Rated' },
];

const DIFFS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function ProjectsExplorer() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [diff, setDiff] = useState('All');
  const [selSkills, setSelSkills] = useState<string[]>([]);
  const [showF, setShowF] = useState(false);
  const [sort, setSort] = useState('latest');

  const toggleSkill = (s: string) =>
    setSelSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const filtered = projects
    .filter(p => {
      if (q && !p.title.toLowerCase().includes(q.toLowerCase()) && !p.company.toLowerCase().includes(q.toLowerCase()) && !p.skills.some(s => s.toLowerCase().includes(q.toLowerCase()))) return false;
      if (cat !== 'all' && p.category !== cat) return false;
      if (diff !== 'All' && p.difficulty !== diff) return false;
      if (selSkills.length && !selSkills.every(s => p.skills.some(ps => ps.toLowerCase().includes(s.toLowerCase())))) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'stipend') return parseInt(b.stipend.replace(/\D/g,'')) - parseInt(a.stipend.replace(/\D/g,''));
      if (sort === 'rating') return b.rating - a.rating;
      return b.id - a.id;
    });

  const activeFilters = (diff !== 'All' ? 1 : 0) + selSkills.length;

  return (
    <section id="explore" style={{ padding: '80px 0', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* Section header */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.55 }} style={{ textAlign:'center', marginBottom: 52 }}>
          <div className="section-tag">
            <span style={{ width:7,height:7,borderRadius:'50%',background:'#10b981',display:'inline-block' }} />
            {projects.length} Live Projects Available
          </div>
          <h2 className="font-display" style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:700, color:'#f1f5f9', letterSpacing:'-.025em', marginBottom:12 }}>
            Explore <span className="grad-text">Micro-Projects</span>
          </h2>
          <p style={{ fontSize:17, color:'#64748b', maxWidth:560, margin:'0 auto' }}>
            Handpicked industry projects aligned with the Naan Mudhalvan skill development framework.
          </p>
        </motion.div>

        {/* Search + Sort + Filter bar */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.45, delay:.1 }}
          style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:18 }}>

          {/* Search */}
          <div style={{ position:'relative', flex:'1 1 280px', minWidth:200 }}>
            <Search size={15} color="#475569" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
            <input className="inp" value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Search projects, companies, skills…"
              style={{ paddingLeft:40, paddingRight:q?36:14 }} />
            {q && <button onClick={()=>setQ('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#475569', display:'flex' }}><X size={14}/></button>}
          </div>

          {/* Sort */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{ appearance:'none', WebkitAppearance:'none', background:'rgba(13,18,32,0.8)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'11px 40px 11px 16px', fontSize:13, color:'#94a3b8', outline:'none', cursor:'pointer', minWidth:150 }}>
              {SORTS.map(s=><option key={s.val} value={s.val}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} color="#475569" style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
          </div>

          {/* Filter toggle */}
          <button onClick={()=>setShowF(!showF)} style={{
            display:'flex', alignItems:'center', gap:8, padding:'11px 18px', borderRadius:12, fontSize:13, fontWeight:600, cursor:'pointer',
            background: showF ? 'rgba(124,58,237,.18)' : 'rgba(13,18,32,0.8)',
            border: showF ? '1px solid rgba(124,58,237,.4)' : '1px solid rgba(255,255,255,.07)',
            color: showF ? '#a78bfa' : '#94a3b8',
            transition:'all .2s',
          }}>
            <SlidersHorizontal size={14} />
            Filters
            {activeFilters > 0 && <span style={{ width:18,height:18,borderRadius:'50%',background:'#7c3aed',color:'#fff',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center' }}>{activeFilters}</span>}
          </button>
        </motion.div>

        {/* Category pills */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:20, scrollbarWidth:'none' }}>
          {categories.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} style={{
              display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:12, fontSize:13, fontWeight:600, whiteSpace:'nowrap', flexShrink:0, cursor:'pointer', transition:'all .2s',
              background: cat===c.id ? 'rgba(124,58,237,.2)' : 'rgba(13,18,32,0.7)',
              border: cat===c.id ? '1px solid rgba(124,58,237,.45)' : '1px solid rgba(255,255,255,.07)',
              color: cat===c.id ? '#a78bfa' : '#64748b',
              boxShadow: cat===c.id ? '0 0 18px rgba(124,58,237,.18)' : 'none',
            }}>
              <span style={{ fontSize:16 }}>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>

        {/* Expandable filter panel */}
        <AnimatePresence>
          {showF && (
            <motion.div initial={{ height:0,opacity:0 }} animate={{ height:'auto',opacity:1 }} exit={{ height:0,opacity:0 }}
              transition={{ duration:.3, ease:[.22,1,.36,1] }} style={{ overflow:'hidden', marginBottom:20 }}>
              <div className="glass-2" style={{ borderRadius:18, padding:'22px 24px' }}>
                {/* Difficulty */}
                <div style={{ marginBottom:18 }}>
                  <p style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:'.12em', fontWeight:600, marginBottom:10 }}>Difficulty Level</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {DIFFS.map(d=>(
                      <button key={d} onClick={()=>setDiff(d)} style={{
                        padding:'6px 14px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .2s',
                        background: diff===d ? 'rgba(124,58,237,.22)' : 'rgba(255,255,255,.04)',
                        border: diff===d ? '1px solid rgba(124,58,237,.5)' : '1px solid rgba(255,255,255,.08)',
                        color: diff===d ? '#a78bfa' : '#64748b',
                      }}>{d}</button>
                    ))}
                  </div>
                </div>
                {/* Skills */}
                <div>
                  <p style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:'.12em', fontWeight:600, marginBottom:10 }}>Required Skills</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {skills.map(s=>(
                      <button key={s} onClick={()=>toggleSkill(s)} style={{
                        padding:'6px 14px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .2s',
                        background: selSkills.includes(s) ? 'rgba(124,58,237,.22)' : 'rgba(255,255,255,.04)',
                        border: selSkills.includes(s) ? '1px solid rgba(124,58,237,.5)' : '1px solid rgba(255,255,255,.08)',
                        color: selSkills.includes(s) ? '#a78bfa' : '#64748b',
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
                {activeFilters > 0 && (
                  <button onClick={()=>{setDiff('All');setSelSkills([]);}} style={{ marginTop:14, display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#f87171', background:'none', border:'none', cursor:'pointer' }}>
                    <X size={12}/> Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <p style={{ fontSize:13, color:'#475569' }}>Showing <span style={{ color:'#e2e8f0', fontWeight:600 }}>{filtered.length}</span> projects</p>
          {(q||cat!=='all'||diff!=='All'||selSkills.length>0) && (
            <button onClick={()=>{setQ('');setCat('all');setDiff('All');setSelSkills([]);}} style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#a78bfa', background:'none', border:'none', cursor:'pointer' }}>
              <X size={12}/> Reset all
            </button>
          )}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div key="grid" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:20 }}>
              {filtered.map((p,i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>🔍</div>
              <h3 style={{ fontSize:20, fontWeight:700, color:'#e2e8f0', marginBottom:8 }}>No projects found</h3>
              <p style={{ color:'#64748b' }}>Try adjusting your filters or search query</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
