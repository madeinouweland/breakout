let game;
let font;
let boundaryWidth = 10;
let playerIsComputer = true;

function preload() {
  font = loadFont('arcade.ttf');
}

function newGame(lives, score) {
  var ballRadius = 10;
  var heroWidth = 150;
  var heroHeight = 15;
  var stoneWidth = 82;
  var stoneHeight = 30;
  var stoneMargin = 4;
  var stoneColors = ["#9d9d9d", "#ae2317", "#e0df49", "#67809d", "#b24b9e", "#86dc43"];
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
      x: 0, y: 50, width: width, height: 10}, { // top
      x: 0, y: 50, width: 10, height: height - 50}, { // left
      x: width - 10, y: 50, width: 10, height: height - 50, // right
    }],
    stones: [],
    explosions: [],
    score: score,
    lives: lives,
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

function setup() {
  createCanvas(798, 600);
  textFont(font);
  textSize(36);
  newGame(5, 0);
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

  if (playerIsComputer) {
    game.hero.x = game.ball.x - game.hero.width / 2;
  } else {
    if (keyIsDown(LEFT_ARROW)) {
      game.hero.x -= 18;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      game.hero.x += 18;
    }
  }

  if (game.hero.x < boundaryWidth) {
    game.hero.x = boundaryWidth;
  }

  if (game.hero.x > width - boundaryWidth - game.hero.width) {
    game.hero.x = width - boundaryWidth - game.hero.width;
  }

  heroHit = collides(game.ball, game.hero)
  if (heroHit) {
    game.ball.direction[1] =- game.ball.direction[1];
  }

  var boundaryHits = game.boundary.filter(boundary => collides(game.ball, boundary))
  if (boundaryHits.length > 0) {
    impact = getImpact(game.ball, boundaryHits[0]);
    if (impact.x < impact.y) {
      game.ball.direction[1] =- game.ball.direction[1];
    } else {
      game.ball.direction[0] =- game.ball.direction[0];
    }
  }

  var stoneHits = game.stones.filter(stone => collides(game.ball, stone))
  if (stoneHits.length > 0) {
    console.log(game.ball, stoneHits);
    stoneHits.forEach(h => {
      game.score++;
      game.explosions.push(new Explosion(h));
      game.stones = game.stones.filter(s => s !== h);
    });

    impact = getImpact(game.ball, stoneHits[0]);
    if (impact.x < impact.y) {
      game.ball.direction[1] =- game.ball.direction[1];
    } else {
      game.ball.direction[0] =- game.ball.direction[0];
    }
  }

  game.explosions = game.explosions.filter(s => s.lifeTime > 0);

  if (game.stones.length === 0) {
    newGame(game.lives, game.score);
  }
}

function draw() {
  update();

  background("#01155a");
  noStroke();

  fill(200);
  game.boundary.forEach(b => rect(b.x, b.y, b.width, b.height));

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
