import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, UserCircle, Search, Wrench, Trophy,
  CheckCircle, Star, Zap, ShieldCheck, BookOpen,
  Briefcase, GraduationCap, Users, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import StarField from '../components/StarField';

const anim = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const STEPS = [
  {
    n: '01',
    icon: <UserCircle size={36} />,
    emoji: '👤',
    title: 'Create Your Profile',
    color: '#7c3aed',
    desc: 'Sign up for free and build your student profile in minutes. Link your college, upload your resume, and highlight your skills. Our AI engine instantly matches you with the best-fit projects based on your background and career goals.',
    bullets: [
      'Free registration — no credit card needed',
      'AI-powered skill assessment',
      'Auto-match with 2,400+ live projects',
      'College verification for credit eligibility',
    ],
  },
  {
    n: '02',
    icon: <Search size={36} />,
    emoji: '🔍',
    title: 'Pick a Project',
    color: '#3b82f6',
    desc: 'Browse a curated list of real industry projects from 180+ Tamil Nadu companies. Filter by stipend amount, tech stack, domain, and duration. Apply with one click — companies typically respond within 48 hours.',
    bullets: [
      'Projects with stipends up to ₹25,000/month',
      'Filter by skill, domain & duration',
      '48-hour response SLA from companies',
      'Multiple concurrent applications allowed',
    ],
  },
  {
    n: '03',
    icon: <Wrench size={36} />,
    emoji: '🛠️',
    title: 'Build & Learn',
    color: '#06b6d4',
    desc: 'Work directly with industry engineers. You\'ll get weekly sync calls, code reviews, structured milestones, and access to our mentor network. Real feedback, real tools, real deadlines — just like a professional environment.',
    bullets: [
      'Weekly 1:1 mentorship sessions',
      'Code reviews from senior engineers',
      'Access to 500+ expert mentors',
      'Structured milestone-based progress',
    ],
  },
  {
    n: '04',
    icon: <Trophy size={36} />,
    emoji: '🏆',
    title: 'Earn & Certify',
    color: '#10b981',
    desc: 'Complete the project, receive your stipend, and earn a Government of Tamil Nadu (NM) recognized certificate. Showcase your work in a polished portfolio, and get placement support from our career team.',
    bullets: [
      'Stipend paid directly to your bank account',
      'Govt-recognized NM certificate',
      'College credit-eligible (up to 4 credits)',
      'Placement support & alumni network access',
    ],
  },
];

const BENEFITS = [
  { icon: <Zap size={22} />, title: 'Zero Cost to Students', desc: 'Completely free to join. No fees, no subscriptions. Companies pay the platform.', color: '#f59e0b' },
  { icon: <ShieldCheck size={22} />, title: 'Govt Certified', desc: 'Every certificate is recognized by the Government of Tamil Nadu under the NM initiative.', color: '#10b981' },
  { icon: <BookOpen size={22} />, title: 'College Credit', desc: 'Earn up to 4 academic credits for completing projects — recognized by 200+ colleges.', color: '#7c3aed' },
  { icon: <Briefcase size={22} />, title: 'Real Stipends', desc: 'Get paid for your work — stipends range from ₹5,000 to ₹25,000 per month.', color: '#3b82f6' },
  { icon: <GraduationCap size={22} />, title: 'Expert Mentorship', desc: '500+ industry mentors from top companies — TCS, Zoho, Freshworks, Infosys & more.', color: '#06b6d4' },
  { icon: <Users size={22} />, title: 'Alumni Network', desc: 'Join 45,000+ alumni across Tamil Nadu. Network, refer jobs, and grow together.', color: '#ec4899' },
];

const FAQS = [
  { q: 'Who is eligible to join NaanMudhalvan Marketplace?', a: 'Any student currently enrolled in a college or university in Tamil Nadu is eligible. You need a valid college email or institution ID to verify your enrollment.' },
  { q: 'How long do projects typically last?', a: 'Most projects run for 4 to 16 weeks. Short micro-projects (2–4 weeks) are also available for beginners. You can filter by duration when browsing.' },
  { q: 'Can I work on multiple projects at once?', a: 'Yes! Many students work on 1–2 concurrent projects. However, we recommend starting with one project until you\'re comfortable with the workflow.' },
  { q: 'How and when do I get paid?', a: 'Stipends are transferred directly to your bank account at the end of each milestone or monthly — whichever the company prefers. Payment is guaranteed upon milestone completion.' },
  { q: 'Will this count towards my college credits?', a: 'Yes, if your college is in our network (200+ partner institutions). Check with your academic advisor or contact us — we provide an official letter for credit transfer.' },
  { q: 'What if I face issues during a project?', a: 'Our support team and assigned mentor are available to resolve disputes. If a company is unresponsive for more than 5 business days, we step in immediately.' },
];

