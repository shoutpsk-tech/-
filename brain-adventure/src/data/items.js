export const ITEMS = {
  // 일반 아이템
  STAGE_SKIP: {
    id: 'stage_skip',
    name: '스테이지 스킵',
    type: 'consumable',
    rarity: 'common',
    description: '현재 스테이지를 건너뛸 수 있습니다'
  },
  DOUBLE_JUMP_SHOES: {
    id: 'double_jump_shoes',
    name: '2단 점프 신발',
    type: 'consumable',
    rarity: 'common',
    description: '2단 점프를 할 수 있습니다'
  },
  HINT: {
    id: 'hint',
    name: '힌트',
    type: 'consumable',
    rarity: 'common',
    description: '브레인 테스트 문제의 힌트를 제공합니다'
  },

  // 레어 아이템 (날 수 있는 아이템)
  HELICOPTER_HAT: {
    id: 'helicopter_hat',
    name: '헬리콥터 모자',
    type: 'consumable',
    rarity: 'rare',
    description: '일정 시간 동안 날 수 있습니다',
    duration: 10000 // 10초
  },
  BALLOON: {
    id: 'balloon',
    name: '풍선',
    type: 'consumable',
    rarity: 'rare',
    description: '일정 시간 동안 날 수 있습니다',
    duration: 10000 // 10초
  }
};

export const ITEM_POOL = {
  common: [
    ITEMS.STAGE_SKIP,
    ITEMS.DOUBLE_JUMP_SHOES,
    ITEMS.HINT
  ],
  rare: [
    ITEMS.HELICOPTER_HAT,
    ITEMS.BALLOON
  ]
};
