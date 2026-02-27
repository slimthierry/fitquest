"""Background tasks for quest management.

These tasks handle automatic quest expiration and progress updates.
In production, these would be run via Celery with Redis as the broker.
"""

from datetime import datetime, timezone, timedelta

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.quest_models import UserQuest, QuestStatus


async def expire_overdue_quests(db: AsyncSession) -> int:
    """Mark active quests as expired if they have exceeded their duration.

    Returns the number of quests expired.
    """
    now = datetime.now(timezone.utc)

    result = await db.execute(
        select(UserQuest).where(UserQuest.status == QuestStatus.ACTIVE)
    )
    active_quests = result.scalars().all()

    expired_count = 0
    for user_quest in active_quests:
        quest = user_quest.quest
        if quest and user_quest.started_at:
            expiry = user_quest.started_at + timedelta(days=quest.duration_days)
            if now > expiry:
                user_quest.status = QuestStatus.EXPIRED
                expired_count += 1

    await db.flush()
    return expired_count


async def auto_progress_workout_quests(
    db: AsyncSession, user_id: int, workout_type: str, duration_minutes: int
) -> list[int]:
    """Automatically update quest progress when a workout is logged.

    Returns list of user_quest_ids that were updated.
    """
    result = await db.execute(
        select(UserQuest)
        .where(
            and_(
                UserQuest.user_id == user_id,
                UserQuest.status == QuestStatus.ACTIVE,
            )
        )
    )
    active_quests = result.scalars().all()

    updated_ids = []
    for user_quest in active_quests:
        quest = user_quest.quest
        if not quest:
            continue

        if quest.target_unit == "minutes":
            user_quest.progress += duration_minutes
            updated_ids.append(user_quest.id)
        elif quest.target_unit == "workouts":
            user_quest.progress += 1
            updated_ids.append(user_quest.id)

    await db.flush()
    return updated_ids
