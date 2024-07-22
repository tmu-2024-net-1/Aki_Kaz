const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const inputWord = document.getElementById('input-word');
const submitButton = document.getElementById('submit-word');
const timerDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score-value');
const hintDisplay = document.getElementById('hint-value');
const completedCircles = document.getElementById('completed-circles');
const startButton = document.getElementById('start-game');
const introContainer = document.getElementById('intro-container');
const gameContainer = document.getElementById('game-container');

canvas.width = 400;
canvas.height = 400;

let words = [];
let score = 0;
let timeLeft = 60;s
let timer;

const startTimer = () => {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert('ゲームオーバー！スコア: ' + score);
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

submitButton.addEventListener('click', () => {
    const newWord = inputWord.value.trim();
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
            alert('完全な円が完成しました！ボーナスポイント！');
            words = [];  // Reset words array for new round
        }
    } else {
        alert('無効な言葉です。前の言葉の終わりの文字から始まる言葉を入力してください。');
    }
});

startButton.addEventListener('click', () => {
    introContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    startTimer();
});
document.addEventListener('DOMContentLoaded', () => {
    const inputWord = document.getElementById('input-word');
    const submitButton = document.getElementById('submit-word');

    // エンターキーが押されたときのイベントリスナー
    inputWord.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // デフォルトのエンターキーアクションを防止
            submitButton.click();  // ボタンのクリックイベントをトリガー
        }
    });
});
