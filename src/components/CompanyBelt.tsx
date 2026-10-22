import { useState } from 'react';
import { motion } from 'framer-motion';

// ── Inline SVG logos — 100% local, zero network dependency ─
// Each logo is a React component rendered as SVG directly in the DOM

const Logos: Record<string, () => JSX.Element> = {
  zoho: () => (
    <svg viewBox="0 0 34 34" width="40" height="40">
      <rect x="0"  y="0"  width="16" height="16" rx="3" fill="#e42527"/>
      <rect x="17" y="0"  width="16" height="16" rx="3" fill="#f5a800"/>
      <rect x="0"  y="17" width="16" height="16" rx="3" fill="#00aaef"/>
      <rect x="17" y="17" width="16" height="16" rx="3" fill="#00b14f"/>
    </svg>
  ),
  tcs: () => (
    <svg viewBox="0 0 56 30" width="56" height="30">
      <rect x="0" y="0" width="56" height="30" rx="4" fill="#1a56db"/>
      <text x="5" y="23" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="22" fill="#fff">TCS</text>
    </svg>
  ),
  infosys: () => (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="#007cc3"/>
      <text x="7" y="27" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18" fill="#fff">i</text>
      <circle cx="24" cy="12" r="4" fill="#fff"/>
    </svg>
  ),
  freshworks: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <defs>
        <radialGradient id="fw_grad" cx="40%" cy="35%">
          <stop offset="0%"   stopColor="#29d9f5"/>
          <stop offset="40%"  stopColor="#60d344"/>
          <stop offset="80%"  stopColor="#f5a800"/>
          <stop offset="100%" stopColor="#e83151"/>
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="14" fill="url(#fw_grad)"/>
    </svg>
  ),
  isro: () => (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <polygon points="20,2 23,13 34,13 25,20 28,31 20,24 12,31 15,20 6,13 17,13" fill="#ff671f" opacity="0.3"/>
      <line x1="20" y1="4" x2="20" y2="36" stroke="#ff671f" strokeWidth="2.5"/>
      <ellipse cx="20" cy="20" rx="10" ry="16" fill="none" stroke="#003580" strokeWidth="2"/>
    </svg>
  ),
  razorpay: () => (
    <svg viewBox="0 0 30 40" width="30" height="40">
      <polygon points="15,2 22,18 17,18 24,38 8,16 14,16 7,2" fill="#3395ff"/>
    </svg>
  ),
  ola: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <circle cx="15" cy="15" r="14" fill="#1c1c1c"/>
      <circle cx="15" cy="15" r="8"  fill="#a8e03c"/>
    </svg>
  ),
  byjus: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <rect x="0" y="0" width="30" height="30" rx="7" fill="#9b59b6"/>
      <text x="5" y="23" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" fill="#fff">B</text>
    </svg>
  ),
  wipro: () => (
    <svg viewBox="0 0 40 40" width="40" height="40">
      {['#e42527','#f5a800','#00b14f','#00aaef','#9b59b6','#ff671f','#00c9c9','#f542a1'].map((c,i) => (
        <circle key={i} cx={5 + i * 3.8} cy="12" r="4" fill={c} opacity="0.9"/>
      ))}
      <text x="2" y="34" fontFamily="Arial,sans-serif" fontWeight="400" fontSize="16" fill="#341c6c">wipro</text>
    </svg>
  ),
  hcltech: () => (
    <svg viewBox="0 0 50 30" width="50" height="30">
      <rect x="0" y="0" width="50" height="30" rx="4" fill="#00539b"/>
      <text x="4" y="23" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="21" fill="#fff" letterSpacing="-1">HCL</text>
    </svg>
  ),
  cognizant: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <circle cx="15" cy="15" r="13" fill="none" stroke="#0033a0" strokeWidth="3"/>
      <circle cx="15" cy="15" r="6"  fill="#0033a0"/>
    </svg>
  ),
  techmahindra: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <rect x="0" y="0" width="30" height="30" rx="4" fill="#c8102e"/>
      <text x="3" y="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="16" fill="#fff">TM</text>
    </svg>
  ),
  google: () => (
    <svg viewBox="0 0 90 30" width="82" height="28">
      <text x="0" y="24" fontFamily="Product Sans,Arial,sans-serif" fontWeight="400" fontSize="24" letterSpacing="-0.5">
        <tspan fill="#4285f4">G</tspan>
        <tspan fill="#ea4335">o</tspan>
        <tspan fill="#fbbc05">o</tspan>
        <tspan fill="#4285f4">g</tspan>
        <tspan fill="#34a853">l</tspan>
        <tspan fill="#ea4335">e</tspan>
      </text>
    </svg>
  ),
  microsoft: () => (
    <svg viewBox="0 0 24 24" width="40" height="40">
      <rect x="0"  y="0"  width="11" height="11" fill="#f35325"/>
      <rect x="13" y="0"  width="11" height="11" fill="#81bc06"/>
      <rect x="0"  y="13" width="11" height="11" fill="#05a6f0"/>
      <rect x="13" y="13" width="11" height="11" fill="#ffba08"/>
    </svg>
  ),
  amazon: () => (
    <svg viewBox="0 0 60 36" width="60" height="36">
      <text x="0" y="22" fontFamily="Amazon Ember,Arial,sans-serif" fontWeight="700" fontSize="20" fill="#1a1a1a">amazon</text>
      <path d="M2,28 Q30,36 57,28" stroke="#ff9900" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <polygon points="55,25 60,28 55,31" fill="#ff9900"/>
    </svg>
  ),
  ibm: () => (
    <svg viewBox="0 0 52 28" width="52" height="28">
      {[2,9,16].map(y => (
        <g key={y}>
          <rect x="0"  y={y}   width="52" height="5" fill="#1f70c1"/>
        </g>
      ))}
      <rect x="14" y="2"  width="5" height="19" fill="#fff"/>
      <rect x="32" y="2"  width="5" height="19" fill="#fff"/>
    </svg>
  ),
  oracle: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <ellipse cx="15" cy="15" rx="14" ry="14" fill="#f80000"/>
      <ellipse cx="15" cy="15" rx="7"  ry="14" fill="#c00000"/>
      <ellipse cx="15" cy="15" rx="14" ry="14" fill="none" stroke="#c00000" strokeWidth="1.5"/>
    </svg>
  ),
  swiggy: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <circle cx="15" cy="15" r="14" fill="#fc8019"/>
      <path d="M9,11 Q15,6 21,11 Q24,18 18,22 Q15,24 12,22 Q8,18 9,11Z" fill="#fff"/>
    </svg>
  ),
  zomato: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <circle cx="15" cy="15" r="14" fill="#e23744"/>
      <text x="7" y="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18" fill="#fff">Z</text>
    </svg>
  ),
  paytm: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <rect x="0" y="0" width="30" height="30" rx="5" fill="#00b9f1"/>
      <text x="3" y="18" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="12" fill="#fff">Pay</text>
      <rect x="0" y="19" width="30" height="11" rx="0" fill="#1a1a1a"/>
      <rect x="0" y="25" width="30" height="5" rx="5" fill="#1a1a1a"/>
    </svg>
  ),
  phonepe: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <rect x="0" y="0" width="30" height="30" rx="7" fill="#5f259f"/>
      <text x="3" y="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18" fill="#fff">Ph</text>
    </svg>
  ),
  lt: () => (
    <svg viewBox="0 0 56 30" width="56" height="30">
      <rect x="0" y="0" width="56" height="30" rx="4" fill="#005a9c"/>
      <text x="4" y="23" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18" fill="#fff">L&amp;T</text>
    </svg>
  ),
  bhel: () => (
    <svg viewBox="0 0 50 30" width="50" height="30">
      <rect x="0" y="0" width="50" height="30" rx="4" fill="#003087"/>
      <text x="3" y="22" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="16" fill="#fff">BHEL</text>
    </svg>
  ),
  cred: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <rect x="0" y="0" width="30" height="30" rx="15" fill="#1c1c1c"/>
      <circle cx="15" cy="15" r="8" fill="none" stroke="#d4af37" strokeWidth="2.5"/>
    </svg>
  ),
  meesho: () => (
    <svg viewBox="0 0 30 30" width="40" height="40">
      <rect x="0" y="0" width="30" height="30" rx="7" fill="#9c27b0"/>
      <text x="4" y="23" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="20" fill="#fff">M</text>
    </svg>
  ),
};

