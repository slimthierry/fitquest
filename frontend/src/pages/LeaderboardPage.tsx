import { Crown, Flame, TrendingUp, Medal } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'Alex Thunder', level: 42, xp: 185600, streak: 45, longestStreak: 62, avatar: 'AT' },
  { rank: 2, name: 'Sarah Storm', level: 38, xp: 162400, streak: 30, longestStreak: 55, avatar: 'SS' },
  { rank: 3, name: 'Mike Power', level: 35, xp: 148200, streak: 28, longestStreak: 42, avatar: 'MP' },
  { rank: 4, name: 'Emma Swift', level: 31, xp: 132800, streak: 22, longestStreak: 38, avatar: 'ES' },
  { rank: 5, name: 'Jake Blaze', level: 28, xp: 118500, streak: 18, longestStreak: 35, avatar: 'JB' },
  { rank: 6, name: 'Luna Star', level: 25, xp: 105200, streak: 15, longestStreak: 30, avatar: 'LS' },
  { rank: 7, name: 'Ryan Wave', level: 22, xp: 92000, streak: 12, longestStreak: 25, avatar: 'RW' },
  { rank: 8, name: 'Mia Fierce', level: 20, xp: 84500, streak: 10, longestStreak: 22, avatar: 'MF' },
  { rank: 9, name: 'Noah Peak', level: 18, xp: 76200, streak: 8, longestStreak: 18, avatar: 'NP' },
  { rank: 10, name: 'Zoe Flash', level: 15, xp: 62800, streak: 5, longestStreak: 15, avatar: 'ZF' },
];

const currentUserRank = 12;

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff' };
    case 2:
      return { bg: 'linear-gradient(135deg, #9ca3af, #6b7280)', color: '#ffffff' };
    case 3:
      return { bg: 'linear-gradient(135deg, #d97706, #b45309)', color: '#ffffff' };
    default:
      return null;
  }
}

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Leaderboard</h1>
          <p className="text-body mt-1">See how you rank among other fitness warriors</p>
        </div>
        <div className="card !p-3 flex items-center gap-2">
          <Medal className="h-5 w-5" style={{ color: 'var(--color-brand)' }} />
          <div>
            <p className="text-sm font-bold text-heading">#{currentUserRank}</p>
            <p className="text-xs text-muted">Your Rank</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((user, idx) => {
          const isFirst = idx === 1;
          return (
            <div
              key={user.rank}
              className={`card text-center ${isFirst ? 'lg:-mt-4' : ''}`}
            >
              <div className="flex flex-col items-center">
                {isFirst && <Crown className="h-6 w-6 mb-2" style={{ color: '#f59e0b' }} />}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white mb-2"
                  style={{
                    background: getRankStyle(user.rank)?.bg || 'var(--color-brand)',
                  }}
                >
                  {user.avatar}
                </div>
                <p className="text-sm font-semibold text-heading">{user.name}</p>
                <p className="text-xs text-muted">Level {user.level}</p>
                <p className="text-base font-bold mt-1" style={{ color: 'var(--color-xp)' }}>
                  {user.xp.toLocaleString()} XP
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Flame className="h-3 w-3" style={{ color: 'var(--color-streak)' }} />
                  <span className="text-xs text-muted">{user.streak} day streak</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rankings Table */}
      <div className="card !p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default surface-secondary">
              <th className="py-3 px-4 text-left text-xs font-semibold text-caption uppercase tracking-wider">Rank</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-caption uppercase tracking-wider">User</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-caption uppercase tracking-wider">Level</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-caption uppercase tracking-wider">Total XP</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-caption uppercase tracking-wider hidden sm:table-cell">Streak</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-caption uppercase tracking-wider hidden md:table-cell">Best Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-primary)]">
            {mockLeaderboard.map((user) => {
              const rankStyle = getRankStyle(user.rank);
              return (
                <tr key={user.rank} className="transition-colors hover:surface-secondary">
                  <td className="py-3 px-4">
                    {rankStyle ? (
                      <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: rankStyle.bg, color: rankStyle.color }}
                      >
                        {user.rank}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-body pl-1.5">{user.rank}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                        {user.avatar}
                      </div>
                      <span className="text-sm font-medium text-heading">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: 'var(--color-level)', color: 'white' }}
                    >
                      {user.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-sm font-bold" style={{ color: 'var(--color-xp)' }}>
                      {user.xp.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center hidden sm:table-cell">
                    <div className="inline-flex items-center gap-1">
                      <Flame className="h-3 w-3" style={{ color: 'var(--color-streak)' }} />
                      <span className="text-sm text-body">{user.streak}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center hidden md:table-cell">
                    <span className="text-sm text-muted">{user.longestStreak}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
