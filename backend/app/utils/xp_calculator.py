from app.config.settings import settings


def calculate_workout_xp(duration_minutes: int, streak_bonus: float = 0.0) -> int:
    """Calculate XP earned from a workout.

    Base XP: 10 XP per minute
    Streak bonus: additional percentage based on current streak
    """
    base_xp = duration_minutes * settings.XP_PER_MINUTE
    bonus_xp = int(base_xp * streak_bonus)
    return base_xp + bonus_xp


def calculate_quest_completion_xp(reward_xp: int, difficulty_multiplier: float = 1.0) -> int:
    """Calculate XP earned from completing a quest."""
    return int(reward_xp * difficulty_multiplier)
