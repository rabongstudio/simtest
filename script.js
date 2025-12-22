// =========================================================
// 심리테스트 홈 화면 스크립트
// - Supabase + 더미 데이터 둘 다 지원
// - Supabase 실패/미설정 시 자동으로 더미 데이터 사용
// =========================================================

// ---------------------------------------------------------
// (0) 더미 데이터 (실제 구축 시에는 Supabase로 대체)
// ---------------------------------------------------------

const DUMMY_TESTS = [
  {
    id: 1,
    title: "[MBTI] 나의 연애 점수는 과연 몇 점?",
    image: "img/test1.jpg",
    plays: 15000,
    tag: "MBTI",
    isNew: true,
  },
  {
    id: 2,
    title: "퇴근 후 내 성향 테스트: 나는 혼자 vs 친구?",
    image: "img/test2.jpg",
    plays: 12000,
    tag: "라이프스타일",
    isNew: false,
  },
  {
    id: 3,
    title: "붕어빵 선택으로 알아보는 나의 성격 유형",
    image: "img/test3.jpg",
    plays: 8000,
    tag: "음식심리",
    isNew: true,
  },
  {
    id: 4,
    title: "갑자기 계획이 취소된다면? 반응 테스트",
    image: "img/test4.jpg",
    plays: 6000,
    tag: "상황심리",
    isNew: false,
  },
  {
    id: 5,
    title: "내가 직장 상사라면 어떤 스타일일까?",
    image: "img/test5.jpg",
    plays: 5500,
    tag: "직장인",
    isNew: true,
  },
  {
    id: 6,
    title: "친구들과의 약속 스타일 테스트",
    image: "img/test6.jpg",
    plays: 4800,
    tag: "대인관계",
    isNew: false,
  },
];

const DUMMY_TAGS = [
  "MBTI",
  "연애",
  "직장인",
  "힐링",
  "초간단",
  "음식심리",
  "대인관계",
  "오늘기분",
];

// Supabase 준비 여부 체크 (config.js에서 supabaseClient 만든 경우)
const hasSupabase =
  typeof window !== "undefined" &&
  typeof window.supabaseClient !== "undefined";

// ---------------------------------------------------------
// (1) 공통 유틸
// ---------------------------------------------------------

// 숫자를 K / 만 단위로 포맷 (15000 -> 1.5만)
function formatPlays(num) {
  if (typeof num !== "number") return "";
  if (num >= 10000) {
    const n = (num / 10000).toFixed(1).replace(/\.0$/, "");
    return `${n}만`;
  }
  return num.toLocaleString("ko-KR");
}

