import React from 'react';
import { Swords, Clock, Star } from 'lucide-react';

interface QuestCardProps {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  type: string;
  targetValue: number;
  targetUnit: string;
  rewardXP: number;
  durationDays: number;
  progress?: number;
  onAccept?: () => void;
}

const difficultyColors: Record<string, string> = {
  easy: 'var(--color-success)',
  medium: 'var(--color-warning)',
  hard: 'var(--color-brand)',
  legendary: 'var(--color-rarity-legendary)',
};

export function QuestCard({
  name,
  description,
  difficulty,
  type,
  targetValue,
  targetUnit,
  rewardXP,
  durationDays,
  progress,
  onAccept,
}: QuestCardProps) {
  const diffColor = difficultyColors[difficulty];
  const isActive = progress !== undefined;

  return (
    <div
      className="rounded-xl p-6 border transition-shadow hover:shadow-lg"
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border-primary)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'var(--color-brand-light)' }}
        >
          <Swords className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
        </div>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full uppercase"
          style={{ color: diffColor, backgroundColor: `${diffColor}15` }}
        >
          {difficulty}
        </span>
      </div>

      <h3
        className="text-base font-semibold"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {name}
      </h3>
      <p
        className="text-sm mt-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {description}
      </p>

      <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {durationDays} days
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3" /> {targetValue} {targetUnit}
        </span>
      </div>

      {isActive && (
        <div className="mt-3">
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: 'var(--color-brand)' }}
            />
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {progress}% complete
          </p>
        </div>
      )}

      <div
        className="flex items-center justify-between mt-4 pt-3 border-t"
        style={{ borderColor: 'var(--color-border-primary)' }}
      >
        <span className="text-sm font-bold" style={{ color: 'var(--color-xp)' }}>
          +{rewardXP} XP
        </span>
        {onAccept && !isActive && (
          <button
            onClick={onAccept}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--color-brand)' }}
          >
            Accept Quest
          </button>
        )}
      </div>
    </div>
  );
}
