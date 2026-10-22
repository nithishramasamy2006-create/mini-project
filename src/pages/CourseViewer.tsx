import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Play, CheckCircle, BookOpen,
  FileText, HelpCircle, Award, Clock, ChevronDown,
  ChevronRight, Star, Heart, MessageSquare, BookmarkCheck, Send
} from 'lucide-react';
import { ALL_COURSES } from '../courseData';

// ── Per-course lesson curriculum ───────────────────────────
interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'quiz';
  videoId?: string;   // YouTube embed ID
  content?: string;   // markdown-ish text
  mcqs?: MCQ[];
  free?: boolean;
}
interface MCQ {
  q: string;
  opts: string[];
  answer: number;
}
interface Module { title: string; lessons: Lesson[]; }

// ── Verified working YouTube video IDs (public, freely embeddable) ──
// Source: freeCodeCamp, Programming with Mosh, Traversy Media, CS Dojo
const VID = {
  // ── Machine Learning / AI / Deep Learning ──────────────────────────
  ml_intro:     'bmmQA8A-yUA',  // ML in 2024 – Beginner's Course (freeCodeCamp)
  ml_setup:     'i_LwzRVP7bg',  // Machine Learning with Python (freeCodeCamp)
  ml_core:      'qFJeN9V1ZsI',  // TensorFlow 2.0 Complete Course (freeCodeCamp)
  ml_lab:       'NWONeJKn38o',  // Scikit-Learn Crash Course (freeCodeCamp)
  ml_advanced:  'tPYj3fFJGjk',  // Deep Learning Crash Course (freeCodeCamp)

  // ── Web Development (HTML/CSS/JS/React/Node) ───────────────────────
  web_intro:    'gracqDKXWwI',  // Full Stack Web Dev for Beginners (freeCodeCamp)
  web_setup:    'hdI2bqOjy3c',  // JavaScript Crash Course (Traversy Media)
  web_core:     'x4rFhThSX04',  // React JS Full Course (freeCodeCamp / Bob Ziroll)
  web_lab:      'Oe421EPjeBE',  // Node.js & Express Full Course (freeCodeCamp / John Smilga)
  web_advanced: 'nu_pCVPKzTk',  // MERN Stack Full Course (freeCodeCamp)

  // ── Python ─────────────────────────────────────────────────────────
  py_intro:     '_uQrJ0TkZlc',  // Python Full Course for Beginners (Programming with Mosh)
  py_setup:     'rfscVS0vtbw',  // Learn Python (freeCodeCamp)
  py_core:      'HGOBQPFzWKo',  // Intermediate Python Programming (freeCodeCamp)
  py_lab:       'LHBE6Q9Xmzg',  // Python Projects for Beginners (freeCodeCamp)
  py_advanced:  'eWRfhZUzrAc',  // Python Backend Web Development (freeCodeCamp)

  // ── Data Structures & Algorithms ───────────────────────────────────
  dsa_intro:    'xwI5OBEnsZU',  // Data Structures & Algorithms Full Course (freeCodeCamp)
  dsa_setup:    'pkYVOmU3MgA',  // Algorithms & Data Structures (freeCodeCamp)
  dsa_core:     'B31LgI4Y4DQ',  // Graph Algorithms for Technical Interviews (freeCodeCamp)
  dsa_lab:      'RBSGKlAvoiM',  // Dynamic Programming – Learn to Solve Algorithmic Problems (freeCodeCamp)
  dsa_advanced: 'HtSuA80QTyo',  // Advanced Algorithms (freeCodeCamp)

  // ── Database / SQL ─────────────────────────────────────────────────
  db_intro:     'HXV3zeQKqGY',  // SQL Full Course (freeCodeCamp)
  db_setup:     'qw--VYLpxG4',  // MySQL Full Course (freeCodeCamp)
  db_core:      'p3qvj9hO_Bo',  // MongoDB Full Course (freeCodeCamp)
  db_lab:       'ExUYNwstNKc',  // SQL Practice (freeCodeCamp)
  db_advanced:  'ofme2o29ngU',  // Database Design (freeCodeCamp / Caleb Curry)

  // ── Generic fallback (always works) ────────────────────────────────
  generic_intro:    'rfscVS0vtbw',  // Learn Python (freeCodeCamp) — safe universal fallback
  generic_setup:    'hdI2bqOjy3c',  // JS Crash Course (Traversy Media)
  generic_core:     'xwI5OBEnsZU',  // DSA Full Course (freeCodeCamp)
  generic_lab:      'gracqDKXWwI',  // Full Stack Web Dev (freeCodeCamp)
  generic_advanced: 'bmmQA8A-yUA',  // ML 2024 (freeCodeCamp)
};

