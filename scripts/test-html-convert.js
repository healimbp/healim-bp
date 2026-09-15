const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'content', 'column', 'ankle-sprain-ligament-chuna', 'index.md');
const md = fs.readFileSync(mdPath, 'utf8');

function formatCleanLists(content) {
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1E4638; font-weight: 700;">$1</strong>');
  content = content.replace(/\[(.*?)\]/g, '<strong style="color: #1E4638; font-weight: 700;">$1</strong>');

  // Replace numbered lists
  content = content.replace(/^(\d+)\.\s+(.*)$/gm, (match, num, text) => {
    return `<li style="position: relative; padding-left: 22px; margin-bottom: 10px; font-size: 15.5px; line-height: 1.8; color: #374151; font-style: normal;"><span style="position: absolute; left: 6px; top: 10px; width: 6px; height: 6px; background-color: #2F5D50; border-radius: 50%; display: inline-block;"></span>${text.trim()}</li>`;
  });

  // Replace unordered lists
  content = content.replace(/^(?:-|\*)\s+(.*)$/gm, (match, text) => {
    return `<li style="position: relative; padding-left: 22px; margin-bottom: 10px; font-size: 15.5px; line-height: 1.8; color: #374151; font-style: normal;"><span style="position: absolute; left: 6px; top: 10px; width: 6px; height: 6px; background-color: #2F5D50; border-radius: 50%; display: inline-block;"></span>${text.trim()}</li>`;
  });

  // Wrap contiguous <li>
  content = content.replace(/((?:<li style="position: relative;[\s\S]*?<\/li>\r?\n?)+)/g, (match) => {
    return `\n<ul style="list-style-type: none; padding-left: 0; margin: 18px 0; font-style: normal;">\n${match.trim()}\n</ul>\n`;
  });

  return content;
}

function formatFAQSection(content) {
  content = content.replace(/<div class="callout-box">[\s\S]*$/g, '');
  content = content.replace(/🏥[\s\S]*$/g, '');
  content = content.replace(/증상은 몸이 보내는 쉼과 치유의 절박한 신호입니다[\s\S]*$/g, '');

  const qnaBlocks = [];
  const lines = content.split('\n');
  let currentQ = '';
  let currentA = [];

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    if (line.startsWith('---') || line.startsWith('<div')) return;

    if (line.match(/^\*?\*?Q\d*\.?\s*/i)) {
      if (currentQ) {
        qnaBlocks.push({ q: currentQ, a: currentA.join(' ') });
      }
      currentQ = line.replace(/^\*?\*?Q\d*\.?\s*/i, '').replace(/\*?\*?$/g, '').trim();
      currentA = [];
    } else {
      if (currentQ) {
        const cleanLine = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1E4638; font-weight: 700;">$1</strong>');
        currentA.push(cleanLine);
      }
    }
  });

  if (currentQ) {
    qnaBlocks.push({ q: currentQ, a: currentA.join(' ') });
  }

  let html = '<div style="margin: 24px 0;">\n';
  qnaBlocks.forEach((item, idx) => {
    const qNum = `Q${idx + 1}`;
    html += `  <div style="background-color: #F9FAF8; border: 1px solid #E2EAE5; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); font-style: normal;">
    <div style="font-size: 15.5px; font-weight: 800; color: #1E4638; display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; font-style: normal;">
      <span style="background-color: #2F5D50; color: #ffffff; font-size: 12px; font-weight: bold; padding: 3px 8px; border-radius: 6px; display: inline-block; flex-shrink: 0; margin-right: 6px;">${qNum}</span>
      <span>${item.q}</span>
    </div>
    <p style="font-size: 14.5px; line-height: 1.85; color: #4E6159; margin: 0; padding-left: 36px; word-break: keep-all; font-style: normal;">
      ${item.a}
    </p>
  </div>\n`;
  });
  html += '</div>';
  return html;
}

// Strip callout box
let bodyStr = md.replace(/^---[\s\S]*?---\s*/, '');
bodyStr = bodyStr.replace(/<div class="callout-box">[\s\S]*$/g, '');

const sections = bodyStr.split(/\n(?=###\s+)/);
sections.forEach(sec => {
  if (sec.includes('FAQ')) {
    console.log('--- FAQ OUTPUT ---');
    console.log(formatFAQSection(sec));
  } else if (sec.includes('02.')) {
    console.log('--- SECTION 02 OUTPUT ---');
    console.log(formatCleanLists(sec));
  }
});
