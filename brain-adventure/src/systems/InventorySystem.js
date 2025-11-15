export class InventorySystem {
  constructor() {
    this.items = {};
    this.coins = 0;
    this.ownedCostumes = ['basic_jeans']; // 기본 청바지
    this.equippedCostume = 'basic_jeans';
    this.hintsAvailable = 0;
  }

  addItem(itemId, quantity = 1) {
    if (!this.items[itemId]) {
      this.items[itemId] = 0;
    }
    this.items[itemId] += quantity;
  }

  useItem(itemId) {
    if (this.items[itemId] && this.items[itemId] > 0) {
      this.items[itemId]--;
      return true;
    }
    return false;
  }

  hasItem(itemId) {
    return this.items[itemId] && this.items[itemId] > 0;
  }

  addCoins(amount) {
    this.coins += amount;
  }

  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      return true;
    }
    return false;
  }

  buyCostume(costumeId, price) {
    if (this.spendCoins(price)) {
      this.ownedCostumes.push(costumeId);
      return true;
    }
    return false;
  }

  equipCostume(costumeId) {
    if (this.ownedCostumes.includes(costumeId)) {
      this.equippedCostume = costumeId;
      return true;
    }
    return false;
  }

  addHints(count) {
    this.hintsAvailable += count;
  }

  useHint() {
    if (this.hintsAvailable > 0) {
      this.hintsAvailable--;
      return true;
    }
    return false;
  }

  save() {
    localStorage.setItem('brainAdventure_inventory', JSON.stringify({
      items: this.items,
      coins: this.coins,
      ownedCostumes: this.ownedCostumes,
      equippedCostume: this.equippedCostume,
      hintsAvailable: this.hintsAvailable
    }));
  }

  load() {
    const saved = localStorage.getItem('brainAdventure_inventory');
    if (saved) {
      const data = JSON.parse(saved);
      this.items = data.items || {};
      this.coins = data.coins || 0;
      this.ownedCostumes = data.ownedCostumes || ['basic_jeans'];
      this.equippedCostume = data.equippedCostume || 'basic_jeans';
      this.hintsAvailable = data.hintsAvailable || 0;
    }
  }
}
