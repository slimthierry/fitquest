import React from 'react';
import { Trophy, Lock } from 'lucide-react';

interface AchievementBadgeProps {
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  isEarned: boolean;
  earnedAt?: string;
}

const rarityConfig: Record<string, { color: string; label: string }> = {
  common: { color: 'var(--color-rarity-common)', label: 'Common' },
  rare: { color: 'var(--color-rarity-rare)', label: 'Rare' },
  epic: { color: 'var(--color-rarity-epic)', label: 'Epic' },
  legendary: { color: 'var(--color-rarity-legendary)', label: 'Legendary' },
};

export function AchievementBadge({
  name,
  description,
  rarity,
  xpReward,
  isEarned,
  earnedAt,
}: AchievementBadgeProps) {
  const config = rarityConfig[rarity];

  return (
    <div
      className={`rounded-xl p-4 border-l-4 border transition-shadow ${
        isEarned ? 'hover:shadow-lg' : 'opacity-60'
      }`}
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border-primary)',
        borderLeftColor: isEarned ? config.color : 'var(--color-border-primary)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
          style={{
            backgroundColor: isEarned ? `${config.color}20` : 'var(--color-bg-tertiary)',
          }}
        >
          {isEarned ? (
            <Trophy className="h-6 w-6" style={{ color: config.color }} />
          ) : (
            <Lock className="h-6 w-6" style={{ color: 'var(--color-text-muted)' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {name}
            </h3>
            <span
              className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ color: config.color, backgroundColor: `${config.color}15` }}
            >
              {config.label}
            </span>
          </div>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {isEarned ? earnedAt : 'Not yet earned'}
            </span>
            <span
              className="text-xs font-bold"
              style={{
                color: isEarned ? 'var(--color-xp)' : 'var(--color-text-muted)',
              }}
            >
              +{xpReward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
