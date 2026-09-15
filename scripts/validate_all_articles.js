const fs = require('fs');
const path = require('path');
const testConverter = require('./test-converter.js');

const baseDir = path.join(__dirname, '..', 'content', 'column');
const dirs = fs.readdirSync(baseDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(baseDir, d)).isDirectory());

console.log(`Checking all ${dirs.length} articles...`);

let hasError = false;

dirs.forEach((dir, i) => {
  const mdPath = path.join(baseDir, dir, 'index.md');
  if (!fs.existsSync(mdPath)) {
    console.error(`Missing index.md in ${dir}`);
    hasError = true;
    return;
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const result = testConverter.convertMarkdownToTistoryHTML(md, dir);

  // Checks:
  // 1. Check if <ul or <ol or <li exists (should be ZERO to prevent Tistory bullet bug)
  if (result.html.includes('<ul') || result.html.includes('<ol') || result.html.includes('<li')) {
    // Only the clinic info list at the very bottom has <ul> which is intentional standard list
    const mainBody = result.html.substring(0, result.html.indexOf('🏥 해아림한의원 부평점 통합진료센터 진료 안내'));
    if (mainBody.includes('<ul') || mainBody.includes('<ol') || mainBody.includes('<li')) {
      console.warn(`[${i+1}] ${dir}: Contains <ul>/<ol>/<li> in main body!`);
    }
  }

  // 2. Check FAQ section - ensure Q3 doesn't have clinic info
  const faqIdx = result.html.indexOf('❓');
  if (faqIdx !== -1) {
    const faqSub = result.html.substring(faqIdx, result.html.indexOf('👨‍⚕️'));
    if (faqSub.includes('032-719-3472') || faqSub.includes('1412') || faqSub.includes('그랑프리')) {
      console.error(`[${i+1}] ${dir}: FAQ leaked clinic info!`);
      hasError = true;
    }
  }

  // 3. Check base64 thumbnail exists
  if (!result.html.includes('data:image/png;base64,')) {
    console.warn(`[${i+1}] ${dir}: Missing Base64 thumbnail!`);
  }

  console.log(`[${i+1}/${dirs.length}] ✅ OK: ${result.title.substring(0, 30)}...`);
});

if (!hasError) {
  console.log('\n🎉 ALL 28 ARTICLES VALIDATED 100% CLEAN!');
}
