const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'content', 'column');
const dirs = fs.readdirSync(dir).filter(d => !d.startsWith('_') && fs.statSync(path.join(dir, d)).isDirectory());

const summary = dirs.map(slug => {
  const content = fs.readFileSync(path.join(dir, slug, 'index.md'), 'utf8');
  const titleMatch = content.match(/title:\s*["']?([^"'\r\n]+)["']?/);
  const catMatch = content.match(/category:\s*["']?([^"'\r\n]+)["']?/);
  const descMatch = content.match(/description:\s*["']?([^"'\r\n]+)["']?/);
  
  // Extract first 3 H3 headings or sections
  const h3s = (content.match(/^###\s+([^\r\n]+)/gm) || []).map(h => h.replace(/^###\s+/, '').trim());

  return {
    slug,
    title: titleMatch ? titleMatch[1] : '',
    category: catMatch ? catMatch[1] : '',
    desc: descMatch ? descMatch[1] : '',
    h3s
  };
});

fs.writeFileSync(path.join(__dirname, 'columns_summary.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log('Successfully extracted', summary.length, 'columns to columns_summary.json');
