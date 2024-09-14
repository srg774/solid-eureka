window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const restartButton = document.getElementById('restartButton');

    let isGameOver = false;
    let gameSpeed = 0.5;
    let score = 0;
    let gravity = 0.2;
    let playerVelocityY = 0;
    let playerVelocityX = 0;

    const playerWidth = 30;
    const playerHeight = 30;
    const playerSpeed = 4;
    const jumpStrength = 4;
    const maxSpeed = 5;
    let playerX, playerY;

    const playerImageRight = new Image();
    playerImageRight.src = 'sprite_sheet_R.png';
    const playerImageLeft = new Image();
    playerImageLeft.src = 'sprite_sheet_L.png';
    let currentPlayerImage = playerImageRight;

    const blocks = [];
    const blockWidth = 50;
    const blockHeight = 15;
    const blockSpacing = 200;

    let imagesLoaded = 0;
    playerImageRight.onload = playerImageLeft.onload = function() {
        imagesLoaded++;
        if (imagesLoaded === 2) {
            resizeCanvas();
            resetGame();
            requestAnimationFrame(gameLoop);
        }
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function resetGame() {
        isGameOver = false;
        gameSpeed = 0.5;
        score = 0;
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height / 2 - playerHeight / 2;
        playerVelocityY = 0;
        playerVelocityX = 0;
        blocks.length = 0;
        generateInitialBlocks();
        restartButton.style.display = 'none';
    }

    function generateInitialBlocks() {
        for (let i = 0; i < 3; i++) {
            generateBlock(canvas.height - i * blockSpacing);
        }
    }

    function generateBlock(yPosition) {
        const block = {
            x: Math.random() * (canvas.width - blockWidth),
            y: yPosition,
            width: blockWidth,
            height: blockHeight,
            color: 'blue',
            hit: false
        };
        blocks.push(block);
    }

    function updateControls() {
        if (playerVelocityX === 0) {
            if (isTouchingLeft) {
                playerVelocityX = -playerSpeed;
                currentPlayerImage = playerImageLeft;
            } else if (isTouchingRight) {
                playerVelocityX = playerSpeed;
                currentPlayerImage = playerImageRight;
            }
        }
    }

    function jump() {
        playerVelocityY = -jumpStrength;
    }

    function checkBlockCollision() {
        blocks.forEach(block => {
            if (
                playerX + playerWidth > block.x &&
                playerX < block.x + blockWidth &&
                playerY + playerHeight > block.y &&
                playerY < block.y + blockHeight
            ) {
                playerVelocityY = -jumpStrength;
                playerY = block.y - playerHeight;
                block.color = 'green';
                block.hit = true;
                score += 1;
                gameSpeed += 0.01;
            }
        });
    }

    function checkGameOver() {
        if (playerY > canvas.height) {
            isGameOver = true;
        }

        blocks.forEach(block => {
            if (block.y > canvas.height && !block.hit) {
                isGameOver = true;
            }
        });
    }

    function gameLoop() {
        if (isGameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText('Score: ' + score, canvas.width / 2 - 50, canvas.height / 2 + 40);
            restartButton.style.display = 'block';
            return;
        }

        updateControls();

        playerVelocityY += gravity;
        if (playerVelocityY > maxSpeed) playerVelocityY = maxSpeed;

        playerY += playerVelocityY;
        playerX += playerVelocityX;

        if (playerX < 0) playerX = 0;
        if (playerX + playerWidth > canvas.width) playerX = canvas.width - playerWidth;
        if (playerY < 0) playerY = 0;

        blocks.forEach(block => {
            block.y += gameSpeed;
        });

        if (blocks.length > 0 && blocks[0].y > canvas.height) {
            blocks.shift(); // Remove the block that has gone off-screen
        }

        // Generate new blocks if necessary
        if (blocks.length === 0 || blocks[blocks.length - 1].y > blockSpacing) {
            generateBlock(canvas.height - blockSpacing);
        }

        checkGameOver();
        checkBlockCollision();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        blocks.forEach(block => {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
        });

        ctx.drawImage(currentPlayerImage, playerX, playerY, playerWidth, playerHeight);

        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 10, 30);

        requestAnimationFrame(gameLoop);
    }

    restartButton.addEventListener('click', function() {
        resetGame();
        requestAnimationFrame(gameLoop);
    });

    window.addEventListener('resize', resizeCanvas);

    let isTouchingLeft = false;
    let isTouchingRight = false;

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else if (event.key === 'ArrowRight') {
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        } else if ((event.key === 'ArrowUp' || event.key === ' ') && jumpAllowed) {
            jump();
            jumpAllowed = false;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            playerVelocityX = 0;
        } else if (event.key === 'ArrowUp' || event.key === ' ') {
            jumpAllowed = true;
        }
    });

    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch.clientX < canvas.width / 2) {
            isTouchingLeft = true;
            playerVelocityX = -playerSpeed;
            currentPlayerImage = playerImageLeft;
        } else {
            isTouchingRight = true;
            playerVelocityX = playerSpeed;
            currentPlayerImage = playerImageRight;
        }
        if (jumpAllowed) {
            jump();
            jumpAllowed = false;
        }
    });

    canvas.addEventListener('touchend', function(e) {
        isTouchingLeft = false;
        isTouchingRight = false;
        playerVelocityX = 0;
        jumpAllowed = true;
    });

    let jumpAllowed = true; // Initialize jumpAllowed
};
