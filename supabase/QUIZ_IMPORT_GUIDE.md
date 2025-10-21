# 퀴즈 데이터 임포트 가이드

Health Hero 프로젝트의 퀴즈 데이터를 Supabase에 임포트하는 방법을 설명합니다.

## 📋 목차

1. [사전 준비](#사전-준비)
2. [방법 1: Supabase SQL Editor 사용 (권장)](#방법-1-supabase-sql-editor-사용-권장)
3. [방법 2: Node.js 스크립트 사용](#방법-2-nodejs-스크립트-사용)
4. [방법 3: CSV 직접 업로드](#방법-3-csv-직접-업로드)
5. [데이터 확인](#데이터-확인)

---

## 사전 준비

### 1. 기본 스키마 실행 확인

`supabase/schema.sql`이 이미 실행되었는지 확인:

```sql
-- Supabase SQL Editor에서 확인
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'user_profiles';
```

결과가 나오면 ✅ 실행 완료

### 2. 환경 변수 설정 확인

`.env.local` 파일에 다음 환경 변수가 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Node.js 스크립트 사용 시 필요
```

---

## 방법 1: Supabase SQL Editor 사용 (권장)

가장 빠르고 안전한 방법입니다.

### Step 1: 퀴즈 테이블 생성

1. Supabase Dashboard 접속
2. **SQL Editor** 메뉴 클릭
3. **New query** 클릭
4. `supabase/quiz-schema.sql` 파일 내용 전체 복사
5. SQL Editor에 붙여넣기
6. **Run** 클릭

✅ 성공 메시지:

```
Success. No rows returned
```

### Step 2: 샘플 데이터 추가 (선택)

1. **New query** 클릭
2. `supabase/import-quizzes.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. **Run** 클릭

✅ 10개의 샘플 퀴즈가 추가됩니다.

### Step 3: 전체 데이터 임포트

**방법 1-A: CSV 직접 업로드 (가장 쉬움)**

1. Supabase Dashboard > **Table Editor** 메뉴
2. `quizzes` 테이블 선택
3. **Insert** > **Import data from CSV** 클릭
4. CSV 파일 선택: `health-hero_Q1-200_v2_4choice_with_hints_ko_2025-10-14_NO-GENERIC-CHOICE4_fromTXT.csv`
5. 컬럼 매핑 확인:
   - `qnum` → `qnum`
   - `topic` → `topic`
   - `prompt` → `prompt`
   - `choice1`, `choice2`, `choice3`, `choice4` → **수동으로 `choices` JSONB 배열로 변환 필요**
   - `answer_index` → `answer_index`
   - `hint` → `hint`
   - `explanation` → `explanation`
   - `difficulty_label` → `difficulty_label`
6. **Import** 클릭

⚠️ **주의**: CSV 직접 업로드 시 `choices` 컬럼을 JSONB 배열로 변환해야 합니다. 이것이 복잡하다면 **방법 2 (Node.js 스크립트)** 사용을 권장합니다.

**방법 1-B: SQL INSERT 문 생성**

Python 스크립트로 CSV를 SQL INSERT 문으로 변환:

```python
# scripts/csv-to-sql.py
import csv
import json

with open('health-hero_Q1-200_v2_4choice_with_hints_ko_2025-10-14_NO-GENERIC-CHOICE4_fromTXT.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if not row['qnum']:
            continue

        difficulty_map = {'쉬움': 1, '보통': 2, '어려움': 3}
        choices = [row['choice1'], row['choice2'], row['choice3'], row['choice4']]

        sql = f"""INSERT INTO quizzes (qnum, topic, prompt, choices, answer_index, hint, explanation, difficulty_label, difficulty_level) VALUES
({row['qnum']}, '{row['topic'].replace("'", "''")}', '{row['prompt'].replace("'", "''")}',
 '{json.dumps(choices, ensure_ascii=False)}'::jsonb,
 {row['answer_index']}, '{row['hint'].replace("'", "''")}', '{row['explanation'].replace("'", "''")}',
 '{row['difficulty_label']}', {difficulty_map.get(row['difficulty_label'], 2)});"""

        print(sql)
```

실행 후 출력된 SQL을 SQL Editor에서 실행합니다.

---

## 방법 2: Node.js 스크립트 사용

자동화된 방법으로, CSV를 직접 파싱하여 Supabase에 업로드합니다.

### Step 1: 패키지 설치

```bash
npm install csv-parser dotenv
```

### Step 2: 환경 변수 설정

`.env.local` 파일에 Service Role Key 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 중요!
```

**Service Role Key 찾기**:

1. Supabase Dashboard > **Settings** > **API**
2. **Project API keys** 섹션
3. `service_role` 키 복사

⚠️ **주의**: Service Role Key는 절대 프론트엔드나 공개 저장소에 노출하지 마세요!

### Step 3: CSV 파일 경로 확인

`scripts/import-quizzes-from-csv.js` 파일에서 CSV 경로 수정:

```javascript
const csvFilePath = path.join(
  __dirname,
  "..",
  "..",
  "Downloads", // 실제 CSV 파일 위치로 수정
  "health-hero_Q1-200_v2_4choice_with_hints_ko_2025-10-14_NO-GENERIC-CHOICE4_fromTXT.csv"
);
```

### Step 4: 스크립트 실행

```bash
node scripts/import-quizzes-from-csv.js
```

✅ 성공 출력:

```
🚀 퀴즈 데이터 임포트 시작...

📖 CSV 파일 읽는 중: ...
✅ CSV 파싱 완료: 200개 퀴즈 발견

📤 배치 1 업로드 중... (1-100)
✅ 배치 1 업로드 성공
📤 배치 2 업로드 중... (101-200)
✅ 배치 2 업로드 성공

==================================================
📊 임포트 결과:
   - 총 퀴즈: 200개
   - 성공: 200개
   - 실패: 0개
==================================================

✅ 모든 작업 완료!
```

---

## 방법 3: CSV 직접 업로드

Supabase의 CSV 임포트 기능을 사용하는 간단한 방법입니다.

### Step 1: CSV 전처리

CSV 파일을 Supabase 형식에 맞게 수정:

1. `choice1`, `choice2`, `choice3`, `choice4` 컬럼을 `choices` 컬럼으로 병합
2. `choices` 컬럼 값: `["선택지1", "선택지2", "선택지3", "선택지4"]` 형식
3. `difficulty_level` 컬럼 추가 (1: 쉬움, 2: 보통, 3: 어려움)

예시:

```csv
qnum,topic,prompt,choices,answer_index,hint,explanation,difficulty_label,difficulty_level
1,감기·호흡기 오해,감기에 항생제를 먹으면 빨리 낫는다.,"[""대부분 맞다"", ""대부분 아니다"", ""코로나일 때만 맞다"", ""증상이 좋아지면 항생제는 바로 중단해도 된다""]",1,감기의 주된 원인...,감기의 상당수는...,쉬움,1
```

### Step 2: Supabase에 업로드

1. Supabase Dashboard > **Table Editor** > `quizzes` 테이블
2. **Insert** > **Import data from CSV**
3. 전처리한 CSV 파일 선택
4. 컬럼 매핑 확인
5. **Import** 클릭

---

## 데이터 확인

### 1. 임포트된 데이터 개수 확인

```sql
SELECT COUNT(*) FROM quizzes;
```

예상 결과: `200`

### 2. 샘플 데이터 확인

```sql
SELECT qnum, topic, prompt, difficulty_label
FROM quizzes
ORDER BY qnum
LIMIT 10;
```

### 3. 난이도별 분포 확인

```sql
SELECT difficulty_label, COUNT(*) as count
FROM quizzes
GROUP BY difficulty_label
ORDER BY difficulty_level;
```

### 4. 토픽별 분포 확인

```sql
SELECT topic, COUNT(*) as count
FROM quizzes
GROUP BY topic
ORDER BY count DESC;
```

### 5. 특정 퀴즈 상세 확인

```sql
SELECT * FROM quizzes WHERE qnum = 1;
```

---

## 문제 해결

### 문제 1: "relation 'quizzes' does not exist"

**원인**: `quiz-schema.sql`이 실행되지 않았습니다.

**해결**:

1. Supabase SQL Editor에서 `quiz-schema.sql` 실행
2. 테이블 생성 확인: `\dt` 또는 Table Editor에서 확인

### 문제 2: "duplicate key value violates unique constraint"

**원인**: `qnum`이 중복됩니다.

**해결**:

```sql
-- 중복 데이터 삭제
DELETE FROM quizzes WHERE qnum IN (
  SELECT qnum FROM quizzes GROUP BY qnum HAVING COUNT(*) > 1
);
```

또는 `upsert` 사용:

```javascript
await supabase.from("quizzes").upsert(batch, { onConflict: "qnum" });
```

### 문제 3: Node.js 스크립트 실행 오류

**원인**: 환경 변수 또는 패키지 미설치

**해결**:

1. `.env.local` 파일 확인
2. `npm install csv-parser dotenv` 실행
3. CSV 파일 경로 확인

---

## 추천 방법 요약

| 방법                         | 난이도 | 속도      | 추천 대상   |
| ---------------------------- | ------ | --------- | ----------- |
| **방법 1: SQL Editor**       | ⭐⭐⭐ | 빠름      | 개발자      |
| **방법 2: Node.js 스크립트** | ⭐⭐   | 매우 빠름 | 자동화 선호 |
| **방법 3: CSV 직접 업로드**  | ⭐     | 느림      | 비개발자    |

**추천**: **방법 2 (Node.js 스크립트)** - 가장 안전하고 빠르며 자동화된 방법

---

## 다음 단계

퀴즈 데이터 임포트 완료 후:

1. ✅ 데이터 확인
2. ✅ RLS 정책 테스트
3. ✅ 프론트엔드 연동 (`src/services/quizService.ts`)
4. ✅ 게임 로직 구현

Happy Coding! 🚀
