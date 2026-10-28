import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, ExternalLink, Sparkles, Shield, Users, Upload,
  Settings, FileText, CheckCircle, PlusCircle
} from 'lucide-react';
import EventCertificateManager from './EventCertificateManager';
import CertificateTemplateUploader from './CertificateTemplateUploader';
import { getAllCertificateTemplates, type CertificateTemplate } from '../certificateData';
import CertificateRenderer, { printCertificateWindow } from './CertificateRenderer';

export interface CertificateIssuerProps {
  issuerName: string;
  issuerType: 'company' | 'college' | 'mentor';
}

export default function CertificateIssuer({ issuerName, issuerType }: CertificateIssuerProps) {
  const navigate = useNavigate();
  const accent = issuerType === 'company' ? '#3b82f6' : '#10b981';
  const [activeTab, setActiveTab] = useState<'events' | 'upload' | 'quick-issue'>('events');

  // Quick Issue States
  const templates = getAllCertificateTemplates();
  const [selectedTpl, setSelectedTpl] = useState<CertificateTemplate>(templates[0]);
  const [studentName, setStudentName] = useState('Samira Hadid');
  const [titleName, setTitleName] = useState('Full Stack Web Development & AI Bootcamp');
  const [date, setDate] = useState('19 March, 2025');
  const [credId, setCredId] = useState(`NM-${new Date().getFullYear()}-GEN-${Math.random().toString(36).slice(2, 6).toUpperCase()}`);
  const [rank, setRank] = useState('');

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 14,
            background: `${accent}15`, border: `1px solid ${accent}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Award size={24} color={accent} />
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 21, color: 'var(--text)', margin: 0 }}>
              Certificate Studio & Dispatcher
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
              Manage event certificates, assign participation & winner awards, or upload custom templates for <strong style={{ color: 'var(--text-2)' }}>{issuerName}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/certificates')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', borderRadius: 10,
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            color: 'var(--text)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}
        >
          <ExternalLink size={14} /> Full Screen Studio
        </button>
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, borderBottom: '1px solid var(--border)', paddingBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'events', label: 'Event Certificates & Student Roster', icon: <Users size={15} /> },
          { id: 'upload', label: 'Upload Custom Template', icon: <Upload size={15} /> },
          { id: 'quick-issue', label: 'Direct Certificate Creator', icon: <PlusCircle size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 10, border: 'none',
              background: activeTab === tab.id ? accent : 'var(--surface)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-2)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              boxShadow: activeTab === tab.id ? `0 4px 14px ${accent}35` : 'none',
              transition: 'all 0.18s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── MODE 1: EVENT CERTIFICATES & ROSTER ── */}
      {activeTab === 'events' && (
        <EventCertificateManager
          issuerName={issuerName}
          issuerType={issuerType}
        />
      )}

      {/* ── MODE 2: UPLOAD CUSTOM TEMPLATE ── */}
      {activeTab === 'upload' && (
        <CertificateTemplateUploader
          issuerName={issuerName}
          issuerType={issuerType}
          onTemplateCreated={(newTpl) => {
            setSelectedTpl(newTpl);
            setActiveTab('quick-issue');
          }}
        />
      )}

      {/* ── MODE 3: DIRECT QUICK CERTIFICATE CREATOR ── */}
      {activeTab === 'quick-issue' && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28 }}>

            {/* Left Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                  Choose Template Design
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTpl(tpl)}
                      style={{
                        padding: '8px 12px', borderRadius: 9, textAlign: 'left',
                        background: selectedTpl.id === tpl.id ? `${accent}15` : 'var(--bg-2)',
                        border: `1.5px solid ${selectedTpl.id === tpl.id ? accent : 'var(--border)'}`,
                        color: 'var(--text)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                  Student Name
                </label>
                <input
                  className="inp"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student Full Name"
                  style={{ fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                  Event / Internship Title
                </label>
                <input
                  className="inp"
                  value={titleName}
                  onChange={(e) => setTitleName(e.target.value)}
                  placeholder="Event, Course, or Internship Title"
                  style={{ fontSize: 13 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                    Date
                  </label>
                  <input
                    className="inp"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ fontSize: 12.5 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                    Rank / Award (Optional)
                  </label>
                  <input
                    className="inp"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    placeholder="e.g. 1st Place"
                    style={{ fontSize: 12.5 }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const el = document.querySelector('.certificate-print-card');
                  if (el) printCertificateWindow(el.outerHTML, titleName);
                }}
                style={{
                  padding: '12px', borderRadius: 11,
                  background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                  border: 'none', color: '#fff', fontWeight: 800, fontSize: 13.5,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: `0 4px 16px ${accent}40`, marginTop: 6,
                }}
              >
                <Download size={15} /> Download / Print Certificate
              </button>
            </div>

            {/* Right Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CertificateRenderer
                template={selectedTpl}
                studentName={studentName}
                eventTitle={titleName}
                issueDate={date}
                credentialId={credId}
                issuerName={issuerName}
                achievementRank={rank || undefined}
                customBgImage={selectedTpl.bgImage}
              />
            </div>

          </div>
        </div>
      )}

    </motion.div>
  );
}
