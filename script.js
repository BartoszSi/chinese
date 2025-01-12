const words = [
    {
        character: '你好',
        pinyin: 'nǐ hǎo',
        meaning: 'Hello',
        example: '你好，早上好！(Hello, good morning!)',
        audio: 'nihao.mp3' // You'll need to add actual audio files
    },
    {
        character: '谢谢',
        pinyin: 'xiè xiè',
        meaning: 'Thank you',
        example: '谢谢你的帮助！(Thank you for your help!)',
        audio: 'xiexie.mp3'
    },
    {
        character: '随便',
        pinyin: 'suí biàn',
        meaning: 'As you wish / Whatever / Casual',
        example: '你想吃什么？随便。(What do you want to eat? Whatever is fine.)',
        audio: 'suibian.mp3'
    },
    {
        character: '加油',
        pinyin: 'jiā yóu',
        meaning: 'Keep going! / Come on! / Good luck!',
        example: '考试加油！(Good luck with your exam!)',
        audio: 'jiayou.mp3'
    },
    {
        character: '马马虎虎',
        pinyin: 'mǎ ma hū hu',
        meaning: 'So-so / Careless',
        example: '你的中文怎么样？马马虎虎。(How\'s your Chinese? So-so.)',
        audio: 'mamahu.mp3'
    },
    {
        character: '不好意思',
        pinyin: 'bù hǎo yì si',
        meaning: 'Sorry / Embarrassed',
        example: '不好意思，我迟到了。(Sorry, I\'m late.)',
        audio: 'buhaoyisi.mp3'
    },
    {
        character: '受不了',
        pinyin: 'shòu bù liǎo',
        meaning: 'Can\'t stand it / Can\'t take it anymore',
        example: '我受不了这么热的天气！(I can\'t stand such hot weather!)',
        audio: 'shoubulia.mp3'
    },
    {
        character: '讲究',
        pinyin: 'jiǎng jiu',
        meaning: 'Particular about / Pay attention to detail',
        example: '他很讲究穿着。(He\'s very particular about his clothes.)',
        audio: 'jiangjiu.mp3'
    },
    {
        character: '半途而废',
        pinyin: 'bàn tú ér fèi',
        meaning: 'To give up halfway / Leave something unfinished',
        example: '学习不能半途而废。(Don\'t give up studying halfway.)',
        audio: 'bantuerfei.mp3'
    },
    {
        character: '入乡随俗',
        pinyin: 'rù xiāng suí sú',
        meaning: 'When in Rome, do as the Romans do',
        example: '到了新国家要入乡随俗。(When in a new country, follow local customs.)',
        audio: 'ruxiangsuisu.mp3'
    }
];

let currentWordIndex = 0;
let isMeaningShown = false;
let isPlaying = false;

document.addEventListener('DOMContentLoaded', () => {
    const card = document.querySelector('.card');
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
    const meaning = card.querySelector('.meaning');
    const character = card.querySelector('.character');
    
    character.textContent = words[currentWordIndex].character;
    meaning.classList.add('hidden');
    isMeaningShown = false;
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

// TODO: Implement sound functionality
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