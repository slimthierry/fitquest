from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings
from app.models.user_models import User
from app.utils.xp_calculator import calculate_workout_xp
from app.utils.level_system import calculate_level_from_xp


class XPService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def award_workout_xp(self, user: User, duration_minutes: int) -> int:
        streak_bonus = min(
            user.current_streak * settings.STREAK_BONUS_MULTIPLIER,
            settings.MAX_STREAK_BONUS,
        )
        xp = calculate_workout_xp(duration_minutes, streak_bonus)

        user.total_xp += xp
        new_level = calculate_level_from_xp(user.total_xp)
        user.level = new_level

        await self.db.flush()
        return xp

    async def award_quest_xp(self, user: User, reward_xp: int) -> int:
        user.total_xp += reward_xp
        new_level = calculate_level_from_xp(user.total_xp)
        user.level = new_level

        await self.db.flush()
        return reward_xp

    async def award_achievement_xp(self, user: User, xp_reward: int) -> int:
        user.total_xp += xp_reward
        new_level = calculate_level_from_xp(user.total_xp)
        user.level = new_level

        await self.db.flush()
        return xp_reward
