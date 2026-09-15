const https = require('https');

https.get('https://healim-bp.com/column/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/전체 칼럼 \(\d+\)/);
    console.log('Badge text:', match ? match[0] : 'not found');
    const articles = data.match(/class="[^"]*column-item[^"]*"/g);
    console.log('Article card count in HTML:', articles ? articles.length : 0);
  });
}).on('error', err => {
  console.error('Error:', err.message);
});
