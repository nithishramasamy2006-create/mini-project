import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Award, Star, CheckCircle, Share2, Printer, ChevronLeft, ChevronRight,
  Sparkles, Lock, Eye, Upload, Settings, Users, Trophy, Search, FileText, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  type CertificateTemplate,
  type IssuedCertificate,
  getAllCertificateTemplates,
  getIssuedCertificates,
  getCertificatesForStudent,
} from '../certificateData';
import CertificateRenderer, { CertificateThumbnail, printCertificateWindow } from '../components/CertificateRenderer';
import EventCertificateManager from '../components/EventCertificateManager';
import CertificateTemplateUploader from '../components/CertificateTemplateUploader';

// ── STUDENT VIEW COMPONENT ────────────────────────────────────
function StudentCertificateHub({ user }: { user: { name: string; email: string; role: string } }) {
  const navigate = useNavigate();
  const studentDisplayName = user.name || 'nithish';
  const [certs, setCerts] = useState<IssuedCertificate[]>(() =>
    getCertificatesForStudent(user.email || studentDisplayName, studentDisplayName)
  );
  const [selectedCert, setSelectedCert] = useState<IssuedCertificate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const templates = useMemo(() => getAllCertificateTemplates(), []);

  useEffect(() => {
    const onStorage = () => setCerts(getCertificatesForStudent(user.email || studentDisplayName, studentDisplayName));
    window.addEventListener('nm_cert_storage_updated', onStorage);
    return () => window.removeEventListener('nm_cert_storage_updated', onStorage);
  }, [user, studentDisplayName]);

  const handlePrint = (cert: IssuedCertificate) => {
    setSelectedCert(cert);
    setTimeout(() => {
      const el = document.querySelector('.certificate-print-card');
      if (el) printCertificateWindow(el.outerHTML, cert.eventTitle);
    }, 200);
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const typeColorMap: Record<string, string> = {
    participation: '#0284c7',
    achievement: '#f59e0b',
    appreciation: '#7c3aed',
    completion: '#10b981',
    offer: '#3b82f6',
    merit: '#6366f1',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 70 }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #090e1f 0%, #17183d 50%, #1e133d 100%)',
        padding: '44px 24px 36px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 15% 40%, rgba(124,58,237,0.2) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: 24, color: '#fff', margin: 0 }}>
                  My Certificates & Credentials
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                  Official Event Participation, Achievement, Internship, and Exam certificates
                </p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{
              padding: '8px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center',
              gap: 7, fontSize: 12.5, color: 'rgba(255,255,255,0.85)',
            }}>
              <CheckCircle size={14} color="#10b981" /> Verified Credentials · Shareable ID
            </div>
            <button
              onClick={() => navigate('/portal/student')}
              style={{
                padding: '8px 18px', borderRadius: 10, background: 'rgba(124,58,237,0.25)',
                border: '1px solid rgba(124,58,237,0.45)', color: '#c4b5fd', fontSize: 12.5,
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              ← Student Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* Certificate Cards */}
        {certs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {certs.map((cert) => {
              const tpl = templates.find((t) => t.id === cert.templateId) || templates[0];
              const tagColor = typeColorMap[cert.subType] || '#7c3aed';

              return (
                <div
                  key={cert.id}
                  style={{
                    borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)',
                    overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  {/* High Quality Scaled Mini Certificate Preview */}
                  <div
                    onClick={() => setSelectedCert(cert)}
                    style={{
                      padding: '12px', background: '#0a0d14', cursor: 'pointer',
                      display: 'flex', justifyContent: 'center', position: 'relative',
                    }}
                  >
                    <CertificateThumbnail
                      template={tpl}
                      studentName={cert.studentName || studentDisplayName}
                      eventTitle={cert.eventTitle}
                      issueDate={cert.issueDate}
                      credentialId={cert.credentialId}
                      issuerName={cert.issuer}
                      achievementRank={cert.achievementRank}
                      signers={cert.signers}
                      customBgImage={cert.customBgImage}
                    />
                    <div style={{
                      position: 'absolute', bottom: 18, right: 18,
                      padding: '4px 10px', borderRadius: 99, background: 'rgba(0,0,0,0.75)',
                      color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    }}>
                      <Eye size={12} /> Click to Expand
                    </div>
                  </div>

                  {/* Details Card */}
                  <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                          fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                          background: `${tagColor}15`, color: tagColor, textTransform: 'uppercase',
                        }}>
                          {cert.subType}
                        </span>
                        {cert.achievementRank && (
                          <span style={{
                            fontSize: 10.5, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                            background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                          }}>
                            🏆 {cert.achievementRank}
                          </span>
                        )}
                        <span style={{
                          fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                          background: 'rgba(16,185,129,0.1)', color: '#10b981', marginLeft: 'auto',
                        }}>
                          ✓ Official
                        </span>
                      </div>

                      <h3 style={{ fontSize: 15.5, fontWeight: 800, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.35 }}>
                        {cert.eventTitle}
                      </h3>
                      <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 6 }}>
                        Issued by <strong style={{ color: 'var(--text-2)' }}>{cert.issuer}</strong> · {cert.issueDate}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-3)', marginBottom: 16 }}>
                        Credential ID: <strong>{cert.credentialId}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handlePrint(cert)}
                        style={{
                          flex: 1, padding: '9px', borderRadius: 10,
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                          border: 'none', color: '#fff', fontWeight: 700, fontSize: 12.5,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                        }}
                      >
                        <Download size={13} /> Download PDF
                      </button>
                      <button
                        onClick={() => handleCopy(cert.credentialId)}
                        style={{
                          padding: '9px 16px', borderRadius: 10,
                          background: copiedId === cert.credentialId ? 'rgba(16,185,129,0.1)' : 'var(--bg-2)',
                          border: `1px solid ${copiedId === cert.credentialId ? '#10b981' : 'var(--border)'}`,
                          color: copiedId === cert.credentialId ? '#10b981' : 'var(--text)',
                          fontWeight: 700, fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        {copiedId === cert.credentialId ? 'Copied!' : 'Copy ID'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px', borderRadius: 20, background: 'var(--surface)', border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🏅</div>
            <h3 style={{ fontWeight: 800, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>
              No Certificates Issued Yet
            </h3>
            <p style={{ color: 'var(--text-3)', fontSize: 13.5, maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
              Register and participate in events, complete internships, or excel in exams to earn verified certificates from companies, colleges, and event mentors.
            </p>
            <Link
              to="/events"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '11px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: '#fff', fontWeight: 700, fontSize: 13.5, textDecoration: 'none',
              }}
            >
              Browse Upcoming Events & Earn Certificates →
            </Link>
          </div>
        )}

      </div>

      {/* ── MODAL FULL SCREEN PREVIEW ── */}
      {selectedCert && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24, backdropFilter: 'blur(10px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCert(null);
          }}
        >
          <div style={{ width: '100%', maxWidth: 900, background: 'var(--surface)', borderRadius: 22, padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  {selectedCert.eventTitle}
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  Credential ID: {selectedCert.credentialId} · Issued to {selectedCert.studentName}
                </span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                style={{ padding: '6px 14px', borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 700 }}
              >
                ✕ Close
              </button>
            </div>

            <div id="modal-certificate-hub-content" style={{ maxWidth: 840, margin: '0 auto 20px' }}>
              <CertificateRenderer
                template={templates.find((t) => t.id === selectedCert.templateId) || templates[0]}
                studentName={selectedCert.studentName || studentDisplayName}
                eventTitle={selectedCert.eventTitle}
                issueDate={selectedCert.issueDate}
                credentialId={selectedCert.credentialId}
                issuerName={selectedCert.issuer}
                achievementRank={selectedCert.achievementRank}
                signers={selectedCert.signers}
                customBgImage={selectedCert.customBgImage}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button
                onClick={() => {
                  const el = document.querySelector('#modal-certificate-hub-content .certificate-print-card') || document.querySelector('.certificate-print-card');
                  if (el) printCertificateWindow(el.outerHTML, selectedCert.eventTitle);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px',
                  borderRadius: 11, background: '#7c3aed', border: 'none', color: '#fff',
                  fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
                }}
              >
                <Download size={15} /> Download PDF / Print
              </button>
              <button
                onClick={() => handleCopy(selectedCert.credentialId)}
                style={{
                  padding: '10px 20px', borderRadius: 11, background: 'var(--bg-2)',
                  border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                {copiedId === selectedCert.credentialId ? '✓ Credential ID Copied' : 'Copy Credential ID'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN CERTIFICATE PAGE (FOR MENTORS, COLLEGES, COMPANIES & ADMINS) ────
export default function CertificatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If logged in as student, show student hub
  if (user?.role === 'student') {
    return <StudentCertificateHub user={user} />;
  }

  // Active Tab
  const [tab, setTab] = useState<'events' | 'studio' | 'upload' | 'repository'>('events');

  // Templates
  const [templates, setTemplates] = useState<CertificateTemplate[]>(() =>
    getAllCertificateTemplates()
  );
  const [selectedTemplate, setSelectedTemplate] = useState<CertificateTemplate>(templates[0]);

  // Personalize fields for Studio
  const [studentName, setStudentName] = useState('Rosa Maria Aguado');
  const [eventTitle, setEventTitle] = useState('Creative Design & AI Innovation Summit');
  const [issueDate, setIssueDate] = useState('19 March, 2025');
  const [credentialId, setCredentialId] = useState(`NM-${new Date().getFullYear()}-CERT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
  const [achievementRank, setAchievementRank] = useState('1st Place Winner');

  const issuerName =
    user?.role === 'company'
      ? (user as any).companyName || user.name || 'Your Company'
      : (user as any)?.collegeName || user?.name || 'Naan Mudhalvan Institution';

  const issuerType = (user?.role as any) || 'college';

  useEffect(() => {
    const onStorage = () => setTemplates(getAllCertificateTemplates());
    window.addEventListener('nm_cert_storage_updated', onStorage);
    return () => window.removeEventListener('nm_cert_storage_updated', onStorage);
  }, []);

  const handlePrint = useCallback(() => {
    const el = document.querySelector('.certificate-print-card');
    if (el) printCertificateWindow(el.outerHTML, eventTitle);
  }, [eventTitle]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 70 }}>

      {/* ── Top Hero Bar ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.06) 100%)',
        borderBottom: '1px solid var(--border)', padding: '36px 24px 28px', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5,
          fontWeight: 800, color: '#7c3aed', background: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.25)', padding: '4px 16px', borderRadius: 99,
          marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <Sparkles size={13} /> Official Certificate Studio · {issuerName}
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800,
          fontSize: 'clamp(24px, 3.8vw, 36px)', color: 'var(--text)', margin: '0 auto 8px',
        }}>
          Event Certificate Management & Dispatcher
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14.5, maxWidth: 640, margin: '0 auto 20px', lineHeight: 1.6 }}>
          Configure participation & achievement certificates for your events, assign awards to student participants, or upload custom institutional templates.
        </p>

        {/* Studio Navigation Tabs */}
        <div style={{ display: 'inline-flex', gap: 8, background: 'var(--surface)', padding: 5, borderRadius: 14, border: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { id: 'events', label: 'Event Certificates & Roster', icon: <Users size={15} /> },
            { id: 'studio', label: 'Visual Certificate Studio', icon: <Award size={15} /> },
            { id: 'upload', label: 'Upload Custom Template', icon: <Upload size={15} /> },
            { id: 'repository', label: 'Issued Archive', icon: <FileText size={15} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 10, border: 'none',
                background: tab === t.id ? '#7c3aed' : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--text-2)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.18s',
                boxShadow: tab === t.id ? '0 4px 14px rgba(124,58,237,0.3)' : 'none',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* ── TAB 1: EVENT CERTIFICATES & STUDENT DISPATCHER ── */}
        {tab === 'events' && (
          <EventCertificateManager
            issuerName={issuerName}
            issuerType={issuerType}
          />
        )}

        {/* ── TAB 2: VISUAL CERTIFICATE STUDIO & CUSTOMIZER ── */}
        {tab === 'studio' && (
          <div style={{ display: 'grid', gridTemplateColumns: '330px 1fr', gap: 32, alignItems: 'start' }}>

            {/* Left Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Template selector */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Available Design Templates
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl)}
                      style={{
                        padding: '10px 14px', borderRadius: 12, textAlign: 'left',
                        background: selectedTemplate.id === tpl.id ? 'rgba(124,58,237,0.1)' : 'var(--surface)',
                        border: `1.5px solid ${selectedTemplate.id === tpl.id ? '#7c3aed' : 'var(--border)'}`,
                        color: 'var(--text)', cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{tpl.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                        {tpl.subType.toUpperCase()} · {tpl.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalization Fields */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                  ✏️ Live Certificate Content
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                      Recipient Full Name
                    </label>
                    <input
                      className="inp"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Student Name"
                      style={{ fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                      Event or Program Title
                    </label>
                    <input
                      className="inp"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Event Title"
                      style={{ fontSize: 13 }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                        Issue Date
                      </label>
                      <input
                        className="inp"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        style={{ fontSize: 12.5 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                        Award Rank (Optional)
                      </label>
                      <input
                        className="inp"
                        value={achievementRank}
                        onChange={(e) => setAchievementRank(e.target.value)}
                        placeholder="e.g. 1st Place Winner"
                        style={{ fontSize: 12.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={handlePrint}
                  style={{
                    padding: '12px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                    border: 'none', color: '#fff', fontWeight: 800, fontSize: 14,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: '0 4px 18px rgba(124,58,237,0.35)',
                  }}
                >
                  <Download size={16} /> Download / Print High-Res PDF
                </button>
              </div>

            </div>

            {/* Right: Live Interactive Certificate Preview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    {selectedTemplate.name}
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    {selectedTemplate.description}
                  </span>
                </div>
                <button
                  onClick={handlePrint}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
                    borderRadius: 9, background: 'var(--bg-2)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  <Printer size={13} /> Print Preview
                </button>
              </div>

              <div style={{ width: '100%', maxWidth: 880, margin: '0 auto' }}>
                <CertificateRenderer
                  template={selectedTemplate}
                  studentName={studentName}
                  eventTitle={eventTitle}
                  issueDate={issueDate}
                  credentialId={credentialId}
                  issuerName={issuerName}
                  achievementRank={achievementRank || undefined}
                  customBgImage={selectedTemplate.bgImage}
                />
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: UPLOAD CUSTOM TEMPLATE ── */}
        {tab === 'upload' && (
          <CertificateTemplateUploader
            issuerName={issuerName}
            issuerType={issuerType}
            onTemplateCreated={(newTpl) => {
              setSelectedTemplate(newTpl);
              setTab('studio');
            }}
          />
        )}

        {/* ── TAB 4: ISSUED CERTIFICATES REPOSITORY ── */}
        {tab === 'repository' && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
              Issued Certificates Repository
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
              All event participation, achievement, and excellence certificates issued across your portal.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {getIssuedCertificates().map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '16px 18px', borderRadius: 14, background: 'var(--bg-2)',
                    border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(124,58,237,0.15)', color: '#7c3aed', textTransform: 'uppercase' }}>
                        {c.subType}
                      </span>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-3)' }}>
                        {c.credentialId}
                      </span>
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                      {c.studentName}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 4 }}>
                      {c.eventTitle}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>
                      Date: {c.issueDate} · Issuer: {c.issuer}
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        const tpl = templates.find((t) => t.id === c.templateId) || templates[0];
                        setSelectedTemplate(tpl);
                        setStudentName(c.studentName);
                        setEventTitle(c.eventTitle);
                        setIssueDate(c.issueDate);
                        setCredentialId(c.credentialId);
                        setAchievementRank(c.achievementRank || '');
                        setTab('studio');
                      }}
                      style={{
                        flex: 1, padding: '7px', borderRadius: 8, background: '#7c3aed',
                        border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      Open in Studio
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(c.credentialId);
                        alert(`Copied Credential ID: ${c.credentialId}`);
                      }}
                      style={{
                        padding: '7px 12px', borderRadius: 8, background: 'var(--surface)',
                        border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer',
                      }}
                    >
                      Copy ID
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