function buildCurriculum(course: typeof ALL_COURSES[0]): Module[] {
  const t = course.title.toLowerCase();

  const isML  = t.includes('machine learning') || t.includes('deep learning') || t.includes('ai') || t.includes('neural');
  const isWeb = t.includes('web') || t.includes('react') || t.includes('node') || t.includes('html') || t.includes('css') || t.includes('javascript') || t.includes('full stack');
  const isPy  = t.includes('python');
  const isDSA = t.includes('data structure') || t.includes('algorithm') || t.includes('dsa');
  const isDB  = t.includes('database') || t.includes('sql') || t.includes('mongodb') || t.includes('mysql');

  // Pick video set based on topic
  const v = isML ? {
    intro: VID.ml_intro, setup: VID.ml_setup, core: VID.ml_core, lab: VID.ml_lab, advanced: VID.ml_advanced,
  } : isWeb ? {
    intro: VID.web_intro, setup: VID.web_setup, core: VID.web_core, lab: VID.web_lab, advanced: VID.web_advanced,
  } : isPy ? {
    intro: VID.py_intro, setup: VID.py_setup, core: VID.py_core, lab: VID.py_lab, advanced: VID.py_advanced,
  } : isDSA ? {
    intro: VID.dsa_intro, setup: VID.dsa_setup, core: VID.dsa_core, lab: VID.dsa_lab, advanced: VID.dsa_advanced,
  } : isDB ? {
    intro: VID.db_intro, setup: VID.db_setup, core: VID.db_core, lab: VID.db_lab, advanced: VID.db_advanced,
  } : {
    intro: VID.generic_intro, setup: VID.generic_setup, core: VID.generic_core, lab: VID.generic_lab, advanced: VID.generic_advanced,
  };

  const genericMCQ = (topic: string): MCQ[] => [
    { q: `Which concept is fundamental to ${topic}?`, opts: ['Abstraction', 'Debugging', 'Compilation', 'Parsing'], answer: 0 },
    { q: 'What does "DRY" stand for in software?', opts: ["Don't Repeat Yourself", 'Dynamic Runtime Yield', 'Default Repository YAML', 'Distributed Runtime YAML'], answer: 0 },
    { q: 'Which data type stores True/False?', opts: ['Boolean', 'Integer', 'Float', 'String'], answer: 0 },
    { q: 'What is the time complexity of binary search?', opts: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], answer: 0 },
    { q: 'Which of these is a version control system?', opts: ['Git', 'Linux', 'Python', 'Docker'], answer: 0 },
  ];

  const mlMCQ: MCQ[] = [
    { q: 'Which algorithm is used for classification?', opts: ['Logistic Regression', 'K-Means', 'DBSCAN', 'PCA'], answer: 0 },
    { q: 'What does overfitting mean?', opts: ['Model memorises training data', 'Model is too simple', 'Model has no parameters', 'None'], answer: 0 },
    { q: 'Which metric is used for regression problems?', opts: ['MSE', 'Accuracy', 'F1-Score', 'ROC-AUC'], answer: 0 },
    { q: 'What is a neural network activation function?', opts: ['ReLU', 'SELECT', 'JOIN', 'MAP'], answer: 0 },
    { q: 'Gradient descent minimises?', opts: ['Loss function', 'Accuracy', 'Recall', 'Precision'], answer: 0 },
  ];

  const webMCQ: MCQ[] = [
    { q: 'What does HTML stand for?', opts: ['HyperText Markup Language', 'HighText Machine Language', 'HyperText Machine Learning', 'None'], answer: 0 },
    { q: 'Which React hook manages state?', opts: ['useState', 'useRef', 'useEffect', 'useContext'], answer: 0 },
    { q: 'REST stands for?', opts: ['Representational State Transfer', 'Remote System Test', 'Real-time Event Stream', 'None'], answer: 0 },
    { q: 'Which HTTP method creates a resource?', opts: ['POST', 'GET', 'DELETE', 'PATCH'], answer: 0 },
    { q: 'CSS Flexbox property to center horizontally?', opts: ['justify-content: center', 'align-items: center', 'display: block', 'float: center'], answer: 0 },
  ];

  const dsaMCQ: MCQ[] = [
    { q: 'Stack follows which principle?', opts: ['LIFO', 'FIFO', 'LILO', 'FILO'], answer: 0 },
    { q: 'Best case of Quick Sort?', opts: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'], answer: 0 },
    { q: 'Binary tree: each node has at most?', opts: ['2 children', '3 children', '1 child', 'Unlimited'], answer: 0 },
    { q: 'BFS uses which data structure?', opts: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 0 },
    { q: 'Dijkstra finds?', opts: ['Shortest path', 'Minimum spanning tree', 'DFS path', 'Topological sort'], answer: 0 },
  ];

  const mcqBank = isML ? mlMCQ : isWeb ? webMCQ : isDSA ? dsaMCQ : genericMCQ(course.subcategory);

  return [
    {
      title: '📦 Module 1 — Foundations',
      lessons: [
        {
          id: 'l1', title: 'Introduction & Course Overview', duration: '12 min',
          type: 'video', free: true,
          videoId: v.intro,
          content: `## Welcome to ${course.title}\n\nIn this module we cover the fundamentals you need to succeed.\n\n### What you'll learn\n- Core concepts of ${course.subcategory}\n- Industry best practices\n- Hands-on examples\n\n### Prerequisites\n- Basic computer knowledge\n- Curiosity and dedication 🚀`,
        },
        {
          id: 'l2', title: 'Setting Up Your Environment', duration: '18 min',
          type: 'video', free: true,
          videoId: v.setup,
          content: `## Environment Setup\n\nA proper setup is critical for smooth learning.\n\n### Tools required\n- Code editor (VS Code recommended)\n- Terminal / Command Prompt\n- Internet connection\n\n### Installation steps\n1. Download VS Code from code.visualstudio.com\n2. Install required extensions\n3. Clone the starter repository`,
        },
        {
          id: 'l3', title: 'Module 1 Quiz', duration: '10 min',
          type: 'quiz', mcqs: mcqBank.slice(0, 3),
        },
      ],
    },
    {
      title: '🔧 Module 2 — Core Concepts',
      lessons: [
        {
          id: 'l4', title: 'Core Theory Deep Dive', duration: '28 min',
          type: 'video',
          videoId: v.core,
          content: `## Core Concepts\n\nThis session dives deep into the technical heart of ${course.title}.\n\n### Key topics\n- Architecture patterns\n- Common algorithms used\n- Real-world industry use cases\n- Performance considerations`,
        },
        {
          id: 'l5', title: 'Reading: Best Practices', duration: '15 min',
          type: 'reading',
          content: `## Industry Best Practices for ${course.subcategory}\n\n### Code Quality\n- Write readable, self-documenting code\n- Follow naming conventions\n- Avoid premature optimisation\n\n### Testing\n- Write unit tests for every function\n- Use TDD (Test Driven Development)\n- Aim for 80%+ code coverage\n\n### Documentation\n- Document public APIs\n- Keep README.md updated\n- Add inline comments for complex logic`,
        },
        {
          id: 'l6', title: 'Hands-on Lab: Build Your First Project', duration: '35 min',
          type: 'video',
          videoId: v.lab,
          content: `## Lab Session\n\nFollow along and build a complete mini-project.\n\n### What we'll build\nA working prototype demonstrating all concepts from Module 2.\n\n### Steps\n1. Project structure setup\n2. Core implementation\n3. Testing & debugging\n4. Deployment`,
        },
        {
          id: 'l7', title: 'Module 2 Assessment', duration: '12 min',
          type: 'quiz', mcqs: mcqBank,
        },
      ],
    },
    {
      title: '🚀 Module 3 — Advanced & Certification',
      lessons: [
        {
          id: 'l8', title: 'Advanced Patterns & Real-world Projects', duration: '40 min',
          type: 'video',
          videoId: v.advanced,
          content: `## Advanced Topics\n\nTake your skills to production level.\n\n### Topics covered\n- Scaling applications\n- Security best practices\n- Performance optimisation\n- Interview preparation tips`,
        },
        {
          id: 'l9', title: 'Reading: Career Guide & Next Steps', duration: '20 min',
          type: 'reading',
          content: `## Career Guide — ${course.subcategory}\n\n### Job Roles\n- Junior Developer / Analyst\n- Full-time at partner companies\n- Freelance consultant\n\n### Salary Range (Tamil Nadu)\n- Entry: ₹3–6 LPA\n- Mid: ₹7–14 LPA\n- Senior: ₹15–30 LPA\n\n### Top Hiring Companies\n- TCS, Infosys, Wipro\n- Zoho, Freshworks\n- Startups in Chennai tech park\n\n### Next Steps\n1. Complete NM certification\n2. Build portfolio on GitHub\n3. Apply via NaanMudhalvan portal`,
        },
        {
          id: 'l10', title: '🏅 Final Certification Exam', duration: '30 min',
          type: 'quiz', mcqs: [...mcqBank, ...mcqBank.slice(0, 3)],
        },
      ],
    },
  ];
}


