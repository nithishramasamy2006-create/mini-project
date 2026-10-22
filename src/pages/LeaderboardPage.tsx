import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, BookOpen, Star, TrendingUp, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { LEADERBOARD as STATIC_DATA } from '../data';
import { api, fetchWithFallback } from '../api';

const MEDALS = ['🥇','🥈','🥉'];
const RANK_CLR = ['#fde68a','#d1d5db','#fdba74'];
const RANK_SHADOW = [
  '0 0 32px rgba(245,158,11,0.5)',
  '0 0 24px rgba(209,213,219,0.3)',
  '0 0 24px rgba(249,115,22,0.4)',
];

// Loading skeleton row
function SkeletonRow() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '50px 1fr 150px 80px 80px 96px',
      padding: '14px 20px', gap: 12, alignItems: 'center',
    }}>
      {[50, 200, 120, 60, 60, 80].map((w, i) => (
        <div key={i} style={{ height: 14, width: w, borderRadius: 6, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchWithFallback(() => api.leaderboard.getAll(), STATIC_DATA).then(result => {
      // Normalize MongoDB docs (may have _id instead of rank)
      const normalized = result.map((r: any, i: number) => ({
        ...r,
        rank: r.rank ?? i + 1,
        grad: r.grad ?? `linear-gradient(135deg,#7c3aed,#4f46e5)`,
      }));
      setData(normalized);
      setIsLive(result !== STATIC_DATA);
      setLoading(false);
    });
  }, []);

  const top3 = data.slice(0, 3);

  return (
    <div className="page" style={{ minHeight: '100vh', paddingTop: 60 }}>

      {/* ── BANNER ── */}
      <div className="banner" style={{ background: 'linear-gradient(180deg,rgba(6,10,20,0.9) 0%,transparent 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 120% at 50% 50%,rgba(245,158,11,0.08),transparent)' }} />
        <div className="mesh-bg" style={{ position: 'absolute', inset: 0, opacity: .3 }} />
        <div className="container banner-inner" style={{ textAlign: 'center' }}>
          <span className="chip chip-amber" style={{ display: 'inline-flex', marginBottom: 14 }}>
            <Trophy size={12} /> Student Rankings
          </span>
          <h1 className="font-display" style={{ fontWeight: 700, fontSize: 'clamp(30px,5vw,54px)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 10 }}>
            <span className="g-amber">Leaderboard</span>
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 500, margin: '0 auto 14px' }}>
            Top performers across Tamil Nadu colleges. Earn XP by completing projects, courses &amp; maintaining daily streaks.
          </p>

          {/* Live data indicator */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px',
            borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: loading ? 'rgba(100,116,139,0.1)' : isLive ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.1)',
            border: `1px solid ${loading ? 'rgba(100,116,139,0.2)' : isLive ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.25)'}`,
            color: loading ? '#64748b' : isLive ? '#10b981' : '#f59e0b',
          }}>
            {loading
              ? <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} />
              : isLive ? <Wifi size={11} /> : <WifiOff size={11} />
            }
            {loading ? 'Connecting to server…' : isLive ? `Live data · ${data.length} students` : 'Demo data — server offline'}
          </div>
        </div>
      </div>

      <div className="container-md" style={{ paddingTop: 48, paddingBottom: 64 }}>

        {loading ? (
          /* ── LOADING SKELETON ── */
          <div>
            {/* Podium skeleton */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginBottom: 56 }}>
              {[80, 108, 60].map((h, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: i === 1 ? 80 : 64, height: i === 1 ? 80 : 64, borderRadius: 18, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={{ width: i === 1 ? 104 : 88, height: h, borderRadius: '14px 14px 0 0', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                </div>
              ))}
            </div>
            {/* Table skeleton */}
            <div className="glass-heavy lb-table">
              {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </div>
        ) : (
          <>
            {/* ── PODIUM ── */}
            {top3.length === 3 && (
              <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 56 }}>
                {[1, 0, 2].map(pos => {
                  const s = top3[pos];
                  const heights = [80, 108, 60];
                  const sizes = [64, 80, 60];
                  const isFirst = pos === 0;
                  return (
                    <div key={pos} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      {isFirst && <div style={{ fontSize: 24, marginBottom: 4 }}>👑</div>}
                      <div style={{
                        width: sizes[pos], height: sizes[pos], borderRadius: isFirst ? 22 : 18,
                        background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Space Grotesk',sans-serif", fontSize: isFirst ? 28 : 22, fontWeight: 800, color: '#fff',
                        boxShadow: RANK_SHADOW[pos],
                      }}>
                        {s.avatar}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div className="font-display" style={{ fontWeight: 700, color: 'var(--text)', fontSize: isFirst ? 15 : 13 }}>{s.name}</div>
                        <div style={{ fontSize: 9.5, color: 'var(--text-3)', marginTop: 2 }}>{s.badge}</div>
                        <div className="font-display" style={{ fontWeight: 700, fontSize: isFirst ? 20 : 16, color: RANK_CLR[pos], marginTop: 2 }}>
                          {s.points?.toLocaleString()}
                        </div>
                      </div>
                      <div className="glass-heavy" style={{
                        width: isFirst ? 104 : 88, height: heights[pos], borderRadius: '14px 14px 0 0',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                        paddingTop: 12, fontSize: isFirst ? 32 : 26, border: `1px solid ${RANK_CLR[pos]}30`,
                      }}>
                        {MEDALS[pos]}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* ── TABLE ── */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}
              className="glass-heavy lb-table">
              {/* Header */}
              <div className="lb-head" style={{ gridTemplateColumns: '50px 1fr 150px 80px 80px 96px' }}>
                {['Rank', 'Student', 'College', 'Projects', 'Courses', 'XP Score'].map((h, i) => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', textAlign: i > 2 ? 'center' : undefined }}>
                    {h}
                  </span>
                ))}
              </div>

              {data.map((s, i) => (
                <motion.div key={s.rank ?? i}
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="lb-row"
                  style={{
                    gridTemplateColumns: '50px 1fr 150px 80px 80px 96px',
                    background: i < 3 ? `rgba(${i === 0 ? '245,158,11' : i === 1 ? '209,213,219' : '249,115,22'},0.03)` : 'transparent',
                  }}>

                  {/* Rank */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {i < 3
                      ? <span style={{ fontSize: 20 }}>{MEDALS[i]}</span>
                      : <span className="font-mono" style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-3)' }}>{String(s.rank).padStart(2, '0')}</span>
                    }
                  </div>

                  {/* Student */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#fff', flexShrink: 0, fontFamily: "'Space Grotesk',sans-serif" }}>
                      {s.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 1 }}>{s.badge}</div>
                    </div>
                  </div>

                  {/* College */}
                  <div style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.college}</div>

                  {/* Projects */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Zap size={11} color="#c4b5fd" />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{s.projects}</span>
                  </div>

                  {/* Courses */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <BookOpen size={11} color="#93c5fd" />
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{s.courses}</span>
                  </div>

                  {/* XP */}
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: i < 3 ? RANK_CLR[i] : '#c4b5fd' }}>
                      {s.points?.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 2 }}>
                      <Flame size={9} color="#f97316" />
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{s.streak}d streak</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* ── XP GUIDE ── */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              className="glass" style={{ borderRadius: 18, padding: '22px 28px', marginTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
              <span className="font-display" style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}>
                <TrendingUp size={14} color="#fde68a" /> How to Earn XP
              </span>
              {[
                { Icon: Zap,      label: 'Complete Project', pts: '+500 XP', color: '#c4b5fd' },
                { Icon: BookOpen, label: 'Finish Course',    pts: '+200 XP', color: '#93c5fd' },
                { Icon: Star,     label: '5-Star Review',   pts: '+50 XP',  color: '#fde68a' },
                { Icon: Flame,    label: 'Daily Streak',    pts: '+10 XP/day', color: '#fdba74' },
              ].map(({ Icon, label, pts, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</div>
                    <div className="font-display" style={{ fontWeight: 700, fontSize: 13, color }}>{pts}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
