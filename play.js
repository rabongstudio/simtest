const questions = [
  {
    q: "연인과 다툼이 생겼을 때 당신의 행동은?",
    a: [
      { t: "감정을 정리한 뒤 대화로 풀려고 한다", s: 10 },
      { t: "서로 시간을 갖고 자연스럽게 풀리길 기다린다", s: 7 },
      { t: "상대가 먼저 사과하길 기다린다", s: 4 },
      { t: "연락을 끊고 혼자 버텨본다", s: 1 }
    ]
  },
  {
    q: "연인의 단점이 보일 때 당신은?",
    a: [
      { t: "상처 주지 않게 솔직하게 이야기한다", s: 10 },
      { t: "상황을 보며 천천히 말할 기회를 찾는다", s: 7 },
      { t: "그냥 참고 넘긴다", s: 4 },
      { t: "속으로 불만을 쌓아둔다", s: 1 }
    ]
  },
  {
    q: "연인과 연락 빈도에 대한 생각은?",
    a: [
      { t: "서로 편안한 빈도가 가장 중요하다", s: 10 },
      { t: "자주 하면 좋지만 강요는 싫다", s: 8 },
      { t: "연락은 최소한만 하면 된다", s: 5 },
      { t: "연락이 많으면 부담스럽다", s: 2 }
    ]
  },
  {
    q: "데이트 계획을 세울 때 당신은?",
    a: [
      { t: "서로 의견을 나누며 함께 정한다", s: 10 },
      { t: "내가 대략 정하고 상대에게 맞춘다", s: 8 },
      { t: "상대가 정해주길 바란다", s: 5 },
      { t: "즉흥이 최고라고 생각한다", s: 3 }
    ]
  },
  {
    q: "연인이 힘들어 보일 때 당신은?",
    a: [
      { t: "이야기를 들어주고 공감한다", s: 10 },
      { t: "현실적인 해결책을 제시한다", s: 8 },
      { t: "괜히 건드리지 않는다", s: 4 },
      { t: "나까지 힘들어질까 거리를 둔다", s: 1 }
    ]
  },
  {
    q: "질투 상황에서 당신의 반응은?",
    a: [
      { t: "솔직하게 감정을 표현한다", s: 10 },
      { t: "가볍게 농담으로 넘긴다", s: 7 },
      { t: "티 내지 않고 참는다", s: 4 },
      { t: "상대를 의심하며 캐묻는다", s: 1 }
    ]
  },
  {
    q: "연인과의 미래에 대해 생각할 때?",
    a: [
      { t: "현실적인 계획을 함께 그려본다", s: 10 },
      { t: "막연하지만 긍정적으로 생각한다", s: 8 },
      { t: "지금만 잘 지내면 된다고 본다", s: 5 },
      { t: "미래 이야기는 부담스럽다", s: 2 }
    ]
  },
  {
    q: "연인과의 갈등이 반복될 때?",
    a: [
      { t: "근본 원인을 해결하려 한다", s: 10 },
      { t: "상대에게 조금 더 맞춰준다", s: 7 },
      { t: "시간이 해결해주길 바란다", s: 4 },
      { t: "이별을 먼저 떠올린다", s: 1 }
    ]
  },
  {
    q: "연애에서 가장 중요하다고 생각하는 것은?",
    a: [
      { t: "신뢰와 존중", s: 10 },
      { t: "설렘과 감정", s: 7 },
      { t: "편안함", s: 5 },
      { t: "자유", s: 3 }
    ]
  },
  {
    q: "연인이 실수를 했을 때 당신은?",
    a: [
      { t: "이해하고 다시 기회를 준다", s: 10 },
      { t: "사과를 받으면 넘어간다", s: 8 },
      { t: "기억해두고 거리를 둔다", s: 4 },
      { t: "쉽게 신뢰를 거둔다", s: 1 }
    ]
  }
];

let currentIdx = 0;
let totalScore = 0;

