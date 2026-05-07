const canvas = document.getElementById("tree");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const card = document.getElementById("card");
const song = document.getElementById("song");

let hearts = [];
let fallingHearts = [];
let frame = 0;
let started = false;

const colors = ["#ff2e63", "#ff4ecd", "#ff6f91", "#ff9671", "#ffb6c1"];

startBtn.addEventListener("click", () => {

  // empieza música INMEDIATAMENTE
  if (song) {
    song.volume = 0.45;
    song.play().catch(() => {});
  }

  // pequeña transición
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

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 70;
  const scale = 13;

  for (let i = 0; i < 1000; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartShape(t);
    const fill = Math.sqrt(Math.random());

    hearts.push({
      x: centerX + p.x * scale * fill,
      y: centerY - p.y * scale * fill,
      size: Math.random() * 8 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      offset: Math.random() * 500,
      movement: Math.random() * 2.5 + 1.5
    });
  }
}

function createFallingHearts() {
  fallingHearts = [];

  for (let i = 0; i < 55; i++) {
    fallingHearts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 1.8 + 0.6,
      speedX: Math.random() * 1.5 - 0.5,
      offset: Math.random() * 500
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
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fill();

  ctx.restore();
}

function drawTrunk() {
  const x = canvas.width / 2;
  const top = canvas.height / 2 + 70;
  const bottom = canvas.height - 20;

  ctx.fillStyle = "#00a884";

  ctx.beginPath();
  ctx.moveTo(x - 25, bottom);
  ctx.lineTo(x + 25, bottom);
  ctx.lineTo(x + 10, top);
  ctx.lineTo(x - 10, top);
  ctx.closePath();

  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTrunk();

  // Corazones que forman el árbol
  hearts.forEach((h) => {
    const moveX = Math.sin((frame + h.offset) * 0.40) * h.movement;
    const moveY = Math.cos((frame + h.offset) * 0.40) * h.movement;

    drawHeart(h.x + moveX, h.y + moveY, h.size, h.color);
  });

  // Corazones cayendo
  fallingHearts.forEach((h) => {
    h.y += h.speedY;
    h.x += h.speedX + Math.sin((frame + h.offset) * 0.03) * 0.6;

    if (h.y > canvas.height + 40) {
      h.y = 70;
      h.x = Math.random() * canvas.width;
    }

    drawHeart(h.x, h.y, h.size, h.color);
  });

  frame++;
  requestAnimationFrame(animate);
}

const startDate = new Date("2025-09-25T00:00:00");

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("time").textContent =
    `${days} días ${hours} horas ${minutes} minutos ${seconds} segundos`;
}

setInterval(updateCounter, 1000);
updateCounter();

window.addEventListener("resize", () => {
  if (!card.classList.contains("hidden")) {
    resizeCanvas();
    createHearts();
    createFallingHearts();
  }
});