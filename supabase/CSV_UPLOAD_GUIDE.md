# CSV 직접 업로드 가이드

## 📋 개요

`quiz-schema.sql`을 이미 실행했다면, 이제 퀴즈 데이터를 업로드할 차례입니다.

---

## 🚀 빠른 시작 (3단계)

### Step 1: CSV 변환

원본 CSV의 `choice1~4` 컬럼을 `choices` JSONB 배열로 변환합니다.

**방법 A: Python 스크립트 사용 (권장)**

```bash
# 1. scripts/convert-csv-for-upload.py 파일 열기
# 2. input_file 경로를 실제 CSV 파일 경로로 수정
# 3. 스크립트 실행
python scripts/convert-csv-for-upload.py
```

실행 후 `quizzes_for_upload.csv` 파일이 생성됩니다.

**방법 B: Excel/Google Sheets 수동 변환**

1. Excel 또는 Google Sheets에서 CSV 열기
2. 새 컬럼 `choices` 추가
3. 다음 수식 입력:
   ```
   =CONCATENATE("[""", A2, """, """, B2, """, """, C2, """, """, D2, """]")
   ```
   (A2, B2, C2, D2는 choice1~4 컬럼)
4. `difficulty_level` 컬럼 추가:
   - 쉬움 → 1
   - 보통 → 2
   - 어려움 → 3
5. 필요한 컬럼만 선택하여 새 CSV로 저장
   - `qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level`

---

### Step 2: Supabase에 업로드

1. **Supabase Dashboard** 접속
2. 왼쪽 메뉴에서 **Table Editor** 클릭
3. `quizzes` 테이블 선택
4. 오른쪽 상단 **Insert** 버튼 옆 **▼** 클릭
5. **Import data from CSV** 선택

   ![Supabase Import](https://supabase.com/docs/img/table-editor-import.png)

6. **파일 선택**:

   - `quizzes_for_upload.csv` (변환된 파일) 선택
   - 또는 드래그 앤 드롭

7. **컬럼 매핑 확인**:

   ```
   CSV 컬럼          →  Supabase 컬럼
   ─────────────────────────────────
   qnum              →  qnum
   topic             →  topic
   prompt            →  prompt
   choices           →  choices (JSONB 자동 변환 ✅)
   answer_index      →  answer_index
   hint              →  hint
   explanation       →  explanation
   difficulty_label  →  difficulty_label
   difficulty_level  →  difficulty_level
   ```

8. **Import** 버튼 클릭

9. ✅ 완료! 200개 행이 추가되었다는 메시지 확인

---

### Step 3: 데이터 확인

**SQL Editor**에서 확인:

```sql
-- 1. 총 개수 확인
SELECT COUNT(*) FROM quizzes;
-- 예상 결과: 200

-- 2. 첫 5개 확인
SELECT qnum, topic, prompt, choices, difficulty_label
FROM quizzes
ORDER BY qnum
LIMIT 5;

-- 3. choices 배열 확인 (JSON 형식으로 잘 들어갔는지)
SELECT qnum, choices
FROM quizzes
WHERE qnum = 1;
-- 예상 결과: ["대부분 맞다", "대부분 아니다", ...]

-- 4. 난이도별 분포
SELECT difficulty_label, COUNT(*)
FROM quizzes
GROUP BY difficulty_label;
```

---

## 🔧 문제 해결

### 문제 1: "Invalid JSON" 오류

**원인**: `choices` 컬럼이 올바른 JSON 형식이 아닙니다.

**해결**:

- Python 스크립트 사용 (자동으로 올바른 JSON 생성)
- 또는 수동으로 수정:
  ```
  올바른 형식: ["선택지1", "선택지2", "선택지3", "선택지4"]
  잘못된 형식: [선택지1, 선택지2, 선택지3, 선택지4]
  ```

### 문제 2: "Column not found" 오류

**원인**: CSV 헤더와 Supabase 컬럼명이 일치하지 않습니다.

**해결**:

- CSV 첫 행(헤더)을 확인:
  ```csv
  qnum,topic,prompt,choices,answer_index,hint,explanation,difficulty_label,difficulty_level
  ```
- 컬럼 매핑에서 수동으로 연결

### 문제 3: "Duplicate key" 오류

**원인**: `qnum`이 중복되었거나 이미 데이터가 있습니다.

**해결**:

```sql
-- 기존 데이터 삭제
DELETE FROM quizzes;

-- 또는 특정 qnum만 삭제
DELETE FROM quizzes WHERE qnum = 1;
```

### 문제 4: CSV 파일이 너무 큼

**원인**: Supabase는 한 번에 최대 5MB까지 업로드 가능합니다.

**해결**:

- CSV를 2개로 분할 (1~100, 101~200)
- 또는 Node.js 스크립트 사용 (`scripts/import-quizzes-from-csv.js`)

---

## 💡 팁

### 1. 업로드 전 미리보기

Python으로 변환 후 첫 5줄 확인:

```bash
head -n 6 quizzes_for_upload.csv
```

### 2. 중복 방지

업로드 전 기존 데이터 확인:

```sql
SELECT COUNT(*) FROM quizzes;
```

결과가 0이 아니면 기존 데이터 삭제 후 업로드:

```sql
DELETE FROM quizzes;
```

### 3. 백업

업로드 후 데이터 백업:

```sql
-- Supabase Dashboard > Database > Backups
-- 또는 SQL로 Export
COPY (SELECT * FROM quizzes ORDER BY qnum)
TO '/tmp/quizzes_backup.csv'
WITH CSV HEADER;
```

---

## 📊 예상 결과

업로드 성공 후:

```sql
SELECT
  difficulty_label,
  COUNT(*) as count
FROM quizzes
GROUP BY difficulty_label
ORDER BY
  CASE difficulty_label
    WHEN '쉬움' THEN 1
    WHEN '보통' THEN 2
    WHEN '어려움' THEN 3
  END;
```

예상 출력:

```
 difficulty_label | count
------------------+-------
 쉬움             |   ~60
 보통             |   ~90
 어려움           |   ~50
```

---

## ✅ 체크리스트

업로드 전:

- [ ] `quiz-schema.sql` 실행 완료
- [ ] Python 스크립트로 CSV 변환 완료
- [ ] 변환된 CSV 파일 확인 (`quizzes_for_upload.csv`)

업로드 중:

- [ ] Supabase Table Editor에서 `quizzes` 테이블 선택
- [ ] Import CSV 기능 사용
- [ ] 컬럼 매핑 확인

업로드 후:

- [ ] 총 개수 확인 (200개)
- [ ] 샘플 데이터 확인
- [ ] `choices` JSONB 배열 확인

---

## 🎯 다음 단계

업로드 완료 후:

1. ✅ 프론트엔드 연동 시작
2. ✅ `src/services/quizService.ts` 구현
3. ✅ 게임 페이지에서 퀴즈 불러오기 테스트

Happy Uploading! 🚀
