// ── Email Service — NodeMailer with NM-branded HTML templates ──
// Supports: Gmail OAuth app-password, Outlook, SMTP, Ethereal (test)

import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────────────────────
// Transport — reads from .env, falls back to Ethereal (test inbox) automatically
// ─────────────────────────────────────────────────────────────────────────────
let _transporter = null;

async function getTransporter() {
  if (_transporter) return _transporter;

  // If SMTP credentials are configured in .env → use them
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    _transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',          // true for 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📧 Email service: using SMTP transport →', process.env.EMAIL_HOST);
    return _transporter;
  }

  // Fallback: Ethereal auto-creates a free test account — no setup needed
  // Emails are captured at https://ethereal.email (printed in console)
  const testAccount = await nodemailer.createTestAccount();
  _transporter = nodemailer.createTransport({
    host:   'smtp.ethereal.email',
    port:   587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log('📧 Email service: using Ethereal test transport (no SMTP configured)');
  console.log('   Preview emails at: https://ethereal.email');
  console.log(`   Ethereal user: ${testAccount.user}`);
  return _transporter;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML template builder
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_META = {
  pending:     { emoji: '📋', label: 'Application Received',    color: '#6366f1', bg: '#eef2ff', badge: 'Under Review' },
  reviewed:    { emoji: '👀', label: 'Application Reviewed',    color: '#f59e0b', bg: '#fffbeb', badge: 'Being Reviewed' },
  shortlisted: { emoji: '⭐', label: 'You\'re Shortlisted!',    color: '#7c3aed', bg: '#f5f3ff', badge: 'Shortlisted' },
  interview:   { emoji: '🎯', label: 'Interview Invitation',    color: '#0ea5e9', bg: '#f0f9ff', badge: 'Interview Scheduled' },
  hired:       { emoji: '🎉', label: 'Congratulations! Offer!', color: '#10b981', bg: '#ecfdf5', badge: 'Offer Extended' },
  accepted:    { emoji: '✅', label: 'Application Accepted!',   color: '#10b981', bg: '#ecfdf5', badge: 'Accepted' },
  rejected:    { emoji: '💌', label: 'Application Update',      color: '#6b7280', bg: '#f9fafb', badge: 'Reviewed' },
};

function buildHTML({ studentName, company, role, status, notes, appId }) {
  const meta = STATUS_META[status] || STATUS_META.reviewed;
  const year = new Date().getFullYear();

  const motivationLine = status === 'rejected'
    ? `<p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 16px">
        Thank you for your interest in <strong>${role}</strong> at <strong>${company}</strong>.
        While we have decided to move forward with other candidates at this time,
        we truly appreciate the time and effort you invested in your application.
        We encourage you to keep building your skills and apply again in the future.
       </p>`
    : status === 'hired' || status === 'accepted'
    ? `<p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 16px">
        We are delighted to extend you an offer for <strong>${role}</strong> at <strong>${company}</strong>!
        Our team will reach out shortly with the next steps. Please check your email regularly.
       </p>`
    : status === 'interview'
    ? `<p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 16px">
        We would like to invite you for an interview for <strong>${role}</strong> at <strong>${company}</strong>.
        Our hiring team will contact you soon with the interview schedule and details.
       </p>`
    : status === 'shortlisted'
    ? `<p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 16px">
        Great news! Your application for <strong>${role}</strong> at <strong>${company}</strong> 
        has been shortlisted. You are one step closer — our team will be in touch soon.
       </p>`
    : `<p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 16px">
        Your application for <strong>${role}</strong> at <strong>${company}</strong> 
        has been received and is currently being reviewed. We will keep you updated.
       </p>`;

  const notesBlock = notes
    ? `<div style="background:#f3f4f6;border-left:4px solid ${meta.color};border-radius:4px;padding:12px 16px;margin:16px 0;">
         <p style="font-size:13px;color:#6b7280;margin:0 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Note from Company</p>
         <p style="font-size:14px;color:#374151;margin:0;line-height:1.6">${notes}</p>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${meta.label} — NaanMudhalvan</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e0a3c 0%,#2d1b69 50%,#1e0a3c 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:12px;">
              <div style="width:44px;height:44px;background:linear-gradient(135deg,#7c3aed,#4f46e5);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;">
                <span style="color:#fff;font-weight:900;font-size:18px;">NM</span>
              </div>
              <span style="color:#c4b5fd;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;">NaanMudhalvan</span>
            </div>
            <div style="font-size:42px;margin:8px 0;">${meta.emoji}</div>
            <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 8px;letter-spacing:-0.02em;">${meta.label}</h1>
            <div style="display:inline-block;background:${meta.color};color:#fff;font-size:11px;font-weight:700;padding:4px 16px;border-radius:99px;letter-spacing:0.08em;text-transform:uppercase;">${meta.badge}</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="color:#374151;font-size:16px;margin:0 0 8px;">Hi <strong style="color:#1f2937;">${studentName}</strong>,</p>
            ${motivationLine}
            ${notesBlock}

            <!-- Status card -->
            <div style="background:${meta.bg};border:1.5px solid ${meta.color}30;border-radius:12px;padding:20px 24px;margin:20px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;padding-right:12px;">
                    <p style="font-size:11px;color:#9ca3af;margin:0 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Role / Project</p>
                    <p style="font-size:14px;color:#111827;font-weight:700;margin:0;">${role}</p>
                  </td>
                  <td style="width:50%;padding-left:12px;border-left:1px solid #e5e7eb;">
                    <p style="font-size:11px;color:#9ca3af;margin:0 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Company</p>
                    <p style="font-size:14px;color:#111827;font-weight:700;margin:0;">${company}</p>
                  </td>
                </tr>
                <tr><td colspan="2" style="padding-top:16px;">
                  <p style="font-size:11px;color:#9ca3af;margin:0 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em">Application Status</p>
                  <div style="display:inline-block;background:${meta.color};color:#fff;font-size:12px;font-weight:700;padding:5px 16px;border-radius:8px;">${meta.badge}</div>
                </td></tr>
              </table>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin:28px 0 8px;">
              <a href="http://localhost:8080/portal/student" 
                 style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:13px 32px;border-radius:12px;letter-spacing:0.01em;">
                View My Applications →
              </a>
            </div>

            <p style="color:#9ca3af;font-size:12px;text-align:center;margin:20px 0 0;line-height:1.6;">
              Application ID: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace;">${appId || 'N/A'}</code><br/>
              This is an automated message from NaanMudhalvan. Please do not reply to this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="font-size:12px;color:#94a3b8;margin:0 0 8px;">
              © ${year} NaanMudhalvan Learning Marketplace · Government of Tamil Nadu Initiative
            </p>
            <p style="font-size:11px;color:#cbd5e1;margin:0;">
              <a href="http://localhost:8080" style="color:#7c3aed;text-decoration:none;">naanmudhalvan.tn.gov.in</a>
              &nbsp;·&nbsp;
              <a href="http://localhost:8080/portal/student" style="color:#7c3aed;text-decoration:none;">My Portal</a>
              &nbsp;·&nbsp;
              <a href="http://localhost:8080/courses" style="color:#7c3aed;text-decoration:none;">Browse Courses</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

const FROM = process.env.EMAIL_FROM || '"NaanMudhalvan 🎓" <noreply@naanmudhalvan.tn.gov.in>';

/**
 * Send "Application Received" email right after a student submits.
 */
export async function sendApplicationConfirmation({ studentName, studentEmail, role, company, appId }) {
  try {
    const transport = await getTransporter();
    const info = await transport.sendMail({
      from:    FROM,
      to:      studentEmail,
      subject: `✅ Application Received: ${role} at ${company} — NaanMudhalvan`,
      html:    buildHTML({ studentName, company, role, status: 'pending', appId }),
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log('📧 Preview (confirmation):', previewUrl);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    // Email failure must never crash the main request — just log
    console.error('⚠️  Email send failed (confirmation):', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send status-change alert when Company/College updates an application.
 */
export async function sendStatusChangeAlert({ studentName, studentEmail, role, company, status, notes, appId }) {
  try {
    const meta = STATUS_META[status];
    if (!meta) return { success: false, error: 'Unknown status' };

    const transport = await getTransporter();
    const info = await transport.sendMail({
      from:    FROM,
      to:      studentEmail,
      subject: `${meta.emoji} ${meta.label}: ${role} at ${company} — NaanMudhalvan`,
      html:    buildHTML({ studentName, company, role, status, notes, appId }),
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log(`📧 Preview (${status}):`, previewUrl);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('⚠️  Email send failed (status change):', err.message);
    return { success: false, error: err.message };
  }
}
