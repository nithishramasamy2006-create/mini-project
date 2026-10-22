import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Suspense, Component, type ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import CoursesPage from './pages/CoursesPage';
import InternshipsPage from './pages/InternshipsPage';
import MentorsPage from './pages/MentorsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CertificatePage from './pages/CertificatePage';
import CompanyPortal from './pages/CompanyPortal';
import AdminPortal from './pages/AdminPortal';
import StudentPortal from './pages/StudentPortal';
import CollegePortal from './pages/CollegePortal';
import HowItWorksPage from './pages/HowItWorksPage';
import PlacementSupportPage from './pages/PlacementSupportPage';
import AlumniNetworkPage from './pages/AlumniNetworkPage';
import AIChatbot from './components/AIChatbot';
import CourseViewer from './pages/CourseViewer';
import JobPortalPage from './pages/JobPortalPage';

// ── Error Boundary — prevents full black screen on runtime errors ──
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', flexDirection: 'column', gap: 20, padding: 32 }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }}>Something went wrong</h2>
          <p style={{ color: '#888', fontSize: 14, textAlign: 'center', maxWidth: 400 }}>
            {(this.state.error as Error).message}
          </p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ padding: '10px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            Clear Cache & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoadingSpinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', animation: 'floatY 1.5s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>NM</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Loading…</p>
      </div>
    </div>
  );
}

// ── Scroll to top on every navigation ──
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background 0.3s ease, color 0.3s ease' }}>
              <ScrollToTop />
              <Navbar />
              <Suspense fallback={<LoadingSpinner />}>
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/"            element={<HomePage />} />
                    <Route path="/projects"    element={<ProjectsPage />} />
                    <Route path="/courses"     element={<CoursesPage />} />
                    <Route path="/internships" element={<InternshipsPage />} />
                    <Route path="/mentors"     element={<MentorsPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/login"        element={<LoginPage />} />
                    <Route path="/register"     element={<RegisterPage />} />
                    <Route path="/certificates" element={<CertificatePage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/placement-support" element={<PlacementSupportPage />} />
                    <Route path="/alumni-network" element={<AlumniNetworkPage />} />
                    {/* Role portals */}
                    <Route path="/portal/student"  element={<StudentPortal />} />
                    <Route path="/portal/company"  element={<CompanyPortal />} />
                    <Route path="/portal/college"  element={<CollegePortal />} />
                    <Route path="/portal/admin"    element={<AdminPortal />} />
                    {/* Job portal */}
                    <Route path="/jobs" element={<JobPortalPage />} />
                    {/* Course viewer */}
                    <Route path="/learn/:courseId" element={<CourseViewer />} />
                    {/* Fallback */}
                    <Route path="*" element={<HomePage />} />
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
