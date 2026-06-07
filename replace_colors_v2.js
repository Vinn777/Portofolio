const fs = require('fs');

const files = ['style.css', 'index.html', 'script.js'];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace hex colors
  // #06b6d4 -> #10b981
  // #0891b2 -> #059669
  // #22d3ee -> #34d399
  // #00f2fe -> #a7f3d0 (loader highlight)
  
  content = content.replace(/#06b6d4/ig, '#10b981');
  content = content.replace(/#0891b2/ig, '#059669');
  content = content.replace(/#22d3ee/ig, '#34d399');
  content = content.replace(/#00f2fe/ig, '#a7f3d0');
  
  // Replace RGB strings
  // 6, 182, 212 -> 16, 185, 129
  content = content.replace(/6,\s*182,\s*212/g, '16, 185, 129');
  
  // 8, 145, 178 -> 5, 150, 105
  content = content.replace(/8,\s*145,\s*178/g, '5, 150, 105');
  
  // Replace base background
  // #09090b -> #0B1120
  content = content.replace(/#09090b/ig, '#0B1120');
  // #18181b -> #0F172A
  content = content.replace(/#18181b/ig, '#0F172A');
  // 9, 9, 11 -> 11, 17, 32
  content = content.replace(/9,\s*9,\s*11/g, '11, 17, 32');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Replaced colors in ${file}`);
});
