const spiritsData = [
  // --- 노말 ---
  { name: '실피드', grade: '노말', character_attack_coef: 0.1, character_attack_speed: 0.6, element_type: 'GRASS', buff_target_type: 'character_attack_speed', buff_value: 5 },
  { name: '브라이트', grade: '노말', character_attack_coef: 0.11, character_attack_speed: 0.63, element_type: 'LIGHT', buff_target_type: 'character_defense', buff_value: 20 },
  { name: '로스', grade: '노말', character_attack_coef: 0.12, character_attack_speed: 0.66, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 20 },

  // --- 매직 ---
  { name: '불칸', grade: '매직', character_attack_coef: 0.2, character_attack_speed: 0.7, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 50 },
  { name: '님프', grade: '매직', character_attack_coef: 0.22, character_attack_speed: 0.73, element_type: 'GRASS', buff_target_type: 'element_grass', buff_value: 20 },
  { name: '잭 프로스트', grade: '매직', character_attack_coef: 0.24, character_attack_speed: 0.76, element_type: 'WATER', buff_target_type: 'element_water', buff_value: 20 },

  // --- 레어 ---
  { name: '나이트 스토커', grade: '레어', character_attack_coef: 0.35, character_attack_speed: 0.7, element_type: 'DARK', comment: '40% 피해 4회 (쿨타임 5초)' },
  { name: '세인트', grade: '레어', character_attack_coef: 0.37, character_attack_speed: 0.73, element_type: 'LIGHT', buff_target_type: 'element_light', buff_value: 50 },
  { name: '셰도우', grade: '레어', character_attack_coef: 0.38, character_attack_speed: 0.76, element_type: 'DARK', buff_target_type: 'element_dark', buff_value: 50 },
  { name: '플레임', grade: '레어', character_attack_coef: 0.4, character_attack_speed: 0.79, element_type: 'FIRE', buff_target_type: 'element_fire', buff_value: 50 },
  { name: '올라프', grade: '레어', character_attack_coef: 0.41, character_attack_speed: 0.82, element_type: 'WATER', comment: '300% 피해 1회 (쿨타임 6초)' },
  { name: '시틸라', grade: '레어', character_attack_coef: 0.43, character_attack_speed: 0.85, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 100 },
  { name: '플래쉬', grade: '레어', character_attack_coef: 0.44, character_attack_speed: 0.88, element_type: 'LIGHT', buff_target_type: 'character_defense', buff_value: 100 },

  // --- 유니크 ---
  { name: '고스트', grade: '유니크', character_attack_coef: 0.5, character_attack_speed: 0.8, element_type: 'DARK', comment: '캐릭터 치명타 20%' },
  { name: '위습', grade: '유니크', character_attack_coef: 0.53, character_attack_speed: 0.83, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 200 },
  { name: '앰버', grade: '유니크', character_attack_coef: 0.55, character_attack_speed: 0.86, element_type: 'FIRE', buff_target_type: 'element_fire', buff_value: 100 },
  { name: '글레시스', grade: '유니크', character_attack_coef: 0.58, character_attack_speed: 0.89, element_type: 'WATER', buff_target_type: 'element_water', buff_value: 100 },
  { name: '볼레투스', grade: '유니크', character_attack_coef: 0.6, character_attack_speed: 0.92, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 200 },
  { name: '리스', grade: '유니크', character_attack_coef: 0.63, character_attack_speed: 0.95, element_type: 'LIGHT', buff_target_type: 'element_light', buff_value: 100 },
  { name: '에리셔스', grade: '유니크', character_attack_coef: 0.65, character_attack_speed: 0.98, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 200 },

  // --- 에픽 ---
  { name: '페페', grade: '에픽', character_attack_coef: 0.75, character_attack_speed: 1.2, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 400 },
  { name: '플루토', grade: '에픽', character_attack_coef: 0.78, character_attack_speed: 1.23, element_type: 'DARK', comment: '캐릭터 치명타 40%' },
  { name: '레멘', grade: '에픽', character_attack_coef: 0.8, character_attack_speed: 1.26, element_type: 'GRASS', buff_target_type: 'element_grass', buff_value: 200 },
  { name: '움브라', grade: '에픽', character_attack_coef: 0.83, character_attack_speed: 1.29, element_type: 'DARK', buff_target_type: 'element_dark', buff_value: 200 },
  { name: '람', grade: '에픽', character_attack_coef: 0.85, character_attack_speed: 1.32, element_type: 'LIGHT', comment: '500% 피해 1회 (쿨타임 6초)' },
  { name: '헬 하운드', grade: '에픽', character_attack_coef: 0.88, character_attack_speed: 1.35, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 400 },
  { name: '프로스트 팽', grade: '에픽', character_attack_coef: 0.9, character_attack_speed: 1.38, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 400 },

  // --- 레전더리 ---
  { name: '파비아', grade: '레전더리', character_attack_coef: 1.0, character_attack_speed: 1.5, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 800 },
  { name: '루멘', grade: '레전더리', character_attack_coef: 1.05, character_attack_speed: 1.53, element_type: 'LIGHT', buff_target_type: 'element_light', buff_value: 400 },
  { name: '반드', grade: '레전더리', character_attack_coef: 1.1, character_attack_speed: 1.56, element_type: 'WATER', buff_target_type: 'element_water', buff_value: 400 },
  { name: '루트', grade: '레전더리', character_attack_coef: 1.15, character_attack_speed: 1.59, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 800 },
  { name: '티버', grade: '레전더리', character_attack_coef: 1.2, character_attack_speed: 1.62, element_type: 'FIRE', buff_target_type: 'element_fire', buff_value: 400 },
  { name: '슈에트', grade: '레전더리', character_attack_coef: 1.2, character_attack_speed: 1.65, element_type: 'DARK', comment: '캐릭터 회피 8%' },
  { name: '파라셀', grade: '레전더리', character_attack_coef: 1.3, character_attack_speed: 1.68, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 800 },

  // --- 디바인 ---
  { name: '갈라테아', grade: '디바인', character_attack_coef: 2, character_attack_speed: 1.8, element_type: 'GRASS', buff_target_type: 'element_grass', buff_value: 700 },
  { name: '브리스', grade: '디바인', character_attack_coef: 2.1, character_attack_speed: 1.83, element_type: 'DARK', buff_target_type: 'element_dark', buff_value: 700 },
  { name: '트렌트', grade: '디바인', character_attack_coef: 2.2, character_attack_speed: 1.86, element_type: 'GRASS', comment: '120% 피해 7회 (쿨타임 8초)' },
  { name: '갤러해드', grade: '디바인', character_attack_coef: 2.3, character_attack_speed: 1.89, element_type: 'LIGHT', buff_target_type: 'character_hp', buff_value: 1600 },
  { name: '임프', grade: '디바인', character_attack_coef: 2.4, character_attack_speed: 1.92, element_type: 'DARK', comment: '캐릭터 치명타 80%' },
  { name: '튠', grade: '디바인', character_attack_coef: 2.5, character_attack_speed: 1.95, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 1600 },
  { name: '구미호', grade: '디바인', character_attack_coef: 2.6, character_attack_speed: 1.98, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 1600 },
  { name: '유니콘', grade: '디바인', character_attack_coef: 2.7, character_attack_speed: 2.01, element_type: 'LIGHT', comment: '800% 피해 1회 (쿨타임 7초)' },
  { name: '뱀파이어', grade: '디바인', character_attack_coef: 2.8, character_attack_speed: 2.04, element_type: 'DARK', comment: '900% 피해 1회 (쿨타임 7초)' },

  // --- 미스틱 ---
  { name: '솔리스', grade: '미스틱', character_attack_coef: 3.5, character_attack_speed: 2.1, element_type: 'LIGHT', buff_target_type: 'element_light', buff_value: 1200 },
  { name: '케리네이아', grade: '미스틱', character_attack_coef: 3.6, character_attack_speed: 2.13, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 3200 },
  { name: '예티', grade: '미스틱', character_attack_coef: 3.7, character_attack_speed: 2.16, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 3200 },
  { name: '이프리트', grade: '미스틱', character_attack_coef: 3.8, character_attack_speed: 2.19, element_type: 'FIRE', buff_target_type: 'element_fire', buff_value: 1200 },
  { name: '가고일', grade: '미스틱', character_attack_coef: 3.9, character_attack_speed: 2.22, element_type: 'DARK', comment: '캐릭터 치명타 160%' },
  { name: '드라이드', grade: '미스틱', character_attack_coef: 4.0, character_attack_speed: 2.25, element_type: 'GRASS', buff_target_type: 'element_grass', buff_value: 1200 },
  { name: '수호천사', grade: '미스틱', character_attack_coef: 4.1, character_attack_speed: 2.28, element_type: 'LIGHT', comment: '피해저항 4초동안 15% (쿨타임 8초)' },
  { name: '샐러맨더', grade: '미스틱', character_attack_coef: 4.2, character_attack_speed: 2.31, element_type: 'FIRE', comment: '1200% 피해 1회 (쿨타임 8초)' },
  { name: '골렘', grade: '미스틱', character_attack_coef: 4.3, character_attack_speed: 2.34, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 3200 },

  // --- 이터널 ---
  { name: '다크니스', grade: '이터널', character_attack_coef: 5.0, character_attack_speed: 2.3, element_type: 'DARK', buff_target_type: 'element_dark', buff_value: 2000 },
  { name: '라테란', grade: '이터널', character_attack_coef: 5.25, character_attack_speed: 2.33, element_type: 'LIGHT', buff_target_type: 'character_hp', buff_value: 6400 },
  { name: '프린셔', grade: '이터널', character_attack_coef: 5.5, character_attack_speed: 2.36, element_type: 'WATER', buff_target_type: 'element_water', buff_value: 2000 },
  { name: '인페르노', grade: '이터널', character_attack_coef: 5.75, character_attack_speed: 2.39, element_type: 'FIRE', comment: '280% 피해 6회, 9초간 공격속도 50% 증가 (쿨타임 9초)' },
  { name: '사이클롭스', grade: '이터널', character_attack_coef: 6.0, character_attack_speed: 2.42, element_type: 'DARK', comment: '1800% 피해 1회 (쿨타임 9초)' },
  { name: '베로나', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'FIRE', comment: '2500% 피해 1회 (쿨타임 10초)' },
  { name: '풀알', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'WATER', comment: '2500% 피해 1회 (쿨타임 10초)' },
  { name: '엘루앙', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'GRASS', comment: '500% 피해 5회 (쿨타임 10초)' },
  { name: '루에나', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'LIGHT', comment: '375% 피해 6회 (쿨타임 9초)' },
  { name: '벨자드라', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'DARK', comment: '500% 피해 5회 (쿨타임 10초)' },
  { name: '마릴', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'GRASS', buff_target_type: 'character_attack', buff_value: 9600 },
  { name: '세리니어', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 9600 },
  { name: '레그나르', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.45, element_type: 'FIRE', buff_target_type: 'element_fire', buff_value: 2000 },
  { name: '셀렌티어', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.48, element_type: 'GRASS', comment: '캐릭터 회피율 10% 증가' },
  { name: '세레스', grade: '이터널', character_attack_coef: 15, character_attack_speed: 2.42, element_type: 'LIGHT', buff_target_type: 'character_hp', buff_value: 9600 },

  // --- 인피니티 ---
  { name: '와이번', grade: '인피니티', character_attack_coef: 7.5, character_attack_speed: 2.5, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 12800 },
  { name: '럭스', grade: '인피니티', character_attack_coef: 7.75, character_attack_speed: 2.53, element_type: 'LIGHT', comment: '2500% 피해 1회, 캐릭터 치명타 확률 5초동안 40% 증가 (쿨타임 10초)' },
  { name: '어비스', grade: '인피니티', character_attack_coef: 8.0, character_attack_speed: 2.56, element_type: 'DARK', comment: '캐릭터 치명타 320%' },
  { name: '아라우네', grade: '인피니티', character_attack_coef: 8.25, character_attack_speed: 2.59, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 12800 },
  { name: '이그니스', grade: '인피니티', character_attack_coef: 8.5, character_attack_speed: 2.62, element_type: 'FIRE', comment: '240% 피해 11회, 캐릭터 공격력 5초동안 6400% 증가 (쿨타임 10초)' },
  { name: '이베르', grade: '인피니티', character_attack_coef: 8.75, character_attack_speed: 2.65, element_type: 'WATER', buff_target_type: 'character_attack', buff_value: 1600 },
  { name: '알풀', grade: '인피니티', character_attack_coef: 9.0, character_attack_speed: 2.68, element_type: 'GRASS', comment: '240% 피해 11회' },
  { name: '에시메드', grade: '인피니티', character_attack_coef: 9.25, character_attack_speed: 2.71, element_type: 'DARK', comment: '240% 피해 11회 (쿨타임 9초)' },
  { name: '세이레인', grade: '인피니티', character_attack_coef: 9.5, character_attack_speed: 2.74, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 12800 },
  { name: '세룬', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.87, element_type: 'FIRE', comment: '3600% 피해 1회, 9초간 공격속도 60% 증가 (쿨타임 9초)' },
  { name: '이베론', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.94, element_type: 'FIRE', comment: '4400% 피해 1회, 크리티컬률 5초간 50% 증가 (쿨타임 11초)' },
  { name: '엘도란', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.94, element_type: 'WATER', comment: '4800% 피해 1회, 데미지 감소 3초 15% 증가 (쿨타임 12초)' },
  { name: '루세리아', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.87, element_type: 'WATER', comment: '4400% 피해 1회, 회피율 무시 2초 80% 증가 (쿨타임 11초)' },
  { name: '돌미엘', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.94, element_type: 'GRASS', comment: '550% 피해 1회, 크리티컬률 5초간 50% 증가 (쿨타임 12초)' },
  { name: '카렌티아', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.87, element_type: 'GRASS', comment: '440% 피해 8회, 공격력 증폭 5초 9600% 증가 (쿨타임 11초)' },
  { name: '루세일', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.94, element_type: 'DARK', comment: '1100% 피해 4회, 공격력 증폭 4초 9600% 증가 (쿨타임 11초)' },
  { name: '엘하리엘', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 3.0, element_type: 'LIGHT', comment: '4400% 피해 1회, 방어력 증폭 6초 12800% 증가 (쿨타임 11초)' },
  { name: '아리에', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.87, element_type: 'LIGHT', comment: '600% 피해 6회, 공격속도 9초 60% 증가 (쿨타임 9초)' },
  { name: '벨라', grade: '인피니티', character_attack_coef: 30, character_attack_speed: 2.87, element_type: 'DARK', comment: '4800% 피해 1회, 회피율 무시 4초 30% 증가 (쿨타임 12초)' },
  { name: '지구 정복 냥이 치치', grade: '인피니티', character_attack_coef: 10, character_attack_speed: 2.7, element_type: 'GRASS', buff_target_type: 'character_defense', buff_value: 9600 },
  { name: '카이사르 강태식', grade: '인피니티', character_attack_coef: 10, character_attack_speed: 2.7, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 9600 },
  { name: '순수한 강아지 모랑', grade: '인피니티', character_attack_coef: 10, character_attack_speed: 2.7, element_type: 'WATER', buff_target_type: 'character_hp', buff_value: 9600 },

  // --- 엘더 ---
  { name: '아르디스', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.0, element_type: 'FIRE', buff_target_type: 'character_attack', buff_value: 5907 },
  { name: '벨라트', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.15, element_type: 'FIRE', buff_target_type: 'element_fire', buff_value: 25600 },
  { name: '에나벨', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.0, element_type: 'WATER', comment: '1650% 피해 4회, 방어력 증폭 6초간 12800% 증가 (쿨타임 11초)' },
  { name: '넬라', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.0, element_type: 'WATER', buff_target_type: 'element_water', buff_value: 25600 },
  { name: '라피나', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.15, element_type: 'GRASS', comment: '7200% 피해 1회, 공격속도 10초 65% 증가 (쿨타임 12초)' },
  { name: '루제니아', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.0, element_type: 'LIGHT', comment: '6000% 피해 1회, 크리티컬률 6초간 60% 증가 (쿨타임 10초)' },
  { name: '녹티아', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.0, element_type: 'DARK', comment: '8400% 피해 1회, 회피율 무시 2초 100% 증가 (쿨타임 14초)' },
  { name: '로렐린', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.15, element_type: 'GRASS', buff_target_type: 'element_grass', buff_value: 25600 },
  { name: '노바', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.15, element_type: 'LIGHT', buff_target_type: 'element_light', buff_value: 25600 },
  { name: '베스카', grade: '엘더', character_attack_coef: 50, character_attack_speed: 3.15, element_type: 'DARK', buff_target_type: 'element_dark', buff_value: 25600 },
  { name: '카이사르 강태식(각성)', grade: '엘더', character_attack_coef: 35, character_attack_speed: 3.0, element_type: 'DARK', buff_target_type: 'character_attack', buff_value: 15600 },
  { name: '지구 정복 치치 (각성)', grade: '엘더', character_attack_coef: 35, character_attack_speed: 3.0, element_type: 'LIGHT', buff_target_type: 'character_attack', buff_value: 15600 },
];

export default spiritsData;
