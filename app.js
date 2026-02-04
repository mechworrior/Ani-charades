// Game State
let gameState = {
    score: 0,
    skipped: 0,
    timeLeft: 60,
    isPlaying: false,
    currentCharacter: null,
    usedCharacters: [],
    timerInterval: null,
    imageCache: {}
};

// Get characters from localStorage or use defaults from characters.js
function getCharacters() {
    const stored = localStorage.getItem('charadeCharacters');
    return stored ? JSON.parse(stored) : animeCharacters;
}

function saveCharacters(characters) {
    localStorage.setItem('charadeCharacters', JSON.stringify(characters));
}

// Fetch character image from anime API or use placeholder
async function fetchCharacterImage(characterName, animeName) {
    // Check cache first
    const cacheKey = `${characterName}-${animeName}`;
    if (gameState.imageCache[cacheKey]) {
        return gameState.imageCache[cacheKey];
    }

    try {
        // Try to fetch from Jikan API (MyAnimeList)
        const searchQuery = encodeURIComponent(characterName);
        const response = await fetch(`https://api.jikan.moe/v4/characters?q=${searchQuery}&limit=1`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                const imageUrl = data.data[0].images.jpg.image_url;
                gameState.imageCache[cacheKey] = imageUrl;
                return imageUrl;
            }
        }
    } catch (error) {
        console.log('Could not fetch image:', error);
    }

    // Return placeholder if API fails
    const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(characterName)}&size=300&background=667eea&color=fff&bold=true`;
    gameState.imageCache[cacheKey] = placeholder;
    return placeholder;
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

// Display character with image
async function showCharacter() {
    const difficulty = document.getElementById('difficulty').value;
    const character = getRandomCharacter(difficulty);
    gameState.currentCharacter = character;
    
    // Update character name
    document.getElementById('wordDisplay').textContent = character.name;
    document.getElementById('animeTitle').textContent = `from ${character.anime}`;
    
    // Show loader and hide image initially
    const imgElement = document.getElementById('charImg');
    const loaderElement = document.getElementById('imageLoader');
    imgElement.style.display = 'none';
    loaderElement.style.display = 'block';
    
    // Fetch and display image
    try {
        const imageUrl = await fetchCharacterImage(character.name, character.anime);
        imgElement.src = imageUrl;
        imgElement.onload = () => {
            loaderElement.style.display = 'none';
            imgElement.style.display = 'block';
        };
        imgElement.onerror = () => {
            loaderElement.style.display = 'none';
            // Keep image hidden if it fails to load
        };
    } catch (error) {
        loaderElement.style.display = 'none';
    }
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
    document.getElementById('charImg').style.display = 'none';
    document.getElementById('imageLoader').style.display = 'none';

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