/* 시작 */
document.getElementById("btn-start").onclick = () => {
  switchScreen("start-screen", "question-screen");
  showQuestion();
};

function showQuestion() {
  if (currentIdx >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentIdx];
  document.getElementById("question").innerText = q.q;
  document.getElementById("progress").style.width =
    (currentIdx / questions.length) * 100 + "%";

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  q.a.forEach(ans => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerText = ans.t;
    btn.onclick = () => {
      totalScore += ans.s;
      currentIdx++;
      showQuestion();
    };
    answers.appendChild(btn);
  });
}

/* 결과 계산 */
function showResult() {
  switchScreen("question-screen", "result-screen");

  document.getElementById("progress").style.width = "100%";
  document.getElementById("score-val").innerText = totalScore + "점";

  const { title, desc } = getResultByScore(totalScore);
  document.getElementById("result-title").innerText = title;
  document.getElementById("result-desc").innerText = desc;
}

/* 점수 구간별 결과 */
function getResultByScore(score) {
  if (score >= 90) {
    return {
      title: "💖 완성형 연애 마스터 (90점 이상)",
      desc: "감정 조절, 소통, 배려 모두 뛰어난 연애 고수입니다. 상대방을 존중하면서도 스스로를 잃지 않는 건강한 연애를 할 확률이 매우 높아요. 함께하는 사람에게 안정감과 신뢰를 주는 타입입니다."
    };
  } else if (score >= 80) {
    return {
      title: "🌸 믿고 만나는 안정형 연인 (80~89점)",
      desc: "연애에 필요한 대부분의 요소를 잘 갖추고 있습니다. 다만 가끔 감정 표현이나 솔직한 대화가 부족할 수 있어요. 조금만 더 마음을 열면 훨씬 깊은 관계로 발전할 수 있습니다."
    };
  } else if (score >= 70) {
    return {
      title: "🙂 평균 이상, 노력형 연애 타입 (70~79점)",
      desc: "연애 감각이 나쁘지 않고 상황에 따라 잘 대응하는 편입니다. 다만 갈등 상황에서 회피하려는 경향이 보일 수 있어요. 대화를 두려워하지 않는 연습이 중요합니다."
    };
  } else if (score >= 60) {
    return {
      title: "🤔 아직 성장 중인 연애 초보 (60~69점)",
      desc: "연애에 대한 이해는 있지만 실제 상황에서 흔들릴 수 있습니다. 상대의 감정을 조금 더 세심하게 살피고 표현하는 연습이 필요해요."
    };
  } else if (score >= 50) {
    return {
      title: "😅 감정 기복 주의 단계 (50~59점)",
      desc: "연애에서 감정에 크게 영향을 받는 편입니다. 순간적인 감정 표현이 갈등으로 이어질 수 있으니, 한 번 더 생각하는 습관을 들여보세요."
    };
  } else if (score >= 40) {
    return {
      title: "⚠️ 소통 연습이 필요한 단계 (40~49점)",
      desc: "상대방과의 소통에서 오해가 자주 생길 수 있습니다. 말하지 않으면 상대는 모른다는 점을 기억하세요. 솔직한 표현이 가장 큰 열쇠입니다."
    };
  } else if (score >= 30) {
    return {
      title: "🚨 연애 패턴 점검 필요 (30~39점)",
      desc: "연애에서 상처를 주거나 받을 가능성이 높은 상태입니다. 스스로의 연애 방식을 돌아보고, 왜 같은 문제가 반복되는지 생각해볼 필요가 있어요."
    };
  } else {
    return {
      title: "🧨 연애 리셋 권장 단계 (30점 이하)",
      desc: "지금 상태로는 건강한 연애가 쉽지 않을 수 있습니다. 연애를 쉬면서 자신을 돌보고, 관계에 대한 기준을 다시 세우는 시간이 필요해 보입니다."
    };
  }
}

/* 화면 전환 */
function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}
