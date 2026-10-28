import React, { useRef, useState, useEffect } from 'react';
import { Award, CheckCircle, Shield, Sparkles, Download, Printer } from 'lucide-react';
import type { CertificateTemplate, CertificateSigner, CertificateTheme } from '../certificateData';

export interface CertificateRendererProps {
  template: CertificateTemplate;
  studentName: string;
  eventTitle: string;
  issueDate?: string;
  credentialId?: string;
  issuerName?: string;
  achievementRank?: string;
  customBodyText?: string;
  signers?: CertificateSigner[];
  customBgImage?: string;
  scale?: number;
  printMode?: boolean;
}

// ── SVG Elements for Authentic Recreation ──────────────────────

// Gold Medal with dual ribbon tails (Bottom-center, as in Photo 1 & Photo 3)
function GoldMedalBadge({ ribbonColor = '#d4af37' }: { ribbonColor?: string }) {
  const isRedRibbon = ribbonColor === '#b91c1c' || ribbonColor === '#8b1524';
  return (
    <div style={{ position: 'relative', width: 72, height: 78, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Ribbon tails behind */}
      <svg width="60" height="42" viewBox="0 0 60 42" style={{ position: 'absolute', bottom: 0, left: 6, zIndex: 1 }}>
        <path d="M12 0 L6 38 L22 30 L30 38 L24 0 Z" fill={isRedRibbon ? '#b91c1c' : '#c59b27'} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))" />
        <path d="M48 0 L54 38 L38 30 L30 38 L36 0 Z" fill={isRedRibbon ? '#991b1b' : '#a17812'} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))" />
      </svg>
      {/* 3D Shiny Gold Rosette Medallion */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%', zIndex: 2,
        background: 'radial-gradient(circle at 35% 30%, #fff6cc 0%, #ffd700 25%, #d4af37 55%, #aa8010 85%, #664d00 100%)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        border: '1.5px solid #ffe680',
      }}>
        {/* Scalloped edge effect */}
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          border: '1.5px dashed #fff2a3', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 40% 40%, #ffd966 0%, #caa024 70%, #8c6a08 100%)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #fff7d6 0%, #d4af37 60%, #997300 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.25)',
          }}>
            <Award size={20} color="#523900" style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.4))' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Gold Rosette with Notched Tails (Top Right / Top Left as in Photo 2 & Photo 4)
function RosetteRibbonSeal() {
  return (
    <div style={{ position: 'relative', width: 68, height: 72 }}>
      {/* Ribbon Tails */}
      <svg width="50" height="34" viewBox="0 0 50 34" style={{ position: 'absolute', bottom: 0, left: 9, zIndex: 1 }}>
        <path d="M10 0 L4 32 L16 26 L22 32 L18 0 Z" fill="#c59b27" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
        <path d="M40 0 L46 32 L34 26 L28 32 L32 0 Z" fill="#e5c158" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
      </svg>
      {/* Scalloped Gold Medallion */}
      <div style={{
        width: 52, height: 52, borderRadius: '50%', zIndex: 2,
        background: 'radial-gradient(circle at 35% 30%, #fff8db 0%, #f7d050 30%, #c99c1e 70%, #7d5e0a 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.28), inset 0 2px 3px rgba(255,255,255,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid #ffea88',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '1.5px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 40% 40%, #ffde6a 0%, #b8860b 80%)',
        }}>
          <Sparkles size={18} color="#453102" />
        </div>
      </div>
    </div>
  );
}

