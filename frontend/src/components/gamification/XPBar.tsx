import React from 'react';

interface XPBarProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function XPBar({ currentXP, requiredXP, level, showLabel = true, size = 'md' }: XPBarProps) {
  const progress = requiredXP > 0 ? Math.min((currentXP / requiredXP) * 100, 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Level {level}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} XP
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full ${sizeClasses[size]}`}
        style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
      >
        <div
          className={`rounded-full transition-all duration-500 ease-out ${sizeClasses[size]}`}
          style={{
            width: `${progress}%`,
            backgroundColor: 'var(--color-brand)',
          }}
        />
      </div>
    </div>
  );
}
