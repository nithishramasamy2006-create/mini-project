import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy, Component, type ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

const HomePage           = lazy(() => import('./pages/HomePage'));
const ProjectsPage       = lazy(() => import('./pages/ProjectsPage'));
const CoursesPage        = lazy(() => import('./pages/CoursesPage'));
const InternshipsPage    = lazy(() => import('./pages/InternshipsPage'));
const MentorsPage        = lazy(() => import('./pages/MentorsPage'));
const LeaderboardPage    = lazy(() => import('./pages/LeaderboardPage'));
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/RegisterPage'));
const CertificatePage    = lazy(() => import('./pages/CertificatePage'));
const CompanyPortal      = lazy(() => import('./pages/CompanyPortal'));
const AdminPortal        = lazy(() => import('./pages/AdminPortal'));
const StudentPortal      = lazy(() => import('./pages/StudentPortal'));
const CollegePortal      = lazy(() => import('./pages/CollegePortal'));
const HowItWorksPage     = lazy(() => import('./pages/HowItWorksPage'));
const PlacementSupportPage = lazy(() => import('./pages/PlacementSupportPage'));
const AlumniNetworkPage  = lazy(() => import('./pages/AlumniNetworkPage'));
const CourseViewer       = lazy(() => import('./pages/CourseViewer'));
const JobPortalPage      = lazy(() => import('./pages/JobPortalPage'));
const EventsPage         = lazy(() => import('./pages/EventsPage'));
const ExamPortalPage     = lazy(() => import('./pages/ExamPortalPage'));

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f', flexDirection:'column', gap:20, padding:32 }}>
          <div style={{ fontSize:48 }}>{'⚠️'}</div>
          <h2 style={{ color:'#fff', fontSize:22, fontWeight:700, margin:0 }}>Something went wrong</h2>
          <p style={{ color:'#888', fontSize:14, textAlign:'center', maxWidth:400 }}>{(this.state.error as Error).message}</p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ padding:'10px 28px', borderRadius:12, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', color:'#fff', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
            Clear Cache &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
        <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#7c3aed,#4f46e5)', animation:'floatY 1.2s ease-in-out infinite', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontWeight:800, fontSize:15 }}>NM</span>
        </div>
        <div style={{ display:'flex', gap:5 }}>
          {[0, 0.15, 0.3].map((d, i) => (
            <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#7c3aed', animation:`pulse 1s ease-in-out ${d}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scroll to top ─────────────────────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ── Role → portal map ─────────────────────────────────────────────────────────
const ROLE_PORTAL: Record<string, string> = {
  admin:   '/portal/admin',
  company: '/portal/company',
  college: '/portal/college',
  student: '/portal/student',
};

// ── RoleRoute ─────────────────────────────────────────────────────────────────
// Student-only / public pages.
// If a logged-in non-student visits: redirect them to their portal.
// While auth is loading: show skeleton (prevents flash of student content).
function RoleRoute({ element }: { element: JSX.Element }) {
  const { user, loading } = useAuth();

  // Still resolving auth — show loading screen so student content never flashes
  if (loading) return <PageSkeleton />;

  // Non-student logged in → send to their portal immediately
  if (user && user.role !== 'student') {
    return <Navigate to={ROLE_PORTAL[user.role] || '/login'} replace />;
  }

  return element;
}

// ── PortalRoute ───────────────────────────────────────────────────────────────
// Portal pages — only the matching role can access.
// No auth → /login. Wrong role → their own portal.
function PortalRoute({ allowedRole, element }: { allowedRole: string; element: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <PageSkeleton />;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to={ROLE_PORTAL[user.role] || '/'} replace />;

  return element;
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div style={{ background:'var(--bg)', minHeight:'100vh', display:'flex', flexDirection:'column', transition:'background 0.3s ease, color 0.3s ease' }}>
              <ScrollToTop />
              <Navbar />
              <Suspense fallback={<PageSkeleton />}>
                <main style={{ flex:1 }}>
                  <Routes>
                    {/* ── Student-only / public pages ───────────────── */}
                    <Route path="/"                  element={<RoleRoute element={<HomePage />} />} />
                    <Route path="/projects"          element={<RoleRoute element={<ProjectsPage />} />} />
                    <Route path="/courses"           element={<RoleRoute element={<CoursesPage />} />} />
                    <Route path="/internships"       element={<RoleRoute element={<InternshipsPage />} />} />
                    <Route path="/mentors"           element={<RoleRoute element={<MentorsPage />} />} />
                    <Route path="/leaderboard"       element={<RoleRoute element={<LeaderboardPage />} />} />
                    <Route path="/certificates"      element={<RoleRoute element={<CertificatePage />} />} />
                    <Route path="/how-it-works"      element={<RoleRoute element={<HowItWorksPage />} />} />
                    <Route path="/placement-support" element={<RoleRoute element={<PlacementSupportPage />} />} />
                    <Route path="/alumni-network"    element={<RoleRoute element={<AlumniNetworkPage />} />} />
                    <Route path="/jobs"              element={<RoleRoute element={<JobPortalPage />} />} />
                    <Route path="/events"            element={<RoleRoute element={<EventsPage />} />} />
                    <Route path="/exams"             element={<RoleRoute element={<ExamPortalPage />} />} />
                    <Route path="/learn/:courseId"   element={<RoleRoute element={<CourseViewer />} />} />

                    {/* ── Auth pages — open to all ───────────────────── */}
                    <Route path="/login"    element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* ── Portal pages — role-locked ─────────────────── */}
                    <Route path="/portal/student" element={<PortalRoute allowedRole="student" element={<StudentPortal />} />} />
                    <Route path="/portal/company" element={<PortalRoute allowedRole="company" element={<CompanyPortal />} />} />
                    <Route path="/portal/college" element={<PortalRoute allowedRole="college" element={<CollegePortal />} />} />
                    <Route path="/portal/admin"   element={<PortalRoute allowedRole="admin"   element={<AdminPortal />} />} />

                    {/* ── Catch-all ──────────────────────────────────── */}
                    <Route path="*" element={<RoleRoute element={<HomePage />} />} />
                  </Routes>
                </main>
              </Suspense>
              <Footer />
              <AIChatbot />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
