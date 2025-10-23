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

// Supabase 업로드용 SQL 생성
const generateSQL = (data) => {
  let sql = '-- 퀴즈 데이터 업데이트 SQL\n\n';
  
  // 기존 데이터 삭제
  sql += '-- 기존 퀴즈 데이터 삭제\n';
  sql += 'DELETE FROM quizes;\n\n';
  
  // 새 데이터 삽입
  sql += '-- 새 퀴즈 데이터 삽입\n';
  sql += 'INSERT INTO quizes (qnum, topic, prompt, choice1, choice2, choice3, choice4, answer_index, hint, explanation, difficulty_label) VALUES\n';
  
  const values = data.map(row => {
    return `(${row.qnum}, '${row.topic.replace(/'/g, "''")}', '${row.prompt.replace(/'/g, "''")}', '${row.choice1.replace(/'/g, "''")}', '${row.choice2.replace(/'/g, "''")}', '${row.choice3.replace(/'/g, "''")}', '${row.choice4.replace(/'/g, "''")}', ${row.answer_index}, '${row.hint.replace(/'/g, "''")}', '${row.explanation.replace(/'/g, "''")}', '${row.difficulty_label}')`;
  });
  
  sql += values.join(',\n') + ';\n\n';
  
  // 인덱스 재생성
  sql += '-- 인덱스 재생성\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizes_qnum ON quizes(qnum);\n';
  sql += 'CREATE INDEX IF NOT EXISTS idx_quizes_difficulty ON quizes(difficulty_label);\n';
  
  return sql;
};

const sql = generateSQL(data);

// SQL 파일 저장
const sqlPath = path.join(__dirname, '../supabase/update-quiz-data-with-hints.sql');
fs.writeFileSync(sqlPath, sql, 'utf8');

console.log('SQL 파일 생성 완료:', sqlPath);
console.log('총', data.length, '개의 퀴즈 데이터가 포함되었습니다.');
