const express = require("express");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // 로컬 환경에서만 dotenv 사용

const app = express();

// Body parser (JSON 처리)
app.use(express.json());

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL || "https://gnpsmvuvrekdhaczmdxq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducHNtdnV2cmVrZGhhY3ptZHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyODI5NzIsImV4cCI6MjA1MDg1ODk3Mn0.W5KDZXz18pKcwM43zew90YCgfDVcAZTTZN3hsK2ib60";

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL 또는 KEY가 설정되지 않았습니다.");
    process.exit(1); // 설정 누락 시 종료
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 디버깅용 로그
const isDebug = process.env.DEBUG === "true";
if (isDebug) {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// 닉네임 저장 API
app.post("/save-nickname", async (req, res) => {
    const { nickname } = req.body;

    // 닉네임 유효성 검사
    if (!nickname || typeof nickname !== "string" || nickname.length < 2 || nickname.length > 50) {
        console.error("유효하지 않은 닉네임 입력:", nickname);
        return res.status(400).json({ message: "닉네임은 2~50자 이내의 문자열이어야 합니다." });
    }

    try {
        const { data, error } = await supabase
            .from("nickname") // 테이블 이름 확인
            .insert([{ nickname }]);

        if (error) {
            console.error("Supabase 에러:", error.message, error.details);
            return res.status(500).json({ message: "Supabase 닉네임 저장 실패", error: error.message });
        }

        res.status(200).json({ message: "닉네임 저장 성공", data });
    } catch (err) {
        console.error("API 처리 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생", error: err.message });
    }
});

// 닉네임 목록 조회 API
app.get("/nickname", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("nickname") // 테이블 이름 확인
            .select("*");

        if (error) {
            console.error("Supabase 조회 실패:", error.message, error.details);
            return res.status(500).json({ message: "Supabase 닉네임 조회 실패", error: error.message });
        }

        res.status(200).json({ nickname: data });
    } catch (err) {
        console.error("API 처리 중 오류 발생:", err);
        res.status(500).json({ message: "서버 오류 발생", error: err.message });
    }
});

// 로컬 환경 테스트용 코드 추가 (Vercel 환경에서는 무시됨)
if (process.env.NODE_ENV !== "production") {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_KEY ? "Exists" : "Not Found");


// Vercel 서버리스 함수로 내보내기
module.exports = app;
