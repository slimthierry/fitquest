from pydantic import BaseModel

from app.schemas.workout_schemas import WorkoutResponse, WeeklyStatsResponse
from app.schemas.quest_schemas import UserQuestResponse


class DashboardResponse(BaseModel):
    user_id: int
    name: str
    level: int
    total_xp: int
    xp_to_next_level: int
    xp_progress_percent: float
    current_streak: int
    longest_streak: int
    active_quests: list[UserQuestResponse]
    recent_workouts: list[WorkoutResponse]
    weekly_stats: WeeklyStatsResponse
    total_achievements: int
