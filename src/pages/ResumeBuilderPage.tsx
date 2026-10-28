import StudentResumeBuilder from '../components/StudentResumeBuilder';
import { useAuth } from '../AuthContext';

export default function ResumeBuilderPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: 'var(--bg)', paddingBottom: 60 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <StudentResumeBuilder initialStudentName={user?.name || 'Nithish Ramasamy'} embeddedInPortal={false} />
      </div>
    </div>
  );
}
