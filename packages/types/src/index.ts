// ─── User Types ──────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
}

export interface UserProfile extends User {
  total_workouts: number;
  total_quests_completed: number;
  total_achievements: number;
  xp_to_next_level: number;
  xp_progress_percent: number;
}

// ─── Auth Types ──────────────────────────────────────────────
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  name: string;
  email: string;
  level: number;
  total_xp: number;
}

// ─── Workout Types ───────────────────────────────────────────
export type WorkoutType = 'running' | 'cycling' | 'swimming' | 'gym' | 'yoga' | 'hiit' | 'other';

export interface Exercise {
  id: number;
  name: string;
  sets: number | null;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
}

export interface ExerciseCreate {
  name: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_seconds?: number;
}

export interface Workout {
  id: number;
  user_id: number;
  type: WorkoutType;
  duration_minutes: number;
  calories_burned: number | null;
  distance_km: number | null;
  notes: string | null;
  date: string;
  xp_earned: number;
  exercises: Exercise[];
  created_at: string;
}

export interface WorkoutCreate {
  type: WorkoutType;
  duration_minutes: number;
  calories_burned?: number;
  distance_km?: number;
  notes?: string;
  date: string;
  exercises?: ExerciseCreate[];
}

export interface WorkoutListResponse {
  workouts: Workout[];
  total: number;
  page: number;
  per_page: number;
}

export interface WeeklyStats {
  total_workouts: number;
  total_minutes: number;
  total_calories: number;
  total_xp: number;
  total_distance_km: number;
  workouts_by_type: Record<string, number>;
}

// ─── Quest Types ─────────────────────────────────────────────
export type QuestType = 'daily' | 'weekly' | 'monthly' | 'special';
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type QuestStatus = 'active' | 'completed' | 'failed' | 'expired';

export interface Quest {
  id: number;
  name: string;
  description: string;
  type: QuestType;
  target_value: number;
  target_unit: string;
  reward_xp: number;
  duration_days: number;
  icon: string;
  difficulty: QuestDifficulty;
  is_active: boolean;
}

export interface UserQuest {
  id: number;
  user_id: number;
  quest_id: number;
  progress: number;
  status: QuestStatus;
  started_at: string;
  completed_at: string | null;
  quest: Quest;
}

// ─── Achievement Types ───────────────────────────────────────
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  condition_type: string;
  condition_value: number;
  rarity: AchievementRarity;
}

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  earned_at: string;
  achievement: Achievement;
}

export interface AchievementCollection {
  earned: UserAchievement[];
  locked: Achievement[];
  total_earned: number;
  total_available: number;
}

// ─── Leaderboard Types ──────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  name: string;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total_users: number;
  current_user_rank: number | null;
}

// ─── Dashboard Types ─────────────────────────────────────────
export interface DashboardData {
  user_id: number;
  name: string;
  level: number;
  total_xp: number;
  xp_to_next_level: number;
  xp_progress_percent: number;
  current_streak: number;
  longest_streak: number;
  active_quests: UserQuest[];
  recent_workouts: Workout[];
  weekly_stats: WeeklyStats;
  total_achievements: number;
}
