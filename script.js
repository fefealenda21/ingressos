const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let snakeDirection = { x: 1, y: 0 };
let food = { x: gridSize * 10, y: gridSize * 10 };
let score = 0;
let gameInterval;
let startTime;
let elapsedTime = 0;
let gameStarted = false;

const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + snakeDirection.x * gridSize, y: snake[0].y + snakeDirection.y * gridSize };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = `Pontos: ${score}`;
        placeFood();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || collision(head)) {
        clearInterval(gameInterval);
        alert('Fim de jogo! Pontuação: ' + score);
        resetButton.disabled = false;
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
    food.y = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
}

function collision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function resetGame() {
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    snakeDirection = { x: 1, y: 0 };
    score = 0;
    elapsedTime = 0;
    document.getElementById('score').textContent = 'Pontos: 0';
    document.getElementById('timer').textContent = 'Tempo: 0s';
    placeFood();
    clearInterval(gameInterval);
    gameStarted = false;
    startButton.disabled = false;
    resetButton.disabled = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
}

function updateTime() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `Tempo: ${elapsedTime}s`;
}

function startGame() {
    if (gameStarted) return;
    startButton.disabled = true;
    resetButton.disabled = true;
    gameStarted = true;
    startTime = Date.now();
    gameInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFood();
        moveSnake();
        drawSnake();
        updateTime();
    }, 90);
}

window.addEventListener('keydown', e => {
    if (!gameStarted) return;

    switch (e.key) {
        case 'ArrowUp':
            if (snakeDirection.y === 0) snakeDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (snakeDirection.y === 0) snakeDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (snakeDirection.x === 0) snakeDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (snakeDirection.x === 0) snakeDirection = { x: 1, y: 0 };
            break;
    }
});

// Inicia o estado inicial do jogo
resetGame();
