export const COSTUMES = {
  // 기본 옷
  BASIC_JEANS: {
    id: 'basic_jeans',
    name: '청바지',
    type: 'pants',
    price: 100,
    category: 'basic'
  },
  BASIC_SHORTS: {
    id: 'basic_shorts',
    name: '반바지',
    type: 'pants',
    price: 80,
    category: 'basic'
  },
  MUSHROOM_SUIT: {
    id: 'mushroom_suit',
    name: '버섯 슈트',
    type: 'full',
    price: 200,
    category: 'basic'
  },
  ARMOR: {
    id: 'armor',
    name: '갑옷',
    type: 'full',
    price: 500,
    category: 'basic'
  },

  // 특별 옷
  CHRISTMAS_SUIT: {
    id: 'christmas_suit',
    name: '크리스마스 옷',
    type: 'full',
    price: 300,
    category: 'special',
    seasonal: 'christmas'
  },
  HALLOWEEN_SUIT: {
    id: 'halloween_suit',
    name: '할로윈 옷',
    type: 'full',
    price: 300,
    category: 'special',
    seasonal: 'halloween'
  },
  ANIMAL_SUIT: {
    id: 'animal_suit',
    name: '동물 슈트',
    type: 'full',
    price: 250,
    category: 'special'
  }
};

export const COSTUME_CATEGORIES = {
  basic: Object.values(COSTUMES).filter(c => c.category === 'basic'),
  special: Object.values(COSTUMES).filter(c => c.category === 'special')
};
