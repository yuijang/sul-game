const animals = ["🐰", "🐢", "🐶", "🐱", "🐼", "🐸", "🐯", "🐵", "🦁", "🐷", "🐨", "🦊"];
let selectedAnimals = [];
let racers = [];
let finishedCount = 0;
let isRacing = false;

// DOM Elements
const animalGrid = document.getElementById('animal-grid');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const screens = {
    selection: document.getElementById('selection-screen'),
    race: document.getElementById('race-screen'),
    result: document.getElementById('result-screen')
};
const tracksContainer = document.getElementById('race-tracks');
const loserDisplay = document.getElementById('loser-display');
const resultMessage = document.getElementById('result-message');

// Initialize Animal Grid
function initGrid() {
    animalGrid.innerHTML = '';
    animals.forEach(emoji => {
        const div = document.createElement('div');
        div.className = 'animal-item';
        div.innerText = emoji;
        div.onclick = () => toggleSelect(emoji, div);
        animalGrid.appendChild(div);
    });
}

function toggleSelect(emoji, element) {
    if (selectedAnimals.includes(emoji)) {
        selectedAnimals = selectedAnimals.filter(a => a !== emoji);
        element.classList.remove('selected');
    } else {
        selectedAnimals.push(emoji);
        element.classList.add('selected');
    }
}

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startRace() {
    if (selectedAnimals.length < 2) {
        alert('최소 2마리의 동물을 선택해주세요!');
        return;
    }

    isRacing = true;
    finishedCount = 0;
    racers = [];
    tracksContainer.innerHTML = '';

    selectedAnimals.forEach((emoji, index) => {
        const track = document.createElement('div');
        track.className = 'track';
        
        const runner = document.createElement('div');
        runner.className = 'runner';
        runner.innerText = emoji;
        runner.style.left = '10px';
        
        track.appendChild(runner);
        tracksContainer.appendChild(track);

        racers.push({
            emoji: emoji,
            element: runner,
            position: 10,
            speed: 0,
            finished: false,
            finishTime: 0
        });
    });

    showScreen('race');
    requestAnimationFrame(updateRace);
}

function updateRace() {
    if (!isRacing) return;

    let allFinished = true;
    const trackWidth = tracksContainer.offsetWidth - 60; // Adjust for emoji size and padding

    racers.forEach(racer => {
        if (!racer.finished) {
            allFinished = false;
            
            // Random movement logic
            const acceleration = Math.random() * 0.5;
            racer.speed += acceleration;
            racer.speed *= 0.95; // Friction
            
            // Random "burst" of speed
            if (Math.random() < 0.05) racer.speed += Math.random() * 5;

            racer.position += racer.speed;

            if (racer.position >= trackWidth) {
                racer.position = trackWidth;
                racer.finished = true;
                racer.finishTime = Date.now();
                finishedCount++;
            }

            racer.element.style.left = racer.position + 'px';
        }
    });

    if (allFinished) {
        isRacing = false;
        setTimeout(finishRace, 1000);
    } else {
        requestAnimationFrame(updateRace);
    }
}

function finishRace() {
    // Sort racers by finish time (the one with the latest time is the loser)
    const sortedRacers = [...racers].sort((a, b) => b.finishTime - a.finishTime);
    const loser = sortedRacers[0];

    loserDisplay.innerText = loser.emoji;
    resultMessage.innerText = `${loser.emoji} 동물 패배! 당첨입니다 🍺`;
    showScreen('result');
}

function resetGame() {
    selectedAnimals = [];
    initGrid();
    showScreen('selection');
}

// Event Listeners
startBtn.addEventListener('click', startRace);
resetBtn.addEventListener('click', resetGame);

// Init
initGrid();
