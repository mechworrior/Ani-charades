// Game State
let gameState = {
    score: 0,
    skipped: 0,
    timeLeft: 60,
    isPlaying: false,
    currentWord: null,
    usedWords: [],
    timerInterval: null
};

// Default word database
const defaultWords = {
    easy: [
        "Brushing teeth", "Eating pizza", "Drinking water", "Sleeping",
        "Running", "Dancing", "Swimming", "Reading a book",
        "Watching TV", "Playing video games", "Washing hands", "Combing hair",
        "Walking a dog", "Riding a bike", "Cooking", "Driving a car"
    ],
    medium: [
        "Playing guitar", "Doing yoga", "Taking a selfie", "Texting",
        "Shopping", "Painting a picture", "Playing basketball", "Singing opera",
        "Surfing", "Rock climbing", "Playing chess", "Baking a cake",
        "Gardening", "Playing drums", "Skiing", "Ice skating"
    ],
    hard: [
        "Tightrope walking", "Conducting an orchestra", "Defusing a bomb",
        "Performing surgery", "Bullfighting", "Breakdancing", "Juggling fire",
        "Trapeze artist", "Mime in a box", "Walking like a crab",
        "Robot malfunction", "Astronaut in zero gravity", "Possessed by a ghost",
        "Slipping on a banana peel", "Stuck in quicksand", "Zombie apocalypse"
    ]
};

// Initialize words from localStorage or use defaults
function getWords() {
    const stored = localStorage.getItem('charadeWords');
    return stored ? JSON.parse(stored) : defaultWords;
}

function saveWords(words) {
    localStorage.setItem('charadeWords', JSON.stringify(words));
}

// Get random word based on difficulty
function getRandomWord(difficulty) {
    const words = getWords();
    let wordPool = [];

    if (difficulty === 'all') {
        wordPool = [...words.easy, ...words.medium, ...words.hard];
    } else {
        wordPool = words[difficulty] || [];
    }

    // Filter out used words
    const availableWords = wordPool.filter(word => !gameState.usedWords.includes(word));

    // If all words used, reset
    if (availableWords.length === 0) {
        gameState.usedWords = [];
        return wordPool[Math.floor(Math.random() * wordPool.length)];
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    gameState.usedWords.push(randomWord);
    return randomWord;
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

// Display word
function showWord() {
    const difficulty = document.getElementById('difficulty').value;
    const word = getRandomWord(difficulty);
    gameState.currentWord = word;
    document.getElementById('wordDisplay').textContent = word;
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
    gameState.usedWords = [];

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

    // Show first word and start timer
    showWord();
    startTimer();
}

// Next word (correct)
function nextWord() {
    if (!gameState.isPlaying) return;

    gameState.score++;
    document.getElementById('score').textContent = gameState.score;
    showWord();
}

// Skip word
function skipWord() {
    if (!gameState.isPlaying) return;

    gameState.skipped++;
    document.getElementById('skipped').textContent = gameState.skipped;
    showWord();
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

    // Switch screens
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('nextBtn').addEventListener('click', nextWord);
    document.getElementById('skipBtn').addEventListener('click', skipWord);
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!gameState.isPlaying) return;

        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            nextWord();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            skipWord();
        }
    });
});
