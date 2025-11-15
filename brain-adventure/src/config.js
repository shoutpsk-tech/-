export const GAME_CONFIG = {
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: []
};

export const STAGE_CONFIG = {
  MAX_STAGES: 70,
  ITEM_REWARD_INTERVAL: 2,  // 2단계마다 아이템 획득 기회
  HINT_REWARD_INTERVAL: 30  // 30단계마다 힌트 3번 제공
};
