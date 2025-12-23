<script>
/* ===============================
   1. 질문 데이터 (10문항)
================================ */
const questions = [
  {
    q: "연인이 고민을 털어놓을 때 나는?",
    a: [
      { t: "감정부터 공감해준다", score: 10 },
      { t: "해결 방법을 먼저 생각한다", score: 7 }
    ]
  },
  {
    q: "연인과의 약속이 갑자기 취소됐다면?",
    a: [
      { t: "서운하지만 이해하려 한다", score: 9 },
      { t: "내 계획이 망가져 더 신경 쓰인다", score: 6 }
    ]
  },
  {
    q: "연애에서 가장 중요하다고 생각하는 것은?",
    a: [
      { t: "서로의 감정 이해", score: 10 },
      { t: "현실적인 안정감", score: 8 }
    ]
  },
  {
    q: "다툼이 생겼을 때 나는?",
    a: [
      { t: "바로 대화로 풀고 싶다", score: 9 },
      { t: "시간을 두고 생각한다", score: 7 }
    ]
  },
  {
    q: "연인의 단점이 보일 때?",
    a: [
      { t: "감싸 안고 이해하려 한다", score: 9 },
      { t: "솔직하게 말하는 편이다", score: 7 }
    ]
  },
  {
    q: "연애 중 개인 시간은?",
    a: [
      { t: "서로 존중해야 한다", score: 8 },
      { t: "웬만하면 함께 보내고 싶다", score: 9 }
    ]
  },
  {
    q: "연인이 감정적으로 힘들어 보일 때?",
    a: [
      { t: "눈치채고 먼저 다가간다", score: 10 },
      { t: "말해주길 기다린다", score: 6 }
    ]
  },
  {
    q: "연애에서 나의 표현 방식은?",
    a: [
      { t: "말과 행동 모두 적극적", score: 9 },
      { t: "마음은 크지만 표현은 서툴다", score: 7 }
    ]
  },
  {
    q: "연인과 의견이 다를 때?",
    a: [
      { t: "서로 조율하려 한다", score: 9 },
      { t: "내 생각을 지키고 싶다", score: 6 }
    ]
  },
  {
    q: "이별을 떠올리게 되는 순간은?",
    a: [
      { t: "서로 존중이 사라졌을 때", score: 10 },
      { t: "감정 소모가 너무 클 때", score: 7 }
    ]
  }
];

/* ===============================
   2. 상태 변수
================================ */
let currentIdx = 0;
let totalScore = 0;

/* ===============================
   3. 화면 제어
================================ */
function startTest() {
  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("question-screen").classList.add("active");
  showQuestion();
}

function showQuestion() {
  if (currentIdx >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentIdx];
  document.getElementById("question").innerText = q.q;
  document.getElementById("progress").style.width =
    ((currentIdx / questions.length) * 100) + "%";

  const ansDiv = document.getElementById("answers");
  ansDiv.innerHTML = "";

  q.a.forEach(answer => {
    const btn = document.createElement("div");
    btn.className = "answer-btn";
    btn.innerText = answer.t;
    btn.onclick = () => {
      totalScore += answer.score;
      currentIdx++;
      showQuestion();
    };
    ansDiv.appendChild(btn);
  });
}

/* ===============================
   4. 결과 계산
================================ */
function getResultByScore(score) {
  if (score >= 90) {
    return {
      title: "연애 마스터 클래스",
      feature: "상대의 감정을 빠르게 캐치하고, 갈등 상황에서도 침착하게 해결하는 타입입니다.",
      style: "사랑과 배려의 균형이 뛰어나며, 오래 갈수록 더 깊어지는 연애를 합니다.",
      mbti: "ENFJ · INFJ · ISFJ"
    };
  } else if (score >= 80) {
    return {
      title: "믿고 만나는 안정형 연인",
      feature: "책임감 있고 신뢰를 중요하게 생각하는 연애 타입입니다.",
      style: "편안하고 안정적인 관계를 선호하며 장기 연애에 강합니다.",
      mbti: "ESFJ · ISFJ · ENFP"
    };
  } else if (score >= 70) {
    return {
      title: "현실적인 연애 밸런서",
      feature: "기본적인 배려는 충분하지만 감정 표현이 아쉬울 수 있습니다.",
      style: "편안하지만 노력에 따라 더 깊은 연애로 발전할 수 있습니다.",
      mbti: "ISTJ · ISFP · ENFP"
    };
  } else if (score >= 60) {
    return {
      title: "표현 연습이 필요한 타입",
      feature: "마음은 크지만 표현이 부족해 오해를 살 수 있습니다.",
      style: "행동으로 사랑을 보여주는 연애를 합니다.",
      mbti: "ENFP · ESFJ · INFJ"
    };
  } else if (score >= 50) {
    return {
      title: "연애 초보 단계",
      feature: "연애 감정 이해가 아직은 부족한 편입니다.",
      style: "경험이 쌓일수록 성장 가능성이 큽니다.",
      mbti: "INFP · ISFJ · ENFJ"
    };
  } else if (score >= 40) {
    return {
      title: "연애 감정 해석 중",
      feature: "상대의 마음을 읽는 데 시간이 필요한 타입입니다.",
      style: "자신의 리듬을 지키는 연애를 합니다.",
      mbti: "ISFP · INTP · INFJ"
    };
  } else if (score >= 30) {
    return {
      title: "자아 중심 연애형",
      feature: "자기 세계가 뚜렷해 연애가 어려울 수 있습니다.",
      style: "자유를 중시하는 연애를 합니다.",
      mbti: "ENTP · INTP · ISFP"
    };
  } else {
    return {
      title: "연애 리셋 필요 상태",
      feature: "감정 소통에 피로가 쌓여 있는 상태입니다.",
      style: "지금은 나 자신을 돌보는 시간이 필요합니다.",
      mbti: "INFJ · ISFJ"
    };
  }
}

/* ===============================
   5. 결과 화면 출력
================================ */
function showResult() {
  document.getElementById("question-screen").classList.remove("active");
  document.getElementById("result-screen").classList.add("active");

  const result = getResultByScore(totalScore);

  document.getElementById("score-val").innerText = totalScore + "점";
  document.getElementById("mbti-type").innerText = result.title;

  document.getElementById("result-desc").innerHTML = `
    <p><strong>✨ 특징</strong><br>${result.feature}</p>
    <p><strong>💖 연애 스타일</strong><br>${result.style}</p>
    <p><strong>🧠 잘 어울리는 MBTI</strong><br>${result.mbti}</p>
  `;
}
</script>
