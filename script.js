// =========================================================
// DB 연동 전제 설계
// - /api/home 에서 아래와 같은 JSON을 내려준다고 가정
// {
//   banner: { title, subtitle, ctaLabel, test: { id, title, plays, mainTag, isNew } },
//   popularTags: [{ id, name, slug }],
//   trendingTests: [{ id, title, imageUrl, plays, mainTag, isNew }],
//   newTests: [{ ...테스트 구조 동일... }]
// }
// =========================================================

// ---------------------------------------------
// (1) 더미 데이터 (백엔드 준비 전 fallback 용)
// ---------------------------------------------
const DUMMY_TESTS = [
  {
    id: 1,
    title: "[MBTI] 나의 연애 점수는 과연 몇 점?",
    imageUrl: "img/test1.jpg",
    plays: 15000,
    mainTag: "MBTI",
    isNew: true,
  },
  {
    id: 2,
    title: "퇴근 후 내 성향 테스트: 나는 혼자 vs 친구?",
    imageUrl: "img/test2.jpg",
    plays: 12000,
    mainTag: "라이프스타일",
    isNew: false,
  },
  {
    id: 3,
    title: "붕어빵 선택으로 알아보는 나의 성격 유형",
    imageUrl: "img/test3.jpg",
    plays: 8000,
    mainTag: "음식심리",
    isNew: true,
  },
  {
    id: 4,
    title: "갑자기 계획이 취소된다면? 반응 테스트",
    imageUrl: "img/test4.jpg",
    plays: 6000,
    mainTag: "상황심리",
    isNew: false,
  },
  {
    id: 5,
    title: "내가 직장 상사라면 어떤 스타일일까?",
    imageUrl: "img/test5.jpg",
    plays: 5500,
    mainTag: "직장인",
    isNew: true,
  },
  {
    id: 6,
    title: "친구들과의 약속 스타일 테스트",
    imageUrl: "img/test6.jpg",
    plays: 4800,
    mainTag: "대인관계",
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

// 숫자를 K 단위로 포맷 (15000 -> 1.5만 형태)
function formatPlays(num) {
  if (num >= 10000) {
    const n = (num / 10000).toFixed(1).replace(/\.0$/, "");
    return `${n}만`;
  }
  return num.toLocaleString("ko-KR");
}

// ---------------------------------------------
// (2) 카드 HTML 생성 (테스트 공통 구조 사용)
// ---------------------------------------------
function createTestCard(test) {
  const tag = test.mainTag || test.tag || "";
  const isMbti = tag.toUpperCase().includes("MBTI");
  const isHot = test.plays >= 10000;
  const isNew = !!test.isNew;

  // 백엔드에서는 imageUrl, 기존 더미에서는 image 사용했으므로 둘 다 대응
  const imageUrl = test.imageUrl || test.image;

  return `
    <div class="test-card" onclick="location.href='play.html?id=${test.id}'">
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

// ---------------------------------------------
// (3) 상단 배너(오늘의 추천) 렌더링
// ---------------------------------------------
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

  highlightSection.innerHTML = `
    <div class="highlight-card" onclick="location.href='play.html?id=${test.id}'">
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

// fallback: 더미 데이터로 배너 만들기
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

// ---------------------------------------------
// (4) 인기 태그 렌더링
// ---------------------------------------------
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

// fallback: 더미 태그를 API 형식으로 변환
function buildDummyPopularTags() {
  return DUMMY_TAGS.map((name, idx) => ({
    id: idx + 1,
    name,
    slug: name,
  }));
}

// ---------------------------------------------
// (5) 홈 데이터 fetch (DB → API → 프론트)
// ---------------------------------------------
const API_BASE = "/api";

async function fetchHomeData() {
  try {
    const res = await fetch(`${API_BASE}/home`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("홈 데이터 로딩 실패, 더미 데이터 사용:", err);

    // 백엔드 준비 전까지는 여기에서 더미로 대체
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
}

// ---------------------------------------------
// (6) 메인 페이지 렌더링
// ---------------------------------------------
async function renderHomePage() {
  const trendingList = document.getElementById("trending-list");
  const newList = document.getElementById("new-list");
  if (!trendingList || !newList) return;

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
