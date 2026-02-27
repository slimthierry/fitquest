import React from 'react';
import { Dumbbell, Calendar, Timer, Zap, MapPin } from 'lucide-react';

interface WorkoutCardProps {
  type: string;
  durationMinutes: number;
  caloriesBurned?: number | null;
  distanceKm?: number | null;
  xpEarned: number;
  date: string;
  notes?: string | null;
}

export function WorkoutCard({
  type,
  durationMinutes,
  caloriesBurned,
  distanceKm,
  xpEarned,
  date,
  notes,
}: WorkoutCardProps) {
  return (
    <div
      className="rounded-xl p-4 border transition-shadow hover:shadow-md"
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        borderColor: 'var(--color-border-primary)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: 'var(--color-brand-light)' }}
          >
            <Dumbbell className="h-6 w-6" style={{ color: 'var(--color-brand)' }} />
          </div>
          <div>
            <p
              className="text-base font-semibold capitalize"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {type}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <Calendar className="h-3 w-3" /> {date}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <Timer className="h-3 w-3" /> {durationMinutes} min
              </span>
              {caloriesBurned && (
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <Zap className="h-3 w-3" /> {caloriesBurned} cal
                </span>
              )}
              {distanceKm && (
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <MapPin className="h-3 w-3" /> {distanceKm} km
                </span>
              )}
            </div>
            {notes && (
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {notes}
              </p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ color: 'var(--color-xp)' }}>
            +{xpEarned}
          </span>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>XP</p>
        </div>
      </div>
    </div>
  );
}
