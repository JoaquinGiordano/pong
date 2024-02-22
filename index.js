const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');

const $screen = document.querySelector('#screen');
const $title = document.querySelector('#title');
const $play_btn = document.querySelector('#play-btn');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

if (window.innerWidth <= GAME_WIDTH) {
  $canvas.width = window.innerWidth - 200;
  $canvas.height = (window.innerWidth - 200) / 1.333333333333;
  document.querySelector('#controls').style.width = `${
    window.innerWidth - 200
  }px`;
} else {
  $canvas.width = GAME_WIDTH;
  $canvas.height = GAME_HEIGHT;
}

let BALL_VELOCITY = 3;
let gameOver = false;

let score = {
  bestOf: 3,
  left: 0,
  right: 0,
};

let ball = {
  x: $canvas.width / 2,
  y: $canvas.height / 2,
  radius: 6,
  dirX: Math.random() < 0.5 ? -BALL_VELOCITY : BALL_VELOCITY,
  dirY: Math.random() < 0.5 ? BALL_VELOCITY : -BALL_VELOCITY,
};

let leftPaddle = {
  x: 70,
  y: $canvas.height / 2 - 35,
  velocity: 7,
  height: 70,
  width: 8,
  movingUp: false,
  movingDown: false,
};
let rightPaddle = {
  x: $canvas.width - 70,
  y: $canvas.height / 2 - 35,
  velocity: 7,
  height: 70,
  width: 8,
  movingUp: false,
  movingDown: false,
};

function clearCanvas() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

function drawSeparationLine() {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;
  ctx.setLineDash([20, 15]);
  ctx.beginPath();
  ctx.moveTo($canvas.width / 2, 0);
  ctx.lineTo($canvas.width / 2, $canvas.height);
  ctx.stroke();
}

