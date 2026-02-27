import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { icon: 'h-4 w-4', text: 'text-sm', label: 'text-[10px]' },
  md: { icon: 'h-5 w-5', text: 'text-lg', label: 'text-xs' },
  lg: { icon: 'h-7 w-7', text: 'text-2xl', label: 'text-sm' },
};

export function StreakCounter({
  currentStreak,
  longestStreak,
  showLabel = true,
  size = 'md',
}: StreakCounterProps) {
  const config = sizeConfig[size];
  const isActive = currentStreak > 0;

  return (
    <div className="flex items-center gap-2">
      <Flame
        className={config.icon}
        style={{
          color: isActive ? 'var(--color-streak)' : 'var(--color-text-muted)',
        }}
      />
      <div>
        <span
          className={`${config.text} font-bold`}
          style={{
            color: isActive ? 'var(--color-streak)' : 'var(--color-text-muted)',
          }}
        >
          {currentStreak}
        </span>
        {showLabel && (
          <span
            className={`${config.label} ml-1`}
            style={{ color: 'var(--color-text-muted)' }}
          >
            day{currentStreak !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {longestStreak !== undefined && longestStreak > 0 && (
        <span
          className="text-[10px] ml-1"
          style={{ color: 'var(--color-text-muted)' }}
          title="Longest streak"
        >
          (best: {longestStreak})
        </span>
      )}
    </div>
  );
}
