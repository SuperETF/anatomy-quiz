
import { quizData } from './data.js';

let usedQuestions = {
    bones: [뼈],
    muscles: [],
    both: []
};

let currentQuestion = null;

const stats = {
    total: 0,
    correct: 0
};

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

    if (usedIndexes.length >= questions.length) {
        usedIndexes.length = 0;
    }

    let availableIndexes = questions.map((_, index) => index)
        .filter(index => !usedIndexes.includes(index));
    
    let randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    usedIndexes.push(randomIndex);

    return questions[randomIndex];
}

function nextQuestion() {
    currentQuestion = getRandomQuestion();
    document.getElementById('question').textContent = currentQuestion.질문;
    document.getElementById('answer').value = '';
    document.getElementById('feedback').classList.add('hidden');
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const allAnswers = [
        currentQuestion.정답_구용어.toLowerCase(),
        currentQuestion.정답_신용어.toLowerCase(),
        currentQuestion.정답_영어.toLowerCase()
    ];

    const feedback = document.getElementById('feedback');
    stats.total++;
    
    if (allAnswers.includes(userAnswer)) {
        stats.correct++;
        feedback.textContent = `정답입니다! 👏\n${currentQuestion.설명}`;
        feedback.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        feedback.classList.add('bg-green-100', 'text-green-700');
    } else {
        feedback.textContent = `틀렸습니다. 정답은 "${allAnswers.join('" 또는 "')}"입니다.\n힌트: ${currentQuestion.힌트}`;
        feedback.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        feedback.classList.add('bg-red-100', 'text-red-700');
    }
    updateStats();
}

function updateStats() {
    document.getElementById('accuracy').textContent = 
        `${Math.round((stats.correct / stats.total) * 100)}%`;
    document.getElementById('answered').textContent = stats.total;
    document.getElementById('correct').textContent = stats.correct;
}

document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

document.getElementById('category').addEventListener('change', nextQuestion);

nextQuestion();
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
