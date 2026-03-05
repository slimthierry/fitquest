import {
  Flame,
  TrendingUp,
  Timer,
  Zap,
  Target,
  Trophy,
  Dumbbell,
  ChevronRight,
} from 'lucide-react';

const mockStats = {
  level: 5,
  totalXp: 1250,
  xpToNextLevel: 500,
  xpProgress: 50,
  currentStreak: 7,
  longestStreak: 14,
  weeklyWorkouts: 4,
  weeklyMinutes: 180,
  weeklyCalories: 2400,
  weeklyXp: 1800,
};

const mockActiveQuests = [
  { id: 1, name: 'Run 20km This Week', progress: 65, reward: 500, icon: 'running', difficulty: 'medium' },
  { id: 2, name: 'Complete 5 HIIT Sessions', progress: 40, reward: 750, icon: 'hiit', difficulty: 'hard' },
  { id: 3, name: 'Yoga Every Day', progress: 85, reward: 300, icon: 'yoga', difficulty: 'easy' },
];

const mockRecentWorkouts = [
  { id: 1, type: 'running', duration: 45, xp: 450, date: 'Today', calories: 420 },
  { id: 2, type: 'gym', duration: 60, xp: 600, date: 'Yesterday', calories: 580 },
  { id: 3, type: 'yoga', duration: 30, xp: 300, date: '2 days ago', calories: 150 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Dashboard</h1>
          <p className="text-body mt-1">Track your fitness journey</p>
        </div>
      </div>

      {/* Level & XP Card */}
      <div className="card bg-gradient-to-r from-brand-500 to-brand-600 !border-0 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <span className="text-lg font-bold">{mockStats.level}</span>
              </div>
              <div>
                <p className="text-sm text-white/80">Current Level</p>
                <p className="text-lg font-bold">Level {mockStats.level}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-white/80">Total XP</p>
              <p className="text-xl font-bold">{mockStats.totalXp.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <Flame className="h-5 w-5 text-orange-300" />
              <div>
                <p className="text-xs text-white/80">Streak</p>
                <p className="text-lg font-bold">{mockStats.currentStreak}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/80 mb-1">
            <span>{mockStats.xpProgress}% to Level {mockStats.level + 1}</span>
            <span>{mockStats.xpToNextLevel - Math.floor(mockStats.xpToNextLevel * mockStats.xpProgress / 100)} XP remaining</span>
          </div>
          <div className="h-3 rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${mockStats.xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Workouts', value: mockStats.weeklyWorkouts, icon: Dumbbell, suffix: 'this week' },
          { label: 'Minutes', value: mockStats.weeklyMinutes, icon: Timer, suffix: 'total' },
          { label: 'Calories', value: mockStats.weeklyCalories, icon: Zap, suffix: 'burned' },
          { label: 'XP Earned', value: mockStats.weeklyXp, icon: TrendingUp, suffix: 'this week' },
        ].map(({ label, value, icon: Icon, suffix }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-caption">{label}</p>
                <p className="text-2xl font-bold text-heading mt-1">{value.toLocaleString()}</p>
                <p className="text-xs text-muted mt-1">{suffix}</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--color-brand-light)' }}
              >
                <Icon className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Quests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading flex items-center gap-2">
              <Target className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
              Active Quests
            </h2>
            <button className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--color-brand)' }}>
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {mockActiveQuests.map((quest) => (
              <div key={quest.id} className="rounded-lg p-3 surface-secondary border border-default">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-heading">{quest.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand)' }}>
                    +{quest.reward} XP
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)]">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${quest.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted mt-1">{quest.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-heading flex items-center gap-2">
              <Dumbbell className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
              Recent Workouts
            </h2>
            <button className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--color-brand)' }}>
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {mockRecentWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between rounded-lg p-3 surface-secondary border border-default">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'var(--color-brand-light)' }}
                  >
                    <Dumbbell className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading capitalize">{workout.type}</p>
                    <p className="text-xs text-muted">{workout.date} &middot; {workout.duration} min &middot; {workout.calories} cal</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-xp)' }}>
                    +{workout.xp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
