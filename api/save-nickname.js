const supabase = require("../supabaseClient"); // Supabase 클라이언트 가져오기

module.exports = async (req, res) => {
    console.log("HTTP 요청 메서드:", req.method); // 디버깅 로그

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { nickname } = req.body; // POST 요청의 body에서 데이터 가져오기

    console.log("요청 닉네임:", nickname); // 디버깅 로그

    if (!nickname || typeof nickname !== "string") {
        console.error("유효하지 않은 닉네임");
        return res.status(400).json({ message: "닉네임이 유효하지 않습니다." });
    }

    try {
        const { data, error } = await supabase
            .from("nickname") // Supabase 테이블 이름
            .insert([{ nickname }]); // 데이터 삽입

        if (error) {
            console.error("Supabase 저장 실패:", error);
            return res.status(500).json({ message: "Supabase 닉네임 저장 실패" });
        }

        res.status(200).json({ message: "닉네임 저장 성공", data });
    } catch (err) {
        console.error("서버 내부 오류:", err.message);
        res.status(500).json({ message: "서버 내부 오류" });
    }
};
