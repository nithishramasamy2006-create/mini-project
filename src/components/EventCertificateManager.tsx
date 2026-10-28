import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award, CheckCircle, Trophy, Users, Sparkles, Settings, Eye,
  Save, Download, Send, Filter, Search, Printer, Shield, ChevronDown
} from 'lucide-react';
import {
  type CertificateTemplate,
  type EventCertificateSettings,
  type EventParticipant,
  type IssuedCertificate,
  getAllCertificateTemplates,
  getEventCertificateSettings,
  saveEventCertificateSettings,
  getEventParticipants,
  saveEventParticipants,
  saveIssuedCertificate,
  getIssuedCertificates,
} from '../certificateData';
import { EVENTS, type Event as EventItem } from '../eventsData';
import { portalGetAll } from '../portalData';
import CertificateRenderer, { printCertificateWindow } from './CertificateRenderer';

interface EventCertificateManagerProps {
  issuerName: string;
  issuerType: 'college' | 'company' | 'mentor';
  preSelectedEventId?: number | string;
}

export default function EventCertificateManager({
  issuerName,
  issuerType,
  preSelectedEventId,
}: EventCertificateManagerProps) {
  // 1. Gather all events for this issuer
  const allEvents = useMemo(() => {
    const portalEvents = portalGetAll('event').map((e: any, i: number) => ({
      id: e.id || 80000 + i,
      title: e.title || 'Untitled Event',
      organizer: e.organizer || issuerName,
      date: e.date || 'TBD',
      type: e.type || 'workshop',
    }));
    return [...EVENTS, ...portalEvents];
  }, [issuerName]);

  const [selectedEventId, setSelectedEventId] = useState<number | string>(
    preSelectedEventId || allEvents[0]?.id || 1
  );

  const activeEvent = useMemo(() => {
    return allEvents.find((e) => String(e.id) === String(selectedEventId)) || allEvents[0];
  }, [allEvents, selectedEventId]);

  // 2. Settings for this event
  const [settings, setSettings] = useState<EventCertificateSettings>(() =>
    getEventCertificateSettings(selectedEventId)
  );

  // 3. Participants for this event
  const [participants, setParticipants] = useState<EventParticipant[]>(() =>
    getEventParticipants(selectedEventId)
  );

  // 4. Issued certificates cache
  const [issuedCerts, setIssuedCerts] = useState<IssuedCertificate[]>(() =>
    getIssuedCertificates()
  );

  // 5. Template Library
  const [templates, setTemplates] = useState<CertificateTemplate[]>(() =>
    getAllCertificateTemplates()
  );

  // 6. UI States
  const [activeTab, setActiveTab] = useState<'roster' | 'settings' | 'preview'>('roster');
  const [previewType, setPreviewType] = useState<'participation' | 'achievement' | 'appreciation'>('participation');
  const [searchQ, setSearchQ] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [issueNotice, setIssueNotice] = useState('');
  const [selectedPreviewCert, setSelectedPreviewCert] = useState<IssuedCertificate | null>(null);

  // Refresh data when selectedEventId changes
  useEffect(() => {
    const s = getEventCertificateSettings(selectedEventId);
    setSettings(s);
    setParticipants(getEventParticipants(selectedEventId));
  }, [selectedEventId]);

  // Refresh templates & issued certs on custom events
  useEffect(() => {
    const onStorage = () => {
      setTemplates(getAllCertificateTemplates());
      setIssuedCerts(getIssuedCertificates());
    };
    window.addEventListener('nm_cert_storage_updated', onStorage);
    return () => window.removeEventListener('nm_cert_storage_updated', onStorage);
  }, []);

  // Save Settings
  const handleSaveSettings = () => {
    const updated: EventCertificateSettings = {
      ...settings,
      eventId: selectedEventId,
      eventTitle: activeEvent.title,
      organizer: issuerName,
      organizerType: issuerType,
      updatedAt: new Date().toISOString(),
      updatedBy: issuerName,
    };
    saveEventCertificateSettings(updated);
    setSettings(updated);
    setSaveMsg('✅ Certificate settings updated successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQ.toLowerCase()) ||
        p.college.toLowerCase().includes(searchQ.toLowerCase())
    );
  }, [participants, searchQ]);

  // Toggle participant winner / attendance / appreciation
  const updateParticipant = (id: string, updates: Partial<EventParticipant>) => {
    const updated = participants.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setParticipants(updated);
    saveEventParticipants(selectedEventId, updated);
  };

  // Issue Certificate to Single Student
  const issueSingleCertificate = (
    p: EventParticipant,
    type: 'participation' | 'achievement' | 'appreciation'
  ) => {
    const tplId =
      type === 'achievement'
        ? settings.achievementTemplateId
        : type === 'appreciation'
        ? settings.appreciationTemplateId
        : settings.participationTemplateId;

    const tpl = templates.find((t) => t.id === tplId) || templates[0];
    const credId = `NM-${new Date().getFullYear()}-EVT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const newCert: IssuedCertificate = {
      id: `cert-${Date.now()}-${p.id}`,
      templateId: tpl.id,
      studentName: p.name,
      studentEmail: p.email,
      collegeName: p.college,
      eventTitle: activeEvent.title,
      eventId: activeEvent.id,
      category: 'event',
      subType: type,
      achievementRank: type === 'achievement' ? (p.winnerRank || 'Winner') : undefined,
      issuer: issuerName,
      issuerType,
      issueDate: activeEvent.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      credentialId: credId,
      signers: [
        { name: settings.headOfEventName || (issuerType === 'college' ? 'Dean of Academic Affairs' : `${issuerName} Director`), title: settings.headOfEventTitle || (issuerType === 'college' ? 'HEAD OF EVENT / DEAN' : 'HEAD OF TALENT & EVENTS'), signatureText: settings.headOfEventName || issuerName },
        { name: settings.mentorOrManagerName || (activeEvent as any).mentorName || `${issuerName} Mentor`, title: settings.mentorOrManagerTitle || (issuerType === 'college' ? 'FACULTY EVALUATOR & MENTOR' : 'SENIOR INDUSTRY MENTOR'), signatureText: settings.mentorOrManagerName || (activeEvent as any).mentorName || 'Lead Mentor' },
      ],
      theme: tpl.theme,
      customBgImage: tpl.bgImage,
    };

    saveIssuedCertificate(newCert);
    setIssuedCerts(getIssuedCertificates());
    setIssueNotice(`🎉 Issued ${type} certificate to ${p.name}! Credential ID: ${credId}`);
    setTimeout(() => setIssueNotice(''), 4500);
  };

  // Issue Participation Certificates to ALL attended students
  const issueAllParticipation = () => {
    let count = 0;
    const tpl = templates.find((t) => t.id === settings.participationTemplateId) || templates[1];

    participants.forEach((p) => {
      if (p.attendanceVerified) {
        const credId = `NM-${new Date().getFullYear()}-PRT-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const newCert: IssuedCertificate = {
          id: `cert-${Date.now()}-${p.id}`,
          templateId: tpl.id,
          studentName: p.name,
          studentEmail: p.email,
          collegeName: p.college,
          eventTitle: activeEvent.title,
          eventId: activeEvent.id,
          category: 'event',
          subType: 'participation',
          issuer: issuerName,
          issuerType,
          issueDate: activeEvent.date || 'March 2025',
          credentialId: credId,
          signers: [
            { name: settings.headOfEventName || (issuerType === 'college' ? 'Dean of Academic Affairs' : `${issuerName} Director`), title: settings.headOfEventTitle || (issuerType === 'college' ? 'HEAD OF EVENT / DEAN' : 'HEAD OF TALENT & EVENTS'), signatureText: settings.headOfEventName || issuerName },
            { name: settings.mentorOrManagerName || (activeEvent as any).mentorName || `${issuerName} Mentor`, title: settings.mentorOrManagerTitle || (issuerType === 'college' ? 'FACULTY EVALUATOR & MENTOR' : 'SENIOR INDUSTRY MENTOR'), signatureText: settings.mentorOrManagerName || (activeEvent as any).mentorName || 'Lead Mentor' },
          ],
          theme: tpl.theme,
          customBgImage: tpl.bgImage,
        };
        saveIssuedCertificate(newCert);
        count++;
      }
    });

    setIssuedCerts(getIssuedCertificates());
    setIssueNotice(`✅ Successfully issued ${count} Participation Certificates! Students can now download them from their Student Portal.`);
    setTimeout(() => setIssueNotice(''), 5000);
  };

  // Get active preview template
  const activePreviewTemplate = useMemo(() => {
    let tplId = settings.participationTemplateId;
    if (previewType === 'achievement') tplId = settings.achievementTemplateId;
    if (previewType === 'appreciation') tplId = settings.appreciationTemplateId;
    return templates.find((t) => t.id === tplId) || templates[0];
  }, [templates, settings, previewType]);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>

      {/* ── Top Bar: Event Selector & Nav Tabs ── */}
      <div style={{
        padding: '20px 24px', borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.06), transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        {/* Event selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Event Certificate Studio
              </span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700 }}>
                ✓ Mentor & Organizer Access
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <select
                className="inp"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', padding: '6px 12px', minWidth: 260 }}
              >
                {allEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.date})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-2)', padding: 4, borderRadius: 12, border: '1px solid var(--border)' }}>
          {[
            { id: 'roster', label: `Student Roster (${participants.length})`, icon: <Users size={14} /> },
            { id: 'settings', label: 'Certificate Settings', icon: <Settings size={14} /> },
            { id: 'preview', label: 'Certificate Preview', icon: <Eye size={14} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 9, border: 'none',
                background: activeTab === t.id ? '#7c3aed' : 'transparent',
                color: activeTab === t.id ? '#fff' : 'var(--text-3)',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.18s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {saveMsg && (
        <div style={{ padding: '10px 24px', background: 'rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontSize: 13, fontWeight: 700 }}>
          {saveMsg}
        </div>
      )}
      {issueNotice && (
        <div style={{ padding: '10px 24px', background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: 13, fontWeight: 700 }}>
          {issueNotice}
        </div>
      )}

      {/* ── TAB 1: STUDENT ROSTER & CERTIFICATE ISSUANCE ── */}
      {activeTab === 'roster' && (
        <div style={{ padding: 24 }}>
          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: 'var(--text-3)' }} />
                <input
                  className="inp"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search students by name, email, college..."
                  style={{ paddingLeft: 34, fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={issueAllParticipation}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
                  border: 'none', color: '#fff', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', boxShadow: '0 4px 14px rgba(2,132,199,0.3)',
                }}
              >
                <Award size={15} /> Issue All Participation Certificates
              </button>
            </div>
          </div>

          {/* Participants Table */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '12px 16px' }}>Student Participant</th>
                  <th style={{ padding: '12px 16px' }}>College / Branch</th>
                  <th style={{ padding: '12px 16px' }}>Attendance</th>
                  <th style={{ padding: '12px 16px' }}>Winner Status</th>
                  <th style={{ padding: '12px 16px' }}>Issued Certificates</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => {
                  const studentCerts = issuedCerts.filter(
                    (c) =>
                      c.studentEmail.toLowerCase() === p.email.toLowerCase() &&
                      String(c.eventId) === String(activeEvent.id)
                  );

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                      {/* Student info */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{p.email}</div>
                      </td>

                      {/* College */}
                      <td style={{ padding: '14px 16px', color: 'var(--text-2)' }}>
                        <div>{p.college}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.branch}</div>
                      </td>

                      {/* Attendance toggle */}
                      <td style={{ padding: '14px 16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: p.attendanceVerified ? '#10b981' : 'var(--text-3)' }}>
                          <input
                            type="checkbox"
                            checked={p.attendanceVerified}
                            onChange={(e) => updateParticipant(p.id, { attendanceVerified: e.target.checked })}
                          />
                          {p.attendanceVerified ? 'Attended' : 'Absent'}
                        </label>
                      </td>

                      {/* Winner rank selection */}
                      <td style={{ padding: '14px 16px' }}>
                        <select
                          className="inp"
                          value={p.isWinner ? p.winnerRank || 'Winner' : 'none'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'none') {
                              updateParticipant(p.id, { isWinner: false, winnerRank: undefined });
                            } else {
                              updateParticipant(p.id, { isWinner: true, winnerRank: val });
                            }
                          }}
                          style={{
                            fontSize: 12, padding: '4px 8px',
                            background: p.isWinner ? 'rgba(245,158,11,0.1)' : 'var(--bg)',
                            borderColor: p.isWinner ? '#f59e0b' : 'var(--border)',
                            color: p.isWinner ? '#f59e0b' : 'var(--text)',
                            fontWeight: 700,
                          }}
                        >
                          <option value="none">Standard Participant</option>
                          <option value="1st Place Winner">🥇 1st Place Winner</option>
                          <option value="2nd Place Runner-Up">🥈 2nd Place Runner-Up</option>
                          <option value="3rd Place Winner">🥉 3rd Place Winner</option>
                          <option value="Best Innovation Award">💡 Best Innovation Award</option>
                          <option value="Top Finalist">⭐ Top Finalist</option>
                        </select>
                      </td>

                      {/* Issued certificates badges */}
                      <td style={{ padding: '14px 16px' }}>
                        {studentCerts.length > 0 ? (
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {studentCerts.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => setSelectedPreviewCert(c)}
                                style={{
                                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                                  background: c.subType === 'achievement' ? 'rgba(245,158,11,0.15)' : 'rgba(2,132,199,0.15)',
                                  color: c.subType === 'achievement' ? '#f59e0b' : '#0284c7',
                                  border: 'none', cursor: 'pointer',
                                }}
                              >
                                {c.subType === 'achievement' ? '🏆 Achievement' : '📜 Participation'}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>None issued yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => issueSingleCertificate(p, 'participation')}
                            title="Issue Participation Certificate"
                            style={{
                              padding: '6px 10px', borderRadius: 8, background: 'rgba(2,132,199,0.1)',
                              border: '1px solid rgba(2,132,199,0.25)', color: '#0284c7',
                              fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                            }}
                          >
                            + Participation
                          </button>
                          {p.isWinner && (
                            <button
                              onClick={() => issueSingleCertificate(p, 'achievement')}
                              title="Issue Winner Achievement Certificate"
                              style={{
                                padding: '6px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.12)',
                                border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b',
                                fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                              }}
                            >
                              + Winner Cert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: CERTIFICATE SETTINGS FOR THIS EVENT ── */}
      {activeTab === 'settings' && (
        <div style={{ padding: 28 }}>
          <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Enabled Certificate Types */}
            <div style={{ padding: 20, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
                What certificates can students earn in this event?
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 16 }}>
                Select which certificate tiers are unlocked for this event and choose the visual template for each.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                {/* Participation */}
                <div style={{ padding: 14, borderRadius: 12, background: 'var(--surface)', border: `1.5px solid ${settings.enabledCertificates.participation ? '#0284c7' : 'var(--border)'}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, color: 'var(--text)', cursor: 'pointer', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={settings.enabledCertificates.participation}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          enabledCertificates: { ...s.enabledCertificates, participation: e.target.checked },
                        }))
                      }
                    />
                    📜 Participation Certificate
                  </label>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                    Template Choice
                  </label>
                  <select
                    className="inp"
                    value={settings.participationTemplateId}
                    onChange={(e) => setSettings((s) => ({ ...s, participationTemplateId: e.target.value }))}
                    style={{ fontSize: 12 }}
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Achievement */}
                <div style={{ padding: 14, borderRadius: 12, background: 'var(--surface)', border: `1.5px solid ${settings.enabledCertificates.achievement ? '#f59e0b' : 'var(--border)'}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, color: 'var(--text)', cursor: 'pointer', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={settings.enabledCertificates.achievement}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          enabledCertificates: { ...s.enabledCertificates, achievement: e.target.checked },
                        }))
                      }
                    />
                    🏆 Achievement / Winner Certificate
                  </label>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                    Template Choice
                  </label>
                  <select
                    className="inp"
                    value={settings.achievementTemplateId}
                    onChange={(e) => setSettings((s) => ({ ...s, achievementTemplateId: e.target.value }))}
                    style={{ fontSize: 12 }}
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appreciation */}
                <div style={{ padding: 14, borderRadius: 12, background: 'var(--surface)', border: `1.5px solid ${settings.enabledCertificates.appreciation ? '#7c3aed' : 'var(--border)'}` }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, color: 'var(--text)', cursor: 'pointer', marginBottom: 10 }}>
                    <input
                      type="checkbox"
                      checked={settings.enabledCertificates.appreciation}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          enabledCertificates: { ...s.enabledCertificates, appreciation: e.target.checked },
                        }))
                      }
                    />
                    🎖️ Appreciation Certificate
                  </label>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 4 }}>
                    Template Choice
                  </label>
                  <select
                    className="inp"
                    value={settings.appreciationTemplateId}
                    onChange={(e) => setSettings((s) => ({ ...s, appreciationTemplateId: e.target.value }))}
                    style={{ fontSize: 12 }}
                  >
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Authorized Signers */}
            <div style={{ padding: 20, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
                Official Signers & Authority Endorsements
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginBottom: 16 }}>
                These signatures and titles appear at the bottom of all certificates issued for this event.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                    Head of Event Name
                  </label>
                  <input
                    className="inp"
                    value={settings.headOfEventName}
                    onChange={(e) => setSettings((s) => ({ ...s, headOfEventName: e.target.value }))}
                    placeholder="e.g. Donna Stroupe"
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                    Head of Event Title
                  </label>
                  <input
                    className="inp"
                    value={settings.headOfEventTitle}
                    onChange={(e) => setSettings((s) => ({ ...s, headOfEventTitle: e.target.value }))}
                    placeholder="HEAD OF EVENT"
                    style={{ fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                    Mentor / Manager Name
                  </label>
                  <input
                    className="inp"
                    value={settings.mentorOrManagerName}
                    onChange={(e) => setSettings((s) => ({ ...s, mentorOrManagerName: e.target.value }))}
                    placeholder="e.g. Sacha Dubois"
                    style={{ fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                    Mentor / Manager Title
                  </label>
                  <input
                    className="inp"
                    value={settings.mentorOrManagerTitle}
                    onChange={(e) => setSettings((s) => ({ ...s, mentorOrManagerTitle: e.target.value }))}
                    placeholder="GENERAL MANAGER"
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveSettings}
              style={{
                padding: '12px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', color: '#fff', fontWeight: 800, fontSize: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 18px rgba(16,185,129,0.3)',
              }}
            >
              <Save size={16} /> Save Event Certificate Settings
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: LIVE PREVIEW OF EVENT CERTIFICATES ── */}
      {activeTab === 'preview' && (
        <div style={{ padding: 28, textAlign: 'center' }}>
          {/* Certificate Type Switcher */}
          <div style={{ display: 'inline-flex', gap: 8, background: 'var(--bg-2)', padding: 4, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 24 }}>
            {[
              { id: 'participation', label: 'Participation Preview', icon: '📜' },
              { id: 'achievement', label: 'Achievement (Winner) Preview', icon: '🏆' },
              { id: 'appreciation', label: 'Appreciation Preview', icon: '🎖️' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPreviewType(t.id as any)}
                style={{
                  padding: '8px 18px', borderRadius: 9, border: 'none',
                  background: previewType === t.id ? '#7c3aed' : 'transparent',
                  color: previewType === t.id ? '#fff' : 'var(--text-3)',
                  fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: 840, margin: '0 auto', marginBottom: 20 }}>
            <CertificateRenderer
              template={activePreviewTemplate}
              studentName="Rosa Maria Aguado"
              eventTitle={activeEvent.title}
              issueDate={activeEvent.date || '19 March, 2025'}
              credentialId="NM-2025-EVT-PREVIEW"
              issuerName={issuerName}
              achievementRank={previewType === 'achievement' ? '1st Place Winner' : undefined}
              signers={[
                { name: settings.headOfEventName || 'Donna Stroupe', title: settings.headOfEventTitle || 'HEAD OF EVENT', signatureText: settings.headOfEventName },
                { name: settings.mentorOrManagerName || 'Sacha Dubois', title: settings.mentorOrManagerTitle || 'GENERAL MANAGER', signatureText: settings.mentorOrManagerName },
              ]}
              customBgImage={activePreviewTemplate.bgImage}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={() => {
                const el = document.querySelector('.certificate-print-card');
                if (el) printCertificateWindow(el.outerHTML, activeEvent.title);
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 11, background: '#7c3aed',
                border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              <Printer size={15} /> Test Print Preview
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: PREVIEW ISSUED CERTIFICATE ── */}
      {selectedPreviewCert && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20, backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPreviewCert(null);
          }}
        >
          <div style={{ width: '100%', maxWidth: 880, background: 'var(--surface)', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Issued Certificate: {selectedPreviewCert.studentName}
                </h3>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  Credential ID: {selectedPreviewCert.credentialId}
                </span>
              </div>
              <button
                onClick={() => setSelectedPreviewCert(null)}
                style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto 18px' }}>
              <CertificateRenderer
                template={templates.find((t) => t.id === selectedPreviewCert.templateId) || templates[0]}
                studentName={selectedPreviewCert.studentName}
                eventTitle={selectedPreviewCert.eventTitle}
                issueDate={selectedPreviewCert.issueDate}
                credentialId={selectedPreviewCert.credentialId}
                issuerName={selectedPreviewCert.issuer}
                achievementRank={selectedPreviewCert.achievementRank}
                signers={selectedPreviewCert.signers}
                customBgImage={selectedPreviewCert.customBgImage}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button
                onClick={() => {
                  const el = document.querySelector('.certificate-print-card');
                  if (el) printCertificateWindow(el.outerHTML, selectedPreviewCert.eventTitle);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px',
                  borderRadius: 10, background: '#10b981', border: 'none', color: '#fff',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                }}
              >
                <Download size={14} /> Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
