const images = [
    'images/bau.png', 
    'images/cua.png', 
    'images/tom.png', 
    'images/ca.png', 
    'images/huou.png', 
    'images/ga.png'
];

const imageNames = {
    'images/bau.png': 'Bầu',
    'images/cua.png': 'Cua',
    'images/tom.png': 'Tôm',
    'images/ca.png': 'Cá',
    'images/huou.png': 'Hươu',
    'images/ga.png': 'Gà'
};

const slots = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
const bets = [document.getElementById('bet1'), document.getElementById('bet2'), document.getElementById('bet3'), document.getElementById('bet4'), document.getElementById('bet5'), document.getElementById('bet6')];
const spinButton = document.getElementById('spinButton');
const resetButton = document.getElementById('resetButton');
let betCounts = Array(6).fill(0);
let totalBets = 0;
let isSpinning = false;

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;
    resetButton.disabled = true;
    bets.forEach(bet => bet.style.pointerEvents = 'none');

    let spins = 100;
    const interval = setInterval(() => {
        slots.forEach(slot => {
            const randomImage = images[Math.floor(Math.random() * images.length)];
            slot.style.backgroundImage = `url(${randomImage})`;
        });
        spins--;
        if (spins === 0) {
            clearInterval(interval);
            isSpinning = false;
            spinButton.disabled = false;
            resetButton.disabled = false;
            bets.forEach(bet => bet.style.pointerEvents = 'auto');
            checkResult();
        }
    }, 50);
}

function resetBets() {
    if (isSpinning) return;
    betCounts.fill(0);
    totalBets = 0;
    bets.forEach(bet => {
        bet.setAttribute('data-bet', 0);
        bet.style.backgroundImage = `url(${images[bets.indexOf(bet)]})`;
    });
}

function checkResult() {
    const slotResults = slots.map(slot => slot.style.backgroundImage.slice(5, -2));
    let slotCounts = {};
    slotResults.forEach(url => {
        if (slotCounts[url]) {
            slotCounts[url]++;
        } else {
            slotCounts[url] = 1;
        }
    });

    let betSummary = {};
    betCounts.forEach((count, index) => {
        if (count > 0) {
            let imageUrl = images[index];
            let imageName = imageNames[imageUrl];
            betSummary[imageName] = count;
        }
    });

    let isCorrect = true;
    let slotDetails = {};

    for (const [url, count] of Object.entries(slotCounts)) {
        let imageName = imageNames[url];
        if (betSummary[imageName] !== count) {
            isCorrect = false;
        }
        slotDetails[imageName] = count;
    }

    let betDetails = Object.entries(betSummary)
        .map(([name, count]) => `${name} ${count}`)
        .join(' ');
    if (isCorrect) {
        console.log(`Bạn đã đoán đúng với kết quả: ${betDetails}`);
    } else {
        console.log(`Bạn đã đoán sai với kết quả: ${betDetails}`);
    }
}

spinButton.addEventListener('click', spin);
resetButton.addEventListener('click', resetBets);

bets.forEach((bet, index) => {
    bet.addEventListener('click', () => {
        if (!isSpinning && totalBets < 3 && betCounts[index] < 3) {
            betCounts[index]++;
            totalBets++;
            bet.setAttribute('data-bet', betCounts[index]);
            bet.style.backgroundImage = `url(${images[index]})`;
        }
    });
});

window.onload = function() {
    bets.forEach((bet, index) => {
        bet.style.backgroundImage = `url(${images[index]})`;
        bet.setAttribute('data-bet', 0);
    });
    slots.forEach(slot => {
        slot.style.backgroundImage = `url(images/bau.png)`;
    });
};
