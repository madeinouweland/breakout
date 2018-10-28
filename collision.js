// inspiration for intersect solution found at: https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection#402010
function collides(ball, gameObject) {
  var closestX;
  var closestY;
  var left = gameObject.x;
  var right = gameObject.x + gameObject.width;
  var top = gameObject.y;
  var bottom = gameObject.y + gameObject.height;

  if (ball.x < left) {
    closestX = left;
  } else if (ball.x > right) {
    closestX = right;
  } else {
    closestX = ball.x;
  }

  if (ball.y < top) {
    closestY = top;
  } else if (ball.y > bottom) {
    closestY = bottom;
  } else {
    closestY = ball.y;
  }

  var xDistanceToClosestSide = closestX - ball.x;
  var yDistanceToClosestSide = closestY - ball.y;

  return (xDistanceToClosestSide * xDistanceToClosestSide +
    yDistanceToClosestSide * yDistanceToClosestSide) <= ball.radius * ball.radius;
}

function getImpact(ball, gameObject) {
  var closestX;
  var closestY;
  var left = gameObject.x;
  var right = gameObject.x + gameObject.width;
  var top = gameObject.y;
  var bottom = gameObject.y + gameObject.height;
  var impact = {x: 0, y: 0};

  if (ball.x < left) {
    impact.x = left - ball.x;
  }

  if (ball.x > right) {
    impact.x = ball.x - right;
  }

  if (ball.y < top) {
    impact.y = top - ball.y;
  }

  if (ball.y > bottom) {
    impact.y = ball.y - bottom;
  }

  return impact;
}
