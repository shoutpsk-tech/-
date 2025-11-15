import Phaser from 'phaser';
import { MainScene } from './components/MainScene.js';
import { BrainTestScene } from './components/BrainTestScene.js';
import { ShopScene } from './components/ShopScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [MainScene, BrainTestScene, ShopScene]
};

// 게임 초기화
const game = new Phaser.Game(config);

// 에셋 미리 로드 (임시로 색상 블록 생성)
game.scene.scenes[0].load.once('complete', () => {
  console.log('Game assets loaded');
});

// 각 씬에서 필요한 에셋 로드
MainScene.prototype.preload = function() {
  // 임시 플레이어 스프라이트 (졸라맨 스타일)
  const graphics = this.add.graphics();
  graphics.fillStyle(0x000000, 1);

  // 머리
  graphics.fillCircle(20, 10, 8);
  // 몸통
  graphics.fillRect(19, 18, 2, 15);
  // 팔
  graphics.fillRect(10, 20, 20, 2);
  // 다리
  graphics.fillRect(15, 33, 2, 12);
  graphics.fillRect(23, 33, 2, 12);

  graphics.generateTexture('player', 40, 50);
  graphics.destroy();

  // 플랫폼
  const platform = this.add.graphics();
  platform.fillStyle(0x00aa00, 1);
  platform.fillRect(0, 0, 200, 20);
  platform.generateTexture('platform', 200, 20);
  platform.destroy();

  // 바닥
  const ground = this.add.graphics();
  ground.fillStyle(0x996633, 1);
  ground.fillRect(0, 0, 800, 20);
  ground.generateTexture('ground', 800, 20);
  ground.destroy();

  // 골
  const goal = this.add.graphics();
  goal.fillStyle(0xffd700, 1);
  goal.fillCircle(15, 15, 15);
  goal.generateTexture('goal', 30, 30);
  goal.destroy();

  // 비밀문
  const door = this.add.graphics();
  door.fillStyle(0x8b4513, 1);
  door.fillRect(0, 0, 30, 50);
  door.fillStyle(0xffd700, 1);
  door.fillCircle(25, 25, 3);
  door.generateTexture('secret_door', 30, 50);
  door.destroy();
};

console.log('Brain Adventure Game Starting...');
