from datetime import datetime, timezone

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.exceptions import NotFoundException, BadRequestException
from app.models.user_models import User
from app.models.quest_models import Quest, UserQuest, QuestStatus
from app.schemas.quest_schemas import QuestResponse, UserQuestResponse, QuestProgressUpdate
from app.services.xp_service import XPService


class QuestService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.xp_service = XPService(db)

    async def list_available_quests(self) -> list[QuestResponse]:
        result = await self.db.execute(
            select(Quest).where(Quest.is_active == True).order_by(Quest.difficulty)
        )
        quests = result.scalars().all()
        return [QuestResponse.model_validate(q) for q in quests]

    async def accept_quest(self, user: User, quest_id: int) -> UserQuestResponse:
        result = await self.db.execute(select(Quest).where(Quest.id == quest_id))
        quest = result.scalar_one_or_none()

        if not quest:
            raise NotFoundException("Quest not found")

        if not quest.is_active:
            raise BadRequestException("Quest is not currently active")

        existing = await self.db.execute(
            select(UserQuest).where(
                and_(
                    UserQuest.user_id == user.id,
                    UserQuest.quest_id == quest_id,
                    UserQuest.status == QuestStatus.ACTIVE,
                )
            )
        )
        if existing.scalar_one_or_none():
            raise BadRequestException("You already have this quest active")

        user_quest = UserQuest(
            user_id=user.id,
            quest_id=quest_id,
            progress=0,
            status=QuestStatus.ACTIVE,
            started_at=datetime.now(timezone.utc),
        )
        self.db.add(user_quest)
        await self.db.flush()

        result = await self.db.execute(
            select(UserQuest)
            .options(selectinload(UserQuest.quest))
            .where(UserQuest.id == user_quest.id)
        )
        user_quest = result.scalar_one()

        return UserQuestResponse.model_validate(user_quest)

    async def get_user_quests(
        self, user: User, status: QuestStatus | None = None
    ) -> list[UserQuestResponse]:
        query = select(UserQuest).options(selectinload(UserQuest.quest)).where(
            UserQuest.user_id == user.id
        )

        if status:
            query = query.where(UserQuest.status == status)

        result = await self.db.execute(query.order_by(UserQuest.started_at.desc()))
        user_quests = result.scalars().all()

        return [UserQuestResponse.model_validate(uq) for uq in user_quests]

    async def update_quest_progress(
        self, user: User, user_quest_id: int, data: QuestProgressUpdate
    ) -> UserQuestResponse:
        result = await self.db.execute(
            select(UserQuest)
            .options(selectinload(UserQuest.quest))
            .where(
                and_(
                    UserQuest.id == user_quest_id,
                    UserQuest.user_id == user.id,
                    UserQuest.status == QuestStatus.ACTIVE,
                )
            )
        )
        user_quest = result.scalar_one_or_none()

        if not user_quest:
            raise NotFoundException("Active quest not found")

        user_quest.progress = data.progress

        if user_quest.progress >= user_quest.quest.target_value:
            user_quest.status = QuestStatus.COMPLETED
            user_quest.completed_at = datetime.now(timezone.utc)
            await self.xp_service.award_quest_xp(user, user_quest.quest.reward_xp)

        await self.db.flush()
        await self.db.refresh(user_quest)

        return UserQuestResponse.model_validate(user_quest)

    async def get_active_quests(self, user: User, limit: int = 3) -> list[UserQuestResponse]:
        result = await self.db.execute(
            select(UserQuest)
            .options(selectinload(UserQuest.quest))
            .where(
                and_(
                    UserQuest.user_id == user.id,
                    UserQuest.status == QuestStatus.ACTIVE,
                )
            )
            .order_by(UserQuest.started_at.desc())
            .limit(limit)
        )
        user_quests = result.scalars().all()
        return [UserQuestResponse.model_validate(uq) for uq in user_quests]
