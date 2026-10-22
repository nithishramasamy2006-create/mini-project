import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, ChevronRight, Star } from 'lucide-react';
import { PLATFORM_STATS, TESTIMONIALS, PROJECTS } from '../data';
import StarField from '../components/StarField';
import ProjectCard from '../components/ProjectCard';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22,1,0.36,1] },
});

// ── Inline SVG marquee — zero network dependency ───────────
const MARQUEE_COMPANIES = [
  { name:'Zoho',    color:'#e42527', svg: <svg viewBox="0 0 72 26" width="60" height="22"><rect x="0" y="3" width="13" height="13" rx="2" fill="#e42527"/><rect x="14" y="0" width="13" height="13" rx="2" fill="#f5a800"/><rect x="0" y="17" width="13" height="13" rx="2" fill="#00aaef"/><rect x="14" y="14" width="13" height="13" rx="2" fill="#00b14f"/><text x="30" y="20" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="16" fill="#1a1a1a">ZOHO</text></svg> },
  { name:'TCS',     color:'#1a56db', svg: <svg viewBox="0 0 50 26" width="44" height="22"><text x="0" y="22" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="24" fill="#1a56db">tcs</text></svg> },
  { name:'Infosys', color:'#007cc3', svg: <svg viewBox="0 0 90 26" width="80" height="22"><text x="0" y="20" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="20" fill="#007cc3">Infosys</text></svg> },
  { name:'Freshworks', color:'#29b5e8', svg: <svg viewBox="0 0 100 26" width="90" height="22"><circle cx="12" cy="13" r="11" fill="url(#fwm)"/><defs><radialGradient id="fwm" cx="40%" cy="35%"><stop offset="0%" stopColor="#29d9f5"/><stop offset="60%" stopColor="#60d344"/><stop offset="100%" stopColor="#f5a800"/></radialGradient></defs><text x="27" y="19" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="13" fill="#1a1a1a">freshworks</text></svg> },
  { name:'ISRO',    color:'#ff671f', svg: <svg viewBox="0 0 60 26" width="52" height="22"><text x="0" y="20" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18" fill="#003580">ISRO</text></svg> },
  { name:'Razorpay',color:'#3395ff', svg: <svg viewBox="0 0 88 26" width="78" height="22"><polygon points="10,3 16,16 12,16 18,24 8,12 12,12 6,3" fill="#3395ff"/><text x="22" y="20" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="#1a1a1a">razorpay</text></svg> },
  { name:'OLA',     color:'#1ab394', svg: <svg viewBox="0 0 60 26" width="52" height="22"><circle cx="12" cy="13" r="11" fill="#1c1c1c"/><circle cx="12" cy="13" r="6" fill="#a8e03c"/><text x="27" y="20" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="15" fill="#1c1c1c">OLA</text></svg> },
  { name:"BYJU'S",  color:'#9b59b6', svg: <svg viewBox="0 0 80 26" width="70" height="22"><rect x="0" y="2" width="20" height="20" rx="5" fill="#9b59b6"/><text x="3" y="18" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="15" fill="#fff">B</text><text x="25" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#9b59b6">BYJU'S</text></svg> },
  { name:'Wipro',   color:'#341c6c', svg: <svg viewBox="0 0 80 26" width="70" height="22">{['#e42527','#f5a800','#00b14f','#00aaef','#9b59b6','#ff671f'].map((c,i)=><circle key={i} cx={4+i*4} cy="9" r="2.8" fill={c}/>)}<text x="0" y="24" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="16" fill="#341c6c">wipro</text></svg> },
  { name:'HCL',     color:'#00539b', svg: <svg viewBox="0 0 60 26" width="52" height="22"><text x="0" y="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" fill="#00539b" letterSpacing="-1">HCL</text></svg> },
  { name:'Google',  color:'#4285f4', svg: <svg viewBox="0 0 80 26" width="70" height="22"><text x="0" y="22" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="22"><tspan fill="#4285f4">G</tspan><tspan fill="#ea4335">o</tspan><tspan fill="#fbbc05">o</tspan><tspan fill="#4285f4">g</tspan><tspan fill="#34a853">l</tspan><tspan fill="#ea4335">e</tspan></text></svg> },
  { name:'Microsoft',color:'#00a4ef',svg: <svg viewBox="0 0 94 26" width="84" height="22"><rect x="0" y="1" width="9" height="9" fill="#f35325"/><rect x="10" y="1" width="9" height="9" fill="#81bc06"/><rect x="0" y="11" width="9" height="9" fill="#05a6f0"/><rect x="10" y="11" width="9" height="9" fill="#ffba08"/><text x="23" y="18" fontFamily="Segoe UI,Arial,sans-serif" fontWeight="300" fontSize="13" fill="#1a1a1a">Microsoft</text></svg> },
  { name:'Amazon',  color:'#ff9900', svg: <svg viewBox="0 0 82 26" width="72" height="22"><text x="0" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="18" fill="#1a1a1a">amazon</text><path d="M2,23 Q28,30 60,23" stroke="#ff9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/><polygon points="58,20 63,23 58,26" fill="#ff9900"/></svg> },
  { name:'Cognizant',color:'#0033a0',svg: <svg viewBox="0 0 100 26" width="90" height="22"><circle cx="10" cy="13" r="9" fill="none" stroke="#0033a0" strokeWidth="2.5"/><circle cx="10" cy="13" r="4" fill="#0033a0"/><text x="24" y="19" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="13" fill="#0033a0">Cognizant</text></svg> },
  { name:'Swiggy',  color:'#fc8019', svg: <svg viewBox="0 0 78 26" width="68" height="22"><circle cx="12" cy="13" r="11" fill="#fc8019"/><text x="6" y="18" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="13" fill="#fff">S</text><text x="27" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="#1a1a1a">swiggy</text></svg> },
  { name:'Zomato',  color:'#e23744', svg: <svg viewBox="0 0 78 26" width="68" height="22"><circle cx="12" cy="13" r="11" fill="#e23744"/><text x="6" y="18" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="13" fill="#fff">Z</text><text x="27" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="#1a1a1a">zomato</text></svg> },
  { name:'Paytm',   color:'#00b9f1', svg: <svg viewBox="0 0 72 26" width="62" height="22"><rect x="0" y="3" width="18" height="18" rx="3" fill="#00b9f1"/><text x="2" y="16" fontFamily="Arial Black,sans-serif" fontSize="9" fontWeight="900" fill="#fff">Pay</text><text x="22" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="#00b9f1">Paytm</text></svg> },
  { name:'PhonePe', color:'#5f259f', svg: <svg viewBox="0 0 82 26" width="72" height="22"><rect x="0" y="2" width="20" height="20" rx="5" fill="#5f259f"/><text x="3" y="17" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="13" fill="#fff">Ph</text><text x="24" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#5f259f">PhonePe</text></svg> },
];

const MDOUBLED = [...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES];

function MarqueeBelt() {
  return (
    <div style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      padding: '16px 0', overflow: 'hidden',
    }}>
      <div style={{
        maskImage: 'linear-gradient(to right,transparent,black 5%,black 95%,transparent)',
        WebkitMaskImage: 'linear-gradient(to right,transparent,black 5%,black 95%,transparent)',
      }}>
        <div style={{
          display: 'flex', gap: 12, width: 'max-content',
          animation: 'marqueeScroll 40s linear infinite',
        }}>
          {MDOUBLED.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 12, flexShrink: 0,
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:64, height:24 }}>
                {c.svg}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default function HomePage() {
  const featured = PROJECTS.filter(p => p.featured).slice(0, 3);

  return (
    <div className="page">

      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingBottom: 80, overflow: 'hidden' }}>
        <StarField />
        <div className="hero-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <motion.div {...anim(0)} style={{ marginBottom: 28 }}>
            <span className="chip">
              <Sparkles size={12} /> Naan Mudhalvan Initiative · Tamil Nadu Govt
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulseGlow 1.5s ease-in-out infinite' }} />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...anim(0.08)} className="h1" style={{ marginBottom: 20 }}>
            <span style={{ color: 'var(--text)' }}>Build Real Projects.</span>
            <br />
            <span className="grad-purple" style={{ fontSize: 'clamp(44px,9vw,92px)' }}>Earn Real Stipends.</span>
            <br />
            <span style={{ color: 'var(--text)' }}>Launch Real Careers.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p {...anim(0.16)} className="text-lead" style={{ maxWidth: 600, margin: '0 auto 32px' }}>
            Tamil Nadu's premier experiential learning marketplace — connecting college students with
            <strong style={{ color: '#a78bfa', fontWeight: 600 }}> paid micro-projects</strong> from 180+ industry leaders,
            expert mentorship & government-recognized NM certification.
          </motion.p>

          {/* Feature pills */}
          <motion.div {...anim(0.22)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
            {['✓ Free for Students', '✓ Stipends up to ₹25K/mo', '✓ Govt Certified', '✓ College Credit Eligible', '✓ 500+ Expert Mentors'].map(p => (
              <span key={p} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.22)' }}>{p}</span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div {...anim(0.28)} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginBottom: 72 }}>
            <Link to="/projects" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Explore Projects <ArrowRight size={18} />
            </Link>
            <Link to="/courses" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
              <Play size={16} /> Browse Courses
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div {...anim(0.34)}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, maxWidth: 960, margin: '0 auto' }}>
              {PLATFORM_STATS.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.07 }}
                  className="stat-card">
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div className="font-display" style={{ fontWeight: 700, fontSize: 26, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scroll cue */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
            style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Scroll to explore</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              style={{ width: 22, height: 38, borderRadius: 14, border: '1.5px solid var(--border-2)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5px 0' }}>
              <div style={{ width: 4, height: 8, borderRadius: 4, background: '#7c3aed' }} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <MarqueeBelt />

      {/* ═══════════════ FEATURED PROJECTS ═══════════════ */}
      <section className="section">
        <div className="container">
          <motion.div {...anim()} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
            <div>
              <span className="chip">🔥 Featured Projects</span>
              <h2 className="h2">Handpicked for <span className="grad-purple">Tamil Nadu</span> Students</h2>
            </div>
            <Link to="/projects" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
              View All <ChevronRight size={14} />
            </Link>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
            {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.25 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 56 }}>
            <span className="chip" style={{ background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.25)', color: '#22d3ee' }}>4-Step Process</span>
            <h2 className="h2">From Student to <span className="grad-green">Industry Pro</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {[
              { n:'01', icon:'👤', title:'Create Profile', desc:'Link college, upload resume, highlight skills. AI matches you instantly.', color:'#7c3aed' },
              { n:'02', icon:'🔍', title:'Pick a Project', desc:'2,400+ projects. Filter by stipend, skill, domain & duration.', color:'#3b82f6' },
              { n:'03', icon:'🛠️', title:'Build & Learn', desc:'Work with engineers. Weekly syncs, code reviews, milestones.', color:'#06b6d4' },
              { n:'04', icon:'🏆', title:'Earn & Certify', desc:'Get paid, earn NM government certificate, showcase portfolio.', color:'#10b981' },
            ].map((s, i) => (
              <motion.div key={s.n} {...anim(i * 0.1)}
                className="glass-card card" style={{ padding: 28, position: 'relative', overflow: 'hidden', cursor: 'default' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${s.color},transparent)` }} />
                <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                <div className="font-mono" style={{ fontSize: 11, fontWeight: 600, color: s.color, opacity: 0.65, marginBottom: 8 }}>{s.n}</div>
                <h3 className="h3" style={{ marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{s.desc}</p>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%,${s.color}08,transparent 65%)`, opacity: 0, transition: 'opacity 0.3s', borderRadius: 20, pointerEvents: 'none' }} className="card-glow-inner" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="section">
        <div className="container">
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 52 }}>
            <span className="chip" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#34d399' }}>Student Stories</span>
            <h2 className="h2">Real Results, Real <span className="grad-pink">Careers</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} {...anim(i * 0.12)}
                className="glass-card card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.color},transparent)` }} />
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[...Array(t.rating)].map((_,j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ height: 1, background: `linear-gradient(90deg,${t.color}30,transparent)`, marginBottom: 18 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,${t.color},${t.color}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{t.college}</div>
                    <div style={{ fontSize: 11, color: t.color, marginTop: 2, fontWeight: 500 }}>{t.project}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
