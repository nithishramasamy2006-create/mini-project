import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, Link2, GitBranch, Mail, Heart } from 'lucide-react';

const COLS = [
  { title: 'Platform',  links: [{ l: 'Browse Projects', to: '/projects' }, { l: 'Skill Courses', to: '/courses' }, { l: 'Internships', to: '/internships' }, { l: 'Find Mentors', to: '/mentors' }, { l: 'Leaderboard', to: '/leaderboard' }] },
  { title: 'Students',  links: [{ l: 'How It Works', to: '/how-it-works' }, { l: 'College Credit', to: '/how-it-works' }, { l: 'Certificates', to: '/certificates' }, { l: 'Placement Support', to: '/placement-support' }, { l: 'Alumni Network', to: '/alumni-network' }] },
  { title: 'Companies', links: [{ l: 'Post Projects', to: '/portal/company' }, { l: 'Hire Talent', to: '/portal/company' }, { l: 'Partner With Us', to: '/portal/company' }, { l: 'Success Stories', to: '/alumni-network' }, { l: 'Analytics', to: '/portal/company' }] },
];

const SOCIALS = [
  { Icon: Globe,     href: '#' }, { Icon: Link2,     href: '#' },
  { Icon: GitBranch, href: '#' }, { Icon: Mail,      href: '#' },
];

export default function Footer() {
  return (
    <>
      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(124,58,237,0.1), transparent)' }} />
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--glass-heavy-bg)', backdropFilter: 'blur(28px)',
              border: '1px solid var(--border-2)', borderRadius: 28,
              padding: 'clamp(32px,5vw,64px)', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -80, left: -80, width: 208, height: 208, borderRadius: '50%', filter: 'blur(48px)', background: 'rgba(124,58,237,0.22)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -80, right: -80, width: 208, height: 208, borderRadius: '50%', filter: 'blur(48px)', background: 'rgba(59,130,246,0.18)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                  <Zap size={17} color="#fff" />
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#a78bfa' }}>Your Career Starts Here</span>
              </div>

              <h2 className="font-display" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 'clamp(28px,5vw,52px)', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 16 }}>
                Your First Industry<br />
                <span style={{ background: 'linear-gradient(130deg,#c4b5fd,#818cf8,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Project Awaits
                </span>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-2)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
                Join 45,000+ Tamil Nadu students building real products, earning stipends, and launching careers.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 28 }}>
                <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/portal/company" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
                  <Shield size={16} color="#34d399" /> For Companies
                </Link>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                ✓ Free for students &nbsp;·&nbsp; ✓ No upfront costs &nbsp;·&nbsp; ✓ Govt certified &nbsp;·&nbsp; ✓ College credit eligible
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>

            {/* Brand col */}
            <div style={{ gridColumn: 'span 2' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                  <Zap size={19} color="#fff" />
                </div>
                <div>
                  <div className="font-display" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 16 }}>NaanMudhalvan</div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--violet)' }}>Learning Marketplace</div>
                </div>
              </Link>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 24, maxWidth: 280 }}>
                Bridging the gap between academia and industry through experiential learning for Tamil Nadu's next generation of innovators.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {SOCIALS.map(({ Icon, href }, i) => (
                  <a key={i} href={href}
                    className="glass"
                    style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}>
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Link cols */}
            {COLS.map(col => (
              <div key={col.title}>
                <h4 className="font-display" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13, marginBottom: 16 }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(({ l, to }) => (
                    <li key={l}>
                      <Link to={to} style={{ fontSize: 13, color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'}>
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="divider-h" style={{ marginBottom: 24 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <p style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              © 2024 NaanMudhalvan Marketplace · Made with <Heart size={11} color="#ef4444" fill="#ef4444" /> for Tamil Nadu students
            </p>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
                <a key={t} href="#" style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'}>
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
