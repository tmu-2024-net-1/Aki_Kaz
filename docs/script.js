const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const inputWord = document.getElementById('input-word');
const submitButton = document.getElementById('submit-word');
const timerDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score-value');
const errorMessage = document.getElementById('error-message');
const completedCircles = document.getElementById('completed-circles');
const startButton = document.getElementById('start-game');
const introContainer = document.getElementById('intro-container');
const gameContainer = document.getElementById('game-container');
const resetButton = document.getElementById('reset-game');

canvas.width = 400;
canvas.height = 400;

let words = [];
let score = 0;
let timeLeft = 60;
let timer;

const startTimer = () => {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

const drawCharacters = (ctx, characters) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let angle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let radius = 50 + characters.length * 5;

    if (radius > 150) {
        radius = 150;
    }

    const fontSize = 20;
    ctx.font = `${fontSize}px Arial`;

    for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.textAlign = 'center';
        ctx.fillText(char, radius, 0);
        ctx.restore();
        angle += (2 * Math.PI) / characters.length;
    }
}

const isValidWord = (newWord) => {
    if (words.length === 0) return true;
    const lastWord = words[words.length - 1];
    return lastWord[lastWord.length - 1] === newWord[0];
}

const saveCompletedCircle = (characters) => {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    completedCircles.appendChild(newCanvas);

    const newCtx = newCanvas.getContext('2d');
    drawCharacters(newCtx, characters);
}

const endGame = () => {
    alert('ゲームオーバー！スコア: ' + score);
    saveGameProgress();
    resetButton.style.display = 'block'; // 再プレイボタンを表示
}

const startNewGame = () => {
    words = [];
    score = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    completedCircles.innerHTML = ''; // 完成した円をクリア
    resetButton.style.display = 'none'; // 再プレイボタンを非表示
    gameContainer.style.display = 'block';
    startTimer();
}

const saveGameProgress = () => {
    localStorage.setItem('words', JSON.stringify(words));
    localStorage.setItem('score', score);
    localStorage.setItem('timeLeft', timeLeft);
}

const loadGameProgress = () => {
    const savedWords = JSON.parse(localStorage.getItem('words'));
    const savedScore = localStorage.getItem('score');
    const savedTimeLeft = localStorage.getItem('timeLeft');

    if (savedWords && savedScore && savedTimeLeft) {
        words = savedWords;
        score = savedScore;
        timeLeft = savedTimeLeft;

        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        drawCharacters(ctx, words.join(''));
        startTimer();
    }
}

submitButton.addEventListener('click', () => {
    const newWord = inputWord.value.trim();
    errorMessage.textContent = '';

    if (newWord && isValidWord(newWord)) {
        words.push(newWord);
        drawCharacters(ctx, words.join(''));
        score++;
        scoreDisplay.textContent = score;
        inputWord.value = '';

        if (words.length > 1 && words[0][0] === words[words.length - 1][words[words.length - 1].length - 1]) {
            score += 10;
            scoreDisplay.textContent = score;
            saveCompletedCircle(words.join(''));
            alert('円 完成！！ボーナスポイント +10!');
            words = [];
        }

        saveGameProgress();
    } else {
        errorMessage.textContent = '無効な言葉です。前の言葉の終わりの文字から始まる言葉を入力してください。';
    }
});

startButton.addEventListener('click', () => {
    introContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    startTimer();
});

resetButton.addEventListener('click', startNewGame);

document.addEventListener('DOMContentLoaded', () => {
    const inputWord = document.getElementById('input-word');
    const submitButton = document.getElementById('submit-word');

    inputWord.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitButton.click();
        }
    });

    loadGameProgress();
});
