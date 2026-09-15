const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

const fontUrls = [
  { name: 'Pretendard-Bold.otf', url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Bold.otf' },
  { name: 'Pretendard-Black.otf', url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-Black.otf' },
  { name: 'Pretendard-ExtraBold.otf', url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-ExtraBold.otf' },
  { name: 'Pretendard-SemiBold.otf', url: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-SemiBold.otf' }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading Pretendard fonts...');
  for (const item of fontUrls) {
    const dest = path.join(fontsDir, item.name);
    if (!fs.existsSync(dest) || fs.statSync(dest).size < 1000) {
      console.log(`Downloading ${item.name}...`);
      await download(item.url, dest);
      console.log(`Saved ${item.name} (${fs.statSync(dest).size} bytes)`);
    } else {
      console.log(`Already exists: ${item.name}`);
    }
  }
  console.log('All fonts ready!');
}

main().catch(console.error);