// ── Company data ────────────────────────────────────────────
const COMPANIES = [
  { key: 'zoho',         name: 'Zoho',          industry: 'SaaS',         color: '#e42527', bg: '#fff5f5' },
  { key: 'tcs',          name: 'TCS',            industry: 'IT Services',  color: '#1a56db', bg: '#f0f5ff' },
  { key: 'infosys',      name: 'Infosys',        industry: 'IT Consulting',color: '#007cc3', bg: '#f0f9ff' },
  { key: 'freshworks',   name: 'Freshworks',     industry: 'SaaS',         color: '#29b5e8', bg: '#f0fbff' },
  { key: 'isro',         name: 'ISRO',           industry: 'Space Tech',   color: '#ff671f', bg: '#fff7f0' },
  { key: 'razorpay',     name: 'Razorpay',       industry: 'FinTech',      color: '#3395ff', bg: '#f0f7ff' },
  { key: 'ola',          name: 'OLA',            industry: 'Mobility',     color: '#1ab394', bg: '#f0faf9' },
  { key: 'byjus',        name: "BYJU'S",         industry: 'EdTech',       color: '#9b59b6', bg: '#faf0ff' },
  { key: 'wipro',        name: 'Wipro',          industry: 'IT Services',  color: '#341c6c', bg: '#f5f0ff' },
  { key: 'hcltech',      name: 'HCL Tech',       industry: 'Technology',   color: '#00539b', bg: '#f0f6ff' },
  { key: 'cognizant',    name: 'Cognizant',      industry: 'IT Services',  color: '#0033a0', bg: '#f0f4ff' },
  { key: 'techmahindra', name: 'Tech Mahindra',  industry: 'IT & Telecom', color: '#c8102e', bg: '#fff0f2' },
  { key: 'google',       name: 'Google',         industry: 'Technology',   color: '#4285f4', bg: '#f5f9ff' },
  { key: 'microsoft',    name: 'Microsoft',      industry: 'Technology',   color: '#00a4ef', bg: '#f0faff' },
  { key: 'amazon',       name: 'Amazon',         industry: 'E-Commerce',   color: '#ff9900', bg: '#fff8f0' },
  { key: 'ibm',          name: 'IBM',            industry: 'Technology',   color: '#1f70c1', bg: '#f0f6ff' },
  { key: 'oracle',       name: 'Oracle',         industry: 'Database',     color: '#f80000', bg: '#fff0f0' },
  { key: 'swiggy',       name: 'Swiggy',         industry: 'FoodTech',     color: '#fc8019', bg: '#fff7f0' },
  { key: 'zomato',       name: 'Zomato',         industry: 'FoodTech',     color: '#e23744', bg: '#fff0f1' },
  { key: 'paytm',        name: 'Paytm',          industry: 'FinTech',      color: '#00b9f1', bg: '#f0fbff' },
  { key: 'phonepe',      name: 'PhonePe',        industry: 'FinTech',      color: '#5f259f', bg: '#f8f0ff' },
  { key: 'lt',           name: 'L&T',            industry: 'Engineering',  color: '#005a9c', bg: '#f0f6ff' },
  { key: 'bhel',         name: 'BHEL',           industry: 'Engineering',  color: '#003087', bg: '#f0f4ff' },
  { key: 'cred',         name: 'CRED',           industry: 'FinTech',      color: '#1c1c1c', bg: '#f5f5f5' },
  { key: 'meesho',       name: 'Meesho',         industry: 'E-Commerce',   color: '#9c27b0', bg: '#fdf0ff' },
];

