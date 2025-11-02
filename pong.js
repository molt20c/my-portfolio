// Canvas and context
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Paddle and ball
const paddleWidth = 10, paddleHeight = 70;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 4;

// Score and game state
let playerScore = 0, aiScore = 0;
let gameRunning = false, gamePaused = false;

// DOM elements
const playerScoreElem = document.getElementById("playerScore");
const aiScoreElem = document.getElementById("aiScore");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fill();
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 15) {
    drawRect(canvas.width/2 - 1, i, 2, 10, "white");
  }
}

// Reset ball to center
function resetBall() {
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = (Math.random()*4 - 2);
}

// Draw game
function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawRect(0, playerY, paddleWidth, paddleHeight, "white");
  drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, "white");
  drawCircle(ballX, ballY, 8, "white");
}

// Update game logic
function update() {
  if(!gameRunning || gamePaused) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if(ballY < 0 || ballY > canvas.height) ballSpeedY *= -1;

  // Player paddle collision
  if(ballX < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) ballSpeedX *= -1;

  // AI paddle collision
  if(ballX > canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) ballSpeedX *= -1;

  // AI movement — almost unbeatable
  const aiCenter = aiY + paddleHeight/2;
  if(aiCenter < ballY - 10) aiY += 6;
  else if(aiCenter > ballY + 10) aiY -= 6;

  // Scoring
  if(ballX < 0) { aiScore++; aiScoreElem.textContent = aiScore; resetBall(); }
  if(ballX > canvas.width) { playerScore++; playerScoreElem.textContent = playerScore; resetBall(); }
}

// Player mouse control
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - paddleHeight/2;
});

// Buttons
startBtn.addEventListener("click", () => {
  if(!gameRunning) { gameRunning = true; gamePaused = false; pauseBtn.textContent = "Pause"; gameLoop(); }
});

pauseBtn.addEventListener("click", () => {
  if(!gameRunning) return;
  gamePaused = !gamePaused;
  pauseBtn.textContent = gamePaused ? "Resume" : "Pause";
});

resetBtn.addEventListener("click", () => {
  playerScore = aiScore = 0;
  playerScoreElem.textContent = aiScoreElem.textContent = 0;
  resetBall();
});

// Game loop
function gameLoop() {
  update();
  draw();
  if(gameRunning) requestAnimationFrame(gameLoop);
}

// Initial draw
draw();



const darkModeBtn = document.getElementById("darkModeToggle");
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});


// Resize Pong canvas on mobile
function resizePongCanvas() {
  const container = document.getElementById('pongContainer');
  const canvas = document.getElementById('pongCanvas');
  canvas.width = Math.min(600, container.offsetWidth); // max 600px
  canvas.height = 400 * (canvas.width / 600); // maintain ratio
}

window.addEventListener('resize', resizePongCanvas);
window.addEventListener('load', resizePongCanvas);

