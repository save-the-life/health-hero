const fs = require('fs');
const path = require('path');

// SQL 파일 읽기
const sql = fs.readFileSync(path.join(__dirname, '../supabase/update-quiz-data-with-hints-final.sql'), 'utf8');

// 각 줄을 파싱
const lines = sql.split('\n');
const rows = [];

for (const line of lines) {
    // (숫자, '주제', '문제', '[선택지]', 정답, '힌트', '설명', '난이도라벨', 난이도숫자) 형식 파싱
    const match = line.match(/^\((\d+),\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'(\[.*?\])',\s*(\d+),\s*'([^']*(?:''[^']*)*)',\s*'([^']*(?:''[^']*)*)',\s*'([^']+)',\s*(\d+)\)/);

    if (match) {
        rows.push({
            qnum: match[1],
            topic: match[2].replace(/''/g, "'"),
            prompt: match[3].replace(/''/g, "'"),
            choices: match[4].replace(/''/g, "'"),
            answer_index: match[5],
            hint: match[6].replace(/''/g, "'"),
            explanation: match[7].replace(/''/g, "'"),
            difficulty_label: match[8],
            difficulty_level: match[9]
        });
    }
}

console.log('Total rows found:', rows.length);

// CSV 생성
const escapeCSV = (str) => {
    if (!str) return '';
    str = String(str);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes("'")) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
};

let csv = 'qnum,topic,prompt,choices,answer_index,hint,explanation,difficulty_label,difficulty_level\n';

for (const row of rows) {
    csv += [
        row.qnum,
        escapeCSV(row.topic),
        escapeCSV(row.prompt),
        escapeCSV(row.choices),
        row.answer_index,
        escapeCSV(row.hint),
        escapeCSV(row.explanation),
        escapeCSV(row.difficulty_label),
        row.difficulty_level
    ].join(',') + '\n';
}

fs.writeFileSync(path.join(__dirname, '../quizzes_updated.csv'), csv, 'utf8');
console.log('CSV 파일 생성 완료: quizzes_updated.csv');

// 처음 5개 행 출력
console.log('\n처음 5개 문제:');
rows.slice(0, 5).forEach((r, i) => {
    console.log(`${i + 1}. [${r.topic}] ${r.prompt.substring(0, 50)}...`);
});

// 마지막 5개 행 출력
console.log('\n마지막 5개 문제:');
rows.slice(-5).forEach((r, i) => {
    console.log(`${rows.length - 5 + i + 1}. [${r.topic}] ${r.prompt.substring(0, 50)}...`);
});
