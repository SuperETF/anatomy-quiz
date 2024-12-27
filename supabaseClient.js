const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL 또는 Key가 설정되지 않았습니다.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
