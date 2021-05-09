let inputDir = { x: 0, y: 0 };
let foodSound = new Audio("../music/food.mp3");
let moveSound = new Audio("../music/move.mp3");
let gameOverSound = new Audio("../music/gameover.mp3");
let musicSound = new Audio("../music/music.mp3");

let speed = 6;
let score = 0;
let lastPaintTime = 0;
let snakeArray = [{ x: 13, y: 15 }];
let food = { x: 8, y: 4 };

let board = document.getElementById("board");
let scoreBox = document.getElementById("scoreBox");

let main = (ctime) => {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
};

//Collision logic
let isCollide = (snake) => {
  //Self collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  //Wall collision
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 1 ||
    snake[0].y >= 18 ||
    snake[0].y <= 1
  ) {
    return true;
  }
};

let gameEngine = () => {
  musicSound.play();
  // Part1: updating snake array and food
  if (isCollide(snakeArray)) {
    speed = 6;
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    if (confirm("Play Again!! You can do it.")) {
      txt = "You pressed OK!";
    } else {
      window.close();
    }
    snakeArray = [{ x: 13, y: 15 }];
    musicSound.play();
    score = 0;
  }

  //If you have eaten the food , increment the score and regenerate the food
  if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
    foodSound.play();
    snakeArray.unshift({
      x: snakeArray[0].x + inputDir.x,
      y: snakeArray[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
    score += 1;
    if (score > highScoreVal) {
      highScoreVal = score;
      localStorage.setItem("hiscore", JSON.stringify(highScoreVal));
      highScoreBox.innerHTML = "HIGH-SCORE : " + highScoreVal;
    }
    speed += 0.3;
  }

  //Moving the snake
  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] };
  }
  snakeArray[0].x += inputDir.x;
  snakeArray[0].y += inputDir.y;

  // Part2: Display snake and food

  // Display snake
  board.innerHTML = "";
  snakeArray.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // Display Food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  // foodElement.src = "../img/apple.png";
  foodElement.classList.add("food");
  board.appendChild(foodElement);

  // Display scoreBox
  scoreBox.innerHTML = "SCORE : " + score;
};

//Event
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      inputDir.x = 0;
      inputDir.y = -1;
      break;
    case "ArrowDown":
      inputDir.x = 0;
      inputDir.y = 1;
      break;
    case "ArrowRight":
      inputDir.x = 1;
      inputDir.y = 0;
      break;
    case "ArrowLeft":
      inputDir.x = -1;
      inputDir.y = 0;
      break;
    default:
      break;
  }
});

//Highscore in LocalStorage
let hiscore = localStorage.getItem("hiscore");
let highScoreVal;
if (hiscore === null) {
  highScoreVal = 0;
  localStorage.setItem("hiscore", JSON.stringify(highScoreVal));
} else {
  highScoreVal = JSON.parse(hiscore);
  highScoreBox.innerHTML = "HIGH-SCORE : " + highScoreVal;
}

//Main logic starts here
window.requestAnimationFrame(main);
