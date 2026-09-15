const fs = require('fs');
const path = require('path');
const https = require('https');

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

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.argv[2];
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.argv[3];
const TARGET_SLUG = process.argv[4] || 'all';

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

function convertMarkdownToTistoryHTML(mdContent, slug) {
  const match = mdContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { title: slug, html: mdContent, category: '건강 칼럼', tags: [] };

  const frontmatterStr = match[1];
  let bodyStr = match[2];

  const titleMatch = frontmatterStr.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : slug;

  const categoryMatch = frontmatterStr.match(/category:\s*"([^"]+)"/);
  const category = categoryMatch ? categoryMatch[1] : '해아림 건강칼럼';

  const tagsMatch = frontmatterStr.match(/tags:\s*\[(.*?)\]/);
  let tags = [];
  if (tagsMatch) {
    tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
  }

  // 1. Extract voice lines
  let voiceLinesHTML = '';
  const voiceMatch = bodyStr.match(/<div class="voice-box">([\s\S]*?)<\/div>/);
  if (voiceMatch) {
    const rawLines = voiceMatch[1].match(/<div class="voice-line">(.*?)<\/div>/g) || [];
    const lines = rawLines.map(l => l.replace(/<\/?div[^>]*>/g, '').trim());
    voiceLinesHTML = lines.map(l => `${l}`).join('<br><br>');
    bodyStr = bodyStr.replace(/<div class="voice-box">[\s\S]*?<\/div>/, '');
  }

  // 2. Extract intro
  let introHTML = '';
  const introMatch = bodyStr.match(/<div class="intro-body">([\s\S]*?)<\/div>/);
  if (introMatch) {
    const ps = introMatch[1].match(/<p>([\s\S]*?)<\/p>/g) || [];
    introHTML = ps.map(p => {
      let cleanP = p.replace(/<\/?p>/g, '').trim();
      cleanP = cleanP.replace(/\[(.*?)\]/g, '<strong style="color: #1E4638; font-weight: 700;">$1</strong>');
      return `<p style="font-size: 16px; line-height: 1.85; color: #374151; margin-bottom: 18px; word-break: keep-all; font-style: normal;">${cleanP}</p>`;
    }).join('\n  ');
    bodyStr = bodyStr.replace(/<div class="intro-body">[\s\S]*?<\/div>/, '');
  }

  // 3. Extract TOC
  let tocListHTML = '';
  const tocMatch = bodyStr.match(/<div class="toc">([\s\S]*?)<\/div>/);
  if (tocMatch) {
    const lis = tocMatch[1].match(/<li>(.*?)<\/li>/g) || [];
    tocListHTML = lis.map((li, idx) => {
      const text = li.replace(/<\/?li>/g, '').trim();
      const num = String(idx + 1).padStart(2, '0');
      return `    <li style="position: relative; padding-left: 22px; margin-bottom: 10px; font-size: 15.5px; line-height: 1.8; color: #374151; font-style: normal;">
      <span style="position: absolute; left: 6px; top: 10px; width: 6px; height: 6px; background-color: #2F5D50; border-radius: 50%; display: inline-block;"></span>
      ${num}. ${text}
    </li>`;
    }).join('\n');
    bodyStr = bodyStr.replace(/<div class="toc">[\s\S]*?<\/div>/, '');
  }

  // Remove bottom callout box if present in raw
  bodyStr = bodyStr.replace(/<div class="callout-box">[\s\S]*?<\/div>/g, '');

  // 4. Parse sections and tables
  const sections = bodyStr.split(/\n(?=###\s+)/);
  let parsedSectionsHTML = '';

  sections.forEach(sec => {
    sec = sec.trim();
    if (!sec) return;

    if (sec.startsWith('###')) {
      const firstLineEnd = sec.indexOf('\n');
      const heading = (firstLineEnd !== -1 ? sec.substring(3, firstLineEnd) : sec.substring(3)).trim();
      let content = firstLineEnd !== -1 ? sec.substring(firstLineEnd).trim() : '';

      content = content.replace(/^---\s*$/gm, '').trim();
      content = convertMarkdownTableToHTML(content);

      // Lists
      content = content.replace(/^(?:-|\*)\s+(.*)$/gm, (m, text) => {
        return `<li style="position: relative; padding-left: 20px; margin-bottom: 8px; font-size: 15.5px; line-height: 1.8; color: #374151; font-style: normal;">
          <span style="position: absolute; left: 4px; top: 10px; width: 5px; height: 5px; background-color: #2F5D50; border-radius: 50%; display: inline-block;"></span>
          ${text}
        </li>`;
      });
      content = content.replace(/((?:<li[\s\S]*?<\/li>\s*)+)/g, '<ul style="list-style-type: none; padding-left: 0; margin: 16px 0; font-style: normal;">\n$1\n</ul>');

      content = content.replace(/^(\d+)\.\s+(.*)$/gm, (m, num, text) => {
        return `<li style="margin-bottom: 8px; font-size: 15.5px; line-height: 1.8; color: #374151; font-style: normal;">
          <strong style="color: #1E4638;">${num}.</strong> ${text}
        </li>`;
      });
      content = content.replace(/((?:<li style="margin-bottom: 8px[\s\S]*?<\/li>\s*)+)/g, '<ol style="padding-left: 20px; margin: 16px 0; font-style: normal;">\n$1\n</ol>');

      // Bold
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1E4638; font-weight: 700;">$1</strong>');
      content = content.replace(/\[(.*?)\]/g, '<strong style="color: #1E4638; font-weight: 700;">$1</strong>');

      const paragraphs = content.split(/\n\n+/);
      const formattedP = paragraphs.map(p => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<table') || p.startsWith('<div')) {
          return p;
        }
        return `<p style="font-size: 16px; line-height: 1.85; color: #374151; margin-bottom: 18px; word-break: keep-all; font-style: normal;">${p.replace(/\n/g, '<br>')}</p>`;
      }).join('\n  ');

      parsedSectionsHTML += `\n  <h3 style="font-size: 19px; font-weight: 800; color: #1E4638; border-bottom: 2px solid #E2EAE5; padding-bottom: 10px; margin: 38px 0 18px 0; letter-spacing: -0.02em; font-style: normal;">🌿 ${heading}</h3>\n  ${formattedP}\n`;
    }
  });

  // Assemble the exact Tistory HTML matching healimbp.tistory.com/47 WITH MAIN THUMBNAIL IMAGE
  const tistoryFullHTML = `<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif; line-height: 1.85; color: #333333; max-width: 780px; margin: 0 auto; padding: 10px 0; font-style: normal;">
  
  <!-- 대표 썸네일 이미지 (다음/카카오/네이버 검색 썸네일 자동 연동) -->
  <div style="text-align: center; margin: 0 0 24px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    <img src="https://healim-bp.com/thumbnails/${slug}.png" alt="${title} - 해아림한의원 부평점 통합진료센터" style="width: 100%; max-width: 780px; height: auto; display: block; border-radius: 12px; margin: 0 auto; object-fit: cover;" />
  </div>

  <!-- 상단 안내 헤더 박스 -->
  <div style="background-color: #F4F8F6; border-left: 5px solid #2F5D50; padding: 20px 24px; border-radius: 10px; margin-bottom: 32px; box-shadow: 0 1px 4px rgba(47,93,80,0.05); font-style: normal;">
    <p style="margin: 0; font-size: 16px; color: #2F5D50; font-weight: 800; letter-spacing: -0.01em; font-style: normal;">
      🌿 해아림한의원 부평점 통합진료센터 권형근 대표원장의 1:1 맞춤 건강 칼럼
    </p>
    <p style="margin: 8px 0 0 0; font-size: 13.5px; color: #556B62; line-height: 1.6; font-style: normal;">
      척추·관절 통증 · 건강보험 추나 · 교통사고 입원/통원 · 만성 기침(보폐고) · 만성 부종(부종환) · 맞춤보약
    </p>
  </div>

  ${voiceLinesHTML ? `<!-- 환자 호소문 인용 박스 -->
  <div style="background-color: #F8FAF9; border-left: 4px solid #2F5D50; border-radius: 0 12px 12px 0; padding: 18px 24px; margin: 24px 0 28px 0; color: #2C3E35; font-size: 15px; line-height: 1.85; font-style: normal; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
    ${voiceLinesHTML}
  </div>` : ''}

  <!-- 칼럼 본문 -->
  <div style="font-size: 16px; color: #374151; word-break: keep-all; font-style: normal;">
  <p style="font-size: 16px; line-height: 1.85; color: #374151; margin-bottom: 18px; word-break: keep-all; font-style: normal;">안녕하세요. <strong style="color: #1E4638; font-weight: 700;">해아림한의원 부평점 대표원장 권형근(한방침구과 전문의)</strong>입니다.</p>
  
  ${introHTML}

  ${tocListHTML ? `<h3 style="font-size: 19px; font-weight: 800; color: #1E4638; border-bottom: 2px solid #E2EAE5; padding-bottom: 10px; margin: 38px 0 18px 0; letter-spacing: -0.02em; font-style: normal;">📌 이 칼럼에서 다루는 핵심 목차</h3>
  <ul style="list-style-type: none; padding-left: 0; margin: 18px 0; font-style: normal;">
${tocListHTML}
  </ul>` : ''}

  ${parsedSectionsHTML}

  <!-- 원장 조언 박스 -->
  <div style="background: linear-gradient(135deg, #F0F6F3 0%, #E8F1EC 100%); border-left: 5px solid #2F5D50; border-radius: 4px 14px 14px 4px; padding: 22px 26px; margin: 36px 0; color: #2C3E35; box-shadow: 0 2px 6px rgba(47,93,80,0.06); font-style: normal;">
    <p style="margin: 0 0 8px 0; font-size: 15.5px; font-weight: 800; color: #1E4638; font-style: normal;">
      👨‍⚕️ <strong>권형근 대표원장의 진료실 조언</strong>
    </p>
    <p style="margin: 0; font-size: 15px; line-height: 1.85; color: #33443C; word-break: keep-all; font-style: normal;">
      "증상은 몸이 보내는 쉼과 치유의 절박한 신호입니다. 정확한 원인 진단과 1:1 맞춤 한방 치료를 통해 건강하고 활기찬 일상을 되찾으시길 바랍니다."
    </p>
  </div>

  </div>

  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 44px 0 32px 0;" />

  <!-- 원장 소개 및 한의원 진료 안내 카드 -->
  <div style="background-color: #FAFAF9; border: 1px solid #E7E5E4; border-radius: 14px; padding: 26px; margin-top: 32px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); font-style: normal;">
    <h4 style="margin: 0 0 12px 0; color: #1E4638; font-size: 17.5px; font-weight: 800; font-style: normal;">
      🏥 해아림한의원 부평점 통합진료센터 진료 안내
    </h4>
    <ul style="margin: 0 0 18px 0; padding-left: 20px; font-size: 14.5px; color: #4B5563; line-height: 1.85; font-style: normal;">
      <li style="margin-bottom: 6px;"><strong>대표원장:</strong> 권형근 (한방침구과 전문의 1:1 직접 책임 진료)</li>
      <li style="margin-bottom: 6px;"><strong>오시는 길:</strong> 인천 부평구 경원대로 1404 그랑프리빌딩 7층 (부평역 7번 출구 도보 1분)</li>
      <li style="margin-bottom: 6px;"><strong>상담 및 예약:</strong> 032-719-3472</li>
      <li style="margin-bottom: 6px;"><strong>진료 시간:</strong> 월·수·금 09:30 ~ 20:00 (야간진료) / 화·목 09:30 ~ 19:00 / 토 09:30 ~ 15:00 (점심시간 없음)</li>
    </ul>

    <!-- 원클릭 바로가기 버튼 그룹 -->
    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px;">
      <a href="https://booking.naver.com/booking/13/bizes/934695" target="_blank" rel="noopener" style="display: inline-block; background-color: #03C75A; color: #ffffff; text-decoration: none; padding: 11px 18px; border-radius: 8px; font-size: 13.5px; font-weight: bold; box-shadow: 0 2px 4px rgba(3,199,90,0.2); font-style: normal;">
        📅 네이버 간편 진료예약
      </a>
      <a href="https://pf.kakao.com/_Tcxcxoxj" target="_blank" rel="noopener" style="display: inline-block; background-color: #FEE500; color: #191919; text-decoration: none; padding: 11px 18px; border-radius: 8px; font-size: 13.5px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.08); font-style: normal;">
        💬 카카오톡 1:1 비밀상담
      </a>
      <a href="https://healim-bp.com/column/${slug}/" target="_blank" rel="noopener" style="display: inline-block; background-color: #2F5D50; color: #ffffff; text-decoration: none; padding: 11px 18px; border-radius: 8px; font-size: 13.5px; font-weight: bold; box-shadow: 0 2px 4px rgba(47,93,80,0.2); font-style: normal;">
        🌐 공식 홈페이지 칼럼 원문 보기
      </a>
    </div>
  </div>

  <!-- 출처 표기 (백링크 SEO) -->
  <p style="text-align: right; font-size: 12px; color: #9CA3AF; margin-top: 16px; font-style: normal;">
    출처: <a href="https://healim-bp.com/column/${slug}/" target="_blank" rel="noopener" style="color: #6B7280; text-decoration: underline;">해아림한의원 부평점 통합진료센터 (healim-bp.com)</a>
  </p>

</div>`;

  return {
    title,
    category,
    tags,
    html: tistoryFullHTML
  };
}

function convertMarkdownTableToHTML(text) {
  const tableRegex = /\|(.+)\|\r?\n\|[-:\s|]+\|\r?\n((?:\|.+\|\r?\n?)+)/g;
  return text.replace(tableRegex, (match, headerLine, rowsBlock) => {
    const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
    const rows = rowsBlock.trim().split('\n').map(row => row.split('|').map(c => c.trim()).filter(c => c));

    let ths = headers.map(h => `<th style="border: 1px solid #D1DDD7; padding: 10px 14px; background-color: #EAF3EF; color: #1E4638; font-weight: bold; font-size: 14px; text-align: center;">${h.replace(/\*\*(.*?)\*\*/g, '$1')}</th>`).join('');
    let trs = rows.map(r => {
      let tds = r.map((cell, cIdx) => {
        let align = cIdx === 0 ? 'text-align: center; font-weight: bold;' : 'text-align: left;';
        let cellFormatted = cell.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1E4638;">$1</strong>');
        return `<td style="border: 1px solid #E2EAE5; padding: 10px 14px; font-size: 14px; color: #374151; ${align}">${cellFormatted}</td>`;
      }).join('');
      return `<tr>${tds}</tr>`;
    }).join('\n');

    return `<div style="overflow-x: auto; margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #D1DDD7; font-size: 14px; line-height: 1.6; text-align: left; background-color: #FFFFFF; font-style: normal;">
    <thead>
      <tr>${ths}</tr>
    </thead>
    <tbody>
      ${trs}
    </tbody>
  </table>
</div>`;
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

  console.log(`🚀 총 ${targetDirs.length}개 칼럼을 대표 썸네일 이미지(사진) + 티스토리 HTML 서식으로 텔레그램에 전송합니다... (Chat ID: ${CHAT_ID})\n`);

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
      await sendTelegramDocument(fileName, html, `📄 ${title} (티스토리 HTML 서식 복사용)`);
      console.log(`   ✅ 대표 썸네일 사진 + HTML 파일 전송 완료!`);

      await sleep(1500);
    } catch (err) {
      console.error(`   ❌ 전송 실패 (${slug}):`, err.message);
    }
  }

  console.log(`\n🎉 모든 칼럼이 대표 썸네일 이미지와 함께 완벽히 전송되었습니다!`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

run();
