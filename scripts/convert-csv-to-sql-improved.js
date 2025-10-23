const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

// CSV 파일 읽기 (CP949 인코딩)
const csvPath = 'C:\\Users\\dhwan\\Downloads\\health-hero_Q1-200_FINAL_SLIM_with_hints_DIFFICULTY_2-2-1_cp949.csv';

// CP949 인코딩으로 읽기
let csvContent;
try {
  const buffer = fs.readFileSync(csvPath);
  csvContent = iconv.decode(buffer, 'cp949');
} catch (error) {
  console.error('파일 읽기 오류:', error.message);
  process.exit(1);
}

// CSV 데이터 파싱
const lines = csvContent.split('\n');
const headers = lines[0].split(',');
const data = [];

for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    data.push(row);
  }
}

console.log('CSV 데이터 파싱 완료:', data.length, '개 행');
console.log('첫 번째 행:', data[0]);

// 난이도 매핑
const difficultyMap = {
  '쉬움': 1,
  '보통': 2,
  '어려움': 3
};

// Supabase 업로드용 SQL 생성
const generateSQL = (data) => {
  let sql = '-- 퀴즈 데이터 업데이트 SQL (개선된 버전)\n';
  sql += '-- CSV 파일: health-hero_Q1-200_FINAL_SLIM_with_hints_DIFFICULTY_2-2-1_cp949.csv\n';
  sql += '-- 생성일: 2025-01-27\n';
  sql += '-- 설명: 누락된 컬럼 처리 및 데이터 무결성 개선\n\n';
  
  // 기존 데이터 삭제
  sql += '-- 기존 퀴즈 데이터 삭제\n';
  sql += 'DELETE FROM quizes;\n\n';
  
  // 새 데이터 삽입
  sql += '-- 새 퀴즈 데이터 삽입\n';
  sql += 'INSERT INTO quizes (qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level) VALUES\n';
  
  const insertValues = data.map(row => {
    if (!row.qnum || !row.topic || !row.prompt) {
      return null; // 필수 필드가 없는 행은 건너뛰기
    }
    
    // 선택지 배열 생성
    const choices = [row.choice1, row.choice2, row.choice3, row.choice4]
      .filter(choice => choice && choice.trim())
      .map(choice => `"${choice.replace(/"/g, '""')}"`);
    
    if (choices.length < 4) {
      console.warn(`문제 ${row.qnum}: 선택지가 4개 미만입니다. 건너뛰기.`);
      return null;
    }
    
    // 난이도 레벨 설정 (기본값: 2)
    const difficultyLevel = difficultyMap[row.difficulty_label] || 2;
    
    // SQL 이스케이프 처리
    const escapeSql = (str) => {
      if (!str) return '';
      return str.replace(/'/g, "''");
    };
    
    return `(${row.qnum}, '${escapeSql(row.topic)}', '${escapeSql(row.prompt)}', '[${choices.join(', ')}]', ${row.answer_index}, '${escapeSql(row.hint || '')}', '${escapeSql(row.explanation || '')}', '${row.difficulty_label || '보통'}', ${difficultyLevel})`;
  }).filter(value => value !== null);
  
  sql += insertValues.join(',\n');
  sql += ';\n\n';
  
  // 인덱스 재생성
  sql += '-- 인덱스 재생성\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizes_qnum ON quizes(qnum);\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizes_difficulty ON quizes(difficulty_label);\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizes_topic ON quizes(topic);\n\n';
  
  // 데이터 확인 쿼리
  sql += '-- 데이터 확인 쿼리\n';
  sql += 'SELECT COUNT(*) as total_quizzes FROM quizes;\n';
  sql += 'SELECT difficulty_label, COUNT(*) as count FROM quizes GROUP BY difficulty_label ORDER BY difficulty_level;\n';
  sql += 'SELECT topic, COUNT(*) as count FROM quizes GROUP BY topic ORDER BY count DESC LIMIT 10;\n';
  
  return sql;
};

// SQL 파일 생성
const sqlContent = generateSQL(data);
const outputPath = path.join(__dirname, '..', 'supabase', 'update-quiz-data-with-hints-improved.sql');

fs.writeFileSync(outputPath, sqlContent, 'utf8');

console.log(`\n✅ SQL 파일 생성 완료: ${outputPath}`);
console.log(`📊 처리된 퀴즈 수: ${data.length}개`);
console.log(`📝 SQL 파일 크기: ${(sqlContent.length / 1024).toFixed(2)} KB`);

// 통계 출력
const difficultyStats = {};
const topicStats = {};

data.forEach(row => {
  if (row.difficulty_label) {
    difficultyStats[row.difficulty_label] = (difficultyStats[row.difficulty_label] || 0) + 1;
  }
  if (row.topic) {
    topicStats[row.topic] = (topicStats[row.topic] || 0) + 1;
  }
});

console.log('\n📈 난이도별 분포:');
Object.entries(difficultyStats).forEach(([difficulty, count]) => {
  console.log(`  ${difficulty}: ${count}개`);
});

console.log('\n📈 토픽별 분포 (상위 10개):');
Object.entries(topicStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([topic, count]) => {
    console.log(`  ${topic}: ${count}개`);
  });
