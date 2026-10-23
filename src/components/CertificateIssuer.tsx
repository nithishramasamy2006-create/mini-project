import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Sparkles, Shield, Users } from 'lucide-react';

export interface CertificateIssuerProps { issuerName: string; issuerType: 'company' | 'college'; }

export default function CertificateIssuer({ issuerName, issuerType }: CertificateIssuerProps) {
  const navigate = useNavigate();
  const accent  = issuerType === 'company' ? '#3b82f6' : '#10b981';
  const gradEnd = issuerType === 'company' ? '#1d4ed8' : '#0d9488';

  const features = [
    { icon: '🎨', title: '10 Premium Templates', desc: 'Royal, Neon, Gold, Holographic and more styles' },
    { icon: '✏️', title: 'Live Personalisation',  desc: 'Enter student name, course, date and credential ID' },
    { icon: '🔍', title: 'Live Preview',           desc: 'See the certificate update in real-time as you type' },
    { icon: '📥', title: 'Print & Download',       desc: 'Export as A4 PDF or print directly' },
    { icon: '🔗', title: 'Share Credential ID',    desc: 'Copy verifiable credential ID to share with student' },
    { icon: '🏅', title: 'Internship / Course / Excellence', desc: '3 certificate categories covered' },
  ];

  return (
    <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:`${accent}15`, border:`1px solid ${accent}25`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Award size={22} color={accent}/>
          </div>
          <div>
            <h2 style={{ fontWeight:800, fontSize:20, color:'var(--text)', margin:0 }}>Issue Certificate</h2>
            <p style={{ fontSize:12.5, color:'var(--text-3)', margin:0 }}>
              Build and issue certificates to students on behalf of <strong style={{ color:'var(--text-2)' }}>{issuerName}</strong>
            </p>
          </div>
        </div>

        {/* Authority badge */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:12 }}>
          <div style={{ padding:'8px 14px', borderRadius:10, background:`${accent}10`, border:`1px solid ${accent}25`, fontSize:12, color:accent, display:'flex', alignItems:'center', gap:6 }}>
            <Shield size={13}/> <strong>Issuer Authority:</strong> {issuerType === 'company' ? 'Company' : 'College / TPO'}
          </div>
          <div style={{ padding:'8px 14px', borderRadius:10, background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', fontSize:12, color:'#f59e0b', display:'flex', alignItems:'center', gap:6 }}>
            <Sparkles size={13}/> 10 premium certificate templates
          </div>
          <div style={{ padding:'8px 14px', borderRadius:10, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', fontSize:12, color:'#10b981', display:'flex', alignItems:'center', gap:6 }}>
            <Users size={13}/> Students receive issued certs in their portal
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12, marginBottom:28 }}>
        {features.map(f => (
          <div key={f.title} style={{ padding:'14px 16px', borderRadius:13, background:'var(--surface)', border:'1px solid var(--border)', display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ fontSize:22, flexShrink:0, marginTop:2 }}>{f.icon}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:'var(--text)', marginBottom:3 }}>{f.title}</div>
              <div style={{ fontSize:11.5, color:'var(--text-3)', lineHeight:1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding:'28px 32px', borderRadius:20, background:`linear-gradient(135deg,${accent}12,${gradEnd}08)`, border:`1px solid ${accent}25`, textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🏅</div>
        <h3 style={{ fontWeight:800, fontSize:18, color:'var(--text)', marginBottom:8 }}>Open Certificate Builder</h3>
        <p style={{ fontSize:13, color:'var(--text-3)', maxWidth:480, margin:'0 auto 20px', lineHeight:1.6 }}>
          The full certificate builder opens in a dedicated workspace. Choose a template, personalise it with student details, preview live, and download as a PDF certificate.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={() => navigate('/certificates')}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:13, background:`linear-gradient(135deg,${accent},${gradEnd})`, border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 4px 20px ${accent}45` }}>
            <Award size={16}/> Open Certificate Builder
          </button>
          <button onClick={() => navigate('/certificates')}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:13, background:'var(--bg)', border:`1px solid ${accent}40`, color:accent, fontWeight:600, fontSize:13, cursor:'pointer' }}>
            <ExternalLink size={14}/> Full Screen
          </button>
        </div>
      </div>

    </motion.div>
  );
}

