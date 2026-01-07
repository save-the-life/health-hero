const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'quizzes_1000_merged.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

console.log('총 라인 수:', lines.length);

let problemLines = [];

lines.forEach((line, i) => {
  if (line.trim() && i > 0) {
    let fields = 0;
    let inQuotes = false;

    for (let c of line) {
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        fields++;
      }
    }

    // 9개 컬럼이면 8개의 쉼표가 있어야 함
    if (fields !== 8) {
      problemLines.push({ line: i + 1, fieldCount: fields + 1, content: line.substring(0, 100) });
    }
  }
});

if (problemLines.length === 0) {
  console.log('모든 행이 올바른 필드 수를 가지고 있습니다.');
} else {
  console.log('문제 있는 행:', problemLines.length);
  problemLines.slice(0, 20).forEach(p => {
    console.log(`  Line ${p.line}: ${p.fieldCount} fields - ${p.content}...`);
  });
}
