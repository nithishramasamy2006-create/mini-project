import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Zap, GraduationCap, Building2, School, ShieldCheck } from 'lucide-react';
import { useAuth } from '../AuthContext';

const ROLES = [
  { id: 'student',  label: 'Student',  icon: GraduationCap, color: '#7c3aed', desc: 'Browse courses, internships & projects' },
  { id: 'company',  label: 'Company',  icon: Building2,      color: '#3b82f6', desc: 'Post internships & hire Tamil Nadu talent' },
  { id: 'college',  label: 'College',  icon: School,         color: '#10b981', desc: 'Manage students & track placements' },
  { id: 'admin',    label: 'Admin',    icon: ShieldCheck,    color: '#f59e0b', desc: 'Platform administration access' },
];

export default function RegisterPage() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [role, setRole]     = useState<string>(params.get('role') || 'student');
  const [showPw, setShowPw] = useState(false);
  const [showC,  setShowC]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Common fields
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  // Student
  const [phone,    setPhone]    = useState('');
  const [college,  setCollege]  = useState('');
  const [year,     setYear]     = useState('');
  const [branch,   setBranch]   = useState('');
  // Company
  const [companyName, setCompanyName] = useState('');
  const [industry,    setIndustry]    = useState('');
  const [website,     setWebsite]     = useState('');
  const [companySize, setCompanySize] = useState('');
  const [location,    setLocation]    = useState('');
  const [hrName,      setHrName]      = useState('');
  const [hrPhone,     setHrPhone]     = useState('');
  // College
  const [collegeName,  setCollegeName]  = useState('');
  const [affiliation,  setAffiliation]  = useState('');
  const [district,     setDistrict]     = useState('');
  const [naac,         setNaac]         = useState('');
  const [tpoName,      setTpoName]      = useState('');
  const [tpoPhone,     setTpoPhone]     = useState('');
  // Admin
  const [adminKey, setAdminKey] = useState('');

  const activeRole = ROLES.find(r => r.id === role)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const body: Record<string, any> = { role, name, email, password };
      if (role === 'student') Object.assign(body, { phone, college, year, branch });
      if (role === 'company') Object.assign(body, { companyName, industry, website, companySize, location, hrName, hrPhone });
      if (role === 'college') Object.assign(body, { collegeName, affiliation, district, naac, tpoName, tpoPhone });
      if (role === 'admin')   Object.assign(body, { adminKey });

      const res  = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed.'); setLoading(false); return; }

      login(data.user, data.token);
      // Role-based redirect
      const redirect = { student: '/portal/student', company: '/portal/company', college: '/portal/college', admin: '/portal/admin' };
      navigate(redirect[data.user.role as keyof typeof redirect] || '/portal/student');
    } catch {
      setError('Cannot connect to server. Make sure the backend is running.');
      setLoading(false);
    }
  };

  const inp = { className: 'inp', style: { fontSize: 13.5 } };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 560 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${activeRole.color}, ${activeRole.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', transition: 'background 0.3s' }}>
            <Zap size={24} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 className="font-display" style={{ fontWeight: 800, fontSize: 26, color: 'var(--text)', marginBottom: 6 }}>Create Your Account</h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Join 45,000+ Tamil Nadu students. 100% free!</p>
        </div>

        {/* Role selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
          {ROLES.map(r => (
            <button key={r.id} type="button" onClick={() => { setRole(r.id); setError(''); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px',
                borderRadius: 12, cursor: 'pointer', border: `2px solid ${role === r.id ? r.color : 'var(--border)'}`,
                background: role === r.id ? `${r.color}10` : 'var(--surface)', transition: 'all 0.2s',
              }}>
              <r.icon size={18} color={role === r.id ? r.color : 'var(--text-3)'} strokeWidth={2} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: role === r.id ? r.color : 'var(--text-2)' }}>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Role description */}
        <div style={{ padding: '10px 14px', borderRadius: 10, background: `${activeRole.color}0d`, border: `1px solid ${activeRole.color}25`, marginBottom: 22, fontSize: 12.5, color: 'var(--text-2)' }}>
          <activeRole.icon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} color={activeRole.color} />
          {activeRole.desc}
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Common: Name + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>
                {role === 'company' ? 'Contact Person *' : role === 'college' ? 'Principal / HoD *' : 'Full Name *'}
              </label>
              <input id="reg-name" {...inp} value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Email Address *</label>
              <input id="reg-email" {...inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
          </div>

          {/* ── STUDENT FIELDS ── */}
          {role === 'student' && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Phone Number</label>
                <input id="reg-phone" {...inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>College / University</label>
                <input id="reg-college" {...inp} value={college} onChange={e => setCollege(e.target.value)} placeholder="e.g. Bannari Amman Institute of Technology" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Year of Study</label>
                  <select id="reg-year" className="inp" value={year} onChange={e => setYear(e.target.value)} style={{ fontSize: 13.5 }}>
                    <option value="">Select Year</option>
                    {['1st Year','2nd Year','3rd Year','4th Year','PG 1st Year','PG 2nd Year'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Branch / Degree</label>
                  <input id="reg-branch" {...inp} value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. B.Tech IT" />
                </div>
              </div>
            </>
          )}

          {/* ── COMPANY FIELDS ── */}
          {role === 'company' && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Company Name *</label>
                <input id="reg-company" {...inp} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Zoho Corporation" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Industry</label>
                  <select id="reg-industry" className="inp" value={industry} onChange={e => setIndustry(e.target.value)} style={{ fontSize: 13.5 }}>
                    <option value="">Select Industry</option>
                    {['IT Services','SaaS','EdTech','FinTech','HealthTech','E-Commerce','Manufacturing','Automotive','Banking','Consulting'].map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Company Size</label>
                  <select id="reg-size" className="inp" value={companySize} onChange={e => setCompanySize(e.target.value)} style={{ fontSize: 13.5 }}>
                    <option value="">Select Size</option>
                    {['1-10','11-50','51-200','201-500','501-1000','1000+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Website</label>
                  <input id="reg-website" {...inp} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourcompany.com" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Location / HQ</label>
                  <input id="reg-location" {...inp} value={location} onChange={e => setLocation(e.target.value)} placeholder="Chennai, Tamil Nadu" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>HR Contact Name</label>
                  <input id="reg-hrname" {...inp} value={hrName} onChange={e => setHrName(e.target.value)} placeholder="HR Manager name" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>HR Phone</label>
                  <input id="reg-hrphone" {...inp} type="tel" value={hrPhone} onChange={e => setHrPhone(e.target.value)} placeholder="HR mobile number" />
                </div>
              </div>
            </>
          )}

          {/* ── COLLEGE FIELDS ── */}
          {role === 'college' && (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>College Name *</label>
                <input id="reg-collegename" {...inp} value={collegeName} onChange={e => setCollegeName(e.target.value)} placeholder="e.g. Anna University" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Affiliation</label>
                  <select id="reg-affiliation" className="inp" value={affiliation} onChange={e => setAffiliation(e.target.value)} style={{ fontSize: 13.5 }}>
                    <option value="">Select Affiliation</option>
                    {['Anna University','Madurai Kamaraj University','Bharathidasan University','Bharathiar University','TNAU','Deemed University','Autonomous','Central University','Other'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>District</label>
                  <input id="reg-district" {...inp} value={district} onChange={e => setDistrict(e.target.value)} placeholder="e.g. Coimbatore" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>NAAC Grade</label>
                  <select id="reg-naac" className="inp" value={naac} onChange={e => setNaac(e.target.value)} style={{ fontSize: 13.5 }}>
                    <option value="">Select Grade</option>
                    {['A++','A+','A','B++','B+','B','C','Not Accredited'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>TPO Name</label>
                  <input id="reg-tponame" {...inp} value={tpoName} onChange={e => setTpoName(e.target.value)} placeholder="Training & Placement Officer" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>TPO Phone</label>
                <input id="reg-tpophone" {...inp} type="tel" value={tpoPhone} onChange={e => setTpoPhone(e.target.value)} placeholder="TPO contact number" />
              </div>
            </>
          )}

          {/* ── ADMIN FIELDS ── */}
          {role === 'admin' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', display: 'block', marginBottom: 5 }}>🔑 Admin Access Key *</label>
              <input id="reg-adminkey" className="inp" type="password" value={adminKey} onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter secret admin key" style={{ fontSize: 13.5, borderColor: 'rgba(245,158,11,0.3)' }} required />
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>Contact the platform administrator for the access key.</p>
            </div>
          )}

          {/* Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" className="inp" type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={{ fontSize: 13.5, paddingRight: 42 }} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 5 }}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-confirm" className="inp" type={showC ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={{ fontSize: 13.5, paddingRight: 42 }} required />
                <button type="button" onClick={() => setShowC(v => !v)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 0 }}>
                  {showC ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 15, borderRadius: 14, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', background: `linear-gradient(135deg, ${activeRole.color}, ${activeRole.color}cc)`, marginTop: 4 }}>
            {loading
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="spinner" /> Creating Account…</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Create {activeRole.label} Account <ArrowRight size={16} />
                </span>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-3)', marginTop: 18 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: activeRole.color, fontWeight: 600, textDecoration: 'none' }}>Sign In →</Link>
        </p>
      </motion.div>
    </div>
  );
}
