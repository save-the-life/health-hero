const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'quizzes_1000_merged.csv');
let content = fs.readFileSync(csvPath, 'utf8');

// explanation 필드의 쉼표 수정
const replacements = [
  ['저염식, 규칙적 운동, 체중 관리로', '저염식·규칙적 운동·체중 관리로'],
  ['금연·규칙적 운동, 건강한 식단으로', '금연·규칙적 운동·건강한 식단으로'],
  ['칼슘, 비타민 D 섭취와', '칼슘·비타민 D 섭취와'],
  ['절주, 운동, 체중 관리로', '절주·운동·체중 관리로'],
  ['채소, 과일, 물을', '채소·과일·물을'],
  ['당뇨, 신장 문제, 감염', '당뇨·신장 문제·감염'],
  ['금연, 절주, 건강한 식단, 운동, 정기 검진으로', '금연·절주·건강한 식단·운동·정기 검진으로'],
  ['심장마비는 혈류 문제, 심정지는', '심장마비는 혈류 문제·심정지는'],
  ['항산화 영양소 섭취', '항산화 영양소 섭취'],
];

let fixCount = 0;
replacements.forEach(([from, to]) => {
  const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = content.match(regex);
  if (matches) {
    fixCount += matches.length;
    content = content.replace(regex, to);
  }
});

fs.writeFileSync(csvPath, content, 'utf8');
console.log(`✅ 추가 수정 완료: ${fixCount}개 수정`);
