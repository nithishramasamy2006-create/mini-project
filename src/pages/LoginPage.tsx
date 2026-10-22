import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight, GraduationCap, Building2, School, ShieldCheck } from 'lucide-react';
import { useAuth, rolePortal } from '../AuthContext';

const PORTALS = [
  { id: 'student', label: 'Student',  icon: GraduationCap, color: '#7c3aed', placeholder: 'student@email.com' },
  { id: 'company', label: 'Company',  icon: Building2,      color: '#3b82f6', placeholder: 'hr@company.com' },
  { id: 'college', label: 'College',  icon: School,         color: '#10b981', placeholder: 'tpo@college.edu' },
  { id: 'admin',   label: 'Admin',    icon: ShieldCheck,    color: '#f59e0b', placeholder: 'admin@nm.gov.in' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();

  const [portal,   setPortal]   = useState('student');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const activePortal = PORTALS.find(p => p.id === portal)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password)  { setError('Email and password are required.'); return; }
    setLoading(true);
    try {
      const result = await loginWithCredentials(email, password, portal);
      if (result.success) {
        navigate(rolePortal(result.role || portal));
      } else {
        // If role mismatch, tell the user which portal to use
        if (result.role && result.role !== portal) {
          setError(`This account is registered as "${result.role}". Please select the ${result.role.charAt(0).toUpperCase() + result.role.slice(1)} portal tab.`);
        } else {
          setError(result.message);
        }
      }
    } catch {
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        style={{ width: '100%', maxWidth: 440 }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <motion.div
            animate={{ background: [`linear-gradient(135deg, ${activePortal.color}, ${activePortal.color}99)`] }}
            transition={{ duration: 0.3 }}
            style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${activePortal.color}, ${activePortal.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Zap size={24} color="#fff" strokeWidth={2.5} />
          </motion.div>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 26, color: 'var(--text)', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Sign in to your NaanMudhalvan account</p>
        </div>

        {/* Portal selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
          {PORTALS.map(p => (
            <button key={p.id} type="button" onClick={() => { setPortal(p.id); setError(''); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px',
                borderRadius: 12, cursor: 'pointer',
                border: `2px solid ${portal === p.id ? p.color : 'var(--border)'}`,
                background: portal === p.id ? `${p.color}10` : 'var(--surface)',
                transition: 'all 0.2s',
              }}>
              <p.icon size={18} color={portal === p.id ? p.color : 'var(--text-3)'} strokeWidth={2} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: portal === p.id ? p.color : 'var(--text-2)' }}>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Portal label */}
        <div style={{ padding: '9px 14px', borderRadius: 10, background: `${activePortal.color}0d`, border: `1px solid ${activePortal.color}22`, marginBottom: 20, fontSize: 12.5, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <activePortal.icon size={13} color={activePortal.color} />
          Signing in to the <strong style={{ color: activePortal.color }}>{activePortal.label} Portal</strong>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              ⚠️ <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input
              id="login-email"
              className="inp"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={activePortal.placeholder}
              style={{ fontSize: 14 }}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>Password</label>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11.5, color: activePortal.color, fontWeight: 600 }}>
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                className="inp"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ fontSize: 14, paddingRight: 44 }}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 15, borderRadius: 14, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', background: `linear-gradient(135deg, ${activePortal.color}, ${activePortal.color}bb)`, marginTop: 4 }}>
            {loading
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="spinner" /> Signing in…</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Sign In to {activePortal.label} Portal <ArrowRight size={16} /></span>
            }
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 18px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text-2)' }}>
          Don't have an account?{' '}
          <Link to={`/register?role=${portal}`} style={{ color: activePortal.color, fontWeight: 700, textDecoration: 'none' }}>
            Register as {activePortal.label} →
          </Link>
        </p>

        {/* Role hint */}
        <div style={{ marginTop: 22, padding: '12px 16px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-2)' }}>💡 Portal Guide:</strong><br />
          <span style={{ color: '#7c3aed' }}>🎓 Student</span> — Browse courses & apply for internships<br />
          <span style={{ color: '#3b82f6' }}>🏢 Company</span> — Post jobs & manage applications<br />
          <span style={{ color: '#10b981' }}>🏫 College</span> — Track placements & manage students<br />
          <span style={{ color: '#f59e0b' }}>🛡️ Admin</span> — Full platform management
        </div>
      </motion.div>
    </div>
  );
}
