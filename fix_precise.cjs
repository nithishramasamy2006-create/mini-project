const fs = require('fs');
let t = fs.readFileSync('src/pages/ExamPortalPage.tsx', 'utf8');

// Precise string replacements — all visible garbled sequences mapped to correct chars
const map = [
  // Box-drawing separators (in comments)
  ['â\x80\x94', '─'],   // â"€ → ─  (U+2500 BOX DRAWINGS LIGHT HORIZONTAL)
  ['â"€', '─'],
  // em-dash
  ['â€"', '–'],
  ['â€\x93', '–'],
  // Arrows
  ['â†\x92', '→'],
  ['â†\x97', '↗'],
  ['â†'', '→'],
  ['â†—', '↗'],
  // Middle dot / bullet
  ['Â·', '·'],
  ['â€¢', '•'],
  // Ellipsis
  ['â€¦', '…'],
  // Check marks
  ['âœ"', '✓'],
  ['âœ…', '✅'],
  // Hourglass
  ['â³', '⏳'],
  // Clock
  ['â°', '⏰'],
  ['â±\uFE0F', '⏱️'],
  ['â±ï¸', '⏱️'],
  ['â±', '⏱'],
  // Lightning / warning
  ['âš¡', '⚡'],
  ['âš \uFE0F', '⚠️'],
  ['âš ï¸', '⚠️'],
  ['âš ', '⚠'],
  // Emoji 4-byte mojibake
  ['ðŸ"‹', '📋'],   // clipboard
  ['ðŸŒ\x90', '🌐'], // globe
  ['ðŸŒ ', '🌐'],
  ['ðŸŒ', '🌐'],
  ['ðŸ"\x8d', '📍'], // pin
  ['ðŸ"', '📍'],
  ['ðŸ†"', '🆓'],   // free
  ['ðŸ†\x93', '🆓'],
  ['ðŸ…', '🏅'],   // medal
  ['ðŸ\x8f\x85', '🏅'],
  ['ðŸŽŸ\uFE0F', '🎟️'], // ticket
  ['ðŸŽŸ', '🎟'],
  ['ðŸ"…', '📅'],   // calendar
  ['ðŸ"\x85', '📅'],
  ['ðŸ"Ž', '🔎'],   // magnifying glass right
  ['ðŸ"\x8e', '🔎'],
  ['ðŸ'³', '💳'],   // credit card
  ['ðŸ\x92\xb3', '💳'],
  ['ðŸ"ž', '📞'],   // phone
  ['ðŸ"\x9e', '📞'],
  ['ðŸ"', '🔍'],   // magnifying glass (generic - keep last)
  ['ðŸ"\x8d', '📍'],
];

for (const [from, to] of map) {
  t = t.split(from).join(to);
}

fs.writeFileSync('src/pages/ExamPortalPage.tsx', t, 'utf8');
console.log('Done. Spot-checking key lines:');
const lines = t.split('\n');
[93,300,301,302,310,313,317,337,358,482,502,607,638,639,845,871].forEach(n => {
  console.log('L'+n+':', lines[n-1].trim().substring(0,90));
});