function drawBall() {
  ctx.beginPath();
  ctx.ellipse(
    ball.x - ball.radius,
    ball.y - ball.radius,
    ball.radius,
    ball.radius,
    0,
    0,
    2 * Math.PI,
    false
  );
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}
function drawPaddle(paddle) {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

function checkWin() {
  if (score.left === score.bestOf) {
    $screen.style.display = 'flex';
    $title.textContent = 'PLAYER 1 WINS';
    gameOver = true;
  } else if (score.right === score.bestOf) {
    $screen.style.display = 'flex';
    $title.textContent = 'PLAYER 2 WINS';
    gameOver = true;
  }
}

function drawUI() {
  ctx.font = '40px RetroGaming';

  ctx.fillText(score.left, $canvas.width / 4 - 20, 70);
  ctx.fillText(score.right, ($canvas.width / 4) * 3 + 20, 70);

  ctx.font = '20px RetroGaming';
  ctx.fillText('P1', 20, 30);
  ctx.fillText('P2', $canvas.width - 50, 30);
}

function resetBall() {
  ball = {
    x: $canvas.width / 2,
    y: $canvas.height / 2,
    radius: 6,
    dirX: Math.random() < 0.5 ? -BALL_VELOCITY : BALL_VELOCITY,
    dirY: Math.random() < 0.5 ? BALL_VELOCITY : -BALL_VELOCITY,
  };

  leftPaddle = {
    x: 70,
    y: $canvas.height / 2 - 35,
    velocity: 7,
    height: 70,
    width: 8,
    movingUp: false,
    movingDown: false,
  };
  rightPaddle = {
    x: $canvas.width - 70,
    y: $canvas.height / 2 - 35,
    velocity: 7,
    height: 70,
    width: 8,
    movingUp: false,
    movingDown: false,
  };
}

function scoreAdd(side) {
  score[side]++;
  resetBall();
}

function collisionDetection() {
  //Walls
  if (ball.x + ball.radius >= $canvas.width) scoreAdd('left');

  if (ball.x - ball.radius <= 0) scoreAdd('right');

  if (ball.y - ball.radius < 0 || ball.y - ball.radius > $canvas.height)
    ball.dirY = -ball.dirY;

  //Left Paddle

  if (
    ball.y + ball.radius >= leftPaddle.y &&
    ball.y - ball.radius <= leftPaddle.y + leftPaddle.height &&
    ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
    ball.x + ball.radius >= leftPaddle.x + leftPaddle.width
  )
    ball.dirX = -ball.dirX;

  //Right Paddle
  if (
    ball.y + ball.radius >= rightPaddle.y &&
    ball.y - ball.radius <= rightPaddle.y + rightPaddle.height &&
    ball.x - ball.radius <= rightPaddle.x + rightPaddle.width &&
    ball.x >= rightPaddle.x
  )
    ball.dirX = -ball.dirX;
}

function ballMovement() {
  ball.x += ball.dirX;
  ball.y += ball.dirY;
}

function paddleMovement(paddle) {
  if (paddle.movingUp && paddle.y > 0) paddle.y -= paddle.velocity;
  if (paddle.movingDown && paddle.y < $canvas.height - paddle.height)
    paddle.y += paddle.velocity;
}

function initEvents() {
  window.addEventListener('keydown', event => {
    const { key } = event;

    if (key === 'w') {
      leftPaddle.movingUp = true;
    } else if (key === 's') {
      leftPaddle.movingDown = true;
    }
    // console.log(key);
    if (key === 'ArrowUp') {
      rightPaddle.movingUp = true;
    } else if (key === 'ArrowDown') {
      rightPaddle.movingDown = true;
    }
  });

  window.addEventListener('keyup', event => {
    const { key } = event;

    if (key === 'w') {
      leftPaddle.movingUp = false;
    } else if (key === 's') {
      leftPaddle.movingDown = false;
    }

    if (key === 'ArrowUp') {
      rightPaddle.movingUp = false;
    } else if (key === 'ArrowDown') {
      rightPaddle.movingDown = false;
    }
  });
}

function draw() {
  if (!gameOver) {
    window.requestAnimationFrame(draw);

    checkWin();
    clearCanvas();

    drawSeparationLine();
    drawBall();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);

    drawUI();

    collisionDetection();
    ballMovement();
    paddleMovement(leftPaddle);
    paddleMovement(rightPaddle);
  } else {
    clearCanvas();
  }
}

function play() {
  score.left = 0;
  score.right = 0;
  gameOver = false;
  $screen.style.display = 'none';
  draw();
  initEvents();
}

$play_btn.addEventListener('click', () => {
  play();
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= GAME_WIDTH) {
    $canvas.width = window.innerWidth - 10;
    $canvas.height = (window.innerWidth - 10) / 1.333333333333;
  }

  if (window.innerWidth <= GAME_WIDTH) {
    document.querySelector('#controls').style.width = `${
      window.innerWidth - 200
    }px`;
    document.querySelector('#controls').style.height = `${
      (window.innerWidth - 200) / 1.333333333333
    }px`;
  }
});

document.querySelector('#tl-control-btn').addEventListener('touchstart', () => {
  leftPaddle.movingUp = true;
});
document.querySelector('#tr-control-btn').addEventListener('touchstart', () => {
  rightPaddle.movingUp = true;
});
document.querySelector('#bl-control-btn').addEventListener('touchstart', () => {
  leftPaddle.movingDown = true;
});
document.querySelector('#br-control-btn').addEventListener('touchstart', () => {
  rightPaddle.movingDown = true;
});

document.querySelector('#tl-control-btn').addEventListener('touchend', () => {
  leftPaddle.movingUp = false;
});
document.querySelector('#tr-control-btn').addEventListener('touchend', () => {
  rightPaddle.movingUp = false;
});
document.querySelector('#bl-control-btn').addEventListener('touchend', () => {
  leftPaddle.movingDown = false;
});
document.querySelector('#br-control-btn').addEventListener('touchend', () => {
  rightPaddle.movingDown = false;
});
