var colAmount = 4;
var rowAmount = 2;

class Explosion {
  constructor(stone) {
    this.stone = stone;
    this.fragments = [];
    this.createFragments();
    this.gravity = 1;
    this.lifeTime = 150;
  }

  createFragments() {
    for (var col = 0; col < colAmount; col++) {
      for (var row = 0; row < rowAmount; row++) {
        this.fragments.push({
          x: this.stone.x + col * this.stone.width / colAmount,
          y: this.stone.y + row * this.stone.height / rowAmount,
          width: this.stone.width / colAmount,
          height: this.stone.height / rowAmount,
          color: this.stone.color,
          force: [(col - (colAmount - 1) / 2) * Math.floor(Math.random()*2.1)-1,
            (row - (rowAmount - 1) / 2)  * Math.floor(Math.random()*2.1)-1]
        });
      }
    }
  }

  update() {
    this.gravity *= 1.1;
    this.lifeTime -= 2;
    this.fragments.forEach(f => {
      f.x += f.force[0];
      f.y += f.force[1] + this.gravity;
      f.color = color(red(f.color), green(f.color), blue(f.color), this.lifeTime);
    });
  }
}
