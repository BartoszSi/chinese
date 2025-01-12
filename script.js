import words from './data/words.js';

let currentWordIndex = 0;
let isMeaningShown = false;
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const card = document.querySelector('.card');

    // Initially hide the card
    card.classList.add('hidden');

    // Start button click handler
    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        card.classList.remove('hidden');
        showWord(); // Show the first word
    });

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // Disable default touch behaviors
    document.body.addEventListener('touchmove', (e) => {
        if (isDragging) e.preventDefault();
    }, { passive: false });

    // Touch events for card
    card.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX - startX;
        const rotation = currentX / 20; // Subtle rotation while dragging
        
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        card.style.opacity = (1 - Math.abs(currentX) / 500).toString();
    });

    card.addEventListener('touchend', () => {
        isDragging = false;
        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

        if (Math.abs(currentX) > 100) { // Swipe threshold
            // Swipe animation
            card.style.transform = `translateX(${currentX < 0 ? -1000 : 1000}px) rotate(${currentX < 0 ? -30 : 30}deg)`;
            card.style.opacity = '0';
            
            // After animation, reset and show next card
            setTimeout(() => {
                card.style.transform = 'none';
                card.style.opacity = '1';
                currentWordIndex = (currentWordIndex + 1) % words.length;
                showWord();
            }, 300);
        } else {
            // Reset card position if not swiped enough
            card.style.transform = 'none';
            card.style.opacity = '1';
        }
        
        currentX = 0;
    });
});

function showWord() {
    const card = document.querySelector('.card');
    const currentWord = words[currentWordIndex];
    
    card.innerHTML = `
        <div class="character">${currentWord.character}</div>
        <div class="pinyin">${currentWord.pinyin}</div>
        <button class="sound-btn"></button>
        <div class="meaning hidden">
            <h3>${currentWord.meaning}</h3>
            <p>${currentWord.example}</p>
        </div>
    `;

    // Reattach sound button listener
    const soundBtn = card.querySelector('.sound-btn');
    soundBtn.addEventListener('click', () => {
        if (isPlaying) return;
        
        isPlaying = true;
        const text = currentWord.character;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        
        utterance.onend = () => {
            isPlaying = false;
        };
        
        window.speechSynthesis.speak(utterance);
    });
}

function showMeaning() {
    const meaning = document.querySelector('.meaning');
    meaning.innerHTML = `
        <h3>${words[currentWordIndex].meaning}</h3>
        <p>${words[currentWordIndex].example}</p>
    `;
    meaning.classList.remove('hidden');
    isMeaningShown = true;
}

document.querySelector('.sound-btn').addEventListener('click', () => {
    if (isPlaying) return;
    
    isPlaying = true;
    const text = words[currentWordIndex].character;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    
    utterance.onend = () => {
        isPlaying = false;
    };
    
    window.speechSynthesis.speak(utterance);
}); 