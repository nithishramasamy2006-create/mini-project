import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, Briefcase, MapPin, Star,
  TrendingUp, Award, MessageCircle, Globe, Heart,
  Building2, GraduationCap,
} from 'lucide-react';
import StarField from '../components/StarField';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const ALUMNI_STATS = [
  { val: '45,000+', label: 'Active Alumni', icon: '🎓', color: '#7c3aed' },
  { val: '250+', label: 'Companies Represented', icon: '🏢', color: '#3b82f6' },
  { val: '38', label: 'Cities Across India', icon: '📍', color: '#06b6d4' },
  { val: '₹12 LPA', label: 'Avg. Alumni Salary', icon: '💰', color: '#10b981' },
];

const FEATURED_ALUMNI = [
  {
    name: 'Aravind Kumar', college: 'Anna University', gradYear: '2023',
    role: 'Senior Software Engineer', company: 'Zoho Corporation',
    avatar: 'AK', grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    domain: 'Full Stack', city: 'Chennai', package: '₹18 LPA',
    project: 'Smart Campus ERP at Zoho', quote: 'NaanMudhalvan gave me real project experience that directly helped me crack Zoho. Now I mentor juniors here!',
    rating: 5, linkedin: '#',
  },
  {
    name: 'Priya Mehta', college: 'NIT Trichy', gradYear: '2022',
    role: 'ML Engineer', company: 'Freshworks',
    avatar: 'PM', grad: 'linear-gradient(135deg,#10b981,#0891b2)',
    domain: 'AI/ML', city: 'Bangalore', package: '₹22 LPA',
    project: 'Fraud Detection Pipeline at Razorpay', quote: 'From a tier-1 college to a Freshworks ML role — NM projects were my portfolio. Referral network is amazing!',
    rating: 5, linkedin: '#',
  },
  {
    name: 'Rajesh Subramanian', college: 'SRM University', gradYear: '2023',
    role: 'DevOps Engineer', company: 'Amazon',
    avatar: 'RS', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    domain: 'Cloud & DevOps', city: 'Hyderabad', package: '₹28 LPA',
    project: 'IoT Smart Energy at ISRO', quote: 'ISRO project on NM was my MAANG entry ticket. The alumni network helped me prepare with Amazon-specific tips.',
    rating: 5, linkedin: '#',
  },
  {
    name: 'Soundarya Venkatesan', college: 'Amrita College', gradYear: '2024',
    role: 'UI/UX Designer', company: 'OLA',
    avatar: 'SV', grad: 'linear-gradient(135deg,#ec4899,#7c3aed)',
    domain: 'UI/UX Design', city: 'Bangalore', package: '₹14 LPA',
    project: 'Design System at OLA', quote: 'Got a PPO from OLA! My NM portfolio had 4 design projects — the alumni network gave me real inside knowledge.',
    rating: 5, linkedin: '#',
  },
  {
    name: 'Karthik Durai', college: 'VIT Chennai', gradYear: '2022',
    role: 'Data Scientist', company: 'BYJU\'S',
    avatar: 'KD', grad: 'linear-gradient(135deg,#0891b2,#3b82f6)',
    domain: 'Data Science', city: 'Bangalore', package: '₹16 LPA',
    project: 'Tamil NLP Chatbot at TCS', quote: 'The alumni referral system on NM got me my first interview at BYJU\'S. The community is incredibly supportive.',
    rating: 5, linkedin: '#',
  },
  {
    name: 'Meena Rajan', college: 'PSG Tech', gradYear: '2023',
    role: 'Cybersecurity Analyst', company: 'Wipro',
    avatar: 'MR', grad: 'linear-gradient(135deg,#f97316,#ec4899)',
    domain: 'Cybersecurity', city: 'Chennai', package: '₹9 LPA',
    project: 'Security Audit Platform at HCL', quote: 'Cybersecurity was niche but NM had projects for it. Alumni community shared prep resources that made all the difference.',
    rating: 5, linkedin: '#',
  },
];

const BENEFITS = [
  {
    icon: <MessageCircle size={24} />, color: '#7c3aed',
    title: 'Mentorship & Referrals',
    desc: 'Get direct referrals from alumni working at top companies. Our referral rate is 3x more effective than cold applications.',
  },
  {
    icon: <Globe size={24} />, color: '#3b82f6',
    title: 'Tamil Nadu Network Events',
    desc: 'Monthly virtual and in-person meetups in Chennai, Coimbatore, Madurai, Trichy, and 15 other cities.',
  },
  {
    icon: <Briefcase size={24} />, color: '#06b6d4',
    title: 'Exclusive Job Board',
    desc: 'Alumni-only job postings shared before they go public. Priority access to roles at alumni-represented companies.',
  },
  {
    icon: <Heart size={24} />, color: '#ec4899',
    title: 'Give Back Program',
    desc: 'Become a mentor to current students. Earn points, certificates, and recognition from the NM community.',
  },
  {
    icon: <TrendingUp size={24} />, color: '#10b981',
    title: 'Career Growth Resources',
    desc: 'Access curated learning paths, industry reports, and salary benchmarks shared exclusively within the alumni network.',
  },
  {
    icon: <Award size={24} />, color: '#f59e0b',
    title: 'Alumni Spotlight',
    desc: 'Get featured on NaanMudhalvan\'s social media (100K+ reach), LinkedIn, and in Tamil Nadu media coverage.',
  },
];

const CITIES = [
  { city: 'Chennai', count: '12,400+', emoji: '🏙️', color: '#7c3aed' },
  { city: 'Coimbatore', count: '6,800+', emoji: '🏭', color: '#3b82f6' },
  { city: 'Madurai', count: '4,200+', emoji: '🕌', color: '#06b6d4' },
  { city: 'Trichy', count: '3,900+', emoji: '🌉', color: '#10b981' },
  { city: 'Salem', count: '2,600+', emoji: '🏘️', color: '#f59e0b' },
  { city: 'Tirunelveli', count: '1,800+', emoji: '🌴', color: '#ec4899' },
];

