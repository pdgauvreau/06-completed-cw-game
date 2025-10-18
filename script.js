// Difficulty settings
const difficultySettings = {
    easy: {
        winScore: 15,
        timeLimit: 40,
        dropInterval: 1200,
        dropSpeed: 5,
        description: "Catch 15 drops in 40 seconds"
    },
    normal: {
        winScore: 20,
        timeLimit: 30,
        dropInterval: 1000,
        dropSpeed: 4,
        description: "Catch 20 drops in 30 seconds"
    },
    hard: {
        winScore: 30,
        timeLimit: 25,
        dropInterval: 800,
        dropSpeed: 3,
        description: "Catch 30 drops in 25 seconds"
    }
};

// Game state variables
let gameRunning = false;
let dropMaker;
let score = 0;
let timeLeft = 40;
let timerInterval;
let currentDifficulty = 'easy';

// Arrays of messages
const winningMessages = [
    "Amazing! You're making waves for clean water! 🌊",
    "Incredible work! Every drop counts! 💧",
    "Fantastic! You're a water hero! 🎉",
    "Outstanding! Clean water for all! ⭐",
    "You did it! Making a difference, one drop at a time! 🙌"
];

const losingMessages = [
    "Good try! Practice makes perfect! Keep going! 💪",
    "Nice effort! Try again to help more people get clean water! 🌟",
    "Don't give up! Every attempt helps raise awareness! 💙",
    "Keep trying! You're learning to make a bigger impact! 🎯",
    "Almost there! Give it another shot! 🚀"
];

// Get elements
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const timerElement = document.querySelector(".timer");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
const difficultyInfo = document.querySelector(".difficulty-info");

// Difficulty button event listeners
difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (gameRunning) return;
        
        // Update active button
        difficultyButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // Update difficulty
        currentDifficulty = btn.dataset.difficulty;
        const settings = difficultySettings[currentDifficulty];
        
        // Update display
        timeDisplay.textContent = settings.timeLimit;
        difficultyInfo.innerHTML = `<strong>${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}:</strong> ${settings.description}`;
    });
});

// Start button event listener
startBtn.addEventListener("click", startGame);

function startGame() {
    if (gameRunning) return;

    const settings = difficultySettings[currentDifficulty];

    // Reset game state
    gameRunning = true;
    score = 0;
    timeLeft = settings.timeLimit;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    timerElement.classList.remove("warning");
    
    // Clear any existing drops and messages
    gameContainer.innerHTML = "";
    
    // Disable start button and difficulty buttons
    startBtn.disabled = true;
    startBtn.textContent = "Game Running...";
    difficultyButtons.forEach(btn => btn.disabled = true);

    // Start creating drops
    dropMaker = setInterval(createDrop, settings.dropInterval);

    // Start countdown timer
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    // Add warning style when time is low
    if (timeLeft <= 10) {
        timerElement.classList.add("warning");
    }

    // End game when time reaches 0
    if (timeLeft <= 0) {
        endGame();
    }
}

function createDrop() {
    const settings = difficultySettings[currentDifficulty];
    const drop = document.createElement("div");
    drop.className = "water-drop";

    // Random size variation
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.8 + 0.5;
    const size = initialSize * sizeMultiplier;
    drop.style.width = drop.style.height = `${size}px`;

    // Random horizontal position
    const gameWidth = gameContainer.offsetWidth;
    const xPosition = Math.random() * (gameWidth - 60);
    drop.style.left = xPosition + "px";

    // Fall duration based on difficulty
    drop.style.animationDuration = `${settings.dropSpeed}s`;

    // Add click event to score points
    drop.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = score;
        drop.remove();
    });

    // Add to game container
    gameContainer.appendChild(drop);

    // Remove drop when animation ends
    drop.addEventListener("animationend", () => {
        drop.remove();
    });
}

function endGame() {
    gameRunning = false;
    
    const settings = difficultySettings[currentDifficulty];
    
    // Stop creating drops and timer
    clearInterval(dropMaker);
    clearInterval(timerInterval);

    // Remove remaining drops
    const remainingDrops = document.querySelectorAll(".water-drop");
    remainingDrops.forEach(drop => drop.remove());

    // Determine win or lose
    const won = score >= settings.winScore;
    
    // Pick random message
    let message;
    if (won) {
        message = winningMessages[Math.floor(Math.random() * winningMessages.length)];
    } else {
        message = losingMessages[Math.floor(Math.random() * losingMessages.length)];
    }

    // Display game over message
    const messageDiv = document.createElement("div");
    messageDiv.className = `game-over-message ${won ? 'win' : 'lose'}`;
    messageDiv.innerHTML = `
        <div class="difficulty-label">Difficulty: ${currentDifficulty.toUpperCase()}</div>
        <h2>${won ? '🎉 You Win!' : '💪 Try Again!'}</h2>
        <p>${message}</p>
        <div class="final-score">Final Score: ${score}/${settings.winScore}</div>
        <p>${won ? 'You caught enough drops to make a real difference!' : `You need ${settings.winScore} drops to win. You can do it!`}</p>
    `;
    gameContainer.appendChild(messageDiv);

    // Re-enable start button and difficulty buttons
    startBtn.disabled = false;
    startBtn.textContent = "Play Again";
    difficultyButtons.forEach(btn => btn.disabled = false);
    timerElement.classList.remove("warning");
}