const DOUBLED  = [...COMPANIES, ...COMPANIES, ...COMPANIES];
const DOUBLED2 = [...[...COMPANIES].reverse(), ...[...COMPANIES].reverse(), ...[...COMPANIES].reverse()];

// ── Single card ─────────────────────────────────────────────
function LogoCard({ co }: { co: typeof COMPANIES[0] }) {
  const [hovered, setHovered] = useState(false);
  const LogoSVG = Logos[co.key];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '22px 32px', borderRadius: 20, flexShrink: 0,
        background: hovered ? co.bg : 'var(--surface)',
        border: `1.5px solid ${hovered ? co.color + '55' : 'var(--border)'}`,
        boxShadow: hovered ? `0 8px 28px ${co.color}22` : '0 2px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer', minWidth: 170, minHeight: 84,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* SVG logo box — scaled up 1.45× to fill the larger card */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.25s',
        transform: hovered ? 'scale(1.6)' : 'scale(1.45)',
        transformOrigin: 'center center',
      }}>
        {LogoSVG ? <LogoSVG /> : (
          /* Fallback styled initials if key not found */
          <div style={{
            width: 90, height: 48, borderRadius: 10,
            background: `linear-gradient(135deg,${co.color}22,${co.color}44)`,
            border: `1.5px solid ${co.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontWeight: 900, fontSize: 18, color: co.color }}>
              {co.name.split(' ').map(w => w[0]).join('').slice(0,3)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main section ────────────────────────────────────────────
export default function CompanyBelt() {
  return (
    <section id="companies" style={{ padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.05), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 48px', textAlign: 'center' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 18px', borderRadius: 999,
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 14 }}>🤝</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Trusted by India's Leading Companies
            </span>
          </div>
          <h2 className="font-display" style={{
            fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800,
            color: 'var(--text)', letterSpacing: '-0.03em', marginBottom: 12,
          }}>
            <span className="grad-text">180+</span> Industry Partners
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 520, margin: '0 auto' }}>
            Real internships & projects from top companies — exclusively for NM students
          </p>
        </motion.div>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{
        maskImage: 'linear-gradient(to right,transparent,black 8%,black 92%,transparent)',
        WebkitMaskImage: 'linear-gradient(to right,transparent,black 8%,black 92%,transparent)',
        overflow: 'hidden', marginBottom: 16,
      }}>
        <motion.div
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: 14, width: 'max-content' }}
        >
          {DOUBLED.map((co, i) => <LogoCard key={`r1-${i}`} co={co} />)}
        </motion.div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{
        maskImage: 'linear-gradient(to right,transparent,black 8%,black 92%,transparent)',
        WebkitMaskImage: 'linear-gradient(to right,transparent,black 8%,black 92%,transparent)',
        overflow: 'hidden',
      }}>
        <motion.div
          animate={{ x: ['-33.33%', '0%'] }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: 14, width: 'max-content' }}
        >
          {DOUBLED2.map((co, i) => <LogoCard key={`r2-${i}`} co={co} />)}
        </motion.div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}
        style={{ maxWidth: 820, margin: '52px auto 0', padding: '0 24px' }}
      >
        <div className="glass-heavy" style={{
          borderRadius: 22, padding: '28px 36px',
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, textAlign: 'center',
        }}>
          {[
            { icon: '✅', val: '94%', label: 'Project Completion Rate', color: '#10b981' },
            { icon: '🤝', val: '68%', label: 'Job Referrals Received',  color: '#7c3aed' },
            { icon: '🏆', val: '32%', label: 'PPO Conversion Rate',     color: '#f59e0b' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '0 20px', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
              <div className="font-display" style={{ fontSize: 30, fontWeight: 900, color: item.color, marginBottom: 4, lineHeight: 1 }}>
                {item.val}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-3)', fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
