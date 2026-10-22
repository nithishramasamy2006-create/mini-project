import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, AlertCircle, LogIn, User, Mail, BookOpen, Building2, Upload, FileImage, Trash2 } from 'lucide-react';
import { useAuth, type ApplyData } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  type: ApplyData['type'] | 'course';
  itemId: number;
  itemTitle: string;
  itemCompany: string;
  color?: string;
}

export default function ApplyModal({ open, onClose, type, itemId, itemTitle, itemCompany, color = '#7c3aed' }: ApplyModalProps) {
  const { user, apply } = useAuth();
  const navigate = useNavigate();

  // Form fields pre-filled from profile
  const [name,       setName]       = useState(user?.name    || '');
  const [email,      setEmail]      = useState(user?.email   || '');
  const [department, setDepartment] = useState(user?.branch  || '');
  const [college,    setCollege]    = useState(user?.college || '');

  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Resume upload (internship only)
  const [resumeFile,    setResumeFile]    = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = ev => setResumePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setResumePreview(null); // PDF — no image preview
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApply = async () => {
    if (!name.trim() || !email.trim()) {
      setResult({ type: 'error', text: 'Name and Email are required.' });
      return;
    }
    if (type === 'internship' && !resumeFile) {
      setResult({ type: 'error', text: 'Please upload your resume to apply for an internship.' });
      return;
    }
    setLoading(true);
    setResult(null);
    const applyType = (type === 'course' ? 'project' : type) as ApplyData['type'];
    const res = await apply({ type: applyType, itemId, itemTitle, itemCompany });
    setLoading(false);
    setResult({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setTimeout(() => { onClose(); setResult(null); }, 2500);
    }
  };

  const handleClose = () => {
    setResult(null);
    setName(user?.name    || '');
    setEmail(user?.email  || '');
    setDepartment(user?.branch  || '');
    setCollege(user?.college || '');
    clearResume();
    onClose();
  };

  const typeLabel = { project: 'Project', internship: 'Internship', mentor: 'Mentor Session', course: 'Course' }[type] ?? 'Application';

  const Field = ({
    id, label, icon, value, onChange, type: inputType = 'text', placeholder,
  }: {
    id: string; label: string; icon: React.ReactNode;
    value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string;
  }) => (
    <div>
      <label htmlFor={id} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6,
      }}>
        {icon} {label}
      </label>
      <input
        id={id}
        className="inp"
        type={inputType}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ fontSize: 13.5 }}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200 }} />

          {/* Flex-centered wrapper */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 201,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', pointerEvents: 'none',
          }}>
            <motion.div key="modal"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: 'all',
                width: '100%', maxWidth: 480,
                maxHeight: '90vh', overflowY: 'auto',
                background: 'var(--surface)', border: '1px solid var(--border-2)',
                borderRadius: 24, padding: 32, position: 'relative',
              }}>

              {/* Close */}
              <button onClick={handleClose} style={{
                position: 'absolute', top: 16, right: 16,
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)',
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
              }}>
                <X size={18} />
              </button>

              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: `${color}15`, color, border: `1px solid ${color}25`, marginBottom: 12,
                }}>
                  Apply for {typeLabel}
                </div>
                <h2 className="font-display" style={{ fontWeight: 700, fontSize: 19, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>
                  {itemTitle}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  by <strong style={{ color: 'var(--text)' }}>{itemCompany}</strong>
                </p>
              </div>

              {/* Not logged in */}
              {!user ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
                  <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: 'var(--text)', marginBottom: 8 }}>Login Required</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.6 }}>
                    Create a free account or sign in to apply for this {typeLabel.toLowerCase()}.
                  </p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button onClick={() => { handleClose(); navigate('/login'); }} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <LogIn size={13} /> Sign In
                    </button>
                    <button onClick={() => { handleClose(); navigate('/register'); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      Create Free Account <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

              ) : result?.type === 'success' ? (
                /* Success */
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={32} color="#10b981" />
                  </div>
                  <h3 className="font-display" style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)', marginBottom: 8 }}>Application Submitted! 🎉</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-2)' }}>{result.text}</p>
                </motion.div>

              ) : (
                /* Simple form */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 2 }} />

                  <Field id="apply-name"    label="Full Name"   icon={<User      size={12} />} value={name}       onChange={setName}       placeholder="Your full name" />
                  <Field id="apply-email"   label="Email ID"    icon={<Mail      size={12} />} value={email}      onChange={setEmail}      type="email" placeholder="you@example.com" />
                  <Field id="apply-dept"    label="Department"  icon={<BookOpen  size={12} />} value={department} onChange={setDepartment} placeholder="e.g. Computer Science" />
                  <Field id="apply-college" label="College"     icon={<Building2 size={12} />} value={college}    onChange={setCollege}    placeholder="e.g. Bannari Amman Institute of Technology" />

                  {/* ── Resume upload — internship only ── */}
                  {type === 'internship' && (
                    <div>
                      <label style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 600, color: 'var(--text-2)',
                        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
                      }}>
                        <FileImage size={12} /> Resume
                        <span style={{ color: 'var(--rose)', fontWeight: 700, marginLeft: 2 }}>*</span>
                        <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                          &nbsp;(JPG / PNG / PDF)
                        </span>
                      </label>

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        id="apply-resume"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />

                      {!resumeFile ? (
                        /* Drop zone */
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            width: '100%', padding: '20px 16px', borderRadius: 12, cursor: 'pointer',
                            border: '1.5px dashed var(--border-2)', background: 'var(--bg-2)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                            transition: 'border-color 0.2s, background 0.2s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}60`;
                            (e.currentTarget as HTMLButtonElement).style.background  = `${color}06`;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-2)';
                            (e.currentTarget as HTMLButtonElement).style.background  = 'var(--bg-2)';
                          }}
                        >
                          <div style={{
                            width: 40, height: 40, borderRadius: 10,
                            background: `${color}12`, border: `1px solid ${color}25`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Upload size={18} color={color} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Click to upload resume</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>JPG, PNG or PDF · Max 5 MB</div>
                          </div>
                        </button>
                      ) : (
                        /* Preview */
                        <div style={{
                          borderRadius: 12, border: `1.5px solid ${color}40`,
                          background: `${color}06`, overflow: 'hidden',
                          position: 'relative',
                        }}>
                          {resumePreview ? (
                            /* Image preview */
                            <img
                              src={resumePreview}
                              alt="Resume preview"
                              style={{ width: '100%', maxHeight: 200, objectFit: 'contain', display: 'block', padding: 8 }}
                            />
                          ) : (
                            /* PDF — show filename */
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                              <div style={{
                                width: 40, height: 40, borderRadius: 8,
                                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}>
                                <FileImage size={18} color="#ef4444" />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {resumeFile.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                                  {(resumeFile.size / 1024).toFixed(0)} KB · PDF
                                </div>
                              </div>
                            </div>
                          )}
                          {/* Remove + change buttons */}
                          <div style={{
                            display: 'flex', gap: 8, padding: '8px 10px',
                            borderTop: `1px solid ${color}20`, background: `${color}08`,
                          }}>
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                              style={{ flex: 1, padding: '6px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${color}30`, background: `${color}10`, color }}>
                              Change File
                            </button>
                            <button type="button" onClick={clearResume}
                              style={{ padding: '6px 10px', borderRadius: 8, fontSize: 11, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Trash2 size={11} /> Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Error */}
                  {result?.type === 'error' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <AlertCircle size={14} color="#ef4444" />
                      <span style={{ fontSize: 13, color: '#ef4444' }}>{result.text}</span>
                    </div>
                  )}

                  {/* Submit */}
                  <button onClick={handleApply} disabled={loading} className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, borderRadius: 14, opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                    {loading
                      ? <><div className="spinner" /> Submitting…</>
                      : <><span>Submit Application</span><ArrowRight size={16} /></>
                    }
                  </button>

                  <p style={{ fontSize: 11.5, color: 'var(--text-3)', textAlign: 'center', marginTop: 2 }}>
                    Your details will be shared with <strong style={{ color: 'var(--text-2)' }}>{itemCompany}</strong>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
