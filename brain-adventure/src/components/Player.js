export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'player');

    // 기본 속성
    this.speed = 200;
    this.jumpPower = 400;
    this.canDoubleJump = false;
    this.hasJumped = false;
    this.isFlying = false;
    this.flyingEndTime = 0;

    // 물리 설정
    this.sprite.setBounce(0.2);
    this.sprite.setCollideWorldBounds(true);

    // 커스텀
    this.currentCostume = 'basic_jeans';
  }

  update(cursors, time) {
    // 좌우 이동
    if (cursors.left.isDown) {
      this.sprite.setVelocityX(-this.speed);
      this.sprite.flipX = true;
    } else if (cursors.right.isDown) {
      this.sprite.setVelocityX(this.speed);
      this.sprite.flipX = false;
    } else {
      this.sprite.setVelocityX(0);
    }

    // 비행 중인 경우
    if (this.isFlying) {
      if (time > this.flyingEndTime) {
        this.stopFlying();
      } else {
        // 비행 중에는 중력 무시
        this.sprite.setVelocityY(-100);
        if (cursors.up.isDown) {
          this.sprite.setVelocityY(-200);
        } else if (cursors.down.isDown) {
          this.sprite.setVelocityY(100);
        }
        return;
      }
    }

    // 점프
    const onGround = this.sprite.body.touching.down;

    if (onGround) {
      this.hasJumped = false;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
      if (onGround) {
        this.sprite.setVelocityY(-this.jumpPower);
      } else if (this.canDoubleJump && !this.hasJumped) {
        this.sprite.setVelocityY(-this.jumpPower);
        this.hasJumped = true;
      }
    }
  }

  enableDoubleJump() {
    this.canDoubleJump = true;
  }

  disableDoubleJump() {
    this.canDoubleJump = false;
  }

  startFlying(duration) {
    this.isFlying = true;
    this.flyingEndTime = this.scene.time.now + duration;
    this.sprite.body.setAllowGravity(false);
  }

  stopFlying() {
    this.isFlying = false;
    this.sprite.body.setAllowGravity(true);
  }

  changeCostume(costumeId) {
    this.currentCostume = costumeId;
    // 스프라이트 텍스처 변경
    this.sprite.setTexture(`player_${costumeId}`);
  }
}
