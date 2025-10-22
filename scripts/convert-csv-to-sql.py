#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
퀴즈 CSV 데이터를 Supabase SQL INSERT 문으로 변환하는 스크립트
기존 데이터를 삭제하고 새로운 데이터로 교체
"""

import csv
import json
import sys
import os

def csv_to_sql_insert(csv_file_path, output_sql_path):
    """
    CSV 파일을 읽어서 SQL INSERT 문을 생성합니다.
    """
    
    # SQL 파일 시작 부분
    sql_content = """-- ============================================
-- 퀴즈 데이터 업데이트 스크립트 (2025-01-27)
-- 기존 데이터 삭제 후 새로운 CSV 데이터로 교체
-- ============================================

-- 1. 기존 퀴즈 데이터 삭제
-- ============================================
DELETE FROM quizzes;

-- 2. 새로운 퀴즈 데이터 삽입
-- ============================================
INSERT INTO quizzes (qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level) VALUES
"""

    try:
        with open(csv_file_path, 'r', encoding='cp949') as csvfile:
            reader = csv.DictReader(csvfile)
            
            rows = []
            for row in reader:
                # choices를 JSON 배열로 변환
                choices = [
                    row['choice1'],
                    row['choice2'], 
                    row['choice3'],
                    row['choice4']
                ]
                
                # difficulty_level 매핑
                difficulty_level = 1 if row['difficulty_label'] == '쉬움' else 2 if row['difficulty_label'] == '보통' else 3
                
                # answer_index를 0-3 범위로 변환 (CSV의 1-4를 0-3으로)
                answer_index = int(row['answer_index']) - 1
                
                # SQL INSERT 문 생성
                sql_row = f"""({row['qnum']}, '{row['topic']}', '{row['prompt']}', '{json.dumps(choices, ensure_ascii=False)}', {answer_index}, '{row['hint']}', '{row['explanation']}', '{row['difficulty_label']}', {difficulty_level})"""
                rows.append(sql_row)
            
            # 모든 행을 SQL에 추가
            sql_content += ",\n".join(rows) + ";"
            
            # SQL 파일 끝 부분
            sql_content += """

-- 3. 인덱스 재생성 (성능 최적화)
-- ============================================
REINDEX INDEX idx_quizzes_qnum;
REINDEX INDEX idx_quizzes_topic;

-- 4. 데이터 확인
-- ============================================
SELECT COUNT(*) as total_questions FROM quizzes;
SELECT difficulty_label, COUNT(*) as count FROM quizzes GROUP BY difficulty_label ORDER BY difficulty_label;
"""
            
            # SQL 파일 저장
            with open(output_sql_path, 'w', encoding='utf-8') as sqlfile:
                sqlfile.write(sql_content)
                
            print(f"✅ SQL 파일이 성공적으로 생성되었습니다: {output_sql_path}")
            print(f"📊 총 {len(rows)}개의 퀴즈 문제가 포함되었습니다.")
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False
    
    return True

def main():
    # CSV 파일 경로
    csv_file = r"c:\Users\User\Downloads\health-hero_Q1-200_v5_SLIM_balanced_with_hints_DIFFICULTY_2-2-1_cp949.csv"
    sql_file = "supabase/update-quiz-data.sql"
    
    if not os.path.exists(csv_file):
        print(f"❌ CSV 파일을 찾을 수 없습니다: {csv_file}")
        return
    
    print("🔄 CSV 파일을 SQL로 변환 중...")
    success = csv_to_sql_insert(csv_file, sql_file)
    
    if success:
        print("\n📋 다음 단계:")
        print("1. Supabase 대시보드에 접속")
        print("2. SQL Editor로 이동")
        print("3. 생성된 update-quiz-data.sql 파일의 내용을 복사하여 실행")
        print("4. 또는 Supabase CLI를 사용: supabase db reset --db-url [YOUR_DB_URL] < update-quiz-data.sql")

if __name__ == "__main__":
    main()
