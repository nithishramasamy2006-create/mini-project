import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, FileText, Video, Briefcase, CheckCircle,
  Star, TrendingUp, Award, Users, Building2, PhoneCall,
  Target, BookOpen, Rocket, ChevronRight,
} from 'lucide-react';
import StarField from '../components/StarField';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const PLACEMENT_STATS = [
  { val: '94%', label: 'Placement Rate', icon: '🎯', color: '#10b981' },
  { val: '₹8.4 LPA', label: 'Avg. Package', icon: '💰', color: '#7c3aed' },
  { val: '180+', label: 'Hiring Partners', icon: '🏢', color: '#3b82f6' },
  { val: '48 hrs', label: 'Avg. Response Time', icon: '⚡', color: '#f59e0b' },
];

const SERVICES = [
  {
    icon: <FileText size={26} />, color: '#7c3aed',
    title: 'AI Resume Builder',
    desc: 'Our AI crafts an ATS-optimized resume from your NaanMudhalvan project history, skills, and certificates — tailored for each job application.',
    features: ['ATS score checker', 'Industry-specific templates', 'One-click export to PDF', 'LinkedIn sync'],
  },
  {
    icon: <Video size={26} />, color: '#3b82f6',
    title: 'Mock Interview Sessions',
    desc: 'Practice with industry professionals from TCS, Zoho, Infosys, and Freshworks. Get real-time feedback and HR pattern analysis.',
    features: ['Live mock interviews', 'AI-powered facial & voice analysis', 'Domain-specific Q&A banks', 'Recorded sessions for review'],
  },
  {
    icon: <Target size={26} />, color: '#06b6d4',
    title: 'Job Matching Engine',
    desc: 'Our ML model matches your skills to 5,000+ live job openings from partner companies — with a 91% match accuracy rate.',
    features: ['Smart skill-to-job matching', 'Salary range insights', 'Company culture scores', 'Direct apply with NM profile'],
  },
  {
    icon: <PhoneCall size={26} />, color: '#10b981',
    title: 'Career Counselling',
    desc: 'One-on-one sessions with certified career counsellors who have placed 10,000+ students in top Tamil Nadu and national companies.',
    features: ['Career roadmap planning', 'Domain selection guidance', 'Higher education advice', 'Salary negotiation tips'],
  },
  {
    icon: <BookOpen size={26} />, color: '#f59e0b',
    title: 'Aptitude & DSA Prep',
    desc: 'Curated practice material for top company hiring rounds — quantitative aptitude, logical reasoning, and coding challenges.',
    features: ['3,000+ practice problems', 'Company-specific patterns', 'Timed mock tests', 'Detailed solutions'],
  },
  {
    icon: <Award size={26} />, color: '#ec4899',
    title: 'Certificate Endorsements',
    desc: 'Your NM Government certificate, combined with project completion badges, are directly recognized by 180+ hiring partners.',
    features: ['Govt-recognized certificates', 'Digital badge wallet', 'LinkedIn auto-endorsement', 'Blockchain-verified credentials'],
  },
];

const COMPANIES_HIRING = [
  { name: 'Zoho', logo: '🔷', roles: 12, avg: '₹7.5 LPA', color: '#3b82f6' },
  { name: 'TCS', logo: '🔵', roles: 34, avg: '₹4.5 LPA', color: '#06b6d4' },
  { name: 'Infosys', logo: '🔷', roles: 28, avg: '₹5.5 LPA', color: '#4f46e5' },
  { name: 'Freshworks', logo: '🌿', roles: 8, avg: '₹12 LPA', color: '#10b981' },
  { name: 'Razorpay', logo: '💳', roles: 5, avg: '₹18 LPA', color: '#7c3aed' },
  { name: 'OLA', logo: '⚡', roles: 9, avg: '₹10 LPA', color: '#f59e0b' },
  { name: 'Wipro', logo: '💠', roles: 22, avg: '₹4.8 LPA', color: '#ec4899' },
  { name: 'ISRO', logo: '🚀', roles: 4, avg: '₹6.5 LPA', color: '#10b981' },
];

const SUCCESS_STORIES = [
  {
    name: 'Prathyusha R.', college: 'Anna University', role: 'Software Engineer @ Freshworks',
    avatar: 'PR', grad: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    package: '₹14.5 LPA', quote: 'NaanMudhalvan\'s placement team helped me crack Freshworks in my 3rd year itself! The mock interviews were exactly like the real thing.',
    rating: 5, domain: 'Full Stack',
  },
  {
    name: 'Karthik M.', college: 'NIT Trichy', role: 'AI Engineer @ Zoho',
    avatar: 'KM', grad: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
    package: '₹11 LPA', quote: 'Got a PPO from Zoho after completing my NM project. The placement support team\'s resume builder was a game changer.',
    rating: 5, domain: 'AI/ML',
  },
  {
    name: 'Soundarya K.', college: 'SRM University', role: 'Data Scientist @ Razorpay',
    avatar: 'SK', grad: 'linear-gradient(135deg,#10b981,#0891b2)',
    package: '₹16 LPA', quote: 'From a tier-3 college to FinTech — NM\'s career counsellor showed me how to position my ML projects. Life-changing!',
    rating: 5, domain: 'Data Science',
  },
];

