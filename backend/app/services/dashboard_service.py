from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_models import User
from app.models.achievement_models import UserAchievement
from app.schemas.dashboard_schemas import DashboardResponse
from app.services.workout_service import WorkoutService
from app.services.quest_service import QuestService
from app.utils.level_system import xp_for_level, xp_progress_in_level


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.workout_service = WorkoutService(db)
        self.quest_service = QuestService(db)

    async def get_dashboard(self, user: User) -> DashboardResponse:
        active_quests = await self.quest_service.get_active_quests(user, limit=3)

        workout_list = await self.workout_service.list_workouts(user, page=1, per_page=5)
        recent_workouts = workout_list.workouts

        weekly_stats = await self.workout_service.get_weekly_stats(user)

        achievement_count_result = await self.db.execute(
            select(func.count()).where(UserAchievement.user_id == user.id)
        )
        total_achievements = achievement_count_result.scalar()

        xp_needed = xp_for_level(user.level)
        progress = xp_progress_in_level(user.total_xp, user.level)

        return DashboardResponse(
            user_id=user.id,
            name=user.name,
            level=user.level,
            total_xp=user.total_xp,
            xp_to_next_level=xp_needed,
            xp_progress_percent=progress,
            current_streak=user.current_streak,
            longest_streak=user.longest_streak,
            active_quests=active_quests,
            recent_workouts=recent_workouts,
            weekly_stats=weekly_stats,
            total_achievements=total_achievements,
        )
