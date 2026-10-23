const fs = require('fs');
let t = fs.readFileSync('src/pages/ExamPortalPage.tsx', 'utf8');

// The emoji are stored as JS string chars with Windows-1252 code points
// 0xF0 0x178 0x201C = ð Ÿ " etc.
// Map exact char sequences to proper emoji
const fixes = [
  // 📍 pin: F0 + 178 + 201C + 8D
  ['\uF0\u0178\u201C\u008D', '📍'],   // ðŸ"  → 📍
  // 📅 calendar: F0 + 178 + 201C + 2026
  ['\uF0\u0178\u201C\u2026', '📅'],   // ðŸ"… → 📅
  // 📞 phone: F0 + 178 + 201C + 17E
  ['\uF0\u0178\u201C\u017E', '📞'],   // ðŸ"ž → 📞
  // 🌐 globe: F0 + 178 + 152 + 90
  ['\uF0\u0178\u0152\u0090', '🌐'],   // ðŸŒ  → 🌐
  // 🌍 globe-americas: F0 + 178 + 152 + 8D (seen in L845)
  ['\uF0\u0178\u0152\u008D', '🌐'],
  // 🆓 free: F0 + 178 + 2020 + 201C
  ['\uF0\u0178\u2020\u201C', '🆓'],   // ðŸ†" → 🆓
  // 🔍 search/magnify: F0 + 178 + 201D + 8D
  ['\uF0\u0178\u201D\u008D', '🔍'],   // ðŸ"  → 🔍
  // ⚠️ warning: E2 + 161 + A0 + EF B8 8F
  ['\u00E2\u0161\u00A0\u00EF\u00B8\u008F', '⚠️'],
  ['\u00E2\u0161\u00A0', '⚠️'],
  // ✓ check: E2 + 153 + 201C
  ['\u00E2\u0153\u201C', '✓'],
  // → arrow right: E2 + 2020 + 2019
  ['\u00E2\u2020\u2019', '→'],
  ['\u00E2\u0086\u0092', '→'],
];

let count = 0;
for (const [from, to] of fixes) {
  const before = t.length;
  t = t.split(from).join(to);
  if (t.length !== before) { console.log(`Replaced "${from.split('').map(c=>c.codePointAt(0).toString(16)).join(' ')}" → ${to}`); count++; }
}

// Also fix the em-dash that converted to "" (double-quote replacement artifact)
t = t.split('""').join('—');
// Fix any remaining Â· that slipped through
t = t.split('\u00C2\u00B7').join('·');

fs.writeFileSync('src/pages/ExamPortalPage.tsx', t, 'utf8');
console.log(`\nApplied ${count} targeted fixes.`);

// Final spot check
const lines = t.split('\n');
[93, 300, 310, 313, 317, 337, 358, 482, 607, 638, 845, 871, 1015].forEach(n => {
  if (lines[n-1]) console.log('L'+n+':', lines[n-1].trim().substring(0,100));
});
