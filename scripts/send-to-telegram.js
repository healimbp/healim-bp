const fs = require('fs');
const path = require('path');
const https = require('https');
const { convertMarkdownToTistoryHTML } = require('./test-converter');

// Load .env
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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8714560419:AAGq9Ufb2jLTKVUGQFdW4Rb574oGNYZCq30';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '2026055528';
const TARGET_SLUG = process.argv[2] && !process.argv[2].startsWith('-') ? process.argv[2] : 'all';

function sendTelegramMessage(text, parseMode = 'HTML') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: parseMode,
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
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.ok) resolve(json);
          else reject(new Error(json.description || body));
        } catch (e) {
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function sendTelegramPhoto(imagePath, caption = '') {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(imagePath)) {
      return reject(new Error(`Image file not found: ${imagePath}`));
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\r\n';

    let header = `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="chat_id"${crlf}${crlf}${CHAT_ID}${crlf}`;
    header += `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="caption"${crlf}${crlf}${caption}${crlf}`;
    header += `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="parse_mode"${crlf}${crlf}HTML${crlf}`;
    header += `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="photo"; filename="${path.basename(imagePath)}"${crlf}`;
    header += `Content-Type: image/png${crlf}${crlf}`;

    const footer = `${crlf}--${boundary}--${crlf}`;

    const payload = Buffer.concat([
      Buffer.from(header, 'utf8'),
      imageBuffer,
      Buffer.from(footer, 'utf8')
    ]);

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendPhoto`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.ok) resolve(json);
          else reject(new Error(json.description || body));
        } catch (e) {
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function sendTelegramDocument(fileName, fileContent, caption = '') {
  return new Promise((resolve, reject) => {
    const fileBuffer = Buffer.from(fileContent, 'utf8');
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\r\n';

    let header = `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="chat_id"${crlf}${crlf}${CHAT_ID}${crlf}`;
    header += `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="caption"${crlf}${crlf}${caption}${crlf}`;
    header += `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="document"; filename="${fileName}"${crlf}`;
    header += `Content-Type: text/html; charset=utf-8${crlf}${crlf}`;

    const footer = `${crlf}--${boundary}--${crlf}`;

    const payload = Buffer.concat([
      Buffer.from(header, 'utf8'),
      fileBuffer,
      Buffer.from(footer, 'utf8')
    ]);

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${BOT_TOKEN}/sendDocument`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.ok) resolve(json);
          else reject(new Error(json.description || body));
        } catch (e) {
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('❌ Bot Token 또는 Chat ID가 설정되지 않았습니다.');
    process.exit(1);
  }

  const baseDir = path.join(__dirname, '..', 'content', 'column');
  const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');
  const dirs = fs.readdirSync(baseDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(baseDir, d)).isDirectory());

  let targetDirs = dirs;
  if (TARGET_SLUG && TARGET_SLUG !== 'all') {
    targetDirs = dirs.filter(d => d.includes(TARGET_SLUG));
    if (targetDirs.length === 0) {
      console.error(`❌ '${TARGET_SLUG}' 칼럼을 찾을 수 없습니다.`);
      process.exit(1);
    }
  }

  // If publishing already-published posts or specified targets
  console.log(`🚀 총 ${targetDirs.length}개 칼럼을 완벽하게 다듬어진 티스토리 46번 서식 HTML 파일로 텔레그램에 전송합니다... (Chat ID: ${CHAT_ID})\n`);

  for (let i = 0; i < targetDirs.length; i++) {
    const slug = targetDirs[i];
    const mdPath = path.join(baseDir, slug, 'index.md');
    if (!fs.existsSync(mdPath)) continue;

    const md = fs.readFileSync(mdPath, 'utf8');
    const { title, category, tags, html } = convertMarkdownToTistoryHTML(md, slug);
    const thumbPath = path.join(thumbsDir, `${slug}.png`);

    console.log(`[${i + 1}/${targetDirs.length}] 전송 중: ${title}`);

    try {
      // 1. Send Main Representative Thumbnail Image with Caption
      const photoCaption = `🖼️ <b>[대표 썸네일] #${i + 1}</b>\n\n` +
        `📝 <b>제목:</b> <code>${title}</code>\n` +
        `📂 <b>카테고리:</b> ${category}\n` +
        `🏷️ <b>태그:</b> <code>${tags.join(', ')}</code>`;

      if (fs.existsSync(thumbPath)) {
        await sendTelegramPhoto(thumbPath, photoCaption);
      } else {
        await sendTelegramMessage(photoCaption);
      }
      await sleep(1000);

      // 2. Send as HTML document attachment
      const fileName = `${slug}.html`;
      await sendTelegramDocument(fileName, html, `📄 ${title}\n(진료시간 수정 완료 티스토리 HTML 서식)`);
      console.log(`   ✅ 완벽한 카드 썸네일 사진 + 진료시간 수정된 티스토리 46번 서식 HTML 파일 전송 완료!`);

      await sleep(1500);
    } catch (err) {
      console.error(`   ❌ 전송 실패 (${slug}):`, err.message);
    }
  }

  console.log(`\n🎉 모든 ${targetDirs.length}개 칼럼이 완벽한 카드 썸네일 및 무결점 티스토리 46번 서식으로 전송되었습니다!`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run();
