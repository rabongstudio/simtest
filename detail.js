// =========================================================
// detail.js
// - detail.html?id=xx
// - Supabase 연동
// - 조회수 증가
// - 태그 출력
// - 비슷한 테스트 추천
// - Supabase 실패 시 더미 fallback
// =========================================================

// ---------------------------------------------------------
// (0) 유틸
// ---------------------------------------------------------

function getTestIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

function formatPlays(num) {
  if (!num) return "0";
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, "") + "만";
  }
  return num.toLocaleString("ko-KR");
}

// Supabase 준비 여부
const hasSupabase = window.hasSupabase;

// ---------------------------------------------------------
// (1) 화면 렌더링
// ---------------------------------------------------------

function renderDetail(test) {
  if (!test) return;

  document.getElementById("detail-title").textContent = test.title;
  document.getElementById("detail-description").textContent =
    test.description || "설명이 준비 중입니다.";
  document.getElementById("detail-thumbnail").src =
    test.thumbnail_url || test.imageUrl;
  document.getElementById("detail-plays").textContent =
    `${formatPlays(test.play_count || test.plays)}명 참여`;

  // 태그
  renderTags(test.tags || (test.main_tag ? [test.main_tag] : []));

  // 시작 버튼
  const startBtn = document.getElementById("btn-start-test");
  startBtn.onclick = () => {
    location.href = `play.html?id=${test.id}`;
  };
}

function renderTags(tags) {
  const container = document.getElementById("detail-tags");
  if (!container) return;

  container.innerHTML = tags
    .map(
      (tag) => `
      <span class="tag-chip">#${tag}</span>
    `
    )
    .join("");
}

function renderRelatedTests(tests) {
  const container = document.getElementById("related-tests");
  if (!container) return;

  container.innerHTML = tests
    .map(
      (test) => `
      <div class="test-card-mini"
           onclick="location.href='detail.html?id=${test.id}'">
        <img src="${test.thumbnail_url || test.imageUrl}"
             alt="${test.title}"
             onerror="this.src='https://via.placeholder.com/300x200?text=TEST'"/>
        <p>${test.title}</p>
      </div>
    `
    )
    .join("");
}

// ---------------------------------------------------------
// (2) Supabase에서 상세 데이터 조회
// ---------------------------------------------------------

async function fetchDetailFromSupabase(testId) {
  const TABLE_TESTS = window.TABLE_TESTS || "tests";
  const TABLE_TEST_TAGS = "test_tags";
  const TABLE_TAGS = "tags";

  // 1️⃣ 테스트 상세
  const { data: test, error } = await window.supabaseClient
    .from(TABLE_TESTS)
    .select("*")
    .eq("id", testId)
    .eq("is_active", true)
    .single();

  if (error || !test) {
    throw new Error("테스트 상세 조회 실패");
  }

  // 2️⃣ 태그 조회 (다대다)
  const { data: tagRows } = await window.supabaseClient
    .from(TABLE_TEST_TAGS)
    .select(
      `
      tag:tag_id (
        name
      )
    `
    )
    .eq("test_id", testId);

  const tags =
    tagRows && tagRows.length
      ? tagRows.map((r) => r.tag.name)
      : test.main_tag
      ? [test.main_tag]
      : [];

  test.tags = tags;

  return test;
}

// ---------------------------------------------------------
// (3) 조회수 증가
// ---------------------------------------------------------

async function increasePlayCount(testId, currentCount) {
  if (!hasSupabase) return;

  try {
    await window.supabaseClient
      .from("tests")
      .update({ play_count: (currentCount || 0) + 1 })
      .eq("id", testId);
  } catch (e) {
    console.warn("조회수 증가 실패:", e);
  }
}

// ---------------------------------------------------------
// (4) 비슷한 테스트 추천
// ---------------------------------------------------------

async function fetchRelatedTests(mainTag, excludeId) {
  if (!hasSupabase || !mainTag) return [];

  const { data, error } = await window.supabaseClient
    .from("tests")
    .select("id, title, thumbnail_url")
    .eq("main_tag", mainTag)
    .neq("id", excludeId)
    .eq("is_active", true)
    .limit(4);

  if (error) return [];
  return data || [];
}

// ---------------------------------------------------------
// (5) 더미 데이터 (fallback)
// ---------------------------------------------------------

function getDummyDetail(id) {
  return {
    id,
    title: "붕어빵으로 알아보는 성격",
    description:
      "붕어빵 속을 고르면 당신의 성격 유형을 알 수 있어요!",
    thumbnail_url: "img/test3.jpg",
    play_count: 8000,
    main_tag: "음식심리",
    tags: ["음식심리"],
  };
}

// ---------------------------------------------------------
// (6) 페이지 초기화
// ---------------------------------------------------------

async function initDetailPage() {
  const testId = getTestIdFromQuery();
  if (!testId) return;

  let testDetail = null;

  if (hasSupabase) {
    try {
      testDetail = await fetchDetailFromSupabase(testId);

      // 조회수 증가 (렌더 후 비동기)
      increasePlayCount(testId, testDetail.play_count);

      // 비슷한 테스트
      const related = await fetchRelatedTests(
        testDetail.main_tag,
        testId
      );
      renderRelatedTests(related);
    } catch (e) {
      console.error("Supabase 상세 로딩 실패, 더미 사용:", e);
      testDetail = getDummyDetail(testId);
    }
  } else {
    testDetail = getDummyDetail(testId);
  }

  renderDetail(testDetail);
}

document.addEventListener("DOMContentLoaded", initDetailPage);
