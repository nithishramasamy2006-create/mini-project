import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Users, Briefcase, CheckCircle, MessageCircle, ChevronDown, Zap } from 'lucide-react';
import { MENTORS } from '../data';
import ApplyModal from '../components/ApplyModal';

const DOMAINS = ['All Domains','AI & ML','Full Stack','Cloud & DevOps','UI/UX Design','Blockchain','FinTech'];

export default function MentorsPage() {
  const [q, setQ]         = useState('');
  const [domain, setDomain] = useState('All Domains');
  const [applyItem, setApplyItem] = useState<typeof MENTORS[0] | null>(null);

  const filtered = MENTORS.filter(m => {
    if (q && !m.name.toLowerCase().includes(q.toLowerCase()) && !m.company.toLowerCase().includes(q.toLowerCase()) && !m.skills.some(s=>s.toLowerCase().includes(q.toLowerCase()))) return false;
    if (domain!=='All Domains' && !m.domains.some(d=>d.toLowerCase().includes(domain.toLowerCase().replace(' & ',' ')))) return false;
    return true;
  });

  return (
    <div className="page" style={{ minHeight:'100vh', paddingTop:60 }}>

      {/* ── BANNER ── */}
      <div className="banner" style={{ background:'linear-gradient(180deg,rgba(6,10,20,0.9) 0%,transparent 100%)' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 50% 100% at 70% 50%,rgba(236,72,153,0.08),transparent)' }} />
        <div className="mesh-bg" style={{ position:'absolute', inset:0, opacity:.3 }} />
        <div className="container banner-inner">
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <span className="chip chip-pink" style={{ display:'inline-flex', marginBottom:14 }}>👨‍💼 Industry Mentors</span>
              <h1 className="font-display" style={{ fontWeight:700, fontSize:'clamp(30px,5vw,54px)', letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:10 }}>
                Learn from<br /><span className="g-pink">Real Experts</span>
              </h1>
              <p style={{ color:'var(--text-2)', fontSize:15, maxWidth:540 }}>
                500+ verified industry professionals from top companies guiding students through real projects.
              </p>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[{ v:'500+', l:'Mentors' },{ v:'4.8★', l:'Avg Rating' },{ v:'45K+', l:'Sessions' }].map(s=>(
                <div key={s.l} className="glass" style={{ padding:'14px 18px', borderRadius:14, textAlign:'center', minWidth:80 }}>
                  <div className="font-display" style={{ fontWeight:700, fontSize:18, color:'var(--text)' }}>{s.v}</div>
                  <div style={{ fontSize:10, color:'var(--text-3)', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:32, paddingBottom:64 }}>
        {/* Filters */}
        <div style={{ display:'flex', gap:9, flexWrap:'wrap', marginBottom:28 }}>
          <div style={{ position:'relative', flex:'1 1 260px' }}>
            <Search size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
            <input className="inp" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search mentors by name, skill, company…" style={{ paddingLeft:40 }} />
          </div>
          <div style={{ position:'relative', flexShrink:0 }}>
            <select value={domain} onChange={e=>setDomain(e.target.value)} className="inp" style={{ minWidth:168, paddingRight:36 }}>
              {DOMAINS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={13} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
          {filtered.map((m, i)=>(
            <motion.div key={m.id}
              initial={{ opacity:0, y:28 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.5, delay:i*0.08, ease:[0.22,1,0.36,1] }}
              className="mentor-card">

              {/* Header gradient */}
              <div className="mentor-head" style={{ background:m.avatarGrad, opacity:0.6 }} />

              {/* Avatar */}
              <div className="mentor-avatar" style={{ background:m.avatarGrad }}>
                {m.avatar}
              </div>

              {/* Available pill */}
              <div style={{ position:'absolute', top:14, right:16, zIndex:2 }}>
                {m.available
                  ? <span className="badge b-green" style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:'#6ee7b7', animation:'pulse 2s ease-in-out infinite' }} /> Available
                    </span>
                  : <span className="badge b-red">Fully Booked</span>
                }
              </div>

              <div className="mentor-body">
                {/* Name & role */}
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <h3 className="font-display" style={{ fontWeight:700, fontSize:17, color:'var(--text)', lineHeight:1.2 }}>{m.name}</h3>
                    {m.verified && <CheckCircle size={15} color="#6ee7b7" fill="none" />}
                  </div>
                  <p style={{ fontSize:12.5, color:'var(--text-2)', marginTop:3 }}>{m.role}</p>
                  <p style={{ fontSize:12, fontWeight:700, marginTop:2 }} className="g-pink">{m.company}</p>
                </div>

                {/* Bio */}
                <p style={{ fontSize:12, color:'var(--text-2)', lineHeight:1.65, marginBottom:14, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{m.bio}</p>

                {/* Skills */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:16 }}>
                  {m.skills.map(s=><span key={s} className="badge b-violet">{s}</span>)}
                </div>

                {/* Stats row */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
                  {[
                    { icon:Star, val:m.rating, label:'Rating', color:'#f59e0b', fill:'#f59e0b' },
                    { icon:Users, val:m.mentees, label:'Mentees', color:'#93c5fd', fill:'none' },
                    { icon:Briefcase, val:m.projects, label:'Projects', color:'#6ee7b7', fill:'none' },
                  ].map(s=>{
                    const I=s.icon;
                    return (
                      <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:11, padding:'10px 6px', textAlign:'center' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginBottom:3 }}>
                          <I size={12} color={s.color} fill={s.fill} />
                          <span className="font-display" style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{s.val}</span>
                        </div>
                        <div style={{ fontSize:9.5, color:'var(--text-3)' }}>{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Domain chips */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
                  {m.domains.map(d=><span key={d} className="badge b-cyan">{d}</span>)}
                </div>

                {/* Sessions badge */}
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:16 }}>
                  <Zap size={13} color="#fde68a" />
                  <span style={{ fontSize:12, color:'var(--text-2)' }}>
                    <span style={{ color:'var(--text)', fontWeight:700 }}>{m.sessions}</span> sessions completed
                  </span>
                </div>

                {/* CTA */}
                <button
                  className={`btn btn-full ${m.available ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setApplyItem(m)}
                  style={{ display:'flex', alignItems:'center', gap:7, justifyContent:'center' }}>
                  <MessageCircle size={14}/>
                  {m.available ? 'Connect with Mentor' : 'Join Waitlist'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {applyItem && (
        <ApplyModal
          open={!!applyItem}
          onClose={() => setApplyItem(null)}
          type="mentor"
          itemId={applyItem.id}
          itemTitle={`Mentorship Session with ${applyItem.name}`}
          itemCompany={applyItem.company}
          color="#7c3aed"
        />
      )}
    </div>
  );
}
