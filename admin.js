// Admin Panel JavaScript

// Get characters from localStorage
function getCharacters() {
    const stored = localStorage.getItem('charadeCharacters');
    if (stored) {
        return JSON.parse(stored);
    }
    return animeCharacters;
}

// Save characters to localStorage
function saveCharacters(characters) {
    localStorage.setItem('charadeCharacters', JSON.stringify(characters));
}

// Render characters list
function renderCharactersList(filter = 'all') {
    const characters = getCharacters();
    const container = document.getElementById('wordsList');
    container.innerHTML = '';

    const categories = filter === 'all' ? ['easy', 'medium', 'hard'] : [filter];

    categories.forEach(category => {
        if (characters[category] && characters[category].length > 0) {
            characters[category].forEach((character, index) => {
                const charItem = document.createElement('div');
                charItem.className = `word-item ${category}`;
                charItem.innerHTML = `
                    <div class="word-content">
                        <span class="word-text">${character.name}</span>
                        <span class="anime-series"> - ${character.anime}</span>
                        <span class="word-difficulty">${category}</span>
                    </div>
                    <button class="delete-btn" data-category="${category}" data-index="${index}">Delete</button>
                `;
                container.appendChild(charItem);
            });
        }
    });

    // Add delete event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteCharacter);
    });
}

// Add new character
function addCharacter() {
    const nameInput = document.getElementById('characterName');
    const animeInput = document.getElementById('animeName');
    const categorySelect = document.getElementById('category');
    
    const name = nameInput.value.trim();
    const anime = animeInput.value.trim();
    const category = categorySelect.value;

    if (!name || !anime) {
        alert('Please enter both character name and anime series!');
        return;
    }

    const characters = getCharacters();
    
    // Check if character already exists
    const allCharacters = [...characters.easy, ...characters.medium, ...characters.hard];
    if (allCharacters.some(c => c.name.toLowerCase() === name.toLowerCase() && c.anime.toLowerCase() === anime.toLowerCase())) {
        alert('This character already exists!');
        return;
    }

    // Add character to category
    if (!characters[category]) {
        characters[category] = [];
    }
    characters[category].push({ name, anime });
    
    saveCharacters(characters);
    nameInput.value = '';
    animeInput.value = '';
    
    // Re-render list
    const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
    renderCharactersList(currentFilter);
    
    alert('Character added successfully!');
}

// Delete character
function deleteCharacter(e) {
    const category = e.target.dataset.category;
    const index = parseInt(e.target.dataset.index);

    if (confirm('Are you sure you want to delete this character?')) {
        const characters = getCharacters();
        characters[category].splice(index, 1);
        saveCharacters(characters);
        
        const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
        renderCharactersList(currentFilter);
    }
}

// Export characters as JSON
function exportCharacters() {
    const characters = getCharacters();
    const dataStr = JSON.stringify(characters, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'anime-characters.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import characters from JSON
function importCharacters(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedCharacters = JSON.parse(event.target.result);
            
            // Validate structure
            if (!importedCharacters.easy || !importedCharacters.medium || !importedCharacters.hard) {
                alert('Invalid file format! Must contain easy, medium, and hard categories.');
                return;
            }

            saveCharacters(importedCharacters);
            renderCharactersList('all');
            alert('Characters imported successfully!');
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

// Reset to default characters
function resetToDefault() {
    if (confirm('This will delete all custom characters and restore defaults. Continue?')) {
        localStorage.removeItem('charadeCharacters');
        renderCharactersList('all');
        alert('Reset to default characters!');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderCharactersList('all');

    // Add character button
    document.getElementById('addCharBtn').addEventListener('click', addCharacter);

    // Allow Enter key to add character
    document.getElementById('characterName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCharacter();
        }
    });
    
    document.getElementById('animeName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCharacter();
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCharactersList(btn.dataset.filter);
        });
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportCharacters);

    // Import button
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', importCharacters);

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetToDefault);
});
