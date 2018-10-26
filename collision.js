// intersect solution found at: https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection#402010
function intersects(cx, cy, radius, left, top, right, bottom) {
  var closestX;
  var closestY;
  var impact = [0,0];

  if (cx < left) {
    closestX = left;
    impact[0] = left - cx;
  } else if (cx > right) {
    closestX = right;
    impact[0] = cx - right;
  } else {
    closestX = cx;
  }

  if (cy < top) {
    closestY = top;
    impact[1] = top - cy;
  } else if (cy > bottom) {
    closestY = bottom;
    impact[1] = cy - bottom;
  } else {
    closestY = cy;
  }

  var xDistanceToClosestSide = closestX - cx;
  var yDistanceToClosestSide = closestY - cy;

  isHit = (xDistanceToClosestSide * xDistanceToClosestSide +
    yDistanceToClosestSide * yDistanceToClosestSide) <= radius * radius;

  if (isHit) {
    return impact;
  }
  return null;
}
