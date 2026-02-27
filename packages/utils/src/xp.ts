const XP_PER_MINUTE = 10;

/**
 * Calculate XP earned from a workout.
 * Base: 10 XP per minute, with streak bonus multiplier.
 */
export function calculateWorkoutXP(durationMinutes: number, streakBonus: number = 0): number {
  const baseXP = durationMinutes * XP_PER_MINUTE;
  const bonus = Math.floor(baseXP * streakBonus);
  return baseXP + bonus;
}

/**
 * Calculate XP earned from completing a quest.
 */
export function calculateQuestCompletionXP(
  rewardXP: number,
  difficultyMultiplier: number = 1.0
): number {
  return Math.floor(rewardXP * difficultyMultiplier);
}

/**
 * Calculate the XP needed to complete a given level.
 * Level 1 = 100 XP, Level 2 = 200 XP, etc.
 */
export function xpForLevel(level: number): number {
  return level * 100;
}

/**
 * Calculate cumulative XP needed to reach a specific level.
 */
export function totalXPForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += xpForLevel(l);
  }
  return total;
}

/**
 * Determine the current level from total XP.
 */
export function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let remaining = totalXP;

  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }

  return level;
}

/**
 * Calculate percentage progress within the current level (0-100).
 */
export function xpProgressInLevel(totalXP: number, currentLevel: number): number {
  const xpAtLevelStart = totalXPForLevel(currentLevel);
  const xpInCurrentLevel = totalXP - xpAtLevelStart;
  const xpNeeded = xpForLevel(currentLevel);

  if (xpNeeded === 0) return 0;

  return Math.min(Math.round((xpInCurrentLevel / xpNeeded) * 1000) / 10, 100);
}
