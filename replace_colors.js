const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds (style.css only)
  content = content.replace(/--bg-primary:\s*#07050f;/g, '--bg-primary:    #09090b;');
  content = content.replace(/--bg-secondary:\s*#0d0b1a;/g, '--bg-secondary:  #18181b;');
  content = content.replace(/--bg-card:\s*#110f22;/g, '--bg-card:       #27272a;');
  content = content.replace(/--bg-card-hover:\s*#181530;/g, '--bg-card-hover: #3f3f46;');

  // Base variable renaming (style.css)
  content = content.replace(/--purple-1:\s*#a855f7;/g, '--accent-1: #06b6d4;');
  content = content.replace(/--purple-2:\s*#7c3aed;/g, '--accent-2: #0891b2;');
  content = content.replace(/--purple-3:\s*#6d28d9;/g, '--accent-3: #0e7490;');
  content = content.replace(/--purple-4:\s*#4c1d95;/g, '--accent-4: #155e75;');
  content = content.replace(/--purple-light:\s*#c084fc;/g, '--accent-light: #22d3ee;');
  content = content.replace(/--purple-glow:\s*rgba\(168,85,247,0\.18\);/g, '--accent-glow:  rgba(6,182,212,0.18);');

  // Text colors
  content = content.replace(/--text-primary:\s*#f1eeff;/g, '--text-primary:   #fafafa;');
  content = content.replace(/--text-secondary:\s*#a89cc8;/g, '--text-secondary: #a1a1aa;');
  content = content.replace(/--text-muted:\s*#6b5f8a;/g, '--text-muted:     #71717a;');

  // Broad Replacements
  // 1. Variable usages
  content = content.replace(/var\(--purple-/g, 'var(--accent-');
  content = content.replace(/--purple-/g, '--accent-');
  
  // 2. RGB Replacements for all rgba(...) usages across css and js
  content = content.replace(/rgba\(\s*168\s*,\s*85\s*,\s*247/g, 'rgba(6, 182, 212');
  content = content.replace(/rgba\(\s*124\s*,\s*58\s*,\s*237/g, 'rgba(8, 145, 178');
  content = content.replace(/rgba\(\s*76\s*,\s*29\s*,\s*149/g, 'rgba(21, 94, 117'); // purple-4 rgb
  
  // 3. Hex code replacements (for gradients and other hardcoded values)
  content = content.replace(/#a855f7/gi, '#06b6d4');
  content = content.replace(/#c084fc/gi, '#22d3ee');
  content = content.replace(/#7c3aed/gi, '#0891b2');
  content = content.replace(/#6d28d9/gi, '#0e7490');
  content = content.replace(/#4c1d95/gi, '#155e75');
  
  // 4. Background gradients hardcoded
  content = content.replace(/rgba\(7,\s*5,\s*15,/gi, 'rgba(9, 9, 11,');

  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('style.css');
replaceInFile('script.js');
replaceInFile('index.html');
console.log('Done replacing colors.');
