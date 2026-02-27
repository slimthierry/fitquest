import React from 'react';

interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { container: 'h-6 w-6', text: 'text-[10px]' },
  md: { container: 'h-8 w-8', text: 'text-xs' },
  lg: { container: 'h-12 w-12', text: 'text-base' },
};

export function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`${config.container} rounded-full flex items-center justify-center font-bold text-white`}
      style={{ backgroundColor: 'var(--color-level)' }}
      title={`Level ${level}`}
    >
      <span className={config.text}>{level}</span>
    </div>
  );
}
