const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'quizzes_1000_merged.csv');
let content = fs.readFileSync(csvPath, 'utf8');

// CSV 라인 파싱 함수
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// Fisher-Yates 셔플 알고리즘
function shuffleWithAnswer(choices, correctIndex) {
  // choices 문자열에서 배열 추출
  const choicesArray = [];
  let match;
  const regex = /"([^"]+)"/g;
  while ((match = regex.exec(choices)) !== null) {
    choicesArray.push(match[1]);
  }

  if (choicesArray.length !== 4) {
    return { choices, newIndex: correctIndex };
  }

  // 정답 저장
  const correctAnswer = choicesArray[correctIndex];

  // 배열 셔플
  for (let i = choicesArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choicesArray[i], choicesArray[j]] = [choicesArray[j], choicesArray[i]];
  }

  // 새로운 정답 인덱스 찾기
  const newIndex = choicesArray.indexOf(correctAnswer);

  // 새로운 choices 문자열 생성
  const newChoices = '[' + choicesArray.map(c => `"${c}"`).join(',') + ']';

  return { choices: newChoices, newIndex };
}

const lines = content.split('\n');
const header = lines[0];
const newLines = [header];

let shuffledCount = 0;
const indexDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 };

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;

  const fields = parseCSVLine(lines[i]);
  if (fields.length < 9) {
    newLines.push(lines[i]);
    continue;
  }

  const [qnum, topic, prompt, choices, answerIndex, hint, explanation, diffLabel, diffLevel] = fields;
  const currentIndex = parseInt(answerIndex);

  if (isNaN(currentIndex) || currentIndex < 0 || currentIndex > 3) {
    newLines.push(lines[i]);
    continue;
  }

  // 셔플
  const { choices: newChoices, newIndex } = shuffleWithAnswer(choices, currentIndex);

  // 새 라인 생성
  const newLine = `${qnum},${topic},${prompt},"${newChoices}",${newIndex},${hint},${explanation},${diffLabel},${diffLevel}`;
  newLines.push(newLine);

  indexDistribution[newIndex]++;
  shuffledCount++;
}

// 저장
fs.writeFileSync(csvPath, newLines.join('\n'), 'utf8');

console.log(`✅ 정답 위치 셔플 완료: ${shuffledCount}개 퀴즈`);
console.log('\n📊 새로운 answer_index 분포:');
Object.entries(indexDistribution).forEach(([idx, count]) => {
  const percent = ((count / shuffledCount) * 100).toFixed(1);
  console.log(`  ${idx}: ${count}개 (${percent}%)`);
});
