const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Body parser (JSON 처리)
app.use(express.json());

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../public")));

// 캐시 방지
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

// 폴더 경로 설정
const folderPath = path.join(__dirname, "data");

// 폴더가 존재하지 않으면 생성
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`폴더 생성됨: ${folderPath}`);
}

// 기본 라우트
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 닉네임 저장 API
app.post("/api/save-nickname", (req, res) => {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ message: "닉네임이 필요합니다." });
    }

    // nicknames.txt 파일에 저장
    const filePath = path.join(folderPath, "nicknames.txt");
    fs.appendFileSync(filePath, `${nickname}\n`);
    console.log(`닉네임 저장됨: ${nickname}`);
    res.status(200).json({ message: "닉네임 저장 성공" });
});

// 닉네임 목록 조회 API
app.get("/api/nicknames", (req, res) => {
    const filePath = path.join(folderPath, "nicknames.txt");

    if (fs.existsSync(filePath)) {
        const nicknames = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
        return res.status(200).json({ nicknames });
    }

    res.status(404).json({ message: "닉네임이 저장되지 않았습니다." });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 실행 중입니다. http://localhost:${PORT}`);
});
