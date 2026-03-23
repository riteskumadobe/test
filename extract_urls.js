const fs = require('fs');

// Read the conversation transcript to extract the file
const data = fs.readFileSync('/home/node/.claude/projects/-workspace/5a23586b-45a7-4de4-a6ef-964e2117ea75.jsonl', 'utf8');
const lines = data.split('\n');

// Find the most recent line with page_url_result.xlsx and PK header
let fileContent = null;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('page_url_result.xlsx') && lines[i].includes('PK')) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.message && obj.message.content) {
        for (const c of obj.message.content) {
          if (typeof c.text === 'string' && c.text.includes('page_url_result.xlsx') && c.text.includes('PK')) {
            const backticksStart = c.text.indexOf('```');
            if (backticksStart > -1) {
              const contentStart = backticksStart + 4; // after ``` and newline
              const backticksEnd = c.text.indexOf('```', contentStart);
              if (backticksEnd > -1) {
                fileContent = c.text.substring(contentStart, backticksEnd);
                console.log('Found file content, length:', fileContent.length);
                break;
              }
            }
          }
        }
      }
    } catch(e) {}
    if (fileContent) break;
  }
}

if (!fileContent) {
  console.log('Could not find file content');
  process.exit(1);
}

// Write as Buffer using latin1 encoding to preserve bytes
const buf = Buffer.from(fileContent, 'latin1');
fs.writeFileSync('/workspace/page_url_result.xlsx', buf);
console.log('Wrote', buf.length, 'bytes to /workspace/page_url_result.xlsx');