// ── MCQ Quiz Component ─────────────────────────────────────
function QuizSection({ mcqs, lessonId }: { mcqs: MCQ[]; lessonId: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = Object.entries(answers).filter(([i, a]) => mcqs[+i]?.answer === a).length;

  const reset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HelpCircle size={20} color="#7c3aed" />
        </div>
        <div>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)' }}>Quiz — {mcqs.length} Questions</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Select the best answer for each question</div>
        </div>
      </div>

      {!submitted ? (
        <>
          {mcqs.map((mcq, qi) => (
            <motion.div key={qi} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.06 }}
              style={{ background: 'var(--surface)', borderRadius: 16, padding: '20px 22px', marginBottom: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--text)', marginBottom: 14, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 800, marginRight: 8 }}>Q{qi + 1}.</span>{mcq.q}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mcq.opts.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                    style={{
                      textAlign: 'left', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5,
                      border: `1.5px solid ${answers[qi] === oi ? '#7c3aed' : 'var(--border)'}`,
                      background: answers[qi] === oi ? 'rgba(124,58,237,0.1)' : 'var(--bg-2)',
                      color: answers[qi] === oi ? '#a78bfa' : 'var(--text-2)',
                      fontWeight: answers[qi] === oi ? 600 : 400,
                      transition: 'all 0.15s',
                    }}>
                    <span style={{ fontWeight: 700, marginRight: 8, color: 'var(--text-3)' }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          <button onClick={() => { if (Object.keys(answers).length === mcqs.length) setSubmitted(true); }}
            disabled={Object.keys(answers).length < mcqs.length}
            className="btn btn-primary"
            style={{ padding: '13px 32px', fontSize: 15, borderRadius: 14, opacity: Object.keys(answers).length < mcqs.length ? 0.5 : 1 }}>
            Submit Quiz →
          </button>
          {Object.keys(answers).length < mcqs.length && (
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>Answer all {mcqs.length} questions to submit</div>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          {/* Score card */}
          <div style={{
            background: score >= mcqs.length * 0.7
              ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(52,211,153,0.04))'
              : 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(248,113,113,0.04))',
            border: `1px solid ${score >= mcqs.length * 0.7 ? '#10b98125' : '#ef444425'}`,
            borderRadius: 20, padding: '28px', textAlign: 'center', marginBottom: 24,
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>
              {score >= mcqs.length * 0.7 ? '🎉' : '📚'}
            </div>
            <div className="font-display" style={{ fontSize: 38, fontWeight: 900, color: score >= mcqs.length * 0.7 ? '#10b981' : '#ef4444', lineHeight: 1 }}>
              {score}/{mcqs.length}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginTop: 8 }}>
              {score >= mcqs.length * 0.7 ? '✅ Passed! Great job!' : '❌ Keep practising!'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
              Score: {Math.round((score / mcqs.length) * 100)}% · {score >= mcqs.length * 0.7 ? 'You can proceed to the next lesson' : 'Review the material and try again'}
            </div>
          </div>
          {/* Answer review */}
          {mcqs.map((mcq, qi) => (
            <div key={qi} style={{ background: 'var(--surface)', borderRadius: 14, padding: '16px 20px', marginBottom: 10, border: `1px solid ${answers[qi] === mcq.answer ? '#10b98130' : '#ef444430'}` }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                {answers[qi] === mcq.answer
                  ? <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  : <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0, marginTop: 2 }}>✕</div>}
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{mcq.q}</div>
              </div>
              {answers[qi] !== mcq.answer && (
                <div style={{ fontSize: 12, color: '#10b981', marginLeft: 24 }}>
                  ✓ Correct: {mcq.opts[mcq.answer]}
                </div>
              )}
            </div>
          ))}
          <button onClick={reset} className="btn btn-ghost" style={{ marginTop: 8 }}>
            🔄 Retry Quiz
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ── Smart Video Player with fallback ──────────────────────
function VideoPlayer({ videoId, title }: { videoId: string; title: string }) {
  const [loaded,  setLoaded]  = useState(false);
  const [errored, setErrored] = useState(false);

  // Reset state when video changes
  const [currentId, setCurrentId] = useState(videoId);
  if (currentId !== videoId) { setLoaded(false); setErrored(false); setCurrentId(videoId); }

  if (errored) {
    return (
      <div style={{
        borderRadius: 16, marginBottom: 28, aspectRatio: '16/9',
        background: 'linear-gradient(135deg,#0a0a14,#12121e)',
        border: '1px solid rgba(124,58,237,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 52 }}>📺</div>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', textAlign: 'center', padding: '0 24px' }}>
          Video unavailable in embed mode
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', textAlign: 'center', maxWidth: 320 }}>
          This video can be watched directly on YouTube. Click below to open it in a new tab.
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg,#ff0000,#cc0000)',
            color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(255,0,0,0.3)',
          }}>
          ▶ Watch on YouTube
        </a>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', aspectRatio: '16/9', background: '#000', position: 'relative' }}>
      {/* Loading shimmer */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
          background: 'linear-gradient(135deg,#0a0a14,#12121e)',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: '3px solid rgba(124,58,237,0.2)',
            borderTopColor: '#7c3aed',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Loading video…</div>
        </div>
      )}
      <iframe
        key={videoId}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0&fs=1&cc_load_policy=0`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        style={{ width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </div>
  );
}

// ── Lesson Content Renderer ────────────────────────────────
function LessonContent({ lesson }: { lesson: Lesson }) {
  if (lesson.type === 'quiz' && lesson.mcqs) {
    return <QuizSection mcqs={lesson.mcqs} lessonId={lesson.id} />;
  }

  return (
    <div style={{ maxWidth: 780 }}>
      {/* Video player */}
      {lesson.type === 'video' && lesson.videoId && (
        <VideoPlayer videoId={lesson.videoId} title={lesson.title} />
      )}

      {/* Reading indicator */}
      {lesson.type === 'reading' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 12, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', marginBottom: 24 }}>
          <BookOpen size={16} color="#3b82f6" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>Reading Material — {lesson.duration}</span>
        </div>
      )}

      {/* Markdown-ish content */}
      {lesson.content && (
        <div style={{ color: 'var(--text-2)', lineHeight: 1.85 }}>
          {lesson.content.split('\n').map((line, i) => {
            if (line.startsWith('## '))  return <h2 key={i} className="font-display" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: '24px 0 10px', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '18px 0 8px' }}>{line.slice(4)}</h3>;
            if (line.startsWith('- '))  return <li key={i} style={{ fontSize: 14, marginLeft: 20, marginBottom: 6, color: 'var(--text-2)' }}>{line.slice(2)}</li>;
            if (/^\d+\./.test(line))    return <li key={i} style={{ fontSize: 14, marginLeft: 20, marginBottom: 6, listStyleType: 'decimal', color: 'var(--text-2)' }}>{line.replace(/^\d+\.\s/, '')}</li>;
            if (line.trim() === '')     return <div key={i} style={{ height: 8 }} />;
            return <p key={i} style={{ fontSize: 14, marginBottom: 4, color: 'var(--text-2)' }}>{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Course Viewer ─────────────────────────────────────
export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = ALL_COURSES.find(c => c.id === Number(courseId));
  const [modules, setModules]         = useState<Module[]>([]);
  const [activeLessonId, setActiveLessonId] = useState('l1');
  const [completed, setCompleted]     = useState<Set<string>>(new Set());
  const [expandedMod, setExpandedMod] = useState<number[]>([0]);
  // ── Action states ──
  const [wishlisted, setWishlisted]   = useState(false);
  const [saved,      setSaved]        = useState(false);
  const [showReview, setShowReview]   = useState(false);
  const [rating,     setRating]       = useState(0);
  const [reviewText, setReviewText]   = useState('');
  const [reviewDone, setReviewDone]   = useState(false);

  useEffect(() => {
    if (course) setModules(buildCurriculum(course));
  }, [course]);

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🔍</div>
      <h2 style={{ color: 'var(--text)' }}>Course not found</h2>
      <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
    </div>
  );

  const allLessons = modules.flatMap(m => m.lessons);
  const activeLesson = allLessons.find(l => l.id === activeLessonId) ?? allLessons[0];
  const totalLessons = allLessons.length;
  const progress = Math.round((completed.size / totalLessons) * 100);

  const markComplete = (id: string) => setCompleted(p => new Set([...p, id]));

  const currentIdx = allLessons.findIndex(l => l.id === activeLessonId);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];

  const typeIcon = (t: string) =>
    t === 'video' ? <Play size={13} /> : t === 'quiz' ? <HelpCircle size={13} /> : <FileText size={13} />;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 60, background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 60, zIndex: 50 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="font-display" style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{course.instructor}</div>
        </div>
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 160, height: 6, borderRadius: 999, background: 'var(--border)' }}>
            <div style={{ height: '100%', width: `${progress}%`, borderRadius: 999, background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', transition: 'width 0.5s' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{progress}%</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{completed.size}/{totalLessons}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── Sidebar: lesson list ── */}
        <aside style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--surface)', overflowY: 'auto', height: 'calc(100vh - 120px)', position: 'sticky', top: 120 }}>
          {/* Course info */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-3)' }}>
              <span>⏱ {course.hours}h</span>
              <span>•</span>
              <span><Star size={11} style={{ verticalAlign: 'middle' }} color="#f59e0b" fill="#f59e0b" /> {course.rating}</span>
              <span>•</span>
              <span>{course.level}</span>
            </div>
          </div>

          {/* Modules */}
          {modules.map((mod, mi) => (
            <div key={mi}>
              <button onClick={() => setExpandedMod(p => p.includes(mi) ? p.filter(x => x !== mi) : [...p, mi])}
                style={{ width: '100%', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>{mod.title}</div>
                {expandedMod.includes(mi)
                  ? <ChevronDown size={14} color="var(--text-3)" />
                  : <ChevronRight size={14} color="var(--text-3)" />}
              </button>
              <AnimatePresence>
                {expandedMod.includes(mi) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                    {mod.lessons.map(lesson => (
                      <button key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        style={{
                          width: '100%', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 10,
                          background: activeLessonId === lesson.id ? 'rgba(124,58,237,0.1)' : 'none',
                          border: 'none', borderBottom: '1px solid var(--border)', borderLeft: `3px solid ${activeLessonId === lesson.id ? '#7c3aed' : 'transparent'}`,
                          cursor: 'pointer', textAlign: 'left',
                        }}>
                        <div style={{ flexShrink: 0, color: completed.has(lesson.id) ? '#10b981' : activeLessonId === lesson.id ? '#7c3aed' : 'var(--text-3)' }}>
                          {completed.has(lesson.id) ? <CheckCircle size={14} /> : typeIcon(lesson.type)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: activeLessonId === lesson.id ? 700 : 500, color: activeLessonId === lesson.id ? 'var(--text)' : 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lesson.title}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 1 }}>
                            {lesson.type} · {lesson.duration}
                            {lesson.free && <span style={{ marginLeft: 6, color: '#10b981', fontWeight: 700 }}>FREE</span>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, padding: '32px 40px 80px', minWidth: 0, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeLessonId} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {/* Lesson header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: activeLesson?.type === 'quiz' ? 'rgba(124,58,237,0.12)' : activeLesson?.type === 'reading' ? 'rgba(37,99,235,0.12)' : 'rgba(16,185,129,0.12)', color: activeLesson?.type === 'quiz' ? '#a78bfa' : activeLesson?.type === 'reading' ? '#60a5fa' : '#34d399' }}>
                      {activeLesson?.type?.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      <Clock size={11} style={{ verticalAlign: 'middle' }} /> {activeLesson?.duration}
                    </span>
                  </div>
                  {/* Quick-action buttons */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setWishlisted(w => !w)}
                      title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', border:`1.5px solid ${wishlisted ? '#ef4444' : 'var(--border)'}`, background: wishlisted ? 'rgba(239,68,68,0.08)' : 'var(--surface)', color: wishlisted ? '#ef4444' : 'var(--text-2)', transition:'all 0.15s' }}>
                      <Heart size={13} fill={wishlisted ? '#ef4444' : 'none'} />
                      {wishlisted ? 'Wishlisted' : 'Wishlist'}
                    </button>
                    <button
                      onClick={() => { setSaved(true); }}
                      title="Save to My Courses"
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', border:`1.5px solid ${saved ? '#10b981' : 'var(--border)'}`, background: saved ? 'rgba(16,185,129,0.08)' : 'var(--surface)', color: saved ? '#10b981' : 'var(--text-2)', transition:'all 0.15s' }}>
                      <BookmarkCheck size={13} />
                      {saved ? 'Saved ✓' : 'Save Course'}
                    </button>
                  </div>
                </div>
                <h1 className="font-display" style={{ fontWeight: 800, fontSize: 24, color: 'var(--text)', marginBottom: 4 }}>
                  {activeLesson?.title}
                </h1>
              </div>

              {/* Content */}
              {activeLesson && <LessonContent lesson={activeLesson} />}

              {/* Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <button disabled={!prevLesson} onClick={() => { if (prevLesson) setActiveLessonId(prevLesson.id); }}
                  className="btn btn-ghost"
                  style={{ opacity: prevLesson ? 1 : 0.3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ChevronLeft size={16} /> Previous
                </button>

                <button onClick={() => {
                  markComplete(activeLessonId);
                  if (nextLesson) setActiveLessonId(nextLesson.id);
                }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {completed.has(activeLessonId) ? 'Completed ✓' : 'Mark Complete & Next'}
                  {nextLesson && <ChevronRight size={16} />}
                </button>
              </div>

              {/* Completion banner */}
              {progress === 100 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ marginTop: 32, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.3)' }}>

                  {/* Green header */}
                  <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(52,211,153,0.06))', padding: '32px', textAlign: 'center', borderBottom: '1px solid rgba(16,185,129,0.15)' }}>
                    <div style={{ fontSize: 52, marginBottom: 12 }}>🎓</div>
                    <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Course Completed!</div>
                    <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
                      Congratulations! You've finished <strong>{course.title}</strong>.
                    </p>
                    {/* Action row */}
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Link to="/certificates" className="btn btn-primary" style={{ fontSize: 14, padding: '11px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Award size={15} /> Get Certificate
                      </Link>
                      <button
                        onClick={() => setSaved(true)}
                        className="btn btn-ghost"
                        style={{ fontSize: 14, padding: '11px 24px', display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${saved ? '#10b981' : 'var(--border)'}`, color: saved ? '#10b981' : 'var(--text-2)', background: saved ? 'rgba(16,185,129,0.08)' : 'var(--surface)' }}>
                        <BookmarkCheck size={15} />
                        {saved ? 'Saved to My Courses ✓' : 'Save to My Courses'}
                      </button>
                      <button
                        onClick={() => setShowReview(r => !r)}
                        className="btn btn-ghost"
                        style={{ fontSize: 14, padding: '11px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={15} />
                        {showReview ? 'Hide Review' : 'Write a Review'}
                      </button>
                    </div>
                  </div>

                  {/* Review form */}
                  <AnimatePresence>
                    {showReview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', background: 'var(--surface)', padding: '28px 32px' }}>
                        {!reviewDone ? (
                          <>
                            <h3 className="font-display" style={{ fontWeight: 700, fontSize: 17, color: 'var(--text)', marginBottom: 16 }}>⭐ Rate this Course</h3>
                            {/* Star picker */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
                              {[1,2,3,4,5].map(n => (
                                <button key={n} onClick={() => setRating(n)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                                  <Star size={28}
                                    fill={n <= rating ? '#f59e0b' : 'none'}
                                    color={n <= rating ? '#f59e0b' : 'var(--border-2)'}
                                    strokeWidth={1.5} />
                                </button>
                              ))}
                              {rating > 0 && (
                                <span style={{ fontSize: 13, color: 'var(--text-3)', alignSelf: 'center', marginLeft: 6 }}>
                                  {['','Poor','Fair','Good','Very Good','Excellent'][rating]}
                                </span>
                              )}
                            </div>
                            <textarea
                              className="inp"
                              rows={4}
                              placeholder={`Share what you liked about "${course.title}"…`}
                              value={reviewText}
                              onChange={e => setReviewText(e.target.value)}
                              style={{ resize: 'vertical', marginBottom: 14, lineHeight: 1.7 }}
                            />
                            <button
                              onClick={() => { if (rating > 0) setReviewDone(true); }}
                              disabled={rating === 0}
                              className="btn btn-primary"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', opacity: rating === 0 ? 0.5 : 1 }}>
                              <Send size={14} /> Submit Review
                            </button>
                          </>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '8px 0' }}>
                            <div style={{ fontSize: 40, marginBottom: 10 }}>🙏</div>
                            <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Thank you for your review!</div>
                            <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 8 }}>
                              {[1,2,3,4,5].map(n => (
                                <Star key={n} size={18} fill={n <= rating ? '#f59e0b' : 'none'} color={n <= rating ? '#f59e0b' : 'var(--border-2)'} strokeWidth={1.5} />
                              ))}
                            </div>
                            {reviewText && <p style={{ fontSize: 13.5, color: 'var(--text-2)', fontStyle: 'italic', maxWidth: 440, margin: '0 auto' }}>" {reviewText} "</p>}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
