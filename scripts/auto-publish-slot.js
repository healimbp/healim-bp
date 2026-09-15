const fs = require('fs');
const path = require('path');
const https = require('https');
const { Resvg } = require('@resvg/resvg-js');
const { generateCleanCardSVG } = require('./exact-thumbnail-builder');
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

// CLI args
const args = process.argv.slice(2);
const forceFlag = args.includes('--force');
const allFlag = args.includes('--all');
const slugArgIdx = args.indexOf('--slug');
const targetSlug = slugArgIdx !== -1 ? args[slugArgIdx + 1] : (args[0] && !args[0].startsWith('-') ? args[0] : null);

// History file to prevent duplicate telegram sends
const historyFile = path.join(__dirname, '..', 'data', 'publish-history.json');
function getHistory() {
  if (fs.existsSync(historyFile)) {
    try {
      return JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    } catch (e) {
      return { sentSlugs: [] };
    }
  }
  return { sentSlugs: [] };
}

function recordSent(slug) {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const hist = getHistory();
  if (!hist.sentSlugs.includes(slug)) {
    hist.sentSlugs.push(slug);
    fs.writeFileSync(historyFile, JSON.stringify(hist, null, 2), 'utf8');
  }
}

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
      Buffer.from(fileContent, 'utf8'),
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

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function publishColumn(targetCol) {
  const { slug, md, dateStr } = targetCol;
  const { title, category, tags, html } = convertMarkdownToTistoryHTML(md, slug);
  const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');
  const thumbPath = path.join(thumbsDir, `${slug}.png`);

  console.log(`\n🚀 [발행 처리 시작] "${title}" (${slug})`);

  // Ensure thumbnail exists
  if (!fs.existsSync(thumbPath)) {
    console.log(`🖼️ 1080x1080 카드 썸네일 생성 중: ${slug}.png`);
    const svg = generateCleanCardSVG({
      title,
      category
    });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } });
    fs.writeFileSync(thumbPath, resvg.render().asPng());
  }

  const photoCaption = `🌟 <b>[해아림 정기 자동발행]</b>\n\n` +
    `📝 <b>제목:</b> <code>${title}</code>\n` +
    `📂 <b>카테고리:</b> ${category}\n` +
    `📅 <b>발행일시:</b> <code>${dateStr}</code>\n` +
    `🏷️ <b>태그:</b> <code>${tags.join(', ')}</code>\n\n` +
    `🌐 <b>공식 사이트:</b> https://healim-bp.com/column/${slug}/\n` +
    `📄 <i>아래 전송되는 HTML 파일을 복사하여 티스토리에 그대로 붙여넣으시면 됩니다.</i>`;

  if (fs.existsSync(thumbPath)) {
    await sendTelegramPhoto(thumbPath, photoCaption);
  } else {
    await sendTelegramMessage(photoCaption);
  }

  await sleep(1000);

  const fileName = `${slug}.html`;
  await sendTelegramDocument(fileName, html, `📄 ${title} (티스토리 46번 서식 복사용)`);

  recordSent(slug);
  console.log(`✅ [발행 및 텔레그램 전송 완료] "${title}"`);
}

async function autoPublishCurrentSlot() {
  const baseDir = path.join(__dirname, '..', 'content', 'column');
  const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');

  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
  }

  const dirs = fs.readdirSync(baseDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(baseDir, d)).isDirectory());
  const now = new Date();
  const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  const kstDateStr = kstNow.toISOString().slice(0, 10);
  const kstHour = kstNow.getUTCHours(); // KST hour

  console.log(`⏰ [정기 자동발행 시스템 가동] 현재 KST 일시: ${kstDateStr} ${String(kstHour).padStart(2, '0')}:${String(kstNow.getUTCMinutes()).padStart(2, '0')}`);

  // Gather all columns
  const allColumns = [];
  dirs.forEach(slug => {
    const mdPath = path.join(baseDir, slug, 'index.md');
    if (!fs.existsSync(mdPath)) return;

    const md = fs.readFileSync(mdPath, 'utf8');
    const dateMatch = md.match(/date:\s*([^\r\n]+)/);
    if (!dateMatch) return;

    const dateStr = dateMatch[1].trim();
    const postDate = new Date(dateStr);
    allColumns.push({
      slug,
      md,
      postDate,
      dateStr
    });
  });

  allColumns.sort((a, b) => a.postDate - b.postDate);

  if (allFlag) {
    console.log(`📦 [전체 발행 모드] 총 ${allColumns.length}개 칼럼을 순차 발송합니다...`);
    for (const col of allColumns) {
      await publishColumn(col);
      await sleep(1500);
    }
    return;
  }

  if (targetSlug) {
    const matched = allColumns.find(c => c.slug === targetSlug || c.slug.includes(targetSlug));
    if (!matched) {
      console.error(`❌ 지정된 슬러그 '${targetSlug}' 칼럼을 찾을 수 없습니다.`);
      return;
    }
    console.log(`🎯 [지정 칼럼 발행 모드] 슬러그: ${matched.slug}`);
    await publishColumn(matched);
    return;
  }

  const history = getHistory();

  // Find column scheduled for the current slot window today
  // Slots: 09:00 (hour 8-10), 13:00 (hour 12-14), 17:00 (hour 16-18), 21:00 (hour 20-22)
  const slotCandidates = allColumns.filter(c => {
    const colDateStr = c.dateStr.slice(0, 10);
    const colHour = parseInt(c.dateStr.slice(11, 13), 10);

    // Check if scheduled for today
    if (colDateStr === kstDateStr) {
      // Check if matches the current hour slot window (+/- 1.5h)
      if (Math.abs(colHour - kstHour) <= 1) {
        return true;
      }
    }
    return false;
  });

  if (slotCandidates.length > 0) {
    for (const candidate of slotCandidates) {
      if (!history.sentSlugs.includes(candidate.slug) || forceFlag) {
        console.log(`🎯 [현재 슬롯 매칭 칼럼 발견] "${candidate.slug}" (예약: ${candidate.dateStr})`);
        await publishColumn(candidate);
        return;
      } else {
        console.log(`⏩ [이미 발송 완료된 칼럼 건너뜀] "${candidate.slug}"`);
      }
    }
  }

  console.log(`ℹ️ 현재 KST 시간대(${kstHour}시)에 새로 발송할 예약 칼럼이 없습니다.`);
}

autoPublishCurrentSlot().catch(err => {
  console.error('❌ 자동발행 프로세스 중 치명적 오류:', err);
  process.exit(1);
});
