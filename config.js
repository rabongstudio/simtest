// config.js
// =======================================
// Supabase + 공통 설정 한 곳에서 관리
// =======================================

// 🔹 여기 두 개만 실제 값으로 교체하면 됨
window.SUPABASE_URL = 'https://agjdbxfcswyyudubkzid.supabase.co';      // 프로젝트 URL
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamRieGZjc3d5eXVkdWJremlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjkzOTAsImV4cCI6MjA4MDMwNTM5MH0.ef-g2CFemIk-Q3ppVQgDOTc8rmV9k2XF16bf2ujj6-w'; // anon key

// 🔹 테이블 이름도 여기서만 관리
window.TABLE_TESTS = 'tests';
window.TABLE_TAGS = 'tags';
window.TABLE_HOME_BANNER = 'home_banner';
window.TABLE_HOME_POPULAR_TAGS = 'home_popular_tags';
window.TABLE_HOME_TRENDING = 'home_trending_tests';

// 🔹 Supabase 클라이언트 전역 생성
window.supabaseClient = supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// 필요하면 나중에 공통 함수들도 여기 넣어도 됨
// 예: 플레이 수 포맷팅, 에러 공통 처리 등
