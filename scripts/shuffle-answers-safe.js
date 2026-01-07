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

// choices 문자열에서 배열 추출
function parseChoices(choicesStr) {
  const choices = [];
  // ["choice1","choice2","choice3","choice4"] 형식 파싱
  const regex = /"([^"]+)"/g;
  let match;
  while ((match = regex.exec(choicesStr)) !== null) {
    choices.push(match[1]);
  }
  return choices;
}

// 배열을 choices 문자열로 변환
function formatChoices(choicesArray) {
  return '[' + choicesArray.map(c => `""${c}""`).join(',') + ']';
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

  const qnum = fields[0];
  const topic = fields[1];
  const prompt = fields[2];
  const choicesStr = fields[3];
  const answerIndex = parseInt(fields[4]);
  const hint = fields[5];
  const explanation = fields[6];
  const diffLabel = fields[7];
  const diffLevel = fields[8];

  if (isNaN(answerIndex) || answerIndex < 0 || answerIndex > 3) {
    newLines.push(lines[i]);
    continue;
  }

  const choices = parseChoices(choicesStr);
  if (choices.length !== 4) {
    newLines.push(lines[i]);
    continue;
  }

  // 정답 저장
  const correctAnswer = choices[answerIndex];

  // 배열 셔플 (Fisher-Yates)
  for (let j = choices.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [choices[j], choices[k]] = [choices[k], choices[j]];
  }

  // 새로운 정답 인덱스 찾기
  const newIndex = choices.indexOf(correctAnswer);

  // 새로운 choices 문자열 생성
  const newChoicesStr = formatChoices(choices);

  // 새 라인 생성 - 원본 형식 유지
  const newLine = `${qnum},${topic},${prompt},"${newChoicesStr}",${newIndex},${hint},${explanation},${diffLabel},${diffLevel}`;
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
