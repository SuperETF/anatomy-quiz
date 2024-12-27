import { quizData } from "./data.js";

let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalQuestions = 0;
let filteredQuizData = [];
let timer;
let timerSeconds = 10;  // 문제당 10초로 설정

// 총 문제 수 표시
const totalQuestionsElement = document.getElementById("total-questions");
const categorySelect = document.getElementById("category");
const timerText = document.getElementById("timer-seconds");
const timerBar = document.getElementById("timer-bar");

// URL에서 닉네임 가져오기
const params = new URLSearchParams(window.location.search);
const nickname = params.get("nickname");
document.getElementById("nickname-display").innerText = `닉네임: ${nickname}`;

// 선택한 카테고리에 따라 퀴즈 필터링
function filterQuizByCategory(category) {
    console.log("선택된 카테고리:", category); // 카테고리 확인
    filteredQuizData = quizData.filter((item) => item["카테고리"] === category);
    totalQuestions = filteredQuizData.length;

    console.log("필터링된 퀴즈 데이터:", filteredQuizData);  // 필터링된 데이터 확인

    if (totalQuestions === 0) {
        alert("해당 카테고리에 문제가 없습니다!");
        return;
    }

    totalQuestionsElement.innerText = totalQuestions;
}

// 타이머 시작
function startTimer() {
    timerSeconds = 10;  // 매 문제마다 10초로 초기화
    timerText.innerText = timerSeconds;  // 남은 시간 텍스트 업데이트
    timerBar.style.width = "100%";  // 타이머 막대 초기화 (100%에서 시작)

    // 타이머 작동
    timer = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds -= 0.1;  // 0.1초씩 감소
            timerText.innerText = timerSeconds.toFixed(1); // 소수점 한 자리로 남은 시간 업데이트

            // 타이머 막대 너비를 점진적으로 감소시키며 애니메이션 효과 적용
            const widthPercentage = (timerSeconds / 10) * 100;
            timerBar.style.width = `${widthPercentage}%`;  // 타이머 막대 너비 업데이트
        } else {
            clearInterval(timer);  // 타이머 중지
            checkAnswer();  // 시간이 다 되면 자동으로 정답 확인
            nextQuestion();  // 문제를 넘기기
        }
    }, 100);  // 0.1초마다 업데이트
}

// 문제 로드 함수
function loadNextQuestion() {
    console.log("현재 문제 인덱스:", currentQuestionIndex);  // 현재 문제 인덱스 확인
    console.log("총 문제 수:", filteredQuizData.length);  // 총 문제 수 확인

    if (currentQuestionIndex >= filteredQuizData.length) {
        console.log("문제를 다 풀었습니다. 퀴즈 종료.");
        endQuiz();
        return;
    }

    const currentData = filteredQuizData[currentQuestionIndex];
    console.log("현재 문제 데이터:", currentData);  // 문제 데이터 확인

    document.getElementById("question").innerText = currentData?.["질문"] || "문제를 불러올 수 없습니다.";
    document.getElementById("answer").value = ""; // 입력값 초기화
    document.getElementById("feedback").classList.add("hidden"); // 피드백 숨김

    startTimer();  // 타이머 시작
}

// 정답 확인 함수
function checkAnswer() {
    const currentData = filteredQuizData[currentQuestionIndex];
    const userAnswer = document.getElementById("answer").value.trim();
    const correctAnswersArray = [
        currentData?.["정답_구용어"],
        currentData?.["정답_신용어"],
        currentData?.["정답_영어"],
    ];

    console.log("사용자가 입력한 답:", userAnswer);  // 사용자가 입력한 답 확인
    console.log("정답 목록:", correctAnswersArray);  // 정답 목록 확인

    const feedback = document.getElementById("feedback");
    const answerInput = document.getElementById("answer");
    const nextQuestionButton = document.getElementById("next-question");

    // 오답 처리
    if (!userAnswer || !correctAnswersArray.includes(userAnswer)) {
        feedback.innerText = `오답입니다! 정답은 ${correctAnswersArray.join(", ")}입니다.`;
        feedback.className = "mt-4 p-4 bg-red-100 text-red-700 rounded-md";

        // 입력란을 비활성화
        answerInput.disabled = true;  // 정답을 틀렸을 경우 입력란을 비활성화
    } else {
        // 정답 처리
        feedback.innerText = "정답입니다! 잘 하셨어요!";
        feedback.className = "mt-4 p-4 bg-green-100 text-green-700 rounded-md";
        correctAnswers++;

        // 통계 업데이트
        updateStats();  // 통계 업데이트 함수 호출
    }

    feedback.classList.remove("hidden");

    // 다음 문제 버튼을 항상 보이게 하기
    nextQuestionButton.style.display = "inline-block"; // 버튼 보이기

    // 문제 로드 후에는 타이머를 멈추고, 다음 문제로 이동할 수 있도록 설정
    clearInterval(timer);
}

// 다음 문제로 이동
function nextQuestion() {
    // 문제를 풀고 나면 입력란 초기화 및 비활성화 해제
    document.getElementById("answer").disabled = false;
    document.getElementById("next-question").style.display = "none";  // "다음 문제" 버튼 숨기기
    currentQuestionIndex++;  // 문제 인덱스 증가
    loadNextQuestion();  // 다음 문제 로드
}

// 통계 업데이트 함수
function updateStats() {
    // 푼 문제 수와 맞춘 문제 수
    const answered = currentQuestionIndex + 1;
    const accuracy = (correctAnswers / answered) * 100;

    // 통계 HTML에 반영
    document.getElementById("answered").innerText = `${answered} / ${totalQuestions}`;
    document.getElementById("correct").innerText = correctAnswers;
    document.getElementById("accuracy").innerText = `${accuracy.toFixed(1)}%`;  // 소수점 한 자리까지 정답률 표시
}

// 퀴즈 종료 함수
function endQuiz() {
    document.getElementById("quiz-section").classList.add("hidden");
    document.getElementById("stats-section").classList.add("hidden");
    document.getElementById("end-section").classList.remove("hidden");
    document.getElementById("final-score").innerText = `총 ${totalQuestions}문제 중 ${correctAnswers}문제를 맞추셨습니다.`;
}

// 다시 시작 함수
function restartQuiz() {
    window.location.href = "start.html";
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", () => {
    console.log("스크립트가 로드되었습니다.");
    filterQuizByCategory(categorySelect.value); // 초기 카테고리 설정
    loadNextQuestion(); // 첫 번째 문제 로드

    document.getElementById("check-answer").addEventListener("click", checkAnswer);
    document.getElementById("next-question").addEventListener("click", nextQuestion);
    document.getElementById("restart-quiz").addEventListener("click", restartQuiz);
});

// 카테고리 변경 이벤트 핸들러
categorySelect.addEventListener("change", (event) => {
    console.log("카테고리 변경:", event.target.value);  // 카테고리 변경 확인
    currentQuestionIndex = 0;
    correctAnswers = 0;
    filterQuizByCategory(event.target.value);
    loadNextQuestion();
});
