const fs = require('fs');
const path = require('path');

const testConverter = require('./test-converter.js');
// Let's test
const mdPath = path.join(__dirname, '..', 'content', 'column', 'ankle-sprain-ligament-chuna', 'index.md');
const md = fs.readFileSync(mdPath, 'utf8');

// Replace base64 thumbnail in output with placeholder so we can read the HTML cleanly
let html = testConverter.convertMarkdownToTistoryHTML(md, 'ankle-sprain-ligament-chuna').html;
html = html.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, '[BASE64_IMAGE]');

console.log(html);
