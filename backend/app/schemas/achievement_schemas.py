from datetime import datetime

from pydantic import BaseModel

from app.models.achievement_models import AchievementRarity


class AchievementCreate(BaseModel):
    name: str
    description: str
    icon: str = "star"
    xp_reward: int
    condition_type: str
    condition_value: int
    rarity: AchievementRarity


class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    xp_reward: int
    condition_type: str
    condition_value: int
    rarity: AchievementRarity

    model_config = {"from_attributes": True}


class UserAchievementResponse(BaseModel):
    id: int
    user_id: int
    achievement_id: int
    earned_at: datetime
    achievement: AchievementResponse

    model_config = {"from_attributes": True}


class AchievementCollectionResponse(BaseModel):
    earned: list[UserAchievementResponse]
    locked: list[AchievementResponse]
    total_earned: int
    total_available: int
