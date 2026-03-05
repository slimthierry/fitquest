import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Swords,
  Trophy,
  Crown,
  Flame,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workouts', label: 'Workouts', icon: Dumbbell },
  { to: '/quests', label: 'Quests', icon: Swords },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/leaderboard', label: 'Leaderboard', icon: Crown },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-default surface-primary">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-default">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-heading">FitQuest</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-brand-light)] text-brand-600 dark:text-brand-400'
                  : 'text-body hover:surface-tertiary hover:text-heading'
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-default p-4">
        <div className="card !p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">LV</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-heading truncate">Level 1</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-bg-tertiary)]">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
