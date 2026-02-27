import { useTheme } from '../../App';
import { Sun, Moon, Bell, Search, Menu } from 'lucide-react';

function ThemeToggleIcon() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:surface-tertiary"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-body" />
      ) : (
        <Moon className="h-5 w-5 text-body" />
      )}
    </button>
  );
}

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-default px-6 surface-primary">
      <div className="flex items-center gap-4">
        <button className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg hover:surface-tertiary">
          <Menu className="h-5 w-5 text-body" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search workouts, quests..."
            className="input-field pl-10 w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:surface-tertiary relative">
          <Bell className="h-5 w-5 text-body" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
        </button>

        <ThemeToggleIcon />

        <div className="ml-2 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">FQ</span>
          </div>
        </div>
      </div>
    </header>
  );
}
