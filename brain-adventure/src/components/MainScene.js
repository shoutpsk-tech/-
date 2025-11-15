import Phaser from 'phaser';
import { Player } from './Player.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { GachaSystem } from '../systems/GachaSystem.js';
import { StageSystem } from '../systems/StageSystem.js';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    // 시스템 초기화
    this.inventorySystem = new InventorySystem();
    this.inventorySystem.load();

    this.gachaSystem = new GachaSystem();

    this.stageSystem = new StageSystem();
    this.stageSystem.load();

    this.cursors = null;
    this.player = null;
    this.platforms = null;
    this.goal = null;
    this.secretDoor = null;
    this.isQuizActive = false;
  }

  create() {
    // 배경
    this.add.rectangle(0, 0, 800, 600, 0x87CEEB).setOrigin(0);

    // UI 생성
    this.createUI();

    // 플랫폼 생성
    this.createPlatforms();

    // 플레이어 생성
    this.player = new Player(this, 100, 450);

    // 골 생성
    this.createGoal();

    // 비밀문 생성 (랜덤)
    if (Math.random() < 0.3) { // 30% 확률로 생성
      this.createSecretDoor();
    }

    // 충돌 설정
    this.physics.add.collider(this.player.sprite, this.platforms);

    // 골 도달 체크
    this.physics.add.overlap(
      this.player.sprite,
      this.goal,
      this.reachGoal,
      null,
      this
    );

    // 비밀문 체크
    if (this.secretDoor) {
      this.physics.add.overlap(
        this.player.sprite,
        this.secretDoor,
        this.enterSecretDoor,
        null,
        this
      );
    }

    // 키보드 입력
    this.cursors = this.input.keyboard.createCursorKeys();

    // ESC 키로 인벤토리 열기
    this.input.keyboard.on('keydown-I', () => {
      this.showInventory();
    });
  }

  update(time, delta) {
    if (this.player && !this.isQuizActive) {
      this.player.update(this.cursors, time);
    }
  }

  createUI() {
    // 스테이지 정보
    this.stageText = this.add.text(16, 16, `Stage: ${this.stageSystem.currentStage}`, {
      fontSize: '24px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });

    // 코인 정보
    this.coinText = this.add.text(16, 50, `Coins: ${this.inventorySystem.coins}`, {
      fontSize: '20px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });

    // 힌트 정보
    this.hintText = this.add.text(16, 84, `Hints: ${this.inventorySystem.hintsAvailable}`, {
      fontSize: '20px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });

    // 도움말
    this.add.text(400, 16, '← → 이동, ↑ 점프, I 인벤토리', {
      fontSize: '16px',
      fill: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5, 0);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    const difficulty = this.stageSystem.getDifficulty();

    // 바닥
    this.platforms.create(400, 580, 'ground').setScale(2).refreshBody();

    // 난이도에 따른 플랫폼 생성
    if (difficulty === 'easy') {
      this.platforms.create(200, 450, 'platform');
      this.platforms.create(400, 350, 'platform');
      this.platforms.create(600, 250, 'platform');
    } else if (difficulty === 'normal') {
      this.platforms.create(150, 450, 'platform');
      this.platforms.create(350, 380, 'platform');
      this.platforms.create(550, 280, 'platform');
      this.platforms.create(350, 180, 'platform');
    } else if (difficulty === 'hard') {
      this.platforms.create(120, 480, 'platform');
      this.platforms.create(280, 420, 'platform');
      this.platforms.create(450, 340, 'platform');
      this.platforms.create(620, 260, 'platform');
      this.platforms.create(450, 160, 'platform');
    } else { // extreme
      this.platforms.create(100, 500, 'platform');
      this.platforms.create(220, 450, 'platform');
      this.platforms.create(340, 380, 'platform');
      this.platforms.create(480, 310, 'platform');
      this.platforms.create(620, 240, 'platform');
      this.platforms.create(500, 150, 'platform');
    }
  }

  createGoal() {
    this.goal = this.physics.add.sprite(700, 100, 'goal');
    this.goal.body.setAllowGravity(false);
    this.goal.setImmovable(true);
  }

  createSecretDoor() {
    const x = Phaser.Math.Between(300, 600);
    const y = Phaser.Math.Between(200, 400);
    this.secretDoor = this.physics.add.sprite(x, y, 'secret_door');
    this.secretDoor.body.setAllowGravity(false);
    this.secretDoor.setImmovable(true);
  }

  reachGoal() {
    if (this.isQuizActive) return;

    this.isQuizActive = true;

    // 브레인 테스트 씬 시작
    this.scene.launch('BrainTestScene', {
      stage: this.stageSystem.currentStage,
      inventory: this.inventorySystem,
      onComplete: () => this.onQuizComplete(),
      onFail: () => this.onQuizFail()
    });
  }

  onQuizComplete() {
    this.isQuizActive = false;

    // 스테이지 클리어
    this.stageSystem.clearStage();

    // 코인 보상
    const coinReward = 10 + (this.stageSystem.currentStage * 2);
    this.inventorySystem.addCoins(coinReward);

    // 아이템 보상 체크
    if (this.stageSystem.shouldGiveItemReward()) {
      const item = this.gachaSystem.drawItem();
      this.inventorySystem.addItem(item.id, 1);
      this.showRewardPopup(`아이템 획득: ${item.name}`);
    }

    // 힌트 보상 체크
    if (this.stageSystem.shouldGiveHintReward()) {
      this.inventorySystem.addHints(3);
      this.showRewardPopup('힌트 3개 획득!');
    }

    // 저장
    this.inventorySystem.save();
    this.stageSystem.save();

    // 다음 스테이지
    if (this.stageSystem.nextStage()) {
      this.time.delayedCall(2000, () => {
        this.scene.restart();
      });
    } else {
      // 게임 클리어
      this.showGameClear();
    }
  }

  onQuizFail() {
    this.isQuizActive = false;
    // 퀴즈 실패 시 다시 시도 가능
  }

  enterSecretDoor(player, door) {
    door.destroy();
    this.secretDoor = null;

    // 상점 열기
    this.scene.launch('ShopScene', {
      inventory: this.inventorySystem
    });
  }

  showInventory() {
    const bg = this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
    const title = this.add.text(400, 150, '인벤토리', {
      fontSize: '32px',
      fill: '#fff'
    }).setOrigin(0.5);

    let y = 200;
    const items = Object.entries(this.inventorySystem.items);

    if (items.length === 0) {
      this.add.text(400, 250, '아이템이 없습니다', {
        fontSize: '20px',
        fill: '#aaa'
      }).setOrigin(0.5);
    } else {
      items.forEach(([itemId, quantity]) => {
        if (quantity > 0) {
          this.add.text(400, y, `${itemId}: ${quantity}개`, {
            fontSize: '18px',
            fill: '#fff'
          }).setOrigin(0.5);
          y += 30;
        }
      });
    }

    const closeButton = this.add.text(400, 450, '닫기', {
      fontSize: '24px',
      fill: '#fff',
      backgroundColor: '#ff4444',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    closeButton.on('pointerdown', () => {
      bg.destroy();
      title.destroy();
      closeButton.destroy();
    });
  }

  showRewardPopup(message) {
    const popup = this.add.text(400, 300, message, {
      fontSize: '28px',
      fill: '#ffd700',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      popup.destroy();
    });
  }

  showGameClear() {
    this.add.rectangle(0, 0, 800, 600, 0x000000, 0.9).setOrigin(0);
    this.add.text(400, 250, '게임 클리어!', {
      fontSize: '64px',
      fill: '#ffd700'
    }).setOrigin(0.5);

    this.add.text(400, 350, '모든 스테이지를 완료했습니다!', {
      fontSize: '24px',
      fill: '#fff'
    }).setOrigin(0.5);
  }
}
