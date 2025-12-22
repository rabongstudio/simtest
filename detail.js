// detail.js

function getTestIdFromQuery() {
  const params = new URLSearchParams(location.search);
  return Number(params.get("id"));
}

function renderTags(tags) {
  const container = document.getElementById("detail-tags");
  container.innerHTML = tags
    .map((t) => `<span class="tag-chip">#${t}</span>`)
    .join("");
}

function renderRelatedTests(tests) {
  const container = document.getElementById("related-tests");
  container.innerHTML = tests
    .map(
      (test) => `
      <div class="test-card-mini" onclick="location.href='detail.html?id=${test.id}'">
        <img src="${test.thumbnail}" alt="${test.title}" />
        <p>${test.title}</p>
      </div>
    `
    )
    .join("");
}

async function loadDetail() {
  const id = getTestIdFromQuery();
  if (!id) return;

  // ❗ Supabase가 준비된 경우 DB에서 읽기
  let detail = null;
  if (hasSupabase) {
    const { data, error } = await supabaseClient
      .from("tests")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) detail = data;
  }

  // 🔹 기본 템플릿 값
  const title = detail?.title || "테스트 제목";
  const desc = detail?.description || "테스트 설명을 입력해주세요.";
  const image = detail?.thumbnail_url || detail?.imageUrl || "img/default.jpg";
  const plays = detail?.play_count || 0;
  const tags = detail?.main_tag ? [detail.main_tag] : [];

  document.getElementById("detail-title").textContent = title;
  document.getElementById("detail-description").textContent = desc;
  document.getElementById("detail-thumbnail").src = image;
  document.getElementById("detail-plays").textContent = `${plays}명 참여`;
  renderTags(tags);

  // 비슷한 테스트 샘플 (더미)
  renderRelatedTests([
    { id: id + 1, thumbnail: "img/test2.jpg", title: "비슷한 테스트 1" },
    { id: id + 2, thumbnail: "img/test3.jpg", title: "비슷한 테스트 2" },
  ]);
}

document.addEventListener("DOMContentLoaded", loadDetail);
