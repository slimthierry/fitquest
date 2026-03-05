import { useState } from 'react';
import {
  Plus,
  Dumbbell,
  Calendar,
  Timer,
  Zap,
  MapPin,
  X,
  Filter,
} from 'lucide-react';

const workoutTypes = [
  { value: 'running', label: 'Running' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'other', label: 'Other' },
];

const mockWorkouts = [
  { id: 1, type: 'running', duration: 45, calories: 420, distance: 5.2, xp: 450, date: '2024-12-10', notes: 'Morning run in the park' },
  { id: 2, type: 'gym', duration: 60, calories: 580, distance: null, xp: 600, date: '2024-12-09', notes: 'Upper body day' },
  { id: 3, type: 'yoga', duration: 30, calories: 150, distance: null, xp: 300, date: '2024-12-09', notes: 'Evening flow' },
  { id: 4, type: 'hiit', duration: 25, calories: 350, distance: null, xp: 250, date: '2024-12-08', notes: 'Tabata workout' },
  { id: 5, type: 'cycling', duration: 90, calories: 720, distance: 28.5, xp: 900, date: '2024-12-07', notes: 'Long weekend ride' },
  { id: 6, type: 'swimming', duration: 40, calories: 380, distance: 1.5, xp: 400, date: '2024-12-06', notes: 'Pool laps' },
];

export default function WorkoutsPage() {
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = filterType === 'all'
    ? mockWorkouts
    : mockWorkouts.filter((w) => w.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Workouts</h1>
          <p className="text-body mt-1">Log and track your workout history</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Log Workout'}
        </button>
      </div>

      {/* New Workout Form */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-heading mb-4">Log New Workout</h2>
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Type</label>
              <select className="input-field">
                {workoutTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Duration (min)</label>
              <input type="number" placeholder="30" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Calories Burned</label>
              <input type="number" placeholder="300" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Distance (km)</label>
              <input type="number" step="0.1" placeholder="5.0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Date</label>
              <input type="date" className="input-field" />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-body mb-1.5">Notes</label>
              <input type="text" placeholder="How was your workout?" className="input-field" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <button type="submit" className="btn-primary">
                Save Workout
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted" />
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'text-white'
              : 'text-body surface-tertiary hover:surface-secondary'
          }`}
          style={filterType === 'all' ? { backgroundColor: 'var(--color-brand)' } : {}}
        >
          All
        </button>
        {workoutTypes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterType(value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === value
                ? 'text-white'
                : 'text-body surface-tertiary hover:surface-secondary'
            }`}
            style={filterType === value ? { backgroundColor: 'var(--color-brand)' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Workout History */}
      <div className="space-y-3">
        {filtered.map((workout) => (
          <div key={workout.id} className="card !p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: 'var(--color-brand-light)' }}
                >
                  <Dumbbell className="h-6 w-6" style={{ color: 'var(--color-brand)' }} />
                </div>
                <div>
                  <p className="text-base font-semibold text-heading capitalize">{workout.type}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Calendar className="h-3 w-3" /> {workout.date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Timer className="h-3 w-3" /> {workout.duration} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Zap className="h-3 w-3" /> {workout.calories} cal
                    </span>
                    {workout.distance && (
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MapPin className="h-3 w-3" /> {workout.distance} km
                      </span>
                    )}
                  </div>
                  {workout.notes && (
                    <p className="text-sm text-caption mt-1">{workout.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold" style={{ color: 'var(--color-xp)' }}>
                  +{workout.xp}
                </span>
                <p className="text-xs text-muted">XP</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