const STEPS = [
  { n: '01', icon: <Rocket size={20} />, title: 'Complete a Project', desc: 'Finish at least one NM-aligned project with a 4★+ rating to unlock placement support.', color: '#7c3aed' },
  { n: '02', icon: <FileText size={20} />, title: 'Build Your Profile', desc: 'Use the AI resume builder and complete your skills assessment.', color: '#3b82f6' },
  { n: '03', icon: <Video size={20} />, title: 'Mock Interviews', desc: 'Schedule 2 mock interview sessions with our industry mentors.', color: '#06b6d4' },
  { n: '04', icon: <Briefcase size={20} />, title: 'Get Placed', desc: 'Apply to matched jobs directly. Our team follows up until you get an offer.', color: '#10b981' },
];

export default function PlacementSupportPage() {
  return (
    <div className="page">

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', paddingTop: 100, paddingBottom: 60, overflow: 'hidden' }}>
        <StarField />
        <div className="hero-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        {/* Hero image overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(/placement_hero.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.12,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,7,18,0.6) 0%, rgba(3,7,18,0.9) 60%, rgb(3,7,18) 100%)', zIndex: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <motion.div {...anim(0)}>
            <span className="chip" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)', color: '#34d399', marginBottom: 20 }}>
              <Briefcase size={12} /> Career Placement Support
            </span>
            <h1 className="h1" style={{ marginBottom: 20 }}>
              <span style={{ color: '#f1f5f9' }}>Your Career,</span><br />
              <span className="grad-green">Our Priority</span>
            </h1>
            <p className="text-lead" style={{ marginBottom: 32, maxWidth: 480 }}>
              End-to-end placement support — AI resume building, mock interviews, job matching, and dedicated career counselling until you land your dream role.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                Get Placed Now <ArrowRight size={18} />
              </Link>
              <Link to="/how-it-works" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
                How It Works
              </Link>
            </div>
          </motion.div>

          {/* Hero stats card */}
          <motion.div {...anim(0.15)}>
            <div className="glass-card" style={{ borderRadius: 24, padding: 32, border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', filter: 'blur(30px)' }} />
              <img src="/placement_hero.jpg" alt="Placement Dashboard" style={{ width: '100%', borderRadius: 16, marginBottom: 20, objectFit: 'cover', height: 200 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {PLACEMENT_STATS.map(s => (
                  <div key={s.label} style={{ background: `${s.color}10`, borderRadius: 12, padding: '14px 16px', border: `1px solid ${s.color}20` }}>
                    <div style={{ fontSize: 20 }}>{s.icon}</div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 20, color: s.color, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PROCESS STEPS ═══ */}
      <section style={{ background: 'rgba(6,13,31,0.7)', padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.n} {...anim(i * 0.1)} style={{ padding: '24px 28px', borderRight: i < STEPS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${step.color}20`, color: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {step.icon}
                  </div>
                  <span className="font-mono" style={{ fontSize: 10, color: step.color, fontWeight: 700 }}>STEP {step.n}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0', marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{step.desc}</div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={16} color="#1e293b" style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES GRID ═══ */}
      <section className="section">
        <div className="container">
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 56 }}>
            <span className="chip" style={{ background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
              <TrendingUp size={12} /> Complete Career Toolkit
            </span>
            <h2 className="h2" style={{ marginTop: 12 }}>
              Everything to <span className="grad-purple">Land Your Dream Job</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 500, margin: '12px auto 0' }}>
              Six powerful services bundled together — free for all NaanMudhalvan students.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.title} {...anim(i * 0.08)}
                className="glass-card card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${svc.color},transparent)` }} />
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${svc.color}18`, color: svc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {svc.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: '#e2e8f0', marginBottom: 10 }}>{svc.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 }}>{svc.desc}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {svc.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8' }}>
                      <CheckCircle size={13} color={svc.color} style={{ flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HIRING PARTNERS ═══ */}
      <section className="section" style={{ background: 'rgba(6,13,31,0.5)', position: 'relative' }}>
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 48 }}>
            <span className="chip" style={{ background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.25)', color: '#60a5fa' }}>
              <Building2 size={12} /> Active Hiring Partners
            </span>
            <h2 className="h2" style={{ marginTop: 12 }}>Companies <span className="grad-purple">Hiring Now</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
            {COMPANIES_HIRING.map((c, i) => (
              <motion.div key={c.name} {...anim(i * 0.07)}
                className="glass-card" style={{ borderRadius: 16, padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${c.color}15`, cursor: 'pointer', transition: 'border-color 0.2s' }}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 28 }}>{c.logo}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.roles} open roles</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.avg}</div>
                  <div style={{ fontSize: 10, color: '#334155', marginTop: 2 }}>avg package</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SUCCESS STORIES ═══ */}
      <section className="section">
        <div className="container">
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 52 }}>
            <span className="chip" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#34d399' }}>
              <Users size={12} /> Student Success Stories
            </span>
            <h2 className="h2" style={{ marginTop: 12 }}>Real Students, <span className="grad-green">Real Offers</span></h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {SUCCESS_STORIES.map((s, i) => (
              <motion.div key={s.name} {...anim(i * 0.1)}
                className="glass-card card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[...Array(s.rating)].map((_, j) => <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 20 }}>"{s.quote}"</p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{s.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{s.college}</div>
                    <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600, marginTop: 2 }}>{s.role}</div>
                  </div>
                  <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{s.package}</div>
                    <div style={{ fontSize: 9, color: '#475569' }}>CTC</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
          <motion.div {...anim()} className="glass-card" style={{ padding: 'clamp(32px,5vw,60px)', borderRadius: 28, border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, left: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <h2 className="h2" style={{ marginBottom: 14 }}>Ready to Get <span className="grad-green">Placed?</span></h2>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
                Join thousands of Tamil Nadu students who found their dream jobs through NaanMudhalvan. Start with a free project today.
              </p>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                Start Your Journey <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
