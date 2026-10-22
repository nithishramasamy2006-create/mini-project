import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '../hooks';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Users, Bookmark, Star, ChevronDown } from 'lucide-react';
import { INTERNSHIPS, CATEGORIES } from '../data';
import ApplyModal from '../components/ApplyModal';

const TYPES = ['All Types','Paid','Certificate'];

export default function InternshipsPage() {
  const [q, setQ]       = useState('');
  const dQ               = useDebounce(q, 180);
  const [cat, setCat]   = useState('all');
  const [type, setType] = useState('All Types');
  const [applyItem, setApplyItem] = useState<typeof INTERNSHIPS[0] | null>(null);
  const openApply  = useCallback((i: typeof INTERNSHIPS[0]) => setApplyItem(i), []);
  const closeApply = useCallback(() => setApplyItem(null), []);

  const filtered = useMemo(() => INTERNSHIPS.filter(i => {
    if (dQ && !i.title.toLowerCase().includes(dQ.toLowerCase()) && !i.company.toLowerCase().includes(dQ.toLowerCase())) return false;
    if (cat !== 'all' && i.category !== cat) return false;
    if (type !== 'All Types' && i.type !== type) return false;
    return true;
  }), [dQ, cat, type]);

  return (
    <div className="page" style={{ minHeight:'100vh', paddingTop:60 }}>

      {/* ── BANNER ── */}
      <div className="banner" style={{ background:'linear-gradient(180deg,rgba(6,10,20,0.9) 0%,transparent 100%)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 100% at 30% 50%,rgba(37,99,235,0.09),transparent)' }} />
        <div className="mesh-bg" style={{ position:'absolute', inset:0, opacity:.35 }} />
        <div className="container banner-inner">
          <span className="chip chip-blue" style={{ display:'inline-flex', marginBottom:14 }}>💼 Industry Internships</span>
          <h1 className="font-display" style={{ fontWeight:700, fontSize:'clamp(30px,5vw,54px)', letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:10 }}>
            NM-Approved<br /><span className="g-blue">Internships</span>
          </h1>
          <p style={{ color:'var(--text-2)', fontSize:15, maxWidth:620, marginBottom:28 }}>
            Paid and certificate internships from 200+ companies exclusively for Tamil Nadu college students through the Naan Mudhalvan programme.
          </p>

          {/* KPI row */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {[
              { icon:'💼', val:'840+', label:'Active Internships', color:'#7c3aed' },
              { icon:'💰', val:'₹15K avg', label:'Monthly Stipend', color:'#10b981' },
              { icon:'🏢', val:'200+', label:'Partner Companies', color:'#3b82f6' },
              { icon:'🏆', val:'72%', label:'Pre-Placement Rate', color:'#f59e0b' },
            ].map(s=>(
              <div key={s.label} className="glass" style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', borderRadius:14 }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <div>
                  <div className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{s.val}</div>
                  <div style={{ fontSize:10.5, color:'var(--text-3)', marginTop:1 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:32, paddingBottom:64 }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:9, flexWrap:'wrap', marginBottom:24 }}>
          <div style={{ position:'relative', flex:'1 1 260px' }}>
            <Search size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
            <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search internships, companies…" style={{ paddingLeft:40 }} />
          </div>
          {[
            { val:cat, setter:setCat, opts:CATEGORIES.map(c=>({ v:c.id, l:c.label })) },
            { val:type, setter:setType, opts:TYPES.map(t=>({ v:t, l:t })) },
          ].map((sel,i)=>(
            <div key={i} style={{ position:'relative', flexShrink:0 }}>
              <select value={sel.val} onChange={e=>sel.setter(e.target.value)} className="inp" style={{ minWidth:152, paddingRight:36 }}>
                {sel.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              <ChevronDown size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
            </div>
          ))}
        </div>

        <p style={{ fontSize:13, color:'var(--text-3)', marginBottom:20 }}>
          <span style={{ color:'var(--text)', fontWeight:700 }}>{filtered.length}</span> internships found
        </p>

        {/* Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {filtered.map((item, i)=>(
            <motion.div key={item.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.38, delay:Math.min(i*0.03, 0.21) }}
              className="job-card"
              style={{ '--accent-color': item.color } as React.CSSProperties}>

              {/* Left bar */}
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:item.color, borderRadius:'12px 0 0 12px', opacity:0.8 }} />

              {/* Logo */}
              <div style={{ width:54, height:54, borderRadius:14, background:`${item.color}12`, border:`1px solid ${item.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
                {item.logo}
              </div>

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:4 }}>
                  <h3 className="font-display" style={{ fontWeight:700, fontSize:17, color:'var(--text)' }}>{item.title}</h3>
                  {item.ppo && <span className="badge b-amber" style={{ display:'flex', alignItems:'center', gap:3 }}><Star size={8} fill="#fde68a"/>PPO Eligible</span>}
                  {item.featured && <span className="badge b-violet">Featured</span>}
                </div>

                <p style={{ fontWeight:600, fontSize:13, marginBottom:10 }} className="g-blue">{item.company}</p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'5px 20px', fontSize:12.5, color:'var(--text-2)', marginBottom:12 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}><MapPin size={12}/>{item.location}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}><Clock size={12}/>{item.duration}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, color:'#6ee7b7', fontWeight:700 }}>💰 {item.stipend}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}><Users size={12}/>{item.openings} openings</span>
                  <span style={{ color:'#fca5a5' }}>📅 {item.deadline}</span>
                </div>

                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                  {item.skills.map(sk=><span key={sk} className="badge b-blue">{sk}</span>)}
                  <span className={`badge ${item.type==='Paid'?'b-green':'b-cyan'}`}>{item.type}</span>
                </div>

                <p style={{ fontSize:12.5, color:'var(--text-2)', lineHeight:1.6, maxWidth:580 }}>{item.description}</p>
              </div>

              {/* Actions */}
              <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                <button
                  className="btn btn-primary"
                  onClick={() => openApply(item)}
                  style={{ display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                  Apply Now
                </button>
                <button className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Bookmark size={12}/> Save
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ApplyModal
        open={!!applyItem}
        onClose={closeApply}
        type="internship"
        itemId={applyItem?.id ?? 0}
        itemTitle={applyItem?.title ?? ''}
        itemCompany={applyItem?.company ?? ''}
        color={applyItem?.color}
      />
    </div>
  );
}
