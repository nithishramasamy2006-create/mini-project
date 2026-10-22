import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../data';

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ padding:'80px 0', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:0, left:'25%', width:600, height:300, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(124,58,237,0.07) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:1 }}>

        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.55 }} style={{ textAlign:'center', marginBottom:52 }}>
          <div className="section-tag" style={{ background:'rgba(16,185,129,.1)', borderColor:'rgba(16,185,129,.25)', color:'#34d399' }}>
            ⭐ Real Student Stories
          </div>
          <h2 className="font-display" style={{ fontSize:'clamp(28px,5vw,50px)', fontWeight:700, color:'#f1f5f9', letterSpacing:'-.025em', marginBottom:12 }}>
            Success <span className="grad-text">Stories</span>
          </h2>
          <p style={{ fontSize:17, color:'#64748b', maxWidth:520, margin:'0 auto' }}>
            Students from top Tamil Nadu colleges share how this marketplace transformed their career.
          </p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20, marginBottom:44 }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity:0, y:36 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:.55, delay:i*.12, ease:[.22,1,.36,1] }}
              className="glass lift card-glow"
              style={{ borderRadius:20, padding:'28px', position:'relative', overflow:'hidden' }}
            >
              {/* Top accent */}
              <div style={{ height:2, position:'absolute', top:0, left:0, right:0, background:`linear-gradient(90deg,${t.color},transparent)` }} />

              <Quote size={28} style={{ color:`${t.color}40`, marginBottom:14 }} />

              <div style={{ display:'flex', gap:2, marginBottom:14 }}>
                {[...Array(t.rating)].map((_,j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>

              <p style={{ fontSize:14, color:'#94a3b8', lineHeight:1.7, marginBottom:22, fontStyle:'italic' }}>
                "{t.text}"
              </p>

              <div style={{ height:1, background:`linear-gradient(90deg,${t.color}30,transparent)`, marginBottom:18 }} />

              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:`linear-gradient(135deg,${t.color},${t.color}70)`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, color:'#fff', flexShrink:0 }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#e2e8f0' }}>{t.name}</div>
                  <div style={{ fontSize:12, color:'#475569', marginTop:2 }}>{t.college}</div>
                  <div style={{ fontSize:11, color:t.color, marginTop:2, fontWeight:500 }}>{t.project}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust chips */}
        <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:.45, delay:.3 }} style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:12 }}>
          {[
            { icon:'⭐', val:'4.9/5', label:'Avg Rating' },
            { icon:'✅', val:'94%',   label:'Completion Rate' },
            { icon:'❤️', val:'98%',   label:'Would Recommend' },
          ].map(item => (
            <div key={item.label} className="glass" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 22px', borderRadius:999 }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div>
                <span style={{ fontWeight:700, fontSize:14, color:'#e2e8f0' }}>{item.val}</span>
                <span style={{ fontSize:12, color:'#475569', marginLeft:6 }}>{item.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
