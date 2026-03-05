export const brandColors = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444',
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
  950: '#450A0A',
} as const;

export const rarityColors = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
} as const;

const workoutTypeColors: Record<string, string> = {
  running: '#EF4444',
  cycling: '#3b82f6',
  swimming: '#06b6d4',
  gym: '#8b5cf6',
  yoga: '#10b981',
  hiit: '#f97316',
  other: '#6b7280',
};

/**
 * Get the color associated with a workout type.
 */
export function getWorkoutTypeColor(type: string): string {
  return workoutTypeColors[type] || workoutTypeColors.other;
}
