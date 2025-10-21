"""
CSV 파일을 Supabase 업로드용으로 변환하는 스크립트

사용법:
1. Python 3 설치 확인
2. python scripts/convert-csv-for-upload.py
3. 생성된 'quizzes_for_upload.csv' 파일을 Supabase에 업로드
"""

import csv
import json

# 입력 파일 경로 (실제 경로로 수정하세요)
input_file = r'C:\Users\User\Downloads\health-hero_Q1-200_v2_4choice_with_hints_ko_2025-10-14_NO-GENERIC-CHOICE4_fromTXT.csv'

# 출력 파일 경로
output_file = 'quizzes_for_upload.csv'

# 난이도 매핑
difficulty_map = {'쉬움': 1, '보통': 2, '어려움': 3}

print('🔄 CSV 변환 시작...\n')

converted_count = 0
skipped_count = 0

with open(input_file, 'r', encoding='utf-8') as infile, \
     open(output_file, 'w', encoding='utf-8', newline='') as outfile:
    
    reader = csv.DictReader(infile)
    
    # 새로운 헤더 정의
    fieldnames = ['qnum', 'topic', 'prompt', 'choices', 'answer_index', 
                  'hint', 'explanation', 'difficulty_label', 'difficulty_level']
    
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    
    for row in reader:
        # 빈 행 스킵
        if not row.get('qnum') or row['qnum'] == '':
            skipped_count += 1
            continue
        
        try:
            # choices 배열 생성
            choices = [
                row.get('choice1', ''),
                row.get('choice2', ''),
                row.get('choice3', ''),
                row.get('choice4', '')
            ]
            
            # 새로운 행 작성
            new_row = {
                'qnum': row['qnum'],
                'topic': row.get('topic', '미분류'),
                'prompt': row.get('prompt', ''),
                'choices': json.dumps(choices, ensure_ascii=False),  # JSON 문자열로 변환
                'answer_index': row.get('answer_index', '0'),
                'hint': row.get('hint', ''),
                'explanation': row.get('explanation', ''),
                'difficulty_label': row.get('difficulty_label', '보통'),
                'difficulty_level': difficulty_map.get(row.get('difficulty_label', '보통'), 2)
            }
            
            writer.writerow(new_row)
            converted_count += 1
            
            # 진행 상황 출력 (10개마다)
            if converted_count % 10 == 0:
                print(f'✅ {converted_count}개 변환 완료...')
                
        except Exception as e:
            print(f'❌ qnum {row.get("qnum", "?")} 변환 실패: {e}')
            skipped_count += 1

print('\n' + '='*50)
print('📊 변환 결과:')
print(f'   - 성공: {converted_count}개')
print(f'   - 스킵: {skipped_count}개')
print(f'   - 출력 파일: {output_file}')
print('='*50)
print('\n✅ 변환 완료! 이제 Supabase에 업로드하세요.')

