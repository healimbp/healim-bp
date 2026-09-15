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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8583202554:AAGzom19rWFN1UwN6MzYj7ctDvS2hiua8WU';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '2026055528';

// CLI args
const args = process.argv.slice(2);
const forceFlag = args.includes('--force');
const allFlag = args.includes('--all');
const slugArgIdx = args.indexOf('--slug');
const targetSlug = slugArgIdx !== -1 ? args[slugArgIdx + 1] : (args[0] && !args[0].startsWith('-') ? args[0] : null);
const slotArgIdx = args.indexOf('--slot');
const targetSlot = slotArgIdx !== -1 ? args[slotArgIdx + 1] : null;

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

  console.log(`⏰ [정기 자동발행 시스템 구동] 현재 KST 일시: ${kstNow.toISOString().replace('Z', '+09:00')}`);

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

  // Sort by date descending
  allColumns.sort((a, b) => b.postDate - a.postDate);

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

  // Filter published columns (due up to now)
  const publishedColumns = allColumns.filter(c => c.postDate <= now || c.postDate <= kstNow);

  if (publishedColumns.length === 0) {
    console.log('ℹ️ 현재 발행 시점이 도래한 칼럼이 없습니다.');
    return;
  }

  // Target the latest due column
  const targetCol = publishedColumns[0];
  await publishColumn(targetCol);
}

autoPublishCurrentSlot().catch(err => {
  console.error('❌ 자동발행 프로세스 중 치명적 오류:', err);
  process.exit(1);
});