const STATS = [
  { val: '45,000+', label: 'Students Placed', icon: '🎓' },
  { val: '₹12 Cr+', label: 'Stipends Paid', icon: '💰' },
  { val: '180+', label: 'Partner Companies', icon: '🏢' },
  { val: '4.8★', label: 'Average Rating', icon: '⭐' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      onClick={() => setOpen(o => !o)}
      style={{
        background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(16px)',
        border: `1px solid ${open ? 'rgba(124,58,237,0.4)' : 'rgba(148,163,184,0.08)'}`,
        borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
        transition: 'border-color 0.25s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#e2e8f0', lineHeight: 1.5 }}>{q}</span>
        <span style={{ color: '#7c3aed', flexShrink: 0 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </div>
      {open && (
        <motion.p
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 14, fontSize: 14, color: '#64748b', lineHeight: 1.75 }}
        >
          {a}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="page">

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingBottom: 80, overflow: 'hidden' }}>
        <StarField />
        <div className="hero-glow" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div {...anim(0)} style={{ marginBottom: 20 }}>
            <span className="chip" style={{ background: 'rgba(6,182,212,0.1)', borderColor: 'rgba(6,182,212,0.3)', color: '#22d3ee' }}>
              <Zap size={12} /> Simple 4-Step Process
            </span>
          </motion.div>
          <motion.h1 {...anim(0.08)} className="h1" style={{ marginBottom: 20 }}>
            <span style={{ color: '#f1f5f9' }}>How It</span>{' '}
            <span className="grad-purple">Works</span>
          </motion.h1>
          <motion.p {...anim(0.16)} className="text-lead" style={{ maxWidth: 560, margin: '0 auto 36px' }}>
            From college student to industry professional — here's exactly how NaanMudhalvan Marketplace works,
            step by step.
          </motion.p>
          <motion.div {...anim(0.24)} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/projects" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
              Browse Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div style={{ background: 'rgba(6,13,31,0.8)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...anim(i * 0.08)}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div className="font-display" style={{ fontWeight: 700, fontSize: 26, color: '#f1f5f9' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 4 STEPS ═══ */}
      <section className="section">
        <div className="container">
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 64 }}>
            <h2 className="h2">Your Journey, <span className="grad-purple">Step by Step</span></h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '12px auto 0' }}>
              Each step is designed to minimize friction and maximize your growth.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {STEPS.map((step, i) => (
              <motion.div key={step.n} {...anim(i * 0.1)}
                style={{
                  display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr',
                  gap: 40, alignItems: 'center',
                }}
              >
                {/* Text side */}
                <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: step.color, opacity: 0.7 }}>STEP {step.n}</span>
                    <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg,${step.color}40,transparent)` }} />
                  </div>
                  <h3 className="h2" style={{ fontSize: 'clamp(24px,3vw,36px)', marginBottom: 16 }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 24 }}>{step.desc}</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {step.bullets.map(b => (
                      <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94a3b8' }}>
                        <CheckCircle size={16} color={step.color} style={{ flexShrink: 0 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual card side */}
                <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                  <div className="glass-card" style={{
                    borderRadius: 24, padding: '40px 36px', position: 'relative', overflow: 'hidden',
                    border: `1px solid ${step.color}25`,
                    background: `linear-gradient(145deg, rgba(15,23,42,0.9), rgba(${step.color === '#7c3aed' ? '124,58,237' : step.color === '#3b82f6' ? '59,130,246' : step.color === '#06b6d4' ? '6,182,212' : '16,185,129'},0.05))`,
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${step.color},transparent)` }} />
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: `${step.color}12`, filter: 'blur(40px)' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg,${step.color},${step.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: 20 }}>
                        {step.icon}
                      </div>
                      <div className="font-display" style={{ fontWeight: 700, fontSize: 22, color: '#f1f5f9', marginBottom: 8 }}>{step.title}</div>
                      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                        {step.n === '01' && 'Average time to set up: 5 minutes'}
                        {step.n === '02' && 'Average time to get matched: 48 hours'}
                        {step.n === '03' && 'Average project duration: 8 weeks'}
                        {step.n === '04' && 'Certificate issued within 3 business days'}
                      </div>
                      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                          {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />)}
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>
                          {step.n === '01' && '45,000+ students joined'}
                          {step.n === '02' && '2,400+ active projects'}
                          {step.n === '03' && '500+ expert mentors'}
                          {step.n === '04' && '₹12 Cr+ paid out'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="section" style={{ background: 'rgba(6,13,31,0.5)', position: 'relative' }}>
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 56 }}>
            <span className="chip" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.25)', color: '#34d399' }}>
              Why Students Love Us
            </span>
            <h2 className="h2" style={{ marginTop: 12 }}>
              Everything You Need to <span className="grad-green">Succeed</span>
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title} {...anim(i * 0.08)}
                className="glass-card card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${b.color},transparent)` }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.color, marginBottom: 16 }}>
                  {b.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#e2e8f0', marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <motion.div {...anim()} className="text-center" style={{ marginBottom: 52 }}>
            <span className="chip">Common Questions</span>
            <h2 className="h2" style={{ marginTop: 12 }}>
              Frequently Asked <span className="grad-purple">Questions</span>
            </h2>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <motion.div key={faq.q} {...anim(i * 0.06)}>
                <FAQItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="section" style={{ paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 700, textAlign: 'center' }}>
          <motion.div {...anim()} className="glass-card" style={{ padding: 'clamp(32px,5vw,64px)', borderRadius: 28, position: 'relative', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.2)' }}>
            <div style={{ position: 'absolute', top: -80, left: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: -80, right: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', filter: 'blur(40px)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
              <h2 className="h2" style={{ marginBottom: 14 }}>
                Ready to Start Your <span className="grad-purple">Journey?</span>
              </h2>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 32 }}>
                Join 45,000+ students across Tamil Nadu who are building real careers. It's completely free to get started.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                <Link to="/register" className="btn btn-primary btn-lg" style={{ textDecoration: 'none' }}>
                  Create Free Account <ArrowRight size={18} />
                </Link>
                <Link to="/projects" className="btn btn-outline btn-lg" style={{ textDecoration: 'none' }}>
                  Browse Projects
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
