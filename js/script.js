import quizData from './data.js';

// 사용된 문제를 추적하는 배열 추가
let usedQuestions = {
    bones: [],
    muscles: [],
    both: []
};

// 현재 문제 저장
let currentQuestion = null;

// 통계 데이터
const stats = {
    total: 0,
    correct: 0
};

// 문제 가져오기 함수 수정
function getRandomQuestion() {
    const category = document.getElementById('category').value;
    let questions;
    let usedIndexes;

    if (category === 'both') {
        questions = [...quizData.bones, ...quizData.muscles];
        usedIndexes = usedQuestions.both;
    } else {
        questions = quizData[category];
        usedIndexes = usedQuestions[category];
    }

    // 모든 문제를 다 풀었으면 사용된 문제 목록 초기화
    if (usedIndexes.length >= questions.length) {
        usedIndexes.length = 0;
    }

    // 아직 사용하지 않은 문제 중에서 랜덤 선택
    let availableIndexes = questions.map((_, index) => index)
        .filter(index => !usedIndexes.includes(index));
    
    let randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    usedIndexes.push(randomIndex);

    return questions[randomIndex];
}

// 다음 문제 표시
function nextQuestion() {
    currentQuestion = getRandomQuestion();
    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('answer').value = '';
    document.getElementById('feedback').classList.add('hidden');
}

// 정답 확인 (구용어, 신용어, 영어 모두 허용)
function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();

    // 정답을 확장: 구용어, 신용어, 영어 모두 포함
    const allAnswers = [
        currentQuestion.정답_구용어.toLowerCase(),
        currentQuestion.정답_신용어.toLowerCase(),
        currentQuestion.정답_영어.toLowerCase()
    ];

    const feedback = document.getElementById('feedback');
    stats.total++;
    
    if (allAnswers.includes(userAnswer)) {
        stats.correct++;
        feedback.textContent = `정답입니다! 👏\n${currentQuestion.explanation}`;
        feedback.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        feedback.classList.add('bg-green-100', 'text-green-700');
    } else {
        feedback.textContent = `틀렸습니다. 정답은 "${allAnswers.join('" 또는 "')}"입니다.\n힌트: ${currentQuestion.hint}`;
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

// 전역에서 함수 사용 가능하도록 설정
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
