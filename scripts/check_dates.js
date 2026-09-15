const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'content', 'column');
const dirs = fs.readdirSync(base).filter(d => !d.startsWith('_') && fs.statSync(path.join(base, d)).isDirectory());

const list = dirs.map(s => {
  const md = fs.readFileSync(path.join(base, s, 'index.md'), 'utf8');
  const t = (md.match(/title:\s*"([^"]+)"/) || [])[1] || '';
  const d = (md.match(/date:\s*([^\r\n]+)/) || [])[1] || '';
  const c = (md.match(/category:\s*"([^"]+)"/) || [])[1] || '';
  return { slug: s, title: t, date: d, category: c };
});

console.log('Total articles:', list.length);
list.sort((a, b) => a.date.localeCompare(b.date));
list.forEach((item, idx) => {
  console.log(`[${idx + 1}] ${item.date} | [${item.category}] ${item.slug}`);
});
