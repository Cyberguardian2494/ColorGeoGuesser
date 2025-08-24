const canvas = document.getElementById('color-wheel');
const ctx = canvas.getContext('2d');
const preview = document.getElementById('preview-color');
const target = document.getElementById('target-color');
const scoreDisplay = document.getElementById('score');
const roundIndicator = document.getElementById('round-indicator');
const selectBtn = document.getElementById('select-btn');
const replayBtn = document.getElementById('replay-btn');
const quitBtn = document.getElementById('quit-btn');

let currentRound = 1;
let totalScore = 0;
let selectedHue = null;
let targetHue = null;

// 🎨 Draw the color wheel
function drawColorWheel() {
  const radius = canvas.width / 2;
  const image = ctx.createImageData(canvas.width, canvas.height);

  for (let y = -radius; y < radius; y++) {
    for (let x = -radius; x < radius; x++) {
      const dx = x + radius;
      const dy = y + radius;
      const distance = Math.sqrt(x * x + y * y);
      if (distance <= radius) {
        const angle = Math.atan2(y, x);
        const hue = (angle * 180 / Math.PI + 360) % 360;
        const saturation = distance / radius;
        const rgb = hsvToRgb(hue, saturation, 1);
        const index = (dy * canvas.width + dx) * 4;
        image.data[index] = rgb[0];
        image.data[index + 1] = rgb[1];
        image.data[index + 2] = rgb[2];
        image.data[index + 3] = 255;
      }
    }
  }
  ctx.putImageData(image, 0, 0);
}

// 🌈 Convert HSV to RGB
function hsvToRgb(h, s, v) {
  let f = (n, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5) * 255, f(3) * 255, f(1) * 255];
}

// 🎯 Generate a random target hue
function generateTargetColor() {
  targetHue = Math.floor(Math.random() * 360);
  const rgb = hsvToRgb(targetHue, 1, 1);
  target.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// 🔢 Update round display
function updateRoundDisplay() {
  roundIndicator.textContent = `Round ${currentRound} of 3`;
}

// 🖱️ Handle color wheel click
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - canvas.width / 2;
  const y = e.clientY - rect.top - canvas.height / 2;
  const distance = Math.sqrt(x * x + y * y);
  const radius = canvas.width / 2;

  if (distance <= radius) {
    const angle = Math.atan2(y, x);
    selectedHue = (angle * 180 / Math.PI + 360) % 360;
    const rgb = hsvToRgb(selectedHue, 1, 1);
    preview.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }
});

// ✅ Handle "Select" button click
selectBtn.addEventListener('click', () => {
  if (selectedHue === null) return;

  const diff = Math.abs(selectedHue - targetHue);
  const hueDiff = Math.min(diff, 360 - diff); // wrap-around hue
  const score = Math.round(100 - hueDiff); // max score = 100
  totalScore += score;

  
  if (currentRound < 3) {
    currentRound++;
    updateRoundDisplay();
    generateTargetColor();
    selectedHue = null;
    preview.style.backgroundColor = '#fff';
    scoreDisplay.textContent = `Score: ${Math.round(totalScore / currentRound)}%`;
  } else {
    const finalPercentage = Math.round(totalScore / 3);
    scoreDisplay.textContent = `Final Score: ${finalPercentage}%`;
    roundIndicator.textContent = `Game Over`;
    showFinalMessage(finalPercentage);
  }
});

// 🏁 Final message based on score
function showFinalMessage(score) {
  let message = '';
  if (score >= 90) message = '🎨 Color Wizard!';
  else if (score >= 80) message = '🧠 Sharp Eye!';
  else if (score >= 70) message = '👍 Good!';
  else if (score >= 60) message = '🙂 Not Bad';
  else message = '😅 Try Again?';

  const msgBox = document.createElement('div');
  msgBox.textContent = message;
  msgBox.className = 'final-message'; // 👈 Add this class for easy removal
  msgBox.style.marginTop = '20px';
  msgBox.style.fontSize = '20px';
  msgBox.style.fontWeight = 'bold';
  document.body.appendChild(msgBox);
}

// 🔁 Replay button
replayBtn.addEventListener('click', () => {
  currentRound = 1;
  totalScore = 0;
  selectedHue = null;
  preview.style.backgroundColor = '#fff';
  scoreDisplay.textContent = 'Score: 0';
  updateRoundDisplay();
  generateTargetColor();

  // 🧹 Remove final message if it exists
  const existingMsg = document.querySelector('.final-message');
  if (existingMsg) {
    existingMsg.remove();
  }

  // Re-enable canvas and button if they were disabled
  canvas.style.pointerEvents = 'auto';
  selectBtn.disabled = false;
});


// ❌ Quit button
quitBtn.addEventListener('click', () => {
  roundIndicator.textContent = 'Thanks for playing!';
  canvas.style.pointerEvents = 'none';
  selectBtn.disabled = true;
});

// 🚀 Start the game
drawColorWheel();
generateTargetColor();
updateRoundDisplay();
