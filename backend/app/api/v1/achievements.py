from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_models import User
from app.schemas.achievement_schemas import AchievementCollectionResponse, UserAchievementResponse
from app.services.achievement_service import AchievementService

router = APIRouter()


@router.get("", response_model=AchievementCollectionResponse)
async def get_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AchievementService(db)
    return await service.get_collection(current_user)


@router.post("/check", response_model=list[UserAchievementResponse])
async def check_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AchievementService(db)
    return await service.check_achievements(current_user)
