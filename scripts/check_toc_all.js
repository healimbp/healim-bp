const fs = require('fs');
const path = require('path');
const testConverter = require('./test-converter.js');

const baseDir = path.join(__dirname, '..', 'content', 'column');
const dirs = fs.readdirSync(baseDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(baseDir, d)).isDirectory());

console.log(`Checking TOC for all ${dirs.length} articles...\n`);

dirs.forEach((slug, idx) => {
  const mdPath = path.join(baseDir, slug, 'index.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const res = testConverter.convertMarkdownToTistoryHTML(md, slug);

  // Check TOC
  const tocBoxMatch = res.html.match(/📌 이 칼럼에서 다루는 6대 핵심 목차[\s\S]*?<\/div>\s*<\/div>/i);
  if (!tocBoxMatch) {
    console.error(`[${idx + 1}] ❌ ${slug}: NO TOC BOX FOUND!`);
  } else {
    const tocBox = tocBoxMatch[0];
    const items = tocBox.match(/<div style="display: flex; align-items: flex-start;/g) || [];
    console.log(`[${idx + 1}] ✅ ${slug}: ${items.length} TOC items found.`);
    if (items.length === 0) {
      console.error(`   🚨 EMPTY TOC BOX in ${slug}!`);
      console.log(tocBox);
    }
  }
});