// Corner Filigree Ornaments for Photo 1 (Burgundy & Gold)
function VictorianCornerOrnament({ position = 'top-left' }: { position: 'top-left' | 'bottom-right' }) {
  const isTopLeft = position === 'top-left';
  return (
    <div style={{
      position: 'absolute',
      top: isTopLeft ? 14 : 'auto',
      bottom: !isTopLeft ? 14 : 'auto',
      left: isTopLeft ? 14 : 'auto',
      right: !isTopLeft ? 14 : 'auto',
      width: 110,
      height: 110,
      pointerEvents: 'none',
      transform: isTopLeft ? 'none' : 'rotate(180deg)',
      zIndex: 3,
    }}>
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        {/* Outer Corner bracket */}
        <path d="M 6 100 L 6 6 L 100 6" fill="none" stroke="#c59b27" strokeWidth="1.6" />
        <path d="M 12 85 L 12 12 L 85 12" fill="none" stroke="#5c141c" strokeWidth="0.8" opacity="0.8" />
        {/* Curled flourishes */}
        <path d="M 12 40 C 24 38, 38 24, 40 12" fill="none" stroke="#c59b27" strokeWidth="1.2" />
        <path d="M 12 60 C 35 55, 55 35, 60 12" fill="none" stroke="#c59b27" strokeWidth="1.4" />
        {/* Acanthus leaf / floral curls */}
        <path d="M 22 22 C 30 16, 40 18, 36 26 C 32 34, 20 28, 22 22 Z" fill="#c59b27" opacity="0.85" />
        <circle cx="16" cy="72" r="3" fill="#c59b27" />
        <circle cx="72" cy="16" r="3" fill="#c59b27" />
        <path d="M 16 72 C 16 80, 24 88, 32 86 C 38 84, 34 76, 28 78" fill="none" stroke="#c59b27" strokeWidth="1.2" />
        <path d="M 72 16 C 80 16, 88 24, 86 32 C 84 38, 76 34, 78 28" fill="none" stroke="#c59b27" strokeWidth="1.2" />
        {/* Inner floral dot */}
        <circle cx="6" cy="6" r="3" fill="#5c141c" stroke="#c59b27" strokeWidth="1" />
      </svg>
    </div>
  );
}

// Ornate Gold Mandala for Photo 3 (Royal Crimson Arch)
function GoldMandalaCorner({ position = 'left' }: { position: 'left' | 'right' }) {
  const isLeft = position === 'left';
  return (
    <div style={{
      position: 'absolute',
      bottom: -10,
      left: isLeft ? -10 : 'auto',
      right: !isLeft ? -10 : 'auto',
      width: 150,
      height: 150,
      pointerEvents: 'none',
      opacity: 0.85,
      zIndex: 2,
      transform: isLeft ? 'none' : 'scaleX(-1)',
    }}>
      <svg viewBox="0 0 160 160" width="100%" height="100%">
        <defs>
          <radialGradient id={`mandala-gold-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd966" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#997a15" />
          </radialGradient>
        </defs>
        {/* Layered lotus petals */}
        {[0, 22.5, 45, 67.5, 90].map((deg, i) => (
          <path
            key={i}
            d="M 30 130 C 50 110, 80 100, 100 80 C 80 100, 70 130, 50 150 Z"
            fill={`url(#mandala-gold-${position})`}
            opacity="0.45"
            transform={`rotate(${deg} 30 130)`}
          />
        ))}
        {[0, 15, 30, 45, 60, 75, 90].map((deg, i) => (
          <ellipse
            key={`el-${i}`}
            cx="40" cy="120" rx="16" ry="6"
            fill="none" stroke="#c59b27" strokeWidth="0.9"
            transform={`rotate(${deg} 30 130)`}
          />
        ))}
      </svg>
    </div>
  );
}

