
let timeLeft = 120;
let score = 0;
let playing = false;
let difficulty = 3;

const allUnits = [
    { label: "1 Bit", value: 1 },
    { label: "9 Bits", value: 9 },
    { label: "1 Byte", value: 8 },
    { label: "2 Bytes", value: 16 },
    { label: "1 KB", value: 8192 },
    { label: "1 MB", value: 8388608 },
    { label: "1.5 MB", value: 12582912 },
    { label: "1 GB", value: 8589934592 },
    { label: "2 GB", value: 17179869184 },
    { label: "1 TB", value: 8796093022208 }
];

const gameDiv = document.getElementById("game");
const timerDiv = document.getElementById("timer");
const messageDiv = document.getElementById("message");
const nameInputDiv = document.getElementById("nameInput");
const scoreBoard = document.getElementById("scoreBoard");
const submitBtn = document.getElementById("submit");
const startBtn = document.getElementById("startBtn");

function shuffleArray(arr) {
    return arr.map(a => [a, Math.random()]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
}

function startTimer() {
    timerDiv.style.display = 'block';
    submitBtn.style.display = 'inline-block';
    timerDiv.textContent = `Tempo: ${timeLeft}s`;
    const timer = setInterval(() => {
    if (!playing) return clearInterval(timer);
    timeLeft--;
    timerDiv.textContent = `Tempo: ${timeLeft}s`;
    if (timeLeft <= 0) {
        clearInterval(timer);
        playing = false;
        messageDiv.textContent = `⏱️ Tempo esgotado! Pontuação final: ${score}`;
        submitBtn.disabled = true;
        nameInputDiv.style.display = 'block';
    }
    }, 1000);
}

function generateRound() {
    if (!playing) return;
    gameDiv.innerHTML = "";
    messageDiv.textContent = "";
    const shuffled = shuffleArray(allUnits).slice(0, difficulty);
    shuffled.forEach(unit => {
    const div = document.createElement("div");
    div.className = "card";
    div.draggable = true;
    div.dataset.value = unit.value;
    div.textContent = unit.label;
    gameDiv.appendChild(div);
    });
    enableDrag();
}

function enableDrag() {
    let dragged;
    gameDiv.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
        dragged = card;
    });
    card.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    card.addEventListener('drop', (e) => {
        e.preventDefault();
        if (dragged !== card) {
        const draggedIndex = [...gameDiv.children].indexOf(dragged);
        const targetIndex = [...gameDiv.children].indexOf(card);
        if (draggedIndex < targetIndex) {
            gameDiv.insertBefore(card, dragged);
        } else {
            gameDiv.insertBefore(dragged, card);
        }
        }
    });
    });
}

function checkOrder() {
    if (!playing) return;
    const cards = Array.from(gameDiv.children);
    const values = cards.map(card => parseInt(card.dataset.value));
    const sorted = [...values].sort((a, b) => b - a);
    const correct = JSON.stringify(values) === JSON.stringify(sorted);
    if (correct) {
    messageDiv.textContent = "✅ Ordem correta! +1 ponto";
    score++;
    if (difficulty < allUnits.length) difficulty++;
    } else {
    messageDiv.textContent = "❌ Ordem incorreta. Tente novamente!";
    }
    setTimeout(generateRound, 1500);
}

function updateRanking() {
    const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
    const name = document.getElementById("playerName").value.trim();
    if (name) {
    ranking.push({ name, score });
    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem("ranking", JSON.stringify(ranking.slice(0, 10)));
    renderRanking();
    alert(`Pontuação registrada com sucesso!\nNome: ${name}\nPontuação: ${score}`);
    location.reload();
    }
}

function renderRanking() {
    const ranking = JSON.parse(localStorage.getItem("ranking") || "[]");
    scoreBoard.innerHTML = ranking.map(r => `<li>${r.name} - ${r.score}</li>`).join("");
}

document.getElementById("submit").addEventListener("click", checkOrder);
document.getElementById("registerBtn").addEventListener("click", updateRanking);
startBtn.addEventListener("click", () => {
    score = 0;
    timeLeft = 120;
    difficulty = 3;
    startBtn.style.display = 'none';
    playing = true;
    submitBtn.disabled = false;
    generateRound();
    startTimer();
});

renderRanking();
