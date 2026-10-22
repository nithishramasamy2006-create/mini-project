import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Award, TrendingUp, Users, BookOpen, Star } from 'lucide-react';

const STATS = [
  { val: '2,400+', label: 'Live Projects', icon: BookOpen, color: '#7c3aed' },
  { val: '180+',   label: 'Industry Partners', icon: Award, color: '#3b82f6' },
  { val: '45K+',   label: 'Students Placed', icon: Users, color: '#06b6d4' },
  { val: '₹18K',   label: 'Avg Stipend/mo', icon: TrendingUp, color: '#10b981' },
];

const PILLS = [
  { text: 'Naan Mudhalvan Certified', color: '#7c3aed' },
  { text: 'Tamil Nadu Govt. Backed', color: '#4f46e5' },
  { text: 'Real Industry Stipends', color: '#10b981' },
  { text: 'College Credit Eligible', color: '#f59e0b' },
  { text: '500+ Verified Mentors',   color: '#ec4899' },
];

const ent = { hidden: { opacity: 0, y: 28 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: .65, delay: i * .1, ease: [.22,1,.36,1] } }) };

export default function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 88, paddingBottom: 80, overflow: 'hidden' }}>

      {/* Background blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="anim-gradient" style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(124,58,237,.22) 0%,rgba(59,130,246,.12) 50%,transparent 75%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(6,182,212,.12) 0%,transparent 70%)', filter: 'blur(50px)' }} />
        {/* Mesh grid */}
        <div className="mesh" style={{ position: 'absolute', inset: 0, opacity: .4 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>

        {/* Top badge */}
        <motion.div custom={0} variants={ent} initial="hidden" animate="show"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', marginBottom: 28 }}>
          <Sparkles size={14} color="#a78bfa" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>Aligned with the Naan Mudhalvan Initiative · Tamil Nadu</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </motion.div>

        {/* Headline */}
        <motion.h1 custom={1} variants={ent} initial="hidden" animate="show"
          style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(40px,7vw,80px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-.03em', marginBottom: 22 }}>
          <span style={{ color: '#f1f5f9' }}>Build Real Projects.</span>
          <br />
          <span className="grad-text" style={{ fontSize: 'clamp(44px,8vw,88px)' }}>Earn While</span>
          <br />
          <span style={{ color: '#f1f5f9' }}>You Learn.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p custom={2} variants={ent} initial="hidden" animate="show"
          style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#64748b', maxWidth: 640, margin: '0 auto 36px', lineHeight: 1.65, fontWeight: 400 }}>
          Tamil Nadu's premier experiential learning marketplace — connecting college students with
          <span style={{ color: '#a78bfa', fontWeight: 500 }}> paid micro-projects</span> from India's top tech companies, with expert mentorship and government certification.
        </motion.p>

        {/* CTAs */}
        <motion.div custom={3} variants={ent} initial="hidden" animate="show"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 44 }}>
          <button className="btn-primary" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 16 }}>
            <span style={{ position: 'relative', zIndex: 1 }}>Explore Projects</span>
            <ArrowRight size={18} style={{ position: 'relative', zIndex: 1 }} />
          </button>
          <button className="btn-ghost" style={{ fontSize: 16, padding: '13px 28px', borderRadius: 16 }}>
            <Star size={17} color="#f59e0b" />
            For Industry Partners
          </button>
        </motion.div>

        {/* Pills */}
        <motion.div custom={4} variants={ent} initial="hidden" animate="show"
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 64 }}>
          {PILLS.map((p, i) => (
            <motion.span key={p.text}
              initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: .6 + i * .07, duration: .35 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: `${p.color}14`, color: p.color, border: `1px solid ${p.color}30` }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
              {p.text}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div custom={5} variants={ent} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, maxWidth: 860, margin: '0 auto' }}>
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .9 + i * .1 }}
                className="glass lift card-glow"
                style={{ padding: '22px 20px', borderRadius: 18, textAlign: 'center', cursor: 'default' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div className="stat-num">{s.val}</div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
          style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#334155', letterSpacing: '.15em', textTransform: 'uppercase' }}>Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            style={{ width: 20, height: 36, borderRadius: 12, border: '1.5px solid #334155', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px 0' }}>
            <div style={{ width: 4, height: 8, borderRadius: 4, background: '#7c3aed' }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
