from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_models import User
from app.models.quest_models import QuestStatus
from app.schemas.quest_schemas import (
    QuestResponse,
    UserQuestResponse,
    AcceptQuestRequest,
    QuestProgressUpdate,
)
from app.services.quest_service import QuestService

router = APIRouter()


@router.get("/available", response_model=list[QuestResponse])
async def list_available_quests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = QuestService(db)
    return await service.list_available_quests()


@router.post("/accept", response_model=UserQuestResponse, status_code=201)
async def accept_quest(
    data: AcceptQuestRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = QuestService(db)
    return await service.accept_quest(current_user, data.quest_id)


@router.get("/my", response_model=list[UserQuestResponse])
async def get_my_quests(
    status: QuestStatus | None = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = QuestService(db)
    return await service.get_user_quests(current_user, status)


@router.patch("/{user_quest_id}/progress", response_model=UserQuestResponse)
async def update_quest_progress(
    user_quest_id: int,
    data: QuestProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = QuestService(db)
    return await service.update_quest_progress(current_user, user_quest_id, data)
