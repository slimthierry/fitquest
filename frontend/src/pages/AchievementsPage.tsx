import { Trophy, Lock, Sparkles } from 'lucide-react';

const rarityConfig: Record<string, { color: string; label: string }> = {
  common: { color: 'var(--color-rarity-common)', label: 'Common' },
  rare: { color: 'var(--color-rarity-rare)', label: 'Rare' },
  epic: { color: 'var(--color-rarity-epic)', label: 'Epic' },
  legendary: { color: 'var(--color-rarity-legendary)', label: 'Legendary' },
};

const mockEarned = [
  { id: 1, name: 'First Workout', description: 'Complete your first workout', rarity: 'common', xp: 50, earnedAt: '2024-11-15', icon: 'dumbbell' },
  { id: 2, name: 'Streak Starter', description: 'Maintain a 3-day streak', rarity: 'common', xp: 100, earnedAt: '2024-11-18', icon: 'flame' },
  { id: 3, name: 'Week Warrior', description: 'Work out every day for a week', rarity: 'rare', xp: 300, earnedAt: '2024-11-25', icon: 'shield' },
  { id: 4, name: 'XP Hunter', description: 'Earn 5,000 total XP', rarity: 'rare', xp: 500, earnedAt: '2024-12-01', icon: 'zap' },
  { id: 5, name: 'Quest Master', description: 'Complete 10 quests', rarity: 'epic', xp: 1000, earnedAt: '2024-12-05', icon: 'swords' },
];

const mockLocked = [
  { id: 6, name: 'Iron Streak', description: 'Maintain a 30-day streak', rarity: 'epic', xp: 1500, icon: 'flame' },
  { id: 7, name: 'Marathon Runner', description: 'Run a total of 100km', rarity: 'epic', xp: 2000, icon: 'running' },
  { id: 8, name: 'Fitness Legend', description: 'Reach Level 50', rarity: 'legendary', xp: 5000, icon: 'crown' },
  { id: 9, name: 'XP Millionaire', description: 'Earn 1,000,000 total XP', rarity: 'legendary', xp: 10000, icon: 'gem' },
  { id: 10, name: 'Centurion', description: 'Complete 100 workouts', rarity: 'rare', xp: 800, icon: 'target' },
  { id: 11, name: 'Variety Pack', description: 'Try all 7 workout types', rarity: 'common', xp: 200, icon: 'grid' },
  { id: 12, name: 'Night Owl', description: 'Log a workout after 10 PM', rarity: 'common', xp: 75, icon: 'moon' },
];

export default function AchievementsPage() {
  const totalEarned = mockEarned.length;
  const totalAvailable = mockEarned.length + mockLocked.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Achievements</h1>
          <p className="text-body mt-1">Collect badges and earn bonus XP</p>
        </div>
        <div className="card !p-3 flex items-center gap-3">
          <Trophy className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
          <div>
            <p className="text-sm font-bold text-heading">{totalEarned}/{totalAvailable}</p>
            <p className="text-xs text-muted">Unlocked</p>
          </div>
        </div>
      </div>

      {/* Progress by Rarity */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(rarityConfig).map(([rarity, config]) => {
          const earned = mockEarned.filter((a) => a.rarity === rarity).length;
          const total = [...mockEarned, ...mockLocked].filter((a) => a.rarity === rarity).length;
          return (
            <div key={rarity} className="card !p-4 text-center">
              <div
                className="inline-flex h-8 w-8 items-center justify-center rounded-full mb-2"
                style={{ backgroundColor: `${config.color}20`, color: config.color }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-heading">{config.label}</p>
              <p className="text-xs text-muted">{earned}/{total}</p>
            </div>
          );
        })}
      </div>

      {/* Earned Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-heading mb-4">Earned</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockEarned.map((achievement) => {
            const rarity = rarityConfig[achievement.rarity];
            return (
              <div
                key={achievement.id}
                className="card !p-4 border-l-4 transition-shadow hover:shadow-lg"
                style={{ borderLeftColor: rarity.color }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: `${rarity.color}20` }}
                  >
                    <Trophy className="h-6 w-6" style={{ color: rarity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-heading truncate">{achievement.name}</h3>
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ color: rarity.color, backgroundColor: `${rarity.color}15` }}
                      >
                        {rarity.label}
                      </span>
                    </div>
                    <p className="text-xs text-body mt-0.5">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted">{achievement.earnedAt}</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--color-xp)' }}>
                        +{achievement.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-heading mb-4">Locked</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockLocked.map((achievement) => {
            const rarity = rarityConfig[achievement.rarity];
            return (
              <div
                key={achievement.id}
                className="card !p-4 opacity-60 border-l-4"
                style={{ borderLeftColor: 'var(--color-border-primary)' }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 surface-tertiary">
                    <Lock className="h-6 w-6 text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-heading truncate">{achievement.name}</h3>
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ color: rarity.color, backgroundColor: `${rarity.color}15` }}
                      >
                        {rarity.label}
                      </span>
                    </div>
                    <p className="text-xs text-body mt-0.5">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted">Not yet earned</span>
                      <span className="text-xs font-bold text-muted">
                        +{achievement.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
