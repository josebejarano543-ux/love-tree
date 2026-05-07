const canvas = document.getElementById("tree");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const card = document.getElementById("card");
const song = document.getElementById("song");

let hearts = [];
let frame = 0;
let started = false;

const colors = ["#ff2e63", "#ff4ecd", "#ff6f91", "#ff9671", "#ffb6c1"];

startBtn.addEventListener("click", () => {
  if (song) {
    song.volume = 0.45;
    song.play().catch(() => {});
  }

  intro.style.opacity = "0";

  setTimeout(() => {
    intro.style.display = "none";
    card.classList.remove("hidden");

    resizeCanvas();
    createHearts();

    if (!started) {
      started = true;
      animate();
    }
  }, 1200);
});

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function heartShape(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
  };
}

function createHearts() {
  hearts = [];

  const isMobile = window.innerWidth <= 600;

  const centerX = canvas.width / 2;
  const centerY = isMobile ? canvas.height / 2 - 40 : canvas.height / 2 - 70;

  const scale = isMobile ? 7.8 : 13;
  const totalHearts = isMobile ? 340 : 650;

  for (let i = 0; i < totalHearts; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartShape(t);
    const fill = Math.sqrt(Math.random());

    const x = centerX + p.x * scale * fill;
    const y = centerY - p.y * scale * fill;

    hearts.push({
      x,
      y,
      originalX: x,
      originalY: y,
      size: isMobile
        ? Math.random() * 1.8 + 1.8
        : Math.random() * 3.5 + 2.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      offset: Math.random() * 100,
      falling: i % (isMobile ? 20 : 8) === 0
    });
  }
}

function drawHeart(x, y, size, color) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(size / 10, size / 10);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -3, -5, -3, -5, 1);
  ctx.bezierCurveTo(-5, 5, 0, 8, 0, 10);
  ctx.bezierCurveTo(0, 8, 5, 5, 5, 1);
  ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);

  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

function drawTrunk() {
  const isMobile = window.innerWidth <= 600;

  const x = canvas.width / 2;
  const top = isMobile ? canvas.height / 2 + 42 : canvas.height / 2 + 70;
  const bottom = canvas.height - 20;

  ctx.fillStyle = "#00a884";

  ctx.beginPath();
  ctx.moveTo(x - (isMobile ? 17 : 25), bottom);
  ctx.lineTo(x + (isMobile ? 17 : 25), bottom);
  ctx.lineTo(x + (isMobile ? 7 : 10), top);
  ctx.lineTo(x - (isMobile ? 7 : 10), top);
  ctx.closePath();

  ctx.fill();
}

function animate() {
  const isMobile = window.innerWidth <= 600;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrunk();

  hearts.forEach((h) => {
    const waveX = Math.sin((frame + h.offset) * 0.012) * (isMobile ? 0.4 : 4);
    const waveY = Math.cos((frame + h.offset) * 0.012) * (isMobile ? 0.4 : 4);

    if (h.falling) {
      h.y += isMobile ? 0.08 : 1.2;
      h.x += Math.sin(frame * 0.012 + h.offset) * (isMobile ? 0.08 : 0.8);

      if (h.y > canvas.height + 20) {
        h.y = h.originalY;
        h.x = h.originalX;
      }

      drawHeart(h.x, h.y, h.size + (isMobile ? 0.1 : 1), h.color);
    } else {
      drawHeart(h.x + waveX, h.y + waveY, h.size, h.color);
    }
  });

  frame++;
  requestAnimationFrame(animate);
}

const startDate = new Date("2025-09-21T00:00:00");

function updateCounter() {
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diff = now - startDate;

  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  let text = "";

  if (years > 0) {
    text += `${years} años `;
  }

  text += `${months} meses ${days} días `;
  text += `${hours} horas ${minutes} minutos ${seconds} segundos`;

  document.getElementById("time").textContent = text;
}

setInterval(updateCounter, 1000);
updateCounter();

window.addEventListener("resize", () => {
  if (!card.classList.contains("hidden")) {
    resizeCanvas();
    createHearts();
  }
});