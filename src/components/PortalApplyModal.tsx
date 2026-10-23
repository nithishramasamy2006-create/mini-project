import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Send, User, Mail, Phone, Building2, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { portalAppSave, portalAppHasApplied, type ApplicationStatus } from '../portalApplications';

interface Props {
  open:        boolean;
  onClose:     () => void;
  onSuccess?:  () => void;
  type:        'project' | 'internship' | 'job' | 'event' | 'exam';
  itemId:      number;
  itemTitle:   string;
  itemCompany: string;
  itemAuthor:  string;
  color?:      string;
}

const isEvent = (t: string) => t === 'event' || t === 'exam';

export default function PortalApplyModal({
  open, onClose, onSuccess, type, itemId, itemTitle, itemCompany, itemAuthor, color = '#7c3aed'
}: Props) {
  const { user } = useAuth();

  const [name,        setName]        = useState(user?.name    || '');
  const [email,       setEmail]       = useState(user?.email   || '');
  const [phone,       setPhone]       = useState((user as any)?.phone   || '');
  const [college,     setCollege]     = useState(user?.college || '');
  const [branch,      setBranch]      = useState(user?.branch  || '');
  const [year,        setYear]        = useState((user as any)?.year    || '');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink,  setResumeLink]  = useState('');
  const [result,      setResult]      = useState<{ ok: boolean; msg: string } | null>(null);
  const [submitting,  setSubmitting]  = useState(false);

  const alreadyApplied = open && portalAppHasApplied(itemId, email || user?.email || '');

  const handleClose = () => {
    if (submitting) return;
    setResult(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setResult({ ok: false, msg: 'Name and Email are required.' });
      return;
    }
    if (alreadyApplied) {
      setResult({ ok: false, msg: 'You have already applied for this.' });
      return;
    }
    setSubmitting(true);

    const initialStatus: ApplicationStatus = isEvent(type) ? 'registered' : 'pending';

    portalAppSave({
      type,
      itemId,
      itemTitle,
      itemCompany,
      itemAuthor,
      studentName:    name.trim(),
      studentEmail:   email.trim(),
      studentPhone:   phone.trim(),
      studentCollege: college.trim(),
      studentBranch:  branch.trim(),
      studentYear:    year.trim(),
      coverLetter:    coverLetter.trim(),
      resumeLink:     resumeLink.trim(),
      status:         initialStatus,
    });

    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setResult({
      ok:  true,
      msg: isEvent(type)
        ? `✅ Successfully registered for "${itemTitle}"!`
        : `✅ Application submitted for "${itemTitle}"! The team will review and update you.`,
    });
    onSuccess?.();
    setTimeout(() => { handleClose(); }, 3000);
  };

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const sb = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${sb}px`);
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>

          <motion.div
            initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
            style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>

            {/* Header */}
            <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {isEvent(type) ? '🎪' : type === 'job' ? '💼' : type === 'internship' ? '🏢' : '🎯'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: 'var(--text)', marginBottom: 2, lineHeight: 1.3 }}>
                  {isEvent(type) ? 'Register for Event' : 'Apply Now'}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {itemTitle} · <span style={{ color }}>{itemCompany}</span>
                </p>
              </div>
              <button onClick={handleClose} style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            {/* Already applied notice */}
            {alreadyApplied && (
              <div style={{ margin: '16px 24px 0', padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 9 }}>
                <CheckCircle size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>You have already applied for this!</span>
              </div>
            )}

            {/* Success state */}
            {result?.ok ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#10b981', lineHeight: 1.5 }}>{result.msg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
                {result && !result.ok && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: 9, alignItems: 'center', marginBottom: 16 }}>
                    <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#ef4444' }}>{result.msg}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { icon: <User size={13}/>,     label: 'Full Name *',   val: name,    set: setName,    placeholder: 'Your full name',   col: '1/-1' },
                    { icon: <Mail size={13}/>,     label: 'Email *',       val: email,   set: setEmail,   placeholder: 'your@email.com',   col: '1' },
                    { icon: <Phone size={13}/>,    label: 'Phone',         val: phone,   set: setPhone,   placeholder: '+91 XXXXX XXXXX',  col: '2' },
                    { icon: <Building2 size={13}/>,label: 'College',       val: college, set: setCollege, placeholder: 'Your college name', col: '1/-1' },
                    { icon: <BookOpen size={13}/>, label: 'Branch / Dept', val: branch,  set: setBranch,  placeholder: 'e.g. CSE, ECE',    col: '1' },
                    { icon: <Calendar size={13}/>, label: 'Year of Study', val: year,    set: setYear,    placeholder: '3rd Year',          col: '2' },
                  ].map(f => (
                    <div key={f.label} style={{ gridColumn: f.col }}>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                        <span style={{ color }}>{f.icon}</span> {f.label}
                      </label>
                      <input
                        className="inp"
                        value={f.val}
                        onChange={e => f.set(e.target.value)}
                        placeholder={f.placeholder}
                        style={{ fontSize: 13 }}
                        required={f.label.includes('*')}
                      />
                    </div>
                  ))}

                  {/* Cover letter / motivation — jobs/internships/projects only */}
                  {!isEvent(type) && (
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                        Cover Letter / Why are you a good fit?
                      </label>
                      <textarea
                        className="inp"
                        rows={4}
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        placeholder="Tell us about yourself and why you want this role…"
                        style={{ fontSize: 13, resize: 'none' }}
                      />
                    </div>
                  )}

                  {/* Resume link — internship/job */}
                  {(type === 'internship' || type === 'job') && (
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 5 }}>
                        Resume / Portfolio Link
                      </label>
                      <input
                        className="inp"
                        type="url"
                        value={resumeLink}
                        onChange={e => setResumeLink(e.target.value)}
                        placeholder="https://drive.google.com/… or LinkedIn / GitHub"
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  )}
                </div>

                {/* Workflow info */}
                {!isEvent(type) && (
                  <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: `${color}08`, border: `1px solid ${color}20` }}>
                    <p style={{ fontSize: 11.5, color: 'var(--text-3)', margin: 0 }}>
                      📋 <strong style={{ color }}>Application workflow:</strong> Pending → Reviewed → Shortlisted → Interview → Hired
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || alreadyApplied}
                  style={{ marginTop: 18, width: '100%', padding: '12px', borderRadius: 12, background: alreadyApplied ? 'var(--border)' : color, border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: alreadyApplied ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                  {submitting ? (
                    <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}/> Submitting…</>
                  ) : (
                    <><Send size={15}/> {isEvent(type) ? 'Register Now' : 'Submit Application'}</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
