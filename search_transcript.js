const fs = require('fs');
const data = fs.readFileSync('/home/node/.claude/projects/-workspace/5a23586b-45a7-4de4-a6ef-964e2117ea75.jsonl', 'utf8');
const lines = data.split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('page_url_result') && !lines[i].includes('extract_urls')) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.message && obj.message.content) {
        for (const c of obj.message.content) {
          if (c.type && c.type !== 'text') {
            console.log('Entry ' + i + ': type=' + c.type);
            console.log(JSON.stringify(c).substring(0, 500));
          }
          if (c.source || c.media_type) {
            console.log('Entry ' + i + ': has source/media_type');
            console.log(JSON.stringify(c).substring(0, 500));
          }
          if (typeof c === 'object' && c.file_path) {
            console.log('Entry ' + i + ': file_path=' + c.file_path);
          }
        }
      }
    } catch(e) {}
  }
}
console.log('Search complete');