// 테스트 카드 HTML 생성
function createTestCard(test) {
  const tag = test.mainTag || test.tag || "";
  const isMbti = tag.toUpperCase().includes("MBTI");
  const isHot = test.plays >= 10000;
  const isNew = !!test.isNew;

  const imageUrl = test.imageUrl || test.thumbnail_url || test.image;

  return `
    <div class="test-card" onclick="location.href='detail.html?id=${test.id}'">
      <div class="card-top-row">
        <div class="card-badges">
          ${
            tag
              ? `<span class="badge badge-mbti">${isMbti ? "MBTI" : tag}</span>`
              : ""
          }
          ${isHot ? `<span class="badge badge-hot">HOT</span>` : ""}
          ${isNew ? `<span class="badge badge-new">NEW</span>` : ""}
        </div>
        <div class="card-bookmark">☆</div>
      </div>

      <div class="card-image-wrap">
        <img
          src="${imageUrl}"
          alt="${test.title}"
          class="card-image"
          onerror="this.onerror=null;this.src='https://via.placeholder.com/600x750/ff6b81/ffffff?text=TEST+${test.id}'"
        />
        <div class="card-image-overlay"></div>
      </div>

      <div class="card-content">
        <div class="card-title">
          ${test.title}
        </div>
        <div class="card-meta-row">
          <div class="card-meta-left">
            <span>▶ <span>${formatPlays(test.plays)} 플레이</span></span>
          </div>
          <div class="card-meta-right">
            심테공방
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------
// (2) 상단 배너(오늘의 추천) 렌더링
// ---------------------------------------------------------

function renderHighlightFromBanner(banner) {
  const highlightSection = document.getElementById("highlight-carousel");
  if (!highlightSection || !banner || !banner.test) return;

  const test = banner.test;
  const tag = test.mainTag || test.tag || "심테공방";
  const isMbti = tag.toUpperCase().includes("MBTI");

  const pillText = banner.title || (isMbti ? "오늘의 MBTI 추천" : "오늘의 추천 테스트");
  const subText =
    banner.subtitle || "지금 딱, 내 상태를 콕 집어주는 심리 테스트 한 판.";
  const ctaLabel = banner.ctaLabel || "바로 시작";

  const imageUrl = test.imageUrl || test.thumbnail_url || test.image;

  highlightSection.innerHTML = `
    <div class="highlight-card" onclick="location.href='detail.html?id=${test.id}'">
      <div class="highlight-pill">
        <span>✨</span>
        <span>${pillText}</span>
      </div>
      <div class="highlight-title">
        ${test.title}
      </div>
      <div class="highlight-subtitle">
        ${subText}
      </div>
      <div class="highlight-bottom">
        <div class="highlight-meta">
          <span>▶ <span>${formatPlays(test.plays)}명이 참여했어요</span></span>
          <span>🧪 <span>${tag}</span></span>
        </div>
        <button class="highlight-cta-btn">
          <span>${ctaLabel}</span>
          <span>›</span>
        </button>
      </div>
    </div>
  `;
}

// 더미 기준 배너 만들기
function buildDummyBanner() {
  const sorted = [...DUMMY_TESTS].sort((a, b) => b.plays - a.plays);
  const top = sorted[0];
  return {
    title: null,
    subtitle: null,
    ctaLabel: null,
    test: top,
  };
}

// ---------------------------------------------------------
// (3) 태그 렌더링
// ---------------------------------------------------------

function renderTags(popularTags) {
  const tagsContainer = document.querySelector(".tags-scroll-container");
  if (!tagsContainer) return;

  tagsContainer.innerHTML = popularTags
    .map(
      (tag) => `
      <button class="tag-chip" onclick="alert('‘${tag.name}’ 태그로 테스트 모아보기 (준비 중)')">
        <span>#</span><span>${tag.name}</span>
      </button>
    `
    )
    .join("");
}

// 더미 태그를 API 형식으로 변환
function buildDummyPopularTags() {
  return DUMMY_TAGS.map((name, idx) => ({
    id: idx + 1,
    name,
    slug: name,
  }));
}

// ---------------------------------------------------------
// (4) Supabase에서 홈 데이터 가져오기
//      - 실패 / 미설정 시 더미 데이터로 대체
// ---------------------------------------------------------

async function fetchHomeDataFromSupabase() {
  if (!hasSupabase) {
    throw new Error("Supabase 환경이 준비되지 않았습니다.");
  }

  // config.js에서 전역 상수 사용 (없으면 기본값)
  const TABLE_TESTS = window.TABLE_TESTS || "tests";
  const TABLE_HOME_BANNER = window.TABLE_HOME_BANNER || "home_banner";
  const TABLE_HOME_POPULAR_TAGS =
    window.TABLE_HOME_POPULAR_TAGS || "home_popular_tags";
  const TABLE_HOME_TRENDING =
    window.TABLE_HOME_TRENDING || "home_trending_tests";

  // 1) 배너 + 테스트 조인
  const { data: bannerRows, error: bannerError } = await window.supabaseClient
    .from(TABLE_HOME_BANNER)
    .select(
      `
      id,
      title,
      subtitle,
      cta_label,
      test:test_id (
        id,
        title,
        thumbnail_url,
        play_count,
        main_tag
      )
    `
    )
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .limit(1);

  if (bannerError) {
    console.error("배너 조회 에러:", bannerError);
  }

  const bannerRow = bannerRows && bannerRows[0];
  const banner = bannerRow
    ? {
        title: bannerRow.title,
        subtitle: bannerRow.subtitle,
        ctaLabel: bannerRow.cta_label,
        test: {
          id: bannerRow.test.id,
          title: bannerRow.test.title,
          imageUrl: bannerRow.test.thumbnail_url,
          plays: bannerRow.test.play_count,
          mainTag: bannerRow.test.main_tag,
          isNew: false,
        },
      }
    : buildDummyBanner(); // 배너 없으면 더미

  // 2) 인기 태그
  const { data: popularTagRows, error: popularTagError } =
    await window.supabaseClient
      .from(TABLE_HOME_POPULAR_TAGS)
      .select(
        `
        id,
        display_order,
        tag:tag_id (
          id,
          name,
          slug
        )
      `
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true });

  if (popularTagError) {
    console.error("인기 태그 조회 에러:", popularTagError);
  }

  const popularTags =
    popularTagRows && popularTagRows.length
      ? popularTagRows.map((row) => ({
          id: row.tag.id,
          name: row.tag.name,
          slug: row.tag.slug,
        }))
      : buildDummyPopularTags();

  // 3) 트렌딩 테스트
  const { data: trendingRows, error: trendingError } =
    await window.supabaseClient
      .from(TABLE_HOME_TRENDING)
      .select(
        `
        id,
        display_order,
        test:test_id (
          id,
          title,
          thumbnail_url,
          play_count,
          main_tag
        )
      `
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true });

  if (trendingError) {
    console.error("트렌딩 테스트 조회 에러:", trendingError);
  }

  const trendingTests =
    trendingRows && trendingRows.length
      ? trendingRows.map((row) => ({
          id: row.test.id,
          title: row.test.title,
          imageUrl: row.test.thumbnail_url,
          plays: row.test.play_count,
          mainTag: row.test.main_tag,
          isNew: false,
        }))
      : [...DUMMY_TESTS].sort((a, b) => b.plays - a.plays);

  // 4) 신규 테스트: tests.created_at 기준 최신 6개
  let newTests = [];
  try {
    const { data: newRows, error: newError } = await window.supabaseClient
      .from(TABLE_TESTS)
      .select("id, title, thumbnail_url, play_count, main_tag, created_at")
      .order("created_at", { ascending: false })
      .limit(6);

    if (newError) {
      console.error("신규 테스트 조회 에러:", newError);
      newTests = DUMMY_TESTS.filter((t) => t.isNew).length
        ? DUMMY_TESTS.filter((t) => t.isNew)
        : DUMMY_TESTS.slice(-3);
    } else {
      newTests =
        newRows && newRows.length
          ? newRows.map((row) => ({
              id: row.id,
              title: row.title,
              imageUrl: row.thumbnail_url,
              plays: row.play_count,
              mainTag: row.main_tag,
              isNew: true,
            }))
          : DUMMY_TESTS.filter((t) => t.isNew).length
          ? DUMMY_TESTS.filter((t) => t.isNew)
          : DUMMY_TESTS.slice(-3);
    }
  } catch (e) {
    console.error("신규 테스트 조회 중 예외:", e);
    newTests = DUMMY_TESTS.filter((t) => t.isNew).length
      ? DUMMY_TESTS.filter((t) => t.isNew)
      : DUMMY_TESTS.slice(-3);
  }

  return {
    banner,
    popularTags,
    trendingTests,
    newTests,
  };
}

// ---------------------------------------------------------
// (5) 전체 홈 데이터 가져오기 (Supabase → 실패 시 더미)
// ---------------------------------------------------------

async function fetchHomeData() {
  if (hasSupabase) {
    try {
      return await fetchHomeDataFromSupabase();
    } catch (err) {
      console.warn("Supabase에서 홈 데이터 불러오기 실패, 더미 데이터로 대체:", err);
    }
  }

  // 여기까지 왔다는 건 Supabase가 없거나 실패한 것 → 더미만 사용
  const sorted = [...DUMMY_TESTS].sort((a, b) => b.plays - a.plays);
  const newItems =
    DUMMY_TESTS.filter((t) => t.isNew).length > 0
      ? DUMMY_TESTS.filter((t) => t.isNew)
      : DUMMY_TESTS.slice(-3);

  return {
    banner: buildDummyBanner(),
    popularTags: buildDummyPopularTags(),
    trendingTests: sorted,
    newTests: newItems,
  };
}

// ---------------------------------------------------------
// (6) 메인 페이지 렌더링
// ---------------------------------------------------------

async function renderHomePage() {
  const trendingList = document.getElementById("trending-list");
  const newList = document.getElementById("new-list");

  if (!trendingList || !newList) {
    console.warn("trending-list 또는 new-list 엘리먼트를 찾지 못했습니다.");
    return;
  }

  const homeData = await fetchHomeData();

  // 배너
  if (homeData.banner) {
    renderHighlightFromBanner(homeData.banner);
  }

  // 인기 태그
  if (homeData.popularTags) {
    renderTags(homeData.popularTags);
  }

  // 지금 유행하는 테스트
  if (homeData.trendingTests) {
    trendingList.innerHTML = homeData.trendingTests
      .map(createTestCard)
      .join("");
  }

  // 신규 테스트
  if (homeData.newTests) {
    newList.innerHTML = homeData.newTests.map(createTestCard).join("");
  }
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", renderHomePage);
