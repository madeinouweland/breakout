let game;
let stoneColors = ["#9d9d9d", "#ae2317", "#e0df49", "#67809d", "#b24b9e", "#86dc43"];
let boundaryWidth = 10;
let font;

function preload() {
  font = loadFont('arcade.ttf');
}

function setup() {
  createCanvas(798, 600);

  textFont(font);
  textSize(36);

  ballRadius = 10;
  heroWidth = 150;
  heroHeight = 15;
  stoneWidth = 82;
  stoneHeight = 30;
  stoneMargin = 4;
  game = {
    ball: {
      x: width / 2,
      y: height - 90,
      radius: ballRadius,
      direction: [8, -8],
    },
    hero: {
      x: width / 2 - heroWidth / 2,
      y: height - 40 - heroHeight / 2,
      width: heroWidth,
      height: heroHeight,
    },
    boundary: [{
      x1: 0, y1: 50, x2: width, y2: 10}, {
      x1: 0, y1: 50, x2: 10, y2: height}, {
      x1: width - 10, y1: 50, x2: width, y2: height,
    }],
    stones: [],
    explosions: [],
    score: 0,
    lives: 5,
  }

  for (var col = 0; col < 9; col++) {
    for (var row = 0; row < 6; row++) {
      game.stones.push({
        x: col * stoneWidth + (col + 1) * stoneMargin + boundaryWidth,
        y: row * stoneHeight + (row + 1) * stoneMargin + 60,
        width: stoneWidth,
        height: stoneHeight,
        color: stoneColors[row]});
    }
  }
}

let isRunning = true;

function keyPressed() {
  if (key === " ") {
    if (isRunning) {
      noLoop();
      isRunning = false;
    } else {
      loop();
      isRunning = true;
    }
  }
}

function update() {
  game.ball.x += game.ball.direction[0];
  game.ball.y += game.ball.direction[1];

  game.hero.x = game.ball.x - game.hero.width / 2;

  if (game.hero.x < boundaryWidth) {
    game.hero.x = boundaryWidth;
  }

  if (game.hero.x > width - boundaryWidth - game.hero.width) {
    game.hero.x = width - boundaryWidth - game.hero.width;
  }

  if (game.ball.y < game.ball.radius + 10) {
    game.ball.direction[1] =- game.ball.direction[1];
  }

  if (game.ball.x < game.ball.radius + 10 || game.ball.x > width - 10 - game.ball.radius) {
    game.ball.direction[0] =- game.ball.direction[0];
  }

  heroHit = intersects(game.ball.x, game.ball.y, game.ball.radius, game.hero.x, game.hero.y, game.hero.x + game.hero.width, game.hero.y + game.hero.height)
  if (heroHit) {
    game.ball.direction[1] =- game.ball.direction[1];
  }

  let stoneHit;
  game.stones.forEach(x => {
    hit = intersects(game.ball.x, game.ball.y, game.ball.radius, x.x, x.y, x.x + x.width, x.y + x.height)
    if (hit) {
      game.stones = game.stones.filter(s => s !== x);
      stoneHit = hit;
      game.score++;
      game.explosions.push(new Explosion(x));
    }
  });

  if (stoneHit) {
    if (stoneHit[1] > stoneHit[0]) {
      game.ball.direction[1] =- game.ball.direction[1];
    } else {
      game.ball.direction[0] =- game.ball.direction[0];
    }
  }

  game.explosions = game.explosions.filter(s => s.lifeTime > 0);
}

function draw() {
  update();

  background("#01155a");
  noStroke();

  fill(200);
  game.boundary.forEach(b => {
    rect(b.x1, b.y1, b.x2, b.y2);
  });

  game.stones.forEach(stone => {
    fill(stone.color);
    rect(stone.x, stone.y, stone.width, stone.height, 2);
  });

  game.explosions.forEach(explosion => {
    explosion.update();
    explosion.fragments.forEach(f => {
      fill(f.color);
      rect(f.x, f.y, f.width, f.height, 2);
    })
  });

  fill(255)
  ellipse(game.ball.x, game.ball.y, game.ball.radius * 2, game.ball.radius * 2);
  rect(game.hero.x, game.hero.y, game.hero.width, game.hero.height, 20);

  fill('#ae2317');
  text(`SCORE: ${game.score}`, 10, 37);
  fill('#67809d');
  text(`LIVES: ${game.lives}`, 440, 37);
}
