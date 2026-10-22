import { motion } from 'framer-motion';
import { UserCircle, Briefcase, Star, Trophy, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    n: '01', Icon: UserCircle, title: 'Create Your Profile',
    desc: 'Link your college, upload your resume, and highlight your skills. Our AI matches you with the most relevant industry projects.',
    color: '#7c3aed', detail: 'Takes only 5 minutes',
  },
  {
    n: '02', Icon: Briefcase, title: 'Pick a Micro-Project',
    desc: 'Browse 2,400+ Naan Mudhalvan-aligned projects across 20+ domains. Filter by skill, stipend, duration, and industry.',
    color: '#3b82f6', detail: 'Full-time or part-time',
  },
  {
    n: '03', Icon: Star, title: 'Build Under Mentorship',
    desc: 'Work directly with senior industry engineers. Weekly syncs, code reviews, and milestone guidance keep you on track.',
    color: '#06b6d4', detail: 'Industry mentors assigned',
  },
  {
    n: '04', Icon: Trophy, title: 'Earn & Get Certified',
    desc: 'Receive your stipend, Naan Mudhalvan digital certificate, and a portfolio project that impresses any recruiter.',
    color: '#10b981', detail: 'Govt-recognized certificate',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding:'80px 0', position:'relative', overflow:'hidden' }}>
      {/* bg glow */}
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:800, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(59,130,246,0.07) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      <div className="mesh" style={{ position:'absolute', inset:0, opacity:.2 }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.55 }} style={{ textAlign:'center', marginBottom:60 }}>
          <div className="section-tag" style={{ background:'rgba(59,130,246,.12)', borderColor:'rgba(59,130,246,.28)', color:'#60a5fa' }}>
            ✨ Simple 4-Step Process
          </div>
          <h2 className="font-display" style={{ fontSize:'clamp(28px,5vw,50px)', fontWeight:700, color:'#f1f5f9', letterSpacing:'-.025em', marginBottom:12 }}>
            How It <span className="grad-text-green">Works</span>
          </h2>
          <p style={{ fontSize:17, color:'#64748b', maxWidth:500, margin:'0 auto' }}>
            From browsing to earning — the entire journey takes less than a week to start.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20, marginBottom:52, position:'relative' }}>
          {STEPS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <motion.div key={s.n}
                initial={{ opacity:0, y:36 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ duration:.55, delay:i*.12, ease:[.22,1,.36,1] }}
                className="glass lift card-glow"
                style={{ borderRadius:20, padding:'28px 24px', position:'relative' }}
              >
                {/* Step number */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${s.color}18`, border:`1px solid ${s.color}28`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
                    <Icon size={22} color={s.color} />
                    <span style={{ position:'absolute', top:-8, right:-8, width:20, height:20, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff' }}>{i+1}</span>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:s.color, fontWeight:600, opacity:.6 }}>{s.n}</span>
                </div>

                <h3 className="font-display" style={{ fontWeight:700, fontSize:17, color:'#f1f5f9', marginBottom:10, lineHeight:1.25 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.6, marginBottom:16 }}>{s.desc}</p>

                {/* Detail chip */}
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600, background:`${s.color}12`, color:s.color, border:`1px solid ${s.color}22` }}>
                  <span style={{ width:5,height:5,borderRadius:'50%',background:s.color }} />{s.detail}
                </span>

                {/* Connector arrow (not last) */}
                {i < STEPS.length - 1 && (
                  <div style={{ position:'absolute', right:-12, top:'50%', transform:'translateY(-50%)', zIndex:2, display:'none' /* shown only on lg */ }}>
                    <ArrowRight size={18} color="#334155" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.55, delay:.4 }} style={{ textAlign:'center' }}>
          <div className="glass-2" style={{ display:'inline-flex', flexDirection:'column', alignItems:'center', gap:16, padding:'32px 48px', borderRadius:24 }}>
            <div>
              <p className="font-display" style={{ fontSize:20, fontWeight:700, color:'#f1f5f9', marginBottom:6 }}>Ready to start your journey?</p>
              <p style={{ fontSize:13, color:'#64748b' }}>Join 45,000+ students already building with industry leaders</p>
            </div>
            <button className="btn-primary" style={{ fontSize:15, padding:'13px 36px', borderRadius:14 }}>
              <span style={{ position:'relative', zIndex:1 }}>Start for Free</span>
              <ArrowRight size={16} style={{ position:'relative', zIndex:1 }} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
