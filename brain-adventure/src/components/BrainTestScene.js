import Phaser from 'phaser';
import { getQuizByStage } from '../data/quizzes.js';

export class BrainTestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BrainTestScene' });
  }

  init(data) {
    this.stage = data.stage;
    this.onComplete = data.onComplete;
    this.onFail = data.onFail;
    this.inventory = data.inventory;
  }

  create() {
    const quiz = getQuizByStage(this.stage);
    this.currentQuiz = quiz;

    // 배경
    this.add.rectangle(0, 0, 800, 600, 0x1a1a2e).setOrigin(0);

    // 질문 표시
    this.add.text(400, 100, quiz.question, {
      fontSize: '32px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // 답변 버튼 생성
    quiz.answers.forEach((answer, index) => {
      const button = this.add.rectangle(
        400, 250 + (index * 80), 400, 60, 0x4444ff
      ).setInteractive();

      const text = this.add.text(400, 250 + (index * 80), answer, {
        fontSize: '24px',
        fill: '#fff'
      }).setOrigin(0.5);

      button.on('pointerdown', () => this.checkAnswer(index));
      button.on('pointerover', () => button.setFillStyle(0x6666ff));
      button.on('pointerout', () => button.setFillStyle(0x4444ff));
    });

    // 힌트 버튼
    if (this.inventory && this.inventory.hintsAvailable > 0) {
      this.hintButton = this.add.text(50, 500, `힌트 사용 (${this.inventory.hintsAvailable}개)`, {
        fontSize: '20px',
        fill: '#ffff00',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 }
      }).setInteractive();

      this.hintButton.on('pointerdown', () => this.showHint());
    }
  }

  checkAnswer(selectedIndex) {
    if (selectedIndex === this.currentQuiz.correctAnswer) {
      this.add.text(400, 500, '정답입니다!', {
        fontSize: '32px',
        fill: '#00ff00'
      }).setOrigin(0.5);

      this.time.delayedCall(1000, () => {
        if (this.onComplete) this.onComplete();
        this.scene.stop();
      });
    } else {
      this.add.text(400, 500, '틀렸습니다!', {
        fontSize: '32px',
        fill: '#ff0000'
      }).setOrigin(0.5);

      this.time.delayedCall(1000, () => {
        if (this.onFail) this.onFail();
        this.scene.restart();
      });
    }
  }

  showHint() {
    if (this.inventory && this.inventory.useHint()) {
      const hint = this.currentQuiz.hint;
      this.add.text(400, 450, `힌트: ${hint}`, {
        fontSize: '20px',
        fill: '#ffff00',
        backgroundColor: '#333',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5);

      // 힌트 버튼 업데이트
      if (this.hintButton) {
        this.hintButton.setText(`힌트 사용 (${this.inventory.hintsAvailable}개)`);
      }
    }
  }
}
