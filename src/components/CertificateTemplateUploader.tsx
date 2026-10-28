import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, CheckCircle, Sparkles, X, Eye, FileText, Building2 } from 'lucide-react';
import {
  type CertificateTemplate,
  type CertificateCategory,
  type CertificateSubType,
  saveCustomCertificateTemplate,
} from '../certificateData';
import CertificateRenderer from './CertificateRenderer';

interface CertificateTemplateUploaderProps {
  issuerName: string;
  issuerType: 'college' | 'company' | 'mentor';
  onTemplateCreated?: (template: CertificateTemplate) => void;
}

export default function CertificateTemplateUploader({
  issuerName,
  issuerType,
  onTemplateCreated,
}: CertificateTemplateUploaderProps) {
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState<CertificateCategory>('event');
  const [subType, setSubType] = useState<CertificateSubType>('participation');
  const [title, setTitle] = useState('CERTIFICATE');
  const [subtitle, setSubtitle] = useState('OF PARTICIPATION');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [headOfEvent, setHeadOfEvent] = useState(issuerName || 'Head of Event');
  const [mentorName, setMentorName] = useState('Event Mentor');
  const [previewMode, setPreviewMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      alert('Please enter a name for this certificate template.');
      return;
    }
    if (!imageDataUrl) {
      alert('Please upload a template background image.');
      return;
    }

    const newTemplate: CertificateTemplate = {
      id: `custom-tpl-${Date.now()}`,
      name: templateName,
      category,
      subType,
      title: title.toUpperCase(),
      subtitle: subtitle.toUpperCase(),
      theme: 'custom-upload',
      description: `Custom template uploaded by ${issuerName} for ${category} (${subType}).`,
      primaryColor: '#1e293b',
      secondaryColor: '#d4af37',
      accentColor: '#3b82f6',
      textColor: '#0f172a',
      badgeType: 'gold-rosette-ribbon',
      badgePosition: 'top-right',
      defaultBodyText:
        subType === 'achievement'
          ? 'Awarded with high distinction for outstanding excellence, leadership, and victory in {{eventTitle}}.'
          : subType === 'appreciation'
          ? 'With sincere appreciation, we hereby present this Certificate to {{studentName}}, for demonstrating exemplary contribution and commitment to {{eventTitle}}.'
          : 'has successfully completed and actively participated in the:\n{{eventTitle}}\nHeld on {{eventDate}}\nOrganized by {{organizer}}.',
      signers: [
        { name: headOfEvent, title: 'HEAD OF EVENT', signatureText: headOfEvent },
        { name: mentorName, title: 'MENTOR & EVALUATOR', signatureText: mentorName },
      ],
      bgImage: imageDataUrl,
      isCustomUpload: true,
    };

    // Save locally
    saveCustomCertificateTemplate(newTemplate);

    // Also attempt backend upload
    try {
      await fetch('/api/certificates/templates/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      }).catch(() => null);
    } catch {
      // Offline fallback
    }

    setSavedSuccess(true);
    if (onTemplateCreated) {
      onTemplateCreated(newTemplate);
    }
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={22} color="#7c3aed" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              Upload Custom Certificate Template
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-3)', margin: 0 }}>
              Upload your institution or corporate branded certificate background to issue to students.
            </p>
          </div>
        </div>

        {imageDataUrl && (
          <button
            onClick={() => setPreviewMode(!previewMode)}
            style={{
              padding: '8px 16px', borderRadius: 10,
              background: previewMode ? '#7c3aed' : 'var(--bg-2)',
              border: '1px solid var(--border)',
              color: previewMode ? '#fff' : 'var(--text)',
              fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Eye size={14} /> {previewMode ? 'Hide Preview' : 'Live Preview'}
          </button>
        )}
      </div>

      {savedSuccess && (
        <div style={{
          padding: '12px 18px', borderRadius: 12, background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontWeight: 700,
          fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
        }}>
          <CheckCircle size={16} /> Certificate template uploaded and saved to your template library!
        </div>
      )}

      {/* Grid: Form on Left, Dropzone on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.2fr)', gap: 24, alignItems: 'start' }}>

        {/* ── Form Settings ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
              Template Name *
            </label>
            <input
              className="inp"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Annual Symposium Participation 2025"
              style={{ fontSize: 13 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                Category
              </label>
              <select
                className="inp"
                value={category}
                onChange={(e) => setCategory(e.target.value as CertificateCategory)}
                style={{ fontSize: 13 }}
              >
                <option value="event">Event Certificate</option>
                <option value="internship">Internship Certificate</option>
                <option value="job">Job Offer / Appointment</option>
                <option value="exam">Exam Merit Certificate</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                Certificate Type
              </label>
              <select
                className="inp"
                value={subType}
                onChange={(e) => {
                  const val = e.target.value as CertificateSubType;
                  setSubType(val);
                  if (val === 'achievement') setSubtitle('OF ACHIEVEMENT');
                  else if (val === 'appreciation') setSubtitle('OF APPRECIATION');
                  else if (val === 'completion') setSubtitle('OF INTERNSHIP COMPLETION');
                  else if (val === 'offer') setSubtitle('OF EMPLOYMENT SELECTION');
                  else if (val === 'merit') setSubtitle('OF EXAMINATION MERIT');
                  else setSubtitle('OF PARTICIPATION');
                }}
                style={{ fontSize: 13 }}
              >
                <option value="participation">Participation</option>
                <option value="achievement">Achievement / Winner</option>
                <option value="appreciation">Appreciation</option>
                <option value="completion">Internship Completion</option>
                <option value="offer">Job Appointment</option>
                <option value="merit">Exam Merit</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                Header Title
              </label>
              <input
                className="inp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="CERTIFICATE"
                style={{ fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                Subtitle
              </label>
              <input
                className="inp"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="OF PARTICIPATION"
                style={{ fontSize: 13 }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                Head of Event / Authority
              </label>
              <input
                className="inp"
                value={headOfEvent}
                onChange={(e) => setHeadOfEvent(e.target.value)}
                placeholder="e.g. Dr. R. Ramanathan"
                style={{ fontSize: 13 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                Mentor / Manager
              </label>
              <input
                className="inp"
                value={mentorName}
                onChange={(e) => setMentorName(e.target.value)}
                placeholder="e.g. Priya Nair (Lead Mentor)"
                style={{ fontSize: 13 }}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!imageDataUrl || !templateName.trim()}
            style={{
              padding: '12px 20px', borderRadius: 12,
              background: (!imageDataUrl || !templateName.trim()) ? 'var(--border)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: 'none', color: '#fff', fontWeight: 800, fontSize: 14,
              cursor: (!imageDataUrl || !templateName.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 18px rgba(124,58,237,0.3)', marginTop: 8,
            }}
          >
            <Sparkles size={16} /> Save & Enable Template
          </button>
        </div>

        {/* ── Dropzone & Upload Box ── */}
        <div>
          <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
            Certificate Background Image (Landscape A4 Recommended)
          </label>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              borderRadius: 16,
              border: `2px dashed ${dragActive ? '#7c3aed' : imageDataUrl ? '#10b981' : 'var(--border)'}`,
              background: dragActive ? 'rgba(124,58,237,0.06)' : imageDataUrl ? 'rgba(16,185,129,0.04)' : 'var(--bg-2)',
              padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
              position: 'relative', overflow: 'hidden', minHeight: 220,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {imageDataUrl ? (
              <div style={{ width: '100%' }}>
                <img
                  src={imageDataUrl}
                  alt="Uploaded Template"
                  style={{ maxHeight: 150, maxWidth: '90%', borderRadius: 8, objectFit: 'contain', margin: '0 auto 12px', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>✓ Background Image Loaded</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Click or drag to replace image</div>
              </div>
            ) : (
              <div>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <ImageIcon size={26} color="#7c3aed" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                  Drag & Drop Certificate Background
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 280, margin: '0 auto 12px', lineHeight: 1.5 }}>
                  Supports PNG, JPG, WebP. High resolution landscape image (1920×1080 or A4 ratio).
                </div>
                <span style={{
                  padding: '6px 14px', borderRadius: 8, background: 'var(--surface)',
                  border: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: '#7c3aed',
                }}>
                  Browse from Computer
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Live Preview Modal / Drawer ── */}
      {previewMode && imageDataUrl && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              Live Overlay Preview
            </h4>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Recipient details, signatures, and titles dynamically render over your uploaded background.
            </span>
          </div>

          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <CertificateRenderer
              template={{
                id: 'preview',
                name: templateName || 'Custom Template',
                category,
                subType,
                title: title.toUpperCase(),
                subtitle: subtitle.toUpperCase(),
                theme: 'custom-upload',
                description: 'Preview',
                primaryColor: '#1e293b',
                secondaryColor: '#d4af37',
                accentColor: '#3b82f6',
                textColor: '#0f172a',
                badgeType: 'gold-rosette-ribbon',
                badgePosition: 'top-right',
                defaultBodyText: 'has successfully completed and actively participated in the:\nAnnual Symposium & Technical Exhibition\nHeld on 19 March, 2025\nOrganized by ' + issuerName + '.',
                signers: [
                  { name: headOfEvent, title: 'HEAD OF EVENT', signatureText: headOfEvent },
                  { name: mentorName, title: 'MENTOR & EVALUATOR', signatureText: mentorName },
                ],
                bgImage: imageDataUrl,
                isCustomUpload: true,
              }}
              studentName="Rosa Maria Aguado"
              eventTitle="Annual Symposium & Technical Exhibition"
              issueDate="19 March, 2025"
              credentialId="NM-2025-CUST-001"
              issuerName={issuerName}
              customBgImage={imageDataUrl}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
