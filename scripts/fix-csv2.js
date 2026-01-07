const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'quizzes_1000_merged.csv');
let content = fs.readFileSync(csvPath, 'utf8');

// 추가 수정 패턴
const replacements = [
  // explanation 필드 내의 쉼표
  ['수면, 영양, 운동', '수면·영양·운동'],
  ['식은땀, 떨림, 어지러움', '식은땀·떨림·어지러움'],
  ['금연, 규칙적 운동', '금연·규칙적 운동'],
  ['채소, 과일 섭취', '채소·과일 섭취'],
  ['금연, 운동, 체중 관리', '금연·운동·체중 관리'],
  ['운동, 영양, 충분한 휴식', '운동·영양·충분한 휴식'],
  ['운동, 사회 활동, 건강 관리', '운동·사회 활동·건강 관리'],
  ['수면, 영양, 운동의 균형', '수면·영양·운동의 균형'],

  // 선택지 내의 쉼표 추가
  ['돈, 명예, 권력', '돈·명예·권력'],
  ['직장, 가정, 친구', '직장·가정·친구'],
  ['취미, 여행, 쇼핑', '취미·여행·쇼핑'],
  ['운동, 영양, 휴식', '운동·영양·휴식'],
  ['심장마비는 혈류 차단, 심정지는 심장 멈춤', '심장마비는 혈류 차단·심정지는 심장 멈춤'],

  // 숫자와 쉼표
  ['냉장고는 0~5도, 냉동고는', '냉장고는 0~5도·냉동고는'],
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
console.log(`✅ 추가 수정 완료: ${fixCount}개의 쉼표가 ·로 대체됨`);
