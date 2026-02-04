// Admin Panel JavaScript

// Get words from localStorage
function getWords() {
    const stored = localStorage.getItem('charadeWords');
    if (stored) {
        return JSON.parse(stored);
    }
    return {
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
}

// Save words to localStorage
function saveWords(words) {
    localStorage.setItem('charadeWords', JSON.stringify(words));
}

// Render words list
function renderWordsList(filter = 'all') {
    const words = getWords();
    const container = document.getElementById('wordsList');
    container.innerHTML = '';

    const categories = filter === 'all' ? ['easy', 'medium', 'hard'] : [filter];

    categories.forEach(category => {
        if (words[category] && words[category].length > 0) {
            words[category].forEach((word, index) => {
                const wordItem = document.createElement('div');
                wordItem.className = `word-item ${category}`;
                wordItem.innerHTML = `
                    <div class="word-content">
                        <span class="word-text">${word}</span>
                        <span class="word-difficulty">${category}</span>
                    </div>
                    <button class="delete-btn" data-category="${category}" data-index="${index}">Delete</button>
                `;
                container.appendChild(wordItem);
            });
        }
    });

    // Add delete event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteWord);
    });
}

// Add new word
function addWord() {
    const wordInput = document.getElementById('newWord');
    const categorySelect = document.getElementById('category');
    
    const word = wordInput.value.trim();
    const category = categorySelect.value;

    if (!word) {
        alert('Please enter a word or phrase!');
        return;
    }

    const words = getWords();
    
    // Check if word already exists
    const allWords = [...words.easy, ...words.medium, ...words.hard];
    if (allWords.some(w => w.toLowerCase() === word.toLowerCase())) {
        alert('This word already exists!');
        return;
    }

    // Add word to category
    if (!words[category]) {
        words[category] = [];
    }
    words[category].push(word);
    
    saveWords(words);
    wordInput.value = '';
    
    // Re-render list
    const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
    renderWordsList(currentFilter);
    
    alert('Word added successfully!');
}

// Delete word
function deleteWord(e) {
    const category = e.target.dataset.category;
    const index = parseInt(e.target.dataset.index);

    if (confirm('Are you sure you want to delete this word?')) {
        const words = getWords();
        words[category].splice(index, 1);
        saveWords(words);
        
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderWordsList(currentFilter);
    }
}

// Export words as JSON
function exportWords() {
    const words = getWords();
    const dataStr = JSON.stringify(words, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'charades-words.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import words from JSON
function importWords(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedWords = JSON.parse(event.target.result);
            
            // Validate structure
            if (!importedWords.easy || !importedWords.medium || !importedWords.hard) {
                alert('Invalid file format! Must contain easy, medium, and hard categories.');
                return;
            }

            saveWords(importedWords);
            renderWordsList('all');
            alert('Words imported successfully!');
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

// Reset to default words
function resetToDefault() {
    if (confirm('This will delete all custom words and restore defaults. Continue?')) {
        localStorage.removeItem('charadeWords');
        renderWordsList('all');
        alert('Reset to default words!');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderWordsList('all');

    // Add word button
    document.getElementById('addWordBtn').addEventListener('click', addWord);

    // Allow Enter key to add word
    document.getElementById('newWord').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWord();
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderWordsList(btn.dataset.filter);
        });
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportWords);

    // Import button
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', importWords);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetToDefault);
});
