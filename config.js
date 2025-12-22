// config.js
// =======================================
// Supabase + 공통 설정 한 곳에서 관리
// =======================================

// 🔹 여기 두 개만 실제 값으로 교체하면 됨
window.SUPABASE_URL = 'https://agjdbxfcswyyudubkzid.supabase.co';      // 프로젝트 URL
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamRieGZjc3d5eXVkdWJremlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjkzOTAsImV4cCI6MjA4MDMwNTM5MH0.ef-g2CFemIk-Q3ppVQgDOTc8rmV9k2XF16bf2ujj6-w'; // anon key

// 홈/테스트 관련 테이블 이름 (원하는 대로 변경 가능)
window.TABLE_TESTS = "tests";
window.TABLE_TAGS = "tags";
window.TABLE_HOME_BANNER = "home_banner";
window.TABLE_HOME_POPULAR_TAGS = "home_popular_tags";
window.TABLE_HOME_TRENDING = "home_trending_tests";

// Supabase JS가 먼저 로드되어 있어야 함 (index.html에서 CDN 스크립트 추가 필수)
if (typeof supabase === "undefined") {
  console.error(
    "[config.js] supabase-js가 로드되지 않았습니다. index.html에 CDN 스크립트를 먼저 추가하세요."
  );
} else {
  window.supabaseClient = supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );
}

// ✅ Supabase Client 생성
if (typeof window.supabase !== "undefined") {
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
  window.hasSupabase = true;
  console.log("[config.js] Supabase 연결 완료");
} else {
  window.supabaseClient = null;
  window.hasSupabase = false;
}
