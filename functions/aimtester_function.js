const target = document.getElementById('target');
const scoreValue = document.getElementById('scoreValue');
const timeValue = document.getElementById('timeValue');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const goal = 20; // Change the goal here
let score = 0;
let time = 60; // Change the time limit here (in seconds)
let timerInterval;
let missPenalty = 1; // Penalty for missing the target

// Function to generate a random position for the target
function randomPosition() {
   const maxX = window.innerWidth - target.clientWidth;
   const maxY = window.innerHeight - target.clientHeight;
   const newX = Math.random() * maxX;
   const newY = Math.random() * maxY;
   return {
      x: newX,
      y: newY
   };
}

// Function to move the target to a random position
function moveTarget() {
   const position = randomPosition();
   target.style.left = position.x + 'px';
   target.style.top = position.y + 'px';
}

// Function to handle clicks on the target
function handleTargetClick() {
   score++;
   scoreValue.textContent = score;
   moveTarget();
}

target.addEventListener('click', handleTargetClick);

// Function to update the timer
function updateTimer() {
   if (time > 0 && score < goal) {
      time--;
      timeValue.textContent = time;
   } else {
      clearInterval(timerInterval);
      target.removeEventListener('click', handleTargetClick);
      if (score >= goal) {
         alert('Congratulations! You reached the goal.');
      } else {
         alert('Time\'s up! You didn\'t reach the goal.');
      }
   }
}

startButton.addEventListener('click', () => {
   timerInterval = setInterval(updateTimer, 1000);
   startButton.disabled = true;
   pauseButton.disabled = false;
   resetButton.disabled = false;
   target.addEventListener('click', handleTargetClick);
   moveTarget();
});

pauseButton.addEventListener('click', () => {
   clearInterval(timerInterval);
   startButton.disabled = false;
   pauseButton.disabled = true;
   target.removeEventListener('click', handleTargetClick);
});

resetButton.addEventListener('click', () => {
   score = 0;
   scoreValue.textContent = score;
   time = 60;
   timeValue.textContent = time;
   startButton.disabled = false;
   pauseButton.disabled = true;
   resetButton.disabled = true;
   target.removeEventListener('click', handleTargetClick);
});