import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle, AlertCircle, LogIn, User, Mail, BookOpen, Building2, Upload, FileImage, Trash2 } from 'lucide-react';
import { useAuth, type ApplyData } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (itemId: number, updatedSpots: number | null) => void; // NEW
  type: ApplyData['type'] | 'course';
  itemId: number;
  itemTitle: string;
  itemCompany: string;
  color?: string;
}

export default function ApplyModal({ open, onClose, onSuccess, type, itemId, itemTitle, itemCompany, color = '#7c3aed' }: ApplyModalProps) {
  const { user, apply } = useAuth();
  const navigate = useNavigate();

  // Form fields — pre-filled from logged-in user profile
  const [name,        setName]        = useState(user?.name    || '');
  const [email,       setEmail]       = useState(user?.email   || '');
  const [department,  setDepartment]  = useState(user?.branch  || '');
  const [college,     setCollege]     = useState(user?.college || '');
  const [coverLetter, setCoverLetter] = useState('');

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
      setResumePreview(null);
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

    // ✅ FIXED: pass all form field values to apply()
    const res = await apply({
      type:         applyType,
      itemId,
      itemTitle,
      itemCompany,
      coverLetter:    coverLetter.trim() || undefined,
      userName:       name.trim(),
      userEmail:      email.trim(),
      userDepartment: department.trim(),
      userCollege:    college.trim(),
    });

    setLoading(false);
    setResult({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      // Fire callback so parent can decrement spots in the card immediately
      onSuccess?.(itemId, res.updatedSpots ?? null);
      setTimeout(() => { onClose(); setResult(null); }, 3200);
    }
  };

  const handleClose = () => {
    if (loading) return; // prevent close while submitting
    setResult(null);
    setName(user?.name    || '');
    setEmail(user?.email  || '');
    setDepartment(user?.branch  || '');
    setCollege(user?.college || '');
    setCoverLetter('');
    clearResume();
    onClose();
  };

  const typeLabel = { project: 'Project', internship: 'Internship', mentor: 'Mentor Session', course: 'Course' }[type] ?? 'Application';

  // ── Reusable labelled input ─────────────────────────────
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
        fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)',
        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7,
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
        style={{ fontSize: 14 }}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)', zIndex: 200 }} />

          {/* ── Centred wrapper ── */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 201,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px', pointerEvents: 'none',
          }}>
            <motion.div key="modal"
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 28 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: 'all',
                width: '100%', maxWidth: 500,
                maxHeight: '92vh', overflowY: 'auto',
                background: 'var(--surface)',
                border: '1px solid var(--border-2)',
                borderRadius: 24, position: 'relative',
                boxShadow: '0 32px 80px rgba(0,0,0,0.38), 0 0 0 1px rgba(255,255,255,0.05)',
              }}>

              {/* Colour accent bar at top */}
              <div style={{
                height: 4, borderRadius: '24px 24px 0 0',
                background: `linear-gradient(90deg, ${color}, ${color}88, transparent)`,
              }} />

              <div style={{ padding: '24px 28px 28px' }}>

                {/* ── Close button ── */}
                <button onClick={handleClose} aria-label="Close" style={{
                  position: 'absolute', top: 15, right: 15,
                  background: 'var(--border)', border: 'none', cursor: 'pointer',
                  color: 'var(--text-2)', width: 30, height: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--border-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--border)'}
                >
                  <X size={15} />
                </button>

                {/* ── Modal Header ── */}
                <div style={{ marginBottom: 20, paddingRight: 36 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 999,
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: `${color}18`, color, border: `1px solid ${color}30`, marginBottom: 10,
                  }}>
                    Apply for {typeLabel}
                  </div>
                  <h2 className="font-display" style={{
                    fontWeight: 800, fontSize: 20, color: 'var(--text)',
                    lineHeight: 1.25, marginBottom: 5,
                  }}>
                    {itemTitle}
                  </h2>
                  <p style={{ fontSize: 13.5, color: 'var(--text-2)' }}>
                    by <strong style={{ color: 'var(--text)', fontWeight: 700 }}>{itemCompany}</strong>
                  </p>
                </div>

                {/* ══════════ NOT LOGGED IN ══════════ */}
                {!user ? (
                  <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
                    <div style={{
                      width: 68, height: 68, borderRadius: '50%',
                      background: `${color}12`, border: `1px solid ${color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 18px', fontSize: 30,
                    }}>🔐</div>
                    <h3 className="font-display" style={{ fontWeight: 800, fontSize: 19, color: 'var(--text)', marginBottom: 8 }}>
                      Login Required
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 26, lineHeight: 1.65 }}>
                      Create a free account or sign in to apply for this {typeLabel.toLowerCase()}.
                    </p>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                      <button onClick={() => { handleClose(); navigate('/login'); }}
                        className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <LogIn size={13} /> Sign In
                      </button>
                      <button onClick={() => { handleClose(); navigate('/register'); }}
                        className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        Create Free Account <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                ) : result?.type === 'success' ? (
                  /* ══════════ SUCCESS STATE ══════════ */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    style={{ textAlign: 'center', padding: '28px 0 10px' }}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 18 }}
                      style={{
                        width: 72, height: 72, borderRadius: '50%',
                        background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.28)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                      }}>
                      <CheckCircle size={36} color="#10b981" />
                    </motion.div>
                    <h3 className="font-display" style={{ fontWeight: 800, fontSize: 22, color: 'var(--text)', marginBottom: 10 }}>
                      Application Submitted! 🎉
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65, maxWidth: 340, margin: '0 auto 18px' }}>
                      {result.text}
                    </p>
                    <div style={{
                      padding: '10px 16px', borderRadius: 10,
                      background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)',
                      fontSize: 12, color: '#10b981', fontWeight: 600,
                    }}>
                      ✓ The company will review and contact you within 3–5 business days
                    </div>
                  </motion.div>

                ) : (
                  /* ══════════ APPLICATION FORM ══════════ */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>

                    <div style={{ height: 1, background: 'var(--border)', marginBottom: 2 }} />

                    <Field id="apply-name"    label="Full Name"   icon={<User      size={11} />} value={name}       onChange={setName}       placeholder="Your full name" />
                    <Field id="apply-email"   label="Email ID"    icon={<Mail      size={11} />} value={email}      onChange={setEmail}      type="email" placeholder="you@example.com" />
                    <Field id="apply-dept"    label="Department"  icon={<BookOpen  size={11} />} value={department} onChange={setDepartment} placeholder="e.g. B.Tech Computer Science" />
                    <Field id="apply-college" label="College"     icon={<Building2 size={11} />} value={college}    onChange={setCollege}    placeholder="e.g. Bannari Amman Institute of Technology" />

                    {/* ── Cover letter (optional) ── */}
                    <div>
                      <label htmlFor="apply-cover" style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)',
                        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7,
                      }}>
                        💬 Why do you want to apply?
                        <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'var(--text-3)' }}>
                          &nbsp;(optional)
                        </span>
                      </label>
                      <textarea
                        id="apply-cover"
                        className="inp"
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        placeholder="Briefly describe your motivation, relevant skills, or past experience…"
                        style={{ fontSize: 13.5, minHeight: 84, resize: 'vertical' }}
                      />
                    </div>

                    {/* ── Resume upload (internship only) ── */}
                    {type === 'internship' && (
                      <div>
                        <label style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)',
                          textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8,
                        }}>
                          <FileImage size={11} /> Resume
                          <span style={{ color: '#ef4444', fontWeight: 700, marginLeft: 2 }}>*</span>
                          <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                            &nbsp;(JPG / PNG / PDF, max 5 MB)
                          </span>
                        </label>
                        <input ref={fileInputRef} id="apply-resume" type="file"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={handleFileChange} style={{ display: 'none' }} />
                        {!resumeFile ? (
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            style={{
                              width: '100%', padding: '20px 16px', borderRadius: 12, cursor: 'pointer',
                              border: '1.5px dashed var(--border-2)', background: 'var(--bg-2)',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                              transition: 'border-color 0.2s, background 0.2s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}60`;
                              (e.currentTarget as HTMLButtonElement).style.background  = `${color}07`;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-2)';
                              (e.currentTarget as HTMLButtonElement).style.background  = 'var(--bg-2)';
                            }}>
                            <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}12`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Upload size={19} color={color} />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Click to upload resume</div>
                              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Drag & drop or click to browse</div>
                            </div>
                          </button>
                        ) : (
                          <div style={{ borderRadius: 12, border: `1.5px solid ${color}40`, background: `${color}06`, overflow: 'hidden' }}>
                            {resumePreview ? (
                              <img src={resumePreview} alt="Resume preview"
                                style={{ width: '100%', maxHeight: 200, objectFit: 'contain', display: 'block', padding: 8 }} />
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <FileImage size={18} color="#ef4444" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resumeFile.name}</div>
                                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{(resumeFile.size / 1024).toFixed(0)} KB · PDF</div>
                                </div>
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 8, padding: '8px 10px', borderTop: `1px solid ${color}20`, background: `${color}08` }}>
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

                    {/* ── Error banner ── */}
                    <AnimatePresence>
                      {result?.type === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '11px 14px', borderRadius: 11,
                            background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.22)',
                          }}>
                          <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                          <span style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.5 }}>{result.text}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Submit button ── */}
                    <button
                      id="apply-submit"
                      onClick={handleApply}
                      disabled={loading}
                      className="btn btn-primary"
                      style={{
                        width: '100%', justifyContent: 'center', padding: '14px',
                        fontSize: 15, borderRadius: 14, marginTop: 4,
                        opacity: loading ? 0.75 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                        boxShadow: `0 4px 22px ${color}45`,
                        transition: 'all 0.22s ease',
                      }}>
                      {loading
                        ? <><div className="spinner" /> Submitting…</>
                        : <><span style={{ fontWeight: 700 }}>Submit Application</span><ArrowRight size={16} /></>
                      }
                    </button>

                    <p style={{ fontSize: 11.5, color: 'var(--text-3)', textAlign: 'center', marginTop: 2 }}>
                      Your details will be shared with <strong style={{ color: 'var(--text-2)' }}>{itemCompany}</strong>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
