const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_FILE = 'c:\\Users\\dhwan\\Desktop\\work\\health-hero\\docs\\quizzes_rows.csv';

// Helper to escape CSV fields
const escapeCsv = (field) => {
    if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
};

// Harder question templates
const hardQuestions = [
    {
        topic: '생활 응급',
        templates: [
            {
                prompt: "심정지 환자 발생 시 자동심장충격기(AED) 패드 부착 위치로 올바른 것은? (성인 기준)",
                choices: ["오른쪽 쇄골 아래와 왼쪽 젖꼭지 아래 겨드랑이 선", "왼쪽 쇄골 아래와 오른쪽 젖꼭지 아래", "가슴 중앙과 등 중앙", "배꼽 위와 명치"],
                answer: 0,
                hint: "심장의 전기 흐름(우상 -> 좌하)을 생각해보세요.",
                explanation: "패드는 우측 쇄골 아래와 좌측 유두 아래 겨드랑이 선에 부착하여 심장에 전류가 대각선으로 흐르도록 해야 합니다."
            },
            {
                prompt: "기도 폐쇄로 의식이 있는 성인 환자에게 하임리히법을 시행할 때, 주먹을 쥔 손의 위치는 어디인가?",
                choices: ["배꼽과 명치 중간", "명치 바로 위", "배꼽 아래 3cm", "가슴 정중앙"],
                answer: 0,
                hint: "복부의 압력을 횡격막으로 전달해야 합니다.",
                explanation: "배꼽과 명치 중간에 주먹을 위치시키고 후상방으로 강하게 밀어올려 이물질을 배출시켜야 합니다."
            },
            {
                prompt: "화상 환자 응급처치 중 '저체온증'을 예방하기 위한 조치로 가장 적절하지 않은 것은?",
                choices: ["차가운 얼음물에 전신을 10분 이상 담근다", "화상 부위만 흐르는 물에 식힌다", "옷을 제거하기 힘들면 가위로 자른다", "깨끗한 천으로 감싸 체온을 유지한다"],
                answer: 0,
                hint: "급격한 체온 저하는 쇼크를 유발할 수 있습니다.",
                explanation: "얼음물에 전신을 담그거나 너무 오래 냉각하면 저체온증과 혈관 수축으로 인한 상처 악화를 초래할 수 있습니다."
            }
        ]
    },
    {
        topic: '약물·의약품 안전',
        templates: [
            {
                prompt: "아세트아미노펜(타이레놀 등) 과다 복용 시 가장 심각하게 손상될 수 있는 장기는?",
                choices: ["간", "신장", "위장", "폐"],
                answer: 0,
                hint: "이 장기는 우리 몸의 해독 작용을 담당합니다.",
                explanation: "아세트아미노펜은 간에서 대사되며, 과다 복용 시 심각한 간 독성을 유발하여 간부전을 일으킬 수 있습니다."
            },
            {
                prompt: "노인 환자가 여러 약물을 복용할 때 나타나는 '다약제 복용(Polypharmacy)'의 위험성으로 틀린 것은?",
                choices: ["약물 상호작용 감소", "낙상 위험 증가", "인지 기능 저하", "부작용 발생 확률 증가"],
                answer: 0,
                hint: "약이 많아지면 서로 부딪힐 확률이 어떻게 될까요?",
                explanation: "약물 개수가 늘어날수록 약물 간 상호작용의 위험은 기하급수적으로 증가합니다."
            }
        ]
    },
    {
        topic: '감염병·위생',
        templates: [
            {
                prompt: "결핵 의심 환자의 객담(가래) 검사 채취 시기로 가장 적절한 것은?",
                choices: ["아침 기상 직후 첫 가래", "식사 직후", "자기 전", "운동 후"],
                answer: 0,
                hint: "밤새 농축된 병원균이 가장 많은 시간대입니다.",
                explanation: "밤새 기관지 내에 고인 아침 첫 가래가 결핵균 검출률이 가장 높습니다."
            },
            {
                prompt: "비말 감염과 공기 감염의 가장 큰 차이점은 무엇인가?",
                choices: ["입자의 크기와 전파 거리", "바이러스의 독성", "감염되는 계절", "치료 방법"],
                answer: 0,
                hint: "무거운 입자는 떨어지고, 가벼운 입자는 둥둥 떠다닙니다.",
                explanation: "비말(5μm 이상)은 2m 이내로 떨어지지만, 공기 감염(비말핵, 5μm 미만)은 공기 중에 떠다니며 멀리 전파될 수 있습니다."
            }
        ]
    },
    {
        topic: '구강·눈·피부',
        templates: [
            {
                prompt: "치아가 완전히 빠졌을 때(치아 탈구), 치근막 손상을 최소화하기 위한 보관액으로 가장 적절하지 않은 것은?",
                choices: ["수돗물", "우유", "생리식염수", "환자의 타액(입안)"],
                answer: 0,
                hint: "삼투압 차이로 세포가 파괴될 수 있습니다.",
                explanation: "수돗물은 체액과 삼투압이 달라 치근막 세포를 파괴할 수 있으므로, 우유나 생리식염수, 타액에 보관해야 합니다."
            },
            {
                prompt: "화학 물질이 눈에 들어갔을 때 가장 우선적인 응급처치는?",
                choices: ["즉시 흐르는 물로 15분 이상 세척", "중화제 점안", "눈을 비벼 물질 제거", "안대를 하고 병원 이동"],
                answer: 0,
                hint: "희석과 제거가 최우선입니다.",
                explanation: "화학 화상은 즉시 다량의 흐르는 물이나 생리식염수로 15~20분 이상 세척하여 물질을 씻어내는 것이 시력 보존에 결정적입니다."
            }
        ]
    },
    {
        topic: '정신건강·생활습관',
        templates: [
            {
                prompt: "수면 무호흡증이 장기화될 경우 발생할 수 있는 합병증으로 거리가 먼 것은?",
                choices: ["저혈압", "고혈압", "뇌졸중", "심근경색"],
                answer: 0,
                hint: "산소 부족은 교감신경을 항진시켜 혈관에 압력을 줍니다.",
                explanation: "수면 무호흡증은 교감신경 항진으로 혈압을 높여 고혈압, 심뇌혈관 질환의 위험을 증가시킵니다. 저혈압과는 거리가 멉니다."
            }
        ]
    },
    {
        topic: '민간요법·오해',
        templates: [
            {
                prompt: "벌에 쏘였을 때 된장을 바르는 민간요법이 위험한 주된 이유는?",
                choices: ["2차 세균 감염 위험", "벌독의 흡수 촉진", "통증 악화", "알레르기 반응 감소"],
                answer: 0,
                hint: "된장은 멸균된 약품이 아닙니다.",
                explanation: "된장 등을 바르면 상처 부위를 통해 파상풍균 등 세균에 의한 2차 감염이 발생할 수 있어 매우 위험합니다."
            }
        ]
    }
];

