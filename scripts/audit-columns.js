const fs = require('fs');
const path = require('path');

const cols = fs.readdirSync('content/column').filter(f => f !== '_index.md');
const history = JSON.parse(fs.readFileSync('data/publish-history.json', 'utf8'));

console.log(`Total column folders: ${cols.length}`);
console.log(`Already published (sent): ${history.sentSlugs.length}`);
console.log('--------------------------------------------------');

const scheduled = [];
const published = [];

cols.forEach(slug => {
  const file = path.join('content/column', slug, 'index.md');
  if (fs.existsSync(file)) {
    const text = fs.readFileSync(file, 'utf8');
    const tm = text.match(/title:\s*["']?([^"'\r\n]+)["']?/);
    const dm = text.match(/date:\s*([^\r\n]+)/);
    const item = {
      slug,
      date: dm ? dm[1].trim() : '',
      title: tm ? tm[1].trim() : ''
    };
    if (history.sentSlugs.includes(slug)) {
      published.push(item);
    } else {
      scheduled.push(item);
    }
  }
});

console.log('=== [1] ALREADY PUBLISHED ON TISTORY (7개 - 재전송 제외됨) ===');
published.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.slug}] ${item.title}`);
});

console.log('\n=== [2] SCHEDULED FUTURE BROADCASTS (22개) ===');
scheduled.sort((a, b) => a.date.localeCompare(b.date));
scheduled.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.date}] [${item.slug}] ${item.title}`);
});
