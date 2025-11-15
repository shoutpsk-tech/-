import Phaser from 'phaser';
import { COSTUMES } from '../data/costumes.js';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ShopScene' });
  }

  init(data) {
    this.inventory = data.inventory;
  }

  create() {
    // 배경
    this.add.rectangle(0, 0, 800, 600, 0x222222).setOrigin(0);

    // 제목
    this.add.text(400, 50, '비밀 상점', {
      fontSize: '48px',
      fill: '#ffd700'
    }).setOrigin(0.5);

    // 코인 표시
    this.coinsText = this.add.text(650, 50, `코인: ${this.inventory.coins}`, {
      fontSize: '24px',
      fill: '#fff'
    });

    // 옷 아이템 표시
    const costumes = Object.values(COSTUMES);
    let y = 150;
    let x = 100;

    costumes.forEach((costume, index) => {
      if (index > 0 && index % 3 === 0) {
        y += 120;
        x = 100;
      }

      const item = this.add.rectangle(x, y, 200, 100, 0x444444).setInteractive();

      const nameText = this.add.text(x, y - 20, costume.name, {
        fontSize: '18px',
        fill: '#fff'
      }).setOrigin(0.5);

      const priceText = this.add.text(x, y + 20, `${costume.price} 코인`, {
        fontSize: '16px',
        fill: '#ffd700'
      }).setOrigin(0.5);

      // 이미 구매한 아이템 표시
      if (this.inventory.ownedCostumes.includes(costume.id)) {
        const ownedText = this.add.text(x, y + 40, '보유중', {
          fontSize: '14px',
          fill: '#00ff00'
        }).setOrigin(0.5);
      }

      item.on('pointerdown', () => this.buyCostume(costume));
      item.on('pointerover', () => item.setFillStyle(0x666666));
      item.on('pointerout', () => item.setFillStyle(0x444444));

      x += 230;
    });

    // 닫기 버튼
    const closeButton = this.add.text(400, 550, '닫기', {
      fontSize: '24px',
      fill: '#fff',
      backgroundColor: '#ff4444',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    closeButton.on('pointerdown', () => this.scene.stop());
  }

  buyCostume(costume) {
    if (this.inventory.ownedCostumes.includes(costume.id)) {
      this.showMessage('이미 보유한 아이템입니다!', '#ffaa00');
      return;
    }

    if (this.inventory.buyCostume(costume.id, costume.price)) {
      this.coinsText.setText(`코인: ${this.inventory.coins}`);
      this.showMessage(`${costume.name} 구매 완료!`, '#00ff00');

      this.time.delayedCall(1000, () => {
        this.scene.restart({ inventory: this.inventory });
      });
    } else {
      this.showMessage('코인이 부족합니다!', '#ff0000');
    }
  }

  showMessage(text, color) {
    const message = this.add.text(400, 300, text, {
      fontSize: '24px',
      fill: color
    }).setOrigin(0.5);

    this.time.delayedCall(1500, () => {
      message.destroy();
    });
  }
}
