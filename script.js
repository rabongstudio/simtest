// =========================================================
// 더미 데이터 (실제 구축 시에는 API 연동으로 교체)
// =========================================================

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

/**
 * 숫자를 K 단위로 포맷 (15000 -> 1.5만 형태)
 */
function formatPlays(num) {
  if (num >= 10000) {
    const n = (num / 10000).toFixed(1).replace(/\.0$/, "");
    return `${n}만`;
  }
  return num.toLocaleString("ko-KR");
}

/**
 * 테스트 카드 HTML 생성
 */
function createTestCard(test) {
  const isMbti = test.tag && test.tag.toUpperCase().includes("MBTI");
  const isHot = test.plays >= 10000;
  const isNew = test.isNew;

  return `
    <div class="test-card" onclick="location.href='play.html?id=${test.id}'">
      <div class="card-top-row">
        <div class="card-badges">
          ${
            isMbti
              ? `<span class="badge badge-mbti">MBTI</span>`
              : test.tag
              ? `<span class="badge badge-mbti">${test.tag}</span>`
              : ""
          }
          ${isHot ? `<span class="badge badge-hot">HOT</span>` : ""}
          ${isNew ? `<span class="badge badge-new">NEW</span>` : ""}
        </div>
        <div class="card-bookmark">☆</div>
      </div>

      <div class="card-image-wrap">
        <img
          src="${test.image}"
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

/**
 * 오늘의 추천(가장 인기 있는 테스트) 카드 생성
 */
function renderHighlight(test) {
  const highlightSection = document.getElementById("highlight-carousel");
  if (!highlightSection || !test) return;

  const isMbti = test.tag && test.tag.toUpperCase().includes("MBTI");

  highlightSection.innerHTML = `
    <div class="highlight-card" onclick="location.href='play.html?id=${test.id}'">
      <div class="highlight-pill">
        <span>✨</span>
        <span>${
          isMbti ? "오늘의 MBTI 추천" : "오늘의 추천 테스트"
        }</span>
      </div>
      <div class="highlight-title">
        ${test.title}
      </div>
      <div class="highlight-subtitle">
        지금 딱, 내 상태를 콕 집어주는 심리 테스트 한 판.
      </div>
      <div class="highlight-bottom">
        <div class="highlight-meta">
          <span>▶ <span>${formatPlays(test.plays)}명이 참여했어요</span></span>
          <span>🧪 <span>${test.tag || "심테공방"}</span></span>
        </div>
        <button class="highlight-cta-btn">
          <span>바로 시작</span>
          <span>›</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * 태그 리스트 렌더링
 */
function renderTags() {
  const tagsContainer = document.querySelector(".tags-scroll-container");
  if (!tagsContainer) return;

  tagsContainer.innerHTML = DUMMY_TAGS.map(
    (tag) => `
      <button class="tag-chip" onclick="alert('‘${tag}’ 태그로 테스트 모아보기 (준비 중)')">
        <span>#</span><span>${tag}</span>
      </button>
    `
  ).join("");
}

/**
 * 메인 페이지 렌더링
 */
function renderHomePage() {
  const trendingList = document.getElementById("trending-list");
  const newList = document.getElementById("new-list");

  if (!trendingList || !newList) return;

  // 플레이 수 기준 정렬
  const sortedByPlays = [...DUMMY_TESTS].sort((a, b) => b.plays - a.plays);

  // 하이라이트 카드: 가장 인기 있는 테스트
  renderHighlight(sortedByPlays[0]);

  // 트렌딩 리스트 (상위 나열)
  trendingList.innerHTML = sortedByPlays.map(createTestCard).join("");

  // 신규 리스트: isNew 우선, 없으면 뒤에서 3개
  const newItems =
    DUMMY_TESTS.filter((t) => t.isNew).length > 0
      ? DUMMY_TESTS.filter((t) => t.isNew)
      : DUMMY_TESTS.slice(-3);

  newList.innerHTML = newItems.map(createTestCard).join("");

  // 태그 렌더링
  renderTags();
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", renderHomePage);
