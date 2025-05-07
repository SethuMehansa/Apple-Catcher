const game = document.getElementById('game');
const player = document.getElementById('player');
const appleMeter = document.getElementById('appleMeter');
const levelDisplay = document.getElementById('levelDisplay');

let meterValue = 0;
let level = 1;
let fallSpeed = 2;
const meterMax = 100;
const goodFruit = '🍎';
const badItems = ['🍌', '🍇', '🍂', '🍊'];
let playerX = game.clientWidth / 2 - 40;

// Get references to the audio elements
const appleSound = document.getElementById('appleSound');
const otherFruitSound = document.getElementById('otherFruitSound');

// Move basket with arrow keys
function movePlayer(direction) {
  const speed = 20;
  playerX += direction * speed;
  const maxX = game.clientWidth - player.offsetWidth;
  playerX = Math.max(0, Math.min(maxX, playerX));
  player.style.left = playerX + 'px';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') movePlayer(-1);
  else if (e.key === 'ArrowRight') movePlayer(1);
});

// Spawn falling fruit or leaf
function createFallingItem() {
  const item = document.createElement('div');
  item.classList.add('fruit');

  const isApple = Math.random() < 0.5;
  item.textContent = isApple ? goodFruit : badItems[Math.floor(Math.random() * badItems.length)];
  item.style.left = Math.random() * (game.clientWidth - 40) + 'px';
  game.appendChild(item);

  let top = 0;
  const fallInterval = setInterval(() => {
    top += fallSpeed;
    item.style.top = top + 'px';

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.left < playerRect.right &&
      itemRect.right > playerRect.left
    ) {
      clearInterval(fallInterval);
      game.removeChild(item);

      if (item.textContent === goodFruit) {
        meterValue += 10;
        appleSound.play(); // Play sound for apple
      } else {
        meterValue -= 15;
        otherFruitSound.play(); // Play sound for other fruit
      }

      meterValue = Math.max(0, Math.min(meterMax, meterValue));
      updateMeter();

      if (meterValue >= meterMax) {
        levelUp();
      }
    }

    if (top > game.clientHeight) {
      game.removeChild(item);
      clearInterval(fallInterval);
    }
  }, 20);
}

function updateMeter() {
  appleMeter.style.width = meterValue + '%';
}

function levelUp() {
  level++;
  meterValue = 0;
  fallSpeed += 1;
  updateMeter();
  levelDisplay.textContent = 'Level: ' + level;

  // Add the zoom effect when leveling up
  game.classList.add('zoomed');

  // Remove the zoom effect after animation
  setTimeout(() => {
    game.classList.remove('zoomed');
  }, 500);  // This matches the duration of the zoom animation (0.5s)
}

// Start item drop loop
setInterval(createFallingItem, 1000);
