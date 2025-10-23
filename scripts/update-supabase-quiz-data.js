const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '설정됨' : '미설정');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '설정됨' : '미설정');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CSV 데이터 읽기 및 파싱
const csvPath = 'C:\\Users\\dhwan\\Downloads\\health-hero_Q1-200_FINAL_SLIM_with_hints_DIFFICULTY_2-2-1_cp949.csv';
const iconv = require('iconv-lite');

async function updateQuizData() {
  try {
    console.log('CSV 파일 읽기 중...');
    const buffer = fs.readFileSync(csvPath);
    const csvContent = iconv.decode(buffer, 'cp949');
    
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

    console.log(`총 ${data.length}개의 퀴즈 데이터를 파싱했습니다.`);

    // 기존 데이터 삭제
    console.log('기존 퀴즈 데이터 삭제 중...');
    const { error: deleteError } = await supabase
      .from('quizes')
      .delete()
      .neq('id', 0); // 모든 데이터 삭제

    if (deleteError) {
      console.error('기존 데이터 삭제 오류:', deleteError);
      return;
    }

    console.log('기존 데이터 삭제 완료.');

    // 새 데이터 삽입
    console.log('새 퀴즈 데이터 삽입 중...');
    
    // 배치로 삽입 (Supabase는 한 번에 최대 1000개까지)
    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('quizes')
        .insert(batch.map(row => ({
          qnum: parseInt(row.qnum),
          topic: row.topic,
          prompt: row.prompt,
          choice1: row.choice1,
          choice2: row.choice2,
          choice3: row.choice3,
          choice4: row.choice4,
          answer_index: parseInt(row.answer_index),
          hint: row.hint,
          explanation: row.explanation,
          difficulty_label: row.difficulty_label
        })));

      if (insertError) {
        console.error(`배치 ${Math.floor(i/batchSize) + 1} 삽입 오류:`, insertError);
        return;
      }

      console.log(`배치 ${Math.floor(i/batchSize) + 1}/${Math.ceil(data.length/batchSize)} 완료`);
    }

    console.log('✅ 퀴즈 데이터 업데이트 완료!');
    console.log(`총 ${data.length}개의 퀴즈가 성공적으로 업로드되었습니다.`);

    // 업로드된 데이터 확인
    const { data: uploadedData, error: selectError } = await supabase
      .from('quizes')
      .select('count')
      .limit(1);

    if (selectError) {
      console.error('데이터 확인 오류:', selectError);
    } else {
      console.log('업로드된 데이터 확인 완료.');
    }

  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
updateQuizData();
