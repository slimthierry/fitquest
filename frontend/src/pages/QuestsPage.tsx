import { useState } from 'react';
import {
  Swords,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

type QuestTab = 'available' | 'active' | 'completed';

const difficultyColors: Record<string, string> = {
  easy: 'var(--color-success)',
  medium: 'var(--color-warning)',
  hard: 'var(--color-brand)',
  legendary: 'var(--color-rarity-legendary)',
};

const mockAvailableQuests = [
  { id: 1, name: 'Marathon Month', description: 'Run a total of 42km in one month', difficulty: 'hard', type: 'monthly', reward: 1500, targetValue: 42, targetUnit: 'km', durationDays: 30 },
  { id: 2, name: 'Iron Will', description: 'Complete 20 gym sessions', difficulty: 'hard', type: 'monthly', reward: 1200, targetValue: 20, targetUnit: 'workouts', durationDays: 30 },
  { id: 3, name: 'Daily Stretch', description: 'Do yoga every day for a week', difficulty: 'easy', type: 'weekly', reward: 300, targetValue: 7, targetUnit: 'workouts', durationDays: 7 },
  { id: 4, name: 'Speed Demon', description: 'Complete 3 HIIT sessions this week', difficulty: 'medium', type: 'weekly', reward: 500, targetValue: 3, targetUnit: 'workouts', durationDays: 7 },
  { id: 5, name: 'Aqua Challenge', description: 'Swim 5km total', difficulty: 'medium', type: 'weekly', reward: 600, targetValue: 5, targetUnit: 'km', durationDays: 7 },
  { id: 6, name: 'Legendary Grind', description: 'Work out for 1000 minutes total', difficulty: 'legendary', type: 'special', reward: 5000, targetValue: 1000, targetUnit: 'minutes', durationDays: 60 },
];

const mockActiveQuests = [
  { id: 1, name: 'Run 20km This Week', progress: 65, targetValue: 20, targetUnit: 'km', reward: 500, difficulty: 'medium', daysLeft: 3 },
  { id: 2, name: 'Complete 5 HIIT Sessions', progress: 40, targetValue: 5, targetUnit: 'workouts', reward: 750, difficulty: 'hard', daysLeft: 5 },
  { id: 3, name: 'Yoga Every Day', progress: 85, targetValue: 7, targetUnit: 'workouts', reward: 300, difficulty: 'easy', daysLeft: 1 },
];

const mockCompletedQuests = [
  { id: 1, name: 'First Steps', reward: 100, completedAt: '2024-12-05', difficulty: 'easy' },
  { id: 2, name: 'Week Warrior', reward: 500, completedAt: '2024-12-01', difficulty: 'medium' },
  { id: 3, name: 'Cardio King', reward: 800, completedAt: '2024-11-28', difficulty: 'hard' },
];

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<QuestTab>('available');

  const tabs: { key: QuestTab; label: string; count: number }[] = [
    { key: 'available', label: 'Available', count: mockAvailableQuests.length },
    { key: 'active', label: 'Active', count: mockActiveQuests.length },
    { key: 'completed', label: 'Completed', count: mockCompletedQuests.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Quests</h1>
        <p className="text-body mt-1">Accept challenges and earn bonus XP</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg p-1 surface-tertiary w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? 'surface-elevated text-heading'
                : 'text-body hover:text-heading'
            }`}
          >
            {label}
            <span
              className="rounded-full px-2 py-0.5 text-xs"
              style={
                activeTab === key
                  ? { backgroundColor: 'var(--color-brand-light)', color: 'var(--color-brand)' }
                  : {}
              }
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Available Quests Grid */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockAvailableQuests.map((quest) => (
            <div key={quest.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--color-brand-light)' }}
                >
                  <Swords className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full uppercase"
                  style={{
                    color: difficultyColors[quest.difficulty],
                    backgroundColor: `${difficultyColors[quest.difficulty]}15`,
                  }}
                >
                  {quest.difficulty}
                </span>
              </div>
              <h3 className="text-base font-semibold text-heading">{quest.name}</h3>
              <p className="text-sm text-body mt-1">{quest.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {quest.durationDays} days
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" /> {quest.targetValue} {quest.targetUnit}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-default">
                <span className="text-sm font-bold" style={{ color: 'var(--color-xp)' }}>
                  +{quest.reward} XP
                </span>
                <button className="btn-primary !py-1.5 !px-3 text-sm">
                  Accept Quest
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Quests */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {mockActiveQuests.map((quest) => (
            <div key={quest.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: 'var(--color-brand-light)' }}
                  >
                    <Swords className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-heading">{quest.name}</h3>
                    <span
                      className="text-xs font-bold uppercase"
                      style={{ color: difficultyColors[quest.difficulty] }}
                    >
                      {quest.difficulty}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-xp)' }}>+{quest.reward} XP</span>
                  <p className="text-xs text-muted">{quest.daysLeft} days left</p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-[var(--color-bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${quest.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-body">{quest.progress}% complete</span>
                <span className="text-muted">
                  {Math.round(quest.targetValue * quest.progress / 100)}/{quest.targetValue} {quest.targetUnit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Quests */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {mockCompletedQuests.map((quest) => (
            <div key={quest.id} className="card !p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6" style={{ color: 'var(--color-success)' }} />
                <div>
                  <p className="text-sm font-semibold text-heading">{quest.name}</p>
                  <p className="text-xs text-muted">Completed {quest.completedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold uppercase"
                  style={{ color: difficultyColors[quest.difficulty] }}
                >
                  {quest.difficulty}
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--color-xp)' }}>
                  +{quest.reward} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
