from datetime import datetime, timezone

from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.user_models import User
from app.models.workout_models import Workout
from app.models.achievement_models import Achievement, UserAchievement
from app.schemas.achievement_schemas import (
    AchievementResponse,
    UserAchievementResponse,
    AchievementCollectionResponse,
)
from app.services.xp_service import XPService


class AchievementService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.xp_service = XPService(db)

    async def get_collection(self, user: User) -> AchievementCollectionResponse:
        all_result = await self.db.execute(select(Achievement))
        all_achievements = all_result.scalars().all()

        earned_result = await self.db.execute(
            select(UserAchievement)
            .options(selectinload(UserAchievement.achievement))
            .where(UserAchievement.user_id == user.id)
        )
        earned = earned_result.scalars().all()

        earned_ids = {ua.achievement_id for ua in earned}
        locked = [a for a in all_achievements if a.id not in earned_ids]

        return AchievementCollectionResponse(
            earned=[UserAchievementResponse.model_validate(ua) for ua in earned],
            locked=[AchievementResponse.model_validate(a) for a in locked],
            total_earned=len(earned),
            total_available=len(all_achievements),
        )

    async def check_achievements(self, user: User) -> list[UserAchievementResponse]:
        all_result = await self.db.execute(select(Achievement))
        all_achievements = all_result.scalars().all()

        earned_result = await self.db.execute(
            select(UserAchievement).where(UserAchievement.user_id == user.id)
        )
        earned_ids = {ua.achievement_id for ua in earned_result.scalars().all()}

        newly_earned = []

        for achievement in all_achievements:
            if achievement.id in earned_ids:
                continue

            if await self._check_condition(user, achievement):
                user_achievement = UserAchievement(
                    user_id=user.id,
                    achievement_id=achievement.id,
                    earned_at=datetime.now(timezone.utc),
                )
                self.db.add(user_achievement)
                await self.db.flush()
                await self.db.refresh(user_achievement)

                await self.xp_service.award_achievement_xp(user, achievement.xp_reward)

                result = await self.db.execute(
                    select(UserAchievement)
                    .options(selectinload(UserAchievement.achievement))
                    .where(UserAchievement.id == user_achievement.id)
                )
                ua = result.scalar_one()
                newly_earned.append(UserAchievementResponse.model_validate(ua))

        return newly_earned

    async def _check_condition(self, user: User, achievement: Achievement) -> bool:
        condition = achievement.condition_type
        value = achievement.condition_value

        if condition == "total_workouts":
            result = await self.db.execute(
                select(func.count()).where(Workout.user_id == user.id)
            )
            count = result.scalar()
            return count >= value

        elif condition == "total_xp":
            return user.total_xp >= value

        elif condition == "level":
            return user.level >= value

        elif condition == "current_streak":
            return user.current_streak >= value

        elif condition == "longest_streak":
            return user.longest_streak >= value

        elif condition == "total_minutes":
            result = await self.db.execute(
                select(func.sum(Workout.duration_minutes)).where(Workout.user_id == user.id)
            )
            total = result.scalar() or 0
            return total >= value

        return False
