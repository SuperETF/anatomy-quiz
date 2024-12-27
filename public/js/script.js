import { quizData } from './data.js'; // 문제 데이터 가져오기

let usedQuestions = [];
let currentQuestion = null;
let timer;

// 통계 데이터 초기화
const stats = {
   total: 0,
   correct: 0
};

// 랜덤 문제 가져오기
function getRandomQuestion() {
    let questions = quizData.filter(q => q.카테고리 === "뼈");

    if (usedQuestions.length >= questions.length) {
        usedQuestions = [];
    }

    let availableIndexes = questions.map((_, index) => index)
        .filter(index => !usedQuestions.includes(index));
    
    let randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    usedQuestions.push(randomIndex);

    return questions[randomIndex];
}

// 다음 문제 표시
function nextQuestion() {
    // 현재 문제를 확인하지 않은 경우 틀린 문제로 처리
    if (currentQuestion && !document.getElementById('answer').value.trim()) {
        markIncorrect(); // 답이 없을 경우 틀린 문제로 처리
    }

    try {
        currentQuestion = getRandomQuestion();
        document.getElementById('question').textContent = currentQuestion.질문;
        document.getElementById('answer').value = '';
        document.getElementById('feedback').classList.add('hidden');
        resetTimerBar();
    } catch (error) {
        console.error('Error in nextQuestion:', error);
        document.getElementById('question').textContent = '문제를 불러오는 중 오류가 발생했습니다.';
    }
}

// 정답 확인
function checkAnswer() {
    clearInterval(timer);
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const correctAnswers = [
        currentQuestion.정답_구용어.toLowerCase(),
        currentQuestion.정답_신용어.toLowerCase(),
        currentQuestion.정답_영어.toLowerCase()
    ];

    const feedback = document.getElementById('feedback');
    stats.total++;
    
    if (correctAnswers.includes(userAnswer)) {
        stats.correct++;
        feedback.textContent = `정답입니다! 👏\n${currentQuestion.설명}`;
        feedback.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        feedback.classList.add('bg-green-100', 'text-green-700');
    } else {
        feedback.textContent = `틀렸습니다. 정답은 \n구용어: ${currentQuestion.정답_구용어}\n신용어: ${currentQuestion.정답_신용어}\n영어: ${currentQuestion.정답_영어}\n\n힌트: ${currentQuestion.힌트}`;
        feedback.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        feedback.classList.add('bg-red-100', 'text-red-700');
    }
    
    updateStats();
    setTimeout(nextQuestion, 2000); // 2초 후에 다음 문제로 넘어갑니다.
}

// 통계 업데이트
function updateStats() {
    document.getElementById('accuracy').textContent = 
        `${Math.round((stats.correct / stats.total) * 100)}%`;
    document.getElementById('answered').textContent = `${stats.total} / ${quizData.length}`;
    document.getElementById('correct').textContent = stats.correct;
}

// 타이머 바 시작
function startTimerBar(duration) {
    const timerBar = document.getElementById('timer-bar');
    let timeLeft = duration;
    let width = 100;

    timer = setInterval(() => {
        timeLeft--;
        width = (timeLeft / duration) * 100;
        timerBar.style.width = `${width}%`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerBar.style.width = "0%";
            markIncorrect();
            nextQuestion();
        }
    }, 1000);
}

// 타이머 바 초기화
function resetTimerBar() {
    clearInterval(timer);
    document.getElementById('timer-bar').style.width = "100%";
    startTimerBar(30); // 30초 타이머
}

// 시간 초과 처리
function markIncorrect() {
    stats.total++;
    updateStats();
    const feedback = document.getElementById('feedback');
    feedback.textContent = `시간 초과! 정답은 \n구용어: ${currentQuestion.정답_구용어}\n신용어: ${currentQuestion.정답_신용어}\n영어: ${currentQuestion.정답_영어}\n\n힌트: ${currentQuestion.힌트}`;
    feedback.classList.remove('hidden', 'bg-green-100', 'text-green-700');
    feedback.classList.add('bg-red-100', 'text-red-700');
}

// Enter 키로 정답 제출
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// 전역 함수로 등록
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 총 문항 수 표시
    document.getElementById('total-questions').textContent = quizData.length;
    nextQuestion();
});
