// Game State
let gameState = {
    score: 0,
    skipped: 0,
    timeLeft: 60,
    isPlaying: false,
    currentCharacter: null,
    usedCharacters: [],
    timerInterval: null
};

// Get characters from localStorage or use defaults from characters.js
function getCharacters() {
    const stored = localStorage.getItem('charadeCharacters');
    return stored ? JSON.parse(stored) : animeCharacters;
}

function saveCharacters(characters) {
    localStorage.setItem('charadeCharacters', JSON.stringify(characters));
}

// Get random character based on difficulty
function getRandomCharacter(difficulty) {
    const characters = getCharacters();
    let characterPool = [];

    if (difficulty === 'all') {
        characterPool = [...characters.easy, ...characters.medium, ...characters.hard];
    } else {
        characterPool = characters[difficulty] || [];
    }

    // Filter out used characters
    const availableCharacters = characterPool.filter(char => 
        !gameState.usedCharacters.some(used => used.name === char.name && used.anime === char.anime)
    );

    // If all characters used, reset
    if (availableCharacters.length === 0) {
        gameState.usedCharacters = [];
        return characterPool[Math.floor(Math.random() * characterPool.length)];
    }

    const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    gameState.usedCharacters.push(randomCharacter);
    return randomCharacter;
}

// Timer function
function startTimer() {
    const timerElement = document.getElementById('timer');
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        timerElement.textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// Display character
function showCharacter() {
    const difficulty = document.getElementById('difficulty').value;
    const character = getRandomCharacter(difficulty);
    gameState.currentCharacter = character;
    
    // Update character name and anime
    document.getElementById('wordDisplay').textContent = character.name;
    document.getElementById('animeTitle').textContent = `from ${character.anime}`;
}

// Start game
function startGame() {
    const timeLimitInput = document.getElementById('timeLimit');
    const timeLimit = parseInt(timeLimitInput.value) || 60;

    // Reset game state
    gameState.score = 0;
    gameState.skipped = 0;
    gameState.timeLeft = timeLimit;
    gameState.isPlaying = true;
    gameState.usedCharacters = [];

    // Update UI
    document.getElementById('score').textContent = '0';
    document.getElementById('skipped').textContent = '0';
    document.getElementById('timer').textContent = timeLimit;

    // Enable/disable buttons
    document.getElementById('startBtn').disabled = true;
    document.getElementById('nextBtn').disabled = false;
    document.getElementById('skipBtn').disabled = false;
    document.getElementById('difficulty').disabled = true;
    timeLimitInput.disabled = true;

    // Show first character and start timer
    showCharacter();
    startTimer();
}

// Next character (correct)
function nextCharacter() {
    if (!gameState.isPlaying) return;

    gameState.score++;
    document.getElementById('score').textContent = gameState.score;
    showCharacter();
}

// Skip character
function skipCharacter() {
    if (!gameState.isPlaying) return;

    gameState.skipped++;
    document.getElementById('skipped').textContent = gameState.skipped;
    showCharacter();
}

// End game
function endGame() {
    gameState.isPlaying = false;
    stopTimer();

    // Update final scores
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalSkipped').textContent = gameState.skipped;

    // Switch screens
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('gameOverScreen').classList.add('active');

    // Re-enable settings
    document.getElementById('difficulty').disabled = false;
    document.getElementById('timeLimit').disabled = false;
}

// Play again
function playAgain() {
    // Reset buttons
    document.getElementById('startBtn').disabled = false;
    document.getElementById('nextBtn').disabled = true;
    document.getElementById('skipBtn').disabled = true;

    // Reset display
    document.getElementById('wordDisplay').textContent = 'Click "Start" to begin!';
    document.getElementById('animeTitle').textContent = '';

    // Switch screens
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('nextBtn').addEventListener('click', nextCharacter);
    document.getElementById('skipBtn').addEventListener('click', skipCharacter);
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!gameState.isPlaying) return;

        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            nextCharacter();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            skipCharacter();
        }
    });
});
