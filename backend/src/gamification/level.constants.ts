// src/gamification/level.constants.ts
export const LEVEL_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  // on peut ajouter autant de niveaux que vous voulez
};

export const getLevelFromXp = (xp: number): number => {
  let level = 1;
  for (const lvl in LEVEL_THRESHOLDS) {
    if (xp >= LEVEL_THRESHOLDS[lvl]) {
      level = parseInt(lvl, 10);
    } else {
      break;
    }
  }
  return level;
};
