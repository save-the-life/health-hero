/**
 * CSV 퀴즈 데이터를 Supabase에 임포트하는 스크립트
 * 
 * 사용법:
 * 1. npm install csv-parser (필요한 경우)
 * 2. .env.local 파일에 SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY 설정
 * 3. node scripts/import-quizzes-from-csv.js
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key 필요

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '설정됨' : '없음');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '설정됨' : '없음');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CSV 파일 경로 (절대 경로 또는 상대 경로)
const csvFilePath = path.join(
  __dirname,
  '..',
  '..',
  'ETC',
  'health-hero_Q1-200_ko_bundle_2025-10-12',
  'health-hero_Q1-200_v2_4choice_with_hints_ko_2025-10-14_NO-GENERIC-CHOICE4_fromTXT.csv'
);

// 난이도 매핑
const difficultyMap = {
  '쉬움': 1,
  '보통': 2,
  '어려움': 3
};

async function importQuizzes() {
  const quizzes = [];
  let rowCount = 0;

  console.log('📖 CSV 파일 읽는 중:', csvFilePath);

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;

        // 빈 행 스킵
        if (!row.qnum || row.qnum === '') {
          console.log(`⚠️  Row ${rowCount}: 빈 행 스킵`);
          return;
        }

        try {
          const quiz = {
            qnum: parseInt(row.qnum),
            topic: row.topic || '미분류',
            prompt: row.prompt || '',
            choices: [
              row.choice1 || '',
              row.choice2 || '',
              row.choice3 || '',
              row.choice4 || ''
            ],
            answer_index: parseInt(row.answer_index) || 0,
            hint: row.hint || '',
            explanation: row.explanation || '',
            difficulty_label: row.difficulty_label || '보통',
            difficulty_level: difficultyMap[row.difficulty_label] || 2
          };

          quizzes.push(quiz);
        } catch (error) {
          console.error(`❌ Row ${rowCount} 파싱 오류:`, error.message);
        }
      })
      .on('end', async () => {
        console.log(`\n✅ CSV 파싱 완료: ${quizzes.length}개 퀴즈 발견\n`);

        if (quizzes.length === 0) {
          console.log('⚠️  임포트할 퀴즈가 없습니다.');
          resolve();
          return;
        }

        try {
          // 배치 크기 (Supabase는 한 번에 많은 데이터를 넣을 수 있지만, 안전하게 100개씩)
          const batchSize = 100;
          let successCount = 0;
          let errorCount = 0;

          for (let i = 0; i < quizzes.length; i += batchSize) {
            const batch = quizzes.slice(i, i + batchSize);
            
            console.log(`📤 배치 ${Math.floor(i / batchSize) + 1} 업로드 중... (${i + 1}-${Math.min(i + batchSize, quizzes.length)})`);

            const { data, error } = await supabase
              .from('quizzes')
              .upsert(batch, { onConflict: 'qnum' }); // qnum이 중복되면 업데이트

            if (error) {
              console.error(`❌ 배치 ${Math.floor(i / batchSize) + 1} 업로드 실패:`, error.message);
              errorCount += batch.length;
            } else {
              console.log(`✅ 배치 ${Math.floor(i / batchSize) + 1} 업로드 성공`);
              successCount += batch.length;
            }
          }

          console.log('\n' + '='.repeat(50));
          console.log('📊 임포트 결과:');
          console.log(`   - 총 퀴즈: ${quizzes.length}개`);
          console.log(`   - 성공: ${successCount}개`);
          console.log(`   - 실패: ${errorCount}개`);
          console.log('='.repeat(50));

          resolve();
        } catch (error) {
          console.error('❌ 임포트 중 오류 발생:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ CSV 파일 읽기 오류:', error);
        reject(error);
      });
  });
}

// 스크립트 실행
console.log('🚀 퀴즈 데이터 임포트 시작...\n');
importQuizzes()
  .then(() => {
    console.log('\n✅ 모든 작업 완료!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 작업 실패:', error);
    process.exit(1);
  });