// Generate 200 questions
const generateQuestions = () => {
    // Read existing file
    let existingContent = '';
    try {
        existingContent = fs.readFileSync(OUTPUT_FILE, 'utf8');
    } catch (e) {
        console.error("File not found");
        return;
    }

    const lines = existingContent.split('\n');
    // Keep header + first 200 questions (assuming header is line 0, q1 is line 1... q200 is line 200)
    // Actually, let's just look for qnum.
    // The CSV format is: id,qnum,...

    const validLines = [];
    let maxQnum = 0;

    for (const line of lines) {
        const parts = line.split(',');
        if (parts.length < 2) continue; // Skip empty lines

        // Check if it's the header
        if (parts[1] === 'qnum') {
            validLines.push(line);
            continue;
        }

        const qnum = parseInt(parts[1]);
        if (!isNaN(qnum) && qnum <= 200) {
            validLines.push(line);
            if (qnum > maxQnum) maxQnum = qnum;
        }
    }

    console.log(`Retained ${validLines.length} lines (Header + ${validLines.length - 1} questions).`);

    const newQuestions = [];
    const difficulties = ['보통', '어려움'];

    for (let i = 0; i < 200; i++) {
        const qnum = 201 + i;

        // Select a random category and template
        const category = hardQuestions[i % hardQuestions.length];
        const template = category.templates[i % category.templates.length];

        // Add some variation to the prompt to ensure uniqueness if we loop
        const variation = Math.floor(i / hardQuestions.length) + 1;
        const prompt = variation > 1 ? `${template.prompt} (유형 ${variation})` : template.prompt;

        const difficultyLabel = difficulties[i % difficulties.length];
        const difficultyLevel = difficultyLabel === '어려움' ? 3 : 2;

        const row = [
            crypto.randomUUID(), // id
            qnum, // qnum
            category.topic, // topic
            escapeCsv(prompt), // prompt
            escapeCsv(JSON.stringify(template.choices)), // choices
            template.answer, // answer_index
            escapeCsv(template.hint), // hint
            escapeCsv(template.explanation), // explanation
            difficultyLabel, // difficulty_label
            difficultyLevel, // difficulty_level
            new Date().toISOString(), // created_at
            new Date().toISOString() // updated_at
        ].join(',');

        newQuestions.push(row);
    }

    const finalContent = validLines.join('\n') + '\n' + newQuestions.join('\n');

    try {
        fs.writeFileSync(OUTPUT_FILE, finalContent);
        console.log('Successfully rewrote CSV with 200 hard questions.');
    } catch (error) {
        console.error('Error writing to CSV:', error);
    }
};

generateQuestions();
