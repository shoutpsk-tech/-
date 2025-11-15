import { STAGE_CONFIG } from '../config.js';

export class StageSystem {
  constructor() {
    this.currentStage = 1;
    this.maxStage = STAGE_CONFIG.MAX_STAGES;
    this.clearedStages = [];
  }

  clearStage() {
    if (!this.clearedStages.includes(this.currentStage)) {
      this.clearedStages.push(this.currentStage);
    }
  }

  nextStage() {
    if (this.currentStage < this.maxStage) {
      this.currentStage++;
      return true;
    }
    return false;
  }

  skipStage() {
    this.clearStage();
    return this.nextStage();
  }

  shouldGiveItemReward() {
    return this.currentStage % STAGE_CONFIG.ITEM_REWARD_INTERVAL === 0;
  }

  shouldGiveHintReward() {
    return this.currentStage % STAGE_CONFIG.HINT_REWARD_INTERVAL === 0;
  }

  getDifficulty() {
    // 스테이지가 높을수록 난이도 증가
    if (this.currentStage <= 10) return 'easy';
    if (this.currentStage <= 30) return 'normal';
    if (this.currentStage <= 50) return 'hard';
    return 'extreme';
  }

  save() {
    localStorage.setItem('brainAdventure_stage', JSON.stringify({
      currentStage: this.currentStage,
      clearedStages: this.clearedStages
    }));
  }

  load() {
    const saved = localStorage.getItem('brainAdventure_stage');
    if (saved) {
      const data = JSON.parse(saved);
      this.currentStage = data.currentStage || 1;
      this.clearedStages = data.clearedStages || [];
    }
  }
}
