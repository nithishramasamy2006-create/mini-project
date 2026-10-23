import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '../hooks';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Users, Bookmark, Star, ChevronDown } from 'lucide-react';
import { INTERNSHIPS, CATEGORIES } from '../data';
import ApplyModal from '../components/ApplyModal';
import PortalApplyModal from '../components/PortalApplyModal';
import { portalGetAll } from '../portalData';

const TYPES = ['All Types','Paid','Certificate'];

// safe helpers
function safeColor(c) {
  return (typeof c === 'string' && c.length > 0) ? c : '#7c3aed';
}
function safeLogo(item) {
  return item?.logo || item?.companyLogo || '🏢';
}

function getAllInternships() {
  const portal = portalGetAll('internship')
    .filter((i: any) => i.status === 'active')
    .map((i: any, idx: number) => ({
      id:          80000 + idx,
      title:       i.title       || 'Untitled Internship',
      company:     i.company     || i._author || 'Company',
      logo:        i.logo        || '🏢',
      category:    i.category    || 'fullstack',
      type:        i.type        || 'Paid',
      duration:    i.duration    || 'Flexible',
      stipend:     i.stipend     || 'Negotiable',
      location:    i.location    || 'Remote',
      openings:    parseInt(i.openings) || 2,
      skills:      Array.isArray(i.skills) ? i.skills : typeof i.skills === 'string' ? i.skills.split(',').map((s: string) => s.trim()) : [],
      description: i.description || '',
      deadline:    i.deadline    || '',
      color:       safeColor(i.color),
      ppo:         !!i.ppo,
      featured:    !!i.featured,
      rating:      4.5,
      _portal:     true,
    }));
  return [...INTERNSHIPS, ...portal];
}

export default function InternshipsPage() {
  const [q, setQ]       = useState('');
  const dQ               = useDebounce(q, 180);
  const [cat, setCat]   = useState('all');
  const [type, setType] = useState('All Types');
  const [applyItem,       setApplyItem]       = useState<typeof INTERNSHIPS[0] | null>(null);
  const [portalApplyItem, setPortalApplyItem] = useState<any | null>(null);
  const openApply  = useCallback((i: any) => {
    if ((i as any)._portal) setPortalApplyItem(i);
    else setApplyItem(i);
  }, []);
  const closeApply = useCallback(() => { setApplyItem(null); setPortalApplyItem(null); }, []);

  const filtered = useMemo(() => getAllInternships().filter(i => {
    if (dQ && !i.title.toLowerCase().includes(dQ.toLowerCase()) && !(i.company||'').toLowerCase().includes(dQ.toLowerCase())) return false;
    if (cat !== 'all' && (i as any).category !== cat) return false;
    if (type !== 'All Types' && i.type !== type) return false;
    return true;
  }), [dQ, cat, type]);

  return (
    <div className="page" style={{ minHeight:'100vh', paddingTop:60 }}>

      {/* â”€â”€ BANNER â”€â”€ */}
      <div className="banner" style={{ background:'linear-gradient(180deg,rgba(6,10,20,0.9) 0%,transparent 100%)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 100% at 30% 50%,rgba(37,99,235,0.09),transparent)' }} />
        <div className="mesh-bg" style={{ position:'absolute', inset:0, opacity:.35 }} />
        <div className="container banner-inner">
          <span className="chip chip-blue" style={{ display:'inline-flex', marginBottom:14 }}>ðŸ’¼ Industry Internships</span>
          <h1 className="font-display" style={{ fontWeight:700, fontSize:'clamp(30px,5vw,54px)', letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:10 }}>
            NM-Approved<br /><span className="g-blue">Internships</span>
          </h1>
          <p style={{ color:'var(--text-2)', fontSize:15, maxWidth:620, marginBottom:28 }}>
            Paid and certificate internships from 200+ companies exclusively for Tamil Nadu college students through the Naan Mudhalvan programme.
          </p>

          {/* KPI row */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {[
              { icon:'ðŸ’¼', val:'840+', label:'Active Internships', color:'#7c3aed' },
              { icon:'ðŸ’°', val:'â‚¹15K avg', label:'Monthly Stipend', color:'#10b981' },
              { icon:'ðŸ¢', val:'200+', label:'Partner Companies', color:'#3b82f6' },
              { icon:'ðŸ†', val:'72%', label:'Pre-Placement Rate', color:'#f59e0b' },
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
            <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search internships, companiesâ€¦" style={{ paddingLeft:40 }} />
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
          {filtered.map((item, i) => {
            const color    = safeColor((item as any).color);
            const logo     = safeLogo(item);
            const skills   = Array.isArray((item as any).skills) ? (item as any).skills as string[] : [];
            const ppo      = !!(item as any).ppo;
            const featured = !!(item as any).featured;
            return (
            <motion.div key={item.id}
              initial={{ opacity:0, y:20 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.38, delay:Math.min(i*0.03, 0.21) }}
              className="job-card"
              style={{ '--accent-color': color } as React.CSSProperties}>

              {/* Left bar */}
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:color, borderRadius:'12px 0 0 12px', opacity:0.8 }} />

              {/* Logo */}
              <div style={{ width:54, height:54, borderRadius:14, background:`${color}18`, border:`1px solid ${color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0 }}>
                {logo}
              </div>

              {/* Content */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:4 }}>
                  <h3 className="font-display" style={{ fontWeight:700, fontSize:17, color:'var(--text)' }}>{item.title}</h3>
                  {ppo      && <span className="badge b-amber" style={{ display:'flex', alignItems:'center', gap:3 }}><Star size={8} fill="#fde68a"/>PPO Eligible</span>}
                  {featured && <span className="badge b-violet">Featured</span>}
                </div>

                <p style={{ fontWeight:600, fontSize:13, marginBottom:10 }} className="g-blue">{item.company}</p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'5px 20px', fontSize:12.5, color:'var(--text-2)', marginBottom:12 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}><MapPin size={12}/>{item.location}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}><Clock size={12}/>{item.duration}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, color:'#6ee7b7', fontWeight:700 }}>ðŸ’° {item.stipend}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5 }}><Users size={12}/>{item.openings} openings</span>
                  <span style={{ color:'#fca5a5' }}>ðŸ“… {item.deadline}</span>
                </div>

                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                  {skills.map(sk => <span key={sk} className="badge b-blue">{sk}</span>)}
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
            );
          })}
        </div>
      </div>

      <ApplyModal
        open={!!applyItem}
        onClose={closeApply}
        type="internship"
        itemId={applyItem?.id ?? 0}
        itemTitle={applyItem?.title ?? ''}
        itemCompany={applyItem?.company ?? ''}
        color={safeColor((applyItem as any)?.color)}
      />
      <PortalApplyModal
        open={!!portalApplyItem}
        onClose={closeApply}
        type="internship"
        itemId={portalApplyItem?.id ?? 0}
        itemTitle={portalApplyItem?.title ?? ''}
        itemCompany={portalApplyItem?.company ?? ''}
        itemAuthor={portalApplyItem?._author || portalApplyItem?.company || 'admin'}
        color="#3b82f6"
      />
    </div>
  );
}

