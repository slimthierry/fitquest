import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  User,
  Workout,
  WorkoutCreate,
  WorkoutListResponse,
  WeeklyStats,
  Quest,
  UserQuest,
  AchievementCollection,
  LeaderboardResponse,
  DashboardData,
} from '@fitquest/types';

const BASE_URL = '/api/v1';

class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  return localStorage.getItem('fitquest-token');
}

function setToken(token: string): void {
  localStorage.setItem('fitquest-token', token);
}

function clearToken(): void {
  localStorage.removeItem('fitquest-token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new ApiError(response.status, error.detail || 'An error occurred');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ─── Auth ────────────────────────────────────────────────────
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setToken(res.access_token);
  return res;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setToken(res.access_token);
  return res;
}

export function logout(): void {
  clearToken();
}

export async function getMe(): Promise<User> {
  return request<User>('/auth/me');
}

// ─── Workouts ────────────────────────────────────────────────
export async function createWorkout(data: WorkoutCreate): Promise<Workout> {
  return request<Workout>('/workouts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listWorkouts(
  page: number = 1,
  perPage: number = 20,
  workoutType?: string
): Promise<WorkoutListResponse> {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  if (workoutType) params.set('workout_type', workoutType);
  return request<WorkoutListResponse>(`/workouts?${params}`);
}

export async function getWorkout(id: number): Promise<Workout> {
  return request<Workout>(`/workouts/${id}`);
}

export async function deleteWorkout(id: number): Promise<void> {
  return request<void>(`/workouts/${id}`, { method: 'DELETE' });
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  return request<WeeklyStats>('/workouts/weekly-stats');
}

// ─── Quests ──────────────────────────────────────────────────
export async function getAvailableQuests(): Promise<Quest[]> {
  return request<Quest[]>('/quests/available');
}

export async function acceptQuest(questId: number): Promise<UserQuest> {
  return request<UserQuest>('/quests/accept', {
    method: 'POST',
    body: JSON.stringify({ quest_id: questId }),
  });
}

export async function getMyQuests(status?: string): Promise<UserQuest[]> {
  const params = status ? `?status=${status}` : '';
  return request<UserQuest[]>(`/quests/my${params}`);
}

export async function updateQuestProgress(
  userQuestId: number,
  progress: number
): Promise<UserQuest> {
  return request<UserQuest>(`/quests/${userQuestId}/progress`, {
    method: 'PATCH',
    body: JSON.stringify({ progress }),
  });
}

// ─── Achievements ────────────────────────────────────────────
export async function getAchievements(): Promise<AchievementCollection> {
  return request<AchievementCollection>('/achievements');
}

export async function checkAchievements(): Promise<void> {
  return request<void>('/achievements/check', { method: 'POST' });
}

// ─── Leaderboard ─────────────────────────────────────────────
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardResponse> {
  return request<LeaderboardResponse>(`/leaderboard?limit=${limit}`);
}

// ─── Dashboard ───────────────────────────────────────────────
export async function getDashboard(): Promise<DashboardData> {
  return request<DashboardData>('/dashboard');
}

export { ApiError, getToken, setToken, clearToken };
