const fs = require('fs');
const path = require('path');

// CSV 파일 읽기 (UTF-8 인코딩)
const csvPath = path.join(__dirname, '..', 'quizzes_1000_merged.csv');

let csvContent;
try {
  csvContent = fs.readFileSync(csvPath, 'utf8');
} catch (error) {
  console.error('파일 읽기 오류:', error.message);
  process.exit(1);
}

// CSV 데이터 파싱
const lines = csvContent.split('\n');
const headers = lines[0].split(',').map(h => h.trim());
const data = [];

console.log('헤더:', headers);

// CSV 라인 파싱 함수 (따옴표 처리)
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

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });
      data.push(row);
    }
  }
}

console.log('CSV 데이터 파싱 완료:', data.length, '개 행');

// 난이도 매핑
const difficultyMap = {
  '쉬움': 1,
  '보통': 2,
  '어려움': 3
};

// 선택지 셔플 함수
function shuffleChoices(choicesStr, answerIndex) {
  const choices = [];
  // 따옴표로 감싸진 텍스트 추출
  const regex = /"([^"]+)"/g;
  let match;
  while ((match = regex.exec(choicesStr)) !== null) {
    choices.push(match[1]);
  }

  if (choices.length !== 4 || answerIndex < 0 || answerIndex > 3) {
    return { choices: choicesStr, newIndex: answerIndex };
  }

  // 정답 저장
  const correctAnswer = choices[answerIndex];

  // Fisher-Yates 셔플
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  // 새로운 정답 인덱스
  const newIndex = choices.indexOf(correctAnswer);

  // 새로운 choices 문자열 (SQL용)
  const newChoices = '[' + choices.map(c => `"${c.replace(/"/g, '\\"')}"`).join(', ') + ']';

  return { choices: newChoices, newIndex };
}

// SQL 생성
const generateSQL = (data) => {
  let sql = '-- 퀴즈 데이터 업데이트 SQL (1000개 퀴즈)\n';
  sql += '-- CSV 파일: quizzes_1000_merged.csv\n';
  sql += '-- 생성일: 2026-01-06\n';
  sql += '-- 설명: 1000개 건강 퀴즈 데이터 (정답 위치 셔플됨)\n\n';

  // 기존 데이터 삭제
  sql += '-- 기존 퀴즈 데이터 삭제\n';
  sql += 'DELETE FROM quizzes;\n\n';

  // 새 데이터 삽입
  sql += '-- 새 퀴즈 데이터 삽입\n';
  sql += 'INSERT INTO quizzes (qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level) VALUES\n';

  const insertValues = data.map((row, idx) => {
    if (!row.qnum || !row.topic || !row.prompt) {
      console.warn(`행 ${idx + 1}: 필수 필드 누락`);
      return null;
    }

    // choices가 이미 JSON 배열 형식인 경우 그대로 사용
    let choicesStr = row.choices;
    if (!choicesStr.startsWith('[')) {
      // 선택지가 개별 컬럼인 경우
      const choices = [row.choice1, row.choice2, row.choice3, row.choice4]
        .filter(choice => choice && choice.trim())
        .map(choice => {
          const escapedChoice = choice.replace(/'/g, "''").replace(/"/g, '\\"');
          return `"${escapedChoice}"`;
        });
      choicesStr = `[${choices.join(', ')}]`;
    }

    // answer_index 처리 (이미 0-based인지 확인)
    let answerIndex = parseInt(row.answer_index);

    if (isNaN(answerIndex) || answerIndex < 0 || answerIndex > 3) {
      console.warn(`문제 ${row.qnum}: answer_index 범위 오류 (${row.answer_index})`);
      return null;
    }

    // 선택지 셔플 적용
    const shuffled = shuffleChoices(choicesStr, answerIndex);
    choicesStr = shuffled.choices;
    answerIndex = shuffled.newIndex;

    const difficultyLevel = difficultyMap[row.difficulty_label] || 2;

    const escapeSql = (str) => {
      if (!str) return '';
      return str.replace(/'/g, "''");
    };

    return `(${row.qnum}, '${escapeSql(row.topic)}', '${escapeSql(row.prompt)}', '${escapeSql(choicesStr)}', ${answerIndex}, '${escapeSql(row.hint || '')}', '${escapeSql(row.explanation || '')}', '${escapeSql(row.difficulty_label || '보통')}', ${difficultyLevel})`;
  }).filter(value => value !== null);

  sql += insertValues.join(',\n');
  sql += ';\n\n';

  // 인덱스 재생성
  sql += '-- 인덱스 재생성\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizzes_qnum ON quizzes(qnum);\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizzes_difficulty ON quizzes(difficulty_label);\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic);\n\n';

  // 데이터 확인 쿼리
  sql += '-- 데이터 확인 쿼리\n';
  sql += 'SELECT COUNT(*) as total_quizzes FROM quizzes;\n';
  sql += 'SELECT difficulty_label, difficulty_level, COUNT(*) as count FROM quizzes GROUP BY difficulty_label, difficulty_level ORDER BY difficulty_level;\n';
  sql += 'SELECT topic, COUNT(*) as count FROM quizzes GROUP BY topic ORDER BY count DESC LIMIT 10;\n';
  sql += 'SELECT answer_index, COUNT(*) as count FROM quizzes GROUP BY answer_index ORDER BY answer_index;\n';

  return sql;
};

// SQL 파일 생성
const sqlContent = generateSQL(data);
const outputPath = path.join(__dirname, '..', 'supabase', 'update-quiz-data-1000.sql');

fs.writeFileSync(outputPath, sqlContent, 'utf8');

console.log(`\n✅ SQL 파일 생성 완료: ${outputPath}`);
console.log(`📊 처리된 퀴즈 수: ${data.length}개`);
console.log(`📝 SQL 파일 크기: ${(sqlContent.length / 1024).toFixed(2)} KB`);

// 통계 출력
const difficultyStats = {};
const topicStats = {};
const answerIndexStats = {};

data.forEach(row => {
  if (row.difficulty_label) {
    difficultyStats[row.difficulty_label] = (difficultyStats[row.difficulty_label] || 0) + 1;
  }
  if (row.topic) {
    topicStats[row.topic] = (topicStats[row.topic] || 0) + 1;
  }
  if (row.answer_index !== undefined) {
    answerIndexStats[row.answer_index] = (answerIndexStats[row.answer_index] || 0) + 1;
  }
});

console.log('\n📈 난이도별 분포:');
Object.entries(difficultyStats).forEach(([difficulty, count]) => {
  console.log(`  ${difficulty}: ${count}개`);
});

console.log('\n📈 answer_index별 분포:');
Object.entries(answerIndexStats).forEach(([index, count]) => {
  console.log(`  ${index}: ${count}개`);
});

console.log('\n📈 토픽별 분포 (상위 15개):');
Object.entries(topicStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 15)
  .forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count}개`);
  });