// ── MAIN RENDERER COMPONENT ────────────────────────────────────
export default function CertificateRenderer({
  template,
  studentName,
  eventTitle,
  issueDate = '19 March, 2025',
  credentialId = 'NM-2025-EVT-7721',
  issuerName,
  achievementRank,
  customBodyText,
  signers = template.signers,
  customBgImage,
  scale = 1,
}: CertificateRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = template.theme;
  const org = issuerName || 'Naan Mudhalvan';

  // Compute text
  const rawBody = customBodyText || template.defaultBodyText;
  const formattedBody = rawBody
    .replace(/{{studentName}}/g, studentName || 'Student Name')
    .replace(/{{eventTitle}}/g, eventTitle || 'Event / Program Title')
    .replace(/{{eventDate}}/g, issueDate)
    .replace(/{{organizer}}/g, org);

  // Background style based on theme
  const renderBackgroundAndDecorations = () => {
    // If custom uploaded background image exists
    if (customBgImage || template.bgImage) {
      const bg = customBgImage || template.bgImage;
      return (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1,
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)', zIndex: 1 }} />
        </>
      );
    }

    switch (theme) {
      // ── PHOTO 1: Classic Burgundy & Gold Filigree ──
      case 'burgundy-gold':
        return (
          <>
            {/* Warm ivory cream background */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #fdfbf7 0%, #f8f4ea 50%, #f6efe1 100%)', zIndex: 0 }} />

            {/* Top-Right Burgundy & Gold geometric corner cuts */}
            <svg style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 160, zIndex: 1, pointerEvents: 'none' }} viewBox="0 0 220 160">
              <polygon points="220,0 220,160 160,0" fill="#5c141c" />
              <polygon points="160,0 220,160 130,0" fill="#c59b27" opacity="0.9" />
              <polygon points="130,0 220,160 90,0" fill="#e5c875" opacity="0.5" />
            </svg>

            {/* Bottom-Left Burgundy & Gold geometric corner cuts */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: 200, height: 150, zIndex: 1, pointerEvents: 'none' }} viewBox="0 0 200 150">
              <polygon points="0,150 0,0 70,150" fill="#5c141c" />
              <polygon points="70,150 0,0 110,150" fill="#c59b27" opacity="0.9" />
              <polygon points="110,150 0,0 140,150" fill="#e5c875" opacity="0.5" />
            </svg>

            {/* Victorian Corner filigrees */}
            <VictorianCornerOrnament position="top-left" />
            <VictorianCornerOrnament position="bottom-right" />

            {/* Double Frame Borders */}
            <div style={{
              position: 'absolute', inset: 26,
              border: '1.5px solid #c59b27', borderRadius: 2, pointerEvents: 'none', zIndex: 2,
            }} />
            <div style={{
              position: 'absolute', inset: 30,
              border: '0.6px solid #5c141c', opacity: 0.6, pointerEvents: 'none', zIndex: 2,
            }} />
          </>
        );

      // ── PHOTO 2: Modern Geometric Blue & Cyan (Participation) ──
      case 'geometric-blue':
        return (
          <>
            {/* Crisp white background */}
            <div style={{ position: 'absolute', inset: 0, background: '#ffffff', zIndex: 0 }} />

            {/* Top-Left Dynamic Geometric Polygons (Cyan / Electric Blue / Sapphire) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: 290, height: 170, zIndex: 1, pointerEvents: 'none' }} viewBox="0 0 290 170">
              <polygon points="0,0 220,0 0,110" fill="#0066cc" />
              <polygon points="0,0 150,0 0,75" fill="#003d99" />
              <polygon points="0,60 260,0 290,20 0,140" fill="#0099ff" opacity="0.9" />
              <polygon points="40,100 240,0 260,0 0,160" fill="#33ccff" opacity="0.8" />
              <line x1="160" y1="10" x2="280" y2="30" stroke="#0099ff" strokeWidth="2" opacity="0.7" />
              <line x1="200" y1="26" x2="260" y2="36" stroke="#33ccff" strokeWidth="1.5" opacity="0.6" />
            </svg>

            {/* Bottom-Right Dynamic Geometric Polygons */}
            <svg style={{ position: 'absolute', bottom: 0, right: 0, width: 300, height: 180, zIndex: 1, pointerEvents: 'none' }} viewBox="0 0 300 180">
              <polygon points="300,180 80,180 300,70" fill="#0066cc" />
              <polygon points="300,180 150,180 300,105" fill="#003d99" />
              <polygon points="300,120 40,180 10,160 300,40" fill="#0099ff" opacity="0.9" />
              <polygon points="260,80 60,180 40,180 300,20" fill="#33ccff" opacity="0.8" />
              <line x1="140" y1="170" x2="20" y2="150" stroke="#0099ff" strokeWidth="2" opacity="0.7" />
              <line x1="100" y1="154" x2="40" y2="144" stroke="#33ccff" strokeWidth="1.5" opacity="0.6" />
            </svg>

            {/* Thin subtle frame lines */}
            <div style={{
              position: 'absolute', inset: 24,
              border: '1px solid rgba(2,132,199,0.2)', pointerEvents: 'none', zIndex: 2,
            }} />
          </>
        );

      // ── PHOTO 3: Royal Crimson Arch & Gold Mandala (Achievement) ──
      case 'crimson-arch':
        return (
          <>
            {/* Warm soft ivory base */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #fffcf7 0%, #fbf5ea 100%)', zIndex: 0 }} />

            {/* Curved Arched Ribbon Banners on Top (Crimson + Gold) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: 100, zIndex: 1, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 800 100">
              {/* Outer Deep Crimson arch */}
              <path d="M 0 0 L 800 0 L 800 50 Q 400 95 0 50 Z" fill="#7a101d" />
              {/* Gold ribbon trim */}
              <path d="M 0 35 Q 400 85 800 35 L 800 48 Q 400 98 0 48 Z" fill="#d4af37" />
              {/* Inner Bright Crimson arch */}
              <path d="M 0 0 L 800 0 L 800 30 Q 400 70 0 30 Z" fill="#9e1626" />
              <path d="M 0 20 Q 400 62 800 20 L 800 28 Q 400 70 0 28 Z" fill="#ffe082" opacity="0.8" />
            </svg>

            {/* Left & Right side crimson accent ribbons */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: 80, height: '100%', zIndex: 1, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 80 500">
              <path d="M 0 0 L 50 0 Q 10 250 50 500 L 0 500 Z" fill="#7a101d" opacity="0.95" />
              <path d="M 50 0 Q 10 250 50 500 L 58 500 Q 18 250 58 0 Z" fill="#d4af37" />
            </svg>
            <svg style={{ position: 'absolute', top: 0, right: 0, width: 80, height: '100%', zIndex: 1, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 80 500">
              <path d="M 80 0 L 30 0 Q 70 250 30 500 L 80 500 Z" fill="#7a101d" opacity="0.95" />
              <path d="M 30 0 Q 70 250 30 500 L 22 500 Q 62 250 22 0 Z" fill="#d4af37" />
            </svg>

            {/* Bottom Corner Mandalas */}
            <GoldMandalaCorner position="left" />
            <GoldMandalaCorner position="right" />
          </>
        );

      // ── PHOTO 4: Luxury Navy & Gold Wave (Borcelle Training) ──
      case 'navy-gold-wave':
        return (
          <>
            {/* Clean pearl white base */}
            <div style={{ position: 'absolute', inset: 0, background: '#ffffff', zIndex: 0 }} />

            {/* Double Gold Border Box */}
            <div style={{
              position: 'absolute', inset: 26,
              border: '2px solid #d4af37', pointerEvents: 'none', zIndex: 2,
            }} />
            <div style={{
              position: 'absolute', inset: 31,
              border: '0.8px solid #c59b27', opacity: 0.5, pointerEvents: 'none', zIndex: 2,
            }} />

            {/* Bottom-Left Sweeping Navy & Gold Waves */}
            <svg style={{ position: 'absolute', bottom: 0, left: 0, width: 440, height: 180, zIndex: 3, pointerEvents: 'none' }} viewBox="0 0 440 180">
              {/* Deep Navy wave */}
              <path d="M 0 180 L 440 180 C 340 120, 260 80, 180 120 C 100 160, 40 80, 0 110 Z" fill="#0f1c3f" />
              {/* Gold Ribbon wave */}
              <path d="M 0 140 C 60 110, 120 170, 200 130 C 280 90, 360 130, 440 180 L 440 165 C 360 115, 280 75, 200 115 C 120 155, 60 95, 0 125 Z" fill="#d4af37" />
              {/* Light Gold accent flourish */}
              <path d="M 0 125 C 50 100, 100 145, 170 115 C 240 85, 310 115, 380 165 L 380 155 C 310 105, 240 75, 170 105 C 100 135, 50 90, 0 115 Z" fill="#ffe082" opacity="0.9" />
            </svg>
          </>
        );

      // ── INTERNSHIP: Tech Emerald & Obsidian ──
      case 'emerald-tech':
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #021a12 0%, #062b1e 50%, #01120b 100%)', zIndex: 0 }} />
            {/* Cyber grid lines */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08, zIndex: 1,
              backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
            <div style={{ position: 'absolute', inset: 20, border: '1.5px solid rgba(16,185,129,0.5)', borderRadius: 10, pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', inset: 24, border: '0.8px solid rgba(52,211,153,0.3)', borderRadius: 8, pointerEvents: 'none', zIndex: 2 }} />
          </>
        );

      // ── JOB / OFFER: Executive Platinum & Navy ──
      case 'executive-platinum':
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0b1528 0%, #13223f 50%, #091224 100%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', inset: 22, border: '2px solid rgba(212,175,55,0.7)', borderRadius: 4, pointerEvents: 'none', zIndex: 2 }} />
            <div style={{ position: 'absolute', inset: 27, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, pointerEvents: 'none', zIndex: 2 }} />
          </>
        );

      // ── EXAM: Academic Sapphire & Gold ──
      case 'sapphire-merit':
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #051026 0%, #0a214d 50%, #040c1e 100%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', inset: 22, border: '2px solid #f59e0b', borderRadius: 6, pointerEvents: 'none', zIndex: 2 }} />
          </>
        );

      // ── COURSE: Academic Royal Gold & Deep Navy ──
      case 'course-classic-gold':
        return (
          <>
            {/* Elegant warm parchment base with subtle radial illumination */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, #ffffff 0%, #faf8f2 60%, #f4eee1 100%)', zIndex: 0 }} />

            {/* Guilloche Security Border */}
            <div style={{
              position: 'absolute', inset: 20,
              border: '2.5px solid #d4af37',
              borderRadius: 6,
              pointerEvents: 'none',
              zIndex: 2,
            }} />
            <div style={{
              position: 'absolute', inset: 25,
              border: '1px solid #1e3a8a',
              borderRadius: 4,
              pointerEvents: 'none',
              zIndex: 2,
              opacity: 0.85,
            }} />
            <div style={{
              position: 'absolute', inset: 29,
              border: '0.8px dashed #c59b27',
              borderRadius: 3,
              pointerEvents: 'none',
              zIndex: 2,
              opacity: 0.6,
            }} />

            {/* Corner Decorative Ornaments (Gold & Sapphire) */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
              const isTop = pos.includes('top');
              const isLeft = pos.includes('left');
              return (
                <svg
                  key={pos}
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  style={{
                    position: 'absolute',
                    top: isTop ? 22 : undefined,
                    bottom: !isTop ? 22 : undefined,
                    left: isLeft ? 22 : undefined,
                    right: !isLeft ? 22 : undefined,
                    transform: `${!isLeft ? 'scaleX(-1)' : ''} ${!isTop ? 'scaleY(-1)' : ''}`,
                    zIndex: 4,
                    pointerEvents: 'none',
                  }}
                >
                  <path d="M 0 0 L 22 0 Q 7 7 0 22 Z" fill="#1e3a8a" />
                  <path d="M 0 0 L 16 0 Q 4 4 0 16 Z" fill="#d4af37" />
                  <circle cx="8" cy="8" r="2.5" fill="#ffe082" />
                </svg>
              );
            })}
          </>
        );

      default:
        return <div style={{ position: 'absolute', inset: 0, background: '#ffffff', zIndex: 0 }} />;
    }
  };

  // Typography color schemes
  const isDarkTheme = theme === 'emerald-tech' || theme === 'executive-platinum' || theme === 'sapphire-merit';
  const headingColor = isDarkTheme ? '#ffffff' : (theme === 'burgundy-gold' || theme === 'crimson-arch' ? '#5c141c' : (theme === 'course-classic-gold' ? '#0f224a' : '#0f172a'));
  const subHeadingColor = isDarkTheme ? '#a7f3d0' : (theme === 'burgundy-gold' ? '#781d26' : (theme === 'crimson-arch' ? '#8b1524' : (theme === 'course-classic-gold' ? '#9a7218' : '#0284c7')));
  const bodyTextColor = isDarkTheme ? '#e2e8f0' : (theme === 'burgundy-gold' ? '#3d161a' : '#1e293b');
  const nameColor = isDarkTheme ? '#ffffff' : (theme === 'burgundy-gold' ? '#6b1822' : (theme === 'crimson-arch' ? '#7a101d' : (theme === 'course-classic-gold' ? '#0f224a' : '#0f172a')));

  // Seal component rendering
  const renderBadge = () => {
    switch (template.badgeType) {
      case 'gold-medal':
        return <GoldMedalBadge ribbonColor="#d4af37" />;
      case 'crimson-medal':
        return <GoldMedalBadge ribbonColor="#b91c1c" />;
      case 'gold-rosette-ribbon':
      case 'navy-gold-seal':
        return <RosetteRibbonSeal />;
      case 'tech-shield':
        return (
          <div style={{ width: 60, height: 60, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={30} color="#10b981" />
          </div>
        );
      case 'academic-crest':
        return (
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '2.5px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={32} color="#f59e0b" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="certificate-print-card"
      style={{
        width: '100%',
        maxWidth: 860,
        aspectRatio: '1.414 / 1', // ISO A4 Landscape ratio
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 2px 10px rgba(0,0,0,0.15)',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        userSelect: 'none',
      }}
    >
      {/* Background & Corner Graphics */}
      {renderBackgroundAndDecorations()}

      {/* Top Right / Top Left Seals */}
      {template.badgePosition === 'top-right' && (
        <div style={{ position: 'absolute', top: 38, right: 42, zIndex: 10 }}>
          {renderBadge()}
        </div>
      )}
      {template.badgePosition === 'top-left' && (
        <div style={{ position: 'absolute', top: 38, left: 42, zIndex: 10 }}>
          {renderBadge()}
        </div>
      )}

      {/* ── Certificate Foreground Content ── */}
      <div style={{
        position: 'absolute', inset: 0,
        padding: '38px 60px 30px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        zIndex: 5,
        textAlign: 'center',
      }}>

        {/* ── Top Header Section ── */}
        <div style={{ width: '100%', marginTop: theme === 'crimson-arch' ? 24 : 8 }}>
          {/* Organization Name & verified tag */}
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: subHeadingColor, fontFamily: 'Montserrat, Inter, sans-serif', marginBottom: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span>{org}</span>
            <CheckCircle size={11} color={subHeadingColor} />
          </div>

          {/* Main Title: CERTIFICATE */}
          <h1 style={{
            fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: 'clamp(26px, 4.4vw, 42px)',
            color: headingColor,
            letterSpacing: '0.08em',
            lineHeight: 1.05,
            margin: '0 auto 2px',
            textTransform: 'uppercase',
          }}>
            {template.title}
          </h1>

          {/* Subtitle: OF APPRECIATION / OF PARTICIPATION / OF ACHIEVEMENT */}
          <div style={{
            fontFamily: "'Montserrat', 'Cinzel', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(11px, 1.8vw, 15px)',
            color: subHeadingColor,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {template.subtitle}
          </div>

          {/* Decorative Divider Line */}
          <div style={{
            width: 140, height: 1.5,
            background: `linear-gradient(90deg, transparent, ${template.secondaryColor}, transparent)`,
            margin: '0 auto',
          }} />
        </div>

        {/* ── Middle: Recipient Section ── */}
        <div style={{ width: '100%', margin: '4px 0' }}>
          {/* "THIS CERTIFICATE IS PRESENTED TO" */}
          <div style={{
            fontSize: 8.5, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: isDarkTheme ? '#94a3b8' : '#64748b', fontFamily: 'Montserrat, sans-serif',
            marginBottom: 6,
          }}>
            {theme === 'geometric-blue' ? 'This certificate is proudly present to :' :
             theme === 'navy-gold-wave' ? 'This certificate presented to :' :
             'THIS CERTIFICATE IS PRESENTED TO'}
          </div>

          {/* Recipient Name in Calligraphic Cursive Font */}
          <div style={{
            fontFamily: "'Alex Brush', 'Great Vibes', 'Playfair Display', cursive",
            fontSize: 'clamp(32px, 5.2vw, 54px)',
            fontWeight: 400,
            color: nameColor,
            lineHeight: 1.15,
            letterSpacing: '0.01em',
            textShadow: '0 1px 2px rgba(0,0,0,0.08)',
            padding: '0 20px',
          }}>
            {studentName || 'Recipient Student Name'}
          </div>

          {/* Underline Flourish */}
          <div style={{
            width: '65%', maxWidth: 360, height: 1,
            background: `linear-gradient(90deg, transparent 0%, ${template.secondaryColor} 30%, ${template.secondaryColor} 70%, transparent 100%)`,
            margin: '4px auto 10px',
          }} />

          {/* Achievement rank banner if applicable */}
          {achievementRank && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #ffd70025, #d4af3740)',
              border: '1px solid #d4af37',
              borderRadius: 99, padding: '3px 14px',
              color: '#8b6508', fontWeight: 800, fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              🏆 {achievementRank}
            </div>
          )}

          {/* Descriptive Body Paragraph */}
          <div style={{
            maxWidth: 580,
            margin: '0 auto',
            fontSize: 'clamp(10px, 1.35vw, 12px)',
            lineHeight: 1.6,
            color: bodyTextColor,
            fontFamily: "'Montserrat', 'Inter', sans-serif",
            fontWeight: 500,
            whiteSpace: 'pre-line',
          }}>
            {formattedBody}
          </div>
        </div>

        {/* ── Bottom Section: Signatures & Seal ── */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          marginTop: 6,
        }}>

          {/* Signer 1 (Left) */}
          <div style={{ flex: 1, textAlign: 'center', maxWidth: 180 }}>
            {/* Signature Cursive Graphic */}
            <div style={{
              fontFamily: "'Great Vibes', 'Alex Brush', cursive",
              fontSize: 22,
              color: isDarkTheme ? '#cbd5e1' : '#334155',
              height: 28,
              lineHeight: '28px',
              fontStyle: 'italic',
            }}>
              {signers[0]?.signatureText || signers[0]?.name || 'Authorized'}
            </div>
            {/* Underline line */}
            <div style={{ height: 1, background: isDarkTheme ? '#475569' : '#94a3b8', width: '90%', margin: '2px auto 4px' }} />
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: isDarkTheme ? '#f1f5f9' : '#0f172a', fontFamily: 'Montserrat, sans-serif',
            }}>
              {signers[0]?.name || 'DONNA STROUPE'}
            </div>
            <div style={{
              fontSize: 7.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: isDarkTheme ? '#94a3b8' : '#64748b', fontFamily: 'Montserrat, sans-serif',
            }}>
              {signers[0]?.title || 'HEAD OF EVENT'}
            </div>
          </div>

          {/* Center: Gold Medal Seal (if bottom-center position) */}
          {template.badgePosition === 'bottom-center' ? (
            <div style={{ flexShrink: 0, margin: '0 8px' }}>
              {renderBadge()}
            </div>
          ) : (
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                fontSize: 8, color: isDarkTheme ? '#94a3b8' : '#64748b',
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em',
              }}>
                Date: {issueDate}
              </div>
              <div style={{
                fontSize: 7.5, color: isDarkTheme ? '#64748b' : '#94a3b8',
                fontFamily: 'JetBrains Mono, monospace', marginTop: 2,
              }}>
                Verify: naanmudhalvan.tn.gov.in
              </div>
            </div>
          )}

          {/* Signer 2 (Right) or Date */}
          <div style={{ flex: 1, textAlign: 'center', maxWidth: 180 }}>
            {signers[1] ? (
              <>
                <div style={{
                  fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                  fontSize: 22,
                  color: isDarkTheme ? '#cbd5e1' : '#334155',
                  height: 28,
                  lineHeight: '28px',
                  fontStyle: 'italic',
                }}>
                  {signers[1].signatureText || signers[1].name}
                </div>
                <div style={{ height: 1, background: isDarkTheme ? '#475569' : '#94a3b8', width: '90%', margin: '2px auto 4px' }} />
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: isDarkTheme ? '#f1f5f9' : '#0f172a', fontFamily: 'Montserrat, sans-serif',
                }}>
                  {signers[1].name}
                </div>
                <div style={{
                  fontSize: 7.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: isDarkTheme ? '#94a3b8' : '#64748b', fontFamily: 'Montserrat, sans-serif',
                }}>
                  {signers[1].title}
                </div>
              </>
            ) : (
              <>
                <div style={{
                  fontSize: 10, color: isDarkTheme ? '#cbd5e1' : '#334155',
                  fontWeight: 600, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {issueDate}
                </div>
                <div style={{ height: 1, background: isDarkTheme ? '#475569' : '#94a3b8', width: '90%', margin: '2px auto 4px' }} />
                <div style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: isDarkTheme ? '#f1f5f9' : '#0f172a', fontFamily: 'Montserrat, sans-serif',
                }}>
                  DATE OF ISSUANCE
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer Verifiable Credential ID ── */}
        <div style={{
          fontSize: 6.5,
          color: isDarkTheme ? '#64748b' : '#94a3b8',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.12em',
          marginTop: 4,
        }}>
          CREDENTIAL ID: {credentialId} · ISSUED VIA NAAN MUDHALVAN SECURE PORTAL
        </div>

      </div>
    </div>
  );
}

// ── Print & Download Helper ────────────────────────────────────
export function printCertificateWindow(cardHtml: string, certTitle: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${certTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@600;700;800;900&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
          @media print {
            body {
              background: #ffffff;
            }
            .certificate-print-card {
              max-width: 100% !important;
              width: 100% !important;
              height: 100vh !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          }
        </style>
      </head>
      <body>
        ${cardHtml}
        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
    </html>
  `);
  win.document.close();
}

// ── Scaled Thumbnail Wrapper (Prevents clipping & huge text) ───
export function CertificateThumbnail(props: CertificateRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) {
          setScale(w / 860);
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(updateScale);
      ro.observe(containerRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        aspectRatio: '1.414 / 1',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 10,
        background: '#070a10',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 860,
          height: 608,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        <CertificateRenderer {...props} />
      </div>
    </div>
  );
}
