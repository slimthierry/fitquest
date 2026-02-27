"""Background tasks for streak management.

Handles daily streak checks and resets for users who missed a day.
"""

from datetime import date, timedelta

from sqlalchemy import select, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_models import User
from app.models.workout_models import Workout


async def reset_broken_streaks(db: AsyncSession) -> int:
    """Reset streaks for users who did not work out yesterday.

    Should be run daily, typically early morning.
    Returns the number of users whose streaks were reset.
    """
    yesterday = date.today() - timedelta(days=1)

    users_result = await db.execute(
        select(User).where(User.current_streak > 0)
    )
    active_streak_users = users_result.scalars().all()

    reset_count = 0
    for user in active_streak_users:
        workout_result = await db.execute(
            select(func.count()).where(
                and_(
                    Workout.user_id == user.id,
                    Workout.date == yesterday,
                )
            )
        )
        workout_count = workout_result.scalar()

        if workout_count == 0:
            user.current_streak = 0
            reset_count += 1

    await db.flush()
    return reset_count


async def calculate_user_streak(db: AsyncSession, user_id: int) -> int:
    """Recalculate the current streak for a specific user by checking consecutive days."""
    current_date = date.today()
    streak = 0

    while True:
        result = await db.execute(
            select(func.count()).where(
                and_(
                    Workout.user_id == user_id,
                    Workout.date == current_date,
                )
            )
        )
        count = result.scalar()

        if count > 0:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break

    return streak
