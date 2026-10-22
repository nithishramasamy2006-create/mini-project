import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Sun, Moon, LogOut, BookOpen, Briefcase, LayoutDashboard } from 'lucide-react';
import { NAV_ITEMS } from '../data';
import { useTheme } from '../ThemeContext';
import { useAuth, rolePortal } from '../AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { theme, toggle }       = useTheme();
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();
  const menuRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); setUserMenu(false); navigate('/'); };

  // safe role helper
  const userRole = (user?.role) || 'student';
  const roleEmoji = userRole === 'company' ? '🏢' : userRole === 'college' ? '🏫' : userRole === 'admin' ? '🛡️' : '🎓';

  return (
    <>
      <motion.header
        initial={{ y: -60 }} animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-wrap">
          {/* Logo */}
          <Link to="/" className="nav-brand">
            <div className="nav-icon"><Zap size={17} color="#fff" strokeWidth={2.5} /></div>
            <div>
              <div className="font-display" style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text)', lineHeight: 1, letterSpacing: '-0.01em' }}>NaanMudhalvan</div>
              <div style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--violet)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Learning Marketplace</div>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="nav-links">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right */}
          <div className="nav-end">

            {/* Theme Toggle */}
            <button onClick={toggle} className="btn btn-ghost btn-icon"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ position: 'relative', overflow: 'hidden', background: theme === 'light' ? 'rgba(124,58,237,0.1)' : undefined, borderColor: theme === 'light' ? 'rgba(124,58,237,0.3)' : undefined }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.2 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {theme === 'dark' ? <Sun size={15} color="#fde68a" /> : <Moon size={15} color="#7c3aed" />}
                </motion.span>
              </AnimatePresence>
            </button>

            {/* Auth area */}
            {user ? (
              <div style={{ position: 'relative' }} ref={menuRef}>
                {/* Avatar button */}
                <button onClick={() => setUserMenu(!userMenu)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: '2px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer' }}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      style={{ position: 'absolute', top: 44, right: 0, width: 230, background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: 16, padding: 8, zIndex: 200, boxShadow: '0 16px 48px rgba(0,0,0,0.25)' }}>

                      {/* User info */}
                      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, padding: '3px 10px', borderRadius: 999, background: 'rgba(124,58,237,0.1)', color: 'var(--accent)', fontSize: 11, fontWeight: 700 }}>
                          {roleEmoji} {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </div>
                      </div>

                      {/* My Portal shortcut */}
                      <button onClick={() => { navigate(rolePortal(userRole)); setUserMenu(false); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', cursor: 'pointer', fontSize: 13, color: 'var(--accent)', textAlign: 'left', fontWeight: 700, marginBottom: 6 }}>
                        <LayoutDashboard size={14} /> My Portal →
                      </button>

                      {/* Student quick links */}
                      {userRole === 'student' && (
                        <>
                          <NavMenuItem icon={<BookOpen size={14}/>}  label="My Courses"      onClick={() => { navigate('/portal/student'); setUserMenu(false); }} />
                          <NavMenuItem icon={<Briefcase size={14}/>} label="My Applications" onClick={() => { navigate('/portal/student'); setUserMenu(false); }} />
                        </>
                      )}

                      {/* Sign out */}
                      <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 6 }}>
                        <button onClick={handleLogout}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#ef4444', textAlign: 'left', fontWeight: 500 }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}>
                          <LogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost btn-sm hide-mob">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}

            {/* Burger */}
            <button onClick={() => setOpen(!open)} className="btn btn-ghost btn-icon" id="burger" style={{ display: 'none' }}>
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="glass-heavy"
            style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99, padding: '14px 20px 18px', borderBottom: '1px solid var(--border-2)' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
              {NAV_ITEMS.map(item => (
                <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={() => setOpen(false)}
                  className={({ isActive }) => `s-item${isActive ? ' on' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <button onClick={() => { navigate(rolePortal(userRole)); setOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', cursor: 'pointer', fontSize: 13.5, color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>
                  <LayoutDashboard size={15} /> My Portal
                </button>
              )}
            </nav>
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              {user ? (
                <button onClick={() => { handleLogout(); setOpen(false); }} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LogOut size={13} /> Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login"    onClick={() => setOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Sign In</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary btn-sm"   style={{ flex: 1, justifyContent: 'center' }}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@media (max-width: 768px) { #burger { display: flex !important; } .hide-mob { display: none !important; } }`}</style>
    </>
  );
}

function NavMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-2)', textAlign: 'left', fontWeight: 500 }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--border)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}>
      {icon} {label}
    </button>
  );
}
