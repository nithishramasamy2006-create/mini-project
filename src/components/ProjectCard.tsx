import { motion } from 'framer-motion';
import { Star, Clock, Users, TrendingUp, Award, Flame, Bookmark, MapPin } from 'lucide-react';

const DIFF_COLORS: Record<string,string> = {
  Beginner: '#10b981', Intermediate: '#3b82f6', Advanced: '#ec4899', Expert: '#f59e0b',
};

interface Project {
  id: number; title: string; company: string; companyLogo: string; category: string;
  difficulty: string; duration: string; stipend: string; skills: string[];
  description: string; spots: number; enrolled: number; rating: number; reviews: number;
  naan_aligned: boolean; mentor: string; mentorRole: string; tags: string[];
  featured: boolean; ppo: boolean; deadline: string; location: string; color: string;
}

export default function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const dc = DIFF_COLORS[p.difficulty] || '#3b82f6';

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22,1,0.36,1] }}
      className="glass-card card"
      style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>

      {/* Color accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${p.color},${p.color}50,transparent)` }} />

      <div style={{ padding: '22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Company row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}14`, border: `1px solid ${p.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {p.companyLogo}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', lineHeight: 1.2 }}>{p.company}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <MapPin size={10} color="var(--text-3)" />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.location}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {p.featured && (
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                <Flame size={9} /> Hot
              </span>
            )}
            {p.naan_aligned && (
              <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                <Award size={9} /> NM
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 font-display" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', lineHeight: 1.3, marginBottom: 10, transition: 'color 0.2s' }}>
          {p.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2" style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 14 }}>
          {p.description}
        </p>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {p.skills.slice(0, 3).map(s => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600, background: `${p.color}10`, color: p.color, border: `1px solid ${p.color}20` }}>
              {s}
            </span>
          ))}
          {p.skills.length > 3 && <span className="badge badge-purple" style={{ fontSize: 10 }}>+{p.skills.length - 3}</span>}
        </div>

        {/* Metrics */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(124,58,237,0.2),transparent)', marginBottom: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14, textAlign: 'center' }}>
          <div>
            <div className="font-mono" style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent-light)' }}>{p.stipend}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>Stipend</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <Clock size={11} color="var(--text-3)" />
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{p.duration}</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>Duration</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: `${dc}15`, color: dc, border: `1px solid ${dc}25` }}>
              {p.difficulty}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_,j) => (
                <Star key={j} size={11} fill={j < Math.round(p.rating) ? '#f59e0b' : 'none'} color={j < Math.round(p.rating) ? '#f59e0b' : '#334155'} />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>{p.rating}</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>({p.reviews})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-3)' }}>
            <Users size={11} /> {p.enrolled} enrolled
          </div>
        </div>

        {/* Mentor chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${p.color},${p.color}70)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {p.mentor.split(' ').map(w=>w[0]).join('').slice(0,2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.mentor}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>{p.mentorRole}</div>
          </div>
          {p.ppo && <span className="badge badge-green" style={{ fontSize: 9, flexShrink: 0 }}>PPO</span>}
        </div>

        {/* Spots + deadline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.spots <= 2 ? '#ef4444' : '#10b981', animation: p.spots <= 2 ? 'pulseGlow 1.2s ease-in-out infinite' : 'none' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: p.spots <= 2 ? '#f87171' : '#34d399' }}>
              {p.spots} spot{p.spots !== 1 ? 's' : ''} left
            </span>
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Due {p.deadline}</span>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13, padding: '10px 18px' }}>
            <TrendingUp size={13} /> Apply Now
          </button>
          <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 12px' }}>
            <Bookmark size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
