class Sprite {
  constructor({
      position,
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 }
  }) {
      this.position = position;
      this.width = 50;
      this.height = 150;
      this.image = new Image();
      this.image.src = imageSrc;
      this.scale = scale;
      this.framesMax = framesMax;
      this.framesCurrent = 0;
      this.framesElapsed = 0;
      this.framesHold = 5;
      this.offset = offset;
  }

  draw() {
      c.drawImage(
          this.image,
          this.framesCurrent * (this.image.width / this.framesMax),
          0,
          this.image.width / this.framesMax,
          this.image.height,
          this.position.x - this.offset.x,
          this.position.y - this.offset.y,
          (this.image.width / this.framesMax) * this.scale,
          this.image.height * this.scale
      );
  }

  animateFrames() {
      this.framesElapsed++;

      if (this.framesElapsed % this.framesHold === 0) {
          if (this.framesCurrent < this.framesMax - 1) {
              this.framesCurrent++;
          } else {
              this.framesCurrent = 0;
          }
      }
  }

  update() {
      this.draw();
      this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
      position,
      velocity,
      color = 'red',
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 },
      sprites,
      attackBox = { offset: {}, width: undefined, height: undefined }
  }) {
      super({ position, imageSrc, scale, framesMax, offset });

      this.velocity = velocity;
      this.width = 50;
      this.height = 150;
      this.attackBox = {
          position: { x: this.position.x, y: this.position.y },
          offset: attackBox.offset,
          width: attackBox.width,
          height: attackBox.height
      };

      this.color = color;
      this.isAttacking = false;
      this.hp = 100;
      this.framesCurrent = 0;
      this.framesElapsed = 0;
      this.framesHold = 5;
      this.sprites = sprites;
      this.dead = false;

      for (const sprite in this.sprites) {
          this.sprites[sprite].image = new Image();
          this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
      }
  }

  update() {
      this.draw();
      if (!this.dead) this.animateFrames();

      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
          this.velocity.y = 0;
          this.position.y = canvas.height - 96 - this.height;
      } else {
          this.velocity.y += gravity;
      }
  }

  attack() {
      this.switchSprite('attack1');
      this.isAttacking = true;
  }

  takeHit() {
      this.hp -= 20;
      if (this.hp <= 0) {
          this.switchSprite('death');
      } else {
          this.switchSprite('hit');
      }
  }

  switchSprite(sprite) {
      if (this.image === this.sprites.death.image && this.framesCurrent === this.sprites.death.framesMax - 1) {
          this.dead = true;
          return;
      }

      if (
          (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) ||
          (this.image === this.sprites.hit.image && this.framesCurrent < this.sprites.hit.framesMax - 1)
      ) {
          return;
      }

      if (this.image !== this.sprites[sprite].image) {
          this.image = this.sprites[sprite].image;
          this.framesMax = this.sprites[sprite].framesMax;
          this.framesCurrent = 0;
      }
  }
}
