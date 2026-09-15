const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env if exists
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.trim().split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.argv[2];
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.argv[3];
const TARGET_SLUG = process.argv[4]; // optional: specific slug or 'all'

function sendTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.ok) {
            resolve(json);
          } else {
            // If HTML parse fails, fallback to plain text
            sendPlainTelegramMessage(text).then(resolve).catch(reject);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${responseBody}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function sendPlainTelegramMessage(text) {
  return new Promise((resolve, reject) => {
    // Strip HTML tags for safe fallback
    const plainText = text.replace(/<[^>]*>/g, '');
    const data = JSON.stringify({
      chat_id: CHAT_ID,
      text: plainText,
      disable_web_page_preview: true
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.ok) resolve(json);
          else reject(new Error(`Telegram error: ${json.description}`));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function convertMarkdownToTistoryFormat(mdContent, slug) {
  // Extract frontmatter
  const match = mdContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { title: slug, body: mdContent };

  const frontmatterStr = match[1];
  let bodyStr = match[2];

  // Parse frontmatter fields
  const titleMatch = frontmatterStr.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : slug;

  const categoryMatch = frontmatterStr.match(/category:\s*"([^"]+)"/);
  const category = categoryMatch ? categoryMatch[1] : '건강 칼럼';

  const tagsMatch = frontmatterStr.match(/tags:\s*\[(.*?)\]/);
  let tags = [];
  if (tagsMatch) {
    tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
  }

  // Clean and transform body for Tistory
  // 1. Transform voice-box
  bodyStr = bodyStr.replace(/<div class="voice-box">([\s\S]*?)<\/div>/g, (m, inner) => {
    const lines = inner.match(/<div class="voice-line">(.*?)<\/div>/g) || [];
    return '💬 <b>[환자분들의 실제 고민]</b>\n' + lines.map(l => '• ' + l.replace(/<\/?div[^>]*>/g, '').trim()).join('\n') + '\n';
  });

  // 2. Transform intro-body
  bodyStr = bodyStr.replace(/<div class="intro-body">([\s\S]*?)<\/div>/g, (m, inner) => {
    return inner.replace(/<\/?p>/g, '\n').trim();
  });

  // 3. Transform toc
  bodyStr = bodyStr.replace(/<div class="toc">([\s\S]*?)<\/div>/g, (m, inner) => {
    return '📌 <b>[칼럼 목차]</b>\n' + inner.replace(/<\/?ol>/g, '').replace(/<li>/g, '▫️ ').replace(/<\/li>/g, '').replace(/<div[^>]*>.*?<\/div>/g, '').trim() + '\n';
  });

  // 4. Transform callout-box
  bodyStr = bodyStr.replace(/<div class="callout-box">([\s\S]*?)<\/div>/g, (m, inner) => {
    return '\n━━━━━━━━━━━━━━━━━━━━\n🏥 <b>해아림한의원 부평점 통합진료센터</b>\n• 위치: 부평역 7번 출구 도보 1분 (그랑프리빌딩 7층)\n• 진료: 월·수·금 야간진료 (09:30~20:00) | 화·목 (09:30~19:00) | 토 (09:30~15:00)\n• 예약/문의: 032-719-3472 | 네이버 예약 가능\n━━━━━━━━━━━━━━━━━━━━\n';
  });

  // 5. Clean markdown headers and markdown tables
  bodyStr = bodyStr.replace(/^###\s*(.*$)/gim, '\n<b>■ $1</b>\n');
  bodyStr = bodyStr.replace(/^##\s*(.*$)/gim, '\n<b>◆ $1</b>\n');
  bodyStr = bodyStr.replace(/^#\s*(.*$)/gim, '\n<b>[ $1 ]</b>\n');

  // Convert markdown bold **text** to <b>text</b>
  bodyStr = bodyStr.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // Clean excessive line breaks
  bodyStr = bodyStr.replace(/\n{3,}/g, '\n\n').trim();

  const formattedHeader = `📢 <b>[티스토리 포스팅용 칼럼]</b>\n` +
    `📂 <b>카테고리:</b> ${category}\n` +
    `🏷️ <b>태그:</b> ${tags.map(t => '#' + t).join(' ')}\n\n` +
    `📝 <b>제목:</b> ${title}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n`;

  const formattedFooter = `\n\n🔗 <b>원문 링크:</b> https://healim-bp.com/column/${slug}/\n` +
    `📌 <i>티스토리 글쓰기 에디터에 위 내용을 복사하여 등록하세요.</i>`;

  return {
    title,
    category,
    tags,
    fullMessage: formattedHeader + bodyStr + formattedFooter
  };
}

async function run() {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error(`
❌ 텔레그램 봇 토큰 또는 Chat ID가 설정되지 않았습니다.

사용 방법:
1) 명령어로 직접 실행:
   node scripts/send-to-telegram.js <BOT_TOKEN> <CHAT_ID> [slug 또는 all]

2) .env 파일에 설정 후 실행:
   TELEGRAM_BOT_TOKEN=123456789:ABCdef...
   TELEGRAM_CHAT_ID=12345678

   실행: node scripts/send-to-telegram.js
    `);
    process.exit(1);
  }

  const baseDir = path.join(__dirname, '..', 'content', 'column');
  const dirs = fs.readdirSync(baseDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(baseDir, d)).isDirectory());

  let targetDirs = dirs;
  if (TARGET_SLUG && TARGET_SLUG !== 'all') {
    targetDirs = dirs.filter(d => d.includes(TARGET_SLUG));
    if (targetDirs.length === 0) {
      console.error(`❌ '${TARGET_SLUG}'에 해당하는 칼럼을 찾을 수 없습니다.`);
      process.exit(1);
    }
  }

  console.log(`🚀 총 ${targetDirs.length}개 칼럼을 텔레그램으로 전송합니다... (Chat ID: ${CHAT_ID})\n`);

  for (let i = 0; i < targetDirs.length; i++) {
    const slug = targetDirs[i];
    const mdPath = path.join(baseDir, slug, 'index.md');
    if (!fs.existsSync(mdPath)) continue;

    const md = fs.readFileSync(mdPath, 'utf8');
    const { title, fullMessage } = convertMarkdownToTistoryFormat(md, slug);

    console.log(`[${i + 1}/${targetDirs.length}] 전송 중: ${title}`);

    try {
      // Split if message length exceeds 3800 chars (Telegram limit is 4096)
      if (fullMessage.length > 3800) {
        const parts = splitMessage(fullMessage, 3800);
        for (let p = 0; p < parts.length; p++) {
          await sendTelegramMessage(`[${p + 1}/${parts.length}]\n` + parts[p]);
          await sleep(1000);
        }
      } else {
        await sendTelegramMessage(fullMessage);
      }
      console.log(`   ✅ 전송 완료!`);
      // Wait 1.5s between posts to prevent Telegram 429 rate limit
      await sleep(1500);
    } catch (err) {
      console.error(`   ❌ 전송 실패 (${slug}):`, err.message);
    }
  }

  console.log(`\n🎉 모든 칼럼 전송 작업이 완료되었습니다!`);
}

function splitMessage(str, maxLen) {
  const parts = [];
  let remaining = str;
  while (remaining.length > maxLen) {
    let splitIdx = remaining.lastIndexOf('\n\n', maxLen);
    if (splitIdx === -1) splitIdx = remaining.lastIndexOf('\n', maxLen);
    if (splitIdx === -1) splitIdx = maxLen;
    parts.push(remaining.substring(0, splitIdx).trim());
    remaining = remaining.substring(splitIdx).trim();
  }
  if (remaining.length > 0) parts.push(remaining);
  return parts;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run();