const DOMAINS = [
  { domain: 'Full Stack', pct: 32, color: '#7c3aed' },
  { domain: 'AI & ML', pct: 24, color: '#3b82f6' },
  { domain: 'Data Science', pct: 18, color: '#06b6d4' },
  { domain: 'Cloud & DevOps', pct: 12, color: '#10b981' },
  { domain: 'UI/UX Design', pct: 8, color: '#f59e0b' },
  { domain: 'Cybersecurity', pct: 6, color: '#ec4899' },
];

export default function AlumniNetworkPage() {
  return (
    <div className="page">

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '72vh', display: 'flex', alignItems: 'center', paddingTop: 100, paddingBottom: 60, overflow: 'hidden' }}>
        <StarField />
        <div className="hero-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/alumni_hero.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, zIndex: 0,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,7,18,0.5), rgba(3,7,18,0.85) 60%, rgb(3,7,18))', zIndex: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div {...anim(0)} style={{ marginBottom: 20 }}>
            <span className="chip" style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <Users size={12} /> Alumni Network
            </span>
          </motion.div>
          <motion.h1 {...anim(0.08)} className="h1" style={{ marginBottom: 20 }}>
            <span style={{ color: '#f1f5f9' }}>Tamil Nadu's Largest</span><br />
            <span className="grad-purple">Tech Alumni Network</span>
          </motion.h1>
          <motion.p {...anim(0.16)} className="text-lead" style={{ maxWidth: 580, margin: '0 auto 32px' }}>
            45,000+ NaanMudhalvan alumni across 250+ companies, 38 cities — connected, growing, and giving back together.
          </motion.p>

          {/* Stat pills */}
          <motion.div {...anim(0.22)} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 36 }}>
            {ALUMNI_STATS.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                <span>{s.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{s.val}</span>
                <span style={{ fontSize: 12, color: '#475569' }}>{s.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div {...anim(0.28)} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Join the Network <ArrowRight size={18} />
            </Link>
            <Link to="/how-it-works" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
              How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ NETWORK MAP IMAGE ═══ */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <motion.div {...anim()} style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.15)', position: 'relative' }}>
            <img src="/alumni_hero.jpg" alt="Tamil Nadu Alumni Network Map" style={{ width: '100%', objectFit: 'cover', height: 400, display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,0.7) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {CITIES.map(c => (
                <div key={c.city} style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(16px)', borderRadius: 12, padding: '10px 16px', border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{c.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#e2e8f0' }}>{c.city}</div>
                    <div style={{ fontSize: 10, color: c.color, fontWeight: 600 }}>{c.count} alumni</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURED ALUMNI ═══ */}
      <section className="section" style={{ background: 'rgba(6,13,31,0.5)', position: 'relative' }}>
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 52 }}>
            <span className="chip" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#34d399' }}>
              <Star size={12} /> Featured Alumni
            </span>
            <h2 className="h2" style={{ marginTop: 12 }}>Where Our Alumni <span className="grad-green">Are Today</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURED_ALUMNI.map((a, i) => (
              <motion.div key={a.name} {...anim(i * 0.07)}
                className="glass-card card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
                whileHover={{ y: -4 }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `${a.grad}` }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: a.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>{a.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{a.college} · {a.gradYear}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <MapPin size={10} color="#475569" />
                      <span style={{ fontSize: 10, color: '#475569' }}>{a.city}</span>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{a.package}</div>
                    <div style={{ fontSize: 9, color: '#475569' }}>CTC</div>
                  </div>
                </div>

                {/* Role */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Building2 size={14} color="#7c3aed" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#c4b5fd' }}>{a.role}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{a.company}</div>
                  </div>
                </div>

                {/* Quote */}
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14 }}>"{a.quote}"</p>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, background: 'rgba(124,58,237,0.1)', color: '#a78bfa', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>{a.domain}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(a.rating)].map((_, j) => <Star key={j} size={11} fill="#f59e0b" color="#f59e0b" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DOMAIN BREAKDOWN ═══ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <motion.div {...anim()}>
              <span className="chip" style={{ marginBottom: 16 }}>📊 Alumni by Domain</span>
              <h2 className="h2" style={{ marginBottom: 12 }}>Where <span className="grad-purple">Alumni Work</span></h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
                Our alumni span every major tech domain — from Full Stack to AI to Cybersecurity. Join the domain that fits your passion.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {DOMAINS.map(d => (
                  <div key={d.domain}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{d.domain}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 999, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${d.pct}%` }}
                        viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 999, background: `linear-gradient(90deg,${d.color},${d.color}80)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div {...anim(0.1)}>
              <h2 className="h2" style={{ marginBottom: 24 }}>Network <span className="grad-purple">Benefits</span></h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {BENEFITS.map((b, i) => (
                  <motion.div key={b.title} {...anim(i * 0.07)}
                    style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 20px', borderRadius: 14, background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${b.color}15`, color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {b.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0', marginBottom: 4 }}>{b.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{b.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
          <motion.div {...anim()} className="glass-card" style={{ padding: 'clamp(32px,5vw,60px)', borderRadius: 28, border: '1px solid rgba(124,58,237,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
              <h2 className="h2" style={{ marginBottom: 14 }}>Become Part of the <span className="grad-purple">Network</span></h2>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Complete a project, get placed, and join 45,000+ alumni who support each other every day.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                  Join Free Today <ArrowRight size={18} />
                </Link>
                <Link to="/leaderboard" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
                  <GraduationCap size={16} /> View Leaderboard
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
