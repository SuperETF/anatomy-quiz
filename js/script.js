// 퀴즈 데이터
const quizData = {
    bones: [
        {
            question: "두개골의 가장 큰 뼈로, 뇌를 보호하는 역할을 하는 뼈의 이름은?",
            answer: "후두골",
            hint: "머리 뒤쪽에 위치한 뼈입니다."
        },
        {
            question: "척추를 구성하는 가장 아래쪽에 위치한 뼈의 이름은?",
            answer: "미골",
            hint: "꼬리뼈라고도 불립니다."
        }
    ],
    muscles: [
        {
            question: "팔을 들어올리는 데 주로 사용되는 어깨 근육의 이름은?",
            answer: "삼각근",
            hint: "어깨를 감싸고 있는 세모 모양의 근육입니다."
        },
        {
            question: "허벅지 앞쪽에 위치하며 무릎을 펴는 큰 근육의 이름은?",
            answer: "대퇴사두근",
            hint: "네 개의 근육머리로 구성되어 있습니다."
        }
    ]
};

// 현재 문제 저장
let currentQuestion = null;

// 통계 데이터
const stats = {
    total: 0,
    correct: 0
};

// 문제 가져오기
function getRandomQuestion() {
    const category = document.getElementById('category').value;
    let questions;

    if (category === 'both') {
        questions = [...quizData.bones, ...quizData.muscles];
    } else {
        questions = quizData[category];
    }

    return questions[Math.floor(Math.random() * questions.length)];
}

// 다음 문제 표시
function nextQuestion() {
    currentQuestion = getRandomQuestion();
    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('answer').value = '';
    document.getElementById('feedback').classList.add('hidden');
}

// 정답 확인
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const correctAnswer = currentQuestion.answer.toLowerCase();
    const feedback = document.getElementById('feedback');
    
    stats.total++;
    
    if (userAnswer === correctAnswer) {
        stats.correct++;
        feedback.textContent = '정답입니다! 👏';
        feedback.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        feedback.classList.add('bg-green-100', 'text-green-700');
    } else {
        feedback.textContent = `틀렸습니다. 정답은 "${currentQuestion.answer}"입니다. 힌트: ${currentQuestion.hint}`;
        feedback.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        feedback.classList.add('bg-red-100', 'text-red-700');
    }
    
    updateStats();
}

// 통계 업데이트
function updateStats() {
    document.getElementById('accuracy').textContent = 
        `${Math.round((stats.correct / stats.total) * 100)}%`;
    document.getElementById('answered').textContent = stats.total;
    document.getElementById('correct').textContent = stats.correct;
}

// Enter 키로 정답 제출
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// 카테고리 변경 시 새로운 문제 불러오기
document.getElementById('category').addEventListener('change', nextQuestion);

// 초기 문제 로드
nextQuestion();