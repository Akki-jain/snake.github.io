class Game {
    constructor() {
        this.init();
    }

    init() {
        this.createCanvas();
        this.snake = new Snake();
        this.food = new Food();
        this.score = 0;
        this.updateScore();
        this.start();
    }

    createCanvas() {
        this.canvas = document.getElementById('game-board');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 900;
        this.canvas.height = 900;
    }

    start() {
        this.interval = setInterval(() => {
            this.update();
            this.draw();
        }, 100);
    }

    update() {
        this.snake.move();
        if (this.snake.checkCollision()) {
            this.gameOver();
            return;
        }

        if (this.food.checkCollision(this.snake)) {
            this.snake.grow();
            this.food.generate();
            this.score++;
            this.updateScore();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);
    }

    gameOver() {
        clearInterval(this.interval);
        alert('Game Over! Your score: ' + this.score);
        this.init();
    }

    updateScore() {
        document.getElementById('score').innerText = 'Score: ' + this.score;
    }
}

class Snake {
    constructor() {
        this.init();
    }

    init() {
        this.position = { x: 200, y: 200 };
        this.direction = { x: 0, y: 0 };
        this.body = [{ x: 200, y: 200 }];
        this.tileSize = 20;
        this.addEventListeners();
    }

    move() {
        this.position.x += this.direction.x * this.tileSize;
        this.position.y += this.direction.y * this.tileSize;
        this.body.unshift({ x: this.position.x, y: this.position.y });
        this.body.pop();
    }

    changeDirection(newDirection) {
        this.direction = newDirection;
    }

    grow() {
        this.body.push({ x: this.position.x, y: this.position.y });
    }

    checkCollision() {
        if (this.position.x < 0 || this.position.x >= 900 || this.position.y < 0 || this.position.y >= 900) {
            return true;
        }

        for (let i = 1; i < this.body.length; i++) {
            if (this.position.x === this.body[i].x && this.position.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    }

    draw(ctx) {
        for (let i = 0; i < this.body.length; i++) {
            const shade = 255 - i * 10;
            const color = `rgb(${shade}, ${shade}, ${shade})`;
            drawTile(ctx, this.body[i].x, this.body[i].y, this.tileSize, color);
        }
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            let newDirection;
            switch (e.key) {
                case 'ArrowUp':
                    newDirection = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    newDirection = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    newDirection = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    newDirection = { x: 1, y: 0 };
                    break;
                default:
                    return;
            }
            this.changeDirection(newDirection);
        });
    }
}

class Food {
    constructor() {
        this.init();
    }

    init() {
        this.position = getRandomPosition();
        this.tileSize = 20;
    }

    generate() {
        this.position = getRandomPosition();
    }

    checkCollision(snake) {
        return this.position.x === snake.position.x && this.position.y === snake.position.y;
    }

    draw(ctx) {
        drawTile(ctx, this.position.x, this.position.y, this.tileSize, '#bc68ff', true);
    }
}

function drawTile(ctx, x, y, size, color, shadow = false) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);

    if (shadow) {
        ctx.shadowColor = '#bc68ff';
        ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, size, size);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 10;
}

function getRandomPosition() {
    const gridSize = 400 / 20;
    const x = Math.floor(Math.random() * gridSize) * 20;
    const y = Math.floor(Math.random() * gridSize) * 20;
    return { x, y };
}

const game = new Game();
