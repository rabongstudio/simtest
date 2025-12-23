const questions = [
  {
    q: "주말 데이트, 당신이 선호하는 계획은?",
    a: [
      { t: "미리 맛집부터 코스까지 완벽 예약", v: "J" },
      { t: "그날 기분에 따라 가고 싶은 곳 가기", v: "P" }
    ]
  },
  {
    q: "연인이 갑자기 '나 우울해서 화분 샀어'라고 한다면?",
    a: [
      { t: "왜 우울해? 무슨 일 있었어?", v: "F" },
      { t: "어떤 화분 샀어? 예뻐?", v: "T" }
    ]
  }
];

let idx = 0;
let scores = { E: 0, I: 0, T: 0, F: 0, J: 0, P: 0 };

const startBtn = document.getElementById("btn-start");

startBtn.onclick = () => {
  switchScreen("start-screen", "question-screen");
  showQuestion();
};

function showQuestion() {
  if (idx >= questions.length) return showResult();

  const q = questions[idx];
  document.getElementById("question").innerText = q.q;
  document.getElementById("progress").style.width =
    (idx / questions.length) * 100 + "%";

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  q.a.forEach(ans => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerText = ans.t;
    btn.onclick = () => {
      scores[ans.v]++;
      idx++;
      showQuestion();
    };
    answers.appendChild(btn);
  });
}

function showResult() {
  switchScreen("question-screen", "result-screen");
  document.getElementById("score-val").innerText =
    Math.floor(70 + Math.random() * 30) + "점";
  document.getElementById("result-title").innerText =
    scores.F > scores.T ? "공감형 사랑꾼" : "이성적인 연애 고수";
  document.getElementById("result-desc").innerText =
    "당신은 " + (scores.J > scores.P ? "계획적인" : "자유로운") + " 연애 스타일입니다.";
}

function switchScreen(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");
}
