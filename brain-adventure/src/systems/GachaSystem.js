import { ITEM_POOL } from '../data/items.js';

export class GachaSystem {
  constructor() {
    this.rareChance = 0.1; // 10% 확률로 레어 아이템
  }

  drawItem() {
    const random = Math.random();

    if (random < this.rareChance) {
      // 레어 아이템
      const rareItems = ITEM_POOL.rare;
      const randomIndex = Math.floor(Math.random() * rareItems.length);
      return rareItems[randomIndex];
    } else {
      // 일반 아이템
      const commonItems = ITEM_POOL.common;
      const randomIndex = Math.floor(Math.random() * commonItems.length);
      return commonItems[randomIndex];
    }
  }

  drawMultiple(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(this.drawItem());
    }
    return results;
  }
}
